import type { ClientHolding, RiskProfile } from "../types/client";
import type { Ticker } from "../types/market";
import { inferInstrumentBeta } from "./betaEngine";

export function getInstrumentBeta(ticker: Ticker | undefined) {
  if (!ticker) {
    return 0;
  }

  return inferInstrumentBeta(ticker);
}

export function calculatePortfolioBeta(
  holdings: Record<string, ClientHolding>,
  shortHoldings: Record<string, ClientHolding>,
  tickers: Record<string, Ticker>
) {
  const longEntries = Object.values(holdings).map((holding) => {
    const ticker = tickers[holding.ticker];
    const marketValue = (ticker?.price ?? 0) * holding.shares;
    return {
      marketValue,
      weightedBeta: marketValue * getInstrumentBeta(ticker)
    };
  });
  const shortEntries = Object.values(shortHoldings).map((holding) => {
    const ticker = tickers[holding.ticker];
    const marketValue = (ticker?.price ?? 0) * holding.shares;
    return {
      marketValue,
      weightedBeta: -marketValue * getInstrumentBeta(ticker)
    };
  });
  const grossExposure = [...longEntries, ...shortEntries].reduce((sum, entry) => sum + entry.marketValue, 0);

  if (grossExposure <= 0) {
    return 0;
  }

  const netWeightedBeta = [...longEntries, ...shortEntries].reduce((sum, entry) => sum + entry.weightedBeta, 0);
  return Number((netWeightedBeta / grossExposure).toFixed(2));
}

export function betaRangeForRisk(riskProfile: RiskProfile) {
  switch (riskProfile) {
    case "Conservative":
      return { min: 0.05, max: 0.55, label: "capital-preservation range" };
    case "Moderate":
      return { min: 0.35, max: 0.95, label: "balanced-growth range" };
    case "Moderate-Aggressive":
      return { min: 0.75, max: 1.2, label: "growth-with-risk range" };
    case "Aggressive":
      return { min: 0.95, max: 1.55, label: "high-growth range" };
    default:
      return { min: 0.25, max: 1, label: "target range" };
  }
}

export function betaFitLabel(beta: number, riskProfile: RiskProfile) {
  const range = betaRangeForRisk(riskProfile);

  if (beta === 0) {
    return "cash-heavy";
  }

  if (beta < range.min) {
    return "too defensive";
  }

  if (beta > range.max) {
    return "too volatile";
  }

  return "in range";
}
