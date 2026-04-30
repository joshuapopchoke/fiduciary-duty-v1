import { useMemo, useState } from "react";
import { DIFFICULTY_LABELS } from "../data/examBlueprints";
import { useGameStore } from "../store/gameStore";

function formatStamp(value: number) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function TrainingManagerOverlay() {
  const [open, setOpen] = useState(false);
  const [newTraineeName, setNewTraineeName] = useState("");
  const trainees = useGameStore((state) => state.trainees);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const trainingReports = useGameStore((state) => state.trainingReports);
  const createTrainee = useGameStore((state) => state.createTrainee);
  const setActiveTrainee = useGameStore((state) => state.setActiveTrainee);

  const activeTrainee = trainees.find((entry) => entry.id === activeTraineeId) ?? trainees[0] ?? null;
  const traineeRows = useMemo(() => trainees.map((trainee) => {
    const reports = trainingReports.filter((report) => report.traineeId === trainee.id);
    const latest = reports[0] ?? null;
    const avgOverall = reports.length === 0 ? 0 : reports.reduce((sum, report) => sum + report.overall.score, 0) / reports.length;
    return {
      trainee,
      reports,
      latest,
      avgOverall
    };
  }), [trainees, trainingReports]);
  const activeReports = trainingReports.filter((report) => report.traineeId === activeTraineeId).slice(0, 8);

  return (
    <>
      <button className="control-btn" type="button" onClick={() => setOpen(true)}>
        Training
      </button>
      {open ? (
        <div className="overlay">
          <div className="overlay-card overlay-card--scrollable training-manager-card">
            <div className="panel-header">
              <h2>Training Manager</h2>
              <div className="slot-actions">
                <button className="control-btn" type="button" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>

            <div className="training-manager-grid">
              <div className="training-manager-column">
                <div className="portfolio-summary-card">
                  <span>Active trainee</span>
                  <strong>{activeTrainee?.name ?? "Primary Trainee"}</strong>
                  <small>{activeTrainee?.role ?? "Trainee"} | {activeReports.length} reports logged</small>
                </div>
                <div className="training-create-row">
                  <input
                    className="slot-name-input"
                    placeholder="Add trainee name"
                    value={newTraineeName}
                    onChange={(event) => setNewTraineeName(event.target.value)}
                  />
                  <button
                    className="control-btn active"
                    type="button"
                    onClick={() => {
                      if (!newTraineeName.trim()) {
                        return;
                      }
                      createTrainee(newTraineeName.trim());
                      setNewTraineeName("");
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="session-list">
                  {traineeRows.map(({ trainee, latest, avgOverall, reports }) => (
                    <button
                      key={trainee.id}
                      type="button"
                      className={`slot-card trainee-card ${trainee.id === activeTraineeId ? "active" : ""}`}
                      onClick={() => setActiveTrainee(trainee.id)}
                    >
                      <div className="slot-copy">
                        <strong>{trainee.name}</strong>
                        <span>{trainee.role}</span>
                        <span>{reports.length} sessions | Avg overall {reports.length ? avgOverall.toFixed(0) : "--"}</span>
                        <span>{latest ? `Latest ${latest.overall.grade} on ${formatStamp(latest.endedAt)}` : "No completed sessions yet"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="training-manager-column">
                <div className="portfolio-section-title">Recent Reports</div>
                {activeReports.length === 0 ? (
                  <div className="empty-state">Complete a timed session to generate a trainee report that managers can review here.</div>
                ) : (
                  <div className="session-list">
                    {activeReports.map((report) => (
                      <div key={report.id} className="slot-card">
                        <div className="slot-copy">
                          <strong>{formatStamp(report.endedAt)} | {DIFFICULTY_LABELS[report.difficulty]}</strong>
                          <span>Overall {report.overall.grade} ({report.overall.score}/100)</span>
                          <span>Exam {report.examReadiness.grade} | Advisor {report.advisorPerformance.grade} | Compliance {report.compliance.grade}</span>
                          <span>{report.correctAnswers}/{report.answeredQuestions} correct | {report.studyAccuracy.toFixed(0)}% accuracy</span>
                          <span>{report.clientCount} retained | {report.lostClientCount} lost | {formatCurrency(report.totalAum)} client book</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
