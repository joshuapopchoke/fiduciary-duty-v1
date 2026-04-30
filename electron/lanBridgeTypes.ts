export type LanBridgeMode = "off" | "host" | "client";

export interface LanBridgeConfig {
  mode: LanBridgeMode;
  host: string;
  port: number;
  token: string;
}

export interface LanBridgeStatus extends LanBridgeConfig {
  running: boolean;
  reachableUrls: string[];
  connectedClients: LanBridgeClientStatus[];
  lastError: string | null;
  lastSyncAt: number | null;
  queuedEvents: number;
}

export interface LanBridgeClientStatus {
  id: string;
  name: string;
  address: string;
  lastSeenAt: number;
  eventCount: number;
}

export interface LanBridgeSnapshot {
  users: unknown[];
  trainees: unknown[];
  trainingAssignments: unknown[];
  trainingReports: unknown[];
  updatedAt: number;
}

export interface LanBridgeTelemetryEvent {
  id: string;
  traineeId: string;
  moduleId: string | null;
  correct: number;
  total: number;
  pct: number;
  updatedAt: number;
  clientName: string;
}

export interface LanBridgeReportEvent {
  id: string;
  report: unknown;
  clientName: string;
  updatedAt: number;
}
