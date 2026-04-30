import type { ClientAccount } from "../types/client";

// ─── Qualified Plan Engine ────────────────────────────────────────────────────
// Conforms to: IRC §401(a) (qualified plans), §403(b), §457, §408 (IRAs),
// §408A (Roth IRA), ERISA (29 U.S.C. §1001 et seq.), SECURE Act (2019),
// SECURE 2.0 Act (2022), and DOL regulations including PTE 2020-02.

// ─── 2024 Plan Limits (IRS Notice 2023-75) ───────────────────────────────────
export const PLAN_LIMITS_2024 = {
  // 401(k), 403(b), most 457 plans — IRC §402(g)(1)
  DC_EMPLOYEE_DEFERRAL: 23000,
  DC_CATCHUP_AGE50: 7500,              // IRC §414(v) — age 50+
  DC_CATCHUP_AGE60_63: 11250,          // SECURE 2.0 §109 — enhanced at 60-63 (2025)
  DC_TOTAL_ANNUAL_ADDITION: 69000,     // IRC §415(c)(1)(A) — employer+employee

  // SIMPLE IRA — IRC §408(p)
  SIMPLE_IRA_DEFERRAL: 16000,
  SIMPLE_IRA_CATCHUP: 3500,

  // SEP-IRA — IRC §408(k)
  SEP_IRA_MAX: 69000,
  SEP_IRA_PCT_OF_COMP: 0.25,           // 25% of compensation
  SEP_IRA_COMP_CAP: 345000,            // IRC §401(a)(17) — compensation cap

  // IRA — IRC §219(b)
  IRA_CONTRIBUTION: 7000,
  IRA_CATCHUP: 1000,                   // Age 50+

  // Defined Benefit — IRC §415(b)
  DB_ANNUAL_BENEFIT: 275000,           // Maximum annual benefit

  // Compensation cap — IRC §401(a)(17)
  COMPENSATION_CAP: 345000,

  // Highly Compensated Employee threshold — IRC §414(q)
  HCE_THRESHOLD: 155000,

  // Key Employee (top-heavy) — IRC §416(i)
  KEY_EMPLOYEE_OFFICER: 220000,
};

