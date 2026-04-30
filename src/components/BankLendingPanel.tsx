import { useMemo, useState } from "react";
import { buildBankLendingWorkflowScenarios } from "../data/bankLendingScenarios";
import { useSelectedClient } from "../store/gameStore";
import { buildBankLendingSnapshot, buildLendingDecisionMatrixSnapshot } from "../engine/creditLendingEngine";
import { LENDING_PROGRAMS } from "../data/loanPrograms";
import type { AssignmentProgressSnapshot, ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface BankLendingPanelProps {
  assignment: AssignmentProgressSnapshot;
  assignedDifficulty?: string;
  onTelemetryChange?: (telemetry: { score: number; scoreCards: ModuleScoreCard[]; answeredCount: number }) => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getCreditExpectation(score: number) {
  if (score >= 800) return { label: "Exceptional", range: "800-850", approval: "Strong approval lane" };
  if (score >= 740) return { label: "Very good", range: "740-799", approval: "Approval likely if capacity holds" };
  if (score >= 670) return { label: "Good", range: "670-739", approval: "Conditional approval common" };
  if (score >= 580) return { label: "Fair", range: "580-669", approval: "Conditions or decline depending on DTI" };
  if (score >= 300) return { label: "Poor", range: "300-579", approval: "Decline or repair path" };
  return { label: "Thin file", range: "No usable score", approval: "Manual review required" };
}

function deriveLendingDecision(
  score: number,
  debtServiceRatio: number,
  reserveMonths: number,
  recentLatePayments: number
) {
  if (score >= 740 && debtServiceRatio <= 36 && reserveMonths >= 5 && recentLatePayments === 0) {
    return "approve";
  }
  if (score < 580 || debtServiceRatio >= 50 || recentLatePayments >= 3) {
    return "decline";
  }
  if (score >= 680 && debtServiceRatio <= 43 && reserveMonths >= 3 && recentLatePayments <= 1) {
    return "conditional";
  }
  if (score >= 620 && debtServiceRatio <= 40 && reserveMonths >= 4 && recentLatePayments <= 1) {
    return "conditional";
  }
  return "decline";
}

const CREDIT_SCORE_LADDER = [
  { range: "800-850", label: "Exceptional", decision: "Approve when capacity and docs are clean" },
  { range: "740-799", label: "Very good", decision: "Approve or light conditions" },
  { range: "670-739", label: "Good", decision: "Conditional approval is common" },
  { range: "580-669", label: "Fair", decision: "Conditions, smaller amount, or decline" },
  { range: "300-579", label: "Poor", decision: "Decline with a repair path" }
];

function bankLendingFile(clientId: string) {
  const files: Record<string, { score: number | null; band: string; posture: string; business: boolean }> = {
    retiree: { score: 641, band: "Fair", posture: "Conditional only. Repayment depends on documented income, reserves, and smaller debt service.", business: false },
    young_pro: { score: 586, band: "Fair", posture: "High-friction file. Decline or condition on utilization cleanup, proof of income, and lower requested amount.", business: false },
    family: { score: 692, band: "Good", posture: "Conditional approval lane. Verify household DTI, reserves after funding, and repayment durability.", business: false },
    first_home_family: { score: 622, band: "Fair", posture: "First-home borrower with conditions. Protect reserves and keep payment inside ability-to-repay limits.", business: false },
    entrepreneur: { score: 711, band: "Good", posture: "Owner-guarantor review. Personal credit helps, but business cash-flow coverage and collateral drive approval.", business: false },
    institutional: { score: null, band: "Business grade A-", posture: "Commercial lending file. Underwrite DSCR, liquidity runway, collateral quality, covenants, and governance rather than consumer FICO.", business: true }
  };

  return files[clientId] ?? null;
}

export function BankLendingPanel({ assignment, onTelemetryChange, assignedDifficulty = "trainee" }: BankLendingPanelProps) {
  const activeClient = useSelectedClient();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("consumer-underwriting");
  const notif = useClientQuestionNotification("bank-lending", assignedDifficulty, onTelemetryChange ?? (() => undefined));
  const [lendingDecisions, setLendingDecisions] = useState<{ clientId: string; decision: string; correct: boolean; points: number }[]>([]);
  const lendingSnapshot = activeClient ? buildBankLendingSnapshot(activeClient) : null;
  const decisionMatrix = activeClient ? buildLendingDecisionMatrixSnapshot(activeClient) : null;
  const workflowScenarios = useMemo(
    () => activeClient ? buildBankLendingWorkflowScenarios(activeClient) : [],
    [activeClient]
  );
  const selectedWorkflow = workflowScenarios.find((scenario) => scenario.id === selectedWorkflowId) ?? workflowScenarios[0] ?? null;
  const relevantPrograms = activeClient
    ? LENDING_PROGRAMS.filter((program) => {
        if (program.category === "Mortgage") {
          return activeClient.lendingProfile.underwritingTrack === "Mortgage";
        }
        if (program.category === "Small Business" || program.category === "Commercial") {
          return activeClient.lendingProfile.underwritingTrack === "Private Wealth" || activeClient.lendingProfile.businessCashFlowCoverage !== null;
        }
        if (program.category === "Public / Institutional") {
          return activeClient.lendingProfile.underwritingTrack === "Institutional";
        }
        return true;
      }).slice(0, 7)
    : [];

  if (!activeClient) {
    return <section className="panel"><div className="empty-state">Select a client to review lending-style underwriting signals.</div></section>;
  }

  function handleLendingDecision(decision: string) {
    if (!activeClient) return;
    if (lendingDecisions.find(d => d.clientId === activeClient.id)) return; // already decided this client

    const recommended = displayedDecision;

    const correct = decision === recommended;
    const points = correct ? 25 : -15;

    const next = [...lendingDecisions, { clientId: activeClient.id, decision, correct, points }];
    setLendingDecisions(next);

    if (onTelemetryChange) {
      const netScore = Math.max(0, Math.min(100, 100 + next.reduce((s, d) => s + (d.correct ? 25 : -15), 0)));
      onTelemetryChange({
        score: netScore,
        scoreCards: [
          { label: "Repayment capacity", score: netScore },
          { label: "Underwriting controls", score: Math.max(0, Math.round(netScore * 0.95)) },
          { label: "Credit decision discipline", score: Math.max(0, Math.round(netScore * 0.98)) }
        ],
        answeredCount: next.length
      });
    }
  }

  const currentDecision = lendingDecisions.find(d => d.clientId === activeClient.id) ?? null;
  const monthlyDebt = activeClient.cashFlow.monthlyDebtPayments;
  const monthlyIncome = activeClient.cashFlow.monthlyIncome;
  const debtServiceRatio = monthlyIncome > 0 ? (monthlyDebt / monthlyIncome) * 100 : 0;
  const reserveMonths = monthlyIncome > 0
    ? activeClient.cash / Math.max(1, activeClient.cashFlow.monthlyExpenses + monthlyDebt)
    : activeClient.cashFlow.emergencyReserveMonths;
  const suggestedLoanCapacity = Math.max(0, monthlyIncome * 36 - monthlyDebt * 18);
  const lendingFile = bankLendingFile(activeClient.id);
  const decisionScore = lendingFile?.score ?? activeClient.creditProfile.score;
  const creditExpectation = lendingFile?.score === null
    ? { label: lendingFile.band, range: "Commercial file", approval: "Business underwriting lane" }
    : getCreditExpectation(decisionScore);
  const correctDecision = deriveLendingDecision(
    decisionScore,
    debtServiceRatio,
    reserveMonths,
    activeClient.lendingProfile.recentLatePayments
  );
  const displayedDecision = lendingFile?.business
    ? activeClient.lendingProfile.businessCashFlowCoverage !== null && activeClient.lendingProfile.businessCashFlowCoverage >= 1.25
      ? "conditional"
      : "decline"
    : correctDecision;

  return (
    <section className="panel">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <div className="panel-header">
        <h2>Bank Lending Review</h2>
        <span className="panel-meta">{activeClient.name} | {assignment.module.focus}</span><ClientQuestionBell state={notif.state} onOpen={notif.openNotification} />
      </div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>{lendingFile?.business ? "Business credit file" : "Credit file"}</span>
          <strong>{lendingFile?.score === null ? lendingFile.band : `${decisionScore} | ${creditExpectation.label}`}</strong>
          <small>{lendingFile?.business ? lendingFile.posture : `Range: ${creditExpectation.range} | ${activeClient.creditProfile.utilizationPct}% utilization | ${activeClient.creditProfile.recentInquiries} inquiries | ${activeClient.lendingProfile.recentLatePayments} recent late payments`}</small>
        </div>
        <div className="comparison-card">
          <span>{lendingFile?.business ? "Commercial expectation" : "Credit expectation"}</span>
          <strong>{creditExpectation.approval}</strong>
          <small>{lendingFile?.posture ?? `Decision model recommends ${displayedDecision === "approve" ? "Approve" : displayedDecision === "conditional" ? "Approve with Conditions" : "Decline"} after DTI, reserves, and payment history are considered.`}</small>
        </div>
        <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
          <span>Credit score ladder</span>
          <strong>Full underwriting range: 300-850</strong>
          <small>{CREDIT_SCORE_LADDER.map((band) => `${band.range} ${band.label}: ${band.decision}`).join(" | ")}</small>
        </div>
        <div className="comparison-card">
          <span>Debt-to-income lens</span>
          <strong>{debtServiceRatio.toFixed(0)}%</strong>
          <small>{formatCurrency(monthlyDebt)} monthly debt against {formatCurrency(monthlyIncome)} income.</small>
        </div>
        <div className="comparison-card">
          <span>Liquid reserve depth</span>
          <strong>{reserveMonths.toFixed(1)} months</strong>
          <small>{reserveMonths >= activeClient.cashFlow.emergencyReserveMonths ? "Reserve cushion supports repayment flexibility." : "Reserve cushion still looks thin for new lending."}</small>
        </div>
        <div className="comparison-card">
          <span>Credit and reserve support</span>
          <strong>{lendingSnapshot?.debtCoverageLabel ?? "Coverage pending"}</strong>
          <small>{lendingSnapshot?.reserveSupportLabel ?? "Reserve support pending"}</small>
        </div>
        <div className="comparison-card">
          <span>Indicative capacity</span>
          <strong>{formatCurrency(suggestedLoanCapacity)}</strong>
          <small>Simple affordability proxy before collateral, term, and full credit review are layered in.</small>
        </div>
        <div className="comparison-card">
          <span>Term structure</span>
          <strong>{decisionMatrix?.recommendation ?? "Decision pending"}</strong>
          <small>{decisionMatrix?.termLane ?? "Need a live borrower file to compare term structure."}</small>
        </div>
        <div className="comparison-card">
          <span>Collateral and docs</span>
          <strong>{decisionMatrix?.collateralLane ?? "Collateral review pending"}</strong>
          <small>{decisionMatrix?.documentationLane ?? "Documentation lane pending"}</small>
        </div>
        <div className="comparison-card">
          <span>Lender caution</span>
          <strong>{activeClient.productComparison.caution}</strong>
          <small>{lendingSnapshot?.riskSummary ?? activeClient.supervisionProfile.supervisionNote}</small>
        </div>
        <div className="comparison-card">
          <span>Relationship note</span>
          <strong>{activeClient.crmProfile.nextTask}</strong>
          <small>{lendingSnapshot?.nextBestAction ?? activeClient.description}</small>
        </div>
      </div>
      <div className="portfolio-section">
        <div className="portfolio-section-title">Decision Workflow Track</div>
        <div className="tabs">
          {workflowScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={selectedWorkflow?.id === scenario.id ? "tab-btn active" : "tab-btn"}
              onClick={() => setSelectedWorkflowId(scenario.id)}
            >
              {scenario.title}
            </button>
          ))}
        </div>
        {selectedWorkflow ? (
          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Workflow segment</span>
              <strong>{selectedWorkflow.segment}</strong>
              <small>{selectedWorkflow.summary}</small>
            </div>
            <div className="comparison-card">
              <span>Recommended decision</span>
              <strong>{selectedWorkflow.recommendedDecision}</strong>
              <small>{selectedWorkflow.rationale}</small>
            </div>
            <div className="comparison-card">
              <span>Remediation steps</span>
              <strong>{selectedWorkflow.recommendedDecision === "Approve" ? "Keep approval disciplined" : "Repair path required"}</strong>
              <small>{selectedWorkflow.remediationSteps.join(" ")}</small>
            </div>
            <div className="comparison-card">
              <span>Teaching angle</span>
              <strong>{selectedWorkflow.segment === "Business" ? "Cash-flow and collateral" : "Repayment and reserve durability"}</strong>
              <small>Use this track to train when to approve, when to condition, and when to decline without drifting into optimism bias.</small>
            </div>
          </div>
        ) : null}
      </div>
      <div className="portfolio-section">
        <div className="portfolio-section-title">Your Lending Decision</div>
        {!currentDecision ? (
          <div className="comparison-grid">
            {[
              { id: "approve", label: "Approve", description: "File meets underwriting criteria — approve for lending." },
              { id: "conditional", label: "Approve with Conditions", description: "File is borderline — approve subject to further documentation or requirements." },
              { id: "decline", label: "Decline", description: "File does not meet minimum lending criteria at this time." }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                className="comparison-card decision-btn"
                onClick={() => handleLendingDecision(opt.id)}
              >
                <span>Option</span>
                <strong>{opt.label}</strong>
                <small>{opt.description}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className={`comparison-grid`}>
            {[
              { id: "approve", label: "Approve", description: "File meets underwriting criteria — approve for lending." },
              { id: "conditional", label: "Approve with Conditions", description: "File is borderline — approve subject to further documentation or requirements." },
              { id: "decline", label: "Decline", description: "File does not meet minimum lending criteria at this time." }
            ].map(opt => (
              <div
                key={opt.id}
                className={`comparison-card ${
                  currentDecision.decision === opt.id
                    ? currentDecision.correct ? "decision-correct" : "decision-wrong"
                    : opt.id === displayedDecision && !currentDecision.correct ? "decision-correct" : ""
                }`}
              >
                <span>Option</span>
                <strong>{opt.label}</strong>
                <small>{opt.description}</small>
              </div>
            ))}
          </div>
        )}
        {currentDecision && (
          <div className={`portfolio-summary-card ${currentDecision.correct ? "decision-feedback-correct" : "decision-feedback-wrong"}`}>
            <span>{currentDecision.correct ? "✓ Correct decision" : "✗ Review needed"}</span>
            <strong>{currentDecision.correct ? `+${currentDecision.points} pts` : `${currentDecision.points} pts`}</strong>
            <small>
              {currentDecision.correct
                ? `Well-reasoned. The recommended decision for this file is ${displayedDecision}. Your underwriting judgment matches the file posture.`
                : `The correct decision for this file is ${displayedDecision}. Review the credit file, DTI, reserve depth, and collateral context before finalizing a decision.`}
            </small>
          </div>
        )}
      </div>
      <div className="portfolio-section">
        <div className="portfolio-section-title">Lending Program Coverage</div>
        <div className="comparison-grid">
          {relevantPrograms.map((program) => (
            <div key={program.id} className="comparison-card">
              <span>{program.source} | {program.category}</span>
              <strong>{program.name}</strong>
              <small>{program.useCase}</small>
              <small><strong>Best fit:</strong> {program.bestFit}</small>
              <small><strong>Caution:</strong> {program.caution}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
