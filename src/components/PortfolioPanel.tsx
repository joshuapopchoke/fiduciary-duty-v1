import { useMemo } from "react";
import { INSURANCE_PRODUCTS } from "../data/insuranceProducts";
import {
  buildBenefitsSnapshot,
  buildCrmWorkflowSnapshot,
  buildEstatePlanningSnapshot,
  buildProductComparisonSnapshot,
  buildRetirementMathSnapshot,
  buildSupervisionSnapshot
} from "../engine/holisticPlanningEngine";
import { buildPortfolioAnalyticsSnapshot } from "../engine/marketAnalyticsEngine";
import { betaFitLabel, betaRangeForRisk, calculatePortfolioBeta } from "../engine/portfolioAnalytics";
import { buildPolicyReviewSnapshot } from "../engine/policyReviewEngine";
import { buildSocialSecurityCalculator } from "../engine/plannerCalculatorEngine";
import { buildRebalancePlan } from "../engine/rebalancingEngine";
import { buildRecommendationCards } from "../engine/recommendationEngine";
import { buildRetirementIncomeSnapshot } from "../engine/retirementIncomeEngine";
import { buildTaxManagementSnapshot } from "../engine/taxManagementEngine";
import { buildAdvancedTaxPlanningSnapshot, estimatePortfolioTaxSnapshot } from "../engine/taxEngine";
import { useGameStore } from "../store/gameStore";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatSignedCurrency(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

function computeEquity(cash: number, longValue: number, shortValue: number, debt: number) {
  return cash + longValue - shortValue - debt;
}

function annualizedRevenue(accountUsd: number, feeBps: number) {
  return accountUsd * feeBps / 10000;
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
  return "Cadence on track";
}

export function PortfolioPanel() {
  const clients = useGameStore((state) => state.clients);
  const activeClientId = useGameStore((state) => state.activeClientId);
  const personalPortfolioUsd = useGameStore((state) => state.personalPortfolioUsd);
  const personalAccountSleeves = useGameStore((state) => state.personalAccountSleeves);
  const personalSleeveCashBalances = useGameStore((state) => state.personalSleeveCashBalances);
  const personalHoldings = useGameStore((state) => state.personalHoldings);
  const personalHoldingAccountMap = useGameStore((state) => state.personalHoldingAccountMap);
  const personalShortHoldings = useGameStore((state) => state.personalShortHoldings);
  const personalShortHoldingAccountMap = useGameStore((state) => state.personalShortHoldingAccountMap);
  const personalMarginDebt = useGameStore((state) => state.personalMarginDebt);
  const personalMarginCall = useGameStore((state) => state.personalMarginCall);
  const tickers = useGameStore((state) => state.tickers);
  const cycleNumber = useGameStore((state) => state.cycleNumber);
  const startInsuranceRecommendation = useGameStore((state) => state.startInsuranceRecommendation);
  const startRecommendationDialogue = useGameStore((state) => state.startRecommendationDialogue);
  const startClientReviewMeeting = useGameStore((state) => state.startClientReviewMeeting);
  const startOperationsWorkflow = useGameStore((state) => state.startOperationsWorkflow);
  const executeEducationFundingPlan = useGameStore((state) => state.executeEducationFundingPlan);
  const runTaxManagementAction = useGameStore((state) => state.runTaxManagementAction);
  const deferInsurance = useGameStore((state) => state.deferInsurance);
  const rebalanceActiveClient = useGameStore((state) => state.rebalanceActiveClient);
  const openPersonalAccount = useGameStore((state) => state.openPersonalAccount);
  const isPlayerBook = activeClientId === "player";
  const activeClient = useMemo(
    () => clients.find((client) => client.id === activeClientId) ?? null,
    [clients, activeClientId]
  );

  const playerRows = useMemo(() => Object.values(personalHoldings).map((holding) => {
    const ticker = tickers[holding.ticker];
    const currentPrice = ticker?.price ?? 0;
    const marketValue = currentPrice * holding.shares;
    const costBasis = holding.averageCost * holding.shares;
    const unrealized = marketValue - costBasis;

    return {
      key: `player-${holding.ticker}`,
      owner: "Player",
      ticker: holding.ticker,
      name: ticker?.name ?? holding.ticker,
      shares: holding.shares,
      averageCost: holding.averageCost,
      currentPrice,
      marketValue,
      unrealized,
      beta: ticker?.beta ?? 0
    };
  }), [personalHoldings, tickers]);

  const clientRows = useMemo(() => {
    if (!activeClient) {
      return [];
    }

    return Object.values(activeClient.holdings).map((holding) => {
      const ticker = tickers[holding.ticker];
      const currentPrice = ticker?.price ?? 0;
      const marketValue = currentPrice * holding.shares;
      const costBasis = holding.averageCost * holding.shares;
      const unrealized = marketValue - costBasis;

      return {
        key: `${activeClient.id}-${holding.ticker}`,
        owner: activeClient.name,
        ticker: holding.ticker,
        name: ticker?.name ?? holding.ticker,
        shares: holding.shares,
        averageCost: holding.averageCost,
        currentPrice,
        marketValue,
        unrealized,
        beta: ticker?.beta ?? 0,
        category: ticker?.category ?? "stocks",
        creditRating: ticker?.creditRating ?? null,
        duration: ticker?.modifiedDuration ?? null
      };
    });
  }, [activeClient, tickers]);
  const playerSleeveRows = useMemo(() => {
    return personalAccountSleeves.map((sleeve) => {
      const sleeveRows = Object.entries(personalHoldings)
        .filter(([holdingKey]) => (personalHoldingAccountMap[holdingKey] ?? personalAccountSleeves[0]?.id) === sleeve.id)
        .map(([holdingKey, holding]) => {
          const ticker = tickers[holding.ticker];
          const currentPrice = ticker?.price ?? 0;
          const marketValue = currentPrice * holding.shares;
          const costBasis = holding.averageCost * holding.shares;
          const unrealized = marketValue - costBasis;

          return {
            key: `player-${sleeve.id}-${holdingKey}`,
            ticker: holding.ticker,
            name: ticker?.name ?? holding.ticker,
            shares: holding.shares,
            averageCost: holding.averageCost,
            currentPrice,
            marketValue,
            unrealized,
            beta: ticker?.beta ?? 0,
            category: ticker?.category ?? "stocks",
            creditRating: ticker?.creditRating ?? null,
            duration: ticker?.modifiedDuration ?? null
          };
        });

      const sleeveMarketValue = sleeveRows.reduce((sum, row) => sum + row.marketValue, 0);
      const sleeveShortValue = Object.entries(personalShortHoldings)
        .filter(([holdingKey]) => (personalShortHoldingAccountMap[holdingKey] ?? personalAccountSleeves[0]?.id) === sleeve.id)
        .reduce((sum, [, holding]) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
      const sleeveUnrealized = sleeveRows.reduce((sum, row) => sum + row.unrealized, 0);
      const sleeveCash = personalSleeveCashBalances[sleeve.id] ?? 0;
      const sleeveTotal = sleeveCash + sleeveMarketValue - sleeveShortValue;

      return {
        sleeve,
        rows: sleeveRows,
        sleeveCash,
        sleeveMarketValue,
        sleeveShortValue,
        sleeveTotal,
        sleeveUnrealized
      };
    });
  }, [personalAccountSleeves, personalHoldingAccountMap, personalHoldings, personalShortHoldingAccountMap, personalShortHoldings, personalSleeveCashBalances, tickers]);
  const clientSleeveRows = useMemo(() => {
    if (!activeClient) {
      return [];
    }

    return activeClient.accountSleeves.map((sleeve) => {
      const sleeveRows = Object.entries(activeClient.holdings)
        .filter(([holdingKey]) => (activeClient.holdingAccountMap[holdingKey] ?? activeClient.accountSleeves[0]?.id) === sleeve.id)
        .map(([holdingKey, holding]) => {
          const ticker = tickers[holding.ticker];
          const currentPrice = ticker?.price ?? 0;
          const marketValue = currentPrice * holding.shares;
          const costBasis = holding.averageCost * holding.shares;
          const unrealized = marketValue - costBasis;

          return {
            key: `${activeClient.id}-${sleeve.id}-${holdingKey}`,
            ticker: holding.ticker,
            name: ticker?.name ?? holding.ticker,
            shares: holding.shares,
            averageCost: holding.averageCost,
            currentPrice,
            marketValue,
            unrealized,
            beta: ticker?.beta ?? 0,
            category: ticker?.category ?? "stocks",
            creditRating: ticker?.creditRating ?? null,
            duration: ticker?.modifiedDuration ?? null
          };
        });

      const sleeveMarketValue = sleeveRows.reduce((sum, row) => sum + row.marketValue, 0);
      const sleeveShortValue = Object.entries(activeClient.shortHoldings ?? {})
        .filter(([holdingKey]) => (activeClient.shortHoldingAccountMap[holdingKey] ?? activeClient.accountSleeves[0]?.id) === sleeve.id)
        .reduce((sum, [, holding]) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
      const sleeveUnrealized = sleeveRows.reduce((sum, row) => sum + row.unrealized, 0);
      const sleeveCash = activeClient.sleeveCashBalances[sleeve.id] ?? 0;
      const sleeveTotal = sleeveCash + sleeveMarketValue - sleeveShortValue;

      return {
        sleeve,
        rows: sleeveRows,
        sleeveCash,
        sleeveMarketValue,
        sleeveShortValue,
        sleeveTotal,
        sleeveUnrealized
      };
    });
  }, [activeClient, tickers]);

  const playerMarketValue = useMemo(() => playerRows.reduce((sum, row) => sum + row.marketValue, 0), [playerRows]);
  const playerUnrealized = useMemo(() => playerRows.reduce((sum, row) => sum + row.unrealized, 0), [playerRows]);
  const clientUnrealized = useMemo(() => clientRows.reduce((sum, row) => sum + row.unrealized, 0), [clientRows]);
  const activeClientUsd = useMemo(() => {
    if (!activeClient) {
      return 0;
    }

    return (
      activeClient.cash +
      Object.values(activeClient.holdings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0) -
      Object.values(activeClient.shortHoldings ?? {}).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0) -
      (activeClient.marginDebt ?? 0)
    );
  }, [activeClient, tickers]);
  const playerShortValue = useMemo(
    () => Object.values(personalShortHoldings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0),
    [personalShortHoldings, tickers]
  );
  const playerNetEquity = useMemo(
    () => computeEquity(personalPortfolioUsd, playerMarketValue, playerShortValue, personalMarginDebt),
    [personalPortfolioUsd, playerMarketValue, playerShortValue, personalMarginDebt]
  );
  const playerBeta = useMemo(
    () => calculatePortfolioBeta(personalHoldings, personalShortHoldings, tickers),
    [personalHoldings, personalShortHoldings, tickers]
  );
  const clientBeta = useMemo(
    () => activeClient ? calculatePortfolioBeta(activeClient.holdings, activeClient.shortHoldings ?? {}, tickers) : 0,
    [activeClient, tickers]
  );
  const insuranceCards = useMemo(() => {
    if (!activeClient) {
      return [];
    }

    return INSURANCE_PRODUCTS.map((product) => {
      const needed = activeClient.insuranceNeeds.includes(product.id);
      const covered = activeClient.insuranceCoverage.includes(product.id);
      return { product, needed, covered };
    })
      .sort((left, right) => Number(right.needed) - Number(left.needed) || Number(left.covered) - Number(right.covered))
      .slice(0, 4);
  }, [activeClient]);
  const clientTaxSnapshot = useMemo(
    () => activeClient ? estimatePortfolioTaxSnapshot(activeClient, activeClient.holdings, tickers) : null,
    [activeClient, tickers]
  );
  const retirementIncomeSnapshot = useMemo(
    () => activeClient ? buildRetirementIncomeSnapshot(activeClient, tickers) : null,
    [activeClient, tickers]
  );
  const rebalancePlan = useMemo(
    () => activeClient ? buildRebalancePlan(activeClient, tickers) : null,
    [activeClient, tickers]
  );
  const benefitsSnapshot = useMemo(
    () => activeClient ? buildBenefitsSnapshot(activeClient) : null,
    [activeClient]
  );
  const crmSnapshot = useMemo(
    () => activeClient ? buildCrmWorkflowSnapshot(activeClient) : null,
    [activeClient]
  );
  const productComparisonSnapshot = useMemo(
    () => activeClient ? buildProductComparisonSnapshot(activeClient) : null,
    [activeClient]
  );
  const supervisionSnapshot = useMemo(
    () => activeClient ? buildSupervisionSnapshot(activeClient) : null,
    [activeClient]
  );
  const estateSnapshot = useMemo(
    () => activeClient ? buildEstatePlanningSnapshot(activeClient) : null,
    [activeClient]
  );
  const policyReview = useMemo(
    () => activeClient ? buildPolicyReviewSnapshot(activeClient, tickers, cycleNumber) : null,
    [activeClient, tickers, cycleNumber]
  );
  const planningRatios = useMemo(() => {
    if (!activeClient) {
      return null;
    }

    const debtServiceRatio =
      activeClient.cashFlow.monthlyIncome > 0
        ? ((activeClient.cashFlow.monthlyDebtPayments / activeClient.cashFlow.monthlyIncome) * 100)
        : 0;
    const reserveGap =
      (activeClient.cashFlow.monthlyExpenses + activeClient.cashFlow.monthlyDebtPayments) * activeClient.cashFlow.emergencyReserveMonths - activeClient.cash;

    return {
      debtServiceRatio,
      reserveGap
    };
  }, [activeClient]);
  const advancedTaxSnapshot = useMemo(
    () => activeClient && clientTaxSnapshot ? buildAdvancedTaxPlanningSnapshot(activeClient, clientTaxSnapshot) : null,
    [activeClient, clientTaxSnapshot]
  );
  const taxManagementSnapshot = useMemo(
    () => activeClient ? buildTaxManagementSnapshot(activeClient, tickers) : null,
    [activeClient, tickers]
  );
  const retirementMathSnapshot = useMemo(
    () => activeClient ? buildRetirementMathSnapshot(activeClient, activeClientUsd) : null,
    [activeClient, activeClientUsd]
  );
  const socialSecuritySnapshot = useMemo(
    () => activeClient ? buildSocialSecurityCalculator(activeClient) : null,
    [activeClient]
  );
  const crmCadence = useMemo(
    () => activeClient ? crmCadenceLabel(cycleNumber, activeClient.id) : null,
    [activeClient, cycleNumber]
  );
  const activeTraditionalIraSleeve = useMemo(
    () => activeClient?.accountSleeves.find((sleeve) => sleeve.registration.includes("Traditional IRA")) ?? null,
    [activeClient]
  );
  const recommendationCards = useMemo(
    () => activeClient ? buildRecommendationCards(activeClient) : [],
    [activeClient]
  );
  const portfolioAnalytics = useMemo(
    () => activeClient ? buildPortfolioAnalyticsSnapshot(activeClient, tickers) : null,
    [activeClient, tickers]
  );
  const missingPlayerAccounts = useMemo(
    () => [
      { id: "401k" as const, label: "Open 401(k)" },
      { id: "traditional-ira" as const, label: "Open Traditional IRA" },
      { id: "roth-ira" as const, label: "Open Roth IRA" }
    ].filter((option) => !personalAccountSleeves.some((sleeve) =>
      sleeve.id === (option.id === "401k" ? "player-401k" : option.id === "traditional-ira" ? "player-traditional-ira" : "player-roth-ira")
    )),
    [personalAccountSleeves]
  );

  return (
    <div className="side-panel portfolio-panel">
      {isPlayerBook ? (
        <>
          <div className="portfolio-summary-grid">
            <div className="portfolio-summary-card">
              <span>Player Cash</span>
              <strong>{formatCurrency(personalPortfolioUsd)}</strong>
              <small>{Object.keys(personalHoldings).length} long | {Object.keys(personalShortHoldings).length} short</small>
            </div>
            <div className="portfolio-summary-card">
              <span>Player Beta</span>
              <strong>{playerBeta.toFixed(2)}</strong>
              <small className={playerUnrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(playerUnrealized)} unrealized</small>
            </div>
            <div className="portfolio-summary-card">
              <span>Margin / Equity</span>
              <strong>{formatCurrency(playerNetEquity)}</strong>
              <small className={personalMarginCall ? "down" : "client-card-trust"}>
                {personalMarginCall ? "Margin call active" : `${formatCurrency(personalMarginDebt)} margin debt`}
              </small>
            </div>
          </div>

          <div className="portfolio-section">
            <div className="portfolio-section-title">Player Portfolio</div>
            {missingPlayerAccounts.length > 0 ? (
              <div className="insurance-actions">
                {missingPlayerAccounts.map((option) => (
                  <button key={option.id} className="control-btn" type="button" onClick={() => openPersonalAccount(option.id)}>
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="portfolio-table">
              {playerSleeveRows.map(({ sleeve, rows, sleeveCash, sleeveMarketValue, sleeveTotal, sleeveUnrealized }) => (
                <div className="portfolio-section" key={sleeve.id}>
                  <div className="portfolio-summary-card">
                    <span>{sleeve.label}</span>
                    <strong>{sleeve.registration}</strong>
                    <small>{sleeve.taxTreatment}{sleeve.beneficiaryRequired ? " | beneficiary tracked" : ""}</small>
                  </div>
                  {rows.length === 0 ? (
                    <div className="empty-state">No positions yet in this sleeve. Route trades here from the ticket to compare how taxable and retirement accounts behave.</div>
                  ) : (
                    rows.map((row) => (
                      <div className="portfolio-row portfolio-row--stacked" key={row.key}>
                        <strong>{row.ticker}</strong>
                        <span>{row.name}</span>
                        <span>{row.shares} sh</span>
                        <span>{row.category === "bonds" || row.category === "fixedIncome"
                          ? `${row.creditRating ?? "Unrated"} | Dur ${row.duration?.toFixed(1) ?? "--"}`
                          : `Beta ${row.beta.toFixed(2)}`}</span>
                        <span>{formatCurrency(row.averageCost)}</span>
                        <span>{formatCurrency(row.currentPrice)}</span>
                        <span>{formatCurrency(row.marketValue)}</span>
                        <span className={row.unrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(row.unrealized)}</span>
                      </div>
                    ))
                  )}
                  <div className="portfolio-summary-card">
                    <span>{sleeve.label} breakdown</span>
                    <strong>{formatCurrency(sleeveCash)} cash | {formatCurrency(sleeveMarketValue)} invested</strong>
                    <small className={sleeveUnrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(sleeveUnrealized)} unrealized | {formatCurrency(sleeveTotal)} total</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {activeClient ? (
      <div className="portfolio-section">
        <div className="portfolio-summary-grid">
          <div className="portfolio-summary-card">
            <span>{activeClient.name} USD</span>
            <strong>{formatCurrency(activeClientUsd)}</strong>
            <small className={clientUnrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(clientUnrealized)} unrealized</small>
          </div>
          <div className="portfolio-summary-card">
            <span>{activeClient.name.split(" ")[0]} Beta</span>
            <strong>{clientBeta.toFixed(2)}</strong>
            <small className="client-card-trust">{betaFitLabel(clientBeta, activeClient.riskProfile)} | target {betaRangeForRisk(activeClient.riskProfile).label}</small>
          </div>
          <div className="portfolio-summary-card">
            <span>Mandate / Trust</span>
            <strong>{activeClient.mandateScore}/100 mandate</strong>
            <small className="client-card-trust">{activeClient.trustScore}/100 trust | {activeClient.goal}</small>
          </div>
        </div>
        <div className="portfolio-section-title">{activeClient ? `${activeClient.name} Portfolio` : "Client Portfolio"}</div>
          <div className="portfolio-table">
            {clientSleeveRows.map(({ sleeve, rows, sleeveCash, sleeveMarketValue, sleeveTotal, sleeveUnrealized }) => (
              <div className="portfolio-section" key={sleeve.id}>
                <div className="portfolio-summary-card">
                  <span>{sleeve.label}</span>
                  <strong>{sleeve.registration}</strong>
                  <small>{sleeve.taxTreatment}{sleeve.beneficiaryRequired ? " | beneficiary tracked" : ""}</small>
                </div>
                {rows.length === 0 ? (
                  <div className="empty-state">No positions yet in this sleeve. Route trades here from the ticket to build it out.</div>
                ) : (
                  rows.map((row) => (
                    <div className="portfolio-row portfolio-row--stacked" key={row.key}>
                      <strong>{row.ticker}</strong>
                      <span>{row.name}</span>
                      <span>{row.shares} sh</span>
                      <span>{row.category === "bonds" || row.category === "fixedIncome"
                        ? `${row.creditRating ?? "Unrated"} | Dur ${row.duration?.toFixed(1) ?? "--"}`
                        : `Beta ${row.beta.toFixed(2)}`}</span>
                      <span>{formatCurrency(row.averageCost)}</span>
                      <span>{formatCurrency(row.currentPrice)}</span>
                      <span>{formatCurrency(row.marketValue)}</span>
                      <span className={row.unrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(row.unrealized)}</span>
                    </div>
                  ))
                )}
                <div className="portfolio-summary-card">
                  <span>{sleeve.label} breakdown</span>
                  <strong>{formatCurrency(sleeveCash)} cash | {formatCurrency(sleeveMarketValue)} invested</strong>
                  <small className={sleeveUnrealized >= 0 ? "up" : "down"}>{formatSignedCurrency(sleeveUnrealized)} unrealized | {formatCurrency(sleeveTotal)} total</small>
                </div>
              </div>
            ))}
          </div>
      </div>
      ) : null}

      {activeClient ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Planning & IPS</div>
          <div className="portfolio-summary-card">
            <span>Cash-flow picture</span>
            <strong>
              {formatCurrency(activeClient.cashFlow.monthlyIncome)} in | {formatCurrency(activeClient.cashFlow.monthlyExpenses + activeClient.cashFlow.monthlyDebtPayments)} out
            </strong>
            <small>
              Reserve target: {activeClient.cashFlow.emergencyReserveMonths} months | Liquidity need: {activeClient.cashFlow.nearTermLiquidityNeed}
            </small>
          </div>
          {planningRatios ? (
            <div className="portfolio-summary-card">
              <span>Cash-flow pressure</span>
              <strong>
                Debt service {planningRatios.debtServiceRatio.toFixed(0)}% | {planningRatios.reserveGap > 0 ? `${formatCurrency(planningRatios.reserveGap)} reserve gap` : "Reserve funded"}
              </strong>
              <small>Use this to judge whether the client needs liquidity support, debt paydown, or a steadier income sleeve before adding more risk.</small>
            </div>
          ) : null}
          <div className="portfolio-summary-card">
            <span>Credit and debt profile</span>
            <strong>{activeClient.creditProfile.score} {activeClient.creditProfile.scoreBand} | {formatCurrency(activeClient.debtProfile.creditCardBalance + activeClient.debtProfile.unsecuredDebt)} revolving</strong>
            <small>
              {activeClient.debtProfile.mortgageBalance > 0 ? `${formatCurrency(activeClient.debtProfile.mortgageBalance)} mortgage` : "No active mortgage"} | {activeClient.debtProfile.unpaidDebtBalance > 0 ? `${formatCurrency(activeClient.debtProfile.unpaidDebtBalance)} unpaid debt` : "No unpaid debt"}
            </small>
          </div>
          <div className="portfolio-summary-card">
            <span>Tax posture</span>
            <strong>{activeClient.taxProfile.taxBracketLabel}</strong>
            <small>{activeClient.taxProfile.accountTreatment}</small>
          </div>
          <div className="portfolio-summary-card">
            <span>Advisory economics</span>
            <strong>{formatCurrency(annualizedRevenue(activeClientUsd, activeClient.revenueProfile.advisoryFeeBps))}/yr</strong>
            <small>{activeClient.revenueProfile.serviceTier} | target {formatCurrency(activeClient.revenueProfile.annualRevenueTarget)}</small>
          </div>
          {clientTaxSnapshot ? (
            <div className="portfolio-summary-card">
              <span>Estimated tax drag</span>
              <strong>{clientTaxSnapshot.dragLabel}</strong>
              <small>{clientTaxSnapshot.summary}</small>
            </div>
          ) : null}
          {advancedTaxSnapshot ? (
            <>
              <div className="portfolio-summary-card">
                <span>Tax planning action</span>
                <strong>{advancedTaxSnapshot.assetLocationNote}</strong>
                <small>{advancedTaxSnapshot.harvestingLens}</small>
              </div>
              <div className="portfolio-summary-card">
                <span>Distribution tax lens</span>
                <strong>{advancedTaxSnapshot.withdrawalSequencingNote}</strong>
                <small>Use this with the account structure and tax-drag read before moving income-heavy assets.</small>
              </div>
            </>
          ) : null}
          {taxManagementSnapshot ? (
            <>
              <div className="portfolio-summary-card">
                <span>Tax management</span>
                <strong>
                  {formatCurrency(taxManagementSnapshot.unrealizedLossTotal)} losses | {formatCurrency(taxManagementSnapshot.netTaxableGain)} net gains
                </strong>
                <small>{taxManagementSnapshot.summary}</small>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    onClick={() => runTaxManagementAction(activeClient.id, "harvest-losses")}
                    type="button"
                  >
                    Review Harvest Candidates
                  </button>
                </div>
              </div>
              <div className="portfolio-summary-card">
                <span>Gain budget</span>
                <strong>{formatCurrency(taxManagementSnapshot.gainBudgetUsd)} annual room</strong>
                <small>{taxManagementSnapshot.gainBudgetLabel}</small>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    onClick={() => runTaxManagementAction(activeClient.id, "gain-budget")}
                    type="button"
                  >
                    Review Gain Budget
                  </button>
                </div>
              </div>
            </>
          ) : null}
          <div className="portfolio-summary-card">
            <span>Policy statement</span>
            <strong>{activeClient.investmentPolicy.objective}</strong>
            <small>{activeClient.investmentPolicy.timeHorizon} | {activeClient.investmentPolicy.liquidityNeeds}</small>
          </div>
          {policyReview ? (
            <div className="portfolio-summary-card">
              <span>IPS review</span>
              <strong>{policyReview.dueLabel}</strong>
              <small>{policyReview.reviewFocus}</small>
            </div>
          ) : null}
          {policyReview ? (
            <div className="portfolio-summary-card">
              <span>Policy guardrails</span>
              <strong>{policyReview.maxSinglePositionLabel}</strong>
              <small>
                {policyReview.prohibitedExposure.length > 0
                  ? `Watch prohibited exposure: ${policyReview.prohibitedExposure.join(" | ")}`
                  : `Avoid: ${activeClient.investmentPolicy.prohibitedStrategies.slice(0, 2).join(" | ")}`}
              </small>
            </div>
          ) : null}
          <div className="portfolio-summary-card">
            <span>Distribution profile</span>
            <strong>{activeClient.retirementDistribution.withdrawalApproach}</strong>
            <small>{activeClient.retirementDistribution.socialSecurityStrategy} | {activeClient.retirementDistribution.rmdStatus}</small>
          </div>
          {socialSecuritySnapshot && activeClient.id === "retiree" ? (
            <div className="portfolio-summary-card">
              <span>Social Security lens</span>
              <strong>
                62 {formatCurrency(socialSecuritySnapshot.age62Annual)} | FRA {formatCurrency(socialSecuritySnapshot.fullRetirementAnnual)} | 70 {formatCurrency(socialSecuritySnapshot.age70Annual)}
              </strong>
              <small>{socialSecuritySnapshot.recommendation}</small>
              <div className="insurance-actions">
                <button
                  className="control-btn"
                  onClick={() => startRecommendationDialogue(activeClient.id, "social-security-timing")}
                  type="button"
                >
                  Present Claiming Review
                </button>
              </div>
            </div>
          ) : null}
          {activeTraditionalIraSleeve && activeClient.id === "retiree" ? (
            <div className="portfolio-summary-card">
              <span>RMD execution</span>
              <strong>{activeTraditionalIraSleeve.label}: {formatCurrency(activeClient.sleeveCashBalances[activeTraditionalIraSleeve.id] ?? 0)}</strong>
              <small>Coordinate required distributions into the taxable reserve sleeve instead of pulling against the whole household bucket.</small>
              <div className="insurance-actions">
                <button
                  className="control-btn"
                  onClick={() => startOperationsWorkflow(activeClient.id, "rmd")}
                  type="button"
                >
                  Run RMD Workflow
                </button>
              </div>
            </div>
          ) : null}
          {retirementIncomeSnapshot?.applicable ? (
            <div className="portfolio-summary-card">
              <span>{retirementIncomeSnapshot.mode === "spending-rule" ? "Spending rule pressure" : "Retirement income pressure"}</span>
              <strong>
                {formatCurrency(retirementIncomeSnapshot.annualPortfolioIncome)}/yr income | {formatCurrency(retirementIncomeSnapshot.annualNeed)}/yr need
              </strong>
              <small>
                {retirementIncomeSnapshot.mode === "spending-rule"
                  ? `${(retirementIncomeSnapshot.withdrawalRate * 100).toFixed(1)}% net draw | ${retirementIncomeSnapshot.sustainabilityLabel}`
                  : `${formatCurrency(retirementIncomeSnapshot.monthlyShortfall)}/mo shortfall | ${retirementIncomeSnapshot.runwayLabel}`}
              </small>
            </div>
          ) : null}
          {retirementMathSnapshot ? (
            <div className="portfolio-summary-card">
              <span>Retirement math</span>
              <strong>Funded ratio {retirementMathSnapshot.fundedRatio.toFixed(2)}x | {formatCurrency(retirementMathSnapshot.annualGap)} gap</strong>
              <small>{retirementMathSnapshot.projectedLongevitySuccess} | {retirementMathSnapshot.summary}</small>
            </div>
          ) : null}
          <div className="portfolio-summary-card">
            <span>Constraints</span>
            <strong>{activeClient.investmentPolicy.constraints[0]}</strong>
            <small>
              Avoid: {activeClient.investmentPolicy.prohibitedStrategies.slice(0, 2).join(" | ")}
              {activeClient.investmentPolicy.spendingRule ? ` | ${activeClient.investmentPolicy.spendingRule}` : ""}
            </small>
          </div>
          {retirementIncomeSnapshot?.applicable ? (
            <div className="portfolio-summary-card">
              <span>Income lens</span>
              <strong>{retirementIncomeSnapshot.runwayLabel}</strong>
              <small>{retirementIncomeSnapshot.note}</small>
            </div>
          ) : null}
          {benefitsSnapshot ? (
            <div className="portfolio-summary-card">
              <span>{benefitsSnapshot.label}</span>
              <strong>{activeClient.benefitsProfile.primaryPlan}</strong>
              <small>{benefitsSnapshot.note}</small>
            </div>
          ) : null}
          {benefitsSnapshot ? (
            <div className="portfolio-summary-card">
              <span>Benefits action</span>
              <strong>{activeClient.benefitsProfile.hsaStrategy}</strong>
              <small>{benefitsSnapshot.action}</small>
            </div>
          ) : null}
          {estateSnapshot ? (
            <div className="portfolio-summary-card">
              <span>Estate lens</span>
              <strong>{estateSnapshot.label}</strong>
              <small>{estateSnapshot.note}</small>
            </div>
          ) : null}
          {estateSnapshot ? (
            <div className="portfolio-summary-card">
              <span>Estate action</span>
              <strong>{activeClient.estateProfile.coreDocuments.join(" | ")}</strong>
              <small>{estateSnapshot.action}</small>
            </div>
          ) : null}
          <div className="portfolio-summary-card">
            <span>Account structure</span>
            <strong>{activeClient.accountStructure.registration}</strong>
            <small>{activeClient.accountStructure.taxAdvantagedPriority}</small>
          </div>
          <div className="portfolio-summary-card">
            <span>Asset location lens</span>
            <strong>{activeClient.accountStructure.assetLocationNote}</strong>
            <small>Use account type and tax drag together when deciding where income-heavy versus low-drag assets belong.</small>
          </div>
          {activeClient.educationPlanning.active ? (
            <>
              <div className="portfolio-summary-card">
                <span>Education planning</span>
                <strong>{activeClient.educationPlanning.objective}</strong>
                <small>{activeClient.educationPlanning.targetYears}</small>
              </div>
              <div className="portfolio-summary-card">
                <span>Education action</span>
                <strong>{activeClient.educationPlanning.fundingPriority}</strong>
                <small>{activeClient.educationPlanning.planningNote}</small>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    onClick={() => executeEducationFundingPlan(activeClient.id)}
                    type="button"
                  >
                    Fund 529 Sleeve
                  </button>
                </div>
              </div>
            </>
          ) : null}
          {productComparisonSnapshot ? (
            <>
              <div className="portfolio-summary-card">
                <span>Product comparison</span>
                <strong>{productComparisonSnapshot.primaryNeed}</strong>
                <small>{productComparisonSnapshot.recommendedLane}</small>
              </div>
              <div className="portfolio-summary-card">
                <span>Lower-cost lane</span>
                <strong>{productComparisonSnapshot.lowerCostAlternative}</strong>
                <small>{productComparisonSnapshot.caution}</small>
              </div>
            </>
          ) : null}
          {crmSnapshot ? (
            <>
              <div className="portfolio-summary-card">
                <span>CRM workflow</span>
                <strong>{crmSnapshot.serviceModel}</strong>
                <small>{crmSnapshot.nextReviewWindow} | {crmCadence ?? "Cadence active"}</small>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    onClick={() => startClientReviewMeeting(activeClient.id)}
                    type="button"
                  >
                    Open Review Meeting
                  </button>
                </div>
              </div>
              <div className="portfolio-summary-card">
                <span>Relationship note</span>
                <strong>{crmSnapshot.nextTask}</strong>
                <small>{crmSnapshot.relationshipNote} Use this to frame follow-up, client experience, and future planning cadence.</small>
              </div>
            </>
          ) : null}
          {supervisionSnapshot ? (
            <>
              <div className="portfolio-summary-card">
                <span>Supervision</span>
                <strong>{supervisionSnapshot.reviewLevel}</strong>
                <small>{supervisionSnapshot.exceptionFocus}</small>
              </div>
              <div className="portfolio-summary-card">
                <span>Documentation focus</span>
                <strong>{supervisionSnapshot.documentationPriority}</strong>
                <small>{supervisionSnapshot.note}</small>
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {activeClient && portfolioAnalytics ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Market & Risk Analytics</div>
          <div className="portfolio-summary-card">
            <span>Benchmark and drawdown lens</span>
            <strong>{portfolioAnalytics.benchmarkRelative}</strong>
            <small>{portfolioAnalytics.drawdownBand} | Diversification score {portfolioAnalytics.diversificationScore}/100</small>
          </div>
          <div className="portfolio-summary-card">
            <span>Concentration watch</span>
            <strong>{portfolioAnalytics.largestPositionName} at {portfolioAnalytics.concentrationPct.toFixed(0)}%</strong>
            <small>{portfolioAnalytics.largestSector} leads at {portfolioAnalytics.largestSectorPct.toFixed(0)}% of the sleeve</small>
          </div>
          <div className="portfolio-table">
            {portfolioAnalytics.sleeveAllocation.map((row) => (
              <div className="portfolio-row portfolio-row--stacked" key={row.label}>
                <strong>{row.label}</strong>
                <span>{row.valuePct.toFixed(0)}% of account</span>
                <span>Weighted beta {portfolioAnalytics.weightedBeta.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeClient && recommendationCards.length > 0 ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Recommendation Workflow</div>
          <div className="insurance-grid">
            {recommendationCards.map((card) => (
              <div className="insurance-card" key={card.id}>
                <strong>{card.title}</strong>
                <small>{card.summary}</small>
                <p className="explanation">Follow-up task: {card.followUpTask}</p>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    onClick={() => startRecommendationDialogue(activeClient.id, card.id)}
                    type="button"
                  >
                    Present Recommendation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeClient && rebalancePlan ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Rebalancing & Drift</div>
          <div className="portfolio-summary-card">
            <span>Drift score</span>
            <strong>{rebalancePlan.driftScore.toFixed(0)}</strong>
            <small>{rebalancePlan.summary}</small>
          </div>
          <div className="portfolio-table">
            {rebalancePlan.rows.map((row) => (
              <div className="portfolio-row portfolio-row--stacked" key={row.bucket}>
                <strong>{row.bucket}</strong>
                <span>Target {(row.targetWeight * 100).toFixed(0)}%</span>
                <span>Current {(row.currentWeight * 100).toFixed(0)}%</span>
                <span className={row.drift <= 0 ? "up" : "down"}>{row.drift >= 0 ? "+" : ""}{(row.drift * 100).toFixed(0)}% drift</span>
              </div>
            ))}
          </div>
          <div className="portfolio-summary-card">
            <span>Action</span>
            <strong>{rebalancePlan.buySuggestions[0]?.name ?? "Maintain current posture"}</strong>
            <small>
              {rebalancePlan.sellSuggestions[0]
                ? `Trim ${rebalancePlan.sellSuggestions[0].name} and add ${rebalancePlan.buySuggestions[0]?.name ?? "core sleeves"}`
                : "Current sleeves are close enough to target that only minor tuning is needed."}
            </small>
          </div>
          <button className="primary-btn" type="button" onClick={() => rebalanceActiveClient()}>
            Rebalance Selected Client
          </button>
        </div>
      ) : null}

      {activeClient ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Client File Notes</div>
          <div className="portfolio-table">
            {activeClient.clientNotes.slice(0, 4).map((note, index) => (
              <div className="portfolio-summary-card" key={`${activeClient.id}-note-${index}`}>
                <span>Note {index + 1}</span>
                <small>{note}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeClient ? (
        <div className="portfolio-section">
          <div className="portfolio-section-title">Insurance Planning</div>
          <div className="portfolio-summary-card">
            <span>Planning note</span>
            <strong>{activeClient.insuranceNote}</strong>
            <small>{activeClient.ageLabel} | gap score {activeClient.insuranceGapScore}/100 | pressure {activeClient.insurancePressure}/100</small>
          </div>
          <div className="portfolio-summary-card">
            <span>Household age context</span>
            <strong>{activeClient.householdAges.join(" | ")}</strong>
            <small>Use age and life stage to judge whether a recommendation is urgent, optional, or premature.</small>
          </div>
          <div className="insurance-grid">
            {insuranceCards.map(({ product, needed, covered }) => (
              <div className="insurance-card" key={product.id}>
                <span className="insurance-tag">{needed ? "High-fit" : "Optional"}</span>
                <strong>{product.name}</strong>
                <small>{product.pitch}</small>
                <p className="explanation">{product.growthAngle}</p>
                <p className="explanation"><strong>Best fit:</strong> {product.bestFor}</p>
                <p className="explanation"><strong>Compare against:</strong> {product.compareAgainst}</p>
                <p className="explanation"><strong>Caution:</strong> {product.caution}</p>
                <div className="insurance-actions">
                  <button
                    className="control-btn"
                    disabled={covered}
                    onClick={() => startInsuranceRecommendation(activeClient.id, product.id)}
                    type="button"
                  >
                    {covered ? "Covered" : "Recommend"}
                  </button>
                  <button
                    className="control-btn"
                    onClick={() => deferInsurance(activeClient.id, product.id)}
                    type="button"
                  >
                    Hold
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
