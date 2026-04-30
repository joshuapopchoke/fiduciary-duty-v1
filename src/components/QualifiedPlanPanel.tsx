import { useMemo, useState } from "react";
import { useSelectedClient } from "../store/gameStore";
import {
  buildQualifiedPlanSnapshot,
  PLAN_LIMITS_2024,
  type QualifiedPlanSnapshot
} from "../engine/qualifiedPlanEngine";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface QualifiedPlanPanelProps {
  assignedDifficulty?: string;
  onTelemetryChange?: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

type PlanTab = "plans" | "contributions" | "rollover" | "erisa" | "design";

type DecisionResult = {
  correct: boolean;
  feedback: string;
  points: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ─── Plan Type Selection Game ─────────────────────────────────────────────────
function PlanTypeGame({
  snapshot,
  clientDescription,
  onDecision
}: {
  snapshot: QualifiedPlanSnapshot;
  clientDescription: string;
  onDecision: (result: DecisionResult) => void;
}) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [results, setResults] = useState<Record<number, DecisionResult>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});

  // All plan type scenarios
  const scenarios = [
    {
      id: "self-employed-high",
      prompt: "A self-employed consultant earns $300,000 per year and wants to maximize tax-deferred retirement savings with minimal administration.",
      correct: "SEP-IRA",
      options: [
        { id: "SEP-IRA", label: "SEP-IRA", description: `Up to ${formatCurrency(PLAN_LIMITS_2024.SEP_IRA_MAX)} or 25% of comp` },
        { id: "SIMPLE IRA", label: "SIMPLE IRA", description: `Up to ${formatCurrency(PLAN_LIMITS_2024.SIMPLE_IRA_DEFERRAL)} employee deferral` },
        { id: "401(k)", label: "401(k)", description: `Up to ${formatCurrency(PLAN_LIMITS_2024.DC_EMPLOYEE_DEFERRAL)} employee deferral` },
        { id: "Traditional IRA", label: "Traditional IRA only", description: `Up to ${formatCurrency(PLAN_LIMITS_2024.IRA_CONTRIBUTION)} per year` }
      ],
      rationale: `SEP-IRA allows contributions up to 25% of compensation or $${PLAN_LIMITS_2024.SEP_IRA_MAX.toLocaleString()} (2024), whichever is less. At $300,000 income that is $69,000 — far more than the SIMPLE IRA's $16,000 employee limit or a Traditional IRA's $7,000 cap. A Solo 401(k) could match the dollar amount but requires more administration. SEP-IRA wins on simplicity at this income level.`,
      wrongFeedback: {
        "SIMPLE IRA": "SIMPLE IRA caps employee deferrals at $16,000 — far below the $69,000 available through a SEP-IRA at this income. Use SIMPLE IRA for small businesses with employees, not for high-income self-employed individuals.",
        "401(k)": "A Solo 401(k) could reach similar dollar limits but requires annual Form 5500 filings and more administration. SEP-IRA achieves the same maximum with minimal paperwork for a sole proprietor.",
        "Traditional IRA": "A Traditional IRA's $7,000 limit (2024) is far below what a $300,000 earner can shelter. Deductibility also phases out at this income. Always maximize employer plan options first."
      }
    },
    {
      id: "nonprofit-employee",
      prompt: "A teacher at a public university wants to maximize tax-advantaged contributions. Her employer offers both a 403(b) and a 457(b). Can she contribute the maximum to both?",
      correct: "Yes — independent limits",
      options: [
        { id: "Yes — independent limits", label: "Yes — they have independent limits", description: "Each plan has its own separate deferral limit" },
        { id: "No — aggregate limit", label: "No — combined $23,000 cap", description: "Both plans share the same IRC §402(g) limit" },
        { id: "403b only", label: "Only the 403(b) is available to teachers", description: "457(b) is only for government employees" },
        { id: "Half and half", label: "Split $23,000 between both plans", description: "Must divide the single limit across plans" }
      ],
      rationale: "A governmental 457(b) has its own independent $23,000 limit (2024) that does NOT aggregate with a 403(b). A public university employee can contribute the maximum to BOTH — $46,000 in total employee deferrals, or $92,000 with age 50+ catch-up. This is one of the most powerful but overlooked planning strategies for government and nonprofit workers.",
      wrongFeedback: {
        "No — aggregate limit": "This is a common misconception. The 457(b) governmental plan limit is completely separate from the 403(b) limit under IRC §457(b). They do not aggregate. She can max both.",
        "403b only": "457(b) plans are available to both government employees AND select nonprofit executives. Public university employees qualify for both 403(b) and 457(b) plans simultaneously.",
        "Half and half": "There is no requirement to split a combined limit — because there is no combined limit. Each plan's $23,000 deferral is independent. She can contribute the full amount to each."
      }
    },
    {
      id: "small-business",
      prompt: "A small business owner has 8 employees and wants to offer a retirement plan with immediate vesting on employer contributions and no annual nondiscrimination testing.",
      correct: "Safe Harbor 401(k)",
      options: [
        { id: "Safe Harbor 401(k)", label: "Safe Harbor 401(k)", description: "Eliminates ADP testing; immediate vesting on employer contributions" },
        { id: "Traditional 401(k)", label: "Traditional 401(k)", description: "Full flexibility but annual ADP/ACP nondiscrimination testing required" },
        { id: "SEP-IRA", label: "SEP-IRA", description: "Simple to administer but employer-only contributions" },
        { id: "SIMPLE IRA", label: "SIMPLE IRA", description: "No testing required but lower contribution limits" }
      ],
      rationale: "A Safe Harbor 401(k) automatically satisfies the ADP/ACP nondiscrimination tests — letting highly compensated employees defer the full $23,000 without restriction. Employer Safe Harbor contributions vest immediately by law (3% nonelective or 4% match). SIMPLE IRA also avoids testing but caps employee deferrals at $16,000 vs $23,000. SEP-IRA only allows employer contributions, not employee deferrals.",
      wrongFeedback: {
        "Traditional 401(k)": "A traditional 401(k) requires annual ADP and ACP nondiscrimination testing, which is exactly what this owner wants to avoid. If HCEs contribute too much relative to NHCEs, the plan fails testing and corrections are required.",
        "SEP-IRA": "A SEP-IRA does not allow employee deferrals — only employer contributions. If employees want to contribute their own money, SEP-IRA cannot serve that purpose.",
        "SIMPLE IRA": "SIMPLE IRA avoids testing and has immediate vesting, but limits employee deferrals to $16,000 vs the Safe Harbor 401(k)'s $23,000. For a business wanting the highest contribution limits without testing, Safe Harbor wins."
      }
    },
    {
      id: "rmd-rules",
      prompt: "A 73-year-old client has a traditional IRA. She did NOT take her Required Minimum Distribution this year. What is the penalty?",
      correct: "25% excise tax on the shortfall",
      options: [
        { id: "25% excise tax on the shortfall", label: "25% excise tax on the missed amount", description: "SECURE 2.0 reduced the penalty from 50% to 25%" },
        { id: "50% excise tax on the shortfall", label: "50% excise tax on the missed amount", description: "Original ERISA penalty rate" },
        { id: "10% early withdrawal penalty", label: "10% early withdrawal penalty", description: "Same as a premature distribution" },
        { id: "No penalty if corrected", label: "No penalty — just take it next year", description: "RMD failures are automatically forgiven" }
      ],
      rationale: "SECURE 2.0 (2022) reduced the RMD failure excise tax from 50% to 25% for tax years beginning after December 29, 2022. It drops further to 10% if the missed RMD is corrected within a 2-year correction window. The 10% early withdrawal penalty does not apply — RMDs are not early distributions. Failures are never automatically forgiven.",
      wrongFeedback: {
        "50% excise tax on the shortfall": "This was the original penalty rate, but SECURE 2.0 reduced it to 25% effective for tax years after December 29, 2022. Know the current law — exam questions test the updated 25% rate.",
        "10% early withdrawal penalty": "The 10% penalty applies to premature distributions (before age 59½), not to missed RMDs. These are separate penalties under separate IRC sections.",
        "No penalty if corrected": "The IRS has historically granted penalty waivers when RMD failures are corrected quickly, but there is no automatic forgiveness. The 25% penalty (or 10% if corrected in 2 years) still applies unless the IRS waives it."
      }
    },
    {
      id: "vesting-schedule",
      prompt: "A 401(k) plan uses a 6-year graded vesting schedule. An employee who leaves after 4 years of service is what percent vested in employer contributions?",
      correct: "60%",
      options: [
        { id: "60%", label: "60% vested", description: "4 years on a 6-year graded schedule" },
        { id: "40%", label: "40% vested", description: "Proportional to years served" },
        { id: "100%", label: "100% vested", description: "All contributions vest immediately" },
        { id: "0%", label: "0% vested", description: "Cliff vesting — nothing until fully vested" }
      ],
      rationale: "IRC §411 graded vesting schedule: 20% per year starting at year 2. Year 2 = 20%, Year 3 = 40%, Year 4 = 60%, Year 5 = 80%, Year 6 = 100%. After 4 years of service the employee is 60% vested. Note: cliff vesting allows 0% until year 3, then 100% — a different schedule than graded. Safe Harbor contributions are always 100% immediately vested regardless of schedule.",
      wrongFeedback: {
        "40%": "This would be year 3 vesting (40%). On a 6-year graded schedule: Year 2=20%, Year 3=40%, Year 4=60%, Year 5=80%, Year 6=100%. Four years = 60%.",
        "100%": "100% vesting applies to Safe Harbor employer contributions or plans that chose immediate vesting. A standard 6-year graded schedule does not reach 100% until year 6.",
        "0%": "Zero vesting describes cliff vesting — where nothing vests until the cliff is reached. A 6-year graded schedule vests 20% per year starting at year 2, so 4 years = 60%."
      }
    }
  ];

  const scenario = scenarios[scenarioIndex];
  const currentResult = results[scenarioIndex] ?? null;
  const currentSelected = selected[scenarioIndex] ?? null;

  function handleSelect(id: string) {
    if (currentResult) return;
    const correct = id === scenario.correct;
    const wrongFeedback = scenario.wrongFeedback as Partial<Record<string, string>>;
    const feedback = correct
      ? scenario.rationale
      : wrongFeedback[id] ?? `Incorrect. The correct answer is: ${scenario.correct}. ${scenario.rationale}`;
    const res: DecisionResult = { correct, feedback, points: correct ? 1 : 0 };
    setSelected(prev => ({ ...prev, [scenarioIndex]: id }));
    setResults(prev => ({ ...prev, [scenarioIndex]: res }));
    onDecision(res);
  }

  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(r => r.correct).length;

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">
        Plan Selection — Scenario {scenarioIndex + 1} of {scenarios.length}
        {answeredCount > 0 && (
          <span style={{ marginLeft: 12, color: "var(--muted)", fontWeight: "normal" }}>
            {correctCount}/{answeredCount} correct
          </span>
        )}
      </div>
      <div className="portfolio-summary-card">
        <span>Scenario</span>
        <strong>{scenario.prompt}</strong>
        <small>Select the most appropriate answer</small>
      </div>
      <div className="comparison-grid">
        {scenario.options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              currentSelected === opt.id
                ? opt.id === scenario.correct ? "decision-correct" : "decision-wrong"
                : currentSelected && opt.id === scenario.correct ? "decision-correct" : ""
            }`}
            onClick={() => handleSelect(opt.id)}
            disabled={!!currentResult}
          >
            <span>Option</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {currentResult && (
        <div className={`portfolio-summary-card ${currentResult.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{currentResult.correct ? "✓ Correct" : `✗ Incorrect — Correct answer: ${scenario.correct}`}</span>
          <small>{currentResult.feedback}</small>
        </div>
      )}
      {currentResult && (
        <div className="slot-actions">
          {scenarioIndex < scenarios.length - 1 ? (
            <button type="button" className="primary-btn manager-inline-btn" onClick={() => setScenarioIndex(i => i + 1)}>
              Next Scenario →
            </button>
          ) : scenarioIndex > 0 ? (
            <button type="button" className="control-btn" onClick={() => setScenarioIndex(0)}>
              Restart from Scenario 1
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Rollover Decision Game ───────────────────────────────────────────────────
function RolloverGame({
  snapshot,
  onDecision
}: {
  snapshot: QualifiedPlanSnapshot;
  onDecision: (result: DecisionResult) => void;
}) {
  const rollover = snapshot.rolloverGuidance;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: "transfer-method",
      question: "A participant wants to roll their 401(k) to an IRA. Which method avoids mandatory 20% withholding?",
      options: [
        { id: "indirect", label: "Take a check payable to themselves, then deposit in 60 days" },
        { id: "direct", label: "Direct trustee-to-trustee transfer (plan to IRA)" }
      ],
      correct: "direct",
      rationale: rollover.withholding20PctRule
    },
    {
      id: "nua",
      question: "A participant has highly appreciated employer stock in their 401(k). What should be analyzed BEFORE rolling over?",
      options: [
        { id: "roll-immediately", label: "Roll everything to IRA immediately to simplify" },
        { id: "nua-analysis", label: "Analyze Net Unrealized Appreciation (NUA) treatment first" }
      ],
      correct: "nua-analysis",
      rationale: rollover.netUnrealizedAppreciation
    },
    {
      id: "inherited-ira",
      question: "Under SECURE Act (2019), most non-spouse beneficiaries of inherited IRAs must distribute the full balance by:",
      options: [
        { id: "5yr", label: "5 years" },
        { id: "10yr", label: "10 years" },
        { id: "stretch", label: "Over their own life expectancy (stretch IRA)" }
      ],
      correct: "10yr",
      rationale: rollover.iraToBeneficiaryNote
    }
  ];

  function handleSubmit() {
    if (submitted) return;
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    const total = questions.length;
    const res: DecisionResult = {
      correct: correct === total,
      feedback: `${correct}/${total} correct rollover decisions. ${correct === total ? "Strong rollover knowledge." : "Review each question below — correct answers are highlighted in green."}`,
      points: correct
    };
    setSubmitted(true);
    onDecision(res);
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">Rollover Decision Workshop</div>
      <div className="portfolio-summary-card">
        <span>Key rule</span>
        <strong>Direct rollovers eliminate the 20% withholding trap</strong>
        <small>{rollover.sixtyDayRolloverRisk}</small>
      </div>
      {questions.map(q => (
        <div key={q.id} className="portfolio-summary-card">
          <span>{q.question}</span>
          <div className="tabs" style={{ marginTop: 8, flexWrap: "wrap" }}>
            {q.options.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`tab-btn ${answers[q.id] === opt.id ? "active" : ""} ${
                  submitted
                    ? opt.id === q.correct ? "decision-correct"
                    : answers[q.id] === opt.id ? "decision-wrong" : ""
                    : ""
                }`}
                style={{ flex: "1 1 auto", textAlign: "left", padding: "6px 10px", fontSize: 12 }}
                onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                disabled={submitted}
              >
                {opt.label}
                {submitted && opt.id === q.correct ? " ✓" : ""}
                {submitted && answers[q.id] === opt.id && opt.id !== q.correct ? " ✗" : ""}
              </button>
            ))}
          </div>
          {submitted && (
            <small style={{ marginTop: 6 }}>{q.rationale}</small>
          )}
        </div>
      ))}
      {!submitted && Object.keys(answers).length === questions.length && (
        <div className="slot-actions">
          <button type="button" className="primary-btn manager-inline-btn" onClick={handleSubmit}>
            Evaluate Decisions
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ERISA Fiduciary Challenge ────────────────────────────────────────────────
function ErisaGame({
  snapshot,
  onDecision
}: {
  snapshot: QualifiedPlanSnapshot;
  onDecision: (result: DecisionResult) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<Record<number, { selected: string; correct: boolean; feedback: string }>>({});

  const questions = [
    {
      id: "primary-obligation",
      prompt: "You are a 401(k) plan fiduciary selecting the investment menu. What is your primary obligation under ERISA §404(a)?",
      correctId: "prudent-expert",
      options: [
        { id: "maximize-return", label: "Select the highest-returning investment available", description: "Maximize participant account balances" },
        { id: "prudent-expert", label: "Apply the prudent expert standard — diversify, monitor fees, document decisions", description: "ERISA §404(a)(1)(B) — care of a knowledgeable fiduciary" },
        { id: "conservative-only", label: "Use only government securities to protect participants", description: "Maximum safety, minimum return" },
        { id: "employer-benefit", label: "Select investments that also benefit the plan sponsor's business", description: "Win-win for employer and employees" }
      ],
      correctFeedback: "Correct. ERISA §404(a)(1)(B) requires fiduciaries to apply the care, skill, prudence, and diligence of a knowledgeable person in similar circumstances. This means diversifying assets, monitoring fees annually, documenting decisions, and maintaining an Investment Policy Statement.",
      wrongFeedback: {
        "maximize-return": "ERISA §404 does not require maximizing returns — it requires prudent, diversified investing appropriate for the plan's goals. Chasing returns without risk discipline violates the prudent expert standard.",
        "conservative-only": "ERISA requires appropriate diversification and a prudent risk/return balance. Investing only in government securities can itself be a breach of fiduciary duty if it fails to provide adequate growth for participants with long time horizons.",
        "employer-benefit": "ERISA §404(a)(1)(A) requires fiduciaries to act SOLELY in the interest of plan participants. Using plan assets to benefit the employer is a per se violation of the exclusive benefit rule — regardless of whether participants also benefit."
      }
    },
    {
      id: "prohibited-transaction",
      prompt: "A plan fiduciary wants to invest plan assets in real estate owned by the plan sponsor. This is best described as:",
      correctId: "prohibited-transaction",
      options: [
        { id: "prohibited-transaction", label: "A prohibited transaction under ERISA §406", description: "Self-dealing with plan assets is per se prohibited" },
        { id: "fine-with-disclosure", label: "Acceptable if disclosed to participants", description: "Transparency cures most fiduciary conflicts" },
        { id: "allowed-if-fair-value", label: "Allowed if the property is purchased at fair market value", description: "Fair pricing eliminates the conflict" },
        { id: "requires-vote", label: "Permitted with participant vote approval", description: "Democratic override of fiduciary rules" }
      ],
      correctFeedback: "Correct. ERISA §406 prohibits transactions between a plan and a party-in-interest (including the plan sponsor) unless a specific statutory or administrative exemption applies. Investing in sponsor-owned real estate is classic self-dealing — a per se prohibited transaction regardless of price or disclosure.",
      wrongFeedback: {
        "fine-with-disclosure": "Disclosure does not cure a prohibited transaction under ERISA. The prohibition exists to protect participants from fiduciaries who might prioritize their own interests — disclosure alone does not remove the conflict.",
        "allowed-if-fair-value": "Fair market value pricing is a required element of certain exemptions, but it does not independently make a party-in-interest transaction permissible. A formal exemption (PTE) from the DOL is required.",
        "requires-vote": "Participants cannot vote to authorize a prohibited transaction. ERISA's prohibited transaction rules are statutory obligations that cannot be waived by participant consent."
      }
    },
    {
      id: "fee-disclosure",
      prompt: "Under ERISA §408(b)(2), which party must provide fee disclosure to a 401(k) plan?",
      correctId: "service-provider",
      options: [
        { id: "service-provider", label: "Covered service providers (record-keepers, advisors, TPAs)", description: "Must disclose compensation and services to plan fiduciaries" },
        { id: "employer-only", label: "Only the plan sponsor/employer", description: "Employers are responsible for all plan disclosures" },
        { id: "participants-only", label: "Participants must request fee information", description: "Disclosure is on-demand only" },
        { id: "irs-filing", label: "The IRS via Form 5500 filing", description: "Fee disclosure is a tax reporting obligation" }
      ],
      correctFeedback: "Correct. ERISA §408(b)(2) requires covered service providers — including record-keepers, investment advisors, third-party administrators, and anyone receiving $1,000+ in direct or indirect compensation — to provide written fee and service disclosure to the plan fiduciary. This allows fiduciaries to assess whether compensation is reasonable.",
      wrongFeedback: {
        "employer-only": "The employer/plan sponsor is the RECIPIENT of §408(b)(2) disclosures, not the provider. It is the covered service providers (advisors, record-keepers, TPAs) who must provide the disclosure.",
        "participants-only": "Participant-level fee disclosure is governed by §404(a)(5), which requires annual disclosure to participants. §408(b)(2) is a separate obligation from service providers to the plan fiduciary — not participant-driven.",
        "irs-filing": "Form 5500 is an annual reporting document to the DOL and IRS. §408(b)(2) fee disclosure is a direct contractual/written requirement from service providers to plan fiduciaries — separate from any tax filing obligation."
      }
    },
    {
      id: "plan-termination",
      prompt: "When a defined benefit pension plan terminates and assets exceed liabilities, what happens to the surplus?",
      correctId: "revert-to-employer",
      options: [
        { id: "revert-to-employer", label: "Surplus reverts to the employer subject to a 50% excise tax", description: "IRC §4980 — employer reversion tax" },
        { id: "split-participants", label: "Surplus is split pro-rata among all participants", description: "Excess goes back to those who earned it" },
        { id: "stays-in-plan", label: "Surplus must stay in the plan indefinitely", description: "ERISA prohibits employer access to plan funds" },
        { id: "donated-charity", label: "Surplus must be donated to charity", description: "Unclaimed pension funds go to nonprofits" }
      ],
      correctFeedback: "Correct. Under IRC §4980, when a defined benefit plan terminates with assets exceeding liabilities, the surplus may revert to the employer — but is subject to a 50% excise tax (reduced to 20% if the employer maintains a qualified replacement plan or increases benefits). This is a significant tax cost that makes overfunding defined benefit plans expensive to unwind.",
      wrongFeedback: {
        "split-participants": "Participants receive their accrued benefit — no more, no less. The surplus belongs to the employer under the plan document, subject to the §4980 excise tax. ERISA does not require sharing the overfunding with participants.",
        "stays-in-plan": "ERISA does not prohibit employer access to surplus assets — it regulates it through the §4980 excise tax. Employers can access surplus on termination, they just pay a steep tax to do so.",
        "donated-charity": "There is no ERISA or IRC requirement to donate surplus to charity. The reversion-to-employer path with the §4980 excise tax is the standard treatment for overfunded terminated plans."
      }
    }
  ];

  const question = questions[questionIndex];
  const currentResult = results[questionIndex] ?? null;
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(r => r.correct).length;

  function handleSelect(id: string) {
    if (currentResult) return;
    const correct = id === question.correctId;
    const wrongFeedback = question.wrongFeedback as Partial<Record<string, string>>;
    const feedback = correct
      ? question.correctFeedback
      : wrongFeedback[id] ?? `Incorrect. The correct answer is highlighted above.`;
    setResults(prev => ({ ...prev, [questionIndex]: { selected: id, correct, feedback } }));
    onDecision({ correct, feedback, points: correct ? 1 : 0 });
  }

  return (
    <div className="portfolio-section">
      <div className="portfolio-section-title">
        ERISA Fiduciary — Question {questionIndex + 1} of {questions.length}
        {answeredCount > 0 && (
          <span style={{ marginLeft: 12, color: "var(--muted)", fontWeight: "normal" }}>
            {correctCount}/{answeredCount} correct
          </span>
        )}
      </div>
      <div className="portfolio-summary-card">
        <span>Question</span>
        <strong>{question.prompt}</strong>
        <small>ERISA §404(a) — prudent expert standard, exclusive benefit rule, prohibited transactions</small>
      </div>
      <div className="comparison-grid">
        {question.options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`comparison-card decision-btn ${
              currentResult?.selected === opt.id
                ? opt.id === question.correctId ? "decision-correct" : "decision-wrong"
                : currentResult && opt.id === question.correctId ? "decision-correct" : ""
            }`}
            onClick={() => handleSelect(opt.id)}
            disabled={!!currentResult}
          >
            <span>Approach</span>
            <strong>{opt.label}</strong>
            <small>{opt.description}</small>
          </button>
        ))}
      </div>
      {currentResult && (
        <div className={`portfolio-summary-card ${currentResult.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
          <span>{currentResult.correct ? "✓ Correct" : `✗ Incorrect — Correct: ${question.options.find(o => o.id === question.correctId)?.label}`}</span>
          <small>{currentResult.feedback}</small>
          <small style={{ marginTop: 4 }}>{snapshot.erfsaFiduciary.prohibitedTransactionNote}</small>
        </div>
      )}
      {currentResult && (
        <div className="slot-actions">
          {questionIndex < questions.length - 1 ? (
            <button type="button" className="primary-btn manager-inline-btn" onClick={() => setQuestionIndex(i => i + 1)}>
              Next Question →
            </button>
          ) : (
            <button type="button" className="control-btn" onClick={() => setQuestionIndex(0)}>
              Restart ERISA Questions
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function QualifiedPlanPanel({ onTelemetryChange, assignedDifficulty = "trainee" }: QualifiedPlanPanelProps) {
  const activeClient = useSelectedClient();
  const [activeTab, setActiveTab] = useState<PlanTab>("plans");

  const notif = useClientQuestionNotification("qualified-plans", assignedDifficulty, onTelemetryChange ?? (() => undefined));

  const snapshot = useMemo(
    () => activeClient ? buildQualifiedPlanSnapshot(activeClient) : null,
    [activeClient]
  );

  function handleDecision(_result: DecisionResult) {
    notif.queueNextQuestion(true);
  }

  if (!activeClient || !snapshot) {
    return (
      <section className="panel">
        <div className="empty-state">Select a client to begin qualified plan analysis.</div>
      </section>
    );
  }

  const contrib = snapshot.contributionMaximization;
  const tabs: { id: PlanTab; label: string }[] = [
    { id: "plans", label: "Plan Types" },
    { id: "contributions", label: "Contributions" },
    { id: "rollover", label: "Rollovers" },
    { id: "erisa", label: "ERISA" },
    { id: "design", label: "Plan Design" }
  ];

  return (
    <section className="panel">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <div className="panel-header">
        <h2>Qualified Plans</h2>
        <span className="panel-meta">{activeClient.name} | Qualified Plans &amp; ERISA</span><ClientQuestionBell state={notif.state} onOpen={notif.openNotification} />
      </div>
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

      {activeTab === "plans" && (
        <>
          <PlanTypeGame snapshot={snapshot} clientDescription={activeClient.description} onDecision={handleDecision} />
          <div className="portfolio-section">
            <div className="portfolio-section-title">Plan Type Reference (2024 Limits)</div>
            <div className="comparison-grid">
              {snapshot.planComparisons.map(plan => (
                <div key={plan.planType} className="comparison-card">
                  <span>{plan.planType}</span>
                  <strong>Employee max: {formatCurrency(plan.maxEmployeeContribution)}{plan.catchUpContribution > 0 ? ` (+${formatCurrency(plan.catchUpContribution)} catch-up)` : ""}</strong>
                  <small>Roth option: {plan.rothOption ? "Yes" : "No"} | Vesting: {plan.vestingApplies ? "Yes" : "Immediate"} | RMDs: {plan.rdmRequired ? "Required" : "No lifetime RMDs"}</small>
                  <small><strong>Best for:</strong> {plan.bestFor}</small>
                  <small><strong>Key rule:</strong> {plan.keyRule.split(" —")[0]}</small>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "contributions" && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>2024 employee deferral limit</span>
            <strong>{formatCurrency(contrib.employeeDeferralLimit)}</strong>
            <small>IRC §402(g)(1) — 401(k), 403(b), most 457 plans</small>
          </div>
          {contrib.catchUpAvailable && (
            <div className="comparison-card">
              <span>Catch-up contribution (age {contrib.currentAge})</span>
              <strong>+{formatCurrency(contrib.catchUpAmount)}</strong>
              <small>{contrib.currentAge && contrib.currentAge >= 60 && contrib.currentAge <= 63
                ? "SECURE 2.0 §109 enhanced catch-up at age 60-63 (2025+)"
                : "IRC §414(v) — age 50+ catch-up"}</small>
            </div>
          )}
          <div className="comparison-card">
            <span>Total maximum contribution</span>
            <strong>{formatCurrency(contrib.totalMaxContribution)}</strong>
            <small>Estimated annual tax saving: {formatCurrency(contrib.estimatedTaxSaving)}</small>
          </div>
          <div className="comparison-card">
            <span>Employer match</span>
            <strong>Capture first — always</strong>
            <small>{contrib.matchCapture}</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>Roth vs. Traditional</span>
            <strong>Bracket-dependent decision</strong>
            <small>{contrib.rothVsTraditionalNote}</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>Priority action</span>
            <strong>Optimization path</strong>
            <small>{snapshot.priorityAction}</small>
          </div>
        </div>
      )}

      {activeTab === "rollover" && <RolloverGame snapshot={snapshot} onDecision={handleDecision} />}
      {activeTab === "erisa" && <ErisaGame snapshot={snapshot} onDecision={handleDecision} />}

      {activeTab === "design" && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>Safe Harbor design</span>
            <strong>Eliminates ADP nondiscrimination testing</strong>
            <small>{snapshot.planDesign.safHarborNote}</small>
          </div>
          <div className="comparison-card">
            <span>Auto-enrollment (SECURE 2.0 §101)</span>
            <strong>Required for new plans after 12/29/2022</strong>
            <small>{snapshot.planDesign.autoEnrollmentNote}</small>
          </div>
          <div className="comparison-card">
            <span>Investment menu</span>
            <strong>Annual fiduciary review required</strong>
            <small>{snapshot.planDesign.investmentMenuNote}</small>
          </div>
          <div className="comparison-card">
            <span>Fee disclosure</span>
            <strong>ERISA §408(b)(2) + 404(a)(5)</strong>
            <small>{snapshot.planDesign.feeDisclosureNote}</small>
          </div>
          <div className="comparison-card">
            <span>Top-heavy rules (IRC §416)</span>
            <strong>3% minimum for non-key employees</strong>
            <small>{snapshot.planDesign.topHeavyNote}</small>
          </div>
          <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
            <span>Best practices recommendation</span>
            <strong>New plan design checklist</strong>
            <small>{snapshot.planDesign.recommendation}</small>
          </div>
        </div>
      )}
    </section>
  );
}
