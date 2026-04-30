import { TRAINING_MODULES, type TrainingModuleDefinition } from "../data/trainingModules";
import type { TrainingPerformanceSummary } from "./trainingScoreEngine";
import type { ModuleAssessmentCard, TrainingAssignment, TrainingSessionReport } from "../types/gameState";

export interface AssignmentProgressSnapshot {
  assignmentId: string;
  module: TrainingModuleDefinition;
  assignedDifficulty: TrainingSessionReport["difficulty"] | null;
  jurisdictionCode: string | null;
  assignedMortgageRate: number | null;
  assignedMortgageScenarioId: string | null;
  status: TrainingAssignment["status"];
  completionPercent: number;
  bestMatchingReport: TrainingSessionReport | null;
  dueAt: number | null;
  assignedAt: number;
}

export interface ModuleScoreCard {
  label: string;
  score: number;
  summary?: string;
}

export interface ModuleLiveMetrics {
  difficulty: TrainingSessionReport["difficulty"];
  studyAccuracy: number;
  answeredQuestions: number;
  summary: TrainingPerformanceSummary;
  workspaceScoreOverride?: number | null;
  workspaceScoreCards?: ModuleScoreCard[] | null;
}

function difficultyRank(difficulty: TrainingSessionReport["difficulty"]) {
  switch (difficulty) {
    case "learner":
      return 0;
    case "trainee":
      return 1;
    case "associate":
      return 2;
    case "advisor":
      return 3;
    case "senior":
      return 4;
    default:
      return 0;
  }
}

function moduleDifficultyRank(difficulty: TrainingModuleDefinition["requiredDifficulty"]) {
  return difficulty ? difficultyRank(difficulty) : 0;
}

function effectiveModuleDifficulty(
  module: TrainingModuleDefinition,
  assignment: Pick<TrainingAssignment, "assignedDifficulty">
) {
  return assignment.assignedDifficulty ?? module.requiredDifficulty;
}

function reportBelongsToModule(module: TrainingModuleDefinition, report: TrainingSessionReport) {
  return report.moduleId === module.id;
}

function roundScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildRegulatoryLens(module: TrainingModuleDefinition) {
  switch (module.workspace) {
    case "exam-foundations":
      return "Exam-readiness and regulated-conduct coaching lens";
    case "suitability-client-fit":
      return "SEC Reg BI / FINRA-style recommendation review lens";
    case "retirement-planning":
      return "Investment-adviser fiduciary-care and retirement-planning review lens";
    case "mortgage-debt-planning":
      return "CFPB ATR/QM, disclosure, and consumer-mortgage training review lens";
    case "bank-lending":
      return "Bank underwriting, documentation, and repayment-capacity review lens";
    case "phishing-scams-trainee":
    case "phishing-scams-it":
      return "Phishing, social-engineering, and endpoint-response training review lens";
    case "client-meeting-readiness":
      return "Communication, conduct, and defensible-advice review lens";
    case "tax-planning":
      return "IRC-aligned tax planning and optimization review lens";
    case "insurance-planning":
      return "Life, disability, LTC, and liability risk-management review lens";
    case "estate-planning":
      return "Estate and gift tax, trust, and wealth transfer review lens";
    case "qualified-plans":
      return "ERISA, qualified plan design, and retirement savings review lens";
    case "stock-game":
    default:
      return "Integrated readiness, advice, and compliance review lens";
  }
}

