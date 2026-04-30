import { app, BrowserWindow, ipcMain, screen } from "electron";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { autoUpdater } from "electron-updater";
import type {
  LanBridgeClientStatus,
  LanBridgeConfig,
  LanBridgeReportEvent,
  LanBridgeSnapshot,
  LanBridgeStatus,
  LanBridgeTelemetryEvent
} from "./lanBridgeTypes";

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const isTest = Boolean(process.env.PLAYWRIGHT_TEST);

const DEFAULT_LAN_PORT = 38741;
const LAN_CONFIG_FILE = "lan-bridge-config.json";
const LAN_CLIENT_NAME = os.hostname();

let mainWindow: BrowserWindow | null = null;
let lanServer: http.Server | null = null;
let lanConfig: LanBridgeConfig = { mode: "off", host: "", port: DEFAULT_LAN_PORT, token: "" };
let hostSnapshot: LanBridgeSnapshot | null = null;
let clientPollTimer: NodeJS.Timeout | null = null;
let flushQueueTimer: NodeJS.Timeout | null = null;
let lastLanError: string | null = null;
let lastSyncAt: number | null = null;
let connectedClients = new Map<string, LanBridgeClientStatus>();
let queuedEvents: Array<{ kind: "telemetry"; payload: LanBridgeTelemetryEvent } | { kind: "report"; payload: LanBridgeReportEvent }> = [];

function lanConfigPath() {
  return path.join(app.getPath("userData"), LAN_CONFIG_FILE);
}

async function readLanConfig() {
  try {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(lanConfigPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<LanBridgeConfig>;
    lanConfig = {
      mode: parsed.mode === "host" || parsed.mode === "client" ? parsed.mode : "off",
      host: typeof parsed.host === "string" ? parsed.host : "",
      port: typeof parsed.port === "number" ? parsed.port : DEFAULT_LAN_PORT,
      token: typeof parsed.token === "string" ? parsed.token : ""
    };
  } catch {
    lanConfig = { mode: "off", host: "", port: DEFAULT_LAN_PORT, token: "" };
  }
}

async function writeLanConfig() {
  const fs = await import("node:fs/promises");
  await fs.mkdir(app.getPath("userData"), { recursive: true });
  await fs.writeFile(lanConfigPath(), JSON.stringify(lanConfig, null, 2), "utf8");
}

function localLanUrls(port: number) {
  const urls = new Set<string>();
  const interfaces = os.networkInterfaces();
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
  BrowserWindow.getAllWindows().forEach((win) => win.webContents.send("lan:status", status));
  return status;
}

function getLanStatus(): LanBridgeStatus {
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

function parseJsonBody(req: http.IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : null);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: http.ServerResponse, statusCode: number, body: unknown) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(body));
}

