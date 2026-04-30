import { useEffect, useMemo, useState } from "react";
import { DIFFICULTY_LABELS } from "../data/examBlueprints";
import { getMortgageStateProfile } from "../data/mortgageStateProfiles";
import { TRAINING_MODULES } from "../data/trainingModules";
import { getStateName, US_STATES } from "../data/usStates";
import { buildAssignmentSnapshots } from "../engine/trainingCurriculumEngine";
import { buildReportHtml } from "../engine/reportExportEngine";
import type { TraineeReportData } from "../engine/reportExportEngine";
import type { ManagerDashboardState, User } from "../types/auth";
import type { PlayDifficulty } from "../types/gameState";
import type { LanBridgeStatus } from "../types/lanBridge";
import { useGameStore } from "../store/gameStore";

const MANAGER_LAST_SCORE_STORAGE_KEY = "fiduciary-duty-manager-last-trainee-scores";

type PersistedTraineeScore = {
  traineeId: string;
  moduleId: string | null;
  correct: number;
  total: number;
  pct: number;
  updatedAt: number;
};

function loadPersistedTraineeScores(): Record<string, PersistedTraineeScore> {
  if (typeof localStorage === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(MANAGER_LAST_SCORE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed as Record<string, PersistedTraineeScore> : {};
  } catch {
    return {};
  }
}

function savePersistedTraineeScores(scores: Record<string, PersistedTraineeScore>) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(MANAGER_LAST_SCORE_STORAGE_KEY, JSON.stringify(scores));
}

interface ManagerDashboardProps {
  currentUser: User;
  users: User[];
  onLogout: () => void;
  onAddEmployee: (input: { displayName: string; username: string; password: string }) => void | Promise<void>;
  onRemoveEmployee: (userId: string) => void;
  onChangeManagerPassword: (currentPassword: string, nextPassword: string) => void | Promise<void>;
  onAssignModule: (traineeId: string, moduleId: string, assignedDifficulty: PlayDifficulty, dueAt: number | null, jurisdictionCode: string | null) => void;
  onRemoveModule: (assignmentId: string) => void;
  onLaunchModulePreview: (moduleId: string, assignedDifficulty: PlayDifficulty, jurisdictionCode: string | null) => void;
}

const defaultDashboardState: ManagerDashboardState = {
  newEmployeeName: "",
  newEmployeeUsername: "",
  newEmployeePassword: "",
  selectedEmployeeId: "",
  selectedModuleId: TRAINING_MODULES[0]?.id ?? "",
  selectedModuleDifficulty: TRAINING_MODULES[0]?.requiredDifficulty ?? "learner",
  selectedJurisdictionCode: "CA",
  assignmentDueDate: "",
  passwordChangeCurrent: "",
  passwordChangeNext: "",
  passwordChangeConfirm: "",
  error: null
};

const DIFFICULTY_DESCRIPTIONS: Record<PlayDifficulty, string> = {
  learner: "Most guided pacing. Best for foundations and first-pass recall.",
  trainee: "Adds more independent recognition and broader exam application.",
  associate: "Working-practice pace with more judgment expected from the trainee.",
  advisor: "Advanced planning and communication pressure with less hand-holding.",
  senior: "Highest-pressure environment for complex judgment and compliance discipline."
};

function formatStamp(value: number) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatMortgageRate(value: number | null) {
  if (value === null) {
    return null;
  }

  return `${(value * 100).toFixed(2)}%`;
}

