import { useEffect, useState } from "react";
import { CLIENTS } from "../data/clients";
import { EXAM_BLUEPRINTS } from "../data/examBlueprints";
import { buildTrainingPerformanceSummary } from "../engine/trainingScoreEngine";
import { useGameStore } from "../store/gameStore";
import type { DomainBreakdownRow } from "../types/gameState";

function getComplianceRating(
  secMeterLevel: number,
  auditCount: number,
  suitabilityViolations: number,
  riskOverrides: number,
  unsuitablePlacements: number
) {
  const penaltyScore =
    secMeterLevel + auditCount * 10 + suitabilityViolations * 8 + riskOverrides * 6 + unsuitablePlacements * 8;

  if (penaltyScore < 25) return "A";
  if (penaltyScore < 45) return "B";
  if (penaltyScore < 65) return "C";
  if (penaltyScore < 85) return "D";
  return "F";
}

function buildBreakdown(questionOutcomes: ReturnType<typeof useGameStore.getState>["questionOutcomes"]): DomainBreakdownRow[] {
  const table = new Map<string, DomainBreakdownRow>();
  const blueprintRows = Object.values(EXAM_BLUEPRINTS)
    .flat()
    .map((domain) => ({
      exam: domain.exam,
      domain: domain.label,
      correct: 0,
      incorrect: 0
    }));

  blueprintRows.forEach((row) => {
    table.set(`${row.exam}::${row.domain}`, row);
  });

  questionOutcomes.forEach((outcome) => {
    const key = `${outcome.exam}::${outcome.domain}`;
    const existing = table.get(key) ?? {
      exam: outcome.exam,
      domain: outcome.domain,
      correct: 0,
      incorrect: 0
    };

    if (outcome.correct) {
      existing.correct += 1;
    } else {
      existing.incorrect += 1;
    }

    table.set(key, existing);
  });

  const examOrder = ["SIE", "Series 7", "Series 65", "Series 66", "Audit", "Client"];

  return [...table.values()].sort((left, right) => {
    const examDistance = examOrder.indexOf(left.exam) - examOrder.indexOf(right.exam);
    if (examDistance !== 0) {
      return examDistance;
    }

    const leftBlueprint = Object.values(EXAM_BLUEPRINTS).flat().find((entry) => entry.exam === left.exam && entry.label === left.domain);
    const rightBlueprint = Object.values(EXAM_BLUEPRINTS).flat().find((entry) => entry.exam === right.exam && entry.label === right.domain);

    if (leftBlueprint && rightBlueprint) {
      const leftIndex = Object.values(EXAM_BLUEPRINTS)
        .flat()
        .findIndex((entry) => entry.exam === left.exam && entry.label === left.domain);
      const rightIndex = Object.values(EXAM_BLUEPRINTS)
        .flat()
        .findIndex((entry) => entry.exam === right.exam && entry.label === right.domain);

      return leftIndex - rightIndex;
    }

    return left.domain.localeCompare(right.domain);
  });
}

