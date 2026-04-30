import type { ClientAccount } from "../types/client";
import type { Ticker, TickerCategory } from "../types/market";

export interface AllocationPolicy {
  minEquityPct: number;
  maxEquityPct: number;
  maxNonEquityPct: number;
  speculativeBetaThreshold: number;
}

export interface AllocationExposure {
  totalAum: number;
  investedTotal: number;
  cashExposure: number;
  equityExposure: number;
  nonEquityExposure: number;
  equityValue: number;
  nonEquityValue: number;
}

const DEFAULT_POLICY_BY_RISK: Record<ClientAccount["riskProfile"], AllocationPolicy> = {
  Conservative: {
    minEquityPct: 0.15,
    maxEquityPct: 0.3,
    maxNonEquityPct: 0.85,
    speculativeBetaThreshold: 1.5
  },
  Moderate: {
    minEquityPct: 0.35,
    maxEquityPct: 0.6,
    maxNonEquityPct: 0.65,
    speculativeBetaThreshold: 1.6
  },
  "Moderate-Aggressive": {
    minEquityPct: 0.45,
    maxEquityPct: 0.7,
    maxNonEquityPct: 0.55,
    speculativeBetaThreshold: 1.75
  },
  Aggressive: {
    minEquityPct: 0.55,
    maxEquityPct: 0.8,
    maxNonEquityPct: 0.45,
    speculativeBetaThreshold: 1.85
  }
};

// Bond futures that must NOT be counted as equity
const BOND_FUTURES = new Set(["ZB", "ZN", "ZF", "ZT"]);

export function isEquityAllocationCategory(category: TickerCategory, symbol?: string) {
  if (category === "futures") {
    // ZB = 30-yr T-Bond futures, ZN = 10-yr T-Note futures — fixed-income derivatives
    return symbol ? !BOND_FUTURES.has(symbol) : true;
  }
  return category === "stocks";
}

export function isNonEquityAllocationCategory(category: TickerCategory, symbol?: string) {
  return !isEquityAllocationCategory(category, symbol);
}

function parseEquityRangeLabel(label?: string) {
  if (!label) {
    return null;
  }

  const matches = label.match(/(\d+(?:\.\d+)?)\s*%\s*-\s*(\d+(?:\.\d+)?)\s*%/);
  if (!matches) {
    return null;
  }

  const min = Number(matches[1]);
  const max = Number(matches[2]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  return {
    minEquityPct: min / 100,
    maxEquityPct: max / 100
  };
}

export function getAllocationPolicy(client: Pick<ClientAccount, "riskProfile" | "investmentPolicy">): AllocationPolicy {
  const defaults = DEFAULT_POLICY_BY_RISK[client.riskProfile];
  const parsedRange = parseEquityRangeLabel(client.investmentPolicy.equityRangeLabel);
  const minEquityPct = client.investmentPolicy.targetEquityMinPct ?? parsedRange?.minEquityPct ?? defaults.minEquityPct;
  const maxEquityPct = client.investmentPolicy.targetEquityMaxPct ?? parsedRange?.maxEquityPct ?? defaults.maxEquityPct;
  const maxNonEquityPct = client.investmentPolicy.maxNonEquityPct ?? (1 - minEquityPct);
  const speculativeBetaThreshold = client.investmentPolicy.speculativeBetaThreshold ?? defaults.speculativeBetaThreshold;

  return {
    minEquityPct: Math.max(0, Math.min(minEquityPct, 1)),
    maxEquityPct: Math.max(0, Math.min(maxEquityPct, 1)),
    maxNonEquityPct: Math.max(0, Math.min(maxNonEquityPct, 1)),
    speculativeBetaThreshold
  };
}

export function getAllocationExposure(
  cash: number,
  holdings: ClientAccount["holdings"],
  tickers: Record<string, Ticker>
): AllocationExposure {
  let investedTotal = 0;
  let equityValue = 0;
  let nonEquityValue = 0;

  Object.values(holdings).forEach((holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker) {
      return;
    }

    const value = ticker.price * holding.shares;
    investedTotal += value;
    if (isEquityAllocationCategory(ticker.category, ticker.symbol)) {
      equityValue += value;
    } else {
      nonEquityValue += value;
    }
  });

  const totalAum = Math.max(Number((cash + investedTotal).toFixed(2)), 0);
  const denominator = Math.max(totalAum, 1);

  return {
    totalAum,
    investedTotal,
    cashExposure: totalAum <= 0 ? 0 : Math.max(0, cash) / denominator,
    equityExposure: equityValue / denominator,
    nonEquityExposure: nonEquityValue / denominator,
    equityValue,
    nonEquityValue
  };
}

export function getProjectedAllocationExposure(
  currentAum: number,
  currentEquityValue: number,
  currentNonEquityValue: number,
  ticker: Ticker,
  projectedCost: number
) {
  const projectedAum = Math.max(currentAum, 1);
  const projectedEquityValue = currentEquityValue + (isEquityAllocationCategory(ticker.category, ticker.symbol) ? projectedCost : 0);
  const projectedNonEquityValue = currentNonEquityValue + (isEquityAllocationCategory(ticker.category, ticker.symbol) ? 0 : projectedCost);
  const projectedEquityExposure = projectedEquityValue / projectedAum;
  const projectedNonEquityExposure = projectedNonEquityValue / projectedAum;

  return {
    projectedAum,
    projectedEquityExposure,
    projectedNonEquityExposure
  };
}
