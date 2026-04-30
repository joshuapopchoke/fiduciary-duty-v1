import type { ClientAccount, ClientAccountSleeve, ClientHolding, MarginPosition } from "./client";
import type { FinancialProfile, Ticker } from "./market";
import type { Question } from "./question";

export type PlayDifficulty = "learner" | "trainee" | "associate" | "advisor" | "senior";
export type ChartPeriod = "current" | "1D" | "6M" | "YTD" | "1Y" | "3Y" | "5Y";

export type AppTab = "research" | "portfolio";
export type QuestionBankStatus = "idle" | "loading" | "ready" | "error";
export type QuestionBankWarmStatus = "idle" | "warming";
export type SaveSlotId = string;

export interface SaveSlotSummary {
  id: SaveSlotId;
  label: string;
  savedAt: number | null;
  difficulty: PlayDifficulty | null;
  score: number | null;
}

export interface AuditOutcome {
  askedAt: number;
  passed: boolean;
}

export interface QuestionOutcome {
  exam: string;
  domain: string;
  topicTag: string;
  correct: boolean;
}

export interface DomainBreakdownRow {
  exam: string;
  domain: string;
  correct: number;
  incorrect: number;
}

export interface ComplianceStats {
  suitabilityViolations: number;
  riskOverrides: number;
  unsuitableProductPlacements: number;
  concentrationFlags: number;
}

export type PlayerTradeStatus = "clear" | "fined" | "suspended" | "incarcerated";