export function SessionEndScreen() {
  const timerSeconds = useGameStore((state) => state.timerSeconds);
  const currentEvent = useGameStore((state) => state.currentEvent);
  const score = useGameStore((state) => state.score);
  const totalAum = useGameStore((state) => state.totalAum);
  const personalPortfolioUsd = useGameStore((state) => state.personalPortfolioUsd);
  const secMeterLevel = useGameStore((state) => state.secMeterLevel);
  const auditHistory = useGameStore((state) => state.auditHistory);
  const complianceStats = useGameStore((state) => state.complianceStats);
  const playerComplianceLevel = useGameStore((state) => state.playerComplianceLevel);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const bestAnswerStreak = useGameStore((state) => state.bestAnswerStreak);
  const clients = useGameStore((state) => state.clients);
  const removedClientIds = useGameStore((state) => state.removedClientIds);
  const trainees = useGameStore((state) => state.trainees);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const recordTrainingReport = useGameStore((state) => state.recordTrainingReport);
  const resetSession = useGameStore((state) => state.resetSession);
  const [dismissed, setDismissed] = useState(false);
  const activeTrainee = trainees.find((entry) => entry.id === activeTraineeId) ?? trainees[0] ?? null;

  useEffect(() => {
    if (timerSeconds > 0) {
      setDismissed(false);
    }
  }, [timerSeconds]);

  useEffect(() => {
    if (timerSeconds <= 0 && currentEvent !== null && !dismissed) {
      recordTrainingReport();
    }
  }, [currentEvent, dismissed, recordTrainingReport, timerSeconds]);

  if (timerSeconds > 0 || dismissed || currentEvent === null) {
    return null;
  }

  const breakdown = buildBreakdown(questionOutcomes);
  const complianceRating = getComplianceRating(
    secMeterLevel,
    auditHistory.length,
    complianceStats.suitabilityViolations,
    complianceStats.riskOverrides,
    complianceStats.unsuitableProductPlacements
  );
  const correctAnswers = questionOutcomes.filter((outcome) => outcome.correct).length;
  const accuracy = questionOutcomes.length === 0 ? 0 : (correctAnswers / questionOutcomes.length) * 100;
  const startingBook = CLIENTS.reduce((total, client) => total + client.startingAum, 0);
  const trainingSummary = buildTrainingPerformanceSummary({
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
  });
  const laneRows = [
    trainingSummary.examReadiness,
    trainingSummary.advisorPerformance,
    trainingSummary.clientOutcome,
    trainingSummary.compliance,
    trainingSummary.portfolioOutcome
  ];

  return (
    <div className="overlay">
      <div className="overlay-card overlay-card--scrollable">
        <div className="overlay-header">
          <div className="overlay-copy">
            <p className="eyebrow">Session Complete</p>
            <p>Trainee: {activeTrainee?.name ?? "Primary Trainee"}</p>
            <h2>Final Score: {score.toLocaleString()}</h2>
            <p>Overall Training Grade: {trainingSummary.overall.grade} ({trainingSummary.overall.score}/100)</p>
            <p>Final USD: {totalAum.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</p>
            <p>Compliance Rating: {complianceRating}</p>
            <p>
              Suitability violations: {complianceStats.suitabilityViolations} | Risk overrides: {complianceStats.riskOverrides} |
              Unsuitable placements: {complianceStats.unsuitableProductPlacements} | Audits: {auditHistory.length}
            </p>
          </div>
          <div className="overlay-actions">
            <button className="control-btn" onClick={() => setDismissed(true)}>
              Review Results Later
            </button>
            <button className="control-btn active" onClick={() => resetSession()}>
              New Session
            </button>
          </div>
        </div>
        <div className="study-summary-grid">
          <div className="study-summary-card">
            <span>Overall Training</span>
            <strong>{trainingSummary.overall.grade}</strong>
            <small>{trainingSummary.overall.summary}</small>
          </div>
          <div className="study-summary-card">
            <span>Personal Cash</span>
            <strong>{personalPortfolioUsd.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</strong>
            <small>Self-directed book close</small>
          </div>
          <div className="study-summary-card">
            <span>Study Accuracy</span>
            <strong>{accuracy.toFixed(0)}%</strong>
            <small>{correctAnswers} correct out of {questionOutcomes.length}</small>
          </div>
          <div className="study-summary-card">
            <span>Best Streak</span>
            <strong>{bestAnswerStreak}</strong>
            <small>Longest run of correct answers</small>
          </div>
          <div className="study-summary-card">
            <span>Compliance</span>
            <strong>{complianceRating}</strong>
            <small>{auditHistory.length} audits | {complianceStats.suitabilityViolations} suitability hits</small>
          </div>
        </div>
        <div className="portfolio-table">
          {laneRows.map((lane) => (
            <div className="portfolio-row" key={lane.label}>
              <strong>{lane.label}</strong>
              <span>Grade: {lane.grade}</span>
              <span>Score: {lane.score}/100</span>
              <span>{lane.summary}</span>
            </div>
          ))}
        </div>
        <div className="portfolio-table">
          {breakdown.map((row) => (
            <div className="portfolio-row" key={`${row.exam}-${row.domain}`}>
              <strong>{row.exam}</strong>
              <span>{row.domain}</span>
              <span>Correct: {row.correct}</span>
              <span>Incorrect: {row.incorrect}</span>
              <span>Total: {row.correct + row.incorrect}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
