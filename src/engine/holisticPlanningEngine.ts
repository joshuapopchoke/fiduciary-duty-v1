import type { ClientAccount } from "../types/client";

export interface BenefitsSnapshot {
  applicable: boolean;
  label: string;
  note: string;
  action: string;
}

export interface EstatePlanningSnapshot {
  urgency: "low" | "moderate" | "high";
  label: string;
  note: string;
  action: string;
}

export interface RetirementMathSnapshot {
  applicable: boolean;
  fundedRatio: number;
  projectedLongevitySuccess: string;
  annualGap: number;
  summary: string;
}

export interface ProductComparisonSnapshot {
  primaryNeed: string;
  recommendedLane: string;
  lowerCostAlternative: string;
  caution: string;
}

export interface CrmWorkflowSnapshot {
  serviceModel: string;
  nextReviewWindow: string;
  nextTask: string;
  relationshipNote: string;
}

export interface SupervisionSnapshot {
  reviewLevel: string;
  exceptionFocus: string;
  documentationPriority: string;
  note: string;
}

function isInstitutional(client: ClientAccount) {
  return client.id === "institutional";
}

export function buildBenefitsSnapshot(client: ClientAccount): BenefitsSnapshot {
  if (isInstitutional(client)) {
    return {
      applicable: false,
      label: "Institutional mandate",
      note: "Employer-benefit planning is not the driver here. Governance and spending support matter more than workplace benefit elections.",
      action: "Keep attention on policy discipline, liquidity, and governance."
    };
  }

  if (client.retirementDistribution.distributionPhase && client.id === "retiree") {
    return {
      applicable: true,
      label: "Healthcare and income coordination",
      note: client.benefitsProfile.planningFocus,
      action: "Coordinate Medicare, taxable income, and reserve planning before stretching for extra risk."
    };
  }

  return {
    applicable: true,
    label: "Workplace benefits review",
    note: client.benefitsProfile.planningFocus,
    action: client.benefitsProfile.employerMatch
  };
}

export function buildEstatePlanningSnapshot(client: ClientAccount): EstatePlanningSnapshot {
  const complexityScore =
    client.estateProfile.coreDocuments.length +
    (client.insuranceGapScore > 35 ? 1 : 0) +
    (client.cashFlow.nearTermLiquidityNeed === "High" ? 1 : 0) +
    (client.id === "entrepreneur" || client.id === "family" ? 1 : 0);

  const urgency: EstatePlanningSnapshot["urgency"] =
    complexityScore >= 5 ? "high" :
    complexityScore >= 3 ? "moderate" :
    "low";

  const label =
    urgency === "high" ? "Estate work active" :
    urgency === "moderate" ? "Estate review due" :
    "Estate basics in place";

  return {
    urgency,
    label,
    note: client.estateProfile.planningFocus,
    action: `${client.estateProfile.trustStructure} ${client.estateProfile.beneficiaryReview}`
  };
}

export function buildRetirementMathSnapshot(client: ClientAccount, accountValue: number): RetirementMathSnapshot {
  const annualGap = Math.max(0, client.retirementMath.annualSpendingGoal - client.retirementMath.annualGuaranteedIncome);
  const sustainableSpend = accountValue * client.retirementMath.safeWithdrawalGuardrail;
  const fundedRatio = annualGap <= 0 ? 1.5 : sustainableSpend / annualGap;
  const longevityLabel =
    client.retirementMath.assumedLongevityAge === null
      ? "Perpetual mandate"
      : `Modeled to age ${client.retirementMath.assumedLongevityAge}`;

  const summary =
    fundedRatio >= 1.1
      ? "Current assets can plausibly support the modeled withdrawal need if risk stays disciplined."
      : fundedRatio >= 0.8
        ? "The plan is close, but spending pressure or weaker returns could force tougher tradeoffs."
        : "The plan is under strain; spending, guaranteed income, or allocation assumptions likely need work.";

  return {
    applicable: true,
    fundedRatio,
    projectedLongevitySuccess: longevityLabel,
    annualGap,
    summary
  };
}

export function buildProductComparisonSnapshot(client: ClientAccount): ProductComparisonSnapshot {
  return {
    primaryNeed: client.productComparison.primaryNeed,
    recommendedLane: client.productComparison.recommendedLane,
    lowerCostAlternative: client.productComparison.lowerCostAlternative,
    caution: client.productComparison.caution
  };
}

export function buildCrmWorkflowSnapshot(client: ClientAccount): CrmWorkflowSnapshot {
  return {
    serviceModel: client.crmProfile.serviceModel,
    nextReviewWindow: client.crmProfile.nextReviewWindow,
    nextTask: client.crmProfile.nextTask,
    relationshipNote: `${client.crmProfile.lastContactSummary} Referral potential: ${client.crmProfile.referralPotential}.`
  };
}

export function buildSupervisionSnapshot(client: ClientAccount): SupervisionSnapshot {
  return {
    reviewLevel: client.supervisionProfile.reviewLevel,
    exceptionFocus: client.supervisionProfile.exceptionFocus,
    documentationPriority: client.supervisionProfile.documentationPriority,
    note: client.supervisionProfile.supervisionNote
  };
}
