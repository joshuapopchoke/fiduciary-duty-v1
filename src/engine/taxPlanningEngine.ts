import type { ClientAccount } from "../types/client";
import type { Ticker } from "../types/market";

// ─── Tax Planning Engine ──────────────────────────────────────────────────────
// All figures conform to IRC as amended through SECURE 2.0 Act (2022),
// TCJA (2017), ARP Act (2021), and IRS Rev. Proc. 2023-34 (2024 inflation
// adjustments). Brackets, limits, and rates are 2024 tax year unless noted.

// ─── 2024 Federal Income Tax Brackets (IRC §1) ───────────────────────────────
// Single filer thresholds (MFJ thresholds are exactly 2× for most brackets)
export const TAX_BRACKETS_2024 = {
  single: [
    { rate: 0.10, upTo: 11600 },
    { rate: 0.12, upTo: 47150 },
    { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243725 },
    { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity }
  ],
  mfj: [
    { rate: 0.10, upTo: 23200 },
    { rate: 0.12, upTo: 94300 },
    { rate: 0.22, upTo: 201050 },
    { rate: 0.24, upTo: 383900 },
    { rate: 0.32, upTo: 487450 },
    { rate: 0.35, upTo: 731200 },
    { rate: 0.37, upTo: Infinity }
  ]
};

// ─── 2024 Long-Term Capital Gains Rates (IRC §1(h)) ──────────────────────────
// LTCG rates apply to assets held > 1 year and qualified dividends
export const LTCG_RATES_2024 = {
  single: [
    { rate: 0.00, upTo: 47025 },
    { rate: 0.15, upTo: 518900 },
    { rate: 0.20, upTo: Infinity }
  ],
  mfj: [
    { rate: 0.00, upTo: 94050 },
    { rate: 0.15, upTo: 583750 },
    { rate: 0.20, upTo: Infinity }
  ]
};

// ─── Net Investment Income Tax (IRC §1411) ────────────────────────────────────
// 3.8% NIIT on lesser of NII or MAGI excess above threshold
export const NIIT_RATE = 0.038;
export const NIIT_THRESHOLD_SINGLE = 200000;
export const NIIT_THRESHOLD_MFJ = 250000;

// ─── 2024 Contribution Limits ────────────────────────────────────────────────
export const CONTRIBUTION_LIMITS_2024 = {
  IRA: 7000,                    // IRC §219(b)(5)(A) — $7,000 in 2024
  IRA_CATCHUP: 1000,            // IRC §219(b)(5)(B) — age 50+
  k401_EMPLOYEE: 23000,         // IRC §402(g)(1) — $23,000 in 2024
  k401_CATCHUP: 7500,           // IRC §414(v)(2)(B) — age 50+; $10,000 at 60-63 per SECURE 2.0
  k401_CATCHUP_60_63: 11250,    // SECURE 2.0 §109 — enhanced catch-up at 60-63, 2025+
  k401_TOTAL: 69000,            // IRC §415(c)(1)(A) — employer+employee combined
  HSA_SINGLE: 4150,             // Rev. Proc. 2023-23
  HSA_FAMILY: 8300,             // Rev. Proc. 2023-23
  HSA_CATCHUP: 1000,            // IRC §223(b)(3) — age 55+, not indexed
  GIFT_ANNUAL: 18000,           // IRC §2503(b) — $18,000 per donee in 2024
  ESTATE_EXEMPTION: 13610000,   // IRC §2010(c) — $13.61M in 2024 (TCJA sunsets after 2025)
};

// ─── RMD Rules (IRC §401(a)(9) as amended by SECURE 2.0) ─────────────────────
// SECURE Act (2019): raised RMD age from 70½ to 72
// SECURE 2.0 Act (2022): raised RMD age to 73 (effective 2023)
// SECURE 2.0 raises to 75 for those born after 1960 (effective 2033)
export const RMD_START_AGE_CURRENT = 73;  // For those born 1951-1959
export const RMD_START_AGE_FUTURE = 75;   // For those born after 1960 (effective 2033)
export const RMD_MISSED_PENALTY = 0.25;   // SECURE 2.0 reduced from 50% to 25% (10% if corrected promptly)

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface TaxBracketSnapshot {
  filingStatus: "single" | "mfj";
  estimatedMagi: number;
  marginalRate: number;
  effectiveRate: number;
  ltcgRate: number;
  niitApplies: boolean;
  combinedGainsRate: number;
  bracketLabel: string;
}

export interface RothConversionAnalysis {
  conversionAmount: number;
  taxCostAtMarginal: number;
  marginalRateApplied: number;
  tenYearGrowthProjection: number;
  breakEvenYears: number;
  recommendation: string;
  caveat: string;
}

