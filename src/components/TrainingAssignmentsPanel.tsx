import { useMemo } from "react";
import { buildAssignmentSnapshots } from "../engine/trainingCurriculumEngine";
import { useGameStore } from "../store/gameStore";

function formatDueDate(value: number | null) {
  if (!value) {
    return "No due date";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

interface TrainingAssignmentsPanelProps {
  selectedAssignmentId?: string | null;
  onSelectAssignment?: (assignmentId: string) => void;
}

export function TrainingAssignmentsPanel({ selectedAssignmentId = null, onSelectAssignment }: TrainingAssignmentsPanelProps) {
  const trainees = useGameStore((state) => state.trainees);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const trainingAssignments = useGameStore((state) => state.trainingAssignments);
  const trainingReports = useGameStore((state) => state.trainingReports);

  const activeTrainee = trainees.find((entry) => entry.id === activeTraineeId) ?? trainees[0] ?? null;
  const assignmentSnapshots = useMemo(
    () => buildAssignmentSnapshots(
      trainingAssignments.filter((assignment) => assignment.traineeId === activeTraineeId),
      trainingReports
    ),
    [activeTraineeId, trainingAssignments, trainingReports]
  );

  return (
    <section className="panel assignments-panel">
      <div className="panel-header">
        <div className="side-panel-heading">
          <h2>Assigned Modules</h2>
          <span className="panel-meta">{activeTrainee?.name ?? "Trainee"} | Structured learning path</span>
        </div>
      </div>
      <div className="assignments-panel-body">
        {assignmentSnapshots.length === 0 ? (
          <div className="empty-state">No modules assigned yet. A manager or instructor can assign curriculum milestones from the manager dashboard.</div>
        ) : (
          <div className="assignment-grid">
            {assignmentSnapshots.map((snapshot) => (
              <button
                key={snapshot.assignmentId}
                type="button"
                className={`assignment-card assignment-card--${snapshot.status}${selectedAssignmentId === snapshot.assignmentId ? " assignment-card--selected" : ""}`}
                onClick={() => onSelectAssignment?.(snapshot.assignmentId)}
                disabled={!onSelectAssignment}
              >
                <span>{snapshot.module.focus}</span>
                <strong>{snapshot.module.title}</strong>
                <small>{snapshot.module.description}</small>
                <small>{snapshot.module.completionLabel}</small>
                <small>Due {formatDueDate(snapshot.dueAt)} | {snapshot.status.replace("-", " ")}</small>
                <div className="study-meter-track">
                  <div className="study-meter-fill" style={{ width: `${snapshot.completionPercent}%` }} />
                </div>
                <small>{snapshot.completionPercent}% ready{snapshot.bestMatchingReport ? ` | Best ${snapshot.bestMatchingReport.overall.grade}` : ""}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
