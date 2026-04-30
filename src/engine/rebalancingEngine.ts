import type { ClientAccount, ClientHolding } from "../types/client";
import type { Ticker, TickerCategory } from "../types/market";

export interface RebalanceTargetRow {
  bucket: string;
  targetWeight: number;
  currentWeight: number;
  drift: number;
}

export interface RebalancePlan {
  driftScore: number;
  summary: string;
  rows: RebalanceTargetRow[];
  buySuggestions: Array<{ bucket: string; ticker: string; name: string; usd: number }>;
  sellSuggestions: Array<{ ticker: string; name: string; usd: number }>;
}

const CORE_BUCKETS: TickerCategory[] = ["stocks", "funds", "fixedIncome", "bonds", "forex", "commodities", "futures"];

function normalizeTargets(targets: string[]): TickerCategory[] {
  const filtered = targets.filter((target): target is TickerCategory => CORE_BUCKETS.includes(target as TickerCategory));
  return filtered.length > 0 ? filtered : ["funds"];
}

function defaultWeightMap(client: ClientAccount) {
  const map: Partial<Record<TickerCategory, number>> =
    client.riskProfile === "Conservative"
      ? { funds: 0.2, fixedIncome: 0.4, bonds: 0.3, stocks: 0.1 }
      : client.riskProfile === "Moderate"
        ? { funds: 0.32, fixedIncome: 0.25, bonds: 0.18, stocks: 0.25 }
        : client.riskProfile === "Moderate-Aggressive"
          ? { funds: 0.3, stocks: 0.42, bonds: 0.12, fixedIncome: 0.1, commodities: 0.06 }
          : { funds: 0.2, stocks: 0.6, bonds: 0.05, fixedIncome: 0.05, commodities: 0.05, futures: 0.05 };

  return map;
}

export function buildClientAllocationTargets(client: ClientAccount) {
  const allowed = normalizeTargets(client.mandateTargets);
  const defaults = defaultWeightMap(client);
  const activeEntries = allowed.map((bucket: TickerCategory) => [bucket, defaults[bucket] ?? (1 / allowed.length)] as const);
  const total = activeEntries.reduce((sum, [, weight]) => sum + weight, 0) || 1;

  return Object.fromEntries(activeEntries.map(([bucket, weight]) => [bucket, weight / total])) as Record<string, number>;
}

export function analyzePortfolioDrift(
  client: ClientAccount,
  tickers: Record<string, Ticker>
) {
  const targets = buildClientAllocationTargets(client);
  const totalValue =
    client.cash +
    Object.values(client.holdings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);

  const currentWeights = Object.values(client.holdings).reduce<Record<string, number>>((accumulator, holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker || totalValue <= 0) {
      return accumulator;
    }
    const value = ticker.price * holding.shares;
    accumulator[ticker.category] = (accumulator[ticker.category] ?? 0) + value / totalValue;
    return accumulator;
  }, {});

  const rows: RebalanceTargetRow[] = Object.entries(targets).map(([bucket, targetWeight]) => ({
    bucket,
    targetWeight,
    currentWeight: currentWeights[bucket] ?? 0,
    drift: (currentWeights[bucket] ?? 0) - targetWeight
  }));

  const driftScore = rows.reduce((sum, row) => sum + Math.abs(row.drift), 0) * 100;
  const summary =
    driftScore >= 35 ? "Portfolio drift is high enough that the mandate is starting to look off-target." :
    driftScore >= 18 ? "Portfolio drift is building and should be monitored before the next major allocation change." :
    "Portfolio drift is controlled and still broadly aligned with the target sleeves.";

  return { rows, driftScore, summary };
}

