import type { ClientAccount } from "../types/client";

// ─── Insurance Planning Engine ────────────────────────────────────────────────
// Conforms to: NAIC Model regulations, IRC §7702 (life insurance definition),
// IRC §7702B (long-term care), IRC §101(a) (death benefit exclusion),
// IRC §72 (annuity taxation), and state insurance regulatory frameworks.

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LifeInsuranceNeedAnalysis {
  method: "income-replacement" | "needs-based" | "DIME";
  incomeReplacementNeed: number;       // 10-12× annual income rule of thumb
  needsBasedEstimate: number;          // Debt + dependents + final expenses
  dimeEstimate: number;                // Debt + Income + Mortgage + Education
  recommendedCoverage: number;
  currentCoverage: number;
  coverageGap: number;
  termVsPermanentNote: string;
  recommendation: string;
}

export interface DisabilityInsuranceAnalysis {
  monthlyIncomeToReplace: number;
  targetBenefitMonthly: number;        // 60-70% of gross income — industry standard
  eliminationPeriodNote: string;       // 90-day elimination = lower premium sweet spot
  ownOccupationNote: string;           // "Own occupation" definition is superior for professionals
  benefitPeriodNote: string;
  ssdiNote: string;                    // Social Security Disability Insurance interaction
  recommendation: string;
}

export interface LongTermCareAnalysis {
  applicableAge: number | null;
  planningWindowNote: string;          // Premiums rise sharply after 60; 50s are optimal
  averageCareStats: {
    averageNursingHomeCostMonthly: number;    // Genworth 2024 Cost of Care Survey
    averageHomeCareHourly: number;
    averageStayYears: number;
  };
  estimatedTotalExposure: number;
  fundingOptions: string[];
  hybridPolicyNote: string;            // Life + LTC rider — IRC §7702B compliant
  recommendation: string;
}

export interface UmbrellaLiabilityAnalysis {
  recommendedCoverageMin: number;      // Industry standard: $1M minimum
  triggerNote: string;
  highRiskFactors: string[];
  recommendation: string;
}

