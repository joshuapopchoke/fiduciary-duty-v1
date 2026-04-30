import type { ClientAccount, ClientHolding } from "../types/client";
import type { Ticker } from "../types/market";

export interface RetirementIncomeSnapshot {
  applicable: boolean;
  mode: "retirement-income" | "spending-rule" | "none";
  annualNeed: number;
  monthlyNeed: number;
  annualPortfolioIncome: number;
  monthlyShortfall: number;
  withdrawalRate: number;
  cashRunwayMonths: number | null;
  coverageRatio: number;
  sustainabilityLabel: string;
  runwayLabel: string;
  note: string;
  pressureScore: number;
}

function computeLongValue(holdings: Record<string, ClientHolding>, tickers: Record<string, Ticker>) {
  return Object.values(holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
}

function computeShortValue(holdings: Record<string, ClientHolding>, tickers: Record<string, Ticker>) {
  return Object.values(holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
}

function computeAccountValue(client: ClientAccount, tickers: Record<string, Ticker>) {
  const longValue = computeLongValue(client.holdings, tickers);
  const shortValue = computeShortValue(client.shortHoldings ?? {}, tickers);
  return Math.max(0, client.cash + longValue - shortValue - (client.marginDebt ?? 0));
}

function annualPortfolioIncome(client: ClientAccount, tickers: Record<string, Ticker>) {
  return Object.values(client.holdings).reduce((total, holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker?.dividendYield) {
      return total;
    }

    const marketValue = ticker.price * holding.shares;
    return total + (marketValue * ticker.dividendYield);
  }, 0);
}

function parseSpendingRuleRate(spendingRule: string | undefined) {
  if (!spendingRule) {
    return null;
  }

  const match = spendingRule.match(/(\d+(?:\.\d+)?)%/);
  if (!match) {
    return null;
  }

  return Number(match[1]) / 100;
}

function describeWithdrawalRate(withdrawalRate: number) {
  if (withdrawalRate <= 0.04) {
    return "sustainable";
  }
  if (withdrawalRate <= 0.055) {
    return "watchlist";
  }
  return "stretched";
}

function describeRunway(cashRunwayMonths: number | null) {
  if (cashRunwayMonths === null) {
    return "income-covered";
  }
  if (cashRunwayMonths >= 24) {
    return "ample runway";
  }
  if (cashRunwayMonths >= 12) {
    return "usable runway";
  }
  if (cashRunwayMonths >= 6) {
    return "thin runway";
  }
  return "urgent refill";
}

export function buildRetirementIncomeSnapshot(client: ClientAccount, tickers: Record<string, Ticker>): RetirementIncomeSnapshot {
  const accountValue = computeAccountValue(client, tickers);
  const portfolioIncome = annualPortfolioIncome(client, tickers);
  const monthlyOutflow = client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments;
  const monthlyGap = Math.max(0, monthlyOutflow - client.cashFlow.monthlyIncome);
  const spendingRuleRate = parseSpendingRuleRate(client.investmentPolicy.spendingRule);
  const spendingRuleNeed = spendingRuleRate ? accountValue * spendingRuleRate : 0;
  const retirementNeed = monthlyGap * 12;

  const annualNeed = spendingRuleRate ? spendingRuleNeed : retirementNeed;
  const monthlyNeed = spendingRuleRate ? spendingRuleNeed / 12 : monthlyGap;

  if (!spendingRuleRate && !client.investmentPolicy.retirementIncomeNeed && annualNeed <= 0) {
    return {
      applicable: false,
      mode: "none",
      annualNeed: 0,
      monthlyNeed: 0,
      annualPortfolioIncome: portfolioIncome,
      monthlyShortfall: 0,
      withdrawalRate: 0,
      cashRunwayMonths: null,
      coverageRatio: 1,
      sustainabilityLabel: "not-applicable",
      runwayLabel: "not-applicable",
      note: "This account is still in accumulation mode, so retirement-income pressure is limited.",
      pressureScore: 0
    };
  }

  const netAnnualDraw = Math.max(0, annualNeed - portfolioIncome);
  const withdrawalRate = accountValue > 0 ? netAnnualDraw / accountValue : 0;
  const coverageRatio = annualNeed > 0 ? portfolioIncome / annualNeed : 1;
  const cashRunwayMonths = monthlyNeed > 0 ? client.cash / monthlyNeed : null;
  const sustainabilityLabel = describeWithdrawalRate(withdrawalRate);
  const runwayLabel = describeRunway(cashRunwayMonths);
  const pressureScore = Math.max(0, Math.min(100,
    // Coverage gap component: full weight when income covers nothing, zero when fully covered
    (coverageRatio >= 1 ? 0 : (1 - coverageRatio) * 55) +
    // Withdrawal rate component: Bengen/Trinity research establishes 4% as the sustainable ceiling.
    // Each 1% above 4% materially increases failure probability — coefficient 1000 ensures
    // a 7% withdrawal rate (historically ~50% failure) generates dominant pressure (30 pts).
    // Previous coefficient of 700 was too low — 7% WR only contributed 21 pts.
    Math.max(0, (withdrawalRate - 0.04) * 1000) +
    // Cash runway shortfall: each month below emergency reserve target adds 2.5 pts
    (cashRunwayMonths !== null && cashRunwayMonths < client.cashFlow.emergencyReserveMonths
      ? (client.cashFlow.emergencyReserveMonths - cashRunwayMonths) * 2.5
      : 0)
  ));

  const mode = spendingRuleRate ? "spending-rule" : "retirement-income";
  const note = spendingRuleRate
    ? `This mandate needs about ${(spendingRuleRate * 100).toFixed(1)}% annual support. Current yield covers ${(coverageRatio * 100).toFixed(0)}% of that draw, so spending pressure is ${sustainabilityLabel}.`
    : `This household needs about $${monthlyGap.toLocaleString("en-US", { maximumFractionDigits: 0 })} per month from the portfolio after other income. Current yield covers ${(coverageRatio * 100).toFixed(0)}% of that need, so retirement pressure is ${sustainabilityLabel}.`;

  return {
    applicable: true,
    mode,
    annualNeed,
    monthlyNeed,
    annualPortfolioIncome: portfolioIncome,
    monthlyShortfall: Math.max(0, monthlyNeed - portfolioIncome / 12),
    withdrawalRate,
    cashRunwayMonths,
    coverageRatio,
    sustainabilityLabel,
    runwayLabel,
    note,
    pressureScore
  };
}
