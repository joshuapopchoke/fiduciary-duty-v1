import type { ClientAccount } from "../types/client";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export interface MortgageScenarioSnapshot {
  currentLtv: number;
  frontEndDti: number;
  backEndDti: number;
  paymentShockPct: number;
  refinanceBreakEvenMonths: number;
  recommendedLane: string;
  scenarioSummary: string;
}

export interface MortgageProductComparisonSnapshot {
  fixedMonthlyEstimate: number;
  armMonthlyEstimate: number;
  pointsBreakEvenMonths: number;
  helocVsCashOut: string;
  pmiExitLane: string;
  recommendation: string;
}

export interface BankLendingSnapshot {
  underwritingScore: number;
  decisionBand: "Approve" | "Conditional" | "Borderline" | "Decline";
  debtCoverageLabel: string;
  reserveSupportLabel: string;
  riskSummary: string;
  nextBestAction: string;
}

export interface LendingDecisionMatrixSnapshot {
  termLane: string;
  collateralLane: string;
  documentationLane: string;
  recommendation: string;
}

export function buildMortgageScenarioSnapshot(client: ClientAccount) {
  const grossIncome = Math.max(1, client.cashFlow.monthlyIncome);
  const housingBase = Math.max(
    client.debtProfile.housingPayment,
    client.mortgageProfile.propertyTaxMonthly + client.mortgageProfile.homeownerInsuranceMonthly
  );
  const frontEndDti = housingBase / grossIncome;
  const backEndDti = (client.cashFlow.monthlyDebtPayments + housingBase) / grossIncome;
  const currentLtv = client.debtProfile.propertyValue > 0
    ? client.debtProfile.mortgageBalance / client.debtProfile.propertyValue
    : 0;
  const refinanceRate = Math.max(0.035, client.debtProfile.mortgageRate - (client.creditProfile.score >= 740 ? 0.0085 : 0.0045));
  const paymentShockPct = client.debtProfile.mortgageRate > 0
    ? (client.debtProfile.mortgageRate - refinanceRate) / client.debtProfile.mortgageRate
    : 0;
  const breakEvenBase = client.mortgageProfile.closingCostSensitivity === "High" ? 28 : client.mortgageProfile.closingCostSensitivity === "Moderate" ? 22 : 16;
  const refinanceBreakEvenMonths = Math.round(clamp(breakEvenBase - paymentShockPct * 80 + backEndDti * 20, 8, 48));
  const recommendedLane =
    currentLtv <= 0.8 && backEndDti < 0.4
      ? "Refinance review is realistic"
      : client.debtProfile.unpaidDebtBalance > 0 || client.creditProfile.score < 680
        ? "Repair credit and debt posture first"
        : "Hold current mortgage and improve reserves";
  const scenarioSummary =
    recommendedLane === "Refinance review is realistic"
      ? `The household is inside a workable LTV/DTI lane, so comparing points, fixed-vs-ARM terms, and stay horizon is reasonable.`
      : recommendedLane === "Repair credit and debt posture first"
        ? "The mortgage conversation should start with debt cleanup, delinquency repair, and reserve rebuilding before chasing a new note."
        : "This looks more like a reserve and affordability conversation than a rate-shopping conversation right now.";

  return {
    currentLtv,
    frontEndDti,
    backEndDti,
    paymentShockPct,
    refinanceBreakEvenMonths,
    recommendedLane,
    scenarioSummary
  };
}

export function buildMortgageProductComparisonSnapshot(client: ClientAccount) {
  const principal = Math.max(120000, client.debtProfile.mortgageBalance || client.debtProfile.propertyValue * 0.72);
  const fixedRate = Math.max(0.038, client.debtProfile.mortgageRate);
  const armRate = Math.max(0.034, fixedRate - 0.0065);
  const years = Math.max(10, client.debtProfile.mortgageTermYearsRemaining || 30);
  const fixedMonthlyEstimate = Math.round((principal * (fixedRate / 12)) / (1 - Math.pow(1 + fixedRate / 12, -(years * 12))));
  const armMonthlyEstimate = Math.round((principal * (armRate / 12)) / (1 - Math.pow(1 + armRate / 12, -(years * 12))));
  const pointsBreakEvenMonths = Math.round(clamp(14 + (client.mortgageProfile.closingCostSensitivity === "High" ? 10 : 4) + (client.mortgageProfile.refinanceHorizonMonths < 36 ? 8 : 0), 12, 48));
  const helocVsCashOut =
    client.debtProfile.helocBalance > 0 || client.mortgageProfile.refinanceHorizonMonths < 48
      ? "HELOC is usually the cleaner comparison when flexibility matters more than resetting the first mortgage."
      : "Cash-out refi only makes sense if the borrower has runway, strong equity, and a use of proceeds that justifies resetting the note.";
  const pmiExitLane =
    client.mortgageProfile.pmiActive
      ? "Watch the LTV path closely because PMI removal can materially improve monthly cash flow."
      : "PMI is not the main issue here; term, rate, and liquidity fit matter more.";
  const recommendation =
    armMonthlyEstimate + 180 < fixedMonthlyEstimate && client.mortgageProfile.refinanceHorizonMonths < 60
      ? "Compare the lower-payment ARM only if the borrower truly has a shorter horizon and accepts reset risk."
      : "The fixed-rate lane is usually easier to defend when the client values stability and long-term payment visibility.";

  return {
    fixedMonthlyEstimate,
    armMonthlyEstimate,
    pointsBreakEvenMonths,
    helocVsCashOut,
    pmiExitLane,
    recommendation
  };
}

