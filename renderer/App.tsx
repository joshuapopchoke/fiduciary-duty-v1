import { useEffect, useMemo, useState } from "react";
import { EmployeeAppView } from "../src/components/EmployeeAppView";
import { LoginScreen } from "../src/components/LoginScreen";
import { ManagerDashboard } from "../src/components/ManagerDashboard";
import { ManagerPreviewOverlay } from "../src/components/ManagerModulePreview";
import { ManagerTwoFactorScreen } from "../src/components/ManagerTwoFactorScreen";
import { authenticateMockUser, changeUserPassword, createEmployeeUser, loadMockUsers, removeEmployeeUser, saveMockUsers } from "../src/engine/mockAuthEngine";
import { updateAssignmentsFromReport } from "../src/engine/trainingCurriculumEngine";
import { useGameStore } from "../src/store/gameStore";
import { verifyTotp } from "../src/engine/totpEngine";
import type { AuthSession, User } from "../src/types/auth";
import type { PlayDifficulty, TraineeProfile, TrainingSessionReport } from "../src/types/gameState";
import type { LanBridgeReportEvent, LanBridgeTelemetryEvent } from "../src/types/lanBridge";

function buildTraineeProfile(user: User): TraineeProfile {
  return {
    id: user.id,
    name: user.displayName,
    role: user.role === "manager" ? "Manager" : "Trainee",
    createdAt: user.createdAt
  };
}