export interface InsiderInfoEvent {
  id: string;
  symbol: string;
  title: string;
  summary: string;
  prompt: string;
  legalToTrade: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface PlayerComplianceFeedback {
  title: string;
  detail: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  legalToTrade: boolean;
}

export interface TradeFeedback {
  title: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
  bullets?: string[];
}

export interface InsuranceDialoguePromptState {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface InsuranceDialogueState {
  clientId: string;
  insuranceId: string;
  title: string;
  prompts: InsuranceDialoguePromptState[];
  stepIndex: number;
  selectedIndex: number | null;
  score: number;
  answered: boolean;
  completed: boolean;
  accepted: boolean | null;
  feedback: string | null;
}

export interface ClientMeetingOptionState {
  id: string;
  label: string;
  outcome: string;
  trustDelta: number;
  insuranceGapDelta?: number;
  incomeDelta?: number;
  expenseDelta?: number;
  debtPaymentDelta?: number;
  reserveMonthsDelta?: number;
  liquidityNeed?: "Low" | "Moderate" | "High";
}

export type ClientMeetingKind = "default" | "review";

export interface ClientMeetingState {
  clientId: string;
  meetingId: string;
  meetingKind?: ClientMeetingKind;
  title: string;
  summary: string;
  question: string;
  options: ClientMeetingOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  feedback: string | null;
}

export interface AccountTransferOptionState {
  id: string;
  label: string;
  outcome: string;
  trustDelta: number;
  fromSleeveId: string | null;
  toSleeveId: string | null;
  noteHint?: string;
}

export interface AccountTransferRequestState {
  clientId: string;
  requestId: string;
  title: string;
  summary: string;
  prompt: string;
  options: AccountTransferOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  feedback: string | null;
}

export interface DocumentationPromptState {
  clientId: string;
  title: string;
  context: string;
  suggestedNote: string;
  noteText: string;
}

export interface BehavioralEventOptionState {
  id: string;
  label: string;
  outcome: string;
  trustDelta: number;
  noteHint?: string;
}

export interface BehavioralEventState {
  clientId: string;
  eventId: string;
  title: string;
  summary: string;
  prompt: string;
  options: BehavioralEventOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  feedback: string | null;
}

export interface OperationsRequestOptionState {
  id: string;
  label: string;
  outcome: string;
  trustDelta: number;
  cashDelta?: number;
  fromSleeveId?: string | null;
  toSleeveId?: string | null;
  transferAmount?: number;
  noteHint?: string;
}

export type OperationsWorkflowKind = "default" | "rmd";

export interface OperationsRequestState {
  clientId: string;
  requestId: string;
  requestKind?: OperationsWorkflowKind;
  title: string;
  summary: string;
  prompt: string;
  options: OperationsRequestOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  feedback: string | null;
}

export interface RecommendationOptionState {
  id: string;
  label: string;
  outcome: string;
  trustDelta: number;
  followUpTask: string;
  accepted: boolean;
}

export interface RecommendationDialogueState {
  clientId: string;
  recommendationId: string;
  title: string;
  summary: string;
  clientQuestion: string;
  options: RecommendationOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  accepted: boolean | null;
  feedback: string | null;
}

export interface SupervisionRequestOptionState {
  id: string;
  label: string;
  outcome: string;
  secDelta: number;
  trustDelta: number;
  noteHint?: string;
}

export interface SupervisionRequestState {
  clientId: string;
  requestId: string;
  title: string;
  summary: string;
  prompt: string;
  options: SupervisionRequestOptionState[];
  resolved: boolean;
  selectedOptionId: string | null;
  feedback: string | null;
}

export type TradeFundingMode = "cash" | "margin";

export interface MarketCycleSummary {
  cycleNumber: number;
  eventTitle: string | null;
  leaderSymbol: string | null;
  leaderChange: number;
  laggardSymbol: string | null;
  laggardChange: number;
  personalImpactUsd: number;
  clientImpactUsd: number;
  clientAlerts: string[];
  lostClientNames: string[];
}

export interface InterestRateSnapshot {
  period: ChartPeriod;
  label: string;
  fedFunds: number;
  twoYearTreasury: number;
  tenYearTreasury: number;
  mortgage30Year: number;
  primeRate: number;
  periodChangeBps: number;
}

export interface RevenueSnapshot {
  annualizedGrossRevenue: number;
  cycleRevenue: number;
  retainedClients: number;
  trailingCycleRevenue: number;
}

export interface TrainingLaneResult {
  label: string;
  score: number;
  grade: string;
  summary: string;
}

export interface ModuleAssessmentCard {
  label: string;
  score: number;
  summary: string;
}

export interface TraineeProfile {
  id: string;
  name: string;
  role: "Trainee" | "Advisor Trainee" | "Manager";
  createdAt: number;
}

export interface TrainingAssignment {
  id: string;
  traineeId: string;
  moduleId: string;
  assignedDifficulty: PlayDifficulty | null;
  jurisdictionCode: string | null;
  assignedMortgageRate: number | null;
  assignedMortgageScenarioId: string | null;
  assignedAt: number;
  dueAt: number | null;
  status: "pending" | "in-progress" | "completed";
  completedAt: number | null;
  savedSecLevel?: number;
}

export interface TrainingSessionReport {
  id: string;
  traineeId: string;
  traineeName: string;
  difficulty: PlayDifficulty;
  endedAt: number;
  moduleId: string | null;
  moduleTitle: string | null;
  moduleScore: number | null;
  moduleSummary: string | null;
  moduleScoreCards: ModuleAssessmentCard[];
  overall: TrainingLaneResult;
  examReadiness: TrainingLaneResult;
  advisorPerformance: TrainingLaneResult;
  clientOutcome: TrainingLaneResult;
  compliance: TrainingLaneResult;
  portfolioOutcome: TrainingLaneResult;
  finalScore: number;
  totalAum: number;
  personalEquity: number;
  studyAccuracy: number;
  correctAnswers: number;
  answeredQuestions: number;
  clientCount: number;
  lostClientCount: number;
}

export interface QuestionTrackerState {
  recentlyAsked: string[];
  questionsAsked: number;
  lastClientAsked: string | null;
  domainPerformance: Record<string, { seen: number; correct: number; incorrect: number }>;
}

export interface ActiveQuestionState {
  question: Question | null;
  shuffledOptions: string[];
  displayCorrectIndex: number;
  selectedIndex: number | null;
  answered: boolean;
}

export interface GameStateShape {
  trainees: TraineeProfile[];
  activeTraineeId: string;
  trainingAssignments: TrainingAssignment[];
  trainingReports: TrainingSessionReport[];
  lastRecordedSessionKey: string | null;
  liveTraineeScore: { traineeId: string; moduleId: string | null; correct: number; total: number; pct: number; updatedAt: number } | null;
  score: number;
  personalPortfolioUsd: number;
  personalAccountSleeves: ClientAccountSleeve[];
  personalSleeveCashBalances: Record<string, number>;
  personalHoldings: Record<string, ClientHolding>;
  personalHoldingAccountMap: Record<string, string>;
  personalShortHoldings: Record<string, MarginPosition>;
  personalShortHoldingAccountMap: Record<string, string>;
  personalMarginDebt: number;
  personalMarginCall: boolean;
  playerComplianceLevel: number;
  playerViolationCount: number;
  playerTradeStatus: PlayerTradeStatus;
  playerSuspensionRounds: number;
  activeInsiderEvent: InsiderInfoEvent | null;
  playerComplianceFeedback: PlayerComplianceFeedback | null;
  playerGameOver: boolean;
  playerGameOverReason: string | null;
  secMeterLevel: number;
  timerSeconds: number;
  isPaused: boolean;
  activeDifficulty: PlayDifficulty;
  selectedChartPeriod: ChartPeriod;
  gameDateIso: string;
  activeClientId: string | null;
  selectedTicker: string;
  activeTab: AppTab;
  clients: ClientAccount[];
  tickers: Record<string, Ticker>;
  histories: Record<string, number[]>;
  currentEvent: string | null;
  cycleNumber: number;
  workflowCooldownUntilCycle: number;
  lastMarketRefreshAt: number | null;
  lastCycleSummary: MarketCycleSummary | null;
  activeCycleRecap: MarketCycleSummary | null;
  interestRates: InterestRateSnapshot;
  revenueSnapshot: RevenueSnapshot;
  activeQuestion: ActiveQuestionState;
  auditQuestion: ActiveQuestionState;
  auditTriggered: boolean;
  auditHistory: AuditOutcome[];
  removedClientIds: string[];
  questionOutcomes: QuestionOutcome[];
  complianceStats: ComplianceStats;
  researchUnlocks: Record<string, boolean>;
  questionTracker: QuestionTrackerState;
  financialProfiles: Record<string, FinancialProfile>;
  answerStreak: number;
  bestAnswerStreak: number;
  tradeFeedback: TradeFeedback | null;
  questionBankStatus: QuestionBankStatus;
  questionBankWarmStatus: QuestionBankWarmStatus;
  loadedQuestionBankKeys: string[];
  questionBankError: string | null;
  activeInsuranceDialogue: InsuranceDialogueState | null;
  activeClientMeeting: ClientMeetingState | null;
  activeAccountTransferRequest: AccountTransferRequestState | null;
  activeOperationsRequest: OperationsRequestState | null;
  activeRecommendationDialogue: RecommendationDialogueState | null;
  activeSupervisionRequest: SupervisionRequestState | null;
  activeDocumentationPrompt: DocumentationPromptState | null;
  activeBehaviorEvent: BehavioralEventState | null;
  lastSavedAt: number | null;
  lastRestoredAt: number | null;
  sessionRestored: boolean;
  onboardingDismissed: boolean;
  saveSlots: SaveSlotSummary[];
  difficultySessions: Partial<Record<PlayDifficulty, unknown>>;
}
