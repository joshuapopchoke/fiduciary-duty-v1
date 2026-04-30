/**
 * TelemetryContext.tsx
 * Provides onTelemetryChange to any component inside the desktop shell
 * without passing it through props or Zustand state.
 */

import { createContext, useContext } from "react";
import type { ModuleScoreCard } from "../../engine/trainingCurriculumEngine";

export interface TelemetryPayload {
  score: number;
  scoreCards: ModuleScoreCard[];
  answeredCount: number;
}

export const TelemetryContext = createContext<((telemetry: TelemetryPayload) => void) | null>(null);

export function useTelemetryChange() {
  const fn = useContext(TelemetryContext);
  // Return a no-op if not inside a provider — safe fallback
  return fn ?? (() => {});
}