function preferredTickerForBucket(bucket: string, client: ClientAccount, tickers: Record<string, Ticker>) {
  const candidates = Object.values(tickers).filter((ticker) => ticker.category === bucket);

  if (bucket === "stocks") {
    return tickers[client.riskProfile === "Aggressive" ? "VTI" : "VOO"] ?? candidates[0];
  }
  if (bucket === "funds") {
    return tickers[client.riskProfile === "Conservative" ? "VWINX" : client.riskProfile === "Aggressive" ? "VTI" : "VOO"] ?? candidates[0];
  }
  if (bucket === "fixedIncome") {
    return tickers[client.riskProfile === "Conservative" ? "SHY" : "IEF"] ?? candidates[0];
  }
  if (bucket === "bonds") {
    return tickers[client.accountType.includes("Income") ? "MUNI34" : "IBM30"] ?? candidates[0];
  }
  if (bucket === "commodities") {
    return tickers["GLD"] ?? candidates[0];
  }
  if (bucket === "forex") {
    return tickers["EUR/USD"] ?? candidates[0];
  }
  if (bucket === "futures") {
    return tickers["ES"] ?? candidates[0];
  }

  return candidates[0];
}

export function buildRebalancePlan(client: ClientAccount, tickers: Record<string, Ticker>): RebalancePlan {
  const { rows, driftScore, summary } = analyzePortfolioDrift(client, tickers);
  const totalValue =
    client.cash +
    Object.values(client.holdings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);

  const buySuggestions = rows
    .filter((row) => row.drift < -0.06)
    .map((row) => {
      const ticker = preferredTickerForBucket(row.bucket, client, tickers);
      return {
        bucket: row.bucket,
        ticker: ticker?.symbol ?? row.bucket,
        name: ticker?.name ?? row.bucket,
        usd: Math.max(0, totalValue * Math.abs(row.drift) * 0.6)
      };
    });

  const sellSuggestions = Object.values(client.holdings)
    .map((holding) => {
      const ticker = tickers[holding.ticker];
      const row = rows.find((entry) => entry.bucket === ticker?.category);
      if (!ticker || !row || row.drift <= 0.08) {
        return null;
      }
      return {
        ticker: holding.ticker,
        name: ticker.name,
        usd: ticker.price * holding.shares * Math.min(0.45, row.drift)
      };
    })
    .filter((entry): entry is { ticker: string; name: string; usd: number } => Boolean(entry));

  return {
    driftScore,
    summary,
    rows,
    buySuggestions,
    sellSuggestions
  };
}

export function applyClientRebalance(
  client: ClientAccount,
  tickers: Record<string, Ticker>
) {
  const plan = buildRebalancePlan(client, tickers);
  let nextCash = client.cash;
  const nextHoldings: Record<string, ClientHolding> = { ...client.holdings };

  plan.sellSuggestions.forEach((suggestion) => {
    const holding = nextHoldings[suggestion.ticker];
    const ticker = tickers[suggestion.ticker];
    if (!holding || !ticker) {
      return;
    }
    const sharesToSell = Math.min(holding.shares, Math.floor(suggestion.usd / ticker.price));
    if (sharesToSell <= 0) {
      return;
    }
    nextCash += sharesToSell * ticker.price;
    const remaining = holding.shares - sharesToSell;
    if (remaining <= 0) {
      delete nextHoldings[suggestion.ticker];
    } else {
      nextHoldings[suggestion.ticker] = { ...holding, shares: remaining };
    }
  });

  plan.buySuggestions.forEach((suggestion) => {
    const ticker = tickers[suggestion.ticker];
    if (!ticker) {
      return;
    }
    const budget = Math.min(nextCash, suggestion.usd);
    const sharesToBuy = Math.floor(budget / ticker.price);
    if (sharesToBuy <= 0) {
      return;
    }
    nextCash -= sharesToBuy * ticker.price;
    const current = nextHoldings[ticker.symbol];
    const previousShares = current?.shares ?? 0;
    const previousCost = current?.averageCost ?? ticker.price;
    nextHoldings[ticker.symbol] = {
      ticker: ticker.symbol,
      shares: previousShares + sharesToBuy,
      averageCost: ((previousShares * previousCost) + (sharesToBuy * ticker.price)) / Math.max(previousShares + sharesToBuy, 1)
    };
  });

  return {
    client: {
      ...client,
      cash: Number(nextCash.toFixed(2)),
      holdings: nextHoldings
    },
    plan
  };
}