export interface RmdAnalysis {
  applicable: boolean;
  startAge: number;
  currentAge: number | null;
  estimatedRmd: number;
  rmdRate: number;
  taxableAsOrdinaryIncome: boolean;
  qcdEligible: boolean;
  qcdLimit: number;
  recommendation: string;
}

export interface TaxLossHarvestingAnalysis {
  netUnrealizedPosition: number;
  harvestablelosses: number;
  estimatedTaxSaving: number;
  washSaleWarning: boolean;
  annualOrdinaryOffsetMax: number;  // IRC §1211 — $3,000 cap on ordinary income offset
  carryforwardAvailable: boolean;
  recommendation: string;
}

export interface AssetLocationAnalysis {
  taxable: string[];
  taxDeferred: string[];
  taxFree: string[];
  rationale: string;
}

export interface CharitableGivingAnalysis {
  qcdEligible: boolean;
  qcdAnnualLimit: number;           // IRC §408(d)(8) — $105,000 in 2024 (indexed)
  appreciatedStockBenefit: string;
  dafNote: string;
  crtNote: string;
}

export interface TaxPlanningSnapshot {
  bracketAnalysis: TaxBracketSnapshot;
  rothConversion: RothConversionAnalysis | null;
  rmdAnalysis: RmdAnalysis;
  taxLossHarvesting: TaxLossHarvestingAnalysis;
  assetLocation: AssetLocationAnalysis;
  charitableGiving: CharitableGivingAnalysis;
  planningPriority: string;
  regulatoryNote: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferFilingStatus(client: ClientAccount): "single" | "mfj" {
  const status = client.taxProfile.filingStatus.toLowerCase();
  if (status.includes("joint") || status.includes("married")) return "mfj";
  return "single";
}

function estimateMagi(client: ClientAccount): number {
  return client.cashFlow.monthlyIncome * 12;
}

function getMarginalRate(magi: number, filing: "single" | "mfj"): number {
  const brackets = TAX_BRACKETS_2024[filing];
  for (const bracket of brackets) {
    if (magi <= bracket.upTo) return bracket.rate;
  }
  return 0.37;
}

function getEffectiveRate(magi: number, filing: "single" | "mfj"): number {
  const brackets = TAX_BRACKETS_2024[filing];
  let tax = 0;
  let prevUpTo = 0;
  for (const bracket of brackets) {
    const taxableInBracket = Math.min(magi, bracket.upTo) - prevUpTo;
    if (taxableInBracket <= 0) break;
    tax += taxableInBracket * bracket.rate;
    prevUpTo = bracket.upTo;
    if (magi <= bracket.upTo) break;
  }
  return magi > 0 ? tax / magi : 0;
}

function getLtcgRate(magi: number, filing: "single" | "mfj"): number {
  const rates = LTCG_RATES_2024[filing];
  for (const tier of rates) {
    if (magi <= tier.upTo) return tier.rate;
  }
  return 0.20;
}

function niitApplies(magi: number, filing: "single" | "mfj"): boolean {
  const threshold = filing === "mfj" ? NIIT_THRESHOLD_MFJ : NIIT_THRESHOLD_SINGLE;
  return magi > threshold;
}

// ─── Public Engine Functions ─────────────────────────────────────────────────

export function buildTaxBracketSnapshot(client: ClientAccount): TaxBracketSnapshot {
  const filing = inferFilingStatus(client);
  const magi = estimateMagi(client);
  const marginalRate = getMarginalRate(magi, filing);
  const effectiveRate = getEffectiveRate(magi, filing);
  const ltcgRate = getLtcgRate(magi, filing);
  const niit = niitApplies(magi, filing);
  const combinedGainsRate = ltcgRate + (niit ? NIIT_RATE : 0);

  const bracketLabel =
    marginalRate <= 0.12 ? "Lower bracket — strong case for Roth contributions and taxable growth" :
    marginalRate <= 0.22 ? "Middle bracket — Roth still attractive but conversion sizing matters" :
    marginalRate <= 0.24 ? "Upper-middle bracket — traditional deferrals and tax-loss harvesting valuable" :
    "Higher bracket — maximize all deferrals, munis, and harvesting opportunities";

  return {
    filingStatus: filing,
    estimatedMagi: magi,
    marginalRate,
    effectiveRate,
    ltcgRate,
    niitApplies: niit,
    combinedGainsRate,
    bracketLabel
  };
}

export function buildRothConversionAnalysis(
  client: ClientAccount,
  accountValue: number
): RothConversionAnalysis | null {
  // Roth conversions are most valuable in lower-income years (IRC §408A)
  if (!client.retirementDistribution) return null;

  const bracket = buildTaxBracketSnapshot(client);
  const conversionAmount = Math.round(Math.max(10000, accountValue * 0.08));
  const taxCostAtMarginal = Math.round(conversionAmount * bracket.marginalRate);
  const growth = client.retirementMath.expectedReturn;
  const tenYearGrowth = Math.round(conversionAmount * Math.pow(1 + growth, 10));

  // Break-even: years for tax-free Roth growth to exceed the tax cost paid upfront
  // Simplified formula: ln(1 + taxRate/(1-taxRate)) / ln(1+r)
  const breakEvenYears = bracket.marginalRate >= 0.37 ? 99 :
    Math.round(Math.log(1 / (1 - bracket.marginalRate)) / Math.log(1 + growth));

  const recommendation =
    bracket.marginalRate <= 0.22
      ? "Current bracket is favorable for Roth conversion. Staged conversions filling the 22% bracket can reduce future RMD pressure tax-efficiently."
      : bracket.marginalRate <= 0.24
        ? "Conversion is defensible if the client expects higher rates in retirement or wants to reduce future RMDs. Model the bracket carefully before sizing."
        : "Higher marginal rate reduces the conversion benefit. Focus on bracket management — only convert if retirement tax rates are expected to exceed today's.";

  const caveat =
    "Converted amounts are taxable in the year of conversion (IRC §408A(d)(3)). Ensure the client has outside funds to pay the tax — using converted funds to pay tax erodes the benefit.";

  return {
    conversionAmount,
    taxCostAtMarginal,
    marginalRateApplied: bracket.marginalRate,
    tenYearGrowthProjection: tenYearGrowth,
    breakEvenYears,
    recommendation,
    caveat
  };
}

export function buildRmdAnalysis(client: ClientAccount, accountValue: number): RmdAnalysis {
  const currentAge = client.age;
  const applicable = currentAge !== null && currentAge >= RMD_START_AGE_CURRENT;
  const qcdEligible = currentAge !== null && currentAge >= 70; // QCD age is 70½ (IRC §408(d)(8))
  // QCD limit for 2024: $105,000 (indexed for inflation under SECURE 2.0)
  const qcdLimit = 105000;

  if (!applicable || accountValue <= 0) {
    return {
      applicable: false,
      startAge: RMD_START_AGE_CURRENT,
      currentAge,
      estimatedRmd: 0,
      rmdRate: 0,
      taxableAsOrdinaryIncome: true,
      qcdEligible,
      qcdLimit,
      recommendation: currentAge && currentAge < RMD_START_AGE_CURRENT
        ? `RMDs begin at age ${RMD_START_AGE_CURRENT} per SECURE 2.0 (2022). Plan Roth conversions and distributions strategically in pre-RMD years.`
        : "RMDs do not apply to this account type."
    };
  }

  // IRS Uniform Lifetime Table (Rev. Proc. 2022-08) — simplified approximation
  // Distribution period decreases by ~1 each year from age 73 onward
  const distributionPeriod = Math.max(1, 29.1 - Math.max(0, (currentAge ?? 73) - 73));
  const estimatedRmd = Math.round(accountValue / distributionPeriod);
  const rmdRate = accountValue > 0 ? estimatedRmd / accountValue : 0;

  const recommendation =
    qcdEligible
      ? `RMD of approximately $${estimatedRmd.toLocaleString()} can be satisfied in whole or part by a Qualified Charitable Distribution of up to $${qcdLimit.toLocaleString()} — which avoids income tax on the distributed amount entirely (IRC §408(d)(8)).`
      : `Annual RMD of approximately $${estimatedRmd.toLocaleString()} is taxable as ordinary income. Coordinate with other income to manage bracket exposure.`;

  return {
    applicable: true,
    startAge: RMD_START_AGE_CURRENT,
    currentAge,
    estimatedRmd,
    rmdRate,
    taxableAsOrdinaryIncome: true,
    qcdEligible,
    qcdLimit,
    recommendation
  };
}

export function buildTaxLossHarvestingAnalysis(
  client: ClientAccount,
  tickers: Record<string, Ticker>
): TaxLossHarvestingAnalysis {
  const bracket = buildTaxBracketSnapshot(client);
  let unrealizedGains = 0;
  let unrealizedLosses = 0;

  Object.values(client.holdings).forEach(holding => {
    const ticker = tickers[holding.ticker];
    if (!ticker) return;
    const currentValue = ticker.price * holding.shares;
    const costBasis = holding.averageCost * holding.shares;
    const unrealized = currentValue - costBasis;
    if (unrealized > 0) unrealizedGains += unrealized;
    else unrealizedLosses += Math.abs(unrealized);
  });

  const netUnrealizedPosition = unrealizedGains - unrealizedLosses;
  const estimatedTaxSaving = Math.round(unrealizedLosses * bracket.combinedGainsRate);

  const recommendation =
    unrealizedLosses < 1000
      ? "No material harvesting candidates identified at this time. Monitor positions during market pullbacks."
      : `Approximately $${unrealizedLosses.toLocaleString(undefined, { maximumFractionDigits: 0 })} in unrealized losses could offset gains. Observe the 30-day wash-sale window (IRC §1091) — repurchasing the same or substantially identical security within 30 days before or after the sale disallows the loss.`;

  return {
    netUnrealizedPosition,
    harvestablelosses: unrealizedLosses,
    estimatedTaxSaving,
    washSaleWarning: unrealizedLosses > 500,
    annualOrdinaryOffsetMax: 3000,  // IRC §1211(b) — $3,000 cap on ordinary income offset annually
    carryforwardAvailable: unrealizedLosses > unrealizedGains,
    recommendation
  };
}

export function buildAssetLocationAnalysis(client: ClientAccount): AssetLocationAnalysis {
  // Asset location principles: highest-tax-drag assets belong in tax-deferred/tax-free accounts
  const taxable: string[] = [];
  const taxDeferred: string[] = [];
  const taxFree: string[] = [];

  // Stocks and equity ETFs: tax-efficient (LTCG rates) — taxable is fine
  taxable.push("Broad equity index funds (low turnover, LTCG rates)");
  taxable.push("Municipal bonds (federally tax-exempt income)");
  taxable.push("Growth stocks with no dividend");

  // Taxable bonds: ordinary income — belong in tax-deferred
  taxDeferred.push("Taxable bonds and bond funds (ordinary income)");
  taxDeferred.push("REITs (ordinary income distributions)");
  taxDeferred.push("High-yield bonds (ordinary income)");
  taxDeferred.push("Actively managed funds (capital gain distributions)");

  // Roth IRA: highest-growth potential — maximize tax-free compounding
  taxFree.push("Highest-return, longest-duration growth assets");
  taxFree.push("Assets most likely to appreciate significantly over time");
  taxFree.push("Assets you plan to hold and pass to heirs (no RMD in Roth)");

  const rationale =
    "Asset location — placing assets in the account type that minimizes their tax drag — can add 0.10%–0.30% annually to after-tax returns without changing the portfolio's risk profile. Taxable accounts work best for tax-efficient equity and muni bonds. Tax-deferred accounts absorb income-producing assets. Roth accounts should hold the highest-growth assets for maximum compounding.";

  return { taxable, taxDeferred, taxFree, rationale };
}

export function buildCharitableGivingAnalysis(client: ClientAccount): CharitableGivingAnalysis {
  const currentAge = client.age;
  const qcdEligible = currentAge !== null && currentAge >= 70;

  return {
    qcdEligible,
    qcdAnnualLimit: 105000,  // 2024 limit, indexed per SECURE 2.0
    appreciatedStockBenefit:
      "Donating appreciated stock held > 1 year directly to a qualified charity avoids capital gains tax on the appreciation AND generates a charitable deduction for full FMV (IRC §170(e)(1)). This is often more efficient than selling the stock and donating cash.",
    dafNote:
      "A Donor-Advised Fund (DAF) allows bunching charitable deductions into one year to exceed the standard deduction, then distributing to charities over time. Contributions are irrevocable and immediately deductible (IRC §170).",
    crtNote:
      "A Charitable Remainder Trust (CRT) allows transfer of appreciated assets — avoiding immediate capital gains — while retaining an income stream for life or a term. The remainder passes to charity and the donor receives a partial charitable deduction."
  };
}

export function buildTaxPlanningSnapshot(
  client: ClientAccount,
  tickers: Record<string, Ticker>,
  accountValue: number
): TaxPlanningSnapshot {
  const bracketAnalysis = buildTaxBracketSnapshot(client);
  const rmdAnalysis = buildRmdAnalysis(client, accountValue);
  const rothConversion = buildRothConversionAnalysis(client, accountValue);
  const taxLossHarvesting = buildTaxLossHarvestingAnalysis(client, tickers);
  const assetLocation = buildAssetLocationAnalysis(client);
  const charitableGiving = buildCharitableGivingAnalysis(client);

  const planningPriority =
    rmdAnalysis.applicable
      ? "Coordinate RMDs with Roth conversions and charitable giving to manage bracket exposure each year."
      : bracketAnalysis.marginalRate <= 0.22
        ? "Prioritize Roth contributions and conversions while in a favorable bracket."
        : "Focus on tax-loss harvesting, asset location, and deferral maximization to reduce taxable income.";

  const regulatoryNote =
    "All figures reflect 2024 tax year under IRC as amended through SECURE 2.0 Act (2022) and TCJA (2017). TCJA provisions including the higher estate exemption and individual rate structure sunset after December 31, 2025 unless Congress acts. Clients with significant estates should review planning before 2026.";

  return {
    bracketAnalysis,
    rothConversion,
    rmdAnalysis,
    taxLossHarvesting,
    assetLocation,
    charitableGiving,
    planningPriority,
    regulatoryNote
  };
}
