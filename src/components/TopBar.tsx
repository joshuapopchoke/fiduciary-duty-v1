import { Suspense, lazy, useMemo, useState, useEffect, type ReactNode } from "react";
import { DIFFICULTY_LABELS, EXAM_BLUEPRINTS } from "../data/examBlueprints";
import { deriveMarketDateTime, describeMarketSession } from "../engine/marketClock";
import { getExamKeysForDifficulty } from "../engine/questionBank";
import { useGameStore, useSelectedClient } from "../store/gameStore";
import { PlannerToolsRibbonCard } from "./PlannerToolsRibbonCard";

const SessionManagerOverlay = lazy(() => import("./SessionManagerOverlay").then((module) => ({ default: module.SessionManagerOverlay })));

type ResolutionBridgeWindow = Window & {
  electronAPI?: {
    setResolution: (width: number | null, height: number | null) => Promise<void>;
  };
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatStamp(value: number | null) {
  if (!value) {
    return "Pending";
  }

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function bankLabel(key: string) {
  switch (key) {
    case "sie":
      return "SIE";
    case "series7":
      return "Series 7";
    case "series65":
      return "Series 65";
    case "series66":
      return "Series 66";
    default:
      return key;
  }
}

function formatDeltaPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDeltaDollars(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

function formatRate(value: number) {
  return `${value.toFixed(2)}%`;
}

function computeClientUsd(
  client: {
    cash: number;
    holdings: Record<string, { ticker: string; shares: number }>;
    shortHoldings?: Record<string, { ticker: string; shares: number }>;
    marginDebt?: number;
    startingAum: number;
  },
  tickers: Record<string, { price: number }>
) {
  const longValue = client.cash + Object.values(client.holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const shortValue = Object.values(client.shortHoldings ?? {}).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  return longValue - shortValue - (client.marginDebt ?? 0);
}

interface TopBarProps {
  brandTitle?: string;
  showTrainingManager?: boolean;
  showPlannerTools?: boolean;
  showDifficultyControls?: boolean;
  showNewSessionButton?: boolean;
  showDifficultyRibbon?: boolean;
  showSessionManager?: boolean;
  showReloadBank?: boolean;
  visibleRibbonItems?: Array<"score" | "rates" | "revenue" | "personal" | "book" | "total" | "client" | "timer" | "sec" | "difficulty" | "study" | "trainee" | "coach" | "calendar" | "assignment">;
  assignmentRibbonCard?: {
    label: string;
    title: string;
    detail: string;
  } | null;
  extraControls?: ReactNode;
}


// ─── Resolution Picker ────────────────────────────────────────────────────────
// All standard and traditional display resolutions from 800×600 to 3840×2160.
// Scale is computed so the app baseline (1440×900) fills the selected resolution.
const RESOLUTIONS: { label: string; w: number; h: number }[] = [
  // SD / Legacy
  { label: "800 × 600  (SVGA)",         w: 800,  h: 600  },
  { label: "1024 × 600 (WSVGA)",        w: 1024, h: 600  },
  { label: "1024 × 768 (XGA)",          w: 1024, h: 768  },
  { label: "1152 × 864 (XGA+)",         w: 1152, h: 864  },
  { label: "1280 × 720 (HD 720p)",      w: 1280, h: 720  },
  { label: "1280 × 768 (WXGA)",         w: 1280, h: 768  },
  { label: "1280 × 800 (WXGA)",         w: 1280, h: 800  },
  { label: "1280 × 960 (SXGA−)",        w: 1280, h: 960  },
  { label: "1280 × 1024 (SXGA)",        w: 1280, h: 1024 },
  { label: "1360 × 768 (HD)",           w: 1360, h: 768  },
  { label: "1366 × 768 (HD)",           w: 1366, h: 768  },
  { label: "1400 × 1050 (SXGA+)",       w: 1400, h: 1050 },
  { label: "1440 × 900 (WXGA+)",        w: 1440, h: 900  },  // Baseline
  { label: "1440 × 1080 (HDV)",         w: 1440, h: 1080 },
  // HD / FHD
  { label: "1600 × 900 (HD+)",          w: 1600, h: 900  },
  { label: "1600 × 1024 (WSXGA)",       w: 1600, h: 1024 },
  { label: "1600 × 1200 (UXGA)",        w: 1600, h: 1200 },
  { label: "1680 × 1050 (WSXGA+)",      w: 1680, h: 1050 },
  { label: "1920 × 1080 (FHD 1080p)",   w: 1920, h: 1080 },
  { label: "1920 × 1200 (WUXGA)",       w: 1920, h: 1200 },
  { label: "1920 × 1440 (UXGA wide)",   w: 1920, h: 1440 },
  // QHD / 2K
  { label: "2048 × 1080 (DCI 2K)",      w: 2048, h: 1080 },
  { label: "2048 × 1152 (QWXGA)",       w: 2048, h: 1152 },
  { label: "2160 × 1440 (Surface)",     w: 2160, h: 1440 },
  { label: "2256 × 1504 (Surface Pro)", w: 2256, h: 1504 },
  { label: "2304 × 1440 (MacBook)",     w: 2304, h: 1440 },
  { label: "2560 × 1080 (UW FHD)",      w: 2560, h: 1080 },
  { label: "2560 × 1440 (QHD 1440p)",   w: 2560, h: 1440 },
  { label: "2560 × 1600 (WQXGA)",       w: 2560, h: 1600 },
  { label: "2560 × 2048 (QSXGA)",       w: 2560, h: 2048 },
  { label: "2736 × 1824 (Surface Pro)", w: 2736, h: 1824 },
  { label: "2880 × 1800 (MacBook Pro)",  w: 2880, h: 1800 },
  // 4K / UHD
  { label: "3200 × 1800 (QHD+)",        w: 3200, h: 1800 },
  { label: "3440 × 1440 (UW QHD)",      w: 3440, h: 1440 },
  { label: "3840 × 1600 (UW 4K)",       w: 3840, h: 1600 },
  { label: "3840 × 2160 (4K UHD)",      w: 3840, h: 2160 },
];

const STORAGE_KEY = "fd-resolution";


function ResolutionPicker() {
  const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const defaultLabel = stored ?? "Auto";
  const [selected, setSelected] = useState<string>(defaultLabel);

  useEffect(() => {
    if (selected === "Auto") {
      localStorage.removeItem(STORAGE_KEY);
      void (window as ResolutionBridgeWindow).electronAPI?.setResolution(null, null);
      return;
    }

    const match = RESOLUTIONS.find(r => r.label === selected);
    if (match) {
      localStorage.setItem(STORAGE_KEY, selected);
      void (window as ResolutionBridgeWindow).electronAPI?.setResolution(match.w, match.h);
    }
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const label = e.target.value;
    setSelected(label);
  }

  return (
    <div className="resolution-picker">
      <select
        className="control-btn resolution-select"
        value={selected}
        onChange={handleChange}
        title="Set display resolution scale"
      >
        <option value="Auto">⊞ Resolution: Auto</option>
        <optgroup label="──────────────────">
          {RESOLUTIONS.map(r => (
            <option key={r.label} value={r.label}>{r.label}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export function TopBar({
  brandTitle = "Fiduciary Duty",
  showTrainingManager = false,
  showPlannerTools = true,
  showDifficultyControls = true,
  showNewSessionButton = true,
  showDifficultyRibbon = true,
  showSessionManager = true,
  showReloadBank = true,
  visibleRibbonItems,
  assignmentRibbonCard = null,
  extraControls = null
}: TopBarProps) {
  const score = useGameStore((state) => state.score);
  const interestRates = useGameStore((state) => state.interestRates);
  const revenueSnapshot = useGameStore((state) => state.revenueSnapshot);
  const personalPortfolioUsd = useGameStore((state) => state.personalPortfolioUsd);
  const personalHoldings = useGameStore((state) => state.personalHoldings);
  const personalShortHoldings = useGameStore((state) => state.personalShortHoldings);
  const personalMarginDebt = useGameStore((state) => state.personalMarginDebt);
  const personalMarginCall = useGameStore((state) => state.personalMarginCall);
  const totalAum = useGameStore((state) => state.totalAum);
  const clients = useGameStore((state) => state.clients);
  const tickers = useGameStore((state) => state.tickers);
  const timerSeconds = useGameStore((state) => state.timerSeconds);
  const isPaused = useGameStore((state) => state.isPaused);
  const gameDateIso = useGameStore((state) => state.gameDateIso);
  const playerTradeStatus = useGameStore((state) => state.playerTradeStatus);
  const playerSuspensionRounds = useGameStore((state) => state.playerSuspensionRounds);
  const secMeterLevel = useGameStore((state) => state.secMeterLevel);
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const questionBankStatus = useGameStore((state) => state.questionBankStatus);
  const lastSavedAt = useGameStore((state) => state.lastSavedAt);
  const lastRestoredAt = useGameStore((state) => state.lastRestoredAt);
  const sessionRestored = useGameStore((state) => state.sessionRestored);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  const togglePause = useGameStore((state) => state.togglePause);
  const resetSession = useGameStore((state) => state.resetSession);
  const initializeQuestionBank = useGameStore((state) => state.initializeQuestionBank);
  const activeClient = useSelectedClient();
  const trainees = useGameStore((state) => state.trainees);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const personalStart: number = 100000;
  const personalMarketValue = useMemo(
    () => Object.values(personalHoldings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0),
    [personalHoldings, tickers]
  );
  const personalShortValue = useMemo(
    () => Object.values(personalShortHoldings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0),
    [personalShortHoldings, tickers]
  );
  const personalEquity = personalPortfolioUsd + personalMarketValue - personalShortValue - personalMarginDebt;
  const startingBook = useMemo(() => clients.reduce((total, client) => total + client.startingAum, 0), [clients]);
  const personalDelta = personalEquity - personalStart;
  const personalDeltaPercent = personalStart === 0 ? 0 : (personalDelta / personalStart) * 100;
  const totalDelta = totalAum - startingBook;
  const totalDeltaPercent = startingBook === 0 ? 0 : (totalDelta / startingBook) * 100;
  const clientUsd = useMemo(() => (activeClient ? computeClientUsd(activeClient, tickers) : 0), [activeClient, tickers]);
  const clientDelta = activeClient ? clientUsd - activeClient.startingAum : 0;
  const clientDeltaPercent = !activeClient || activeClient.startingAum === 0 ? 0 : (clientDelta / activeClient.startingAum) * 100;
  const personalDeltaClass = personalDelta >= 0 ? "up" : "down";
  const totalDeltaClass = totalDelta >= 0 ? "up" : "down";
  const clientDeltaClass = clientDelta >= 0 ? "up" : "down";
  const difficultyExamKeys = getExamKeysForDifficulty(activeDifficulty);
  const allowedExams = useMemo(() => [...new Set(EXAM_BLUEPRINTS[activeDifficulty].map((domain) => domain.exam))], [activeDifficulty]);
  const activeStudyOutcomes = useMemo(
    () => questionOutcomes.filter((outcome) => allowedExams.includes(outcome.exam as typeof allowedExams[number])),
    [allowedExams, questionOutcomes]
  );
  const correctAnswers = activeStudyOutcomes.filter((outcome) => outcome.correct).length;
  const answeredQuestions = activeStudyOutcomes.length;
  const accuracy = answeredQuestions === 0 ? 0 : (correctAnswers / answeredQuestions) * 100;
  const strongestExam = useMemo(() => allowedExams
    .map((exam) => {
      const examOutcomes = activeStudyOutcomes.filter((outcome) => outcome.exam === exam);
      const examCorrect = examOutcomes.filter((outcome) => outcome.correct).length;
      const examAccuracy = examOutcomes.length === 0 ? 0 : (examCorrect / examOutcomes.length) * 100;
      return { exam, examAccuracy, count: examOutcomes.length };
    })
    .sort((left, right) => right.examAccuracy - left.examAccuracy || right.count - left.count)[0], [activeStudyOutcomes, allowedExams]);
  const gameDateTime = useMemo(() => deriveMarketDateTime(gameDateIso, timerSeconds, 15 * 60), [gameDateIso, timerSeconds]);
  const gameDateLabel = useMemo(
    () => gameDateTime.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    [gameDateTime]
  );
  const gameSessionLabel = useMemo(() => describeMarketSession(gameDateTime), [gameDateTime]);

  const playerStatus = playerTradeStatus === "suspended"
    ? `Suspended ${playerSuspensionRounds} rounds`
    : playerTradeStatus === "fined"
      ? "Warning"
      : playerTradeStatus === "incarcerated"
        ? "Incarcerated"
        : "Compliant";

  return (
    <header className="topbar">
      <div className="topbar-main">
        <div className="topbar-brand">
          <p className="eyebrow">Sterling Fiduciary Group</p>
          <h1>{brandTitle}</h1>
        </div>
        <div className="topbar-meta-line">
          <span>{sessionRestored ? `Restored ${formatStamp(lastRestoredAt)}` : "Fresh session"}</span>
          <span>Auto-save {formatStamp(lastSavedAt)}</span>
          <span>{isPaused ? "Paused" : "Live"}</span>
          <span>{playerStatus}</span>
          <span>{questionBankStatus === "loading" ? "Bank loading" : "Bank ready"}</span>
        </div>
        <div className="control-strip">
          {showDifficultyControls ? (["learner", "trainee", "associate", "advisor", "senior"] as const).map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              className={activeDifficulty === difficulty ? "control-btn active" : "control-btn"}
              onClick={() => setDifficulty(difficulty)}
            >
              {DIFFICULTY_LABELS[difficulty]}
            </button>
          )) : null}
          {showNewSessionButton ? (
            <button type="button" className="control-btn" onClick={() => resetSession()}>
              New Session
            </button>
          ) : null}
          <button type="button" className={isPaused ? "control-btn active" : "control-btn"} onClick={() => togglePause()}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          {showSessionManager ? (
            <Suspense fallback={<button className="control-btn" disabled>Sessions</button>}>
              <SessionManagerOverlay />
            </Suspense>
          ) : null}
          {showTrainingManager ? null : null}
          {showReloadBank ? (
            <button type="button" className="control-btn" onClick={() => void initializeQuestionBank(activeDifficulty)}>
              Reload Bank
            </button>
          ) : null}
          {extraControls}
        </div>
      </div>
      <div className="topbar-ribbon">
        {!visibleRibbonItems || visibleRibbonItems.includes("score") ? <div className="ribbon-item ribbon-item--score">
          <span>Score</span>
          <strong>{score.toLocaleString()}</strong>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("rates") ? <div className="ribbon-item ribbon-item--rates">
          <span>Rates</span>
          <strong>Fed {formatRate(interestRates.fedFunds)} | 10Y {formatRate(interestRates.tenYearTreasury)}</strong>
          <small className={interestRates.periodChangeBps <= 0 ? "up" : "down"}>
            {interestRates.label} | 2Y {formatRate(interestRates.twoYearTreasury)} | Mtg {formatRate(interestRates.mortgage30Year)} | {interestRates.periodChangeBps >= 0 ? "+" : ""}{interestRates.periodChangeBps} bps
          </small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("revenue") ? <div className="ribbon-item ribbon-item--revenue">
          <span>Revenue</span>
          <strong>{formatCurrency(revenueSnapshot.annualizedGrossRevenue)}/yr</strong>
          <small className="up">{formatCurrency(revenueSnapshot.cycleRevenue)} this cycle | {revenueSnapshot.retainedClients} retained</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("personal") ? <div className="ribbon-item ribbon-item--personal">
          <span>Personal USD</span>
          <strong>{formatCurrency(personalEquity)}</strong>
          <small className={personalMarginCall ? "down" : personalDeltaClass}>
            {personalMarginCall ? `Call | ${formatCurrency(personalMarginDebt)} debt` : `${formatDeltaDollars(personalDelta)} | ${formatDeltaPercent(personalDeltaPercent)}`}
          </small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("book") ? <div className="ribbon-item ribbon-item--book">
          <span>Book</span>
          <strong>{clients.length} Clients</strong>
          <small className={totalDeltaClass}>{formatDeltaDollars(totalDelta)} | {formatDeltaPercent(totalDeltaPercent)}</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("total") ? <div className="ribbon-item ribbon-item--total">
          <span>Total USD</span>
          <strong>{formatCurrency(totalAum)}</strong>
          <small className={totalDeltaClass}>{formatDeltaDollars(totalDelta)} | {formatDeltaPercent(totalDeltaPercent)}</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("client") ? <div className="ribbon-item ribbon-item--client">
          <span>Client USD</span>
          <strong>{formatCurrency(clientUsd)}</strong>
          <small className={clientDeltaClass}>{activeClient?.name ?? "No client"} | {formatDeltaPercent(clientDeltaPercent)}</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("timer") ? <div className="ribbon-item ribbon-item--timer">
          <span>Timer</span>
          <strong>{minutes}:{seconds.toString().padStart(2, "0")}</strong>
          <small>{isPaused ? "Paused" : "Cycle live"}</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("sec") ? <div className="ribbon-item ribbon-item--sec">
          <span>SEC</span>
          <strong>{secMeterLevel}%</strong>
          <div className="meter-track compact">
            <div className="meter-fill" style={{ width: `${secMeterLevel}%` }} />
          </div>
        </div> : null}
        {showDifficultyRibbon && (!visibleRibbonItems || visibleRibbonItems.includes("difficulty")) ? (
          <div className="ribbon-item ribbon-item--difficulty">
            <span>Difficulty</span>
            <strong>{DIFFICULTY_LABELS[activeDifficulty]}</strong>
            <small>{difficultyExamKeys.map(bankLabel).join(" | ") || "No bank cached"}</small>
          </div>
        ) : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("study") ? <div className="ribbon-item ribbon-item--study">
          <span>Study</span>
          <strong>{answeredQuestions} answered</strong>
          <small className={accuracy >= 70 ? "up" : accuracy >= 50 ? "" : "down"}>
            {correctAnswers} correct | {accuracy.toFixed(0)}% | {strongestExam?.count ? strongestExam.exam : "Build streak"}
          </small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("trainee") ? <div className="ribbon-item ribbon-item--trainee">
          <span>Trainee</span>
          <strong>{trainees.find((entry) => entry.id === activeTraineeId)?.name ?? "Primary Trainee"}</strong>
          <small>{trainees.length} profiles loaded</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("coach") ? <div className="ribbon-item ribbon-item--coach">
          <span>Why It Matters</span>
          <strong>Correct answers build exam confidence and grow your personal portfolio.</strong>
          <small>Each right answer reinforces real SIE / Series concepts and adds USD to your self-directed account.</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("calendar") ? <div className="ribbon-item ribbon-item--calendar">
          <span>Game Clock</span>
          <strong>{gameDateLabel}</strong>
          <small>{gameSessionLabel}</small>
        </div> : null}
        {!visibleRibbonItems || visibleRibbonItems.includes("assignment") ? assignmentRibbonCard ? (
          <div className="ribbon-item ribbon-item--assignment">
            <span>{assignmentRibbonCard.label}</span>
            <strong>{assignmentRibbonCard.title}</strong>
            <small>{assignmentRibbonCard.detail}</small>
          </div>
        ) : null : null}
        {showPlannerTools ? <PlannerToolsRibbonCard /> : null}
      </div>
    </header>
  );
}