function buildRegulatoryAlignedCards(module: TrainingModuleDefinition, metrics: ModuleLiveMetrics): ModuleScoreCard[] {
  switch (module.workspace) {
    case "exam-foundations":
      return [
        {
          label: "Exam accuracy",
          score: roundScore(metrics.summary.examReadiness.score * 0.75 + metrics.studyAccuracy * 0.25),
          summary: "Measures how consistently the trainee answers assigned exam content correctly."
        },
        {
          label: "Coverage depth",
          score: metrics.summary.examReadiness.score,
          summary: "Rewards touching the breadth of the assigned blueprint instead of memorizing one pocket."
        },
        {
          label: "Compliance awareness",
          score: metrics.summary.compliance.score,
          summary: "Checks whether the trainee is absorbing regulated-conduct concepts while studying."
        }
      ];
    case "suitability-client-fit":
      return [
        {
          label: "Best-interest care",
          score: roundScore(metrics.summary.advisorPerformance.score * 0.7 + metrics.summary.clientOutcome.score * 0.3),
          summary: "Measures whether the recommendation basis and client-specific judgment stay in the client's best interest."
        },
        {
          label: "Supervisory controls",
          score: metrics.summary.compliance.score,
          summary: "Measures whether the trainee avoided suitability hits, concentration problems, and other review flags."
        },
        {
          label: "Customer profile fit",
          score: roundScore(metrics.summary.clientOutcome.score * 0.65 + metrics.summary.advisorPerformance.score * 0.35),
          summary: "Measures whether product selection actually fits the customer's risk, objective, and mandate."
        }
      ];
    case "retirement-planning":
      return [
        {
          label: "Fiduciary care",
          score: roundScore(metrics.summary.advisorPerformance.score * 0.65 + metrics.summary.clientOutcome.score * 0.35),
          summary: "Measures whether advice reflects prudent retirement judgment instead of product pushing."
        },
        {
          label: "Income sustainability",
          score: roundScore(metrics.summary.clientOutcome.score * 0.55 + metrics.summary.portfolioOutcome.score * 0.45),
          summary: "Measures whether the plan protects long-term spending needs, reserves, and drawdown durability."
        },
        {
          label: "Distribution discipline",
          score: metrics.summary.compliance.score,
          summary: "Measures whether the trainee handled retirement-account, withdrawal, and suitability issues cleanly."
        }
      ];
    case "mortgage-debt-planning":
      return [
        {
          label: "Ability-to-repay",
          score: roundScore(metrics.summary.advisorPerformance.score * 0.6 + metrics.summary.clientOutcome.score * 0.4),
          summary: "Measures whether the trainee recommended a mortgage lane the borrower can realistically carry."
        },
        {
          label: "Disclosure and fair lending",
          score: metrics.summary.compliance.score,
          summary: "Measures whether the trainee stayed inside disclosure, timing, and consumer-protection expectations."
        },
        {
          label: "Loan-fit judgment",
          score: roundScore(metrics.summary.clientOutcome.score * 0.55 + metrics.summary.advisorPerformance.score * 0.45),
          summary: "Measures whether the chosen loan lane matches the borrower's reserves, horizon, and risk profile."
        }
      ];
    case "bank-lending":
      return [
        {
          label: "Repayment capacity",
          score: roundScore(metrics.summary.advisorPerformance.score * 0.6 + metrics.summary.clientOutcome.score * 0.4),
          summary: "Measures whether the file was judged on cash flow, debt service, and ability to repay."
        },
        {
          label: "Underwriting controls",
          score: metrics.summary.compliance.score,
          summary: "Measures whether the trainee respected documentation, collateral, and policy-control expectations."
        },
        {
          label: "Credit decision discipline",
          score: roundScore(metrics.summary.clientOutcome.score * 0.5 + metrics.summary.advisorPerformance.score * 0.5),
          summary: "Measures whether approve, conditional, or decline decisions were defensible and consistent."
        }
      ];
    case "phishing-scams-trainee":
    case "phishing-scams-it":
      return metrics.workspaceScoreCards ?? [
        {
          label: "Threat detection",
          score: metrics.workspaceScoreOverride ?? metrics.summary.compliance.score,
          summary: "Measures how accurately the trainee identifies scam tells, spoofing, and malicious email behavior."
        },
        {
          label: "Client safeguarding",
          score: roundScore(metrics.summary.clientOutcome.score * 0.9),
          summary: "Measures whether the trainee protects clients when they ask if an email, link, or request is a scam."
        },
        {
          label: "Endpoint response",
          score: metrics.summary.compliance.score,
          summary: "Measures how well the trainee handles malware incidents and risky clicks."
        }
      ];
    case "client-meeting-readiness":
      return metrics.workspaceScoreCards ?? [
        { label: "Communication", score: metrics.summary.advisorPerformance.score, summary: "Measures whether the trainee explains advice clearly and professionally." },
        { label: "Compliance", score: metrics.summary.compliance.score, summary: "Measures whether the trainee avoids unlawful or noncompliant language." },
        { label: "Rational thinking", score: metrics.summary.clientOutcome.score, summary: "Measures whether the trainee's answer is coherent, suitable, and defensible." }
      ];
    case "tax-planning":
      return metrics.workspaceScoreCards ?? [
        { label: "Tax accuracy", score: metrics.workspaceScoreOverride ?? metrics.summary.advisorPerformance.score, summary: "Measures correct IRC bracket, conversion, and RMD decisions." },
        { label: "Planning judgment", score: roundScore(metrics.summary.advisorPerformance.score * 0.9), summary: "Measures quality of tax-aware recommendations for each client." },
        { label: "Code compliance", score: metrics.summary.compliance.score, summary: "Measures whether the trainee applied current IRC rules correctly." }
      ];
    case "insurance-planning":
      return metrics.workspaceScoreCards ?? [
        { label: "Coverage analysis", score: metrics.workspaceScoreOverride ?? metrics.summary.advisorPerformance.score, summary: "Measures accuracy of coverage gap and needs analysis." },
        { label: "Product knowledge", score: roundScore(metrics.summary.advisorPerformance.score * 0.95), summary: "Measures correct identification of appropriate policy types." },
        { label: "Regulatory compliance", score: metrics.summary.compliance.score, summary: "Measures application of IRC §7702, §7702B, and state insurance rules." }
      ];
    case "estate-planning":
      return metrics.workspaceScoreCards ?? [
        { label: "Estate analysis", score: metrics.workspaceScoreOverride ?? metrics.summary.advisorPerformance.score, summary: "Measures accuracy of estate exposure and trust structure decisions." },
        { label: "Trust knowledge", score: roundScore(metrics.summary.advisorPerformance.score * 0.95), summary: "Measures correct application of trust types and IRC rules." },
        { label: "Regulatory compliance", score: metrics.summary.compliance.score, summary: "Measures application of IRC §§2001-2210 and TCJA sunset awareness." }
      ];
    case "qualified-plans":
      return metrics.workspaceScoreCards ?? [
        { label: "Plan knowledge", score: metrics.workspaceScoreOverride ?? metrics.summary.advisorPerformance.score, summary: "Measures correct plan type selection and contribution maximization." },
        { label: "ERISA compliance", score: roundScore(metrics.summary.compliance.score * 0.95), summary: "Measures application of ERISA fiduciary standards and prohibited transaction rules." },
        { label: "Contribution optimization", score: roundScore(metrics.summary.advisorPerformance.score * 0.9), summary: "Measures accuracy of contribution limit and catch-up calculations." }
      ];
    case "stock-game":
    default:
      return [
        { label: "Exam readiness", score: metrics.summary.examReadiness.score, summary: "Knowledge and coverage across the active exam material." },
        { label: "Advisor judgment", score: metrics.summary.advisorPerformance.score, summary: "Judgment across suitability, planning, and client stewardship." },
        { label: "Compliance", score: metrics.summary.compliance.score, summary: "How cleanly the trainee stayed inside review and compliance expectations." }
      ];
  }
}

