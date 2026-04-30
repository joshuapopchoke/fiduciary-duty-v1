import { useMemo, useState } from "react";
import { useSelectedClient, useGameStore } from "../store/gameStore";
import { IncomeTaxCalculatorPanel } from "./IncomeTaxCalculatorPanel";
import {
  buildTaxPlanningSnapshot,
  TAX_BRACKETS_2024,
  CONTRIBUTION_LIMITS_2024,
  type TaxPlanningSnapshot
} from "../engine/taxPlanningEngine";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface TaxPlanningPanelProps {
  assignedDifficulty?: string;
  onTelemetryChange?: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

type TaxTab = "bracket" | "calculator" | "roth" | "rmd" | "harvesting" | "location" | "charitable";

type DecisionResult = {
  correct: boolean;
  feedback: string;
  points: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

// ─── Roth Conversion Decision Game ───────────────────────────────────────────
function RothConversionGame({
  snapshot,
  onDecision,
  onNext
}: {
  snapshot: TaxPlanningSnapshot;
  onDecision: (result: DecisionResult) => void;
  onNext?: () => void;
}) {
  const roth = snapshot.rothConversion;
  const bracket = snapshot.bracketAnalysis;
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  if (!roth) {
    return (
      <div className="comparison-card">
        <span>Roth Conversion</span>
        <strong>Not applicable</strong>
        <small>This client is not in a distribution phase where Roth conversion analysis applies.</small>
      </div>
    );
  }

  const options = [
    {
      id: "convert-now",
      label: `Convert $${roth.conversionAmount.toLocaleString()} this year`,
      description: `Pay $${roth.taxCostAtMarginal.toLocaleString()} in tax now at ${formatPct(roth.marginalRateApplied)} marginal rate`
    },
    {
      id: "wait",
      label: "Wait — conversion cost is too high in this bracket",
      description: "Delay conversion until a lower-income year"
    },
    {
      id: "partial",
      label: "Convert only enough to fill the current bracket",
      description: "Top off the current tax bracket without crossing into a higher one"
    },
    {
      id: "none",
      label: "Never convert — traditional IRA is always better",
      description: "Keep all funds in tax-deferred accounts permanently"
    }
  ];

  // Correct answer depends on bracket
  const correctId = bracket.marginalRate <= 0.22
    ? "convert-now"
    : bracket.marginalRate <= 0.24
      ? "partial"
      : "wait";

  const feedbackMap: Record<string, string> = {
    "convert-now": bracket.marginalRate <= 0.22
      ? `Correct. At a ${formatPct(bracket.marginalRate)} marginal rate, Roth conversion is highly efficient. The ${roth.breakEvenYears}-year break-even is achievable for most clients with a long planning horizon.`
      : `Caution — at ${formatPct(bracket.marginalRate)}, converting the full amount may push income into the next bracket. Partial conversion filling the current bracket is usually more precise.`,
    "wait": bracket.marginalRate >= 0.32
      ? `Correct. At ${formatPct(bracket.marginalRate)}, Roth conversion is expensive. Deferring to a lower-income year (retirement, career transition) will produce a better after-tax result.`
      : `Not optimal. At ${formatPct(bracket.marginalRate)}, the conversion math can still work — especially if the client expects higher rates in retirement. Conversion sizing matters more than avoidance.`,
    "partial": bracket.marginalRate >= 0.22 && bracket.marginalRate <= 0.32
      ? `Correct. Topping off the current bracket without crossing into the next is the most precise conversion strategy. It reduces future RMD pressure while managing today's tax cost.`
      : `Partial conversion is a valid strategy but not the strongest choice at this bracket. Review the break-even analysis against the client's retirement income expectations.`,
    "none": `Incorrect. 'Never convert' is not a sound planning position. Roth conversion is a core tax diversification tool — its value depends on bracket timing, not blanket avoidance. IRC §408A permits conversions at any age.`
  };

  function handleSelect(id: string) {
    if (result) return;
    setSelected(id);
    const correct = id === correctId;
    const res: DecisionResult = {
      correct,
      feedback: feedbackMap[id] ?? "",
      points: correct ? 1 : 0
    };
    setResult(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">Roth Conversion Decision</div>
      <div className="portfolio-summary-card">
        <span>Client tax situation</span>
        <strong>MAGI ~{formatCurrency(bracket.estimatedMagi)} | Marginal rate: {formatPct(bracket.marginalRate)}</strong>
        <small>LTCG rate: {formatPct(bracket.ltcgRate)} | NIIT applies: {bracket.niitApplies ? "Yes" : "No"} | {bracket.bracketLabel}</small>
      </div>
      <div className="portfolio-summary-card">
        <span>Proposed conversion</span>
        <strong>{formatCurrency(roth.conversionAmount)} → projected 10-yr tax-free value: {formatCurrency(roth.tenYearGrowthProjection)}</strong>
        <small>Tax cost at marginal rate: {formatCurrency(roth.taxCostAtMarginal)} | Break-even: ~{roth.breakEvenYears} years</small>
      </div>
      <div className="comparison-grid">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              selected === opt.id
                ? opt.id === correctId
                  ? "decision-correct"
                  : "decision-wrong"
                : selected && opt.id === correctId
                  ? "decision-correct"
                  : ""
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
          <small style={{ marginTop: 4 }}>{roth.caveat}</small>
        </div>
      )}
      {result && onNext && (
        <div className="slot-actions"><button type="button" className="primary-btn manager-inline-btn" onClick={onNext}>Next Topic →</button></div>
      )}
    </div>
  );
}

// ─── Asset Location Game ──────────────────────────────────────────────────────
function AssetLocationGame({
  snapshot,
  onDecision,
  onNext
}: {
  snapshot: TaxPlanningSnapshot;
  onDecision: (result: DecisionResult) => void;
  onNext?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions: { asset: string; correct: "taxable" | "deferred" | "roth"; rationale: string }[] = [
    {
      asset: "Taxable bond fund (pays ordinary income)",
      correct: "deferred",
      rationale: "Ordinary income from bonds is taxed at the highest rates. Tax-deferred accounts shelter this income from current taxation."
    },
    {
      asset: "Broad S&P 500 index ETF (low turnover, qualified dividends)",
      correct: "taxable",
      rationale: "Low-turnover equity index funds generate mostly qualified dividends and long-term gains — both taxed at preferential rates — making them highly tax-efficient in a taxable account."
    },
    {
      asset: "High-growth tech stock with no dividend",
      correct: "roth",
      rationale: "The highest-growth assets with no current income belong in the Roth IRA to maximize tax-free compounding. Significant appreciation is best sheltered in a Roth."
    },
    {
      asset: "REIT fund (distributes ordinary income)",
      correct: "deferred",
      rationale: "REIT distributions are ordinary income (IRC §857). They belong in a tax-deferred account to avoid current taxation on distributions."
    }
  ];

  function handleSubmit() {
    if (submitted) return;
    const correct = questions.filter(q => answers[q.asset] === q.correct).length;
    const total = questions.length;
    const pct = correct / total;
    const res: DecisionResult = {
      correct: pct >= 0.75,
      feedback: `${correct}/${total} correct placements. ${pct === 1 ? "Perfect asset location." : pct >= 0.75 ? "Solid understanding of asset location principles." : "Review the asset location rationale below — the taxable/deferred/Roth decision materially affects after-tax returns."}`,
      points: Math.round(pct * 20)
    };
    setSubmitted(true);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">Asset Location Challenge</div>
      <div className="portfolio-summary-card">
        <span>Instruction</span>
        <strong>Place each asset in its most tax-efficient account type</strong>
        <small>Taxable brokerage | Tax-Deferred (IRA/401k) | Roth IRA</small>
      </div>
      {questions.map(q => (
        <div key={q.asset} className="portfolio-summary-card">
          <span>Where does this go?</span>
          <strong>{q.asset}</strong>
          <div className="tabs" style={{ marginTop: 8 }}>
            {(["taxable", "deferred", "roth"] as const).map(acct => (
              <button
                key={acct}
                type="button"
                className={`tab-btn ${answers[q.asset] === acct ? "active" : ""} ${
                  submitted
                    ? acct === q.correct
                      ? "decision-correct"
                      : answers[q.asset] === acct && acct !== q.correct
                        ? "decision-wrong"
                        : ""
                    : ""
                }`}
                onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.asset]: acct }))}
                disabled={submitted}
              >
                {acct === "taxable" ? "Taxable" : acct === "deferred" ? "Tax-Deferred" : "Roth IRA"}
              </button>
            ))}
          </div>
          {submitted && (
            <small style={{ marginTop: 4, color: answers[q.asset] === q.correct ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
              {q.rationale}
            </small>
          )}
        </div>
      ))}
      {!submitted && Object.keys(answers).length === questions.length && (
        <div className="slot-actions">
          <button type="button" className="primary-btn manager-inline-btn" onClick={handleSubmit}>
            Submit Placements
          </button>
        </div>
      )}
    </div>
  );
}

