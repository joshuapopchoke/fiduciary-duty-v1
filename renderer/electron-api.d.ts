import type {
  LanBridgeReportEvent,
  LanBridgeSnapshot,
  LanBridgeStatus,
  LanBridgeTelemetryEvent
} from "../src/types/lanBridge";

export interface RendererElectronAPI {
  exportTraineeReport: (payload: { html: string; filename: string }) => Promise<{ ok: boolean; path?: string; error?: string }>;
  exportOpenReportsFolder: () => Promise<{ ok: boolean; error?: string }>;
  closeApp: () => void;
  minimizeApp: () => void;
  maximizeApp: () => void;
  setResolution: (width: number | null, height: number | null) => Promise<void>;
  lanGetStatus: () => Promise<LanBridgeStatus>;
  lanStartHost: (input: { port: number; token?: string | null }) => Promise<LanBridgeStatus>;
  lanStop: () => Promise<LanBridgeStatus>;
  lanConfigureClient: (input: { host: string; port: number; token: string }) => Promise<LanBridgeStatus>;
  lanPublishHostSnapshot: (snapshot: LanBridgeSnapshot) => Promise<LanBridgeStatus>;
  lanPushTelemetry: (event: LanBridgeTelemetryEvent) => Promise<LanBridgeStatus>;
  lanPushReport: (event: LanBridgeReportEvent) => Promise<LanBridgeStatus>;
  lanOnStatus: (callback: (status: LanBridgeStatus) => void) => () => void;
  lanOnSnapshot: (callback: (snapshot: LanBridgeSnapshot) => void) => () => void;
  lanOnTelemetry: (callback: (event: LanBridgeTelemetryEvent) => void) => () => void;
  lanOnReport: (callback: (event: LanBridgeReportEvent) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: RendererElectronAPI;
  }
}
