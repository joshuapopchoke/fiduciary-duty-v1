"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronAPI = {
    exportTraineeReport: (payload) => electron_1.ipcRenderer.invoke("export:trainee-report", payload),
    exportOpenReportsFolder: () => electron_1.ipcRenderer.invoke("export:open-reports-folder"),
    closeApp: () => electron_1.ipcRenderer.send("close-app"),
    minimizeApp: () => electron_1.ipcRenderer.send("minimize-app"),
    maximizeApp: () => electron_1.ipcRenderer.send("maximize-app"),
    setResolution: (width, height) => electron_1.ipcRenderer.invoke("set-resolution", width, height),
    lanGetStatus: () => electron_1.ipcRenderer.invoke("lan:get-status"),
    lanStartHost: (input) => electron_1.ipcRenderer.invoke("lan:start-host", input),
    lanStop: () => electron_1.ipcRenderer.invoke("lan:stop"),
    lanConfigureClient: (input) => electron_1.ipcRenderer.invoke("lan:configure-client", input),
    lanPublishHostSnapshot: (snapshot) => electron_1.ipcRenderer.invoke("lan:publish-host-snapshot", snapshot),
    lanPushTelemetry: (event) => electron_1.ipcRenderer.invoke("lan:push-telemetry", event),
    lanPushReport: (event) => electron_1.ipcRenderer.invoke("lan:push-report", event),
    lanOnStatus: (callback) => {
        const handler = (_event, status) => callback(status);
        electron_1.ipcRenderer.on("lan:status", handler);
        return () => electron_1.ipcRenderer.removeListener("lan:status", handler);
    },
    lanOnSnapshot: (callback) => {
        const handler = (_event, snapshot) => callback(snapshot);
        electron_1.ipcRenderer.on("lan:snapshot", handler);
        return () => electron_1.ipcRenderer.removeListener("lan:snapshot", handler);
    },
    lanOnTelemetry: (callback) => {
        const handler = (_event, payload) => callback(payload);
        electron_1.ipcRenderer.on("lan:telemetry", handler);
        return () => electron_1.ipcRenderer.removeListener("lan:telemetry", handler);
    },
    lanOnReport: (callback) => {
        const handler = (_event, payload) => callback(payload);
        electron_1.ipcRenderer.on("lan:report", handler);
        return () => electron_1.ipcRenderer.removeListener("lan:report", handler);
    }
};
electron_1.contextBridge.exposeInMainWorld("electronAPI", Object.freeze(electronAPI));