export interface InsurancePlanningSnapshot {
  lifeInsurance: LifeInsuranceNeedAnalysis;
  disability: DisabilityInsuranceAnalysis;
  longTermCare: LongTermCareAnalysis;
  umbrellaLiability: UmbrellaLiabilityAnalysis;
  overallGapScore: number;             // 0-100; higher = more urgent gaps
  priorityAction: string;
  regulatoryNote: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function estimateAnnualIncome(client: ClientAccount): number {
  return client.cashFlow.monthlyIncome * 12;
}

function estimateCurrentLifeCoverage(client: ClientAccount): number {
  // Approximate from client insurance fields if available
  return (client.insuranceCoverage?.length ?? 0) * 250000;
}

function yearsToRetirement(client: ClientAccount): number {
  if (!client.age) return 20;
  return Math.max(0, 65 - client.age);
}

// ─── Life Insurance Need Analysis ────────────────────────────────────────────

export function buildLifeInsuranceNeedAnalysis(client: ClientAccount): LifeInsuranceNeedAnalysis {
  const annualIncome = estimateAnnualIncome(client);
  const currentCoverage = estimateCurrentLifeCoverage(client);

  // Method 1: Income replacement — 10-12× gross annual income
  const incomeReplacementNeed = Math.round(annualIncome * 11);

  // Method 2: Needs-based — debt + dependents support + final expenses
  const mortgageDebt = client.debtProfile.mortgageBalance;
  const otherDebt = client.debtProfile.creditCardBalance +
                    client.debtProfile.autoLoanBalance +
                    client.debtProfile.studentLoanBalance;
  const dependentYears = client.householdAges.length > 1 ? 18 * annualIncome * 0.3 : 0;
  const finalExpenses = 25000; // Average funeral + estate settlement costs
  const needsBasedEstimate = Math.round(mortgageDebt + otherDebt + dependentYears + finalExpenses);

  // Method 3: DIME — Debt + Income × years + Mortgage + Education
  const educationEstimate = client.educationPlanning.active ? 220000 : 0;
  const dimeEstimate = Math.round(
    (otherDebt) +
    (annualIncome * yearsToRetirement(client)) +
    mortgageDebt +
    educationEstimate
  );

  // Use highest of the three as recommended coverage
  const recommendedCoverage = Math.max(incomeReplacementNeed, needsBasedEstimate, dimeEstimate);
  const coverageGap = Math.max(0, recommendedCoverage - currentCoverage);

  const termVsPermanentNote =
    client.age && client.age < 45
      ? "Term life insurance typically provides the most coverage per premium dollar for clients in accumulation phase. A 20- or 30-year level term covers the dependency period efficiently."
      : client.age && client.age < 60
        ? "Evaluate whether permanent insurance (whole life, universal life) serves a specific need — estate liquidity, business succession, or permanent death benefit — or whether the extra premium is better deployed into the investment plan."
        : "At this stage, guaranteed universal life or whole life may serve estate-planning or legacy purposes better than term, which becomes increasingly expensive or unavailable. IRC §7702 compliance is required for any policy to maintain life insurance tax treatment.";

  const recommendation =
    coverageGap > 500000
      ? `Significant life insurance gap of $${coverageGap.toLocaleString()} identified. Prioritize coverage review before the next life event.`
      : coverageGap > 0
        ? `Moderate coverage gap of $${coverageGap.toLocaleString()}. Review whether existing policy is adequate for current household obligations.`
        : "Coverage appears adequate relative to current needs. Review annually as income, debt, and dependents change.";

  return {
    method: "DIME",
    incomeReplacementNeed,
    needsBasedEstimate,
    dimeEstimate,
    recommendedCoverage,
    currentCoverage,
    coverageGap,
    termVsPermanentNote,
    recommendation
  };
}

// ─── Disability Insurance Analysis ───────────────────────────────────────────

export function buildDisabilityInsuranceAnalysis(client: ClientAccount): DisabilityInsuranceAnalysis {
  const monthlyIncome = client.cashFlow.monthlyIncome;
  // Industry standard: disability policy replaces 60-70% of gross monthly income
  const targetBenefitMonthly = Math.round(monthlyIncome * 0.65);

  return {
    monthlyIncomeToReplace: monthlyIncome,
    targetBenefitMonthly,
    eliminationPeriodNote:
      "A 90-day elimination period (waiting period before benefits begin) offers the best balance of premium savings and protection. Clients with 3+ months of emergency reserves can absorb this waiting period comfortably.",
    ownOccupationNote:
      "'Own occupation' definition is the gold standard — it pays benefits if the insured cannot perform the duties of their specific occupation, even if they can work in another capacity. 'Any occupation' is more restrictive and provides weaker protection for specialized professionals.",
    benefitPeriodNote:
      "A benefit period to age 65 or 67 is preferred for working-age clients. Short benefit periods (2 or 5 years) leave significant tail risk uncovered, as long-term disabilities frequently exceed those windows.",
    ssdiNote:
      "Social Security Disability Insurance (SSDI) requires total disability and a 5-month waiting period before benefits begin. Average approved SSDI benefit is approximately $1,500/month — far below most professionals' income replacement needs. Private disability insurance is essential for adequate protection.",
    recommendation:
      targetBenefitMonthly > 0
        ? `Target monthly benefit of $${targetBenefitMonthly.toLocaleString()} to replace 65% of gross income. Coordinate with any employer-provided group disability — group policies typically replace only 60% and may be taxable if employer-paid.`
        : "Review income replacement needs and assess current disability coverage adequacy."
  };
}

// ─── Long-Term Care Analysis ─────────────────────────────────────────────────

export function buildLongTermCareAnalysis(client: ClientAccount): LongTermCareAnalysis {
  // Genworth 2024 Cost of Care Survey — national median figures
  const averageNursingHomeCostMonthly = 9733;   // Private room, 2024 national median
  const averageHomeCareHourly = 33;             // Home health aide, 2024 national median
  const averageStayYears = 2.5;                 // Average LTC need duration (HHS data)
  const estimatedTotalExposure = Math.round(averageNursingHomeCostMonthly * 12 * averageStayYears);

  const planningWindowNote =
    client.age && client.age < 50
      ? "Long-term care planning can be deferred slightly, but premiums are significantly lower when purchased in your 40s or early 50s. Consider a hybrid life/LTC policy now to lock in insurability."
      : client.age && client.age < 60
        ? "This is the optimal window for LTC insurance planning. Premiums increase substantially after 60, and health underwriting becomes more challenging. Hybrid policies (life insurance with LTC riders) provide flexibility if LTC is never needed."
        : client.age && client.age < 70
          ? "LTC planning is still feasible but premiums are elevated. Evaluate hybrid policies, self-funding through existing assets, or a combination approach. Medicaid planning may be relevant depending on asset levels."
          : "Traditional LTC insurance may be difficult to obtain or prohibitively expensive at this age. Focus on self-funding strategies, Medicaid eligibility planning (5-year lookback rule), and family care coordination.";

  return {
    applicableAge: client.age,
    planningWindowNote,
    averageCareStats: {
      averageNursingHomeCostMonthly,
      averageHomeCareHourly,
      averageStayYears
    },
    estimatedTotalExposure,
    fundingOptions: [
      "Traditional LTC insurance — standalone policy with inflation protection",
      "Hybrid life/LTC policy — death benefit or LTC acceleration rider (IRC §7702B)",
      "Self-funding through dedicated investment account or annuity with LTC rider",
      "Medicaid (requires significant asset spend-down; 5-year lookback applies)",
      "Family care coordination with backup professional care plan"
    ],
    hybridPolicyNote:
      "Hybrid life insurance/LTC policies under IRC §7702B allow LTC benefits to be paid from the death benefit tax-free. If LTC is never needed, the full death benefit passes to heirs. This addresses the 'use it or lose it' objection to standalone LTC premiums.",
    recommendation:
      `Estimated LTC exposure of $${estimatedTotalExposure.toLocaleString()} over an average care period. ${planningWindowNote}`
  };
}

// ─── Umbrella Liability Analysis ─────────────────────────────────────────────

export function buildUmbrellaLiabilityAnalysis(client: ClientAccount): UmbrellaLiabilityAnalysis {
  const netWorth = client.cash +
    Object.values(client.holdings).length * 50000; // Approximation

  // Standard recommendation: $1M minimum; increase by $1M for every $1M of net worth
  const recommendedCoverageMin = Math.max(1000000, Math.round(netWorth / 1000000) * 1000000);

  const highRiskFactors: string[] = [];
  if (client.age && client.age < 25) highRiskFactors.push("Young driver in household");
  if (client.debtProfile.propertyValue > 500000) highRiskFactors.push("High-value property ownership");
  if (client.cashFlow.monthlyIncome * 12 > 200000) highRiskFactors.push("High income — greater lawsuit target");
  if (netWorth > 1000000) highRiskFactors.push("Substantial assets to protect");

  return {
    recommendedCoverageMin,
    triggerNote:
      "An umbrella policy provides liability coverage above and beyond auto and homeowner's policy limits — typically $1M-$5M. It activates when underlying policy limits are exhausted. Annual premium is typically $150-$300 per $1M of coverage — one of the most cost-effective risk management tools available.",
    highRiskFactors,
    recommendation:
      highRiskFactors.length > 0
        ? `Multiple elevated risk factors identified: ${highRiskFactors.join(", ")}. A $${(recommendedCoverageMin / 1000000).toFixed(0)}M+ umbrella policy is strongly recommended.`
        : `Minimum $${(recommendedCoverageMin / 1000000).toFixed(0)}M umbrella policy recommended as baseline liability protection. Review annually as net worth grows.`
  };
}

// ─── Full Snapshot ────────────────────────────────────────────────────────────

export function buildInsurancePlanningSnapshot(
  client: ClientAccount
): InsurancePlanningSnapshot {
  const lifeInsurance = buildLifeInsuranceNeedAnalysis(client);
  const disability = buildDisabilityInsuranceAnalysis(client);
  const longTermCare = buildLongTermCareAnalysis(client);
  const umbrellaLiability = buildUmbrellaLiabilityAnalysis(client);

  // Score urgency: higher = more gaps
  const gapComponents = [
    lifeInsurance.coverageGap > 500000 ? 35 : lifeInsurance.coverageGap > 0 ? 20 : 0,
    disability.targetBenefitMonthly > 3000 ? 25 : 15,
    longTermCare.applicableAge && longTermCare.applicableAge > 55 ? 25 : 10,
    umbrellaLiability.highRiskFactors.length > 1 ? 15 : 5
  ];
  const overallGapScore = Math.min(100, gapComponents.reduce((a, b) => a + b, 0));

  const priorityAction =
    lifeInsurance.coverageGap > 500000
      ? "Address life insurance gap immediately — this is the most acute unmitigated risk."
      : overallGapScore >= 60
        ? "Multiple insurance gaps identified. Begin with disability income protection, then life insurance, then LTC planning."
        : "Insurance foundation is adequate. Review annually and update as life circumstances change.";

  return {
    lifeInsurance,
    disability,
    longTermCare,
    umbrellaLiability,
    overallGapScore,
    priorityAction,
    regulatoryNote:
      "Life insurance products must comply with IRC §7702 (MEC rules and definition of life insurance). LTC benefits qualify under IRC §7702B. Death benefits are generally excluded from gross income under IRC §101(a). State insurance department regulations govern policy forms and suitability standards."
  };
}
