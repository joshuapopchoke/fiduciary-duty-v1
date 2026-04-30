import type { AuditOutcome, ComplianceStats, QuestionOutcome } from "../types/gameState";
import type { ClientAccount } from "../types/client";

export interface TrainingLaneScore {
  label: string;
  score: number;
  grade: string;
  summary: string;
}

export interface TrainingPerformanceSummary {
  examReadiness: TrainingLaneScore;
  advisorPerformance: TrainingLaneScore;
  clientOutcome: TrainingLaneScore;
  compliance: TrainingLaneScore;
  portfolioOutcome: TrainingLaneScore;
  overall: TrainingLaneScore;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toGrade(score: number) {
  if (score >= 93) return "A";
  if (score >= 85) return "B";
  if (score >= 75) return "C";
  if (score >= 65) return "D";
  return "F";
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function uniqueDomains(outcomes: QuestionOutcome[]) {
  return new Set(outcomes.map((outcome) => `${outcome.exam}::${outcome.domain}`)).size;
}

function buildExamReadiness(questionOutcomes: QuestionOutcome[]): TrainingLaneScore {
  const totalQuestions = questionOutcomes.length;
  const correctAnswers = questionOutcomes.filter((outcome) => outcome.correct).length;
  const accuracyScore = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;
  const breadthScore = clamp(uniqueDomains(questionOutcomes) * 4, 0, 20);
  const score = clamp(Math.round(accuracyScore * 0.8 + breadthScore), 0, 100);

  return {
    label: "Exam Readiness",
    score,
    grade: toGrade(score),
    summary: totalQuestions === 0
      ? "No exam work completed yet."
      : `${correctAnswers}/${totalQuestions} correct with ${uniqueDomains(questionOutcomes)} domains touched.`
  };
}

function buildAdvisorPerformance(clients: ClientAccount[]): TrainingLaneScore {
  const trustScore = average(clients.map((client) => client.trustScore));
  const mandateScore = average(clients.map((client) => client.mandateScore));
  const score = clamp(Math.round(trustScore * 0.45 + mandateScore * 0.55), 0, 100);

  return {
    label: "Advisor Performance",
    score,
    grade: toGrade(score),
    summary: `Avg trust ${trustScore.toFixed(0)} | Avg mandate fit ${mandateScore.toFixed(0)}.`
  };
}

function buildClientOutcome(clients: ClientAccount[], removedClientIds: string[]): TrainingLaneScore {
  const retainedPct = clients.length + removedClientIds.length === 0
    ? 100
    : (clients.length / (clients.length + removedClientIds.length)) * 100;
  const satisfiedPct = clients.length === 0
    ? 0
    : (clients.filter((client) => client.status === "satisfied").length / clients.length) * 100;
  const score = clamp(Math.round(retainedPct * 0.55 + satisfiedPct * 0.45), 0, 100);

  return {
    label: "Client Outcome",
    score,
    grade: toGrade(score),
    summary: `${clients.length} retained | ${removedClientIds.length} lost | ${satisfiedPct.toFixed(0)}% satisfied.`
  };
}

function buildCompliance(
  secMeterLevel: number,
  auditHistory: AuditOutcome[],
  complianceStats: ComplianceStats,
  playerComplianceLevel: number
): TrainingLaneScore {
  const penaltyScore =
    secMeterLevel * 0.35 +
    playerComplianceLevel * 0.2 +
    auditHistory.length * 7 +
    complianceStats.suitabilityViolations * 8 +
    complianceStats.riskOverrides * 5 +
    complianceStats.unsuitableProductPlacements * 8 +
    complianceStats.concentrationFlags * 4;
  const score = clamp(Math.round(100 - penaltyScore), 0, 100);

  return {
    label: "Compliance",
    score,
    grade: toGrade(score),
    summary: `${auditHistory.length} audits | ${complianceStats.suitabilityViolations} suitability hits | SEC ${secMeterLevel}%.`
  };
}

function buildPortfolioOutcome(totalAum: number, startingBook: number, personalEquity: number, startingPersonalEquity: number): TrainingLaneScore {
  const bookDeltaPct = startingBook <= 0 ? 0 : ((totalAum - startingBook) / startingBook) * 100;
  const personalDeltaPct = startingPersonalEquity <= 0 ? 0 : ((personalEquity - startingPersonalEquity) / startingPersonalEquity) * 100;
  const score = clamp(Math.round(50 + bookDeltaPct * 1.5 + personalDeltaPct * 0.8), 0, 100);

  return {
    label: "Portfolio Outcome",
    score,
    grade: toGrade(score),
    summary: `Client book ${bookDeltaPct >= 0 ? "+" : ""}${bookDeltaPct.toFixed(1)}% | Personal ${personalDeltaPct >= 0 ? "+" : ""}${personalDeltaPct.toFixed(1)}%.`
  };
}

export function buildTrainingPerformanceSummary(input: {
  questionOutcomes: QuestionOutcome[];
  clients: ClientAccount[];
  removedClientIds: string[];
  secMeterLevel: number;
  auditHistory: AuditOutcome[];
  complianceStats: ComplianceStats;
  playerComplianceLevel: number;
  totalAum: number;
  startingBook: number;
  personalEquity: number;
  startingPersonalEquity: number;
}): TrainingPerformanceSummary {
  const examReadiness = buildExamReadiness(input.questionOutcomes);
  const advisorPerformance = buildAdvisorPerformance(input.clients);
  const clientOutcome = buildClientOutcome(input.clients, input.removedClientIds);
  const compliance = buildCompliance(
    input.secMeterLevel,
    input.auditHistory,
    input.complianceStats,
    input.playerComplianceLevel
  );
  const portfolioOutcome = buildPortfolioOutcome(
    input.totalAum,
    input.startingBook,
    input.personalEquity,
    input.startingPersonalEquity
  );
  const overallScore = clamp(Math.round(
    examReadiness.score * 0.3 +
    advisorPerformance.score * 0.25 +
    clientOutcome.score * 0.2 +
    compliance.score * 0.15 +
    portfolioOutcome.score * 0.1
  ), 0, 100);

  return {
    examReadiness,
    advisorPerformance,
    clientOutcome,
    compliance,
    portfolioOutcome,
    overall: {
      label: "Overall",
      score: overallScore,
      grade: toGrade(overallScore),
      summary: "Balanced training score across exam knowledge, client judgment, compliance, and portfolio execution."
    }
  };
}
