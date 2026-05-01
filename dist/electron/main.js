"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_fs_1 = __importDefault(require("node:fs"));
const node_http_1 = __importDefault(require("node:http"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const node_url_1 = require("node:url");
const electron_updater_1 = require("electron-updater");
const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const isTest = Boolean(process.env.PLAYWRIGHT_TEST);
const DEFAULT_LAN_PORT = 38741;
const LAN_CONFIG_FILE = "lan-bridge-config.json";
const LAN_CLIENT_NAME = node_os_1.default.hostname();
const APP_PROTOCOL = "fdapp";
electron_1.protocol.registerSchemesAsPrivileged([
    {
        scheme: APP_PROTOCOL,
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            stream: true
        }
    }
]);
let mainWindow = null;
let lanServer = null;
let lanConfig = { mode: "off", host: "", port: DEFAULT_LAN_PORT, token: "" };
let hostSnapshot = null;
let clientPollTimer = null;
let flushQueueTimer = null;
let lastLanError = null;
let lastSyncAt = null;
let connectedClients = new Map();
let queuedEvents = [];
function lanConfigPath() {
    return node_path_1.default.join(electron_1.app.getPath("userData"), LAN_CONFIG_FILE);
}
async function readLanConfig() {
    try {
        const fs = await Promise.resolve().then(() => __importStar(require("node:fs/promises")));
        const raw = await fs.readFile(lanConfigPath(), "utf8");
        const parsed = JSON.parse(raw);
        lanConfig = {
            mode: parsed.mode === "host" || parsed.mode === "client" ? parsed.mode : "off",
            host: typeof parsed.host === "string" ? parsed.host : "",
            port: typeof parsed.port === "number" ? parsed.port : DEFAULT_LAN_PORT,
            token: typeof parsed.token === "string" ? parsed.token : ""
        };
    }
    catch {
        lanConfig = { mode: "off", host: "", port: DEFAULT_LAN_PORT, token: "" };
    }
}
async function writeLanConfig() {
    const fs = await Promise.resolve().then(() => __importStar(require("node:fs/promises")));
    await fs.mkdir(electron_1.app.getPath("userData"), { recursive: true });
    await fs.writeFile(lanConfigPath(), JSON.stringify(lanConfig, null, 2), "utf8");
}
function localLanUrls(port) {
    const urls = new Set();
    const interfaces = node_os_1.default.networkInterfaces();
    Object.values(interfaces).flat().forEach((entry) => {
        if (!entry || entry.internal || entry.family !== "IPv4") {
            return;
        }
        urls.add(`http://${entry.address}:${port}`);
    });
    urls.add(`http://127.0.0.1:${port}`);
    return [...urls];
}
function emitLanStatus() {
    const status = getLanStatus();
    electron_1.BrowserWindow.getAllWindows().forEach((win) => win.webContents.send("lan:status", status));
    return status;
}
function getLanStatus() {
    return {
        ...lanConfig,
        running: lanConfig.mode === "host" ? !!lanServer : lanConfig.mode === "client" ? !!clientPollTimer : false,
        reachableUrls: lanConfig.mode === "host" ? localLanUrls(lanConfig.port) : [],
        connectedClients: [...connectedClients.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt),
        lastError: lastLanError,
        lastSyncAt,
        queuedEvents: queuedEvents.length
    };
}
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 2000000) {
                reject(new Error("Request body too large."));
                req.destroy();
            }
        });
        req.on("end", () => {
            try {
                resolve(raw ? JSON.parse(raw) : null);
            }
            catch (error) {
                reject(error);
            }
        });
        req.on("error", reject);
    });
}
function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
    });
    res.end(JSON.stringify(body));
}
function requestToken(req, body) {
    const header = req.headers.authorization;
    if (typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
        return header.slice(7).trim();
    }
    if (body && typeof body === "object" && "token" in body && typeof body.token === "string") {
        return body.token;
    }
    const reqUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    return reqUrl.searchParams.get("token") ?? "";
}
function authorizeLanRequest(req, body) {
    return Boolean(lanConfig.token) && requestToken(req, body) === lanConfig.token;
}
function touchClient(req, name) {
    const address = req.socket.remoteAddress?.replace(/^::ffff:/, "") ?? "unknown";
    const id = `${name}::${address}`;
    const existing = connectedClients.get(id);
    connectedClients.set(id, {
        id,
        name,
        address,
        lastSeenAt: Date.now(),
        eventCount: (existing?.eventCount ?? 0) + 1
    });
}
async function handleLanRequest(req, res) {
    if (req.method === "GET" && req.url?.startsWith("/api/status")) {
        sendJson(res, 200, { ok: true, app: "fiduciary-duty-lan", port: lanConfig.port });
        return;
    }
    if (req.method === "GET" && req.url?.startsWith("/api/snapshot")) {
        if (!authorizeLanRequest(req, null)) {
            sendJson(res, 401, { error: "Unauthorized" });
            return;
        }
        touchClient(req, "snapshot-client");
        sendJson(res, 200, hostSnapshot ?? { users: [], trainees: [], trainingAssignments: [], trainingReports: [], updatedAt: Date.now() });
        emitLanStatus();
        return;
    }
    if (req.method !== "POST") {
        sendJson(res, 404, { error: "Not found" });
        return;
    }
    let body;
    try {
        body = await parseJsonBody(req);
    }
    catch {
        sendJson(res, 400, { error: "Invalid JSON" });
        return;
    }
    if (!authorizeLanRequest(req, body)) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
    }
    if (req.url === "/api/telemetry") {
        const payload = body;
        if (!payload.traineeId || typeof payload.total !== "number" || typeof payload.correct !== "number") {
            sendJson(res, 400, { error: "Invalid telemetry" });
            return;
        }
        const event = {
            id: typeof payload.id === "string" ? payload.id : (0, node_crypto_1.randomBytes)(12).toString("hex"),
            traineeId: payload.traineeId,
            moduleId: typeof payload.moduleId === "string" ? payload.moduleId : null,
            correct: payload.correct,
            total: payload.total,
            pct: typeof payload.pct === "number" ? payload.pct : payload.total === 0 ? 0 : Math.round((payload.correct / payload.total) * 100),
            updatedAt: typeof payload.updatedAt === "number" ? payload.updatedAt : Date.now(),
            clientName: payload.clientName ?? LAN_CLIENT_NAME
        };
        touchClient(req, event.clientName);
        mainWindow?.webContents.send("lan:telemetry", event);
        lastSyncAt = Date.now();
        sendJson(res, 200, { ok: true });
        emitLanStatus();
        return;
    }
    if (req.url === "/api/report") {
        const payload = body;
        if (!payload.report || typeof payload.report !== "object") {
            sendJson(res, 400, { error: "Invalid report" });
            return;
        }
        const event = {
            id: typeof payload.id === "string" ? payload.id : (0, node_crypto_1.randomBytes)(12).toString("hex"),
            report: payload.report,
            clientName: payload.clientName ?? LAN_CLIENT_NAME,
            updatedAt: typeof payload.updatedAt === "number" ? payload.updatedAt : Date.now()
        };
        touchClient(req, event.clientName);
        mainWindow?.webContents.send("lan:report", event);
        lastSyncAt = Date.now();
        sendJson(res, 200, { ok: true });
        emitLanStatus();
        return;
    }
    sendJson(res, 404, { error: "Not found" });
}
async function startLanHost(port, token) {
    await stopLanBridge(false);
    lanConfig = {
        mode: "host",
        host: "0.0.0.0",
        port: Number.isFinite(port) ? Math.max(1024, Math.min(65535, Math.round(port))) : DEFAULT_LAN_PORT,
        token: token?.trim() || (0, node_crypto_1.randomBytes)(18).toString("hex")
    };
    lanServer = node_http_1.default.createServer((req, res) => {
        void handleLanRequest(req, res).catch((error) => {
            lastLanError = error instanceof Error ? error.message : "LAN server error";
            sendJson(res, 500, { error: "Server error" });
            emitLanStatus();
        });
    });
    await new Promise((resolve, reject) => {
        lanServer?.once("error", reject);
        lanServer?.listen(lanConfig.port, "0.0.0.0", () => resolve());
    });
    await writeLanConfig();
    lastLanError = null;
    return emitLanStatus();
}
async function postToHost(pathname, payload) {
    const endpoint = `http://${lanConfig.host}:${lanConfig.port}${pathname}`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${lanConfig.token}`
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`Host returned ${response.status}`);
    }
}
async function pollHostSnapshot() {
    if (lanConfig.mode !== "client" || !lanConfig.host || !lanConfig.token) {
        return;
    }
    try {
        const endpoint = `http://${lanConfig.host}:${lanConfig.port}/api/snapshot?token=${encodeURIComponent(lanConfig.token)}`;
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Snapshot returned ${response.status}`);
        }
        const snapshot = await response.json();
        lastLanError = null;
        lastSyncAt = Date.now();
        mainWindow?.webContents.send("lan:snapshot", snapshot);
        emitLanStatus();
    }
    catch (error) {
        lastLanError = error instanceof Error ? error.message : "Unable to reach LAN host";
        emitLanStatus();
    }
}
async function flushQueuedEvents() {
    if (lanConfig.mode !== "client" || queuedEvents.length === 0) {
        return;
    }
    const remaining = [];
    for (const event of queuedEvents) {
        try {
            await postToHost(event.kind === "telemetry" ? "/api/telemetry" : "/api/report", event.payload);
            lastSyncAt = Date.now();
            lastLanError = null;
        }
        catch (error) {
            lastLanError = error instanceof Error ? error.message : "Unable to send LAN event";
            remaining.push(event);
        }
    }
    queuedEvents = remaining.slice(-500);
    emitLanStatus();
}
function startClientTimers() {
    if (clientPollTimer) {
        clearInterval(clientPollTimer);
    }
    if (flushQueueTimer) {
        clearInterval(flushQueueTimer);
    }
    clientPollTimer = setInterval(() => void pollHostSnapshot(), 3000);
    flushQueueTimer = setInterval(() => void flushQueuedEvents(), 2500);
    void pollHostSnapshot();
}
async function configureLanClient(input) {
    await stopLanBridge(false);
    lanConfig = {
        mode: "client",
        host: input.host.trim(),
        port: Number.isFinite(input.port) ? Math.max(1024, Math.min(65535, Math.round(input.port))) : DEFAULT_LAN_PORT,
        token: input.token.trim()
    };
    await writeLanConfig();
    startClientTimers();
    return emitLanStatus();
}
async function stopLanBridge(persist = true) {
    if (clientPollTimer) {
        clearInterval(clientPollTimer);
        clientPollTimer = null;
    }
    if (flushQueueTimer) {
        clearInterval(flushQueueTimer);
        flushQueueTimer = null;
    }
    if (lanServer) {
        await new Promise((resolve) => lanServer?.close(() => resolve()));
        lanServer = null;
    }
    connectedClients = new Map();
    if (persist) {
        lanConfig = { mode: "off", host: "", port: lanConfig.port || DEFAULT_LAN_PORT, token: "" };
        await writeLanConfig();
    }
    return emitLanStatus();
}
async function restoreLanBridge() {
    await readLanConfig();
    if (lanConfig.mode === "host") {
        try {
            await startLanHost(lanConfig.port, lanConfig.token);
        }
        catch (error) {
            lastLanError = error instanceof Error ? error.message : "Unable to restore LAN host";
            emitLanStatus();
        }
    }
    else if (lanConfig.mode === "client") {
        startClientTimers();
        emitLanStatus();
    }
}
function configureAutoUpdates() {
    if (isDev) {
        return;
    }
    const feedUrl = process.env.AUTO_UPDATE_URL;
    if (feedUrl) {
        try {
            const parsedFeedUrl = new URL(feedUrl);
            if (parsedFeedUrl.protocol === "https:") {
                electron_updater_1.autoUpdater.setFeedURL({ provider: "generic", url: parsedFeedUrl.toString() });
            }
        }
        catch {
            return;
        }
    }
    void electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
}
function writeStartupLog(message, detail) {
    const line = `[${new Date().toISOString()}] ${message}${detail ? ` ${typeof detail === "string" ? detail : JSON.stringify(detail)}` : ""}\n`;
    console.log(line.trim());
    try {
        const logsDir = node_path_1.default.join(electron_1.app.getPath("userData"), "logs");
        node_fs_1.default.mkdirSync(logsDir, { recursive: true });
        node_fs_1.default.appendFileSync(node_path_1.default.join(logsDir, "startup.log"), line, "utf8");
    }
    catch {
        // Logging must never block app startup.
    }
}
function rendererRootPath() {
    return node_path_1.default.join(electron_1.app.getAppPath(), "dist", "renderer");
}
function registerRendererProtocol() {
    if (isDev) {
        return;
    }
    electron_1.protocol.handle(APP_PROTOCOL, (request) => {
        const requestUrl = new URL(request.url);
        const requestedPath = decodeURIComponent(requestUrl.pathname.replace(/^\/+/, "")) || "index.html";
        const rendererRoot = rendererRootPath();
        const resolvedPath = node_path_1.default.resolve(rendererRoot, requestedPath);
        const normalizedRoot = node_path_1.default.resolve(rendererRoot).toLowerCase();
        if (!resolvedPath.toLowerCase().startsWith(normalizedRoot)) {
            writeStartupLog("Blocked renderer protocol path traversal", request.url);
            return new Response("Not found", { status: 404 });
        }
        return electron_1.net.fetch((0, node_url_1.pathToFileURL)(resolvedPath).toString());
    });
}
function getAutoWindowSize(display) {
    const workArea = display.workAreaSize;
    return {
        width: Math.max(1280, Math.min(1920, workArea.width)),
        height: Math.max(720, Math.min(1080, workArea.height))
    };
}
function applyWindowResolution(win, width, height) {
    const display = electron_1.screen.getDisplayMatching(win.getBounds());
    const workArea = display.workAreaSize;
    if (width === null || height === null) {
        const autoSize = getAutoWindowSize(display);
        win.unmaximize();
        win.setContentSize(autoSize.width, autoSize.height);
        win.center();
        if (workArea.width <= 1280 || workArea.height <= 720) {
            win.maximize();
        }
        return;
    }
    const clampedWidth = Math.max(800, Math.min(width, workArea.width));
    const clampedHeight = Math.max(600, Math.min(height, workArea.height));
    win.unmaximize();
    win.setContentSize(clampedWidth, clampedHeight);
    win.center();
}
function createWindow() {
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const workArea = primaryDisplay.workAreaSize;
    const autoSize = getAutoWindowSize(primaryDisplay);
    const win = new electron_1.BrowserWindow({
        width: autoSize.width,
        height: autoSize.height,
        minWidth: Math.min(800, workArea.width),
        minHeight: Math.min(600, workArea.height),
        useContentSize: true,
        backgroundColor: "#07111f",
        title: "FIDUCIARY DUTY",
        autoHideMenuBar: true,
        show: isTest ? true : false,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            sandbox: false,
            webSecurity: false,
            allowRunningInsecureContent: false,
            devTools: isDev || isTest
        }
    });
    const showWindow = () => {
        if (win.isDestroyed() || win.isVisible()) {
            return;
        }
        if (workArea.width <= 1280 || workArea.height <= 720) {
            win.maximize();
        }
        win.show();
    };
    if (!isDev) {
        writeStartupLog("Packaged renderer startup", {
            appPath: electron_1.app.getAppPath(),
            rendererRoot: rendererRootPath()
        });
    }
    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
        writeStartupLog("Renderer console", { level, message, line, sourceId });
    });
    win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
        writeStartupLog("Renderer failed to load", { errorCode, errorDescription, validatedURL });
        showWindow();
    });
    win.webContents.on("render-process-gone", (_event, details) => {
        writeStartupLog("Renderer process gone", details);
        showWindow();
    });
    win.webContents.on("preload-error", (_event, preloadPath, error) => {
        writeStartupLog("Preload failed", { preloadPath, message: error.message, stack: error.stack });
        showWindow();
    });
    win.webContents.on("will-navigate", (event) => {
        event.preventDefault();
    });
    win.webContents.on("will-attach-webview", (event) => {
        event.preventDefault();
    });
    win.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
        callback(false);
    });
    mainWindow = win;
    win.on("closed", () => {
        if (mainWindow === win) {
            mainWindow = null;
        }
    });
    if (!isTest) {
        win.once("ready-to-show", () => {
            showWindow();
        });
        setTimeout(showWindow, 3000);
    }
    if (isDev) {
        void win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        void win.loadURL(`${APP_PROTOCOL}://renderer/index.html`).catch((error) => {
            writeStartupLog("Renderer loadURL failed", { message: error.message, stack: error.stack });
            showWindow();
        });
    }
}
electron_1.app.whenReady().then(() => {
    registerRendererProtocol();
    createWindow();
    configureAutoUpdates();
    void restoreLanBridge();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.on("close-app", () => electron_1.app.quit());
electron_1.ipcMain.on("minimize-app", (event) => {
    electron_1.BrowserWindow.fromWebContents(event.sender)?.minimize();
});
electron_1.ipcMain.on("maximize-app", (event) => {
    const win = electron_1.BrowserWindow.fromWebContents(event.sender);
    if (!win) {
        return;
    }
    if (win.isMaximized()) {
        win.unmaximize();
        return;
    }
    win.maximize();
});
electron_1.ipcMain.handle("set-resolution", (event, width, height) => {
    const win = electron_1.BrowserWindow.fromWebContents(event.sender);
    if (!win) {
        return;
    }
    applyWindowResolution(win, width, height);
});
// ─── Report Export ────────────────────────────────────────────────────────────
electron_1.ipcMain.handle("export:trainee-report", async (_event, payload) => {
    try {
        const fsPromises = await Promise.resolve().then(() => __importStar(require("node:fs/promises")));
        const { shell } = await Promise.resolve().then(() => __importStar(require("electron")));
        const reportsDir = node_path_1.default.join(electron_1.app.getPath("userData"), "reports");
        await fsPromises.mkdir(reportsDir, { recursive: true });
        const tmpHtml = node_path_1.default.join(reportsDir, `_tmp_${Date.now()}.html`);
        await fsPromises.writeFile(tmpHtml, payload.html, "utf8");
        const win = new electron_1.BrowserWindow({
            show: false,
            webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
        });
        await win.loadFile(tmpHtml);
        const pdfBuffer = await win.webContents.printToPDF({
            printBackground: true,
            pageSize: "Letter",
            margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
        });
        win.destroy();
        await fsPromises.unlink(tmpHtml).catch(() => undefined);
        const pdfPath = node_path_1.default.join(reportsDir, payload.filename);
        await fsPromises.writeFile(pdfPath, pdfBuffer);
        shell.showItemInFolder(pdfPath);
        return { ok: true, path: pdfPath };
    }
    catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Export failed" };
    }
});
electron_1.ipcMain.handle("export:open-reports-folder", async () => {
    try {
        const fsPromises = await Promise.resolve().then(() => __importStar(require("node:fs/promises")));
        const { shell } = await Promise.resolve().then(() => __importStar(require("electron")));
        const reportsDir = node_path_1.default.join(electron_1.app.getPath("userData"), "reports");
        await fsPromises.mkdir(reportsDir, { recursive: true });
        await shell.openPath(reportsDir);
        return { ok: true };
    }
    catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Could not open folder" };
    }
});
electron_1.ipcMain.handle("lan:get-status", () => getLanStatus());
electron_1.ipcMain.handle("lan:start-host", (_event, input) => startLanHost(input.port, input.token));
electron_1.ipcMain.handle("lan:stop", () => stopLanBridge(true));
electron_1.ipcMain.handle("lan:configure-client", (_event, input) => configureLanClient(input));
electron_1.ipcMain.handle("lan:publish-host-snapshot", (_event, snapshot) => {
    if (lanConfig.mode === "host") {
        hostSnapshot = { ...snapshot, updatedAt: Date.now() };
        lastSyncAt = Date.now();
    }
    return emitLanStatus();
});
electron_1.ipcMain.handle("lan:push-telemetry", async (_event, payload) => {
    if (lanConfig.mode === "client") {
        queuedEvents.push({ kind: "telemetry", payload: { ...payload, clientName: LAN_CLIENT_NAME } });
        queuedEvents = queuedEvents.slice(-500);
        await flushQueuedEvents();
    }
    return emitLanStatus();
});
electron_1.ipcMain.handle("lan:push-report", async (_event, payload) => {
    if (lanConfig.mode === "client") {
        queuedEvents.push({ kind: "report", payload: { ...payload, clientName: LAN_CLIENT_NAME } });
        queuedEvents = queuedEvents.slice(-500);
        await flushQueuedEvents();
    }
    return emitLanStatus();
});
