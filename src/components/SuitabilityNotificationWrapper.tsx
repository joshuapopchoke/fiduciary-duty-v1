import type { ReactNode } from "react";
import type { AssignmentProgressSnapshot, ModuleScoreCard } from "../engine/trainingCurriculumEngine";

interface Props {
  assignment: AssignmentProgressSnapshot;
  onTelemetryChange?: (telemetry: { score: number; scoreCards: ModuleScoreCard[]; answeredCount: number }) => void;
  children: ReactNode;
}

export function SuitabilityNotificationWrapper({ assignment, onTelemetryChange, children }: Props) {
  void assignment;
  void onTelemetryChange;

  return (
    <div style={{ position: "relative" }}>
      {children}
    </div>
  );
}