function formatScenarioTitle(value: string | null) {
  if (!value) {
    return null;
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function weakestAssessmentLine(moduleScoreCards: Array<{ label: string; score: number }> | null | undefined) {
  if (!moduleScoreCards || moduleScoreCards.length === 0) {
    return null;
  }

  const weakestCard = [...moduleScoreCards].sort((left, right) => left.score - right.score)[0];
  return `Support next: ${weakestCard.label} (${weakestCard.score}/100)`;
}

export function ManagerDashboard({
  currentUser,
  users,
  onLogout,
  onAddEmployee,
  onRemoveEmployee,
  onChangeManagerPassword,
  onAssignModule,
  onRemoveModule,
  onLaunchModulePreview
}: ManagerDashboardProps) {
  const [dashboardState, setDashboardState] = useState<ManagerDashboardState>(defaultDashboardState);
  const [lanStatus, setLanStatus] = useState<LanBridgeStatus | null>(null);
  const [lanHostInput, setLanHostInput] = useState("");
  const [lanPortInput, setLanPortInput] = useState("38741");
  const [lanTokenInput, setLanTokenInput] = useState("");
  const [lanMessage, setLanMessage] = useState<string | null>(null);
  const [persistedTraineeScores, setPersistedTraineeScores] = useState<Record<string, PersistedTraineeScore>>(() => loadPersistedTraineeScores());
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const trainees = useGameStore((state) => state.trainees);
  const trainingAssignments = useGameStore((state) => state.trainingAssignments);
  const trainingReports = useGameStore((state) => state.trainingReports);
  const liveTraineeScore = useGameStore((state) => state.liveTraineeScore);

  const employeeUsers = useMemo(() => users.filter((user) => user.role === "employee"), [users]);
  const assignmentSnapshots = useMemo(() => buildAssignmentSnapshots(trainingAssignments, trainingReports), [trainingAssignments, trainingReports]);
  const employeeCards = useMemo(() => employeeUsers.map((user) => {
    const reports = trainingReports.filter((report) => report.traineeId === user.id);
    const latestReport = reports[0] ?? null;
    const latestModuleReport = reports.find((report) => report.moduleId !== null) ?? null;
    const averageOverall = reports.length === 0 ? 0 : reports.reduce((sum, report) => sum + report.overall.score, 0) / reports.length;
    const trainee = trainees.find((entry) => entry.id === user.id) ?? null;

    return {
      user,
      trainee,
      reports,
      latestReport,
      latestModuleReport,
      averageOverall
    };
  }), [employeeUsers, trainees, trainingReports]);
  const selectedEmployeeId = dashboardState.selectedEmployeeId;
  const selectedEmployeeName = selectedEmployeeId
    ? employeeUsers.find((user) => user.id === selectedEmployeeId)?.displayName
      ?? trainees.find((entry) => entry.id === selectedEmployeeId)?.name
      ?? "Selected employee"
    : "All employees";
  const displayedEmployeeCards = selectedEmployeeId
    ? employeeCards.filter(({ user }) => user.id === selectedEmployeeId)
    : employeeCards;
  const displayedAssignmentSnapshots = selectedEmployeeId
    ? assignmentSnapshots.filter((snapshot) => {
        const assignment = trainingAssignments.find((entry) => entry.id === snapshot.assignmentId);
        return assignment?.traineeId === selectedEmployeeId;
      })
    : assignmentSnapshots;

  const managerNeedsPasswordChange = currentUser.mustChangePassword;
  const selectedModule = TRAINING_MODULES.find((entry) => entry.id === dashboardState.selectedModuleId) ?? null;
  const selectedMortgageStateProfile = getMortgageStateProfile(dashboardState.selectedJurisdictionCode);
  const lanStatusLine = lanStatus
    ? lanStatus.mode === "host"
      ? lanStatus.running ? `Hosting on ${lanStatus.reachableUrls.join(" | ")}` : "Host stopped"
      : lanStatus.mode === "client"
        ? lanStatus.running ? `Client linked to ${lanStatus.host}:${lanStatus.port}` : "Client stopped"
        : "LAN bridge off"
    : "LAN bridge unavailable";

  useEffect(() => {
    let mounted = true;
    void window.electronAPI?.lanGetStatus?.().then((status) => {
      if (!mounted) return;
      setLanStatus(status);
      setLanHostInput(status.host);
      setLanPortInput(String(status.port || 38741));
      setLanTokenInput(status.token);
    });
    const unsubscribe = window.electronAPI?.lanOnStatus?.((status) => {
      setLanStatus(status);
      setLanHostInput((previous) => previous || status.host);
      setLanPortInput(String(status.port || 38741));
      setLanTokenInput((previous) => previous || status.token);
    });
    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!liveTraineeScore) {
      return;
    }

    setPersistedTraineeScores((previous) => {
      const next = {
        ...previous,
        [liveTraineeScore.traineeId]: liveTraineeScore
      };
      savePersistedTraineeScores(next);
      return next;
    });
  }, [liveTraineeScore]);

  const updateState = (next: Partial<ManagerDashboardState>) => {
    setDashboardState((previous) => ({ ...previous, ...next }));
  };

  const handleExportReport = async (userId: string) => {
    const card = employeeCards.find(({ user }) => user.id === userId);
    if (!card) return;
    setExportingId(userId);
    setExportMessage(null);
    try {
      const userAssignments = assignmentSnapshots.filter((snapshot) => {
        const assignment = trainingAssignments.find((a) => a.id === snapshot.assignmentId);
        return assignment?.traineeId === userId;
      });
      const liveScore = liveTraineeScore?.traineeId === userId ? liveTraineeScore : null;
      const liveModule = liveScore?.moduleId ? TRAINING_MODULES.find((m) => m.id === liveScore.moduleId) : null;
      const data: TraineeReportData = {
        traineeName: card.user.displayName,
        traineeUsername: card.user.username,
        exportedAt: Date.now(),
        sessions: card.reports.length,
        averageScore: card.averageOverall,
        latestSessionGrade: card.latestReport?.overall.grade ?? null,
        latestSessionDate: card.latestReport?.endedAt ?? null,
        liveScore: liveScore ? {
          moduleTitle: liveModule?.title ?? "Active module",
          pct: liveScore.pct,
          total: liveScore.total,
          updatedAt: liveScore.updatedAt
        } : null,
        assignments: userAssignments.map((snapshot) => ({
          moduleTitle: snapshot.module.title,
          moduleFocus: snapshot.module.focus,
          difficulty: snapshot.module.requiredDifficulty ?? "learner",
          status: snapshot.status,
          completionPercent: snapshot.completionPercent,
          bestScore: snapshot.bestMatchingReport?.moduleScore ?? snapshot.bestMatchingReport?.overall.score ?? null,
          dueAt: snapshot.dueAt,
          scoreCards: snapshot.bestMatchingReport?.moduleScoreCards ?? [],
          overdueZeroScore: "overdueZeroScore" in snapshot ? (snapshot as { overdueZeroScore: boolean }).overdueZeroScore : false
        }))
      };
      const html = buildReportHtml(data);
      const safeName = card.user.displayName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const filename = `report_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`;
      const result = await window.electronAPI?.exportTraineeReport?.({ html, filename });
      if (result?.ok) {
        setExportMessage(`Saved: ${filename}`);
      } else {
        setExportMessage(`Export failed: ${result?.error ?? "unknown error"}`);
      }
    } catch (err) {
      setExportMessage(`Export failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setExportingId(null);
    }
  };

  const applySelectedModule = (moduleId: string) => {
    const module = TRAINING_MODULES.find((entry) => entry.id === moduleId);
    updateState({
      selectedModuleId: moduleId,
      selectedModuleDifficulty: module?.requiredDifficulty ?? dashboardState.selectedModuleDifficulty,
      error: null
    });
  };

  const resetAddEmployeeForm = () => {
    updateState({
      newEmployeeName: "",
      newEmployeeUsername: "",
      newEmployeePassword: "",
      selectedEmployeeId: "",
      error: null
    });
  };

  return (
    <main className="manager-shell">
      <header className="manager-topbar">
        <div className="manager-brand">
          <p className="eyebrow">Sterling Fiduciary Group</p>
          <h1>Fiduciary Duty — Manager</h1>
          <p className="manager-subtitle">Coaching visibility, module assignment, and safe trainee support areas.</p>
        </div>
        <div className="manager-topbar-actions">
          <div className="manager-badge">
            <span>Manager Admin</span>
            <strong>{currentUser.displayName}</strong>
          </div>
          <div className="manager-badge">
            <span>Module Preview</span>
            <select
              value={dashboardState.selectedModuleId}
              onChange={(event) => applySelectedModule(event.target.value)}
            >
              {TRAINING_MODULES.map((module) => (
                <option key={module.id} value={module.id}>{module.title}</option>
              ))}
            </select>
            <button
              type="button"
              className="control-btn"
              onClick={() => onLaunchModulePreview(
                dashboardState.selectedModuleId,
                dashboardState.selectedModuleDifficulty,
                selectedModule?.workspace === "mortgage-debt-planning" ? dashboardState.selectedJurisdictionCode : null
              )}
            >
              Launch
            </button>
          </div>
          <button type="button" className="control-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="panel manager-panel">
        <div className="panel-header">
          <h2>LAN Bridge</h2>
          <span className="panel-meta">{lanStatusLine}</span>
        </div>
        <div className="manager-panel-body manager-report-list">
          <div className="manager-form-grid">
            <label>
              Manager host/IP
              <input
                value={lanHostInput}
                onChange={(event) => setLanHostInput(event.target.value)}
                placeholder="Manager PC IP for trainee computers"
              />
            </label>
            <label>
              Port
              <input
                value={lanPortInput}
                onChange={(event) => setLanPortInput(event.target.value)}
                placeholder="38741"
              />
            </label>
            <label>
              Pairing token
              <input
                value={lanTokenInput}
                onChange={(event) => setLanTokenInput(event.target.value)}
                placeholder="Generated on host"
              />
            </label>
          </div>
          {lanMessage || lanStatus?.lastError ? (
            <div className={lanStatus?.lastError ? "auth-error" : "portfolio-summary-card manager-report-card"}>
              {lanStatus?.lastError ?? lanMessage}
            </div>
          ) : null}
          <div className="slot-actions">
            <button
              type="button"
              className="primary-btn manager-inline-btn"
              onClick={async () => {
                const status = await window.electronAPI?.lanStartHost?.({
                  port: Number(lanPortInput) || 38741,
                  token: lanTokenInput.trim() || null
                });
                if (status) {
                  setLanStatus(status);
                  setLanTokenInput(status.token);
                  setLanMessage("Manager host is running. Use one of the listed URLs plus this token on trainee computers.");
                }
              }}
            >
              Start Manager Host
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={async () => {
                const status = await window.electronAPI?.lanConfigureClient?.({
                  host: lanHostInput.trim(),
                  port: Number(lanPortInput) || 38741,
                  token: lanTokenInput.trim()
                });
                if (status) {
                  setLanStatus(status);
                  setLanMessage("This computer is now linked as a trainee client. Log out and let the trainee sign in normally.");
                }
              }}
            >
              Link This Computer To Host
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={async () => {
                const status = await window.electronAPI?.lanStop?.();
                if (status) {
                  setLanStatus(status);
                  setLanMessage("LAN bridge stopped on this computer.");
                }
              }}
            >
              Stop LAN Bridge
            </button>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Host addresses</span>
              <strong>{lanStatus?.reachableUrls.length ? lanStatus.reachableUrls.join(" | ") : "Start host to generate addresses"}</strong>
              <small>Works over Ethernet or Wi-Fi when Windows Firewall allows this app/port on the local network.</small>
            </div>
            <div className="comparison-card">
              <span>Connected trainee clients</span>
              <strong>{lanStatus?.connectedClients.length ?? 0}</strong>
              <small>{lanStatus?.connectedClients.map((client) => `${client.name} ${client.address}`).join(" | ") || "No clients seen yet"}</small>
            </div>
            <div className="comparison-card">
              <span>Retry queue</span>
              <strong>{lanStatus?.queuedEvents ?? 0} pending events</strong>
              <small>Client PCs keep unsent telemetry queued and retry until the Manager PC is reachable.</small>
            </div>
          </div>
        </div>
      </section>

      {managerNeedsPasswordChange ? (
        <section className="panel manager-password-panel">
          <div className="panel-header">
            <h2>Change Admin Password</h2>
          </div>
          <div className="manager-password-grid">
            <label>
              Current password
              <input
                type="password"
                value={dashboardState.passwordChangeCurrent}
                onChange={(event) => updateState({ passwordChangeCurrent: event.target.value, error: null })}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={dashboardState.passwordChangeNext}
                onChange={(event) => updateState({ passwordChangeNext: event.target.value, error: null })}
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={dashboardState.passwordChangeConfirm}
                onChange={(event) => updateState({ passwordChangeConfirm: event.target.value, error: null })}
              />
            </label>
            {dashboardState.error ? <div className="auth-error">{dashboardState.error}</div> : null}
            <button
              type="button"
              className="primary-btn manager-inline-btn"
              onClick={async () => {
                if (!dashboardState.passwordChangeNext || dashboardState.passwordChangeNext.length < 6) {
                  updateState({ error: "Choose a stronger password with at least 6 characters." });
                  return;
                }
                if (dashboardState.passwordChangeNext !== dashboardState.passwordChangeConfirm) {
                  updateState({ error: "The new passwords do not match." });
                  return;
                }
                try {
                  await onChangeManagerPassword(dashboardState.passwordChangeCurrent, dashboardState.passwordChangeNext);
                  updateState({
                    passwordChangeCurrent: "",
                    passwordChangeNext: "",
                    passwordChangeConfirm: "",
                    error: null
                  });
                } catch (error) {
                  updateState({ error: error instanceof Error ? error.message : "Unable to update password." });
                }
              }}
            >
              Update Password
            </button>
          </div>
        </section>
      ) : null}

      <div className="manager-grid">
        <section className="panel manager-panel">
          <div className="panel-header">
            <h2>Employee Accounts</h2>
          </div>
          <div className="manager-panel-body">
            <div className="manager-form-grid">
              <label>
                Employee name
                <input
                  value={dashboardState.newEmployeeName}
                  onChange={(event) => updateState({ newEmployeeName: event.target.value, error: null })}
                />
              </label>
              <label>
                Username
                <input
                  value={dashboardState.newEmployeeUsername}
                  onChange={(event) => updateState({ newEmployeeUsername: event.target.value, error: null })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={dashboardState.newEmployeePassword}
                  onChange={(event) => updateState({ newEmployeePassword: event.target.value, error: null })}
                />
              </label>
            </div>
            {dashboardState.error ? <div className="auth-error">{dashboardState.error}</div> : null}
            <div className="slot-actions">
              <button
                type="button"
                className="primary-btn manager-inline-btn"
                onClick={async () => {
                  if (!dashboardState.newEmployeeName.trim() || !dashboardState.newEmployeeUsername.trim() || !dashboardState.newEmployeePassword.trim()) {
                    updateState({ error: "Name, username, and password are all required." });
                    return;
                  }
                  try {
                    await onAddEmployee({
                      displayName: dashboardState.newEmployeeName.trim(),
                      username: dashboardState.newEmployeeUsername.trim(),
                      password: dashboardState.newEmployeePassword
                    });
                    resetAddEmployeeForm();
                  } catch (error) {
                    updateState({ error: error instanceof Error ? error.message : "Unable to add employee." });
                  }
                }}
              >
                Add Employee
              </button>
            </div>

            <div className="manager-form-grid">
              <label>
                Assign to employee
                <select
                  value={dashboardState.selectedEmployeeId}
                  onChange={(event) => updateState({ selectedEmployeeId: event.target.value, error: null })}
                >
                  <option value="">Select employee</option>
                  {employeeUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                  ))}
                </select>
              </label>
              <label>
                Module
                <select
                  value={dashboardState.selectedModuleId}
                  onChange={(event) => applySelectedModule(event.target.value)}
                >
                  {TRAINING_MODULES.map((module) => (
                    <option key={module.id} value={module.id}>{module.title}</option>
                  ))}
                </select>
              </label>
              <label>
                Difficulty
                <select
                  value={dashboardState.selectedModuleDifficulty}
                  onChange={(event) => updateState({ selectedModuleDifficulty: event.target.value as PlayDifficulty, error: null })}
                >
                  {(["learner", "trainee", "associate", "advisor", "senior"] as const).map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{DIFFICULTY_LABELS[difficulty]}</option>
                  ))}
                </select>
              </label>
              {selectedModule?.workspace === "mortgage-debt-planning" ? (
                <label>
                  State law overlay
                  <select
                    value={dashboardState.selectedJurisdictionCode}
                    onChange={(event) => updateState({ selectedJurisdictionCode: event.target.value, error: null })}
                  >
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label>
                Due date
                <input
                  type="date"
                  value={dashboardState.assignmentDueDate}
                  onChange={(event) => updateState({ assignmentDueDate: event.target.value, error: null })}
                />
              </label>
            </div>
            <div className="slot-actions">
              <button
                type="button"
                className="control-btn active"
                onClick={() => {
                  if (!dashboardState.selectedEmployeeId || !dashboardState.selectedModuleId) {
                    updateState({ error: "Choose an employee and module before assigning curriculum." });
                    return;
                  }

                  const dueAt = dashboardState.assignmentDueDate ? new Date(`${dashboardState.assignmentDueDate}T12:00:00`).getTime() : null;
                  onAssignModule(
                    dashboardState.selectedEmployeeId,
                    dashboardState.selectedModuleId,
                    dashboardState.selectedModuleDifficulty,
                    dueAt,
                    selectedModule?.workspace === "mortgage-debt-planning" ? dashboardState.selectedJurisdictionCode : null
                  );
                  updateState({ assignmentDueDate: "", error: null });
                }}
              >
                Assign Module
              </button>
            </div>
            <div className="manager-employee-list">
              {employeeCards.length === 0 ? (
                <div className="empty-state">No employee accounts have been created yet.</div>
              ) : employeeCards.map(({ user, latestReport, averageOverall, reports, trainee }) => (
                <div
                  key={user.id}
                  className={`slot-card manager-employee-card ${selectedEmployeeId === user.id ? "manager-employee-card--selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => updateState({ selectedEmployeeId: user.id, error: null })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      updateState({ selectedEmployeeId: user.id, error: null });
                    }
                  }}
                >
                  <div className="slot-copy">
                    <strong>{user.displayName}</strong>
                    <span>{user.username}</span>
                    <span>{trainee?.role ?? "Trainee"} | {reports.length} sessions logged</span>
                    <span>{latestReport ? `Latest ${latestReport.overall.grade} on ${formatStamp(latestReport.endedAt)}` : "No completed sessions yet"}</span>
                    <span>{reports.length ? `Average readiness ${averageOverall.toFixed(0)}/100` : "Awaiting first report"}</span>
                  </div>
                  <div className="slot-actions">
                    <button type="button" className="control-btn" onClick={(event) => {
                      event.stopPropagation();
                      onRemoveEmployee(user.id);
                    }}>
                      Remove
                    </button>
                    <button type="button" className="control-btn" disabled={exportingId === user.id} onClick={(event) => {
                      event.stopPropagation();
                      void handleExportReport(user.id);
                    }}>
                      {exportingId === user.id ? "Exporting…" : "Export PDF"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel manager-panel">
          <div className="panel-header">
            <h2>Coaching Snapshot</h2>
            <span className="panel-meta" style={{ color: liveTraineeScore ? "var(--green)" : "var(--muted)", fontSize: "0.68rem" }}>
              {liveTraineeScore ? `Live | ${selectedEmployeeName}` : `Awaiting session | ${selectedEmployeeName}`}
            </span>
            <button type="button" className="control-btn" style={{ marginLeft: "auto" }} onClick={() => {
              void window.electronAPI?.exportOpenReportsFolder?.();
            }}>
              Open Reports Folder
            </button>
          </div>
          {exportMessage && (
            <div style={{ padding: "6px 12px", fontSize: "0.75rem", color: exportMessage.startsWith("Saved") ? "var(--color-positive)" : "var(--color-negative)", borderBottom: "1px solid var(--color-border)" }}>
              {exportMessage}
            </div>
          )}
          <div className="manager-panel-body manager-report-list">
            {displayedEmployeeCards.length === 0 ? (
              <div className="empty-state">Create employee accounts to begin tracking progress.</div>
            ) : displayedEmployeeCards.map(({ user, latestReport, latestModuleReport, reports }) => {
              const isLive = liveTraineeScore?.traineeId === user.id;
              const liveModule = isLive && liveTraineeScore?.moduleId
                ? TRAINING_MODULES.find((module) => module.id === liveTraineeScore.moduleId)
                : null;
              const persistedScore = persistedTraineeScores[user.id] ?? null;
              const persistedModule = persistedScore?.moduleId
                ? TRAINING_MODULES.find((module) => module.id === persistedScore.moduleId)
                : null;
              return (
                <div key={`${user.id}-report`} className="portfolio-summary-card manager-report-card">
                  <span>{user.displayName}{isLive ? <span style={{ marginLeft: 8, color: "var(--green)", fontSize: "0.62rem" }}>● IN SESSION</span> : null}</span>
                  {isLive ? (
                    <>
                      <strong style={{ color: liveTraineeScore.pct >= 70 ? "var(--green)" : liveTraineeScore.pct >= 40 ? "var(--amber)" : liveTraineeScore.total === 0 ? "var(--muted)" : "var(--red)" }}>
                        {liveTraineeScore.pct}/100 module score
                      </strong>
                      <small>{liveModule?.title ?? "Active module"} | {liveTraineeScore.total} scored interactions</small>
                      <small>Live score updates from the assigned module workspace.</small>
                    </>
                  ) : persistedScore ? (
                    <>
                      <strong style={{ color: persistedScore.pct >= 70 ? "var(--green)" : persistedScore.pct >= 40 ? "var(--amber)" : persistedScore.total === 0 ? "var(--muted)" : "var(--red)" }}>
                        {persistedScore.pct}/100 last module score
                      </strong>
                      <small>{persistedModule?.title ?? "Last active module"} | {persistedScore.total} scored interactions</small>
                      <small>Last saved {formatStamp(persistedScore.updatedAt)}. Restored after restart until new answers arrive.</small>
                    </>
                  ) : (
                    <>
                      <strong>{latestModuleReport ? `${latestModuleReport.moduleTitle} — ${latestModuleReport.correctAnswers ?? latestModuleReport.moduleScore ?? "—"} correct` : latestReport ? `${latestReport.correctAnswers}/${latestReport.answeredQuestions} correct` : "No score yet"}</strong>
                      <small>
                        {latestModuleReport
                          ? `${DIFFICULTY_LABELS[latestModuleReport.difficulty]} | ${latestModuleReport.moduleSummary ?? "Module completion recorded"}`
                          : latestReport
                          ? `${DIFFICULTY_LABELS[latestReport.difficulty]} | ${latestReport.studyAccuracy.toFixed(0)}% accuracy | ${latestReport.clientCount} retained / ${latestReport.lostClientCount} lost`
                          : "Waiting for the first completed session."}
                      </small>
                      <small>{reports.length} logged sessions</small>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel manager-panel">
          <div className="panel-header">
            <h2>Difficulty Guide</h2>
          </div>
          <div className="manager-panel-body manager-report-list">
            {(["learner", "trainee", "associate", "advisor", "senior"] as const).map((difficulty) => (
              <div key={difficulty} className="portfolio-summary-card manager-report-card">
                <span>{DIFFICULTY_LABELS[difficulty]}</span>
                <strong>{difficulty === dashboardState.selectedModuleDifficulty ? "Selected for assignment" : "Available"}</strong>
                <small>{DIFFICULTY_DESCRIPTIONS[difficulty]}</small>
              </div>
            ))}
          </div>
        </section>

        {selectedModule?.workspace === "mortgage-debt-planning" && selectedMortgageStateProfile ? (
          <section className="panel manager-panel">
            <div className="panel-header">
              <h2>Mortgage State Overlay</h2>
            </div>
            <div className="manager-panel-body manager-report-list">
              <div className="portfolio-summary-card manager-report-card">
                <span>{selectedMortgageStateProfile.name}</span>
                <strong>{selectedMortgageStateProfile.foreclosureTrack}</strong>
                <small>{selectedMortgageStateProfile.deficiencyExposure} | {selectedMortgageStateProfile.closingStyle}</small>
                <small>{selectedMortgageStateProfile.trainingNote}</small>
              </div>
              <div className="portfolio-summary-card manager-report-card">
                <span>First-time buyer coaching</span>
                <strong>Assigned state emphasis</strong>
                <small>{selectedMortgageStateProfile.firstTimeBuyerFocus}</small>
              </div>
              <div className="portfolio-summary-card manager-report-card">
                <span>FHA vs conventional coaching</span>
                <strong>Assigned state emphasis</strong>
                <small>{selectedMortgageStateProfile.fhaConventionalFocus}</small>
              </div>
              <div className="portfolio-summary-card manager-report-card">
                <span>Investor and rate-lock coaching</span>
                <strong>Assigned state emphasis</strong>
                <small>{selectedMortgageStateProfile.investorPropertyFocus}</small>
                <small>{selectedMortgageStateProfile.rateLockFocus}</small>
              </div>
            </div>
          </section>
        ) : null}

        <section className="panel manager-panel">
          <div className="panel-header">
            <h2>Curriculum Assignments</h2>
            <span className="panel-meta">{selectedEmployeeName}</span>
          </div>
          <div className="manager-panel-body manager-report-list">
            {displayedAssignmentSnapshots.length === 0 ? (
              <div className="empty-state">Assigned modules will appear here with readiness progress and completion status.</div>
            ) : displayedAssignmentSnapshots.map((snapshot) => {
              const assignment = trainingAssignments.find((entry) => entry.id === snapshot.assignmentId);
              const employeeName = employeeUsers.find((user) => user.id === assignment?.traineeId)?.displayName
                ?? trainees.find((entry) => entry.id === assignment?.traineeId)?.name
                ?? "Assigned trainee";

              return (
              <div key={snapshot.assignmentId} className="portfolio-summary-card manager-report-card">
                  <span>{employeeName}</span>
                  <strong>{snapshot.module.title}</strong>
                  <small>{snapshot.module.focus} | {DIFFICULTY_LABELS[snapshot.module.requiredDifficulty ?? "learner"]} | {snapshot.status.replace("-", " ")} | {snapshot.completionPercent}% ready</small>
                  {snapshot.jurisdictionCode ? <small>State overlay: {getStateName(snapshot.jurisdictionCode)}</small> : null}
                  {snapshot.assignedMortgageRate !== null ? <small>Locked rate: {formatMortgageRate(snapshot.assignedMortgageRate)}</small> : null}
                  {snapshot.assignedMortgageScenarioId ? <small>Locked scenario: {formatScenarioTitle(snapshot.assignedMortgageScenarioId)}</small> : null}
                  <small>{snapshot.module.completionLabel}</small>
                  <small>{snapshot.dueAt ? `Due ${new Date(snapshot.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No due date"}{snapshot.bestMatchingReport ? ` | Best ${snapshot.bestMatchingReport.moduleScore ?? snapshot.bestMatchingReport.overall.score}/100` : ""}</small>
                  {"answeredVsRequired" in snapshot && (snapshot as { answeredVsRequired: { answered: number; required: number } }).answeredVsRequired.required > 0 ? (
                    <small style={{ color: (snapshot as { answeredVsRequired: { answered: number; required: number } }).answeredVsRequired.answered >= (snapshot as { answeredVsRequired: { answered: number; required: number } }).answeredVsRequired.required ? "var(--color-positive)" : "var(--color-accent)" }}>
                      Questions answered: {(snapshot as { answeredVsRequired: { answered: number; required: number } }).answeredVsRequired.answered} / {(snapshot as { answeredVsRequired: { answered: number; required: number } }).answeredVsRequired.required} required
                    </small>
                  ) : null}
                  {"overdueZeroScore" in snapshot && (snapshot as { overdueZeroScore: boolean }).overdueZeroScore ? (
                    <small style={{ color: "var(--color-negative)", fontWeight: 700 }}>
                      ⚠ OVERDUE — Minimum questions not completed by due date. Score: 0%
                    </small>
                  ) : null}
                  {snapshot.bestMatchingReport?.moduleId === snapshot.module.id && snapshot.bestMatchingReport.moduleScore !== null ? (
                    <>
                      <small>Module score: {"overdueZeroScore" in snapshot && (snapshot as { overdueZeroScore: boolean }).overdueZeroScore ? "0" : snapshot.bestMatchingReport.moduleScore}/100{("overdueZeroScore" in snapshot && (snapshot as { overdueZeroScore: boolean }).overdueZeroScore) ? " (overdue penalty applied)" : ""}</small>
                      <small>{weakestAssessmentLine(snapshot.bestMatchingReport.moduleScoreCards) ?? "No coaching flags yet."}</small>
                      {snapshot.bestMatchingReport.moduleScoreCards.map((card) => (
                        <small key={`${snapshot.assignmentId}-${card.label}`}>{card.label}: {card.score}/100{card.summary ? ` | ${card.summary}` : ""}</small>
                      ))}
                    </>
                  ) : null}
                  <div className="slot-actions">
                    <button type="button" className="control-btn" onClick={() => onRemoveModule(snapshot.assignmentId)}>
                      Remove Module
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