function makeEventId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [managerPreview, setManagerPreview] = useState<{ moduleId: string; difficulty: PlayDifficulty; jurisdictionCode: string | null } | null>(null);
  const upsertTrainee = useGameStore((state) => state.upsertTrainee);
  const removeTrainee = useGameStore((state) => state.removeTrainee);
  const setActiveTrainee = useGameStore((state) => state.setActiveTrainee);
  const assignTrainingModule = useGameStore((state) => state.assignTrainingModule);
  const removeTrainingModule = useGameStore((state) => state.removeTrainingModule);
  const trainees = useGameStore((state) => state.trainees);
  const trainingAssignments = useGameStore((state) => state.trainingAssignments);
  const trainingReports = useGameStore((state) => state.trainingReports);
  const liveTraineeScore = useGameStore((state) => state.liveTraineeScore);
  
  useEffect(() => {
    users
      .filter((user) => user.role === "employee")
      .forEach((user) => upsertTrainee(buildTraineeProfile(user)));
  }, [upsertTrainee, users]);

  useEffect(() => {
    if (!window.electronAPI?.lanOnSnapshot) {
      return;
    }

    return window.electronAPI.lanOnSnapshot((snapshot) => {
      setUsers(snapshot.users);
      saveMockUsers(snapshot.users);
      useGameStore.setState({
        trainees: snapshot.trainees,
        trainingAssignments: snapshot.trainingAssignments,
        trainingReports: snapshot.trainingReports
      });
    });
  }, []);

  useEffect(() => {
    if (!window.electronAPI?.lanOnTelemetry) {
      return;
    }

    return window.electronAPI.lanOnTelemetry((event) => {
      useGameStore.setState({
        liveTraineeScore: {
          traineeId: event.traineeId,
          moduleId: event.moduleId,
          correct: event.correct,
          total: event.total,
          pct: event.pct,
          updatedAt: event.updatedAt
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!window.electronAPI?.lanOnReport) {
      return;
    }

    return window.electronAPI.lanOnReport((event) => {
      useGameStore.setState((state) => {
        if (state.trainingReports.some((report) => report.id === event.report.id)) {
          return {};
        }
        const trainingReports = [event.report, ...state.trainingReports].slice(0, 100);
        return {
          trainingReports,
          trainingAssignments: updateAssignmentsFromReport(state.trainingAssignments, event.report)
        };
      });
    });
  }, []);

  useEffect(() => {
    if (session?.role !== "manager" || !session.twoFactorVerified || !window.electronAPI?.lanPublishHostSnapshot) {
      return;
    }

    void window.electronAPI.lanPublishHostSnapshot({
      users,
      trainees,
      trainingAssignments,
      trainingReports,
      updatedAt: Date.now()
    });
  }, [session?.role, session?.twoFactorVerified, users, trainees, trainingAssignments, trainingReports]);

  useEffect(() => {
    if (!liveTraineeScore || !window.electronAPI?.lanPushTelemetry) {
      return;
    }

    const event: LanBridgeTelemetryEvent = {
      id: makeEventId("telemetry"),
      traineeId: liveTraineeScore.traineeId,
      moduleId: liveTraineeScore.moduleId,
      correct: liveTraineeScore.correct,
      total: liveTraineeScore.total,
      pct: liveTraineeScore.pct,
      updatedAt: liveTraineeScore.updatedAt,
      clientName: window.navigator.userAgent
    };
    void window.electronAPI.lanPushTelemetry(event);
  }, [liveTraineeScore]);

  useEffect(() => {
    const latestReport = trainingReports[0] as TrainingSessionReport | undefined;
    if (!latestReport || !window.electronAPI?.lanPushReport) {
      return;
    }

    const event: LanBridgeReportEvent = {
      id: makeEventId("report"),
      report: latestReport,
      clientName: window.navigator.userAgent,
      updatedAt: Date.now()
    };
    void window.electronAPI.lanPushReport(event);
  }, [trainingReports]);

  const managerUser = useMemo(() => users.find((user) => user.role === "manager") ?? null, [users]);

  useEffect(() => {
    let mounted = true;

    void loadMockUsers()
      .then((loadedUsers) => {
        if (!mounted) {
          return;
        }

        setUsers(loadedUsers);
        setAuthReady(true);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setAuthError("Unable to initialize local authentication.");
        setAuthReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Scale is handled by the inline script in index.html.

  const handleLogin = async (username: string, password: string) => {
    const result = await authenticateMockUser(users, username, password);
    setUsers(result.users);
    saveMockUsers(result.users);

    if (!result.session) {
      setAuthError(result.error ?? "Invalid username or password.");
      return;
    }

    setAuthError(null);
    setTwoFactorError(null);
    setSession(result.session);

    if (result.session.role === "employee") {
      const traineeUser = result.users.find((user) => user.id === result.session?.userId);
      if (traineeUser) {
        upsertTrainee(buildTraineeProfile(traineeUser));
        setActiveTrainee(traineeUser.id);
      }
    }
  };

  const handleLogout = () => {
    setSession(null);
    setAuthError(null);
    setTwoFactorError(null);
    setManagerPreview(null);
  };

  const handleVerifyManagerTwoFactor = async (token: string) => {
    if (!session || session.role !== "manager") {
      return;
    }

    const currentManager = users.find((user) => user.id === session.userId) ?? null;
    if (!currentManager?.twoFactorSecret) {
      setTwoFactorError("Manager two-factor enrollment is unavailable.");
      return;
    }

    const verified = await verifyTotp(currentManager.twoFactorSecret, token);
    if (!verified) {
      setTwoFactorError("The verification code was invalid or expired.");
      return;
    }

    setTwoFactorError(null);
    setSession((previous) => previous
      ? {
          ...previous,
          twoFactorVerified: true
        }
      : previous);
  };

  const handleAddEmployee = async (input: { displayName: string; username: string; password: string }) => {
    const nextUsers = await createEmployeeUser(users, input);
    const newUser = nextUsers[nextUsers.length - 1];
    setUsers(nextUsers);
    saveMockUsers(nextUsers);
    upsertTrainee(buildTraineeProfile(newUser));
  };

  const handleRemoveEmployee = (userId: string) => {
    const nextUsers = removeEmployeeUser(users, userId);
    setUsers(nextUsers);
    saveMockUsers(nextUsers);
    removeTrainee(userId);
  };

  const handleChangeManagerPassword = async (currentPassword: string, nextPassword: string) => {
    if (!managerUser) {
      throw new Error("Manager account is unavailable.");
    }

    const nextUsers = await changeUserPassword(users, managerUser.id, nextPassword, currentPassword);
    setUsers(nextUsers);
    saveMockUsers(nextUsers);
    setSession((previous) => previous && previous.userId === managerUser.id
      ? {
          ...previous,
          mustChangePassword: false
        }
      : previous);
  };

  const handleAssignModule = (
    traineeId: string,
    moduleId: string,
    assignedDifficulty: PlayDifficulty,
    dueAt: number | null,
    jurisdictionCode: string | null
  ) => {
    assignTrainingModule(traineeId, moduleId, assignedDifficulty, dueAt, jurisdictionCode);
  };

  if (!authReady) {
    return <LoginScreen error={null} onLogin={() => undefined} loading />;
  }

  if (!session) {
    return <LoginScreen error={authError} onLogin={handleLogin} />;
  }

  if (session.role === "manager") {
    const currentManager = users.find((user) => user.id === session.userId) ?? managerUser;
    if (!currentManager) {
      return <LoginScreen error="Manager account could not be loaded." onLogin={handleLogin} />;
    }

    if (!session.twoFactorVerified) {
      return (
        <ManagerTwoFactorScreen
          managerUser={currentManager}
          error={twoFactorError}
          onVerify={handleVerifyManagerTwoFactor}
          onBack={handleLogout}
        />
      );
    }

    if (managerPreview) {
      return (
        <>
          <EmployeeAppView onLogout={() => setManagerPreview(null)} />
          <ManagerPreviewOverlay
            difficulty={managerPreview.difficulty}
            onDifficultyChange={(d) => {
              useGameStore.getState().setDifficulty(d);
              setManagerPreview((prev) => prev ? { ...prev, difficulty: d } : prev);
            }}
            onExit={() => setManagerPreview(null)}
          />
        </>
      );
    }

    return (
      <ManagerDashboard
        currentUser={currentManager}
        users={users}
        onLogout={handleLogout}
        onAddEmployee={handleAddEmployee}
        onRemoveEmployee={handleRemoveEmployee}
        onChangeManagerPassword={handleChangeManagerPassword}
        onAssignModule={handleAssignModule}
        onRemoveModule={removeTrainingModule}
        onLaunchModulePreview={(moduleId, assignedDifficulty, jurisdictionCode) => {
          const previewTraineeId = "manager-preview-trainee";
          upsertTrainee({ id: previewTraineeId, name: "Manager Preview", role: "Manager", createdAt: Date.now() });
          setActiveTrainee(previewTraineeId);
          assignTrainingModule(previewTraineeId, moduleId, assignedDifficulty, null, jurisdictionCode);
          useGameStore.getState().setDifficulty(assignedDifficulty);
          setManagerPreview({ moduleId, difficulty: assignedDifficulty, jurisdictionCode });
        }}
      />
    );
  }

  return <EmployeeAppView onLogout={handleLogout} />;
}
