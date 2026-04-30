import type { ClientAccount } from "../types/client";
import type { Ticker } from "../types/market";
import {
  TAX_BRACKETS_2024,
  LTCG_RATES_2024,
  NIIT_RATE,
  NIIT_THRESHOLD_SINGLE,
  NIIT_THRESHOLD_MFJ
} from "./taxPlanningEngine";
import { getStateTaxProfile, type StateTaxProfile } from "../data/stateTaxData";

// ─── Income Tax Calculation Engine ───────────────────────────────────────────
// Computes federal + state income tax liability from income components.
// Federal: IRC §1 (ordinary income), §1(h) (LTCG), §1411 (NIIT), §63 (standard
// deduction), Rev. Proc. 2023-34 (2024 figures).
// State: 2024 rates per Tax Foundation and state revenue departments.

// 2024 Federal Standard Deductions (IRC §63(c), Rev. Proc. 2023-34)
const FEDERAL_STANDARD_DEDUCTION = {
  single: 14600,
  mfj: 29200
};

// Social Security taxability thresholds (IRC §86)
// Up to 85% of SS benefits are taxable above the combined income thresholds
const SS_TAXABILITY = {
  single: { threshold1: 25000, threshold2: 34000 },  // 50% above $25K, 85% above $34K
  mfj: { threshold1: 32000, threshold2: 44000 }
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IncomeComponents {
  wages: number;               // W-2 wages, salary, self-employment (pre-deduction)
  interestIncome: number;      // Taxable interest (ordinary income)
  ordinaryDividends: number;   // Ordinary dividends (ordinary income)
  qualifiedDividends: number;  // Qualified dividends (LTCG rates) — subset of ordinary
  shortTermGains: number;      // STCG — ordinary income rates
  longTermGains: number;       // LTCG — preferential rates
  socialSecurityBenefits: number; // Gross SS benefits (portion may be taxable)
  pensionIncome: number;       // Fully taxable as ordinary income
  otherOrdinaryIncome: number; // Rental, royalties, etc. included in NII
  retirementDistributions: number; // IRA/401k distributions — ordinary income
  traditionalIraContribution: number; // Pre-tax IRA deduction (if deductible)
  otherAboveLineDeductions: number;   // HSA, student loan interest, etc.
}

export interface FederalTaxCalculation {
  grossIncome: number;
  adjustedGrossIncome: number;          // AGI
  standardDeduction: number;
  taxableIncome: number;                // AGI - standard deduction
  ordinaryTaxableIncome: number;        // Excludes LTCG and qualified dividends
  preferentialIncome: number;           // LTCG + qualified dividends
  netInvestmentIncome: number;          // For NIIT
  // Tax amounts
  ordinaryIncomeTax: number;
  preferentialIncomeTax: number;        // Tax on LTCG + qualified dividends
  niitAmount: number;                   // 3.8% NIIT if applicable
  selfEmploymentTax: number;            // 15.3% / 7.65% above threshold (if applicable)
  totalFederalTax: number;
  effectiveFederalRate: number;
  marginalOrdinaryRate: number;
  marginalLtcgRate: number;
  niitApplies: boolean;
  // Bracket breakdown
  bracketBreakdown: { bracket: string; income: number; tax: number }[];
}

export interface StateTaxCalculation {
  stateCode: string;
  stateName: string;
  taxType: StateTaxProfile["type"];
  stateAgi: number;             // State AGI (federal AGI ± state adjustments — simplified here)
  stateDeduction: number;
  stateTaxableIncome: number;
  stateTax: number;
  effectiveStateRate: number;
  marginalStateRate: number;
  topMarginalStateRate: number;
  specialNotes: string;
  bracketBreakdown: { bracket: string; income: number; tax: number }[];
}

export interface CompleteTaxCalculation {
  filingStatus: "single" | "mfj";
  incomeComponents: IncomeComponents;
  federal: FederalTaxCalculation;
  state: StateTaxCalculation | null;
  combinedTotalTax: number;
  combinedEffectiveRate: number;
  afterTaxIncome: number;
  totalIncomeForComparison: number;
  // Key planning insights
  marginalFederalRate: number;
  marginalStateRate: number;
  combinedMarginalRate: number;
  planningNotes: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferFilingStatus(client: ClientAccount): "single" | "mfj" {
  const s = client.taxProfile.filingStatus.toLowerCase();
  return (s.includes("joint") || s.includes("married")) ? "mfj" : "single";
}

function computeOrdinaryTax(
  ordinaryTaxableIncome: number,
  filing: "single" | "mfj"
): { tax: number; breakdown: { bracket: string; income: number; tax: number }[] } {
  const brackets = TAX_BRACKETS_2024[filing];
  let tax = 0;
  let prevUpTo = 0;
  const breakdown: { bracket: string; income: number; tax: number }[] = [];

  for (const bracket of brackets) {
    if (ordinaryTaxableIncome <= prevUpTo) break;
    const taxableInBracket = Math.min(ordinaryTaxableIncome, bracket.upTo) - prevUpTo;
    const taxInBracket = taxableInBracket * bracket.rate;
    tax += taxInBracket;
    if (taxableInBracket > 0) {
      breakdown.push({
        bracket: `${(bracket.rate * 100).toFixed(0)}%`,
        income: Math.round(taxableInBracket),
        tax: Math.round(taxInBracket)
      });
    }
    prevUpTo = bracket.upTo;
    if (ordinaryTaxableIncome <= bracket.upTo) break;
  }
  return { tax, breakdown };
}

function computeLtcgTax(
  preferentialIncome: number,
  ordinaryTaxableIncome: number,
  filing: "single" | "mfj"
): { tax: number; breakdown: { bracket: string; income: number; tax: number }[] } {
  // LTCG "stacks" on top of ordinary income — uses combined income to determine rate
  const totalIncome = ordinaryTaxableIncome + preferentialIncome;
  const rates = LTCG_RATES_2024[filing];
  let tax = 0;
  let prevUpTo = ordinaryTaxableIncome; // LTCG starts where ordinary income ends
  const breakdown: { bracket: string; income: number; tax: number }[] = [];

  for (const tier of rates) {
    if (totalIncome <= prevUpTo || prevUpTo >= tier.upTo) {
      prevUpTo = tier.upTo;
      continue;
    }
    const taxableInTier = Math.min(totalIncome, tier.upTo) - prevUpTo;
    const ltcgInTier = Math.min(taxableInTier, preferentialIncome);
    const taxInTier = ltcgInTier * tier.rate;
    tax += taxInTier;
    if (ltcgInTier > 0) {
      breakdown.push({
        bracket: `${(tier.rate * 100).toFixed(0)}% LTCG`,
        income: Math.round(ltcgInTier),
        tax: Math.round(taxInTier)
      });
    }
    prevUpTo = tier.upTo;
    if (totalIncome <= tier.upTo) break;
  }
  return { tax, breakdown };
}

function getMarginalOrdinaryRate(taxableIncome: number, filing: "single" | "mfj"): number {
  const brackets = TAX_BRACKETS_2024[filing];
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.upTo) return bracket.rate;
  }
  return 0.37;
}

