import { useState } from "react";
import { buildReportHtml } from "../engine/reportExportEngine";
import type { TraineeReportData } from "../engine/reportExportEngine";
import type { TrainingModuleDefinition } from "../data/trainingModules";
import { useGameStore } from "../store/gameStore";

interface ModuleCompletionOverlayProps {
  module: TrainingModuleDefinition;
  moduleScore: number;
  targetScore: number;
  onDismiss: () => void;
}

export function ModuleCompletionOverlay({
  module,
  moduleScore,
  targetScore,
  onDismiss
}: ModuleCompletionOverlayProps) {
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const trainees = useGameStore((state) => state.trainees);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const trainee = trainees.find((t) => t.id === activeTraineeId) ?? trainees[0] ?? null;

  const handleExport = async () => {
    setExporting(true);
    setExportMsg(null);
    try {
      const data: TraineeReportData = {
        traineeName: trainee?.name ?? "Trainee",
        traineeUsername: trainee?.id ?? "unknown",
        exportedAt: Date.now(),
        sessions: 1,
        averageScore: moduleScore,
        latestSessionGrade: moduleScore >= 90 ? "A" : moduleScore >= 80 ? "B" : moduleScore >= 70 ? "C" : moduleScore >= 60 ? "D" : "F",
        latestSessionDate: Date.now(),
        liveScore: null,
        assignments: [{
          moduleTitle: module.title,
          moduleFocus: module.focus,
          difficulty: "associate",
          status: "completed",
          completionPercent: 100,
          bestScore: moduleScore,
          dueAt: null,
          scoreCards: [],
          overdueZeroScore: false
        }]
      };
      const html = buildReportHtml(data);
      const safeName = (trainee?.name ?? "trainee").replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const safeModule = module.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const filename = `report_${safeName}_${safeModule}_${new Date().toISOString().slice(0, 10)}.pdf`;
      const result = await window.electronAPI?.exportTraineeReport?.({ html, filename });
      setExportMsg(result?.ok ? `Saved: ${filename}` : `Export failed: ${result?.error ?? "unknown error"}`);
    } catch (err) {
      setExportMsg(`Export failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-card module-complete-card">
        <div className="overlay-header">
          <div className="overlay-copy">
            <p className="eyebrow">Module Complete</p>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
          </div>
          <div className="overlay-actions">
            <button type="button" className="control-btn" disabled={exporting} onClick={() => void handleExport()}>
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
            <button type="button" className="control-btn active" onClick={onDismiss}>
              Continue
            </button>
          </div>
        </div>
        {exportMsg && (
          <div style={{ padding: "6px 14px", fontSize: "0.75rem", color: exportMsg.startsWith("Saved") ? "var(--color-positive)" : "var(--color-negative)" }}>
            {exportMsg}
          </div>
        )}
        <div className="study-summary-grid">
          <div className="study-summary-card">
            <span>Module Score</span>
            <strong>{moduleScore}/100</strong>
            <small>{module.focus}</small>
          </div>
          <div className="study-summary-card">
            <span>Target</span>
            <strong>{targetScore}/100</strong>
            <small>{module.completionLabel}</small>
          </div>
          <div className="study-summary-card">
            <span>Coaching Signals</span>
            <strong>{module.coachingSignals[0] ?? "Progress"}</strong>
            <small>{module.coachingSignals.slice(1).join(" | ")}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
