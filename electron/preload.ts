import { contextBridge, ipcRenderer } from "electron";
import type {
  LanBridgeConfig,
  LanBridgeReportEvent,
  LanBridgeSnapshot,
  LanBridgeStatus,
  LanBridgeTelemetryEvent
} from "./lanBridgeTypes";

const electronAPI = {
  exportTraineeReport: (payload: { html: string; filename: string }) => ipcRenderer.invoke("export:trainee-report", payload) as Promise<{ ok: boolean; path?: string; error?: string }>,
  exportOpenReportsFolder: () => ipcRenderer.invoke("export:open-reports-folder") as Promise<{ ok: boolean; error?: string }>,
  closeApp: () => ipcRenderer.send("close-app"),
  minimizeApp: () => ipcRenderer.send("minimize-app"),
  maximizeApp: () => ipcRenderer.send("maximize-app"),
  setResolution: (width: number | null, height: number | null) => ipcRenderer.invoke("set-resolution", width, height),
  lanGetStatus: () => ipcRenderer.invoke("lan:get-status") as Promise<LanBridgeStatus>,
  lanStartHost: (input: { port: number; token?: string | null }) => ipcRenderer.invoke("lan:start-host", input) as Promise<LanBridgeStatus>,
  lanStop: () => ipcRenderer.invoke("lan:stop") as Promise<LanBridgeStatus>,
  lanConfigureClient: (input: { host: string; port: number; token: string }) => ipcRenderer.invoke("lan:configure-client", input) as Promise<LanBridgeStatus>,
  lanPublishHostSnapshot: (snapshot: LanBridgeSnapshot) => ipcRenderer.invoke("lan:publish-host-snapshot", snapshot) as Promise<LanBridgeStatus>,
  lanPushTelemetry: (event: LanBridgeTelemetryEvent) => ipcRenderer.invoke("lan:push-telemetry", event) as Promise<LanBridgeStatus>,
  lanPushReport: (event: LanBridgeReportEvent) => ipcRenderer.invoke("lan:push-report", event) as Promise<LanBridgeStatus>,
  lanOnStatus: (callback: (status: LanBridgeStatus) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: LanBridgeStatus) => callback(status);
    ipcRenderer.on("lan:status", handler);
    return () => ipcRenderer.removeListener("lan:status", handler);
  },
  lanOnSnapshot: (callback: (snapshot: LanBridgeSnapshot) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, snapshot: LanBridgeSnapshot) => callback(snapshot);
    ipcRenderer.on("lan:snapshot", handler);
    return () => ipcRenderer.removeListener("lan:snapshot", handler);
  },
  lanOnTelemetry: (callback: (event: LanBridgeTelemetryEvent) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: LanBridgeTelemetryEvent) => callback(payload);
    ipcRenderer.on("lan:telemetry", handler);
    return () => ipcRenderer.removeListener("lan:telemetry", handler);
  },
  lanOnReport: (callback: (event: LanBridgeReportEvent) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: LanBridgeReportEvent) => callback(payload);
    ipcRenderer.on("lan:report", handler);
    return () => ipcRenderer.removeListener("lan:report", handler);
  }
};

contextBridge.exposeInMainWorld("electronAPI", Object.freeze(electronAPI));

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
