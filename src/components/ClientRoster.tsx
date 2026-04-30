import { betaFitLabel, calculatePortfolioBeta } from "../engine/portfolioAnalytics";
import { buildPolicyReviewSnapshot } from "../engine/policyReviewEngine";
import { buildRetirementIncomeSnapshot } from "../engine/retirementIncomeEngine";
import { useGameStore } from "../store/gameStore";

type ClientRosterMode = "default" | "mortgage" | "lending";

interface ClientRosterProps {
  mode?: ClientRosterMode;
  showPlayerAccount?: boolean;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function computeAccountUsd(
  client: {
    cash: number;
    holdings: Record<string, { ticker: string; shares: number }>;
    shortHoldings?: Record<string, { ticker: string; shares: number }>;
    marginDebt?: number;
  },
  tickers: Record<string, { price: number }>
) {
  const longValue = client.cash + Object.values(client.holdings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const shortValue = Object.values(client.shortHoldings ?? {}).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  return longValue - shortValue - (client.marginDebt ?? 0);
}

function relationshipBand(trustScore: number) {
  if (trustScore >= 75) {
    return "Trusted";
  }
  if (trustScore >= 50) {
    return "Stable";
  }
  return "Fragile";
}

function formatBeta(value: number) {
  return `Beta ${value.toFixed(2)}`;
}

function formatCompactUsd(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function annualizedRevenue(clientUsd: number, feeBps: number) {
  return clientUsd * feeBps / 10000;
}

function crmCadenceLabel(cycleNumber: number, clientId: string) {
  const offset = clientId.length % 3;
  const cyclePhase = (cycleNumber + offset) % 6;

  if (cyclePhase === 0) {
    return "Review overdue";
  }
  if (cyclePhase <= 2) {
    return "Review due soon";
  }
  return "Service cadence on track";
}

function crmCadenceDetail(cycleNumber: number, clientId: string) {
  const offset = clientId.length % 3;
  const cyclePhase = (cycleNumber + offset) % 6;

  if (cyclePhase === 0) {
    return "Open follow-up item needs attention this cycle.";
  }
  if (cyclePhase <= 2) {
    return "Prep review notes and refresh suitability talking points.";
  }
  return "No urgent CRM action is due right now.";
}

function bankLendingFile(clientId: string) {
  const files: Record<string, { score: number | null; band: string; summary: string }> = {
    retiree: { score: 641, band: "Fair", summary: "Fixed-income borrower | reserve-backed but income constrained" },
    young_pro: { score: 586, band: "Fair", summary: "Thin credit depth | high revolving pressure" },
    family: { score: 692, band: "Good", summary: "Prime-near-prime household | conditional capacity review" },
    first_home_family: { score: 622, band: "Fair", summary: "First-home borrower | reserve and DTI conditions required" },
    entrepreneur: { score: 711, band: "Good", summary: "Owner-guarantor file | business cash-flow review required" },
    institutional: { score: null, band: "Business grade A-", summary: "Commercial credit file | DSCR, liquidity, covenants, and collateral control the decision" }
  };

  return files[clientId] ?? null;
}

export function ClientRoster({ mode = "default", showPlayerAccount = true }: ClientRosterProps) {
  const clients = useGameStore((state) => state.clients);
  const personalPortfolioUsd = useGameStore((state) => state.personalPortfolioUsd);
  const personalHoldings = useGameStore((state) => state.personalHoldings);
  const personalShortHoldings = useGameStore((state) => state.personalShortHoldings);
  const personalMarginDebt = useGameStore((state) => state.personalMarginDebt);
  const personalMarginCall = useGameStore((state) => state.personalMarginCall);
  const playerTradeStatus = useGameStore((state) => state.playerTradeStatus);
  const playerComplianceLevel = useGameStore((state) => state.playerComplianceLevel);
  const activeClientId = useGameStore((state) => state.activeClientId);
  const questionBankStatus = useGameStore((state) => state.questionBankStatus);
  const tickers = useGameStore((state) => state.tickers);
  const cycleNumber = useGameStore((state) => state.cycleNumber);
  const selectClient = useGameStore((state) => state.selectClient);
  const playerBeta = calculatePortfolioBeta(personalHoldings, personalShortHoldings, tickers);
  const visibleClients = clients.filter((client) => {
    if (mode === "mortgage") {
      return client.lendingProfile.underwritingTrack === "Mortgage" || client.mortgageProfile.occupancy !== "Not Applicable";
    }
    if (mode === "lending") {
      return client.lendingProfile.underwritingTrack !== "Institutional" || client.id === "institutional";
    }
    return true;
  }).sort((left, right) => {
    if (mode === "mortgage") {
      if (left.id === "first_home_family") {
        return -1;
      }
      if (right.id === "first_home_family") {
        return 1;
      }
    }
    return 0;
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Client Roster</h2>
        <span className="panel-meta">
          {questionBankStatus === "loading" ? "Bank loading" : "Ready"}
        </span>
      </div>
      <div className="client-list">
        <div className="client-section-label">Client Accounts</div>
        {visibleClients.map((client) => {
          const accountUsd = computeAccountUsd(client, tickers);
          const accountDelta = accountUsd - client.startingAum;
          const accountBeta = calculatePortfolioBeta(client.holdings, client.shortHoldings ?? {}, tickers);
          const retirementIncome = buildRetirementIncomeSnapshot(client, tickers);
          const policyReview = buildPolicyReviewSnapshot(client, tickers, cycleNumber);
          const revenue = annualizedRevenue(accountUsd, client.revenueProfile.advisoryFeeBps);
          const mandateLabel =
            client.mandateScore >= 72 ? "Mandate fit strong" : client.mandateScore >= 50 ? "Mandate fit mixed" : "Mandate drifting";
          const crmCadence = crmCadenceLabel(cycleNumber, client.id);
          const crmDetail = crmCadenceDetail(cycleNumber, client.id);
          const lendingFile = bankLendingFile(client.id);

          return (
            <button
              key={client.id}
              className={`client-card ${client.id === activeClientId ? "active" : ""}`}
              disabled={questionBankStatus === "loading"}
              onClick={() => selectClient(client.id)}
            >
              <div className="client-card-top">
                <span className="avatar">{client.avatar}</span>
                <span className={`status-dot ${client.status}`} />
              </div>
              <strong>{client.name}</strong>
              <span>{client.accountType}</span>
              <span>{client.ageLabel}</span>
              <span>{client.riskProfile}</span>
              <span className="client-card-goal">{client.goal}</span>
              <span className="client-card-money">{formatCurrency(accountUsd)}</span>
              {mode === "mortgage" ? (
                <>
                  <span className="client-card-trust">
                    Credit {client.creditProfile.score} | {client.creditProfile.scoreBand} | {client.mortgageProfile.occupancy}
                  </span>
                  <span className="client-card-trust">
                    Housing: {formatCompactUsd(client.debtProfile.housingPayment)} /mo | Rate {(client.debtProfile.mortgageRate * 100).toFixed(2)}% | {client.debtProfile.mortgageTermYearsRemaining} yrs
                  </span>
                  <span className="client-card-trust">
                    Debt: {formatCompactUsd(client.cashFlow.monthlyDebtPayments)} /mo | Reserve target {client.cashFlow.emergencyReserveMonths} months
                  </span>
                  <span className="client-card-note">{client.lendingProfile.requestedLoanPurpose}</span>
                </>
              ) : mode === "lending" ? (
                <>
                  <span className="client-card-trust">
                    {lendingFile?.score === null
                      ? lendingFile.band
                      : `Credit ${lendingFile?.score ?? client.creditProfile.score} | ${lendingFile?.band ?? client.creditProfile.scoreBand}`} | DTI {(client.cashFlow.monthlyIncome > 0 ? ((client.cashFlow.monthlyDebtPayments + client.debtProfile.housingPayment) / client.cashFlow.monthlyIncome) * 100 : 0).toFixed(0)}%
                  </span>
                  <span className="client-card-trust">
                    Track: {client.lendingProfile.underwritingTrack} | Collateral: {client.lendingProfile.collateralStrength}
                  </span>
                  {lendingFile ? <span className="client-card-trust">{lendingFile.summary}</span> : null}
                  <span className="client-card-note">{client.lendingProfile.requestedLoanPurpose}</span>
                </>
              ) : (
                <>
                  <span className={accountDelta >= 0 ? "up" : "down"}>
                    {accountDelta >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(accountDelta))}
                  </span>
                  <span className="client-card-trust">{formatBeta(accountBeta)} | {betaFitLabel(accountBeta, client.riskProfile)}</span>
                  <span className="client-card-trust">
                    Cash flow: {formatCompactUsd(client.cashFlow.monthlyIncome)} in | {formatCompactUsd(client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments)} out
                  </span>
                  <span className="client-card-trust">
                    Tax: {client.taxProfile.taxBracketLabel} | Liquidity: {client.cashFlow.nearTermLiquidityNeed}
                  </span>
                  <span className="client-card-trust">
                    Revenue: {formatCompactUsd(revenue)}/yr | {client.revenueProfile.serviceTier}
                  </span>
                  <span className="client-card-trust">
                    CRM: {client.crmProfile.nextReviewWindow} | {crmCadence}
                  </span>
                  <span className="client-card-trust">
                    Follow-up: {client.crmProfile.nextTask}
                  </span>
                  <span className="client-card-note">{crmDetail}</span>
                  <span className="client-card-trust">
                    IPS: {client.investmentPolicy.equityRangeLabel ?? "Policy active"} | {policyReview.dueLabel}
                  </span>
                  {retirementIncome.applicable ? (
                    <span className="client-card-trust">
                      {retirementIncome.mode === "spending-rule"
                        ? `Spending support: ${(retirementIncome.withdrawalRate * 100).toFixed(1)}% draw | ${retirementIncome.sustainabilityLabel}`
                        : `Income gap: ${formatCurrency(retirementIncome.monthlyShortfall)}/mo | ${retirementIncome.runwayLabel}`}
                    </span>
                  ) : null}
                  <span className="client-card-trust">
                    Benefits: {client.benefitsProfile.primaryPlan}
                  </span>
                  <span className="client-card-trust">
                    Account home: {client.accountStructure.registration}
                  </span>
                  {client.educationPlanning.active ? (
                    <span className="client-card-trust">
                      Education: {client.educationPlanning.targetYears}
                    </span>
                  ) : null}
                  <span className="client-card-trust">
                    Estate: {client.estateProfile.coreDocuments[0]} | {client.estateProfile.beneficiaryReview}
                  </span>
                  <span className="client-card-trust">
                    Supervision: {client.supervisionProfile.reviewLevel}
                  </span>
                  <span className="client-card-trust">
                    Insurance gap: {client.insuranceGapScore}/100 | {client.insuranceCoverage.length}/{client.insuranceNeeds.length} addressed
                  </span>
                  {(client.marginDebt > 0 || client.marginCall || Object.keys(client.shortHoldings ?? {}).length > 0) ? (
                    <span className={client.marginCall ? "down" : "client-card-trust"}>
                      Margin: {formatCurrency(client.marginDebt ?? 0)} debt | {Object.keys(client.shortHoldings ?? {}).length} short | {client.marginCall ? "Call active" : "Stable"}
                    </span>
                  ) : null}
                  <span className="client-card-trust">Trust: {client.trustScore}/100 | {relationshipBand(client.trustScore)}</span>
                  <span className="client-card-note">{client.advisorNote}</span>
                  <span className="client-card-note">{policyReview.ipsAlignmentNote}</span>
                </>
              )}
              <div className="client-progress">
                <div className="client-progress-track">
                  <div className="client-progress-fill" style={{ width: `${client.mandateScore}%` }} />
                </div>
                <span>{mandateLabel}</span>
              </div>
            </button>
          );
        })}
        {showPlayerAccount ? (
          <>
            <div className="client-section-label">Player Account</div>
            <button
              type="button"
              className={`client-card player-card ${activeClientId === "player" ? "active" : ""}`}
              disabled={questionBankStatus === "loading"}
              onClick={() => void selectClient("player")}
            >
              <div className="client-card-top">
                <span className="avatar player-avatar">P</span>
                <span className="status-dot satisfied" />
              </div>
              <strong>Your Portfolio</strong>
              <span>Self-Directed Trading</span>
              <span className="client-card-money">Cash Available: {formatCurrency(personalPortfolioUsd)}</span>
              <span>{Object.keys(personalHoldings).length} long | {Object.keys(personalShortHoldings).length} short</span>
              <span className="client-card-trust">{formatBeta(playerBeta)} | self-directed risk</span>
              <span className={personalMarginCall ? "down" : "client-card-trust"}>Margin Debt: {formatCurrency(personalMarginDebt)} | {personalMarginCall ? "Call active" : "Stable"}</span>
              <span>Status: {playerTradeStatus}</span>
              <span>Compliance: {playerComplianceLevel}%</span>
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
