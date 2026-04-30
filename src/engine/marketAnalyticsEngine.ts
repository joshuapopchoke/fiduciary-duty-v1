import type { ClientAccount, ClientHolding } from "../types/client";
import type { Ticker } from "../types/market";
import { inferInstrumentBeta } from "./betaEngine";

export interface PortfolioAnalyticsSnapshot {
  weightedBeta: number;
  concentrationPct: number;
  largestPositionName: string;
  largestSector: string;
  largestSectorPct: number;
  diversificationScore: number;
  benchmarkRelative: string;
  drawdownBand: string;
  sleeveAllocation: Array<{ label: string; valuePct: number }>;
}

function valueOfHolding(holding: ClientHolding, tickers: Record<string, Ticker>) {
  return (tickers[holding.ticker]?.price ?? 0) * holding.shares;
}

function categoryLabel(category: string) {
  switch (category) {
    case "stocks":
      return "Equities";
    case "funds":
      return "Funds";
    case "fixedIncome":
      return "Fixed Income";
    case "bonds":
      return "Bonds";
    case "forex":
      return "Forex";
    case "commodities":
      return "Commodities";
    case "futures":
      return "Futures";
    default:
      return category;
  }
}

export function buildPortfolioAnalyticsSnapshot(
  client: ClientAccount,
  tickers: Record<string, Ticker>
): PortfolioAnalyticsSnapshot | null {
  const holdings = Object.values(client.holdings);
  if (holdings.length === 0) {
    return null;
  }

  const totalValue = holdings.reduce((sum, holding) => sum + valueOfHolding(holding, tickers), 0);
  if (totalValue <= 0) {
    return null;
  }

  let weightedBeta = 0;
  let largestPositionName = "No position";
  let concentrationPct = 0;
  const sectorWeights: Record<string, number> = {};
  const categoryWeights: Record<string, number> = {};

  holdings.forEach((holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker) {
      return;
    }

    const value = valueOfHolding(holding, tickers);
    const weight = value / totalValue;
    weightedBeta += inferInstrumentBeta(ticker) * weight;
    categoryWeights[ticker.category] = (categoryWeights[ticker.category] ?? 0) + weight;
    const sectorKey = ticker.sector ?? categoryLabel(ticker.category);
    sectorWeights[sectorKey] = (sectorWeights[sectorKey] ?? 0) + weight;

    if (weight > concentrationPct) {
      concentrationPct = weight;
      largestPositionName = ticker.name;
    }
  });

  const topSector = Object.entries(sectorWeights).sort((left, right) => right[1] - left[1])[0] ?? ["Diversified", 0];
  const diversificationScore = Math.max(0, Math.min(100, Math.round(100 - concentrationPct * 115 - topSector[1] * 55 + holdings.length * 4)));
  const benchmarkRelative =
    weightedBeta > 1.15
      ? "Running above broad-market volatility"
      : weightedBeta < 0.75
        ? "Running below broad-market volatility"
        : "Tracking near broad-market volatility";
  const drawdownBand =
    concentrationPct >= 0.28 || weightedBeta >= 1.3
      ? "Elevated drawdown risk"
      : concentrationPct >= 0.18 || weightedBeta >= 1.0
        ? "Moderate drawdown risk"
        : "Lower drawdown risk";

  return {
    weightedBeta,
    concentrationPct: concentrationPct * 100,
    largestPositionName,
    largestSector: topSector[0],
    largestSectorPct: topSector[1] * 100,
    diversificationScore,
    benchmarkRelative,
    drawdownBand,
    sleeveAllocation: Object.entries(categoryWeights)
      .sort((left, right) => right[1] - left[1])
      .map(([category, value]) => ({
        label: categoryLabel(category),
        valuePct: value * 100
      }))
  };
}
