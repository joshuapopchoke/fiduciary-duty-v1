import { useMemo, useState } from "react";
import { useSelectedClient } from "../store/gameStore";
import {
  buildInsurancePlanningSnapshot,
  type InsurancePlanningSnapshot
} from "../engine/insurancePlanningEngine";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface InsurancePlanningPanelProps {
  assignedDifficulty?: string;
  onTelemetryChange?: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

type InsuranceTab = "life" | "disability" | "ltc" | "liability" | "annuity";

type DecisionResult = {
  correct: boolean;
  feedback: string;
  points: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function DecisionButtons({
  options,
  correctId,
  onDecision,
  feedbackMap,
  onNext
}: {
  options: { id: string; label: string; description: string }[];
  correctId: string;
  onDecision: (result: DecisionResult) => void;
  feedbackMap: Record<string, string>;
  onNext?: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  function handleSelect(id: string) {
    if (result) return;
    setSelected(id);
    const correct = id === correctId;
    const res: DecisionResult = {
      correct,
      feedback: feedbackMap[id] ?? "",
      points: correct ? 20 : -10
    };
    setResult(res);
    onDecision(res);
  }

  return (
    <>
      <div className="comparison-grid">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              selected === opt.id
                ? opt.id === correctId ? "decision-correct" : "decision-wrong"
                : selected && opt.id === correctId ? "decision-correct" : ""
            }`}
            onClick={() => handleSelect(opt.id)}
            disabled={!!result}
          >
            <span>Option</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {result && (
        <div className={`portfolio-summary-card ${result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{result.correct ? "✓ Correct" : `✗ Incorrect — Correct: ${options.find(o => o.id === correctId)?.label}`}</span>
          <small>{result.feedback}</small>
        </div>
      )}
      {result && onNext && (
        <div className="slot-actions">
          <button type="button" className="primary-btn manager-inline-btn" onClick={onNext}>Next Topic →</button>
        </div>
      )}
    </>
  );
}

// ─── Life Insurance ───────────────────────────────────────────────────────────
function LifeInsuranceTab({ snapshot, onDecision, onNext }: { snapshot: InsurancePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const life = snapshot.lifeInsurance;

  const q1Options = [
    {
      id: "dime",
      label: `DIME method: ${formatCurrency(life.dimeEstimate)}`,
      description: "Debt + Income replacement + Mortgage + Education — most comprehensive methodology"
    },
    {
      id: "income-10x",
      label: `10× income rule: ${formatCurrency(life.incomeReplacementNeed)}`,
      description: "Common industry shorthand — tends to underestimate with mortgage or education obligations"
    },
    {
      id: "needs",
      label: `Needs-based: ${formatCurrency(life.needsBasedEstimate)}`,
      description: "Debt + dependent support + final expenses — misses income replacement continuity"
    },
    {
      id: "current",
      label: `Current coverage only: ${formatCurrency(life.currentCoverage)}`,
      description: life.coverageGap > 0 ? `Coverage gap of ${formatCurrency(life.coverageGap)} is unaddressed` : "Coverage appears adequate for current household"
    }
  ];

  const q1FeedbackMap: Record<string, string> = {
    "dime": life.coverageGap > 0
      ? `Correct. The DIME method (Debt + Income replacement + Mortgage + Education) produces the most comprehensive coverage estimate. It captures all financial obligations systematically. Recommended: ${formatCurrency(life.recommendedCoverage)}. Review at every major life event — marriage, birth, mortgage origination, income change.`
      : `DIME is the best methodology. Current coverage analysis shows the gap is minimal, but any method change should be confirmed at the next annual review.`,
    "income-10x": `The 10× rule is a useful quick estimate but systematically underestimates for clients with large mortgage debt or education funding obligations. DIME accounts for those specifically.`,
    "needs": `Needs-based analysis covers immediate obligations but misses ongoing income replacement. A family losing a primary earner needs income continuity for years — not just debt payoff.`,
    "current": life.coverageGap > 0
      ? `Incorrect. Current coverage leaves a gap of ${formatCurrency(life.coverageGap)}. Reviewing the DIME analysis shows meaningful unmet obligations that this coverage does not address.`
      : `Correct for this client profile. Coverage appears adequate. Confirm annually.`
  };

  const q2Options = [
    {
      id: "term",
      label: "Term life — level premiums for a defined period, no cash value",
      description: "Pure death benefit protection; lapses at end of term. Most cost-efficient for income replacement."
    },
    {
      id: "whole",
      label: "Whole life — permanent coverage with guaranteed cash value growth",
      description: "Higher premiums; cash value grows tax-deferred; dividends possible with mutual carriers"
    },
    {
      id: "ul",
      label: "Universal life — flexible premiums, adjustable death benefit",
      description: "Crediting rate risk; underfunding can lapse the policy if interest rates fall"
    },
    {
      id: "vul",
      label: "Variable universal life (VUL) — sub-account investment risk inside the policy",
      description: "Death benefit tied to investment performance; best for tax-efficient wealth accumulation, not pure protection"
    }
  ];

  const q2FeedbackMap: Record<string, string> = {
    "term": `Correct for income replacement. Term life provides the highest death benefit per dollar of premium — it is the appropriate product when the goal is to replace income for a defined period (e.g., until children are independent or mortgage is paid). It has no cash value, no investment component, and no complexity. Match term length to the duration of the obligation.`,
    "whole": `Whole life is appropriate for permanent needs (estate liquidity, key-person coverage, permanent income replacement) but is not the right product when cost-efficient income replacement is the primary goal. The premium differential can be significant — 8-10× higher than equivalent term coverage.`,
    "ul": `Universal life flexibility can be useful but the crediting rate risk means the policy can lapse if premiums are insufficient and credited rates decline. For pure income replacement, term is simpler and more reliable.`,
    "vul": `VUL is an investment product as much as a life insurance product — appropriate for tax-deferred accumulation strategies after maximizing qualified plans. It is not the right product when the primary goal is income replacement due to investment risk in the death benefit.`
  };

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Coverage gap analysis</span>
          <strong>Current: {formatCurrency(life.currentCoverage)} | Gap: {formatCurrency(life.coverageGap)}</strong>
          <small>DIME estimate: {formatCurrency(life.dimeEstimate)}</small>
        </div>
        <div className="comparison-card">
          <span>Recommended coverage</span>
          <strong>{formatCurrency(life.recommendedCoverage)}</strong>
          <small>{life.termVsPermanentNote}</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — Coverage Needs: Which method is most defensible?</div>
      <DecisionButtons options={q1Options} correctId={life.coverageGap > 0 ? "dime" : "current"} onDecision={onDecision} feedbackMap={q1FeedbackMap} />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Product Selection: Income replacement goal — which policy type?</div>
      <DecisionButtons options={q2Options} correctId="term" onDecision={onDecision} feedbackMap={q2FeedbackMap} onNext={onNext} />
    </div>
  );
}

// ─── Disability ───────────────────────────────────────────────────────────────
function DisabilityTab({ snapshot, onDecision, onNext }: { snapshot: InsurancePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const dis = snapshot.disability;

  const q1Options = [
    {
      id: "own-occ",
      label: `Own-occupation definition`,
      description: "Pays if you cannot perform the duties of YOUR specific occupation — even if you could work in another field"
    },
    {
      id: "any-occ",
      label: "Any-occupation definition",
      description: "Only pays if you cannot work in ANY occupation — a surgeon who loses fine motor skills could be denied if they can teach"
    },
    {
      id: "modified",
      label: "Modified own-occupation (split definition)",
      description: "Own-occ for first 2-5 years, then converts to any-occ — reduces protection at the point of longest need"
    },
    {
      id: "ssdi",
      label: "SSDI is sufficient for most professionals",
      description: "SSDI average benefit is ~$1,500/month and requires total disability — inadequate for most professional income levels"
    }
  ];

  const q1Feedback: Record<string, string> = {
    "own-occ": `Correct. Own-occupation is the gold standard definition for professional coverage. A physician who cannot perform surgery due to a hand injury is totally disabled under own-occ even if they could teach medicine. Any-occupation and modified definitions eliminate this protection. Always recommend own-occ for professionals; ensure the definition is preserved through retirement age.`,
    "any-occ": `Incorrect. Any-occupation definition only pays if the insured cannot work in ANY capacity for which they are reasonably suited. A highly compensated professional could be denied benefits if they could theoretically perform a lower-paying role. Own-occupation is the correct recommendation.`,
    "modified": `Modified own-occ seems like a compromise but is the worst of both worlds — it provides own-occ protection early but converts to any-occ at the 2-5 year mark, precisely when a long-duration disability becomes the primary risk.`,
    "ssdi": `SSDI is entirely inadequate for professional income protection. The average monthly SSDI benefit is ~$1,500, the application process can take 1-3 years, and benefits require total disability under any-occupation standards. Private disability insurance is non-negotiable for income-dependent professionals.`
  };

  const q2Options = [
    {
      id: "30-day",
      label: "30-day elimination period",
      description: "Benefits begin after 30 days — highest premium; appropriate only if client has minimal reserves"
    },
    {
      id: "90-day",
      label: "90-day elimination period",
      description: "The standard sweet spot — 3 months of reserves are manageable for most clients; premium savings are significant vs. 30-day"
    },
    {
      id: "180-day",
      label: "180-day elimination period",
      description: "Lower premium; requires 6 months of liquid reserves; appropriate for clients with strong emergency funds"
    },
    {
      id: "1-year",
      label: "1-year elimination period",
      description: "Lowest premium; only appropriate for clients with very large liquid reserves (>12 months expenses)"
    }
  ];

  const elimFeedback: Record<string, string> = {
    "30-day": `30-day elimination periods have significantly higher premiums. Unless the client has minimal liquid reserves, the premium cost exceeds the marginal benefit — most 30-day disabilities resolve or are covered by employer sick pay.`,
    "90-day": `Correct. The 90-day elimination period is the optimal default for clients with 3+ months of liquid reserves. The premium savings vs. 30-day are material. If the client has a robust emergency fund (6+ months), consider 180-day for additional savings. Match the elimination period to the client's actual liquidity.`,
    "180-day": `180-day is cost-efficient but requires 6 months of truly liquid reserves that won't be needed for anything else. For clients with strong reserves and stable employment, this is a reasonable choice. For clients with thinner liquidity, 90-day provides better protection.`,
    "1-year": `A 1-year elimination period is appropriate only for clients with very large liquid reserves. One year is a long time to go without income — ensure the client truly has 12+ months of accessible funds before recommending this structure.`
  };

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Income to protect</span>
          <strong>Monthly benefit target: {formatCurrency(dis.targetBenefitMonthly)}</strong>
          <small>60-70% of gross income | SSDI average ~$1,500/mo — far below professional income needs</small>
        </div>
        <div className="comparison-card">
          <span>Policy structure markers</span>
          <strong>Own-occ | Non-cancelable | Guaranteed renewable</strong>
          <small>{dis.ownOccupationNote}</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — Which disability definition provides the strongest professional protection?</div>
      <DecisionButtons options={q1Options} correctId="own-occ" onDecision={onDecision} feedbackMap={q1Feedback} />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Elimination Period: What is the standard professional recommendation?</div>
      <DecisionButtons options={q2Options} correctId="90-day" onDecision={onDecision} feedbackMap={elimFeedback} />
    </div>
  );
}

// ─── Long-Term Care ───────────────────────────────────────────────────────────
function LtcTab({ snapshot, onDecision, onNext }: { snapshot: InsurancePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const ltc = snapshot.longTermCare;
  const age = ltc.applicableAge ?? 50;

  const q1Options = [
    {
      id: "hybrid",
      label: "Hybrid life/LTC policy (IRC §7702B)",
      description: "Death benefit with LTC acceleration rider — eliminates 'use it or lose it'; level premiums; guaranteed"
    },
    {
      id: "traditional",
      label: "Traditional standalone LTC insurance",
      description: "Pure LTC coverage; premiums historically have increased; coverage may be limited by underwriting age"
    },
    {
      id: "self-fund",
      label: "Self-fund through a dedicated investment account",
      description: "Retains investment upside but concentrates risk — total exposure can exceed $400,000"
    },
    {
      id: "medicaid",
      label: "Plan for Medicaid — spend down assets to qualify",
      description: "5-year lookback; restricts care options; not appropriate for clients with meaningful assets"
    }
  ];

  const correctQ1 = age < 50 ? "self-fund" : age <= 65 ? "hybrid" : age < 75 ? "traditional" : "self-fund";

  const q1Feedback: Record<string, string> = {
    "hybrid": age >= 50 && age <= 65
      ? `Correct. Hybrid life/LTC policies under IRC §7702B address the most common objection to LTC insurance — "what if I never need it?" The death benefit ensures the premium is not wasted. Premiums are level and guaranteed. For clients in their 50s-early 60s, hybrid policies offer the best combination of cost certainty, coverage, and residual value. Underwriting is still manageable at this age.`
      : `Hybrid policies are strong, but premium efficiency drops after 65 and underwriting becomes challenging. Evaluate standalone LTC or self-funding at more advanced ages.`,
    "traditional": age > 65
      ? `Traditional LTC insurance becomes harder to obtain and more expensive past 65. For clients already in this range, it may still be available, but hybrid policies generally offer better premium certainty if underwriting qualifies.`
      : `Traditional LTC is a valid option but premiums are not rate-guaranteed and carriers have exited the market historically. Hybrid policies offer better cost certainty for clients under 65.`,
    "self-fund": age < 50
      ? `Correct for younger clients. At younger ages, a dedicated investment account growing for 20-30 years can offset LTC costs efficiently. Purchase insurance only as the need approaches and investment returns begin to be insufficient to cover the projected exposure.`
      : `Self-funding exposes the full portfolio to LTC risk of ${formatCurrency(ltc.estimatedTotalExposure)}. Insurance transfers this concentration risk at a fraction of the total exposure cost. Self-funding is a last resort for clients who are uninsurable.`,
    "medicaid": `Medicaid should never be a primary LTC planning strategy for clients with meaningful assets. It requires spending down to near-poverty levels, applies a 5-year lookback that can cause disqualification, and severely restricts care options and quality. Medicaid planning is a last resort, not a wealth management strategy.`
  };

  const q2Options = [
    {
      id: "3pct-inflation",
      label: "Include a 3% compound inflation rider",
      description: "LTC costs inflate at 3-5% annually — a flat benefit bought today loses real purchasing power by the time it is needed"
    },
    {
      id: "flat-benefit",
      label: "Buy a flat benefit — simplest and cheapest",
      description: "No inflation protection; $5,000/month today may cover only $2,500 in today's dollars in 20 years"
    },
    {
      id: "shared-care",
      label: "Add a shared care rider for married couples",
      description: "Allows spouses to draw from a combined benefit pool — if one spouse exhausts their benefit, they draw from the other's"
    },
    {
      id: "return-of-premium",
      label: "Return of premium rider — premiums refunded if policy never used",
      description: "Significantly increases premium cost; addressed more efficiently by hybrid policy structure"
    }
  ];

  const q2Feedback: Record<string, string> = {
    "3pct-inflation": `Correct. LTC costs have historically inflated at 3-5% annually. A policy purchased at age 55 may not be needed for 20-30 years — a flat benefit can lose 40-50% of its real purchasing power. A 3% compound inflation rider is the minimum recommended for clients under 65. For younger clients, 5% compound is worth the additional premium given the longer compounding period.`,
    "flat-benefit": `Incorrect. LTC costs inflate significantly. A flat $5,000/month benefit purchased today will have the purchasing power of roughly $2,700-3,000 in today's dollars when needed 20 years from now. Always include at minimum a 3% compound inflation rider for clients under 70.`,
    "shared-care": `Shared care is a valuable add-on for married couples — it provides efficiency when one spouse's LTC needs are significantly greater than the other's. It is supplemental to the core product selection, not a substitute for inflation protection. Add both if the budget allows.`,
    "return-of-premium": `Return-of-premium riders add substantial premium cost. The same objective (not losing the premium if LTC is never needed) is more efficiently addressed by a hybrid life/LTC policy, which includes a death benefit by design. If the client objects to traditional LTC's 'use it or lose it' risk, recommend hybrid rather than adding ROP to a standalone policy.`
  };

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>LTC exposure estimate</span>
          <strong>{formatCurrency(ltc.estimatedTotalExposure)} over ~{ltc.averageCareStats.averageStayYears} year average care period</strong>
          <small>Median nursing home: {formatCurrency(ltc.averageCareStats.averageNursingHomeCostMonthly)}/mo | Home care: ${ltc.averageCareStats.averageHomeCareHourly}/hr</small>
        </div>
        <div className="comparison-card">
          <span>Planning window</span>
          <strong>{ltc.planningWindowNote.split(".")[0]}</strong>
          <small>Age {age} — {age < 65 ? "good underwriting window" : "underwriting increasingly difficult"}</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — LTC Funding Strategy: What is the best recommendation?</div>
      <DecisionButtons options={q1Options} correctId={correctQ1} onDecision={onDecision} feedbackMap={q1Feedback} />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Policy Design: What rider is most important to include?</div>
      <DecisionButtons options={q2Options} correctId="3pct-inflation" onDecision={onDecision} feedbackMap={q2Feedback} onNext={onNext} />
    </div>
  );
}

// ─── Liability / Umbrella ─────────────────────────────────────────────────────
function LiabilityTab({ snapshot, onDecision, onNext }: { snapshot: InsurancePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const umbrella = snapshot.umbrellaLiability;

  const q1Options = [
    {
      id: "1m",
      label: "$1,000,000 umbrella policy",
      description: "Industry minimum — generally recommended for clients with any meaningful net worth or liability exposure"
    },
    {
      id: "net-worth-match",
      label: "Coverage equal to net worth (e.g., $3M for $3M net worth)",
      description: "Common rule of thumb: match umbrella coverage to total net worth"
    },
    {
      id: "auto-home-only",
      label: "Rely solely on auto and homeowner's liability limits",
      description: "Auto and homeowner limits are typically $100K-$300K — insufficient for high-net-worth clients facing major liability events"
    },
    {
      id: "umbrella-replaces",
      label: "Umbrella replaces auto and homeowner's liability coverage",
      description: "False — umbrella is excess coverage that sits above underlying policies, which must be maintained at required minimums"
    }
  ];

  const q1Feedback: Record<string, string> = {
    "1m": `$1M is the minimum recommended umbrella coverage. For clients with more than $1M in assets, coverage should increase — a $1M umbrella does not protect a $5M estate. The standard guidance is to match umbrella coverage to net worth at a minimum, then evaluate elevated risk factors.`,
    "net-worth-match": `Correct. Umbrella coverage should equal or exceed net worth to provide meaningful protection. Add $1M of coverage for every $1M of net worth as a starting point, then layer in risk factors: teen drivers, rental properties, home pools or trampolines, professional exposure, and public profiles. At ${formatCurrency(umbrella.recommendedCoverageMin)} recommended minimum, confirm underlying auto and homeowner policies meet the umbrella carrier's required limits.`,
    "auto-home-only": `Incorrect. Standard auto liability limits are $100K-$300K and homeowner liability coverage is typically $100K-$300K. A single serious auto accident, premises liability claim, or lawsuit can easily exceed these limits. Without an umbrella policy, personal assets are directly exposed to any judgment excess.`,
    "umbrella-replaces": `Incorrect. An umbrella is excess liability coverage — it only pays after the underlying auto and homeowner policies have been exhausted. The umbrella carrier requires the client to maintain the underlying policies at specified minimum limits. Canceling underlying coverage voids umbrella protection.`
  };

  const q2Options = [
    {
      id: "excess-only",
      label: "Umbrella only covers auto and homeowner's liability claims",
      description: "False — umbrella covers many claims that underlying policies specifically exclude"
    },
    {
      id: "broad-coverage",
      label: "Umbrella can cover claims excluded by underlying policies (libel, slander, false arrest)",
      description: "True — umbrella policies often include coverage for personal injury torts not covered by standard homeowner's"
    },
    {
      id: "business-included",
      label: "Umbrella automatically covers business and professional liability",
      description: "False — most personal umbrella policies specifically exclude business and professional activities"
    },
    {
      id: "no-deductible",
      label: "Umbrella has no deductible — it pays from dollar one",
      description: "False — umbrella kicks in after underlying limits are exhausted; the 'deductible' is the underlying policy exhaustion"
    }
  ];

  const q2Feedback: Record<string, string> = {
    "excess-only": `Incorrect. A major advantage of umbrella policies is that they often cover personal injury torts not included in standard homeowner's — libel, slander, false arrest, invasion of privacy. Review each carrier's coverage form carefully; some umbrella policies are broader than others.`,
    "broad-coverage": `Correct. Personal umbrella policies frequently extend to claims that underlying policies specifically exclude — including personal injury torts like libel, slander, and false arrest. This is one of the reasons umbrella coverage is essential for high-net-worth clients with public profiles, active social media presence, or service on boards and committees. Always review the specific umbrella form for covered torts.`,
    "business-included": `Correct — this is a true statement that describes a gap clients often miss. Most personal umbrella policies exclude business and professional liability. A client who operates a business, has rental income, or has professional exposure needs separate commercial umbrella, E&O, or D&O coverage. The personal umbrella does not protect them from work-related claims.`,
    "no-deductible": `Incorrect. The umbrella does not have a traditional deductible — it has a "retained limit" which is essentially the exhaustion of underlying policy limits. However, for claims that the umbrella covers but underlying policies do not, the client may owe a self-insured retention (SIR) — typically $250-$10,000 depending on the carrier.`
  };

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Recommended minimum coverage</span>
          <strong>{formatCurrency(umbrella.recommendedCoverageMin)}</strong>
          <small>Match to net worth; increase $1M per $1M of assets</small>
        </div>
        <div className="comparison-card">
          <span>How it works</span>
          <strong>Excess liability above auto + homeowner's limits</strong>
          <small>{umbrella.triggerNote}</small>
        </div>
        {umbrella.highRiskFactors.length > 0 && (
          <div className="comparison-card">
            <span>Elevated risk factors identified</span>
            <strong>{umbrella.highRiskFactors.length} factors</strong>
            <small>{umbrella.highRiskFactors.join(" | ")}</small>
          </div>
        )}
        <div className="comparison-card">
          <span>Action</span>
          <strong>{umbrella.recommendation.split(".")[0]}</strong>
          <small>Ensure underlying auto and homeowner's meet umbrella carrier minimums before binding</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — How much umbrella coverage is appropriate?</div>
      <DecisionButtons options={q1Options} correctId="net-worth-match" onDecision={onDecision} feedbackMap={q1Feedback} />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Umbrella Mechanics: Which statement is TRUE?</div>
      <DecisionButtons options={q2Options} correctId="broad-coverage" onDecision={onDecision} feedbackMap={q2Feedback} onNext={onNext} />
    </div>
  );
}

// ─── Annuity Tab ──────────────────────────────────────────────────────────────
function AnnuityTab({ onDecision, onNext }: { onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const q1Options = [
    {
      id: "fixed",
      label: "Fixed annuity — guaranteed interest rate, no market risk",
      description: "Principal and interest guaranteed by the insurance carrier; growth limited to declared rate"
    },
    {
      id: "variable",
      label: "Variable annuity — sub-accounts invested in market, death benefit rider",
      description: "Market participation; higher costs; mortality and expense charges; suitable for tax-deferred growth"
    },
    {
      id: "fixed-indexed",
      label: "Fixed indexed annuity (FIA) — linked to index, floor at 0%, cap applies",
      description: "Participation in index growth up to a cap; no direct market loss; suitable for downside protection"
    },
    {
      id: "immediate",
      label: "Single premium immediate annuity (SPIA) — instant income stream",
      description: "Converts lump sum to guaranteed income immediately; irrevocable; systematic liquidation of principal"
    }
  ];

  const q1Feedback: Record<string, string> = {
    "fixed": `A fixed annuity offers principal protection and a declared interest rate — conservative but growth-limited. Best used in a rising-rate environment or for the ultra-conservative portion of an income plan. The guaranteed rate comparison to CD rates is always relevant.`,
    "variable": `Variable annuities offer market participation and often include death benefit riders, but carry significant cost layers (M&E charges, sub-account expense ratios, rider fees). Appropriate for tax-deferred accumulation when the client has maxed qualified plans and needs additional tax-sheltered growth. Suitability documentation is critical.`,
    "fixed-indexed": `Correct for clients who want equity-linked growth potential with downside protection. The FIA floor at 0% means the client cannot lose principal to market losses; the cap limits upside. Appropriate for clients in or near retirement who want participation without market risk. Evaluate participation rates, cap structures, and surrender schedules carefully.`,
    "immediate": `SPIAs are highly appropriate for clients who need guaranteed income and are willing to give up liquidity. The systematic liquidation component (return of principal + earnings over the payout period) is a key planning concept. Often used to cover fixed expenses in retirement, with the balance of the portfolio remaining invested for growth and liquidity.`
  };

  const q2Options = [
    {
      id: "tax-deferred",
      label: "Annuity growth is tax-deferred until withdrawn",
      description: "True — earnings accumulate without annual taxation; all gains are ordinary income on withdrawal (no LTCG rates)"
    },
    {
      id: "lifo",
      label: "Nonqualified annuity withdrawals follow LIFO — earnings come out first",
      description: "True — gains are distributed first, then cost basis; penalizes early withdrawals from accumulated contracts"
    },
    {
      id: "step-up",
      label: "Annuity gets a step-up in cost basis at death like brokerage accounts",
      description: "False — annuity gains are IRD; beneficiaries owe ordinary income tax on the accumulated earnings"
    },
    {
      id: "10pct-penalty",
      label: "Distributions before 59½ incur a 10% federal penalty tax plus ordinary income",
      description: "True — same early distribution rules as IRAs under IRC §72(q)"
    }
  ];

  const q2Feedback: Record<string, string> = {
    "tax-deferred": `Correct. Tax deferral is the primary tax advantage of nonqualified annuities — no annual 1099 on earnings inside the contract. However, all gains come out as ordinary income — no long-term capital gains rates. This makes annuities less efficient than taxable brokerage accounts for clients in lower LTCG brackets. The deferral advantage is most valuable for clients in high current-income brackets who expect lower rates in retirement.`,
    "lifo": `Correct. Nonqualified annuities follow LIFO (Last In, First Out) — earnings are distributed before basis. This means every dollar withdrawn from an annuity with embedded gains is fully taxable as ordinary income until all gains are exhausted. This disproportionately penalizes clients who need partial withdrawals from a heavily appreciated contract. Annuitization is one way to spread the tax cost over the payout period.`,
    "step-up": `Correct — this is a false statement that represents a common planning mistake. Annuity gains are Income in Respect of a Decedent (IRD) — beneficiaries receive no step-up in basis. They owe ordinary income tax on all accumulated earnings at distribution. This makes large annuity inheritances potentially tax-inefficient. The IRC §691 deduction for estate taxes paid on IRD can partially offset this, but it is a complex calculation.`,
    "10pct-penalty": `Correct. The 10% early withdrawal penalty under IRC §72(q) mirrors the IRA early distribution rules. The penalty applies to the taxable portion (gains) of the distribution before age 59½. Exceptions are similar to IRA exceptions — death, disability, substantially equal periodic payments (SEPP/72(t)-like rules), annuitization.`
  };

  return (
    <div className="portfolio-section">
      <div className="portfolio-summary-card">
        <span>Annuity Planning Context</span>
        <strong>Annuities are insurance products — regulated under state insurance law, NOT securities law unless variable</strong>
        <small>Fixed and fixed-indexed annuities: insurance license only. Variable annuities: Series 6 or 7 + Series 63/65/66 required. Always evaluate suitability, surrender schedules, and total cost before recommending.</small>
      </div>

      <div className="portfolio-section-title">Question 1 — Annuity Product Selection: Which is appropriate for downside protection with index participation?</div>
      <DecisionButtons options={q1Options} correctId="fixed-indexed" onDecision={onDecision} feedbackMap={q1Feedback} />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Annuity Tax Treatment: Which statement is TRUE?</div>
      <DecisionButtons options={q2Options} correctId="lifo" onDecision={onDecision} feedbackMap={q2Feedback} onNext={onNext} />
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function InsurancePlanningPanel({ onTelemetryChange, assignedDifficulty = "trainee" }: InsurancePlanningPanelProps) {
  const activeClient = useSelectedClient();
  const [activeTab, setActiveTab] = useState<InsuranceTab>("life");

  const notif = useClientQuestionNotification("insurance-planning", assignedDifficulty, onTelemetryChange ?? (() => undefined));

  const snapshot = useMemo(
    () => activeClient ? buildInsurancePlanningSnapshot(activeClient) : null,
    [activeClient]
  );

  function handleDecision(_result: DecisionResult) {
    notif.queueNextQuestion(true);
  }

  function drawNextClientQuestion() {
    notif.queueNextQuestion(true);
  }

  if (!activeClient || !snapshot) {
    return (
      <section className="panel">
        <div className="empty-state">Select a client to begin insurance needs analysis.</div>
      </section>
    );
  }

  const tabs: { id: InsuranceTab; label: string }[] = [
    { id: "life", label: "Life Insurance" },
    { id: "disability", label: "Disability" },
    { id: "ltc", label: "Long-Term Care" },
    { id: "liability", label: "Liability & Umbrella" },
    { id: "annuity", label: "Annuities" }
  ];

  return (
    <section className="panel">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <div className="panel-header">
        <h2>Insurance Planning</h2>
        <span className="panel-meta">{activeClient.name} | Insurance planning</span><ClientQuestionBell state={notif.state} onOpen={notif.openNotification} />
      </div>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} type="button" className={activeTab === t.id ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {activeTab === "life" && <LifeInsuranceTab snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />}
      {activeTab === "disability" && <DisabilityTab snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />}
      {activeTab === "ltc" && <LtcTab snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />}
      {activeTab === "liability" && <LiabilityTab snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />}
      {activeTab === "annuity" && <AnnuityTab onDecision={handleDecision} onNext={drawNextClientQuestion} />}
    </section>
  );
}