function getMarginalLtcgRate(magi: number, filing: "single" | "mfj"): number {
  const rates = LTCG_RATES_2024[filing];
  for (const tier of rates) {
    if (magi <= tier.upTo) return tier.rate;
  }
  return 0.20;
}

function computeSocialSecurityTaxableAmount(
  ssBenefits: number,
  provisionalIncome: number, // AGI + tax-exempt interest + 50% of SS
  filing: "single" | "mfj"
): number {
  if (ssBenefits === 0) return 0;
  const thresholds = SS_TAXABILITY[filing];
  if (provisionalIncome <= thresholds.threshold1) return 0;
  if (provisionalIncome <= thresholds.threshold2) {
    return Math.min(ssBenefits * 0.50, (provisionalIncome - thresholds.threshold1) * 0.50);
  }
  return Math.min(
    ssBenefits * 0.85,
    Math.min(ssBenefits * 0.50, (thresholds.threshold2 - thresholds.threshold1) * 0.50) +
    (provisionalIncome - thresholds.threshold2) * 0.85
  );
}

function computeStateTax(
  profile: StateTaxProfile,
  federalAgi: number,
  filing: "single" | "mfj"
): StateTaxCalculation {
  if (profile.type === "none") {
    return {
      stateCode: profile.code,
      stateName: profile.name,
      taxType: "none",
      stateAgi: federalAgi,
      stateDeduction: 0,
      stateTaxableIncome: 0,
      stateTax: 0,
      effectiveStateRate: 0,
      marginalStateRate: 0,
      topMarginalStateRate: 0,
      specialNotes: profile.specialNotes ?? "No state income tax.",
      bracketBreakdown: []
    };
  }

  const deduction = filing === "mfj" ? profile.standardDeduction.mfj : profile.standardDeduction.single;
  const exemption = filing === "mfj" ? profile.personalExemption.mfj : profile.personalExemption.single;
  const stateTaxableIncome = Math.max(0, federalAgi - deduction - exemption);
  const breakdown: { bracket: string; income: number; tax: number }[] = [];
  let stateTax = 0;
  let marginalRate = 0;

  if (profile.type === "flat" && profile.flatRate !== undefined) {
    stateTax = stateTaxableIncome * profile.flatRate;
    marginalRate = profile.flatRate;
    if (stateTaxableIncome > 0) {
      breakdown.push({
        bracket: `${(profile.flatRate * 100).toFixed(2)}% flat`,
        income: Math.round(stateTaxableIncome),
        tax: Math.round(stateTax)
      });
    }
  } else if (profile.type === "graduated" && profile.brackets) {
    const brackets = filing === "mfj" ? profile.brackets.mfj : profile.brackets.single;
    let prevUpTo = 0;
    for (const bracket of brackets) {
      if (stateTaxableIncome <= prevUpTo) break;
      const taxableInBracket = Math.min(stateTaxableIncome, bracket.upTo) - prevUpTo;
      const taxInBracket = taxableInBracket * bracket.rate;
      stateTax += taxInBracket;
      marginalRate = bracket.rate;
      if (taxableInBracket > 0 && bracket.rate > 0) {
        breakdown.push({
          bracket: `${(bracket.rate * 100).toFixed(3).replace(/\.?0+$/, "")}%`,
          income: Math.round(taxableInBracket),
          tax: Math.round(taxInBracket)
        });
      }
      prevUpTo = bracket.upTo;
      if (stateTaxableIncome <= bracket.upTo) break;
    }
  }

  return {
    stateCode: profile.code,
    stateName: profile.name,
    taxType: profile.type,
    stateAgi: federalAgi,
    stateDeduction: deduction + exemption,
    stateTaxableIncome,
    stateTax: Math.round(stateTax),
    effectiveStateRate: federalAgi > 0 ? stateTax / federalAgi : 0,
    marginalStateRate: marginalRate,
    topMarginalStateRate: profile.topMarginalRate,
    specialNotes: profile.specialNotes ?? "",
    bracketBreakdown: breakdown
  };
}