function regulatoryWeightMap(module: TrainingModuleDefinition) {
  switch (module.workspace) {
    case "exam-foundations":
      return [0.5, 0.35, 0.15];
    case "suitability-client-fit":
      return [0.4, 0.35, 0.25];
    case "retirement-planning":
      return [0.35, 0.35, 0.3];
    case "mortgage-debt-planning":
      return [0.4, 0.25, 0.35];
    case "bank-lending":
      return [0.4, 0.3, 0.3];
    case "phishing-scams-trainee":
    case "phishing-scams-it":
      return [0.45, 0.25, 0.3];
    case "client-meeting-readiness":
      return [0.4, 0.3, 0.3];
    case "tax-planning":
      return [0.4, 0.35, 0.25];
    case "insurance-planning":
      return [0.4, 0.35, 0.25];
    case "estate-planning":
      return [0.4, 0.35, 0.25];
    case "qualified-plans":
      return [0.4, 0.3, 0.3];
    case "stock-game":
    default:
      return [0.35, 0.35, 0.3];
  }
}

export function buildModuleAssessment(module: TrainingModuleDefinition, metrics: ModuleLiveMetrics): {
  moduleScore: number;
  scoreCards: ModuleScoreCard[];
  summary: string;
} {
  if (
    (module.workspace === "client-meeting-readiness" ||
      module.workspace === "phishing-scams-trainee" ||
      module.workspace === "phishing-scams-it") &&
    typeof metrics.workspaceScoreOverride === "number"
  ) {
    const cards = (metrics.workspaceScoreCards ?? []).map((card) => ({ ...card }));
    return {
      moduleScore: metrics.workspaceScoreOverride,
      scoreCards: cards,
      summary: "Free-response module graded on communication, compliance, and reasoning."
    };
  }

  const cards = buildRegulatoryAlignedCards(module, metrics);
  const weights = regulatoryWeightMap(module);
  const weightedScore = roundScore(cards.reduce((total, card, index) => total + card.score * (weights[index] ?? 0), 0));
  const lens = buildRegulatoryLens(module);
  return {
    moduleScore: weightedScore,
    scoreCards: cards,
    summary: `${lens}. ${module.completionLabel}`
  };
}