export function buildBankLendingSnapshot(client: ClientAccount) {
  const grossIncome = Math.max(1, client.cashFlow.monthlyIncome);
  const monthlyObligations = client.cashFlow.monthlyDebtPayments + client.debtProfile.housingPayment;
  const dti = monthlyObligations / grossIncome;
  const reserveMonths = client.cash / Math.max(1, client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments);
  const latePaymentPenalty = client.lendingProfile.recentLatePayments * 6 + client.creditProfile.unpaidCollections * 8;
  const creditBoost = (client.creditProfile.score - 650) * 0.14;
  const reserveBoost = Math.min(18, reserveMonths * 1.8);
  // DTI penalty: traditional conventional guideline is 36% soft limit.
  // CFPB QM rule (12 CFR §1026.43) sets a hard 43% back-end ceiling for Qualified Mortgages.
  // Penalty slope starts at 36%; DTI above 43% carries an additional hard penalty
  // to reflect the QM ceiling being breached.
  const dtiPenalty = Math.max(0, (dti - 0.36) * 140) + (dti > 0.43 ? (dti - 0.43) * 80 : 0);
  const underwritingScore = Math.round(clamp(64 + creditBoost + reserveBoost - dtiPenalty - latePaymentPenalty, 24, 96));
  const decisionBand =
    underwritingScore >= 80 ? "Approve" :
    underwritingScore >= 68 ? "Conditional" :
    underwritingScore >= 58 ? "Borderline" :
    "Decline";
  const debtCoverageLabel =
    dti < 0.3 ? `Low debt pressure at ${formatPercent(dti)}` :
    dti < 0.4 ? `Manageable debt pressure at ${formatPercent(dti)}` :
    `Elevated debt pressure at ${formatPercent(dti)}`;
  const reserveSupportLabel =
    reserveMonths >= client.cashFlow.emergencyReserveMonths
      ? `${reserveMonths.toFixed(1)} months of reserves`
      : `${reserveMonths.toFixed(1)} months, below target`;
  const nextBestAction =
    decisionBand === "Approve"
      ? "Advance to term structuring and collateral verification."
      : decisionBand === "Conditional"
        ? "Request cleaner debt documentation, reserve proof, or a lower requested amount."
        : decisionBand === "Borderline"
          ? "Reduce requested amount and improve debt profile before resubmission."
          : "Decline for now and coach on debt cleanup, credit repair, and reserve rebuilding.";
  const riskSummary =
    client.lendingProfile.underwritingTrack === "Institutional"
      ? "Institutional lending should still focus on coverage, liquidity, and governance discipline rather than story-driven approval."
      : "Use this as a lending decision aid, not a blanket yes/no. The real coaching point is why the file sits in this band.";

  return {
    underwritingScore,
    decisionBand,
    debtCoverageLabel,
    reserveSupportLabel,
    riskSummary,
    nextBestAction
  };
}

export function buildLendingDecisionMatrixSnapshot(client: ClientAccount) {
  const debtRatio = (client.cashFlow.monthlyDebtPayments + client.debtProfile.housingPayment) / Math.max(1, client.cashFlow.monthlyIncome);
  const termLane =
    debtRatio < 0.3 ? "Longer-term approval is supportable." :
    debtRatio < 0.4 ? "A shorter or more structured term may be safer." :
    "Term should stay conservative until the file is cleaner.";
  const collateralLane =
    client.lendingProfile.collateralStrength === "Strong"
      ? "Collateral quality supports the request."
      : client.lendingProfile.collateralStrength === "Moderate"
        ? "Collateral is usable, but not enough to ignore cash-flow risk."
        : "Collateral support is too thin to carry this file alone.";
  const documentationLane =
    client.creditProfile.unpaidCollections > 0 || client.lendingProfile.recentLatePayments > 0
      ? "Require extra documentation, repayment explanation, and proof of cleanup."
      : "Standard documentation lane looks reasonable so far.";
  const recommendation =
    client.creditProfile.score >= 740 && debtRatio < 0.35
      ? "Approve or approve conditionally depending on final documentation."
      : client.creditProfile.score >= 680 && debtRatio < 0.42
        ? "Conditional approval is more defensible than a clean approval."
        : "The better coaching move is to decline for now and give a repair path.";

  return {
    termLane,
    collateralLane,
    documentationLane,
    recommendation
  };
}
