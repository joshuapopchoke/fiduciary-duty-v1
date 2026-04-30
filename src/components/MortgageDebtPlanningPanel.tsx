import { useEffect, useMemo, useState } from "react";
import { MORTGAGE_LOAN_PROGRAMS } from "../data/loanPrograms";
import { getMortgageStateProfile } from "../data/mortgageStateProfiles";
import { buildMortgageTrainingScenarios } from "../data/mortgageTrainingScenarios";
import { buildMortgageProductComparisonSnapshot, buildMortgageScenarioSnapshot } from "../engine/creditLendingEngine";
import {
  buildDebtVsInvestCalculator,
  buildEducationFundingCalculator,
  buildMortgagePurchaseCalculator,
  buildMortgageRefiCalculator
} from "../engine/plannerCalculatorEngine";
import { useSelectedClient } from "../store/gameStore";
import type { AssignmentProgressSnapshot } from "../engine/trainingCurriculumEngine";
import { useClientQuestionNotification, ClientQuestionBell, ClientQuestionPopup } from "./ClientQuestionNotification";

interface MortgageDebtPlanningPanelProps {
  assignedDifficulty?: string;
  assignment: AssignmentProgressSnapshot;
}

type MortgageWorkspaceMode = "refinance" | "purchase";
type MortgageAdviceAction = "refinance" | "hold" | "purchase";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function buildScenarioDecisionGuide(
  scenarioId: string | null,
  activeClient: NonNullable<ReturnType<typeof useSelectedClient>>,
  relevantPrograms: typeof MORTGAGE_LOAN_PROGRAMS
) {
  const firstProgram = (programId: string) => relevantPrograms.find((program) => program.id === programId) ?? null;
  const purchaseProfile = activeClient.mortgagePurchaseProfile ?? null;
  const locationLabel = purchaseProfile ? `${purchaseProfile.city}, ${purchaseProfile.stateCode}` : activeClient.name;

  switch (scenarioId) {
    case "first-time-buyer": {
      const targetTooHigh =
        purchaseProfile !== null
        && purchaseProfile.targetPurchasePrice > purchaseProfile.maxComfortPurchasePrice;
      const recommendedProgram = targetTooHigh
        ? firstProgram("state-hfa")
          ?? firstProgram("local-dpa")
          ?? firstProgram("fha")
        : firstProgram("fha")
          ?? firstProgram("state-hfa")
          ?? firstProgram("conventional-fixed");
      return {
        prompt: purchaseProfile
          ? `What loan lane best fits ${activeClient.name} for a ${purchaseProfile.propertyType.toLowerCase()} purchase in ${locationLabel} with a target price near ${formatCurrency(purchaseProfile.targetPurchasePrice)}?`
          : `Which loan would be best for ${activeClient.name} based on this first-time buyer file?`,
        answer: targetTooHigh
          ? `${recommendedProgram?.name ?? "FHA / first-time-buyer assistance"} on a lower purchase price, not the current target home`
          : recommendedProgram?.name ?? "FHA or first-time-buyer assistance lane",
        rationale: targetTooHigh
          ? `The file is not just about approval. The current target home is priced above the family's comfort lane, so the training answer is to reset the home search or add more cash reserves rather than force a thin approval.`
          : activeClient.creditProfile.score < 720 || activeClient.mortgageProfile.closingCostSensitivity === "High"
            ? "This file points toward a first-time-buyer-friendly lane that protects cash to close and gives more flexibility on credit and reserves."
            : "This file can support a cleaner first-home lane, but only if reserves remain intact after closing."
      };
    }
    case "fha-vs-conventional": {
      const useFha = activeClient.creditProfile.score < 720 || activeClient.mortgageProfile.closingCostSensitivity === "High";
      const recommendedProgram = useFha ? firstProgram("fha") : firstProgram("conventional-fixed");
      return {
        prompt: `Should ${activeClient.name} be guided toward FHA or conventional financing?`,
        answer: recommendedProgram?.name ?? (useFha ? "FHA" : "Conventional Fixed"),
        rationale: useFha
          ? "FHA is the better starting lane here because it is more forgiving for a thinner file and helps protect liquidity."
          : "Conventional is the better lane when the borrower can support stronger pricing and cleaner long-run mortgage-insurance economics."
      };
    }
    case "investor-property": {
      const recommendedProgram = firstProgram("jumbo") ?? firstProgram("conventional-fixed");
      return {
        prompt: `What lending lane best fits ${activeClient.name}'s investor-property case?`,
        answer: recommendedProgram?.name ?? "Conditional investor-property lane",
        rationale: "Investor-property files should be treated more conservatively, with stronger reserve and coverage expectations than an owner-occupied home."
      };
    }
    case "rate-lock":
    default: {
      const recommendedProgram = firstProgram("conventional-fixed") ?? firstProgram("conventional-arm");
      return {
        prompt: `What is the best recommendation for ${activeClient.name}'s current mortgage file?`,
        answer: recommendedProgram?.name ?? "Stay with current lane and use a disciplined lock decision",
        rationale: "The right training answer here is not just product choice. It is whether payment savings, timing, and lock cost actually make the move worthwhile."
      };
    }
  }
}

