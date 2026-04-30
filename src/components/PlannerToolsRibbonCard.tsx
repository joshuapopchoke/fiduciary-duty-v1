import { useMemo, useState } from "react";
import { useGameStore, useSelectedClient } from "../store/gameStore";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function monthlyPayment(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments)));
}

export function PlannerToolsRibbonCard() {
  const clients = useGameStore((state) => state.clients);
  const tickers = useGameStore((state) => state.tickers);
  const startRecommendationDialogue = useGameStore((state) => state.startRecommendationDialogue);
  const startClientReviewMeeting = useGameStore((state) => state.startClientReviewMeeting);
  const startOperationsWorkflow = useGameStore((state) => state.startOperationsWorkflow);
  const activeClient = useSelectedClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(activeClient?.id ?? clients[0]?.id ?? "");
  const [socialSecurityAge, setSocialSecurityAge] = useState<"62" | "67" | "70">("67");
  const [conversionPercent, setConversionPercent] = useState("8");
  const [currentMortgageRate, setCurrentMortgageRate] = useState("6.75");
  const [proposedMortgageRate, setProposedMortgageRate] = useState("6.00");
  const [mortgageYears, setMortgageYears] = useState("30");
  const [debtRate, setDebtRate] = useState("6.5");
  const [expectedReturn, setExpectedReturn] = useState("7.0");
  const [educationYears, setEducationYears] = useState("8");
  const [educationTarget, setEducationTarget] = useState("220000");
  const [stressHaircut, setStressHaircut] = useState("2.0");

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? activeClient ?? clients[0] ?? null,
    [activeClient, clients, selectedClientId]
  );

  const selectedClientUsd = useMemo(() => {
    if (!selectedClient) {
      return 0;
    }

    const longValue = Object.values(selectedClient.holdings).reduce(
      (sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares,
      0
    );
    const shortValue = Object.values(selectedClient.shortHoldings ?? {}).reduce(
      (sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares,
      0
    );

    return selectedClient.cash + longValue - shortValue - (selectedClient.marginDebt ?? 0);
  }, [selectedClient, tickers]);

  const socialSecurityOutput = useMemo(() => {
    if (!selectedClient) {
      return null;
    }

    const baseBenefit = clamp(selectedClient.cashFlow.monthlyIncome * 0.42, 18000, 42000);
    const benefitByAge = {
      "62": Math.round(baseBenefit * 0.72),
      "67": Math.round(baseBenefit),
      "70": Math.round(baseBenefit * 1.24)
    };

    return {
      annualBenefit: benefitByAge[socialSecurityAge],
      comparison: `62: ${formatCurrency(benefitByAge["62"])}/yr | 67: ${formatCurrency(benefitByAge["67"])}/yr | 70: ${formatCurrency(benefitByAge["70"])}/yr`
    };
  }, [selectedClient, socialSecurityAge]);

  const rothOutput = useMemo(() => {
    if (!selectedClient) {
      return null;
    }

    const percent = Number(conversionPercent) / 100;
    const conversionAmount = Math.round(selectedClientUsd * percent);
    const estimatedTaxRate =
      selectedClient.taxProfile.taxBracketLabel.toLowerCase().includes("top")
        ? 0.32
        : selectedClient.taxProfile.taxBracketLabel.toLowerCase().includes("upper")
          ? 0.24
          : selectedClient.taxProfile.taxBracketLabel.toLowerCase().includes("moderate")
            ? 0.18
            : 0.12;
    const estimatedTaxCost = Math.round(conversionAmount * estimatedTaxRate);
    const futureTaxFreeValue = Math.round(conversionAmount * Math.pow(1 + selectedClient.retirementMath.expectedReturn, 10));

    return { conversionAmount, estimatedTaxCost, futureTaxFreeValue };
  }, [conversionPercent, selectedClient, selectedClientUsd]);

  const mortgageOutput = useMemo(() => {
    if (!selectedClient) {
      return null;
    }

    const principal = clamp(selectedClient.cashFlow.monthlyExpenses * 48, 180000, 650000);
    const currentRateValue = Number(currentMortgageRate) / 100;
    const proposedRateValue = Number(proposedMortgageRate) / 100;
    const years = Number(mortgageYears);
    const currentPayment = monthlyPayment(principal, currentRateValue, years);
    const proposedPayment = monthlyPayment(principal, proposedRateValue, years);
    const monthlySavings = Math.max(0, Math.round(currentPayment - proposedPayment));
    const breakEvenMonths = monthlySavings > 0 ? Math.round((principal * 0.018) / monthlySavings) : 999;

    return { monthlySavings, breakEvenMonths };
  }, [currentMortgageRate, mortgageYears, proposedMortgageRate, selectedClient]);

  const debtInvestOutput = useMemo(() => {
    const debt = Number(debtRate) / 100;
    const expected = Number(expectedReturn) / 100;
    const recommendation =
      debt >= expected
        ? "Prioritize debt paydown first"
        : debt >= expected - 0.015
          ? "Blend debt reduction and investing"
          : "Keep investing while servicing debt";

    return { recommendation };
  }, [debtRate, expectedReturn]);

  const educationOutput = useMemo(() => {
    if (!selectedClient) {
      return null;
    }

    const targetCost = Number(educationTarget);
    const years = Number(educationYears);
    const fundedAmount = Math.round((selectedClient.sleeveCashBalances["family-529"] ?? 0) + Object.values(selectedClient.holdings).length * 2500);
    const remainingGap = Math.max(0, targetCost - fundedAmount);
    const monthlySavingsNeeded = Math.round(remainingGap / Math.max(1, years * 12));

    return { fundedAmount, remainingGap, monthlySavingsNeeded };
  }, [educationTarget, educationYears, selectedClient]);

  const stressOutput = useMemo(() => {
    if (!selectedClient) {
      return null;
    }

    const annualGap = Math.max(1, selectedClient.retirementMath.annualSpendingGoal - selectedClient.retirementMath.annualGuaranteedIncome);
    const safeWithdrawalRate = selectedClient.retirementMath.safeWithdrawalGuardrail;
    const baseSuccessRate = clamp(58 + ((selectedClientUsd * safeWithdrawalRate) / annualGap) * 32, 28, 96);
    const stressedSuccessRate = clamp(baseSuccessRate - 18 - Number(stressHaircut) * 5, 12, 88);

    return { baseSuccessRate, stressedSuccessRate };
  }, [selectedClient, selectedClientUsd, stressHaircut]);

  const traditionalIraSleeve = useMemo(
    () => selectedClient?.accountSleeves.find((sleeve) => sleeve.registration.includes("Traditional IRA")) ?? null,
    [selectedClient]
  );
  const traditionalIraBalance = traditionalIraSleeve && selectedClient
    ? selectedClient.sleeveCashBalances[traditionalIraSleeve.id] ?? 0
    : 0;

  return (
    <>
      <div className="ribbon-item ribbon-item--planner-tools">
        <span>Planner Tools</span>
        <strong>{selectedClient ? selectedClient.name : "Select client"}</strong>
        <small>Open calculator suite</small>
        <button className="control-btn planner-tools-btn" onClick={() => setIsOpen(true)} type="button">
          Open Tools
        </button>
      </div>
      {isOpen ? (
        <div className="overlay">
          <div className="overlay-card overlay-card--scrollable planner-tools-modal">
            <div className="overlay-header">
              <div className="overlay-copy">
                <p className="eyebrow">Planner Tools</p>
                <h2>Interactive planning calculators</h2>
                <p className="explanation">Use these tools to test planning choices against the same client logic the sim is already using.</p>
              </div>
              <div className="overlay-actions">
                <button className="control-btn" onClick={() => setIsOpen(false)} type="button">Close</button>
              </div>
            </div>

            <label>
              Client
              <select value={selectedClientId} onChange={(event) => setSelectedClientId(event.target.value)}>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </label>

            {selectedClient ? (
              <div className="planner-tools-grid">
                <div className="planner-tool-card">
                  <span>Social Security timing</span>
                  <label>
                    Filing age
                    <select value={socialSecurityAge} onChange={(event) => setSocialSecurityAge(event.target.value as "62" | "67" | "70")}>
                      <option value="62">Age 62</option>
                      <option value="67">Full retirement age</option>
                      <option value="70">Age 70</option>
                    </select>
                  </label>
                  <strong>{socialSecurityOutput ? `${formatCurrency(socialSecurityOutput.annualBenefit)}/yr` : "Unavailable"}</strong>
                  <small>{socialSecurityOutput?.comparison}</small>
                  {selectedClient?.id === "retiree" ? (
                    <div className="insurance-actions">
                      <button
                        className="control-btn"
                        onClick={() => {
                          startRecommendationDialogue(selectedClient.id, "social-security-timing");
                          setIsOpen(false);
                        }}
                        type="button"
                      >
                        Present Claiming Review
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="planner-tool-card">
                  <span>RMD and withdrawals</span>
                  <strong>{traditionalIraSleeve ? `${formatCurrency(traditionalIraBalance)} in ${traditionalIraSleeve.registration}` : "No Traditional IRA sleeve"}</strong>
                  <small>
                    {traditionalIraSleeve
                      ? "Use the workflow to coordinate the IRA distribution into the taxable reserve instead of treating the whole client account like one cash bucket."
                      : "This client does not currently need a Traditional IRA distribution workflow."}
                  </small>
                  {selectedClient?.id === "retiree" && traditionalIraSleeve ? (
                    <div className="insurance-actions">
                      <button
                        className="control-btn"
                        onClick={() => {
                          startOperationsWorkflow(selectedClient.id, "rmd");
                          setIsOpen(false);
                        }}
                        type="button"
                      >
                        Run RMD Workflow
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="planner-tool-card">
                  <span>Roth conversion</span>
                  <label>
                    Conversion size
                    <select value={conversionPercent} onChange={(event) => setConversionPercent(event.target.value)}>
                      <option value="5">5% of account</option>
                      <option value="8">8% of account</option>
                      <option value="10">10% of account</option>
                      <option value="15">15% of account</option>
                    </select>
                  </label>
                  <strong>{rothOutput ? `${formatCurrency(rothOutput.conversionAmount)} conversion` : "Unavailable"}</strong>
                  <small>{rothOutput ? `${formatCurrency(rothOutput.estimatedTaxCost)} tax | ${formatCurrency(rothOutput.futureTaxFreeValue)} future tax-free value` : ""}</small>
                </div>

                <div className="planner-tool-card">
                  <span>Mortgage refinance</span>
                  <div className="planner-tool-inputs">
                    <label>
                      Current rate
                      <select value={currentMortgageRate} onChange={(event) => setCurrentMortgageRate(event.target.value)}>
                        <option value="7.25">7.25%</option>
                        <option value="6.75">6.75%</option>
                        <option value="6.25">6.25%</option>
                      </select>
                    </label>
                    <label>
                      New rate
                      <select value={proposedMortgageRate} onChange={(event) => setProposedMortgageRate(event.target.value)}>
                        <option value="6.50">6.50%</option>
                        <option value="6.00">6.00%</option>
                        <option value="5.75">5.75%</option>
                      </select>
                    </label>
                    <label>
                      Term
                      <select value={mortgageYears} onChange={(event) => setMortgageYears(event.target.value)}>
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </label>
                  </div>
                  <strong>{mortgageOutput ? `${formatCurrency(mortgageOutput.monthlySavings)}/mo saved` : "Unavailable"}</strong>
                  <small>{mortgageOutput ? `Break-even about ${mortgageOutput.breakEvenMonths} months` : ""}</small>
                </div>

                <div className="planner-tool-card">
                  <span>Debt vs invest</span>
                  <div className="planner-tool-inputs">
                    <label>
                      Debt rate
                      <select value={debtRate} onChange={(event) => setDebtRate(event.target.value)}>
                        <option value="4.5">4.5%</option>
                        <option value="6.5">6.5%</option>
                        <option value="8.5">8.5%</option>
                        <option value="12">12%</option>
                      </select>
                    </label>
                    <label>
                      Expected return
                      <select value={expectedReturn} onChange={(event) => setExpectedReturn(event.target.value)}>
                        <option value="5">5.0%</option>
                        <option value="7">7.0%</option>
                        <option value="9">9.0%</option>
                      </select>
                    </label>
                  </div>
                  <strong>{debtInvestOutput.recommendation}</strong>
                  <small>Use this alongside taxes, liquidity, and behavior instead of rate alone.</small>
                </div>

                <div className="planner-tool-card">
                  <span>Education funding gap</span>
                  <div className="planner-tool-inputs">
                    <label>
                      Target cost
                      <select value={educationTarget} onChange={(event) => setEducationTarget(event.target.value)}>
                        <option value="120000">$120,000</option>
                        <option value="180000">$180,000</option>
                        <option value="220000">$220,000</option>
                        <option value="280000">$280,000</option>
                      </select>
                    </label>
                    <label>
                      Years left
                      <select value={educationYears} onChange={(event) => setEducationYears(event.target.value)}>
                        <option value="5">5 years</option>
                        <option value="8">8 years</option>
                        <option value="10">10 years</option>
                        <option value="12">12 years</option>
                      </select>
                    </label>
                  </div>
                  <strong>{educationOutput ? `${formatCurrency(educationOutput.remainingGap)} gap` : "No active education plan"}</strong>
                  <small>{educationOutput ? `${formatCurrency(educationOutput.fundedAmount)} funded | ${formatCurrency(educationOutput.monthlySavingsNeeded)}/mo needed` : "Use this mainly for the family planning cases."}</small>
                </div>

                <div className="planner-tool-card">
                  <span>Retirement stress test</span>
                  <label>
                    Stress haircut
                    <select value={stressHaircut} onChange={(event) => setStressHaircut(event.target.value)}>
                      <option value="1.0">1.0% return haircut</option>
                      <option value="2.0">2.0% return haircut</option>
                      <option value="3.0">3.0% return haircut</option>
                    </select>
                  </label>
                  <strong>{stressOutput ? `${stressOutput.baseSuccessRate.toFixed(0)}% base | ${stressOutput.stressedSuccessRate.toFixed(0)}% stressed` : "Unavailable"}</strong>
                  <small>Use this to compare whether the plan still holds up after a rougher return sequence.</small>
                </div>

                <div className="planner-tool-card">
                  <span>Client review meeting</span>
                  <strong>{selectedClient?.crmProfile.nextReviewWindow ?? "Select client"}</strong>
                  <small>{selectedClient?.crmProfile.nextTask ?? "Open a planning review to walk through the household agenda and follow-up items."}</small>
                  {selectedClient ? (
                    <div className="insurance-actions">
                      <button
                        className="control-btn"
                        onClick={() => {
                          startClientReviewMeeting(selectedClient.id);
                          setIsOpen(false);
                        }}
                        type="button"
                      >
                        Open Review Meeting
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