// ─── RMD Decision Game ────────────────────────────────────────────────────────
function RmdGame({
  snapshot,
  onDecision,
  onNext
}: {
  snapshot: TaxPlanningSnapshot;
  onDecision: (result: DecisionResult) => void;
  onNext?: () => void;
}) {
  const rmd = snapshot.rmdAnalysis;
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);

  if (!rmd.applicable) {
    return (
      <div className="portfolio-summary-card">
        <span>RMD Status</span>
        <strong>Not yet applicable</strong>
        <small>{rmd.recommendation}</small>
      </div>
    );
  }

  const options = [
    {
      id: "take-rmd",
      label: "Take the full RMD as a taxable distribution",
      description: `${formatCurrency(rmd.estimatedRmd)} taxable as ordinary income`
    },
    {
      id: "qcd",
      label: rmd.qcdEligible ? "Satisfy the RMD via a Qualified Charitable Distribution (QCD)" : "No — QCD not available at this age",
      description: rmd.qcdEligible
        ? `Up to ${formatCurrency(rmd.qcdLimit)} directly to charity — excludes amount from income`
        : "QCD requires age 70½ or older (IRC §408(d)(8))"
    },
    {
      id: "skip",
      label: "Skip the RMD — it's optional",
      description: "Take no distribution this year"
    },
    {
      id: "reinvest",
      label: "Take the RMD and reinvest it in the same IRA",
      description: "Immediately roll back into the same account"
    }
  ];

  const correctId = rmd.qcdEligible ? "qcd" : "take-rmd";

  const feedbackMap: Record<string, string> = {
    "take-rmd": rmd.qcdEligible
      ? `Acceptable but not optimal. The client is QCD-eligible — directing up to ${formatCurrency(rmd.qcdLimit)} to charity via QCD excludes the amount from gross income entirely, which is more tax-efficient than taking the RMD as income and donating the after-tax proceeds.`
      : `Correct. The full RMD must be taken and reported as ordinary income. The estimated annual RMD is ${formatCurrency(rmd.estimatedRmd)}.`,
    "qcd": rmd.qcdEligible
      ? `Correct. A QCD is the most tax-efficient way to satisfy an RMD for a charitable client — the amount is excluded from gross income entirely under IRC §408(d)(8). Maximum $${rmd.qcdLimit.toLocaleString()} per year in 2024 (indexed for inflation per SECURE 2.0).`
      : `Incorrect. The client is not yet 70½ — QCDs require age 70½ or older (IRC §408(d)(8)). The full RMD must be taken as a taxable distribution.`,
    "skip": `Incorrect. RMDs are mandatory under IRC §401(a)(9). Missing an RMD triggers a 25% excise tax on the missed amount (reduced to 10% if corrected promptly per SECURE 2.0 §302). RMDs cannot be skipped.`,
    "reinvest": `Incorrect. You cannot roll an RMD back into an IRA — RMD amounts are specifically excluded from rollover eligibility under IRC §408(d)(3). The RMD must be distributed and cannot be returned to the IRA.`
  };

  function handleSelect(id: string) {
    if (result) return;
    if (!rmd.qcdEligible && id === "qcd") return;
    setSelected(id);
    const correct = id === correctId;
    const res: DecisionResult = {
      correct,
      feedback: feedbackMap[id] ?? "",
      points: correct ? 1 : 0
    };
    setResult(res);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">RMD Strategy Decision</div>
      <div className="portfolio-summary-card">
        <span>RMD Summary</span>
        <strong>Estimated annual RMD: {formatCurrency(rmd.estimatedRmd)} | Rate: {formatPct(rmd.rmdRate)}</strong>
        <small>Started at age {rmd.startAge} per SECURE 2.0 | Taxable as ordinary income | QCD eligible: {rmd.qcdEligible ? `Yes (up to ${formatCurrency(rmd.qcdLimit)})` : "No — under age 70½"}</small>
      </div>
      <div className="comparison-grid">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              selected === opt.id
                ? opt.id === correctId ? "decision-correct" : "decision-wrong"
                : selected && opt.id === correctId ? "decision-correct" : ""
            } ${!rmd.qcdEligible && opt.id === "qcd" ? "decision-btn--disabled" : ""}`}
            onClick={() => handleSelect(opt.id)}
            disabled={!!result || (!rmd.qcdEligible && opt.id === "qcd")}
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
        <div className="slot-actions"><button type="button" className="primary-btn manager-inline-btn" onClick={onNext}>Next Topic →</button></div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function TaxPlanningPanel({ onTelemetryChange, assignedDifficulty = "trainee" }: TaxPlanningPanelProps) {
  const activeClient = useSelectedClient();
  const tickers = useGameStore(state => state.tickers);
  const [activeTab, setActiveTab] = useState<TaxTab>("bracket");

  const totalAum = activeClient
    ? activeClient.cash + Object.values(activeClient.holdings).reduce(
        (sum, h) => sum + (tickers[h.ticker]?.price ?? 0) * h.shares, 0
      )
    : 0;

  const notif = useClientQuestionNotification("tax-planning", assignedDifficulty, onTelemetryChange ?? (() => undefined));

  const snapshot = useMemo(
    () => activeClient ? buildTaxPlanningSnapshot(activeClient, tickers, totalAum) : null,
    [activeClient, tickers, totalAum]
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
        <div className="empty-state">Select a client from the roster to begin tax planning analysis.</div>
      </section>
    );
  }

  const b = snapshot.bracketAnalysis;

  const tabs: { id: TaxTab; label: string }[] = [
    { id: "bracket", label: "Bracket" },
    { id: "calculator", label: "Income Tax Calculator" },
    { id: "roth", label: "Roth Conversion" },
    { id: "rmd", label: "RMDs" },
    { id: "harvesting", label: "Harvesting" },
    { id: "location", label: "Asset Location" },
    { id: "charitable", label: "Charitable" }
  ];

  return (
    <section className="panel">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <div className="panel-header">
        <h2>Tax Planning</h2>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span className="panel-meta">{activeClient.name} | {b.filingStatus === "mfj" ? "MFJ" : "Single"} | {formatPct(b.marginalRate)} marginal</span><ClientQuestionBell state={notif.state} onOpen={notif.openNotification} /></div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={activeTab === t.id ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bracket Tab */}
      {activeTab === "bracket" && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>Estimated MAGI</span>
            <strong>{formatCurrency(b.estimatedMagi)}</strong>
            <small>Based on annualized income</small>
          </div>
          <div className="comparison-card">
            <span>Marginal rate (ordinary)</span>
            <strong>{formatPct(b.marginalRate)}</strong>
            <small>Rate on the next dollar of ordinary income (IRC §1)</small>
          </div>
          <div className="comparison-card">
            <span>Effective rate</span>
            <strong>{formatPct(b.effectiveRate)}</strong>
            <small>Blended rate across all brackets</small>
          </div>
          <div className="comparison-card">
            <span>LTCG rate</span>
            <strong>{formatPct(b.ltcgRate)}</strong>
            <small>Long-term capital gains & qualified dividends (IRC §1(h))</small>
          </div>
          <div className="comparison-card">
            <span>NIIT (3.8%)</span>
            <strong>{b.niitApplies ? "Applies" : "Does not apply"}</strong>
            <small>IRC §1411 — threshold: $200K single / $250K MFJ</small>
          </div>
          <div className="comparison-card">
            <span>Combined gains rate</span>
            <strong>{formatPct(b.combinedGainsRate)}</strong>
            <small>LTCG + NIIT if applicable</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>Planning posture</span>
            <strong>{b.bracketLabel}</strong>
            <small>{snapshot.planningPriority}</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>⚠ Regulatory note</span>
            <strong>TCJA Sunset Warning</strong>
            <small>{snapshot.regulatoryNote}</small>
          </div>
        </div>
      )}

      {/* Income Tax Calculator Tab */}
      {activeTab === "calculator" && (
        <IncomeTaxCalculatorPanel />
      )}

      {/* Roth Conversion Tab */}
      {activeTab === "roth" && (
        <RothConversionGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />
      )}

      {/* RMD Tab */}
      {activeTab === "rmd" && (
        <RmdGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />
      )}

      {/* Tax-Loss Harvesting Tab */}
      {activeTab === "harvesting" && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>Unrealized gains</span>
            <strong>{formatCurrency(Math.max(0, snapshot.taxLossHarvesting.netUnrealizedPosition))}</strong>
            <small>Net taxable position across taxable sleeve</small>
          </div>
          <div className="comparison-card">
            <span>Harvestable losses</span>
            <strong>{formatCurrency(snapshot.taxLossHarvesting.harvestablelosses)}</strong>
            <small>Losses available to offset gains</small>
          </div>
          <div className="comparison-card">
            <span>Estimated tax saving</span>
            <strong>{formatCurrency(snapshot.taxLossHarvesting.estimatedTaxSaving)}</strong>
            <small>At combined gains rate of {formatPct(b.combinedGainsRate)}</small>
          </div>
          <div className="comparison-card">
            <span>Annual ordinary income offset cap</span>
            <strong>{formatCurrency(snapshot.taxLossHarvesting.annualOrdinaryOffsetMax)}</strong>
            <small>IRC §1211(b) — $3,000/yr cap on ordinary income offset; excess carries forward</small>
          </div>
          <div className="comparison-card">
            <span>Wash-sale warning</span>
            <strong>{snapshot.taxLossHarvesting.washSaleWarning ? "⚠ Monitor carefully" : "Not triggered"}</strong>
            <small>IRC §1091 — repurchasing same or substantially identical security within 30 days before or after the sale disallows the loss</small>
          </div>
          <div className="comparison-card">
            <span>Carryforward available</span>
            <strong>{snapshot.taxLossHarvesting.carryforwardAvailable ? "Yes — losses exceed gains" : "No — gains exceed losses"}</strong>
            <small>Excess losses carry forward indefinitely under IRC §1212</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>Recommendation</span>
            <strong>Harvesting guidance</strong>
            <small>{snapshot.taxLossHarvesting.recommendation}</small>
          </div>
        </div>
      )}

      {/* Asset Location Tab */}
      {activeTab === "location" && (
        <AssetLocationGame snapshot={snapshot} onDecision={handleDecision} onNext={drawNextClientQuestion} />
      )}

      {/* Charitable Giving Tab */}
      {activeTab === "charitable" && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>QCD eligible</span>
            <strong>{snapshot.charitableGiving.qcdEligible ? `Yes — age 70½+ (limit: ${formatCurrency(snapshot.charitableGiving.qcdAnnualLimit)}/yr)` : "No — must be age 70½ or older"}</strong>
            <small>IRC §408(d)(8) — QCDs satisfy RMDs and exclude the amount from gross income</small>
          </div>
          <div className="comparison-card">
            <span>Appreciated stock giving</span>
            <strong>Avoids capital gains entirely</strong>
            <small>{snapshot.charitableGiving.appreciatedStockBenefit}</small>
          </div>
          <div className="comparison-card">
            <span>Donor-Advised Fund (DAF)</span>
            <strong>Bunching strategy</strong>
            <small>{snapshot.charitableGiving.dafNote}</small>
          </div>
          <div className="comparison-card">
            <span>Charitable Remainder Trust (CRT)</span>
            <strong>Income + charitable deduction</strong>
            <small>{snapshot.charitableGiving.crtNote}</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>2024 Annual gift exclusion</span>
            <strong>{formatCurrency(CONTRIBUTION_LIMITS_2024.GIFT_ANNUAL)} per donee</strong>
            <small>IRC §2503(b) — unlimited direct tuition and medical payments under IRC §2503(e) are completely gift-tax free and do not count against this limit</small>
          </div>
        </div>
      )}
    </section>
  );
}
