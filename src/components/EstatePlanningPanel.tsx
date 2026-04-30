import { useMemo, useState } from "react";
import { useSelectedClient, useGameStore } from "../store/gameStore";
import {
  buildEstatePlanningSnapshot,
  ESTATE_GIFT_CONSTANTS_2024,
  type EstatePlanningSnapshot
} from "../engine/estatePlanningEngine";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface EstatePlanningPanelProps {
  assignedDifficulty?: string;
  onTelemetryChange?: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

type EstateTab = "exposure" | "documents" | "trusts" | "gifting" | "basis";

type DecisionResult = {
  correct: boolean;
  feedback: string;
  points: number;
  label: string;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function DecisionButtons({
  options,
  correctId,
  onDecision,
  context,
  onNext,
  nextLabel = "Next Question"
}: {
  options: { id: string; label: string; description: string }[];
  correctId: string;
  onDecision: (result: DecisionResult) => void;
  context: string;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const feedbackMap: Record<string, string> = Object.fromEntries(
    options.map(o => [o.id, o.description])
  );

  function handleSelect(id: string) {
    if (result) return;
    setSelected(id);
    const correct = id === correctId;
    const opt = options.find(o => o.id === id)!;
    const res: DecisionResult = {
      correct,
      feedback: context,
      points: correct ? 1 : 0,
      label: opt.label
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
        <>
          <div className={`portfolio-summary-card ${result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
            <span>{result.correct ? "✓ Correct" : `✗ Incorrect — Correct: ${options.find(o => o.id === correctId)?.label}`}</span>
            <small>{result.feedback}</small>
          </div>
          {onNext && (
            <div className="slot-actions">
              <button type="button" className="primary-btn manager-inline-btn" onClick={onNext}>{nextLabel}</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ─── Exposure Decision ────────────────────────────────────────────────────────
function ExposureGame({ snapshot, onDecision, onNext }: { snapshot: EstatePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const exp = snapshot.exposureAnalysis;
  const grossEstate = exp.estimatedGrossEstate;
  const taxableEstate = exp.estimatedTaxableEstate;

  const options = [
    {
      id: "no-action",
      label: "No planning needed — estate is below exemption",
      description: "The current lifetime exemption is $13,610,000 per person (2024). If the estate is below this, federal estate tax does not apply unless TCJA sunsets."
    },
    {
      id: "lifetime-gifting",
      label: "Use lifetime gifting to reduce the gross estate now",
      description: "Annual exclusion gifts ($18,000/donee), direct tuition payments, and 529 superfunding reduce the gross estate without using lifetime exemption."
    },
    {
      id: "irrevocable-trust",
      label: "Establish an irrevocable trust to freeze asset values",
      description: "Transfers future appreciation out of the estate. Most effective for clients near or above the exemption with growing assets."
    },
    {
      id: "portability-election",
      label: "Rely solely on portability for a married couple",
      description: "Portability (DSUEA) lets a surviving spouse use a deceased spouse's unused exemption — but only if timely elected on the estate return."
    }
  ];

  const correctId = taxableEstate > 0
    ? "irrevocable-trust"
    : grossEstate > 8000000
      ? "lifetime-gifting"
      : "no-action";

  const contextMap: Record<string, string> = {
    "no-action": taxableEstate > 0
      ? `Incorrect. With a taxable estate of ${formatCurrency(taxableEstate)}, federal estate tax at 40% applies to amounts above the exemption. Active planning is required — waiting is not a strategy when there's a real tax bill.`
      : `Correct. This estate currently falls below the federal exemption of $13,610,000. However, monitor for TCJA sunset (the exemption reverts to ~$7M after 2025 under current law) and any state-level estate taxes.`,
    "lifetime-gifting": grossEstate > 5000000
      ? `Correct. Annual exclusion gifting ($18,000/donee per IRC §2503(b)), direct tuition and medical payments, and 529 superfunding reduce the gross estate dollar-for-dollar without touching the lifetime exemption. For this estate size, systematic gifting is a prudent first step.`
      : `Lifetime gifting is always a sound strategy, but for this estate size, it is not the highest-priority action. Document structure and beneficiary alignment come first.`,
    "irrevocable-trust": taxableEstate > 0
      ? `Correct. An irrevocable trust (such as an ILIT, GRAT, or SLAT) freezes the value of transferred assets in the estate at the transfer date. Future appreciation passes to beneficiaries estate-tax-free. At a taxable estate of ${formatCurrency(taxableEstate)}, the 40% federal estate tax exposure is real and trust-based planning should be evaluated immediately.`
      : `An irrevocable trust is a powerful tool but is most appropriate when the estate is near or above the exemption. For this estate profile, less restrictive strategies may be proportionate.`,
    "portability-election": `Portability is an important safety net for married couples but should NOT be the sole strategy. It requires timely election on Form 706 after the first death, it does not shield future appreciation in the estate, and it is not available for unmarried clients. Portability complements — but does not replace — active estate planning.`
  };

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">Estate Tax Exposure — What is the right action?</div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Estimated gross estate</span>
          <strong>{formatCurrency(grossEstate)}</strong>
          <small>Investment assets + real estate + life insurance proceeds</small>
        </div>
        <div className="comparison-card">
          <span>Lifetime exemption (2024)</span>
          <strong>{formatCurrency(ESTATE_GIFT_CONSTANTS_2024.lifetimeExemption)}</strong>
          <small>IRC §2010(c) — unified credit. Resets to ~$7M if TCJA sunsets after 2025.</small>
        </div>
        <div className="comparison-card">
          <span>Taxable estate</span>
          <strong>{taxableEstate > 0 ? formatCurrency(taxableEstate) : "None at current size"}</strong>
          <small>Amount subject to 40% federal estate tax (IRC §2001(c))</small>
        </div>
        <div className="comparison-card">
          <span>Estimated federal estate tax</span>
          <strong>{exp.estimatedEstateTax > 0 ? formatCurrency(exp.estimatedEstateTax) : "$0"}</strong>
          <small>At 40% marginal rate on the taxable estate</small>
        </div>
      </div>
      {exp.tcjaSunsetRisk && (
        <div className="portfolio-summary-card" style={{ borderLeft: "3px solid var(--color-border-warning)" }}>
          <span>⚠ TCJA Sunset Risk</span>
          <strong>Act before December 31, 2025</strong>
          <small>{exp.tcjaSunsetNote}</small>
        </div>
      )}
      <DecisionButtons
        options={options}
        correctId={correctId}
        onDecision={onDecision}
        context={contextMap[correctId]}
        onNext={onNext}
      />
    </div>
  );
}

// ─── Document Completeness Game ───────────────────────────────────────────────
function DocumentGame({ snapshot, onDecision, onNext }: { snapshot: EstatePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const docs = snapshot.coreDocuments;
  const [q2Selected, setQ2Selected] = useState<string | null>(null);
  const [q2Result, setQ2Result] = useState<DecisionResult | null>(null);

  const options = [
    {
      id: "will-first",
      label: "Draft a will — it controls everything",
      description: "A will is the primary document and handles all assets at death"
    },
    {
      id: "all-three",
      label: "Will + Durable POA + Healthcare Directive — all three are essential",
      description: "The core estate planning triad: death AND incapacity are both addressed"
    },
    {
      id: "trust-first",
      label: "Revocable trust only — skip the will",
      description: "Trusts avoid probate but do not replace the will or incapacity documents"
    },
    {
      id: "beneficiary-only",
      label: "Update beneficiary designations only",
      description: "Beneficiaries override the will on retirement accounts — but leave everything else unaddressed"
    }
  ];

  const q2Options = [
    {
      id: "override",
      label: "Beneficiary designations override the will",
      description: "IRAs, 401(k)s, life insurance, and TOD accounts pass by contract — not through probate"
    },
    {
      id: "will-controls",
      label: "The will controls retirement accounts",
      description: "A will governs probate assets only — non-probate assets pass outside the will"
    },
    {
      id: "trust-controls",
      label: "The trust controls all assets automatically",
      description: "A trust only controls assets that have been properly retitled into the trust"
    },
    {
      id: "state-law",
      label: "State intestacy law controls all accounts if there is no will",
      description: "Intestacy only applies to assets with no designated beneficiary and no joint ownership"
    }
  ];

  function handleQ2(id: string) {
    if (q2Result) return;
    setQ2Selected(id);
    const correct = id === "override";
    const res: DecisionResult = {
      correct,
      feedback: correct
        ? `Correct. Beneficiary designations are contracts — they supersede the will for retirement accounts, life insurance, and TOD/POD accounts. This is why a misaligned beneficiary (e.g., a deceased ex-spouse) can override a carefully drafted will and pass assets to the wrong person. Always review beneficiaries at every major life event.`
        : `Incorrect. ${q2Options.find(o => o.id === "override")?.description}. The will only governs probate assets. Non-probate assets — IRAs, 401(k)s, life insurance, joint accounts — pass by contract outside probate entirely.`,
      points: correct ? 20 : -10,
      label: q2Options.find(o => o.id === id)!.label
    };
    setQ2Result(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      {docs.missingDocuments.length > 0 && (
        <div className="portfolio-summary-card" style={{ borderLeft: "3px solid var(--color-border-warning)" }}>
          <span>⚠ Missing core documents identified</span>
          <strong>{docs.missingDocuments.join(" | ")}</strong>
          <small>Urgency: {docs.urgencyLevel.toUpperCase()} — {docs.beneficiaryAlignmentNote}</small>
        </div>
      )}

      <div className="portfolio-section-title">Question 1 — Core Document Priority</div>
      <div className="portfolio-summary-card">
        <span>Client has no current estate documents on file. What is the highest-priority first step?</span>
        <strong>Select the most comprehensive starting point</strong>
        <small>Without a valid will, assets pass under state intestacy laws which may not reflect the client's wishes at all.</small>
      </div>
      <DecisionButtons
        options={options}
        correctId="all-three"
        onDecision={onDecision}
        onNext={onNext}
        context={`Correct. The three core estate planning documents address three distinct scenarios: (1) The Will — governs asset distribution at death for probate assets; (2) Durable Power of Attorney — authorizes a trusted agent to manage financial affairs if the client is alive but incapacitated; (3) Healthcare Directive / Living Will — specifies medical treatment preferences and names a healthcare proxy. All three are required. Without the POA and Healthcare Directive, the family may need court intervention for a living incapacitated person — a process that is expensive, slow, and public.`}
      />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Beneficiary Designations vs. the Will</div>
      <div className="portfolio-summary-card">
        <span>The client has a will leaving everything to their children. Their 401(k) still lists an ex-spouse as beneficiary. Who gets the 401(k)?</span>
        <strong>Select the correct legal outcome</strong>
        <small>This is one of the most common and costly estate planning mistakes in practice.</small>
      </div>
      <div className="comparison-grid">
        {q2Options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              q2Selected === opt.id
                ? opt.id === "override" ? "decision-correct" : "decision-wrong"
                : q2Selected && opt.id === "override" ? "decision-correct" : ""
            }`}
            onClick={() => handleQ2(opt.id)}
            disabled={!!q2Result}
          >
            <span>Option</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {q2Result && (
        <div className={`portfolio-summary-card ${q2Result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{q2Result.correct ? "✓ Correct" : "✗ Review needed"}</span>
          <strong>{q2Result.correct ? `+${q2Result.points} pts` : `${q2Result.points} pts`}</strong>
          <small>{q2Result.feedback}</small>
        </div>
      )}
    </div>
  );
}

// ─── Trust Selection Game ─────────────────────────────────────────────────────
function TrustGame({ snapshot, onDecision, onNext }: { snapshot: EstatePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const exposure = snapshot.exposureAnalysis;
  const trusts = snapshot.trustAnalysis;
  const [q2Sel, setQ2Sel] = useState<string | null>(null);
  const [q2Result, setQ2Result] = useState<DecisionResult | null>(null);

  const hasLargeEstate = exposure.estimatedGrossEstate > 5000000;
  const hasInsurance = trusts.applicableTrusts.includes("Irrevocable Life Insurance Trust (ILIT)");

  const structureOptions = [
    {
      id: "revocable",
      label: "Revocable Living Trust",
      description: "Avoids probate, maintains control during life — does NOT remove assets from taxable estate"
    },
    {
      id: "ilit",
      label: "Irrevocable Life Insurance Trust (ILIT)",
      description: "Removes life insurance from taxable estate — 3-year rule applies to policies transferred in (IRC §2035)"
    },
    {
      id: "grat",
      label: "Grantor Retained Annuity Trust (GRAT)",
      description: "Transfers appreciation above §7520 rate to heirs estate-tax-free — works best with appreciating assets"
    },
    {
      id: "none",
      label: "No trust — rely on will + beneficiary designations",
      description: "Probate avoidance strategies not needed for smaller estates without estate tax exposure"
    }
  ];

  const structureCorrect = hasInsurance && hasLargeEstate ? "ilit"
    : exposure.estimatedGrossEstate > 500000 ? "revocable"
    : "none";

  const structureContext: Record<string, string> = {
    "revocable": `Correct for this estate profile. A Revocable Living Trust avoids probate, simplifies multi-state asset administration, and provides continuity of management during incapacity. Note: the trust does NOT reduce estate taxes because the grantor retains control — assets remain in the taxable estate under IRC §2036.`,
    "ilit": `Correct. An ILIT removes life insurance death benefits from the taxable estate under IRC §2042 by having the trust own the policy rather than the insured. At death, proceeds provide estate liquidity. Key requirements: the insured must hold no incidents of ownership; new policies are preferred (transferred policies have a 3-year look-back under IRC §2035); annual premium payments require Crummey notices to beneficiaries.`,
    "grat": `A GRAT is a powerful tool for transferring appreciation above the §7520 hurdle rate to heirs. Most effective in low-rate environments with rapidly appreciating assets. If the grantor dies during the GRAT term, the assets are pulled back into the estate. For this client profile, baseline documents and a revocable trust should come first.`,
    "none": `Correct for a modest estate with no estate tax exposure. A well-drafted will and current beneficiary designations are sufficient. Revisit as the estate grows or the TCJA sunset approaches.`
  };

  const q2TrustOptions = [
    {
      id: "revocable-tax",
      label: "A revocable trust reduces your estate taxes",
      description: "False — revocable trusts are transparent for tax purposes; assets remain in the taxable estate"
    },
    {
      id: "irrevocable-control",
      label: "You can take assets back from an irrevocable trust",
      description: "False — the transfer is permanent by definition; that is what removes assets from the estate"
    },
    {
      id: "trust-probate",
      label: "Assets in a properly funded trust avoid probate",
      description: "True — the trust owns the assets; they pass to beneficiaries per trust terms without court process"
    },
    {
      id: "pour-over",
      label: "A pourover will is needed even when a trust exists",
      description: "True — a pourover will catches any assets not transferred to the trust and directs them into it at death"
    }
  ];

  function handleQ2(id: string) {
    if (q2Result) return;
    setQ2Sel(id);
    const correct = id === "trust-probate" || id === "pour-over";
    const res: DecisionResult = {
      correct,
      feedback: correct
        ? `Correct. Both are true statements about trusts. Assets in a properly funded revocable trust do avoid probate — a key planning benefit. And a pourover will should always accompany a trust to catch any assets inadvertently left outside the trust structure at death. Neither overestimates trust capabilities.`
        : `Incorrect. "${q2TrustOptions.find(o => o.id === id)?.label}" is a false statement about trusts. ${q2TrustOptions.find(o => o.id === id)?.description}.`,
      points: correct ? 20 : -10,
      label: q2TrustOptions.find(o => o.id === id)!.label
    };
    setQ2Result(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-summary-card">
        <span>Estate profile</span>
        <strong>Gross estate: {formatCurrency(exposure.estimatedGrossEstate)} | Tax exposure: {formatCurrency(exposure.estimatedEstateTax)}</strong>
        <small>Applicable structures: {trusts.applicableTrusts.length > 0 ? trusts.applicableTrusts.join(", ") : "Basic documents sufficient at current size"}</small>
      </div>

      <div className="portfolio-section-title">Question 1 — Which trust structure is most appropriate?</div>
      <DecisionButtons
        options={structureOptions}
        correctId={structureCorrect}
        onDecision={onDecision}
        context={structureContext[structureCorrect]}
      />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Trust Mechanics: Which statement is TRUE?</div>
      <div className="comparison-grid">
        {q2TrustOptions.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              q2Sel === opt.id
                ? (opt.id === "trust-probate" || opt.id === "pour-over") ? "decision-correct" : "decision-wrong"
                : q2Sel && (opt.id === "trust-probate" || opt.id === "pour-over") ? "decision-correct" : ""
            }`}
            onClick={() => handleQ2(opt.id)}
            disabled={!!q2Result}
          >
            <span>Statement</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {q2Result && (
        <div className={`portfolio-summary-card ${q2Result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{q2Result.correct ? "✓ Correct" : "✗ Review needed"}</span>
          <strong>{q2Result.correct ? `+${q2Result.points} pts` : `${q2Result.points} pts`}</strong>
          <small>{q2Result.feedback}</small>
        </div>
      )}
    </div>
  );
}

// ─── Gifting Game ─────────────────────────────────────────────────────────────
function GiftingGame({ snapshot, onDecision, onNext }: { snapshot: EstatePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const gifting = snapshot.giftingStrategy;
  const [q2Sel, setQ2Sel] = useState<string | null>(null);
  const [q2Result, setQ2Result] = useState<DecisionResult | null>(null);

  const q1Options = [
    {
      id: "annual-exclusion",
      label: `Annual exclusion gifts — $18,000/donee (IRC §2503(b))`,
      description: "Gifts up to $18,000 per recipient per year require no gift tax return and do not use lifetime exemption"
    },
    {
      id: "529-superfund",
      label: "529 superfunding — $90,000 lump sum per beneficiary",
      description: "Front-load 5 years of annual exclusions into a 529 in one year under IRC §529(c)(2)"
    },
    {
      id: "direct-payment",
      label: "Direct tuition and medical payments — unlimited exclusion",
      description: "Payments made directly to schools or medical providers are excluded entirely from gift tax — no dollar limit"
    },
    {
      id: "appreciated-gift",
      label: "Gift appreciated stock to reduce your own estate",
      description: "The recipient takes your cost basis — capital gain is NOT eliminated, just shifted"
    }
  ];

  const q2Options = [
    {
      id: "step-up",
      label: "Hold appreciated assets until death — the heir gets a stepped-up basis",
      description: "IRC §1014: FMV at date of death becomes the new basis — the built-in gain is permanently eliminated"
    },
    {
      id: "gift-appreciated",
      label: "Gift appreciated assets now to get them out of your estate",
      description: "IRC §1015: Recipient takes donor's carryover basis — capital gain is transferred, not eliminated"
    },
    {
      id: "sell-first",
      label: "Sell appreciated assets before death and distribute cash",
      description: "Selling triggers capital gains tax. Holding until death avoids the tax entirely via step-up."
    },
    {
      id: "gift-ira",
      label: "Gift IRA assets to charity directly via QCD",
      description: "QCD (IRC §408(d)(8)) satisfies RMDs and transfers assets to charity income-tax-free — not used for family gifting"
    }
  ];

  function handleQ2(id: string) {
    if (q2Result) return;
    setQ2Sel(id);
    const correct = id === "step-up";
    const res: DecisionResult = {
      correct,
      feedback: correct
        ? `Correct. Holding appreciated assets until death triggers IRC §1014 step-up in basis — the heir's cost basis resets to fair market value at date of death, permanently eliminating the built-in capital gain. This is one of the most powerful income-tax planning tools available for clients with highly appreciated assets. Gift the cash, hold the gain.`
        : `Incorrect. Gifting appreciated assets during life transfers the donor's cost basis to the recipient under IRC §1015 — the capital gain is transferred, not eliminated. The optimal strategy for appreciated assets with a long-horizon client is to hold until death for the IRC §1014 step-up.`,
      points: correct ? 20 : -10,
      label: q2Options.find(o => o.id === id)!.label
    };
    setQ2Result(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Annual exclusion capacity</span>
          <strong>{formatCurrency(gifting.annualExclusionCapacity)}</strong>
          <small>$18,000 × {Math.round(gifting.annualExclusionCapacity / 18000)} donees | No gift tax return required (IRC §2503(b))</small>
        </div>
        <div className="comparison-card">
          <span>529 superfunding capacity</span>
          <strong>{formatCurrency(gifting.fiveYearFrontLoad)}</strong>
          <small>5-year front-load per beneficiary | IRC §529(c)(2) | Prorated if donor dies within 5 years</small>
        </div>
        <div className="comparison-card">
          <span>Direct tuition/medical</span>
          <strong>Unlimited exclusion</strong>
          <small>{gifting.qpdNote}</small>
        </div>
        <div className="comparison-card">
          <span>Gifting recommendation</span>
          <strong>{gifting.recommendation.split(".")[0]}</strong>
          <small>{gifting.lifetimeGiftingNote}</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — Which gifting strategy has NO dollar limit?</div>
      <DecisionButtons
        options={q1Options}
        correctId="direct-payment"
        onDecision={onDecision}
        context="Correct. Payments made DIRECTLY to educational institutions or medical providers are excluded from gift tax with no dollar limit under IRC §2503(e). This is completely separate from the $18,000 annual exclusion — a grandparent can pay a grandchild's $80,000 tuition directly AND still give them $18,000 in cash in the same year. The payments must go directly to the institution, not through the beneficiary."
      />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Appreciated Asset Strategy: What maximizes after-tax wealth transfer?</div>
      <div className="comparison-grid">
        {q2Options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              q2Sel === opt.id
                ? opt.id === "step-up" ? "decision-correct" : "decision-wrong"
                : q2Sel && opt.id === "step-up" ? "decision-correct" : ""
            }`}
            onClick={() => handleQ2(opt.id)}
            disabled={!!q2Result}
          >
            <span>Strategy</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {q2Result && (
        <div className={`portfolio-summary-card ${q2Result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{q2Result.correct ? "✓ Correct" : "✗ Review needed"}</span>
          <strong>{q2Result.correct ? `+${q2Result.points} pts` : `${q2Result.points} pts`}</strong>
          <small>{q2Result.feedback}</small>
        </div>
      )}
    </div>
  );
}

// ─── Basis Planning Game ──────────────────────────────────────────────────────
function BasisGame({ snapshot, onDecision, onNext }: { snapshot: EstatePlanningSnapshot; onDecision: (r: DecisionResult) => void; onNext?: () => void }) {
  const basis = snapshot.basisPlanning;
  const [q2Sel, setQ2Sel] = useState<string | null>(null);
  const [q2Result, setQ2Result] = useState<DecisionResult | null>(null);

  const q1Options = [
    {
      id: "ira-stepup",
      label: "Traditional IRA — gets a step-up in basis at death",
      description: "IRAs are IRD assets (Income in Respect of a Decedent) — NO step-up; beneficiary owes income tax on withdrawals"
    },
    {
      id: "stock-stepup",
      label: "Appreciated brokerage stock — gets a step-up in basis at death",
      description: "IRC §1014: FMV at date of death becomes new basis — built-in capital gain is permanently eliminated"
    },
    {
      id: "real-estate-stepup",
      label: "Rental real estate — gets a step-up in basis at death",
      description: "IRC §1014 applies to real property — accumulated depreciation and built-in gain are wiped out"
    },
    {
      id: "gifted-stock",
      label: "Stock gifted to the client by a parent — gets a step-up in basis",
      description: "Gifted assets carry the donor's basis (IRC §1015) — no step-up occurs on receipt of a gift during life"
    }
  ];

  const q2Options = [
    {
      id: "hold-ira",
      label: "Leave the IRA to a spouse — they can roll it over and defer taxes further",
      description: "True — a spousal rollover is the most tax-efficient IRA inheritance strategy"
    },
    {
      id: "10year",
      label: "Non-spouse beneficiaries must empty inherited IRAs within 10 years (SECURE Act)",
      description: "True — the stretch IRA was eliminated; most non-spouse beneficiaries face the 10-year rule"
    },
    {
      id: "roth-ird",
      label: "Roth IRA beneficiaries also pay income tax on qualified distributions",
      description: "False — qualified Roth distributions are income-tax-free even for beneficiaries"
    },
    {
      id: "trust-ira",
      label: "Naming a trust as IRA beneficiary always provides better tax results",
      description: "False — trust-as-beneficiary is complex and often accelerates distributions unless structured carefully as a see-through trust"
    }
  ];

  function handleQ2(id: string) {
    if (q2Result) return;
    setQ2Sel(id);
    const correct = id === "hold-ira" || id === "10year";
    const res: DecisionResult = {
      correct,
      feedback: correct
        ? `Correct. Both are true statements. A spousal rollover is the gold standard for IRA inheritance — the surviving spouse can roll the account into their own IRA and defer RMDs to age 73. For non-spouse beneficiaries, the SECURE Act (2019) eliminated the stretch IRA — most must empty the account within 10 years, accelerating income tax recognition. Planning inherited IRAs requires careful coordination with the beneficiary's own tax bracket.`
        : `Incorrect. "${q2Options.find(o => o.id === id)?.label}" is a false statement. ${q2Options.find(o => o.id === id)?.description}.`,
      points: correct ? 20 : -10,
      label: q2Options.find(o => o.id === id)!.label
    };
    setQ2Result(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Step-up in basis (IRC §1014)</span>
          <strong>FMV resets at date of death</strong>
          <small>{basis.stepUpInBasisNote}</small>
        </div>
        <div className="comparison-card">
          <span>Gift carryover basis (IRC §1015)</span>
          <strong>Donor's basis carries to recipient</strong>
          <small>{basis.giftCarryoverBasisNote}</small>
        </div>
        <div className="comparison-card">
          <span>IRD assets — no step-up (IRC §691)</span>
          <strong>IRAs, 401(k)s, deferred compensation</strong>
          <small>{basis.incomeInRespectOfDecedentNote}</small>
        </div>
        <div className="comparison-card">
          <span>Basis planning recommendation</span>
          <strong>{basis.recommendation.split(".")[0]}</strong>
          <small>Hold high-gain taxable assets until death. Gift cash. Distribute IRD assets strategically to lower-bracket beneficiaries.</small>
        </div>
      </div>

      <div className="portfolio-section-title">Question 1 — Which asset gets a step-up in basis at death?</div>
      <DecisionButtons
        options={q1Options}
        correctId="stock-stepup"
        onDecision={onDecision}
        context="Correct. Appreciated stock in a brokerage account receives a step-up in basis to FMV at date of death under IRC §1014, permanently eliminating the built-in capital gain. IRAs do NOT get a step-up — they are IRD assets subject to income tax on withdrawal. Real estate also gets a step-up, but rental property depreciation recapture is still owed on sale. Gifted stock carries the donor's basis — no step-up on receipt of a gift during life."
      />

      <div className="portfolio-section-title" style={{ marginTop: 24 }}>Question 2 — Inherited IRA Rules: Which statement is TRUE?</div>
      <div className="comparison-grid">
        {q2Options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              q2Sel === opt.id
                ? (opt.id === "hold-ira" || opt.id === "10year") ? "decision-correct" : "decision-wrong"
                : q2Sel && (opt.id === "hold-ira" || opt.id === "10year") ? "decision-correct" : ""
            }`}
            onClick={() => handleQ2(opt.id)}
            disabled={!!q2Result}
          >
            <span>Statement</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {q2Result && (
        <div className={`portfolio-summary-card ${q2Result.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{q2Result.correct ? "✓ Correct" : "✗ Review needed"}</span>
          <strong>{q2Result.correct ? `+${q2Result.points} pts` : `${q2Result.points} pts`}</strong>
          <small>{q2Result.feedback}</small>
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function EstatePlanningPanel({ onTelemetryChange, assignedDifficulty = "trainee" }: EstatePlanningPanelProps) {
  const activeClient = useSelectedClient();
  const tickers = useGameStore(state => state.tickers);
  const [activeTab, setActiveTab] = useState<EstateTab>("exposure");

  const totalAum = activeClient
    ? activeClient.cash + Object.values(activeClient.holdings).reduce(
        (sum, h) => sum + (tickers[h.ticker]?.price ?? 0) * h.shares, 0
      )
    : 0;

  const notif = useClientQuestionNotification("estate-planning", assignedDifficulty, onTelemetryChange ?? (() => undefined));

  const snapshot = useMemo(
    () => activeClient ? buildEstatePlanningSnapshot(activeClient, totalAum) : null,
    [activeClient, totalAum]
  );

  function handleDecision(_result: DecisionResult) {
    notif.queueNextQuestion(true);
  }

  function drawNextEstateQuestion() {
    notif.queueNextQuestion(true);
  }

  if (!activeClient || !snapshot) {
    return (
      <section className="panel">
        <div className="empty-state">Select a client to begin estate planning analysis.</div>
      </section>
    );
  }

  const tabs: { id: EstateTab; label: string }[] = [
    { id: "exposure", label: "Exposure" },
    { id: "documents", label: "Documents" },
    { id: "trusts", label: "Trusts" },
    { id: "gifting", label: "Gifting" },
    { id: "basis", label: "Basis Planning" }
  ];

  return (
    <section className="panel">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <div className="panel-header">
        <h2>Estate Planning</h2>
        <span className="panel-meta">
          {activeClient.name} | Estate planning
        </span><ClientQuestionBell state={notif.state} onOpen={notif.openNotification} />
      </div>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} type="button" className={activeTab === t.id ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "exposure" && <ExposureGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextEstateQuestion} />}
      {activeTab === "documents" && <DocumentGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextEstateQuestion} />}
      {activeTab === "trusts" && <TrustGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextEstateQuestion} />}
      {activeTab === "gifting" && <GiftingGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextEstateQuestion} />}
      {activeTab === "basis" && <BasisGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextEstateQuestion} />}
    </section>
  );
}