export function buildModuleAssessmentFromReport(module: TrainingModuleDefinition, report: TrainingSessionReport): {
  moduleScore: number;
  scoreCards: ModuleAssessmentCard[];
  summary: string;
} {
  const metrics: ModuleLiveMetrics = {
    difficulty: report.difficulty,
    studyAccuracy: report.studyAccuracy,
    answeredQuestions: report.answeredQuestions,
    summary: {
      examReadiness: report.examReadiness,
      advisorPerformance: report.advisorPerformance,
      clientOutcome: report.clientOutcome,
      compliance: report.compliance,
      portfolioOutcome: report.portfolioOutcome,
      overall: report.overall
    }
  };
  const assessment = buildModuleAssessment(module, metrics);
  return {
    moduleScore: assessment.moduleScore,
    scoreCards: assessment.scoreCards.map((card) => ({
      label: card.label,
      score: card.score,
      summary: card.summary ?? ""
    })),
    summary: assessment.summary
  };
}

export function buildModuleScoreCards(module: TrainingModuleDefinition, metrics: ModuleLiveMetrics): ModuleScoreCard[] {
  return buildModuleAssessment(module, metrics).scoreCards;
}

export function computeModuleScore(module: TrainingModuleDefinition, metrics: ModuleLiveMetrics) {
  return buildModuleAssessment(module, metrics).moduleScore;
}

export function moduleReachedCompletion(module: TrainingModuleDefinition, metrics: ModuleLiveMetrics) {
  const difficultyMet = module.requiredDifficulty === null || difficultyRank(metrics.difficulty) >= moduleDifficultyRank(module.requiredDifficulty);
  const accuracyMet = metrics.studyAccuracy >= module.minimumAccuracy;
  const answeredMet = metrics.answeredQuestions >= module.minimumAnsweredQuestions;
  const moduleScore = computeModuleScore(module, metrics);
  const scoreMet = module.completionScoreTarget === null || moduleScore >= module.completionScoreTarget;

  return difficultyMet && accuracyMet && answeredMet && scoreMet;
}

function computeCompletionPercent(module: TrainingModuleDefinition, report: TrainingSessionReport | null) {
  if (!report) {
    return 0;
  }

  const difficultyScore = module.requiredDifficulty === null
    ? 1
    : difficultyRank(report.difficulty) >= moduleDifficultyRank(module.requiredDifficulty) ? 1 : 0.45;
  const accuracyScore = module.minimumAccuracy <= 0 ? 1 : Math.min(report.studyAccuracy / module.minimumAccuracy, 1);
  const moduleScore = module.completionScoreTarget === null ? 1 : Math.min(buildModuleAssessmentFromReport(module, report).moduleScore / module.completionScoreTarget, 1);
  const answerVolumeScore = module.minimumAnsweredQuestions <= 0 ? 1 : Math.min(report.answeredQuestions / module.minimumAnsweredQuestions, 1);

  return Math.round((difficultyScore * 0.2 + accuracyScore * 0.25 + moduleScore * 0.4 + answerVolumeScore * 0.15) * 100);
}