export function MortgageDebtPlanningPanel({ assignment, assignedDifficulty = "trainee" }: MortgageDebtPlanningPanelProps) {
  const notifMortgage = useClientQuestionNotification("mortgage-debt-planning", assignedDifficulty, () => undefined);
  const activeClient = useSelectedClient();
  const [workspaceMode, setWorkspaceMode] = useState<MortgageWorkspaceMode>("refinance");
  const [adviceAction, setAdviceAction] = useState<MortgageAdviceAction | null>(null);
  const stateProfile = useMemo(() => getMortgageStateProfile(assignment.jurisdictionCode), [assignment.jurisdictionCode]);
  const purchaseProfile = activeClient?.mortgagePurchaseProfile ?? null;

  const mortgageSnapshot = useMemo(
    () => activeClient ? buildMortgageRefiCalculator(activeClient) : null,
    [activeClient]
  );
  const debtSnapshot = useMemo(
    () => activeClient ? buildDebtVsInvestCalculator(activeClient) : null,
    [activeClient]
  );
  const educationSnapshot = useMemo(
    () => activeClient ? buildEducationFundingCalculator(activeClient) : null,
    [activeClient]
  );
  const mortgageScenario = useMemo(
    () => activeClient ? buildMortgageScenarioSnapshot(activeClient) : null,
    [activeClient]
  );
  const mortgageProducts = useMemo(
    () => activeClient ? buildMortgageProductComparisonSnapshot(activeClient) : null,
    [activeClient]
  );
  const trainingScenarios = useMemo(
    () => activeClient ? buildMortgageTrainingScenarios(activeClient, stateProfile) : [],
    [activeClient, stateProfile]
  );
  const selectedScenario =
    trainingScenarios.find((scenario) => scenario.id === assignment.assignedMortgageScenarioId)
    ?? trainingScenarios[0]
    ?? null;

  const [refiRate, setRefiRate] = useState(0.06);
  const [refiClosingCosts, setRefiClosingCosts] = useState(7000);
  const [refiStayMonths, setRefiStayMonths] = useState(72);
  const [purchasePrice, setPurchasePrice] = useState(525000);
  const [downPaymentPct, setDownPaymentPct] = useState(0.1);
  const [purchaseRate, setPurchaseRate] = useState(0.064);
  const [purchaseTermYears, setPurchaseTermYears] = useState(30);

  useEffect(() => {
    if (!activeClient || !mortgageSnapshot) {
      return;
    }

    setRefiRate(Number((assignment.assignedMortgageRate ?? Math.max(0.04, mortgageSnapshot.proposedRate)).toFixed(4)));
    setRefiClosingCosts(mortgageSnapshot.closingCosts);
    setRefiStayMonths(Math.max(12, activeClient.mortgageProfile.refinanceHorizonMonths || 60));
    const defaultPurchasePrice = purchaseProfile?.targetPurchasePrice ?? activeClient.debtProfile.propertyValue ?? 525000;
    setPurchasePrice(Math.max(240000, defaultPurchasePrice));
    setDownPaymentPct(purchaseProfile?.targetDownPaymentPct ?? (activeClient.id === "first_home_family" ? 0.08 : 0.15));
    const localRateAdjustment = (purchaseProfile?.localRateAdjustmentBps ?? 0) / 10000;
    const basePurchaseRate = assignment.assignedMortgageRate ?? activeClient.debtProfile.mortgageRate ?? 0.064;
    setPurchaseRate(Number(Math.max(0.045, basePurchaseRate + localRateAdjustment).toFixed(4)));
    setPurchaseTermYears(activeClient.debtProfile.mortgageTermYearsRemaining > 0 ? activeClient.debtProfile.mortgageTermYearsRemaining : 30);
    setWorkspaceMode(activeClient.debtProfile.mortgageBalance > 0 ? "refinance" : "purchase");
    setAdviceAction(null);
  }, [activeClient, assignment.assignedMortgageRate, mortgageSnapshot, purchaseProfile]);

  const relevantPrograms = useMemo(() => {
    if (!activeClient) {
      return [];
    }

    return MORTGAGE_LOAN_PROGRAMS.filter((program) => {
      if (program.id === "fha" || program.id === "state-hfa" || program.id === "local-dpa") {
        return activeClient.creditProfile.score < 740 || activeClient.mortgageProfile.closingCostSensitivity === "High";
      }
      if (program.id === "va" || program.id === "usda") {
        return activeClient.mortgageProfile.occupancy === "Primary Residence";
      }
      if (program.id === "heloc" || program.id === "home-equity-loan" || program.id === "cash-out-refi") {
        return activeClient.debtProfile.propertyValue > 0 && activeClient.debtProfile.mortgageBalance > 0;
      }
      if (program.id === "jumbo") {
        return (activeClient.debtProfile.propertyValue || purchasePrice) >= 800000;
      }
      return true;
    }).slice(0, 6);
  }, [activeClient, purchasePrice]);
  const scenarioDecisionGuide = useMemo(
    () => activeClient
      ? buildScenarioDecisionGuide(assignment.assignedMortgageScenarioId, activeClient, relevantPrograms)
      : null,
    [activeClient, assignment.assignedMortgageScenarioId, relevantPrograms]
  );

  const refinanceResult = useMemo(() => {
    if (!activeClient || !mortgageSnapshot) {
      return null;
    }

    const principal = mortgageSnapshot.principal;
    const currentPayment = mortgageSnapshot.currentPayment;
    const proposedPayment = Math.round((principal * (refiRate / 12)) / (1 - Math.pow(1 + refiRate / 12, -Math.max(120, (activeClient.debtProfile.mortgageTermYearsRemaining || 30) * 12))));
    const monthlySavings = currentPayment - proposedPayment;
    const breakEvenMonths = monthlySavings > 0 ? Math.round(refiClosingCosts / monthlySavings) : 999;
    const losesMoney = monthlySavings <= 0 || refiStayMonths < breakEvenMonths;
    const recommendation = monthlySavings <= 0
      ? "This refinance does not improve payment economics right now."
      : losesMoney
        ? `The client likely loses money if they leave or refinance again before about ${breakEvenMonths} months.`
        : `This refinance becomes defendable if the client expects to stay at least ${breakEvenMonths} months.`;

    return {
      principal,
      currentPayment,
      proposedPayment,
      monthlySavings,
      breakEvenMonths,
      losesMoney,
      recommendation
    };
  }, [activeClient, mortgageSnapshot, refiClosingCosts, refiRate, refiStayMonths]);

  const purchaseResult = useMemo(() => {
    if (!activeClient) {
      return null;
    }

    return buildMortgagePurchaseCalculator(
      purchasePrice,
      downPaymentPct,
      purchaseRate,
      purchaseTermYears,
      activeClient.mortgageProfile.propertyTaxMonthly,
      activeClient.mortgageProfile.homeownerInsuranceMonthly
    );
  }, [activeClient, downPaymentPct, purchasePrice, purchaseRate, purchaseTermYears]);

  const advisoryFeedback = useMemo(() => {
    if (!activeClient) {
      return null;
    }

    if (adviceAction === "refinance" && refinanceResult) {
      return {
        title: refinanceResult.losesMoney ? "Refinance caution" : "Refinance recommendation",
        detail: refinanceResult.losesMoney
          ? `${activeClient.name.split(" ")[0]} is likely to lose money on this refinance if the household exits before the ${refinanceResult.breakEvenMonths}-month break-even. Coach the trainee to hold or renegotiate instead of forcing the refinance.`
          : `${activeClient.name.split(" ")[0]} can justify a refinance here if the household truly expects to stay beyond ${refinanceResult.breakEvenMonths} months and the closing cash does not impair reserves.`
      };
    }

    if (adviceAction === "hold" && refinanceResult) {
      return {
        title: "Hold current note",
        detail: refinanceResult.losesMoney
          ? "Holding the current mortgage is the cleaner advice because the refinance does not clear the break-even hurdle in the modeled stay period."
          : "Holding can still be defended if the client values cash reserves and timeline certainty more than the payment reduction."
      };
    }

    if (adviceAction === "purchase" && purchaseResult) {
      const availableCashToClose = purchaseProfile?.availableCashToClose ?? activeClient.cash;
      return {
        title: "Purchase recommendation",
        detail: purchaseResult.estimatedCashToClose > availableCashToClose
          ? "This purchase lane is too aggressive because cash to close would exhaust the family's intended home-buying liquidity. Coach the trainee to lower price, increase savings runway, or use a smaller down payment strategically."
          : `${activeClient.name.split(" ")[0]} can support this purchase lane if the total housing payment of ${formatCurrency(purchaseResult.totalHousingPayment)} still leaves emergency reserves intact after closing.`
      };
    }

    return null;
  }, [activeClient, adviceAction, purchaseProfile, purchaseResult, refinanceResult]);

  if (!activeClient) {
    return <section className="panel"><div className="empty-state">Select a household or client to open the mortgage and debt planning workspace.</div></section>;
  }

  const debtServiceRatio = activeClient.cashFlow.monthlyIncome > 0
    ? (activeClient.cashFlow.monthlyDebtPayments / activeClient.cashFlow.monthlyIncome) * 100
    : 0;
  const reserveTarget = (activeClient.cashFlow.monthlyExpenses + activeClient.cashFlow.monthlyDebtPayments) * activeClient.cashFlow.emergencyReserveMonths;
  const reserveGap = Math.max(0, reserveTarget - activeClient.cash);
  const localRateAdjustmentPct = (purchaseProfile?.localRateAdjustmentBps ?? 0) / 100;
  const localHousingCarry = activeClient.mortgageProfile.propertyTaxMonthly
    + activeClient.mortgageProfile.homeownerInsuranceMonthly
    + (purchaseProfile?.hoaMonthly ?? 0);

  return (
    <section className="panel mortgage-workspace-panel">
      <div className="panel-header mortgage-workspace-header">
        <h2>Mortgage and Debt Planning</h2>
        <span className="panel-meta">{activeClient.name} | Housing, refinance, purchase, and debt-fit review</span>
        {selectedScenario ? (
          <span className="panel-meta">Assigned scenario: {selectedScenario.title}</span>
        ) : null}
      </div>
      <div className="mortgage-workspace-body">
        <div className="comparison-grid">
          {scenarioDecisionGuide ? (
            <>
              <div className="comparison-card">
                <span>Scenario prompt</span>
                <strong>{scenarioDecisionGuide.prompt}</strong>
                <small>{scenarioDecisionGuide.rationale}</small>
              </div>
              <div className="comparison-card">
                <span>Best-fit loan lane</span>
                <strong>{scenarioDecisionGuide.answer}</strong>
                <small>This is the recommendation the trainee should be able to defend from the file facts.</small>
              </div>
            </>
          ) : null}
          <div className="comparison-card">
            <span>Credit posture</span>
            <strong>{activeClient.creditProfile.score} | {activeClient.creditProfile.scoreBand}</strong>
            <small>{activeClient.creditProfile.trend} trend | {activeClient.creditProfile.utilizationPct}% utilization | {activeClient.debtProfile.unpaidDebtBalance > 0 ? `${formatCurrency(activeClient.debtProfile.unpaidDebtBalance)} unpaid debt` : "No unpaid debt currently"}</small>
          </div>
          <div className="comparison-card">
            <span>Debt service ratio</span>
            <strong>{debtServiceRatio.toFixed(0)}%</strong>
            <small>Monthly debt payments {formatCurrency(activeClient.cashFlow.monthlyDebtPayments)} against income {formatCurrency(activeClient.cashFlow.monthlyIncome)}.</small>
          </div>
          <div className="comparison-card">
            <span>Mortgage lane</span>
            <strong>{mortgageScenario ? `${(mortgageScenario.currentLtv * 100).toFixed(0)}% LTV | ${(mortgageScenario.backEndDti * 100).toFixed(0)}% DTI` : "No current mortgage on file"}</strong>
            <small>{mortgageScenario?.scenarioSummary ?? "This file is a purchase case, so the trainee should be judged on affordability, PMI, cash-to-close, and reserve protection instead of refinance math."}</small>
          </div>
          <div className="comparison-card">
            <span>Reserve position</span>
            <strong>{reserveGap > 0 ? formatCurrency(reserveGap) : "Funded"}</strong>
            <small>{reserveGap > 0 ? "Emergency reserve still needs work before stretching into more debt." : "Reserve target is currently covered."}</small>
          </div>
          {purchaseProfile ? (
            <>
              <div className="comparison-card">
                <span>Purchase file</span>
                <strong>{purchaseProfile.city}, {purchaseProfile.stateCode} | {purchaseProfile.propertyType}</strong>
                <small>{purchaseProfile.metroArea} | {purchaseProfile.county} | {purchaseProfile.localMarketPressure} local market pressure</small>
              </div>
              <div className="comparison-card">
                <span>Target vs comfort lane</span>
                <strong>{formatCurrency(purchaseProfile.targetPurchasePrice)} target | {formatCurrency(purchaseProfile.maxComfortPurchasePrice)} comfort</strong>
                <small>Available cash to close is about {formatCurrency(purchaseProfile.availableCashToClose)} with a {Math.round(purchaseProfile.targetDownPaymentPct * 100)}% target down payment.</small>
              </div>
              <div className="comparison-card">
                <span>Local market carry</span>
                <strong>{formatPercent(purchaseRate)} modeled rate | +{localRateAdjustmentPct.toFixed(2)}% local adjustment</strong>
                <small>{purchaseProfile.localHousingNote} Monthly tax, insurance, and HOA carry is about {formatCurrency(localHousingCarry)}.</small>
              </div>
            </>
          ) : null}
        </div>

        <div className="portfolio-section">
          <div className="portfolio-section-title">Interactive Mortgage Calculator</div>
          <div className="tabs">
            <button type="button" className={workspaceMode === "refinance" ? "tab-btn active" : "tab-btn"} onClick={() => setWorkspaceMode("refinance")}>
              Refinance
            </button>
            <button type="button" className={workspaceMode === "purchase" ? "tab-btn active" : "tab-btn"} onClick={() => setWorkspaceMode("purchase")}>
              Purchase
            </button>
          </div>

          {workspaceMode === "refinance" ? (
            <div className="planner-tool-card">
              <span>Refinance Decision Lab</span>
              <strong>Will this borrower actually save money?</strong>
              <div className="planner-tool-inputs">
                <label>
                  Proposed rate
                  <input type="range" min="0.04" max="0.09" step="0.0005" value={refiRate} onChange={(event) => setRefiRate(Number(event.target.value))} />
                  <small>{formatPercent(refiRate)}</small>
                </label>
                <label>
                  Closing costs
                  <input type="range" min="3000" max="18000" step="250" value={refiClosingCosts} onChange={(event) => setRefiClosingCosts(Number(event.target.value))} />
                  <small>{formatCurrency(refiClosingCosts)}</small>
                </label>
                <label>
                  Expected stay
                  <input type="range" min="12" max="180" step="6" value={refiStayMonths} onChange={(event) => setRefiStayMonths(Number(event.target.value))} />
                  <small>{refiStayMonths} months</small>
                </label>
              </div>
              {refinanceResult ? (
                <div className="comparison-grid">
                  <div className="comparison-card">
                    <span>Current vs proposed payment</span>
                    <strong>{formatCurrency(refinanceResult.currentPayment)} now | {formatCurrency(refinanceResult.proposedPayment)} new</strong>
                    <small>Principal modeled from the actual file: {formatCurrency(refinanceResult.principal)}.</small>
                  </div>
                  <div className="comparison-card">
                    <span>Break-even</span>
                    <strong>{formatCurrency(refinanceResult.monthlySavings)} /mo | {refinanceResult.breakEvenMonths} months</strong>
                    <small>{refinanceResult.recommendation}</small>
                  </div>
                  <div className="comparison-card">
                    <span>Stay-horizon verdict</span>
                    <strong>{refinanceResult.losesMoney ? "Likely loses money" : "Economically defensible"}</strong>
                    <small>{refinanceResult.losesMoney ? "The modeled stay period is shorter than the break-even." : "The modeled stay period clears the break-even hurdle."}</small>
                  </div>
                </div>
              ) : null}
              <div className="insurance-actions">
                <button type="button" className="control-btn" onClick={() => setAdviceAction("refinance")}>
                  Advise Refinance
                </button>
                <button type="button" className="control-btn" onClick={() => setAdviceAction("hold")}>
                  Hold Current Mortgage
                </button>
              </div>
            </div>
          ) : (
            <div className="planner-tool-card">
              <span>Purchase Decision Lab</span>
              <strong>Which home-loan lane best protects this family?</strong>
              <div className="planner-tool-inputs">
                <label>
                  Purchase price
                  <input type="range" min="220000" max="1500000" step="5000" value={purchasePrice} onChange={(event) => setPurchasePrice(Number(event.target.value))} />
                  <small>{formatCurrency(purchasePrice)}</small>
                </label>
                <label>
                  Down payment
                  <input type="range" min="0.03" max="0.3" step="0.01" value={downPaymentPct} onChange={(event) => setDownPaymentPct(Number(event.target.value))} />
                  <small>{(downPaymentPct * 100).toFixed(0)}%</small>
                </label>
                <label>
                  Rate
                  <input type="range" min="0.045" max="0.09" step="0.0005" value={purchaseRate} onChange={(event) => setPurchaseRate(Number(event.target.value))} />
                  <small>{formatPercent(purchaseRate)}</small>
                </label>
                <label>
                  Term
                  <input type="range" min="15" max="30" step="5" value={purchaseTermYears} onChange={(event) => setPurchaseTermYears(Number(event.target.value))} />
                  <small>{purchaseTermYears} years</small>
                </label>
              </div>
              {purchaseResult ? (
                <div className="comparison-grid">
                  <div className="comparison-card">
                    <span>Loan structure</span>
                    <strong>{formatCurrency(purchaseResult.loanAmount)} loan | {formatCurrency(purchaseResult.downPaymentAmount)} down</strong>
                    <small>{purchaseResult.pmiRequired ? "PMI likely applies below 20% down." : "No PMI modeled at this down-payment level."}</small>
                  </div>
                  <div className="comparison-card">
                    <span>Payment and cash to close</span>
                    <strong>{formatCurrency(purchaseResult.totalHousingPayment)} /mo | {formatCurrency(purchaseResult.estimatedCashToClose)} close</strong>
                    <small>{purchaseResult.recommendation}</small>
                  </div>
                  <div className="comparison-card">
                    <span>Affordability lens</span>
                    <strong>{purchaseResult.estimatedCashToClose > (purchaseProfile?.availableCashToClose ?? activeClient.cash) ? "Too cash-heavy" : "Potentially supportable"}</strong>
                    <small>{purchaseResult.estimatedCashToClose > (purchaseProfile?.availableCashToClose ?? activeClient.cash) ? "The modeled cash to close exceeds the file's intended closing liquidity." : "Check post-close reserves before approving the lane."}</small>
                  </div>
                  {purchaseProfile ? (
                    <div className="comparison-card">
                      <span>Target-home reality check</span>
                      <strong>{purchasePrice > purchaseProfile.maxComfortPurchasePrice ? "Target home is above the comfort lane" : "Target home is inside the comfort lane"}</strong>
                      <small>{purchasePrice > purchaseProfile.maxComfortPurchasePrice ? `At ${formatCurrency(purchasePrice)}, the trainee should discuss lowering the target price or delaying purchase instead of treating approval as success.` : "The modeled price remains inside the more defensible comfort lane for this file."}</small>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="insurance-actions">
                <button type="button" className="control-btn" onClick={() => setAdviceAction("purchase")}>
                  Advise This Loan Lane
                </button>
              </div>
            </div>
          )}
        </div>

        {advisoryFeedback ? (
          <div className="answer-summary positive">
            <strong>{advisoryFeedback.title}</strong>
            <span>{advisoryFeedback.detail}</span>
          </div>
        ) : null}

        <div className="portfolio-section">
          <div className="portfolio-section-title">State and Federal Overlay</div>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Assigned jurisdiction</span>
              <strong>{stateProfile?.name ?? "Federal baseline only"}</strong>
              <small>{stateProfile ? `${stateProfile.foreclosureTrack} | ${stateProfile.deficiencyExposure}` : "No state overlay assigned yet."}</small>
              <small>Federal baseline: ATR/QM ability-to-repay discipline, TRID timing awareness, ECOA/Fair Housing consistency, and payment-shock coaching.</small>
            </div>
            {stateProfile ? (
              <div className="comparison-card">
                <span>State training note</span>
                <strong>{stateProfile.closingStyle}</strong>
                <small>{stateProfile.trainingNote}</small>
              </div>
            ) : null}
          </div>
        </div>

        <div className="portfolio-section">
          <div className="portfolio-section-title">Mortgage Scenario Track</div>
          {selectedScenario ? (
            <div className="comparison-grid">
              <div className="comparison-card">
                <span>Locked assignment scenario</span>
                <strong>{selectedScenario.title}</strong>
                <small>{selectedScenario.summary}</small>
              </div>
              <div className="comparison-card">
                <span>Recommended training lane</span>
                <strong>{selectedScenario.recommendedLane}</strong>
                <small>{selectedScenario.rationale}</small>
              </div>
              <div className="comparison-card">
                <span>State-sensitive caution</span>
                <strong>{stateProfile?.name ?? "Federal baseline"}</strong>
                <small>{selectedScenario.caution}</small>
              </div>
              <div className="comparison-card">
                <span>Coach the trainee to</span>
                <strong>Decision discipline</strong>
                <small>{selectedScenario.coachingSteps.join(" ")}</small>
              </div>
            </div>
          ) : null}
        </div>

        <div className="comparison-grid">
          <div className="comparison-card">
            <span>Debt vs invest</span>
            <strong>{debtSnapshot?.betterLane ?? "Unavailable"}</strong>
            <small>{debtSnapshot?.rationale ?? "Open a planning case to compare debt cost and expected return."}</small>
          </div>
          <div className="comparison-card">
            <span>Education interplay</span>
            <strong>{educationSnapshot ? formatCurrency(educationSnapshot.remainingGap) : "No active 529 goal"}</strong>
            <small>{educationSnapshot?.recommendation ?? "Education funding is not the main planning driver here."}</small>
          </div>
          <div className="comparison-card">
            <span>Fixed vs ARM</span>
            <strong>{mortgageProducts ? `${formatCurrency(mortgageProducts.fixedMonthlyEstimate)} fixed | ${formatCurrency(mortgageProducts.armMonthlyEstimate)} ARM` : "Unavailable"}</strong>
            <small>{mortgageProducts?.recommendation ?? "Need a live mortgage profile to compare payment lanes."}</small>
          </div>
          <div className="comparison-card">
            <span>PMI / equity lane</span>
            <strong>{activeClient.mortgageProfile.pmiActive ? "PMI review needed" : "Equity lane stable"}</strong>
            <small>{mortgageProducts?.pmiExitLane ?? "PMI is not currently driving the recommendation."}</small>
          </div>
        </div>

        <div className="portfolio-section">
          <div className="portfolio-section-title">Loan Program Coverage</div>
          <div className="comparison-grid">
            {relevantPrograms.map((program) => (
              <div key={program.id} className="comparison-card">
                <span>{program.source}</span>
                <strong>{program.name}</strong>
                <small>{program.useCase}</small>
                <small><strong>Best fit:</strong> {program.bestFit}</small>
                <small><strong>Caution:</strong> {program.caution}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