// ─── Main Calculation Function ────────────────────────────────────────────────

export function calculateCompleteTax(
  client: ClientAccount,
  tickers: Record<string, Ticker>,
  stateCode: string,
  incomeOverrides?: Partial<IncomeComponents>
): CompleteTaxCalculation {
  const filing = inferFilingStatus(client);

  // ── Build income components from client data ──────────────────────────────
  const annualWages = client.cashFlow.monthlyIncome * 12;
  const annualGuaranteedIncome = client.retirementMath.annualGuaranteedIncome;

  // Estimate portfolio income from holdings
  let estimatedQualifiedDividends = 0;
  let estimatedOrdinaryDividends = 0;
  let estimatedInterest = 0;
  let estimatedLtcg = 0;

  Object.values(client.holdings).forEach(holding => {
    const ticker = tickers[holding.ticker];
    if (!ticker) return;
    const value = ticker.price * holding.shares;
    if (ticker.dividendYield && ticker.dividendYield > 0) {
      const annualDiv = value * ticker.dividendYield;
      // Qualified if stock held in eligible category — use category to approximate
      if (ticker.category === "stocks" || ticker.category === "funds") {
        estimatedQualifiedDividends += annualDiv;
      } else {
        estimatedOrdinaryDividends += annualDiv;
      }
    }
    // Estimate bond interest income
    if ((ticker.category === "fixedIncome" || ticker.category === "bonds") && ticker.couponRate) {
      estimatedInterest += (value * ticker.couponRate) / 100;
    }
    // Estimate modest unrealized gain realization (0.5% annual turnover)
    const unrealized = value - holding.averageCost * holding.shares;
    if (unrealized > 0) estimatedLtcg += unrealized * 0.005;
  });

  // Distribution income: if in retirement, include guaranteed income
  const isDistributionPhase = client.retirementDistribution.distributionPhase;
  const pensionIncome = isDistributionPhase ? Math.max(0, annualGuaranteedIncome * 0.5) : 0;
  const ssIncome = isDistributionPhase ? Math.max(0, annualGuaranteedIncome * 0.5) : 0;
  const wagesForCalc = isDistributionPhase ? 0 : annualWages; // If retired, wages are zero

  const income: IncomeComponents = {
    wages: wagesForCalc,
    interestIncome: estimatedInterest,
    ordinaryDividends: estimatedOrdinaryDividends,
    qualifiedDividends: estimatedQualifiedDividends,
    shortTermGains: 0,
    longTermGains: estimatedLtcg,
    socialSecurityBenefits: ssIncome,
    pensionIncome: pensionIncome,
    otherOrdinaryIncome: 0,
    retirementDistributions: isDistributionPhase ? annualWages : 0,
    traditionalIraContribution: 0,
    otherAboveLineDeductions: 0,
    ...incomeOverrides // Allow trainer to override specific components
  };

  // ── Gross income (pre-AGI) ────────────────────────────────────────────────
  const provisionalIncomeForSS =
    income.wages +
    income.interestIncome +
    income.ordinaryDividends +
    income.shortTermGains +
    income.longTermGains +
    income.pensionIncome +
    income.retirementDistributions +
    income.otherOrdinaryIncome +
    (income.socialSecurityBenefits * 0.50);

  const taxableSS = computeSocialSecurityTaxableAmount(
    income.socialSecurityBenefits,
    provisionalIncomeForSS,
    filing
  );

  const grossIncome =
    income.wages +
    income.interestIncome +
    income.ordinaryDividends +
    income.shortTermGains +
    income.longTermGains +
    taxableSS +
    income.pensionIncome +
    income.otherOrdinaryIncome +
    income.retirementDistributions;

  // ── AGI ───────────────────────────────────────────────────────────────────
  const agi = Math.max(0,
    grossIncome -
    income.traditionalIraContribution -
    income.otherAboveLineDeductions
  );

  // ── Standard deduction ────────────────────────────────────────────────────
  const stdDed = filing === "mfj"
    ? FEDERAL_STANDARD_DEDUCTION.mfj
    : FEDERAL_STANDARD_DEDUCTION.single;

  // ── Taxable income ────────────────────────────────────────────────────────
  const taxableIncome = Math.max(0, agi - stdDed);

  // ── Separate ordinary from preferential ──────────────────────────────────
  const preferentialIncome = Math.min(
    income.qualifiedDividends + income.longTermGains,
    taxableIncome
  );
  const ordinaryTaxableIncome = Math.max(0, taxableIncome - preferentialIncome);

  // ── Ordinary income tax ───────────────────────────────────────────────────
  const { tax: ordinaryTax, breakdown: ordinaryBreakdown } =
    computeOrdinaryTax(ordinaryTaxableIncome, filing);

  // ── LTCG / qualified dividend tax ────────────────────────────────────────
  const { tax: preferentialTax, breakdown: ltcgBreakdown } =
    computeLtcgTax(preferentialIncome, ordinaryTaxableIncome, filing);

  // ── NIIT ──────────────────────────────────────────────────────────────────
  const niitThreshold = filing === "mfj" ? NIIT_THRESHOLD_MFJ : NIIT_THRESHOLD_SINGLE;
  const netInvestmentIncome =
    income.interestIncome +
    income.ordinaryDividends +
    income.shortTermGains +
    income.longTermGains +
    income.otherOrdinaryIncome; // Passive income counts too
  const niitApplies = agi > niitThreshold && netInvestmentIncome > 0;
  const niitBase = niitApplies
    ? Math.min(netInvestmentIncome, agi - niitThreshold)
    : 0;
  const niitAmount = Math.round(niitBase * NIIT_RATE);

  // ── Self-employment tax (SE tax if wages > 0 and self-employed) ───────────
  // Only applied when wages suggest self-employment (simplified — in reality
  // requires Schedule C; we approximate for planning purposes)
  const selfEmploymentTax = 0; // Not modeled at this level — advisory note included

  // ── Total federal ─────────────────────────────────────────────────────────
  const totalFederalTax = Math.round(ordinaryTax + preferentialTax) + niitAmount;
  const effectiveFederalRate = grossIncome > 0 ? totalFederalTax / grossIncome : 0;
  const marginalOrdinaryRate = getMarginalOrdinaryRate(ordinaryTaxableIncome, filing);
  const marginalLtcgRate = getMarginalLtcgRate(agi, filing);

  const federal: FederalTaxCalculation = {
    grossIncome: Math.round(grossIncome),
    adjustedGrossIncome: Math.round(agi),
    standardDeduction: stdDed,
    taxableIncome: Math.round(taxableIncome),
    ordinaryTaxableIncome: Math.round(ordinaryTaxableIncome),
    preferentialIncome: Math.round(preferentialIncome),
    netInvestmentIncome: Math.round(netInvestmentIncome),
    ordinaryIncomeTax: Math.round(ordinaryTax),
    preferentialIncomeTax: Math.round(preferentialTax),
    niitAmount,
    selfEmploymentTax,
    totalFederalTax,
    effectiveFederalRate,
    marginalOrdinaryRate,
    marginalLtcgRate,
    niitApplies,
    bracketBreakdown: [...ordinaryBreakdown, ...ltcgBreakdown]
  };

  // ── State tax ─────────────────────────────────────────────────────────────
  const stateProfile = getStateTaxProfile(stateCode);
  const state = stateProfile ? computeStateTax(stateProfile, Math.round(agi), filing) : null;

  // ── Combined metrics ──────────────────────────────────────────────────────
  const combinedTotalTax = totalFederalTax + (state?.stateTax ?? 0);
  const combinedEffectiveRate = grossIncome > 0 ? combinedTotalTax / grossIncome : 0;
  const afterTaxIncome = Math.round(grossIncome - combinedTotalTax);
  const marginalStateRate = state?.marginalStateRate ?? 0;
  const combinedMarginalRate = marginalOrdinaryRate + marginalStateRate;

  // ── Planning notes ────────────────────────────────────────────────────────
  const planningNotes: string[] = [];

  if (marginalOrdinaryRate >= 0.32) {
    planningNotes.push("Higher bracket — maximize all pre-tax deferrals (401(k), IRA, HSA) to reduce AGI.");
  }
  if (niitApplies) {
    planningNotes.push(`NIIT applies — AGI exceeds ${filing === "mfj" ? "$250,000" : "$200,000"} threshold. Net investment income of ${Math.round(netInvestmentIncome).toLocaleString()} is partially exposed to 3.8% surtax.`);
  }
  if (taxableSS > 0) {
    planningNotes.push(`${Math.round((taxableSS / ssIncome) * 100)}% of Social Security benefits are taxable based on provisional income. Consider coordinating IRA withdrawals to manage combined income.`);
  }
  if (preferentialIncome > 0 && marginalLtcgRate === 0) {
    planningNotes.push("0% LTCG rate — consider realizing additional long-term gains while in this bracket at no federal cost.");
  }
  if (combinedMarginalRate >= 0.45) {
    planningNotes.push(`Combined marginal rate of ${(combinedMarginalRate * 100).toFixed(1)}% — tax-exempt municipal bonds and other shelters deserve serious consideration.`);
  }
  if (state?.taxType === "none") {
    planningNotes.push(`${state.stateName} has no state income tax — this meaningfully reduces the combined marginal rate.`);
  }

  return {
    filingStatus: filing,
    incomeComponents: income,
    federal,
    state,
    combinedTotalTax,
    combinedEffectiveRate,
    afterTaxIncome,
    totalIncomeForComparison: Math.round(grossIncome),
    marginalFederalRate: marginalOrdinaryRate,
    marginalStateRate,
    combinedMarginalRate,
    planningNotes
  };
}

// ─── Scenario Builder ─────────────────────────────────────────────────────────
// Builds a "what-if" calculation with modified income to show planning impact

export function calculateTaxScenario(
  client: ClientAccount,
  tickers: Record<string, Ticker>,
  stateCode: string,
  scenarioOverrides: Partial<IncomeComponents>
): CompleteTaxCalculation {
  return calculateCompleteTax(client, tickers, stateCode, scenarioOverrides);
}

export function formatTaxSummaryLabel(calc: CompleteTaxCalculation): string {
  const pct = (calc.combinedEffectiveRate * 100).toFixed(1);
  const marginal = (calc.combinedMarginalRate * 100).toFixed(1);
  return `Effective: ${pct}% | Marginal: ${marginal}%`;
}