function reportMatchesModule(module: TrainingModuleDefinition, report: TrainingSessionReport) {
  if (!reportBelongsToModule(module, report)) {
    return false;
  }

  return (
    (module.requiredDifficulty === null || difficultyRank(report.difficulty) >= moduleDifficultyRank(module.requiredDifficulty)) &&
    report.studyAccuracy >= module.minimumAccuracy &&
    (module.completionScoreTarget === null || buildModuleAssessmentFromReport(module, report).moduleScore >= module.completionScoreTarget) &&
    report.answeredQuestions >= module.minimumAnsweredQuestions
  );
}

export function buildAssignmentSnapshots(assignments: TrainingAssignment[], reports: TrainingSessionReport[]) {
  return assignments.map<AssignmentProgressSnapshot>((assignment) => {
    const module = TRAINING_MODULES.find((entry) => entry.id === assignment.moduleId);
    if (!module) {
      throw new Error(`Unknown training module: ${assignment.moduleId}`);
    }

    const traineeReports = reports
      .filter((report) => report.traineeId === assignment.traineeId)
      .sort((left, right) => right.endedAt - left.endedAt);
    const moduleReports = traineeReports.filter((report) => reportBelongsToModule(module, report));
    const moduleWithAssignedDifficulty: TrainingModuleDefinition = {
      ...module,
      requiredDifficulty: effectiveModuleDifficulty(module, assignment)
    };
    const bestMatchingReport =
      moduleReports.find((report) => reportMatchesModule(moduleWithAssignedDifficulty, report))
      ?? moduleReports[0]
      ?? null;

    // Overdue penalty: if past due date and minimumAnsweredQuestions not met, score = 0
    const now = Date.now();
    const isPastDue = assignment.dueAt !== null && assignment.dueAt < now;
    const answeredCount = bestMatchingReport?.answeredQuestions ?? 0;
    const minimumMet = answeredCount >= moduleWithAssignedDifficulty.minimumAnsweredQuestions;
    const overdueZeroScore = isPastDue && !minimumMet;

    return {
      assignmentId: assignment.id,
      module: moduleWithAssignedDifficulty,
      assignedDifficulty: assignment.assignedDifficulty,
      jurisdictionCode: assignment.jurisdictionCode ?? null,
      assignedMortgageRate: assignment.assignedMortgageRate ?? null,
      assignedMortgageScenarioId: assignment.assignedMortgageScenarioId ?? null,
      status: assignment.status,
      completionPercent: overdueZeroScore ? 0 : computeCompletionPercent(moduleWithAssignedDifficulty, bestMatchingReport),
      bestMatchingReport,
      dueAt: assignment.dueAt,
      assignedAt: assignment.assignedAt,
      overdueZeroScore,
      answeredVsRequired: { answered: answeredCount, required: moduleWithAssignedDifficulty.minimumAnsweredQuestions }
    };
  });
}

export function updateAssignmentsFromReport(assignments: TrainingAssignment[], report: TrainingSessionReport) {
  return assignments.map<TrainingAssignment>((assignment) => {
    if (assignment.traineeId !== report.traineeId || assignment.status === "completed") {
      return assignment;
    }

    const module = TRAINING_MODULES.find((entry) => entry.id === assignment.moduleId);
    if (!module) {
      return assignment;
    }

    const moduleWithAssignedDifficulty: TrainingModuleDefinition = {
      ...module,
      requiredDifficulty: effectiveModuleDifficulty(module, assignment)
    };

    if (reportMatchesModule(moduleWithAssignedDifficulty, report)) {
      return {
        ...assignment,
        status: "completed",
        completedAt: report.endedAt
      };
    }

    if (assignment.status === "pending") {
      return {
        ...assignment,
        status: "in-progress"
      };
    }

    return assignment;
  });
}
