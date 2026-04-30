import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { CLIENTS } from "../data/clients";
import {
  buildAssignmentSnapshots,
  buildModuleScoreCards,
  computeModuleScore,
  moduleReachedCompletion
} from "../engine/trainingCurriculumEngine";
import { buildTrainingPerformanceSummary } from "../engine/trainingScoreEngine";
import { EmployeeModuleWorkspace } from "./EmployeeModuleWorkspace";
import { ModuleCompletionOverlay } from "./ModuleCompletionOverlay";
import { ModuleSelectionScreen } from "./ModuleSelectionScreen";
import { ModuleUnassignedScreen } from "./ModuleUnassignedScreen";
import { TopBar } from "./TopBar";
import { DesktopShell } from "./desktop/DesktopShell";
import { MODULE_REGISTRY } from "./desktop/moduleRegistry";
import { DESKTOP_ICONS } from "./desktop/desktopIcons";
import { PhishingForScamsPanel } from "./PhishingForScamsPanel";
import { useGameStore } from "../store/gameStore";
import { useWindowStore } from "../store/windowSlice";

const AuditOverlay = lazy(() => import("./AuditOverlay").then((module) => ({ default: module.AuditOverlay })));
const AccountTransferOverlay = lazy(() => import("./AccountTransferOverlay").then((module) => ({ default: module.AccountTransferOverlay })));
const BehaviorEventOverlay = lazy(() => import("./BehaviorEventOverlay").then((module) => ({ default: module.BehaviorEventOverlay })));
const ClientMeetingOverlay = lazy(() => import("./ClientMeetingOverlay").then((module) => ({ default: module.ClientMeetingOverlay })));
const CycleRecapOverlay = lazy(() => import("./CycleRecapOverlay").then((module) => ({ default: module.CycleRecapOverlay })));
const DocumentationOverlay = lazy(() => import("./DocumentationOverlay").then((module) => ({ default: module.DocumentationOverlay })));
const InsuranceDialogueOverlay = lazy(() => import("./InsuranceDialogueOverlay").then((module) => ({ default: module.InsuranceDialogueOverlay })));
const OnboardingOverlay = lazy(() => import("./OnboardingOverlay").then((module) => ({ default: module.OnboardingOverlay })));
const OperationsRequestOverlay = lazy(() => import("./OperationsRequestOverlay").then((module) => ({ default: module.OperationsRequestOverlay })));
const PlayerComplianceOverlay = lazy(() => import("./PlayerComplianceOverlay").then((module) => ({ default: module.PlayerComplianceOverlay })));
const RecommendationDialogueOverlay = lazy(() => import("./RecommendationDialogueOverlay").then((module) => ({ default: module.RecommendationDialogueOverlay })));
const SessionEndScreen = lazy(() => import("./SessionEndScreen").then((module) => ({ default: module.SessionEndScreen })));
const SupervisionRequestOverlay = lazy(() => import("./SupervisionRequestOverlay").then((module) => ({ default: module.SupervisionRequestOverlay })));

interface EmployeeAppViewProps {
  onLogout: () => void;
}