function requestToken(req: http.IncomingMessage, body: unknown) {
  const header = req.headers.authorization;
  if (typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  if (body && typeof body === "object" && "token" in body && typeof (body as { token?: unknown }).token === "string") {
    return (body as { token: string }).token;
  }
  const reqUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  return reqUrl.searchParams.get("token") ?? "";
}

function authorizeLanRequest(req: http.IncomingMessage, body: unknown) {
  return Boolean(lanConfig.token) && requestToken(req, body) === lanConfig.token;
}

function touchClient(req: http.IncomingMessage, name: string) {
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

async function handleLanRequest(req: http.IncomingMessage, res: http.ServerResponse) {
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

  let body: unknown;
  try {
    body = await parseJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  if (!authorizeLanRequest(req, body)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return;
  }

  if (req.url === "/api/telemetry") {
    const payload = body as Partial<LanBridgeTelemetryEvent> & { clientName?: string };
    if (!payload.traineeId || typeof payload.total !== "number" || typeof payload.correct !== "number") {
      sendJson(res, 400, { error: "Invalid telemetry" });
      return;
    }
    const event: LanBridgeTelemetryEvent = {
      id: typeof payload.id === "string" ? payload.id : randomBytes(12).toString("hex"),
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
    const payload = body as Partial<LanBridgeReportEvent> & { clientName?: string };
    if (!payload.report || typeof payload.report !== "object") {
      sendJson(res, 400, { error: "Invalid report" });
      return;
    }
    const event: LanBridgeReportEvent = {
      id: typeof payload.id === "string" ? payload.id : randomBytes(12).toString("hex"),
      report: payload.report as LanBridgeReportEvent["report"],
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

async function startLanHost(port: number, token?: string | null) {
  await stopLanBridge(false);
  lanConfig = {
    mode: "host",
    host: "0.0.0.0",
    port: Number.isFinite(port) ? Math.max(1024, Math.min(65535, Math.round(port))) : DEFAULT_LAN_PORT,
    token: token?.trim() || randomBytes(18).toString("hex")
  };
  lanServer = http.createServer((req, res) => {
    void handleLanRequest(req, res).catch((error) => {
      lastLanError = error instanceof Error ? error.message : "LAN server error";
      sendJson(res, 500, { error: "Server error" });
      emitLanStatus();
    });
  });
  await new Promise<void>((resolve, reject) => {
    lanServer?.once("error", reject);
    lanServer?.listen(lanConfig.port, "0.0.0.0", () => resolve());
  });
  await writeLanConfig();
  lastLanError = null;
  return emitLanStatus();
}

async function postToHost(pathname: string, payload: unknown) {
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
    const snapshot = await response.json() as LanBridgeSnapshot;
    lastLanError = null;
    lastSyncAt = Date.now();
    mainWindow?.webContents.send("lan:snapshot", snapshot);
    emitLanStatus();
  } catch (error) {
    lastLanError = error instanceof Error ? error.message : "Unable to reach LAN host";
    emitLanStatus();
  }
}

async function flushQueuedEvents() {
  if (lanConfig.mode !== "client" || queuedEvents.length === 0) {
    return;
  }

  const remaining: typeof queuedEvents = [];
  for (const event of queuedEvents) {
    try {
      await postToHost(event.kind === "telemetry" ? "/api/telemetry" : "/api/report", event.payload);
      lastSyncAt = Date.now();
      lastLanError = null;
    } catch (error) {
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

async function configureLanClient(input: { host: string; port: number; token: string }) {
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
    await new Promise<void>((resolve) => lanServer?.close(() => resolve()));
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
    } catch (error) {
      lastLanError = error instanceof Error ? error.message : "Unable to restore LAN host";
      emitLanStatus();
    }
  } else if (lanConfig.mode === "client") {
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
        autoUpdater.setFeedURL({ provider: "generic", url: parsedFeedUrl.toString() });
      }
    } catch {
      return;
    }
  }

  void autoUpdater.checkForUpdatesAndNotify();
}

function getAutoWindowSize(display: Electron.Display) {
  const workArea = display.workAreaSize;
  return {
    width: Math.max(1280, Math.min(1920, workArea.width)),
    height: Math.max(720, Math.min(1080, workArea.height))
  };
}

function applyWindowResolution(win: BrowserWindow, width: number | null, height: number | null) {
  const display = screen.getDisplayMatching(win.getBounds());
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
  const primaryDisplay = screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workAreaSize;
  const autoSize = getAutoWindowSize(primaryDisplay);

  const win = new BrowserWindow({
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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      sandbox: isTest ? false : true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: isDev || isTest
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
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
      if (workArea.width <= 1280 || workArea.height <= 720) {
        win.maximize();
      }
      win.show();
    });
  }

  if (isDev) {
    void win.loadURL(process.env.VITE_DEV_SERVER_URL!);
  } else {
    void win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  configureAutoUpdates();
  void restoreLanBridge();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("close-app", () => app.quit());
ipcMain.on("minimize-app", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});
ipcMain.on("maximize-app", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  if (!win) {
    return;
  }

  if (win.isMaximized()) {
    win.unmaximize();
    return;
  }

  win.maximize();
});

ipcMain.handle("set-resolution", (event, width: number | null, height: number | null) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    return;
  }

  applyWindowResolution(win, width, height);
});

// ─── Report Export ────────────────────────────────────────────────────────────
ipcMain.handle("export:trainee-report", async (_event, payload: { html: string; filename: string }) => {
  try {
    const fs = await import("node:fs/promises");
    const { shell } = await import("electron");
    const reportsDir = path.join(app.getPath("userData"), "reports");
    await fs.mkdir(reportsDir, { recursive: true });

    // Write HTML to a temp file, load it in a hidden window, print to PDF
    const tmpHtml = path.join(reportsDir, `_tmp_${Date.now()}.html`);
    await fs.writeFile(tmpHtml, payload.html, "utf8");

    const win = new BrowserWindow({
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
    await fs.unlink(tmpHtml).catch(() => undefined);

    const pdfPath = path.join(reportsDir, payload.filename);
    await fs.writeFile(pdfPath, pdfBuffer);
    shell.showItemInFolder(pdfPath);
    return { ok: true, path: pdfPath };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Export failed" };
  }
});

ipcMain.handle("export:open-reports-folder", async () => {
  try {
    const fs = await import("node:fs/promises");
    const { shell } = await import("electron");
    const reportsDir = path.join(app.getPath("userData"), "reports");
    await fs.mkdir(reportsDir, { recursive: true });
    await shell.openPath(reportsDir);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not open folder" };
  }
});

ipcMain.handle("lan:get-status", () => getLanStatus());
ipcMain.handle("lan:start-host", (_event, input: { port: number; token?: string | null }) => startLanHost(input.port, input.token));
ipcMain.handle("lan:stop", () => stopLanBridge(true));
ipcMain.handle("lan:configure-client", (_event, input: { host: string; port: number; token: string }) => configureLanClient(input));
ipcMain.handle("lan:publish-host-snapshot", (_event, snapshot: LanBridgeSnapshot) => {
  if (lanConfig.mode === "host") {
    hostSnapshot = { ...snapshot, updatedAt: Date.now() };
    lastSyncAt = Date.now();
  }
  return emitLanStatus();
});
ipcMain.handle("lan:push-telemetry", async (_event, payload: LanBridgeTelemetryEvent) => {
  if (lanConfig.mode === "client") {
    queuedEvents.push({ kind: "telemetry", payload: { ...payload, clientName: LAN_CLIENT_NAME } });
    queuedEvents = queuedEvents.slice(-500);
    await flushQueuedEvents();
  }
  return emitLanStatus();
});
ipcMain.handle("lan:push-report", async (_event, payload: LanBridgeReportEvent) => {
  if (lanConfig.mode === "client") {
    queuedEvents.push({ kind: "report", payload: { ...payload, clientName: LAN_CLIENT_NAME } });
    queuedEvents = queuedEvents.slice(-500);
    await flushQueuedEvents();
  }
  return emitLanStatus();
});
