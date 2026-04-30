import type { ClientAccount } from "../types/client";

// ─── Estate Planning Engine ───────────────────────────────────────────────────
// Conforms to: IRC §2001-2210 (estate and gift tax), IRC §1014 (basis rules),
// IRC §1015 (gift basis), IRC §2503 (annual exclusion), IRC §2056 (marital
// deduction), IRC §2055 (charitable deduction), Uniform Trust Code (UTC),
// Uniform Probate Code (UPC), and Rev. Proc. 2023-34 (2024 inflation adjustments).
// CRITICAL NOTE: TCJA estate exemption sunsets December 31, 2025.

// ─── 2024 Estate and Gift Tax Constants ──────────────────────────────────────
export const ESTATE_GIFT_CONSTANTS_2024 = {
  lifetimeExemption: 13610000,       // IRC §2010(c) — $13.61M per person in 2024
  mfjExemption: 27220000,            // With portability election (IRC §2010(c)(5))
  annualGiftExclusion: 18000,        // IRC §2503(b) — per donee, per year
  annualGiftExclusionSpouse: 185000, // IRC §2523(i) — unlimited for US citizen spouse; $185,000 non-citizen
  topEstateTaxRate: 0.40,            // IRC §2001(c) — 40% marginal rate
  // TCJA SUNSET WARNING: Exemption reverts to ~$7M (inflation-adjusted) after 12/31/2025
  tcjaSunsetYear: 2025,
  tcjaSunsetNote: "TCJA estate exemption of $13.61M sunsets December 31, 2025 unless Congress acts. Post-sunset exemption estimated at $7M+ (inflation-adjusted). Clients with estates between $7M and $13.61M face potential new exposure."
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface EstateExposureAnalysis {
  estimatedGrossEstate: number;
  lifeTimeExemptionRemaining: number;
  estimatedTaxableEstate: number;
  estimatedEstateTax: number;
  tcjaSunsetRisk: boolean;
  tcjaSunsetNote: string;
  portabilityNote: string;
}

export interface CoreDocumentReview {
  hasWill: boolean;
  hasPowerOfAttorney: boolean;
  hasHealthcareDirective: boolean;
  hasTrust: boolean;
  beneficiaryAlignmentNote: string;
  missingDocuments: string[];
  urgencyLevel: "immediate" | "moderate" | "low";
  recommendation: string;
}

export interface TrustAnalysis {
  revocableTrustNote: string;
  irrevocableTrustNote: string;
  ilitNote: string;
  gratNote: string;
  slatNote: string;
  creditShelterNote: string;
  applicableTrusts: string[];
  recommendation: string;
}

export interface GiftingStrategyAnalysis {
  annualExclusionCapacity: number;    // $18,000 × number of donees
  fiveYearFrontLoad: number;          // 529 superfunding — 5× annual exclusion
  appreciatedAssetNote: string;       // Step-up in basis at death vs. gift carryover basis
  lifetimeGiftingNote: string;
  qpdNote: string;                    // Qualified transfers for education/medical — IRC §2503(e)
  recommendation: string;
}

export interface BasisPlanningAnalysis {
  stepUpInBasisNote: string;          // IRC §1014 — stepped-up to FMV at death
  giftCarryoverBasisNote: string;     // IRC §1015 — donor's basis carries over in gift
  incomeInRespectOfDecedentNote: string; // IRC §691 — IRD assets do NOT get step-up
  recommendation: string;
}

export interface EstatePlanningSnapshot {
  exposureAnalysis: EstateExposureAnalysis;
  coreDocuments: CoreDocumentReview;
  trustAnalysis: TrustAnalysis;
  giftingStrategy: GiftingStrategyAnalysis;
  basisPlanning: BasisPlanningAnalysis;
  overallComplexityScore: number;     // 0-100
  priorityAction: string;
  regulatoryNote: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function estimateGrossEstate(client: ClientAccount, accountValue: number): number {
  return accountValue +
    client.debtProfile.propertyValue +
    (client.insuranceCoverage?.length ?? 0) * 500000; // Rough life insurance estimate
}

function isMfj(client: ClientAccount): boolean {
  return client.taxProfile.filingStatus.toLowerCase().includes("joint") ||
         client.taxProfile.filingStatus.toLowerCase().includes("married");
}

// ─── Estate Exposure Analysis ─────────────────────────────────────────────────

export function buildEstateExposureAnalysis(
  client: ClientAccount,
  accountValue: number
): EstateExposureAnalysis {
  const grossEstate = estimateGrossEstate(client, accountValue);
  const mfj = isMfj(client);
  const exemption = mfj
    ? ESTATE_GIFT_CONSTANTS_2024.mfjExemption
    : ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption;

  const taxableEstate = Math.max(0, grossEstate - exemption);
  // Simplified estate tax calc — actual uses graduated rates but 40% approximation is close at scale
  const estimatedEstateTax = Math.round(taxableEstate * ESTATE_GIFT_CONSTANTS_2024.topEstateTaxRate);
  const sunsetThreshold = 7000000;
  const tcjaSunsetRisk = grossEstate > sunsetThreshold;

  return {
    estimatedGrossEstate: grossEstate,
    lifeTimeExemptionRemaining: Math.max(0, exemption - grossEstate),
    estimatedTaxableEstate: taxableEstate,
    estimatedEstateTax: estimatedEstateTax,
    tcjaSunsetRisk,
    tcjaSunsetNote: tcjaSunsetRisk
      ? ESTATE_GIFT_CONSTANTS_2024.tcjaSunsetNote
      : "Current estate size is well below the TCJA sunset threshold. Monitor as estate grows.",
    portabilityNote: mfj
      ? "Portability (IRC §2010(c)(5)) allows the surviving spouse to use the deceased spouse's unused exemption (DSUE). A timely estate tax return (Form 706) must be filed within 9 months even if no tax is owed — this preserves the DSUE election."
      : "Portability is only available to married couples. Single clients must rely on their individual lifetime exemption."
  };
}

// ─── Core Document Review ─────────────────────────────────────────────────────

export function buildCoreDocumentReview(client: ClientAccount): CoreDocumentReview {
  const docs = client.estateProfile.coreDocuments ?? [];
  const hasWill = docs.some(d => d.toLowerCase().includes("will"));
  const hasPoa = docs.some(d => d.toLowerCase().includes("attorney"));
  const hasHcd = docs.some(d => d.toLowerCase().includes("healthcare") || d.toLowerCase().includes("directive"));
  const hasTrust = docs.some(d => d.toLowerCase().includes("trust"));

  const missing: string[] = [];
  if (!hasWill) missing.push("Last Will and Testament");
  if (!hasPoa) missing.push("Durable Power of Attorney (financial)");
  if (!hasHcd) missing.push("Healthcare Directive / Living Will");
  if (!hasTrust && client.age && client.age > 55) missing.push("Revocable Living Trust (probate avoidance)");

  const urgencyLevel: CoreDocumentReview["urgencyLevel"] =
    missing.length >= 3 ? "immediate" :
    missing.length >= 1 ? "moderate" :
    "low";

  return {
    hasWill,
    hasPowerOfAttorney: hasPoa,
    hasHealthcareDirective: hasHcd,
    hasTrust,
    beneficiaryAlignmentNote:
      "Beneficiary designations on retirement accounts (IRAs, 401(k)s), life insurance policies, and annuities override the will. These must be reviewed at every major life event — marriage, divorce, birth of a child, death of a beneficiary. A will cannot override a beneficiary designation.",
    missingDocuments: missing,
    urgencyLevel,
    recommendation:
      missing.length === 0
        ? "Core documents appear to be in place. Review beneficiary designations annually and update documents after any major life event."
        : `Missing critical estate planning documents: ${missing.join(", ")}. Without a will, state intestacy laws determine asset distribution — which may not reflect the client's wishes.`
  };
}

// ─── Trust Analysis ───────────────────────────────────────────────────────────

export function buildTrustAnalysis(client: ClientAccount, accountValue: number): TrustAnalysis {
  const grossEstate = estimateGrossEstate(client, accountValue);
  const mfj = isMfj(client);
  const applicableTrusts: string[] = [];

  if (grossEstate > 500000) applicableTrusts.push("Revocable Living Trust");
  if (grossEstate > ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption * 0.5) {
    applicableTrusts.push("Credit Shelter Trust / Bypass Trust");
  }
  if (grossEstate > 5000000 && (client.insuranceCoverage?.length ?? 0) > 0) {
    applicableTrusts.push("Irrevocable Life Insurance Trust (ILIT)");
  }
  if (grossEstate > 3000000) applicableTrusts.push("Grantor Retained Annuity Trust (GRAT)");
  if (mfj && grossEstate > 5000000) applicableTrusts.push("Spousal Lifetime Access Trust (SLAT)");

  return {
    revocableTrustNote:
      "A Revocable Living Trust avoids probate (which can take 1-3 years and cost 3-8% of the estate), maintains privacy (wills are public record), and simplifies multi-state property transfers. It does NOT reduce estate taxes — assets remain in the taxable estate because the grantor retains control.",
    irrevocableTrustNote:
      "Irrevocable trusts remove assets from the taxable estate but require the grantor to relinquish control. Common forms include SLATs, GRATs, and ILITs. Once transferred, the gift is complete — the grantor cannot take assets back.",
    ilitNote:
      "An Irrevocable Life Insurance Trust (ILIT) holds a life insurance policy outside the insured's taxable estate. Death proceeds pass to beneficiaries estate-tax-free while providing liquidity to pay estate taxes on other assets. The insured cannot own or have incidents of ownership in the policy — it must be purchased by or transferred to the trust (3-year rule applies to transfers).",
    gratNote:
      "A Grantor Retained Annuity Trust (GRAT) transfers asset appreciation to heirs estate-tax-free. The grantor receives an annuity stream for a term; any growth above the IRS §7520 hurdle rate passes to remainder beneficiaries with little or no gift tax. A 'zeroed-out GRAT' minimizes the taxable gift. Risk: grantor must survive the GRAT term.",
    slatNote:
      "A Spousal Lifetime Access Trust (SLAT) allows one spouse to make a gift to an irrevocable trust while the beneficiary spouse retains access to income and principal. Removes assets from the donor's estate while maintaining indirect family access. Risk: divorce or death of the beneficiary spouse eliminates access.",
    creditShelterNote:
      "A Credit Shelter (Bypass) Trust uses the first spouse's estate exemption at death rather than relying solely on portability. Useful when TCJA sunset risk is high — locking in today's larger exemption.",
    applicableTrusts,
    recommendation:
      applicableTrusts.length === 0
        ? "Current estate size does not require complex trust planning. A simple will with beneficiary designation review is appropriate."
        : `Consider: ${applicableTrusts.join(", ")}. ${ESTATE_GIFT_CONSTANTS_2024.tcjaSunsetNote}`
  };
}

// ─── Gifting Strategy Analysis ────────────────────────────────────────────────

export function buildGiftingStrategyAnalysis(
  client: ClientAccount,
  accountValue: number
): GiftingStrategyAnalysis {
  const grossEstate = estimateGrossEstate(client, accountValue);
  const dependentCount = Math.max(1, client.householdAges.length - 1);
  const annualExclusionCapacity = ESTATE_GIFT_CONSTANTS_2024.annualGiftExclusion * dependentCount;
  const fiveYearFrontLoad = ESTATE_GIFT_CONSTANTS_2024.annualGiftExclusion * 5; // Per beneficiary, IRC §529(c)(2)

  return {
    annualExclusionCapacity,
    fiveYearFrontLoad,
    appreciatedAssetNote:
      "Assets held until death receive a step-up in cost basis to fair market value (IRC §1014), eliminating the capital gains tax on lifetime appreciation. Gifting appreciated assets during life causes the recipient to inherit the donor's (often lower) cost basis (IRC §1015) — potentially triggering capital gains when the recipient sells. For highly appreciated assets, holding until death is often more tax-efficient than gifting.",
    lifetimeGiftingNote:
      `The lifetime gift and estate tax exemption is $${ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption.toLocaleString()} per person in 2024 (unified credit under IRC §2010). Gifts exceeding the annual exclusion reduce the available lifetime exemption dollar-for-dollar. ${ESTATE_GIFT_CONSTANTS_2024.tcjaSunsetNote}`,
    qpdNote:
      "Qualified transfers for tuition (paid directly to educational institutions) and medical expenses (paid directly to providers) under IRC §2503(e) are completely exempt from gift tax — not subject to the annual exclusion or lifetime exemption. These are unlimited in amount and extremely powerful planning tools.",
    recommendation:
      grossEstate > ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption * 0.7
        ? `Estate is approaching or above the exemption. Annual gifting of $${annualExclusionCapacity.toLocaleString()} per year, 529 superfunding, direct tuition/medical payments, and strategic trust transfers should all be evaluated now.`
        : `Annual exclusion gifting of $${annualExclusionCapacity.toLocaleString()} per year can systematically reduce the taxable estate over time. Start this discipline now.`
  };
}

// ─── Basis Planning Analysis ──────────────────────────────────────────────────

export function buildBasisPlanningAnalysis(): BasisPlanningAnalysis {
  return {
    stepUpInBasisNote:
      "IRC §1014 provides that assets included in a decedent's gross estate receive a new cost basis equal to fair market value on the date of death (or alternate valuation date). This eliminates capital gains tax on all appreciation during the decedent's lifetime — one of the most powerful wealth transfer mechanisms in the tax code.",
    giftCarryoverBasisNote:
      "Under IRC §1015, the recipient of a gift takes the donor's original cost basis (carryover basis). If you received an asset as a gift and the donor paid $10,000 for it (now worth $100,000), you owe capital gains tax on $90,000 when you sell. This is a critical distinction from inherited assets.",
    incomeInRespectOfDecedentNote:
      "Income in Respect of a Decedent (IRD) — such as traditional IRA and 401(k) balances, deferred compensation, and installment sale proceeds — does NOT receive a step-up in basis under IRC §691. Distributions from inherited IRAs are still taxable as ordinary income to the beneficiary. IRD assets are often the most tax-inefficient assets to inherit and are frequently best left to charity via QCD or charitable bequest.",
    recommendation:
      "Review each asset class differently: brokerage accounts and real estate benefit most from a hold-until-death strategy to capture step-up. IRAs and deferred accounts are typically best characterized as IRD and may warrant Roth conversion or charitable planning. Coordinate with a CPA and estate attorney before making irrevocable transfer decisions."
  };
}

// ─── Full Snapshot ────────────────────────────────────────────────────────────

export function buildEstatePlanningSnapshot(
  client: ClientAccount,
  accountValue: number
): EstatePlanningSnapshot {
  const exposureAnalysis = buildEstateExposureAnalysis(client, accountValue);
  const coreDocuments = buildCoreDocumentReview(client);
  const trustAnalysis = buildTrustAnalysis(client, accountValue);
  const giftingStrategy = buildGiftingStrategyAnalysis(client, accountValue);
  const basisPlanning = buildBasisPlanningAnalysis();

  const complexityScore = Math.min(100, Math.round(
    (exposureAnalysis.estimatedGrossEstate / 1000000) * 5 +
    coreDocuments.missingDocuments.length * 15 +
    trustAnalysis.applicableTrusts.length * 10 +
    (exposureAnalysis.tcjaSunsetRisk ? 20 : 0)
  ));

  const priorityAction =
    coreDocuments.urgencyLevel === "immediate"
      ? `URGENT: ${coreDocuments.missingDocuments.join(", ")} must be completed immediately. Without a valid will, state intestacy laws control asset distribution.`
      : exposureAnalysis.tcjaSunsetRisk
        ? `TCJA sunset risk detected. Engage estate attorney before December 31, 2025 to evaluate whether gifting or trust strategies should be implemented while the $${(ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption / 1000000).toFixed(2)}M exemption is available.`
        : "Estate planning fundamentals appear solid. Schedule annual review to update for life changes and monitor legislative developments.";

  return {
    exposureAnalysis,
    coreDocuments,
    trustAnalysis,
    giftingStrategy,
    basisPlanning,
    overallComplexityScore: complexityScore,
    priorityAction,
    regulatoryNote:
      "Estate and gift tax governed by IRC §§2001-2210. All planning must comply with IRC §2035 (3-year rule for transfers), §2036 (retained interest rules), §2038 (revocable transfers), and related anti-avoidance provisions. Trust structures must comply with applicable state law (Uniform Trust Code or state equivalent). Consult qualified estate planning counsel for implementation."
  };
}