function formatAssignmentScenarioTitle(value: string | null) {
  if (!value) {
    return null;
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function workspaceUsesTelemetry(workspace: string | null | undefined) {
  return (
    workspace === "client-meeting-readiness" ||
    workspace === "phishing-scams-trainee" ||
    workspace === "phishing-scams-it" ||
    workspace === "retirement-planning" ||
    workspace === "qualified-plans" ||
    workspace === "estate-planning" ||
    workspace === "insurance-planning" ||
    workspace === "tax-planning" ||
    workspace === "suitability-client-fit" ||
    workspace === "bank-lending" ||
    workspace === "mortgage-debt-planning"
  );
}

function workspaceUsesDesktopShell(workspace: string | null | undefined) {
  return (
    workspace === "phishing-scams-trainee" ||
    workspace === "phishing-scams-it"
  );
}

function mortgageScenarioClientId(scenarioId: string | null) {
  switch (scenarioId) {
    case "first-time-buyer":
    case "fha-vs-conventional":
      return "first_home_family";
    case "investor-property":
      return "entrepreneur";
    case "rate-lock":
      return "young_pro";
    default:
      return null;
  }
}

interface ActivePhishingWorkspaceProps {
  variant: "trainee" | "it";
  onTelemetryChange: (telemetry: { score: number; scoreCards: { label: string; score: number }[]; answeredCount: number }) => void;
}

function ActivePhishingWorkspace({ variant, onTelemetryChange }: ActivePhishingWorkspaceProps) {
  return (
    <PhishingForScamsPanel
      variant={variant}
      onTelemetryChange={onTelemetryChange}
    />
  );
}

export function EmployeeAppView({ onLogout }: EmployeeAppViewProps) {
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const trainingAssignments = useGameStore((state) => state.trainingAssignments);
  const trainingReports = useGameStore((state) => state.trainingReports);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const initializeQuestionBank = useGameStore((state) => state.initializeQuestionBank);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  const togglePause = useGameStore((state) => state.togglePause);
  const isPaused = useGameStore((state) => state.isPaused);
  const selectClient = useGameStore((state) => state.selectClient);
  const clients = useGameStore((state) => state.clients);
  const activeClientId = useGameStore((state) => state.activeClientId);
  const activeQuestion = useGameStore((state) => state.activeQuestion);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const removedClientIds = useGameStore((state) => state.removedClientIds);
  const secMeterLevel = useGameStore((state) => state.secMeterLevel);
  const auditHistory = useGameStore((state) => state.auditHistory);
  const complianceStats = useGameStore((state) => state.complianceStats);
  const playerComplianceLevel = useGameStore((state) => state.playerComplianceLevel);
  const totalAum = useGameStore((state) => state.totalAum);
  const personalPortfolioUsd = useGameStore((state) => state.personalPortfolioUsd);
  const recordTrainingReport = useGameStore((state) => state.recordTrainingReport);
  const resetSecMeter = useGameStore((state) => state.resetSecMeter);
  const saveSecToAssignment = useGameStore((state) => state.saveSecToAssignment);
  const updateLiveTraineeScore = useGameStore((state) => state.updateLiveTraineeScore);
  const openDesktopWindow = useWindowStore((state) => state.openWindow);
  const focusDesktopWindow = useWindowStore((state) => state.focusWindow);
  const updateDesktopWindowComponentProps = useWindowStore((state) => state.updateWindowComponentProps);
  const desktopWindows = useWindowStore((state) => state.windows);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [launchedAssignmentId, setLaunchedAssignmentId] = useState<string | null>(null);
  const [completedAssignmentId, setCompletedAssignmentId] = useState<string | null>(null);
  const [autoBoundMortgageAssignmentId, setAutoBoundMortgageAssignmentId] = useState<string | null>(null);
  const [workspaceTelemetry, setWorkspaceTelemetry] = useState<{
    score: number;
    scoreCards: { label: string; score: number }[];
    answeredCount: number;
  }>({
    score: 0,
    scoreCards: [],
    answeredCount: 0
  });

  function handleTelemetryChange(telemetry: { score: number; scoreCards: { label: string; score: number }[]; answeredCount: number }) {
    setWorkspaceTelemetry(telemetry);
    if (launchedAssignmentId) {
      const assignment = trainingAssignments.find(a => a.id === launchedAssignmentId);
      const correct = Math.round((telemetry.score / 100) * telemetry.answeredCount);
      updateLiveTraineeScore(activeTraineeId, assignment?.moduleId ?? null, correct, telemetry.answeredCount);
    }
  }

  const [launchBaseline, setLaunchBaseline] = useState<{
    assignmentId: string;
    moduleScore: number;
    answeredQuestions: number;
  } | null>(null);

  const assignmentSnapshots = useMemo(
    () => buildAssignmentSnapshots(
      trainingAssignments.filter((assignment) => assignment.traineeId === activeTraineeId),
      trainingReports
    ),
    [activeTraineeId, trainingAssignments, trainingReports]
  );
  const activeAssignments = useMemo(
    () => assignmentSnapshots.filter((entry) => entry.status !== "completed"),
    [assignmentSnapshots]
  );

  const selectedAssignment = useMemo(
    () => activeAssignments.find((entry) => entry.assignmentId === selectedAssignmentId) ?? activeAssignments[0] ?? null,
    [activeAssignments, selectedAssignmentId]
  );
  const launchedAssignment = useMemo(
    () => activeAssignments.find((entry) => entry.assignmentId === launchedAssignmentId) ?? null,
    [activeAssignments, launchedAssignmentId]
  );

  const startingBook = useMemo(() => CLIENTS.reduce((total, client) => total + client.startingAum, 0), []);
  const answeredQuestions = questionOutcomes.length;
  const correctAnswers = questionOutcomes.filter((outcome) => outcome.correct).length;
  const studyAccuracy = answeredQuestions === 0 ? 0 : (correctAnswers / answeredQuestions) * 100;
  const trainingSummary = useMemo(() => buildTrainingPerformanceSummary({
    questionOutcomes,
    clients,
    removedClientIds,
    secMeterLevel,
    auditHistory,
    complianceStats,
    playerComplianceLevel,
    totalAum,
    startingBook,
    personalEquity: personalPortfolioUsd,
    startingPersonalEquity: 100000
  }), [
    auditHistory,
    clients,
    complianceStats,
    personalPortfolioUsd,
    playerComplianceLevel,
    questionOutcomes,
    removedClientIds,
    secMeterLevel,
    startingBook,
    totalAum
  ]);

  const moduleMetrics = useMemo(() => ({
    difficulty: activeDifficulty,
    studyAccuracy: workspaceUsesTelemetry(launchedAssignment?.module.workspace) ? workspaceTelemetry.score : studyAccuracy,
    answeredQuestions: workspaceUsesTelemetry(launchedAssignment?.module.workspace) ? workspaceTelemetry.answeredCount : answeredQuestions,
    summary: trainingSummary,
    workspaceScoreOverride: workspaceUsesTelemetry(launchedAssignment?.module.workspace) ? workspaceTelemetry.score : null,
    workspaceScoreCards: workspaceUsesTelemetry(launchedAssignment?.module.workspace) ? workspaceTelemetry.scoreCards : null
  }), [activeDifficulty, answeredQuestions, launchedAssignment, studyAccuracy, trainingSummary, workspaceTelemetry]);

  const moduleScore = launchedAssignment ? computeModuleScore(launchedAssignment.module, moduleMetrics) : 0;
  const moduleScoreCards = launchedAssignment ? buildModuleScoreCards(launchedAssignment.module, moduleMetrics) : [];
  const moduleShowsLaunchProgress = useMemo(() => {
    if (!launchedAssignment || !launchBaseline || launchBaseline.assignmentId !== launchedAssignment.assignmentId) {
      return false;
    }

    return (
      moduleScore > launchBaseline.moduleScore ||
      moduleMetrics.answeredQuestions > launchBaseline.answeredQuestions
    );
  }, [launchedAssignment, launchBaseline, moduleMetrics.answeredQuestions, moduleScore]);

  useEffect(() => {
    if (!selectedAssignmentId && selectedAssignment) {
      setSelectedAssignmentId(selectedAssignment.assignmentId);
    }
  }, [selectedAssignment, selectedAssignmentId]);

  useEffect(() => {
    if (launchedAssignmentId && !activeAssignments.some((entry) => entry.assignmentId === launchedAssignmentId)) {
      setLaunchedAssignmentId(null);
      setLaunchBaseline(null);
      setAutoBoundMortgageAssignmentId(null);
    }
  }, [activeAssignments, launchedAssignmentId]);

  useEffect(() => {
    if (launchedAssignment?.module.requiredDifficulty && launchedAssignment.module.requiredDifficulty !== activeDifficulty) {
      setDifficulty(launchedAssignment.module.requiredDifficulty);
    }
  }, [activeDifficulty, launchedAssignment, setDifficulty]);

  useEffect(() => {
    if (!launchedAssignment) {
      return;
    }

    const requiresClientContext =
      launchedAssignment.module.workspace === "exam-foundations" ||
      launchedAssignment.module.workspace === "suitability-client-fit" ||
      launchedAssignment.module.workspace === "retirement-planning" ||
      launchedAssignment.module.workspace === "mortgage-debt-planning" ||
      launchedAssignment.module.workspace === "bank-lending" ||
      launchedAssignment.module.workspace === "client-meeting-readiness";

    if (launchedAssignment.module.workspace === "mortgage-debt-planning" && autoBoundMortgageAssignmentId !== launchedAssignment.assignmentId) {
      const mappedClientId = mortgageScenarioClientId(launchedAssignment.assignedMortgageScenarioId);
      const mappedClientExists = mappedClientId ? clients.some((client) => client.id === mappedClientId) : false;
      if (mappedClientId && mappedClientExists && activeClientId !== mappedClientId) {
        setAutoBoundMortgageAssignmentId(launchedAssignment.assignmentId);
        void selectClient(mappedClientId);
        return;
      }
      if (mappedClientId && mappedClientExists) {
        setAutoBoundMortgageAssignmentId(launchedAssignment.assignmentId);
      }
    }

    if (requiresClientContext && clients[0] && (!activeClientId || activeClientId === "player")) {
      void selectClient(clients[0].id);
    }

    if (launchedAssignment.module.workspace === "exam-foundations" && !activeQuestion.question && clients[0]) {
      void selectClient(clients[0].id);
    }
  }, [activeClientId, activeQuestion.question, autoBoundMortgageAssignmentId, clients, launchedAssignment, selectClient]);

  useEffect(() => {
    if (!launchedAssignment || !launchedAssignment.module.endsWhenCompleted || launchedAssignment.status === "completed") {
      return;
    }

    if (!moduleShowsLaunchProgress) {
      return;
    }

    if (!moduleReachedCompletion(launchedAssignment.module, moduleMetrics)) {
      return;
    }

    recordTrainingReport({
      moduleId: launchedAssignment.module.id,
      moduleTitle: launchedAssignment.module.title,
      moduleScore,
      moduleSummary: launchedAssignment.module.completionLabel,
      moduleScoreCards: moduleScoreCards.map((card) => ({
        label: card.label,
        score: card.score,
        summary: card.summary ?? ""
      }))
    });
    if (!isPaused) {
      togglePause();
    }
    setCompletedAssignmentId(launchedAssignment.assignmentId);
  }, [isPaused, launchedAssignment, moduleMetrics, moduleShowsLaunchProgress, recordTrainingReport, togglePause]);

  useEffect(() => {
    if (!launchedAssignment) {
      return undefined;
    }

    const usesSharedTimer =
      launchedAssignment.module.workspace === "stock-game" ||
      launchedAssignment.module.workspace === "suitability-client-fit";

    if (!usesSharedTimer) {
      return undefined;
    }

    const timer = window.setInterval(() => tickTimer(), 1000);
    return () => window.clearInterval(timer);
  }, [launchedAssignment, tickTimer]);

  useEffect(() => {
    if (!launchedAssignment) {
      return;
    }

    void initializeQuestionBank(launchedAssignment.module.requiredDifficulty ?? activeDifficulty);
  }, [activeDifficulty, initializeQuestionBank, launchedAssignment]);

  if (activeAssignments.length === 0) {
    return <ModuleUnassignedScreen onLogout={onLogout} />;
  }

  if (!launchedAssignment) {
    return (
      <ModuleSelectionScreen
        assignments={activeAssignments}
        selectedAssignmentId={selectedAssignment?.assignmentId ?? null}
        onSelectAssignment={setSelectedAssignmentId}
        onLaunchAssignment={(assignmentId) => {
          const assignment = activeAssignments.find((entry) => entry.assignmentId === assignmentId) ?? null;
          const baselineMetrics = assignment ? {
            difficulty: assignment.module.requiredDifficulty ?? activeDifficulty,
            studyAccuracy,
            answeredQuestions,
            summary: trainingSummary,
            workspaceScoreOverride: null,
            workspaceScoreCards: null
          } : null;
          setWorkspaceTelemetry({ score: 0, scoreCards: [], answeredCount: 0 });
          const rawAssignment = trainingAssignments.find(a => a.id === assignmentId);
          resetSecMeter(rawAssignment?.savedSecLevel ?? 0);
          updateLiveTraineeScore(activeTraineeId, rawAssignment?.moduleId ?? null, 0, 0);
          setLaunchBaseline(
            assignment && baselineMetrics
              ? {
                  assignmentId,
                  moduleScore: computeModuleScore(assignment.module, baselineMetrics),
                  answeredQuestions
                }
              : null
          );
          setLaunchedAssignmentId(assignmentId);
        }}
        onLogout={onLogout}
      />
    );
  }

  const showPlannerTools = launchedAssignment.module.workspace === "stock-game";
  const showStockGameControls = launchedAssignment.module.workspace === "stock-game";
  const topBarTitle = showStockGameControls ? "Fiduciary Duty - Training" : `Fiduciary Duty - ${launchedAssignment.module.title}`;
  const assignmentRibbonCard =
    launchedAssignment.module.workspace === "mortgage-debt-planning" && launchedAssignment.assignedMortgageRate !== null
      ? {
          label: "Assigned File",
          title: `${(launchedAssignment.assignedMortgageRate * 100).toFixed(2)}% mortgage`,
          detail: formatAssignmentScenarioTitle(launchedAssignment.assignedMortgageScenarioId) ?? "Locked mortgage scenario"
        }
      : null;
  const focusedRibbonItems =
    launchedAssignment.module.workspace === "exam-foundations"
      ? ["score", "study", "trainee", "coach"] as const
      : launchedAssignment.module.workspace === "tax-planning"
        ? ["score", "rates", "trainee"] as const
        : launchedAssignment.module.workspace === "suitability-client-fit"
          ? ["score", "rates", "client", "trainee", "coach"] as const
          : launchedAssignment.module.workspace === "retirement-planning"
            ? ["score", "rates", "client", "trainee", "calendar"] as const
            : launchedAssignment.module.workspace === "mortgage-debt-planning"
              ? ["score", "rates", "assignment", "calendar"] as const
              : launchedAssignment.module.workspace === "bank-lending"
                ? ["score", "rates", "calendar"] as const
                : launchedAssignment.module.workspace === "qualified-plans"
                  ? ["score", "rates", "trainee"] as const
                  : launchedAssignment.module.workspace === "insurance-planning"
                    ? ["score", "rates", "trainee"] as const
                    : launchedAssignment.module.workspace === "estate-planning"
                      ? ["score", "rates", "trainee"] as const
                      : launchedAssignment.module.workspace === "phishing-scams-trainee" || launchedAssignment.module.workspace === "phishing-scams-it"
                        ? ["score", "trainee"] as const
                        : launchedAssignment.module.workspace === "client-meeting-readiness"
                          ? ["score", "trainee", "coach"] as const
                          : undefined;

  const showTradingOverlays =
    launchedAssignment.module.workspace === "stock-game" ||
    launchedAssignment.module.workspace === "suitability-client-fit";

  // Phishing modules render inside the desktop shell
  if (workspaceUsesDesktopShell(launchedAssignment.module.workspace)) {
    const phishingVariant = launchedAssignment.module.workspace === "phishing-scams-it" ? "it" : "trainee";

    const phishingRegistry = {
      ...MODULE_REGISTRY,
      "active-phishing-workspace": ActivePhishingWorkspace
    };

    const phishingIcons = DESKTOP_ICONS.map((icon) =>
      icon.id === "email"
        ? {
            ...icon,
            opensWindow: {
              ...icon.opensWindow,
              componentProps: {
                variant: phishingVariant,
                initialView: "email",
                onTelemetryChange: handleTelemetryChange
              }
            }
          }
        : icon
    );

    return (
      <>
        <TopBar
          brandTitle={topBarTitle}
          showPlannerTools={false}
          showDifficultyControls={false}
          showNewSessionButton={false}
          showDifficultyRibbon={false}
          showSessionManager={false}
          showReloadBank={false}
          visibleRibbonItems={focusedRibbonItems ? [...focusedRibbonItems] : undefined}
          assignmentRibbonCard={null}
          extraControls={(
            <>
              <button type="button" className="control-btn" onClick={() => setLaunchedAssignmentId(null)}>
                Main Menu
              </button>
              <button type="button" className="control-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        />
        <DesktopShell
          moduleRegistry={phishingRegistry}
          desktopIcons={phishingIcons}
          onLogout={onLogout}
          onMainMenu={() => setLaunchedAssignmentId(null)}
          showCmdPrompt={phishingVariant === "it"}
          onOpenCmdPrompt={() => {
            const existingWindow = desktopWindows.find(
              (window) => window.componentKey === "active-phishing-workspace"
            );

            if (existingWindow) {
              updateDesktopWindowComponentProps(existingWindow.id, { initialView: "terminal" });
              focusDesktopWindow(existingWindow.id);
              return;
            }

            openDesktopWindow({
              title: "Command Prompt",
              componentKey: "active-phishing-workspace",
              componentProps: {
                variant: phishingVariant,
                initialView: "terminal",
                onTelemetryChange: handleTelemetryChange
              },
              x: 140,
              y: 100,
              width: 900,
              height: 600,
              minWidth: 600,
              minHeight: 400
            });
          }}
        />
        {completedAssignmentId === launchedAssignment.assignmentId && launchedAssignment.module.completionScoreTarget !== null ? (
          <ModuleCompletionOverlay
            module={launchedAssignment.module}
            moduleScore={moduleScore}
            targetScore={launchedAssignment.module.completionScoreTarget}
            onDismiss={() => {
              setCompletedAssignmentId(null);
              setLaunchedAssignmentId(null);
              setLaunchBaseline(null);
              setWorkspaceTelemetry({ score: 0, scoreCards: [], answeredCount: 0 });
              const nextPending = activeAssignments.find((entry) => entry.assignmentId !== launchedAssignment.assignmentId);
              if (nextPending) {
                setSelectedAssignmentId(nextPending.assignmentId);
              }
            }}
          />
        ) : null}
        <Suspense fallback={null}>
          <AuditOverlay />
          <AccountTransferOverlay />
          <BehaviorEventOverlay />
          <ClientMeetingOverlay />
          <DocumentationOverlay />
          <InsuranceDialogueOverlay />
          <OnboardingOverlay />
          <OperationsRequestOverlay />
          <PlayerComplianceOverlay />
          <RecommendationDialogueOverlay />
          <SupervisionRequestOverlay />
        </Suspense>
      </>
    );
  }

  return (
    <main className="layout">
      <TopBar
        brandTitle={topBarTitle}
        showPlannerTools={showPlannerTools}
        showDifficultyControls={showStockGameControls}
        showNewSessionButton={showStockGameControls}
        showDifficultyRibbon={showStockGameControls}
        showSessionManager={showStockGameControls}
        showReloadBank={showStockGameControls}
        visibleRibbonItems={showStockGameControls ? undefined : (focusedRibbonItems ? [...focusedRibbonItems] : undefined)}
        assignmentRibbonCard={assignmentRibbonCard}
        extraControls={(
          <>
            <button type="button" className="control-btn" onClick={() => {
              if (launchedAssignmentId) saveSecToAssignment(launchedAssignmentId);
              setLaunchedAssignmentId(null);
            }}>
              Main Menu
            </button>
            <button type="button" className="control-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      />
      <EmployeeModuleWorkspace
        assignment={launchedAssignment}
        moduleScore={moduleScore}
        scoreCards={moduleScoreCards}
        answeredCount={workspaceTelemetry.answeredCount}
        onModuleTelemetryChange={handleTelemetryChange}
      />
      {completedAssignmentId === launchedAssignment.assignmentId && launchedAssignment.module.completionScoreTarget !== null ? (
        <ModuleCompletionOverlay
          module={launchedAssignment.module}
          moduleScore={moduleScore}
          targetScore={launchedAssignment.module.completionScoreTarget}
          onDismiss={() => {
            setCompletedAssignmentId(null);
            setLaunchedAssignmentId(null);
            setLaunchBaseline(null);
            setWorkspaceTelemetry({ score: 0, scoreCards: [], answeredCount: 0 });
            const nextPending = activeAssignments.find((entry) => entry.assignmentId !== launchedAssignment.assignmentId);
            if (nextPending) {
              setSelectedAssignmentId(nextPending.assignmentId);
            }
          }}
        />
      ) : null}
      <Suspense fallback={null}>
        <AuditOverlay />
        <AccountTransferOverlay />
        <BehaviorEventOverlay />
        <ClientMeetingOverlay />
        <CycleRecapOverlay />
        <DocumentationOverlay />
        <InsuranceDialogueOverlay />
        <OnboardingOverlay />
        <OperationsRequestOverlay />
        <PlayerComplianceOverlay />
        <RecommendationDialogueOverlay />
        <SessionEndScreen />
        <SupervisionRequestOverlay />
      </Suspense>
    </main>
  );
}