// ─── Vesting Schedules ────────────────────────────────────────────────────────
// ERISA §203 minimum vesting standards
export const VESTING_SCHEDULES = {
  cliff3Year: "3-year cliff: 0% vested before 3 years, 100% at 3 years. ERISA minimum for employer matching.",
  graded6Year: "6-year graded: 20% per year from year 2 through year 6. ERISA minimum for employer non-elective.",
  immediate: "Immediate vesting: 100% from day one. Required for employee contributions and safe harbor plans.",
  cliff2Year: "2-year cliff: 0% before 2 years, 100% at 2 years. Common in safe harbor 401(k) plans."
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PlanTypeComparison {
  planType: string;
  maxEmployeeContribution: number;
  catchUpContribution: number;
  employerContributions: boolean;
  vestingApplies: boolean;
  rdmRequired: boolean;
  rothOption: boolean;
  bestFor: string;
  keyRule: string;
}

export interface ContributionMaximizationAnalysis {
  currentAge: number | null;
  employeeDeferralLimit: number;
  catchUpAvailable: boolean;
  catchUpAmount: number;
  totalMaxContribution: number;
  estimatedTaxSaving: number;
  matchCapture: string;
  rothVsTraditionalNote: string;
  recommendation: string;
}

export interface ErfisaFiduciaryAnalysis {
  prudentExpertStandard: string;
  exclusiveBenefitRule: string;
  diversificationRequirement: string;
  planDocumentCompliance: string;
  prohibitedTransactionNote: string;
  qdiaNNote: string;
  recommendation: string;
}

export interface RolloverAnalysis {
  directRolloverPreferred: boolean;
  sixtyDayRolloverRisk: string;
  withholding20PctRule: string;
  netUnrealizedAppreciation: string;
  iraToBeneficiaryNote: string;
  secure2RulesNote: string;
  recommendation: string;
}

export interface PlanDesignAnalysis {
  safHarborNote: string;
  autoEnrollmentNote: string;
  investmentMenuNote: string;
  feeDisclosureNote: string;
  topHeavyNote: string;
  recommendation: string;
}

export interface QualifiedPlanSnapshot {
  planComparisons: PlanTypeComparison[];
  contributionMaximization: ContributionMaximizationAnalysis;
  erfsaFiduciary: ErfisaFiduciaryAnalysis;
  rolloverGuidance: RolloverAnalysis;
  planDesign: PlanDesignAnalysis;
  overallReadinessScore: number;
  priorityAction: string;
  regulatoryNote: string;
}

// ─── Plan Type Comparisons ────────────────────────────────────────────────────

export function buildPlanTypeComparisons(): PlanTypeComparison[] {
  return [
    {
      planType: "401(k) — Traditional",
      maxEmployeeContribution: PLAN_LIMITS_2024.DC_EMPLOYEE_DEFERRAL,
      catchUpContribution: PLAN_LIMITS_2024.DC_CATCHUP_AGE50,
      employerContributions: true,
      vestingApplies: true,
      rdmRequired: true,
      rothOption: true,
      bestFor: "Employees of for-profit businesses seeking tax deferral and employer match",
      keyRule: "IRC §401(k) — pre-tax or Roth deferrals; employer match subject to vesting; ERISA fiduciary rules apply to plan sponsor"
    },
    {
      planType: "403(b) — Tax-Sheltered Annuity",
      maxEmployeeContribution: PLAN_LIMITS_2024.DC_EMPLOYEE_DEFERRAL,
      catchUpContribution: PLAN_LIMITS_2024.DC_CATCHUP_AGE50,
      employerContributions: true,
      vestingApplies: true,
      rdmRequired: true,
      rothOption: true,
      bestFor: "Employees of public schools, non-profits (501(c)(3)), and certain hospital systems",
      keyRule: "IRC §403(b) — similar to 401(k) but limited to mutual funds and annuity contracts; 15-year service catch-up available for long-tenured employees"
    },
    {
      planType: "457(b) — Governmental",
      maxEmployeeContribution: PLAN_LIMITS_2024.DC_EMPLOYEE_DEFERRAL,
      catchUpContribution: PLAN_LIMITS_2024.DC_CATCHUP_AGE50,
      employerContributions: true,
      vestingApplies: false,
      rdmRequired: true,
      rothOption: true,
      bestFor: "State and local government employees — can be stacked on top of 403(b) or 401(k)",
      keyRule: "IRC §457(b) — no 10% early withdrawal penalty (unique among qualified plans); contributions are NOT subject to FICA taxes"
    },
    {
      planType: "SIMPLE IRA",
      maxEmployeeContribution: PLAN_LIMITS_2024.SIMPLE_IRA_DEFERRAL,
      catchUpContribution: PLAN_LIMITS_2024.SIMPLE_IRA_CATCHUP,
      employerContributions: true,
      vestingApplies: false,
      rdmRequired: true,
      rothOption: false,
      bestFor: "Small businesses with ≤100 employees; lower administrative burden than 401(k)",
      keyRule: "IRC §408(p) — employer must contribute either 3% match or 2% non-elective; 25% early withdrawal penalty in first 2 years (vs. 10% for IRAs)"
    },
    {
      planType: "SEP-IRA",
      maxEmployeeContribution: PLAN_LIMITS_2024.SEP_IRA_MAX,
      catchUpContribution: 0,
      employerContributions: true,
      vestingApplies: false,
      rdmRequired: true,
      rothOption: false,
      bestFor: "Self-employed individuals and small business owners — highest contribution limit relative to simplicity",
      keyRule: "IRC §408(k) — employer contributes up to 25% of compensation or $69,000; contributions must be uniform percentage for all eligible employees"
    },
    {
      planType: "Traditional IRA",
      maxEmployeeContribution: PLAN_LIMITS_2024.IRA_CONTRIBUTION,
      catchUpContribution: PLAN_LIMITS_2024.IRA_CATCHUP,
      employerContributions: false,
      vestingApplies: false,
      rdmRequired: true,
      rothOption: false,
      bestFor: "Individuals without access to workplace plan or seeking additional tax-deferred savings",
      keyRule: "IRC §219 — deductibility phases out for active workplace plan participants: $77,000-$87,000 single, $123,000-$143,000 MFJ in 2024"
    },
    {
      planType: "Roth IRA",
      maxEmployeeContribution: PLAN_LIMITS_2024.IRA_CONTRIBUTION,
      catchUpContribution: PLAN_LIMITS_2024.IRA_CATCHUP,
      employerContributions: false,
      vestingApplies: false,
      rdmRequired: false,
      rothOption: true,
      bestFor: "Lower-bracket years, young investors with long time horizons, estate planning (no RMDs)",
      keyRule: "IRC §408A — income limit: $161,000-$176,000 single, $240,000-$255,000 MFJ in 2024 for direct contributions; backdoor Roth available for high earners via non-deductible traditional IRA conversion"
    },
    {
      planType: "Defined Benefit (Pension)",
      maxEmployeeContribution: 0,
      catchUpContribution: 0,
      employerContributions: true,
      vestingApplies: true,
      rdmRequired: true,
      rothOption: false,
      bestFor: "High-income self-employed individuals age 50+ who want to shelter very large amounts; actuarially-defined benefit",
      keyRule: "IRC §415(b) — maximum annual benefit $275,000; funding based on actuarial assumptions; PBGC insurance may apply; cash balance plans are a hybrid variation"
    }
  ];
}

// ─── Contribution Maximization ────────────────────────────────────────────────

export function buildContributionMaximizationAnalysis(
  client: ClientAccount
): ContributionMaximizationAnalysis {
  const age = client.age;
  const annualIncome = client.cashFlow.monthlyIncome * 12;
  const catchUpAvailable = age !== null && age >= 50;

  // Enhanced catch-up at 60-63 per SECURE 2.0 §109 (effective 2025)
  const catchUpAmount = age !== null && age >= 60 && age <= 63
    ? PLAN_LIMITS_2024.DC_CATCHUP_AGE60_63
    : catchUpAvailable
      ? PLAN_LIMITS_2024.DC_CATCHUP_AGE50
      : 0;

  const employeeDeferralLimit = PLAN_LIMITS_2024.DC_EMPLOYEE_DEFERRAL;
  const totalMaxContribution = employeeDeferralLimit + catchUpAmount;

  // Estimate tax saving at marginal rate
  const marginalRate = annualIncome > 191950 ? 0.32 :
                       annualIncome > 100525 ? 0.22 :
                       annualIncome > 47150 ? 0.22 : 0.12;
  const estimatedTaxSaving = Math.round(totalMaxContribution * marginalRate);

  const matchCapture =
    "Always capture the full employer match before directing additional contributions elsewhere — the match is an immediate 50-100% return on invested dollars. No other investment provides a guaranteed same-day return of this magnitude.";

  const rothVsTraditionalNote =
    marginalRate <= 0.22
      ? "Current bracket favors Roth contributions. Tax-free growth is most valuable when today's rates are lower than expected future rates."
      : marginalRate <= 0.24
        ? "Either Roth or traditional is reasonable at this bracket. Consider: if you expect to be in a lower bracket in retirement, traditional wins. If you expect similar or higher rates, Roth wins."
        : "Higher bracket generally favors traditional (pre-tax) deferrals today to reduce current taxable income. Evaluate Roth in future years when income is lower.";

  return {
    currentAge: age,
    employeeDeferralLimit,
    catchUpAvailable,
    catchUpAmount,
    totalMaxContribution,
    estimatedTaxSaving,
    matchCapture,
    rothVsTraditionalNote,
    recommendation:
      `Maximum contribution: $${totalMaxContribution.toLocaleString()} per year${catchUpAvailable ? ` (includes $${catchUpAmount.toLocaleString()} catch-up)` : ""}. Estimated annual tax saving: $${estimatedTaxSaving.toLocaleString()} at the current marginal bracket.`
  };
}

// ─── ERISA Fiduciary Analysis ─────────────────────────────────────────────────

export function buildErfisaFiduciaryAnalysis(): ErfisaFiduciaryAnalysis {
  return {
    prudentExpertStandard:
      "ERISA §404(a)(1)(B) imposes the 'prudent expert' standard — fiduciaries must act with the care, skill, prudence, and diligence that a prudent person with expertise in retirement plan management would exercise. This is NOT a 'reasonable layperson' standard. Inexperience is not a defense — fiduciaries must obtain expert assistance when needed.",
    exclusiveBenefitRule:
      "ERISA §404(a)(1)(A) requires fiduciaries to act solely in the interest of plan participants and beneficiaries and for the exclusive purpose of providing benefits and defraying reasonable plan expenses. Any action that benefits the employer, adviser, or any other party at the expense of participants violates this rule.",
    diversificationRequirement:
      "ERISA §404(a)(1)(C) requires plan assets to be diversified to minimize the risk of large losses, unless it is clearly prudent not to diversify under the circumstances. Concentration in employer stock is a well-documented source of ERISA litigation.",
    planDocumentCompliance:
      "ERISA §404(a)(1)(D) requires fiduciaries to act in accordance with the plan documents to the extent they are consistent with ERISA. Plan sponsors must ensure plan documents are updated for law changes (SECURE 2.0 requires several amendments by December 31, 2025).",
    prohibitedTransactionNote:
      "ERISA §406 prohibits transactions between the plan and 'parties in interest' — including the plan sponsor, plan fiduciaries, service providers, and their affiliates — unless a specific prohibited transaction exemption (PTE) applies. PTE 2020-02 provides relief for IRA rollover recommendations if best-interest requirements are met.",
    qdiaNNote:
      "The Qualified Default Investment Alternative (QDIA) regulation (29 CFR §2550.404c-5) protects plan fiduciaries from liability for default investments if participants are enrolled automatically into a QDIA — typically a target-date fund, balanced fund, or managed account. This protection requires proper notices and participant communication.",
    recommendation:
      "Plan sponsors serving as fiduciaries must document all investment decisions, benchmark plan fees annually against the market, review investment menu at least annually, and ensure service provider agreements comply with ERISA §408(b)(2) fee disclosure requirements."
  };
}

// ─── Rollover Guidance ────────────────────────────────────────────────────────

export function buildRolloverAnalysis(): RolloverAnalysis {
  return {
    directRolloverPreferred: true,
    sixtyDayRolloverRisk:
      "A 60-day indirect rollover requires the participant to receive the distribution and re-deposit into an IRA or new plan within 60 days. Only one IRA-to-IRA rollover per 12-month period is permitted (IRS Revenue Ruling 2014-9, IRC §408(d)(3)(B)). Missing the 60-day deadline results in the distribution being fully taxable and potentially subject to the 10% early withdrawal penalty.",
    withholding20PctRule:
      "When a participant receives a distribution eligible for rollover from a qualified plan (not an IRA), the plan must withhold 20% for federal income tax (IRC §3405(c)). To roll over the full amount, the participant must contribute the withheld 20% from other funds. A direct trustee-to-trustee rollover avoids this withholding entirely.",
    netUnrealizedAppreciation:
      "Net Unrealized Appreciation (NUA) allows participants with employer stock in a qualified plan to take a lump-sum distribution, pay ordinary income tax only on the cost basis, and then pay the lower long-term capital gains rate on the appreciation when the stock is eventually sold (IRC §402(e)(4)). NUA treatment is lost if the stock is rolled into an IRA — this analysis must be done before rolling over.",
    iraToBeneficiaryNote:
      "Under SECURE Act (2019) and SECURE 2.0 (2022), most non-spouse beneficiaries of inherited IRAs must empty the account within 10 years (no annual RMD required for years 1-9, but full distribution by year 10). Surviving spouses, minor children, disabled or chronically ill individuals, and beneficiaries not more than 10 years younger than the decedent still qualify for the prior stretch rules.",
    secure2RulesNote:
      "SECURE 2.0 (2022) allows 529 plan balances unused for education to be rolled over to a Roth IRA for the beneficiary — subject to: 15-year account age, annual Roth contribution limits, $35,000 lifetime maximum, and the account owner must be the beneficiary. This creates a new college planning backstop.",
    recommendation:
      "Always use direct trustee-to-trustee rollovers to avoid the 20% withholding trap and 60-day risk. Evaluate NUA treatment before rolling employer stock. Review SECURE 2.0 beneficiary rule changes with all clients who have inherited or expect to inherit IRAs."
  };
}

// ─── Plan Design Analysis ─────────────────────────────────────────────────────

export function buildPlanDesignAnalysis(): PlanDesignAnalysis {
  return {
    safHarborNote:
      "A Safe Harbor 401(k) plan (IRC §401(k)(12)) automatically satisfies the ADP nondiscrimination test — allowing HCEs and owners to defer up to the maximum without restriction. Requires either: (1) a 100% match on the first 4% of compensation, (2) a 100% match on first 3% + 50% on next 2%, or (3) a 3% non-elective contribution. All employer safe harbor contributions vest immediately.",
    autoEnrollmentNote:
      "Automatic enrollment (SECURE 2.0 §101 requires new plans established after 12/29/2022 to include auto-enrollment at 3%-10% of compensation). Research shows auto-enrollment increases participation rates from ~65% to ~90%. Employees can opt out. The SECURE 2.0 auto-escalation requirement increases deferral by 1% annually up to at least 10% (maximum 15%).",
    investmentMenuNote:
      "The plan's investment menu must be reviewed at least annually under the fiduciary duty of monitoring (ERISA §404). Best practices: offer a diversified tier of index funds with low expense ratios, include a target-date fund series as the QDIA, and consider a brokerage window for sophisticated participants. Document all reviews.",
    feeDisclosureNote:
      "ERISA §408(b)(2) requires covered service providers to disclose compensation and potential conflicts before engaging. DOL 404(a)(5) requires participant fee disclosure quarterly. The plan fiduciary must determine whether fees are 'reasonable' — which requires benchmarking against comparable plans. Excessive fee litigation against plan sponsors has accelerated significantly since 2015.",
    topHeavyNote:
      "A plan is top-heavy (IRC §416) if more than 60% of plan assets are held by 'key employees' (officers earning >$220,000, 5%+ owners, or 1%+ owners earning >$150,000). Top-heavy plans must provide a minimum contribution of 3% of compensation to all non-key employees. Top-heavy testing should be monitored annually.",
    recommendation:
      "For new plan sponsors: implement auto-enrollment with auto-escalation, choose a safe harbor design to avoid ADP testing complexity, use low-cost index funds as default options, and document all fiduciary decisions in a formal Investment Policy Statement (IPS)."
  };
}

// ─── Full Snapshot ────────────────────────────────────────────────────────────

export function buildQualifiedPlanSnapshot(client: ClientAccount): QualifiedPlanSnapshot {
  const planComparisons = buildPlanTypeComparisons();
  const contributionMaximization = buildContributionMaximizationAnalysis(client);
  const erfsaFiduciary = buildErfisaFiduciaryAnalysis();
  const rolloverGuidance = buildRolloverAnalysis();
  const planDesign = buildPlanDesignAnalysis();

  // Readiness score based on how well positioned this client is
  const age = client.age ?? 35;
  const annualIncome = client.cashFlow.monthlyIncome * 12;
  const savingsRate = (annualIncome > 0)
    ? Math.min(1, (annualIncome - client.cashFlow.monthlyExpenses * 12) / annualIncome)
    : 0;

  const readinessScore = Math.min(100, Math.round(
    (savingsRate * 40) +
    (age < 40 ? 30 : age < 55 ? 20 : 15) +
    (client.retirementMath.annualGuaranteedIncome > 0 ? 20 : 10) +
    10
  ));

  const priorityAction =
    contributionMaximization.catchUpAvailable
      ? `Age ${age} — catch-up contributions of $${contributionMaximization.catchUpAmount.toLocaleString()} available. Maximize contributions to close any retirement savings gap.`
      : annualIncome > 100000
        ? "Higher income — evaluate whether 401(k) + backdoor Roth + after-tax mega-backdoor Roth strategy is available to maximize tax-advantaged savings."
        : "Prioritize capturing the full employer match, then maximize IRA contributions, then increase plan deferrals toward the annual limit.";

  return {
    planComparisons,
    contributionMaximization,
    erfsaFiduciary,
    rolloverGuidance,
    planDesign,
    overallReadinessScore: readinessScore,
    priorityAction,
    regulatoryNote:
      "Qualified plan rules governed by IRC §§401-417 and ERISA. 2024 limits per IRS Notice 2023-75. SECURE 2.0 Act (2022) made numerous changes effective in 2023-2025; plans must be amended by December 31, 2025. All rollover decisions should be analyzed under the DOL's Fiduciary Rule framework and PTE 2020-02 for RIA compensation compliance."
  };
}
