import type { ClientAccount } from "../types/client";
import type { Ticker } from "../types/market";
import { getAllocationExposure, getAllocationPolicy, getProjectedAllocationExposure, isEquityAllocationCategory } from "./allocationPolicyEngine";

export interface ComplianceDecision {
  suitable: boolean;
  reasons: string[];
  scrutinyDelta: number;
  flags: Array<"suitability" | "risk-override" | "unsuitable-product" | "concentration">;
}

const CAPITAL_PRESERVATION_ACCOUNT_TYPES = new Set(["Retirement Income Account", "Institutional Endowment"]);
const DEFENSIVE_FIT_HINT = "Better fit examples: diversified dividend funds, short-duration bond funds, high-quality large-cap dividend payers, or balanced funds.";

function ageContext(client: ClientAccount) {
  return client.age ? `${client.age}-year-old` : client.accountType.toLowerCase();
}

function betaText(ticker: Ticker) {
  return typeof ticker.beta === "number" ? `Beta ${ticker.beta.toFixed(2)}` : "Higher-volatility";
}

function isHighBetaTicker(ticker: Ticker, threshold: number) {
  return ticker.category === "stocks" && (ticker.beta ?? 1) >= threshold;
}

function isFixedIncomeSuitabilityCategory(ticker: Ticker) {
  return ticker.category === "fixedIncome" || ticker.category === "bonds";
}

function isGoldFallbackTicker(ticker: Ticker) {
  return ticker.symbol === "GLD" || ticker.symbol === "GC" || ticker.name.toLowerCase().includes("gold");
}

function violatesPolicyBucket(client: ClientAccount, ticker: Ticker) {
  if (ticker.category === "commodities" && isGoldFallbackTicker(ticker)) {
    return false;
  }

  return (client.investmentPolicy.prohibitedBuckets ?? []).includes(ticker.category);
}

export function evaluateTradeSuitability(
  client: ClientAccount,
  ticker: Ticker,
  quantity: number,
  direction: "buy" | "sell",
  tickers: Record<string, Ticker>
): ComplianceDecision {
  if (direction === "sell") {
    return { suitable: true, reasons: [], scrutinyDelta: 0, flags: [] };
  }

  const reasons: string[] = [];
  const flags: ComplianceDecision["flags"] = [];
  let scrutinyDelta = 0;
  const projectedCost = ticker.price * quantity;
  const currentAum = client.cash + Object.values(client.holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const allocationExposure = getAllocationExposure(client.cash, client.holdings, tickers);
  const allocationPolicy = getAllocationPolicy(client);
  const { projectedEquityExposure, projectedNonEquityExposure } = getProjectedAllocationExposure(
    currentAum,
    allocationExposure.equityValue,
    allocationExposure.nonEquityValue,
    ticker,
    projectedCost
  );

  if (isEquityAllocationCategory(ticker.category) && projectedEquityExposure > allocationPolicy.maxEquityPct) {
    reasons.push(
      `Risk tolerance override: projected equity exposure would rise to ${(projectedEquityExposure * 100).toFixed(0)}%, above the ${(allocationPolicy.maxEquityPct * 100).toFixed(0)}% equity ceiling for this mandate. ${DEFENSIVE_FIT_HINT}`
    );
    scrutinyDelta += 18;
    flags.push("risk-override", "suitability");
  }

  if (!isEquityAllocationCategory(ticker.category) && !isFixedIncomeSuitabilityCategory(ticker) && projectedNonEquityExposure > allocationPolicy.maxNonEquityPct) {
    reasons.push(
      `Allocation guardrail: projected non-equity exposure would rise to ${(projectedNonEquityExposure * 100).toFixed(0)}%, above the ${(allocationPolicy.maxNonEquityPct * 100).toFixed(0)}% defensive-allocation ceiling for this mandate. Keep the equity sleeve inside the ${client.investmentPolicy.equityRangeLabel ?? "current IPS lane"}.`
    );
    scrutinyDelta += 14;
    flags.push("risk-override", "suitability");
  }

  if (violatesPolicyBucket(client, ticker)) {
    reasons.push(
      `IPS violation: ${ticker.name} falls into a prohibited bucket for this mandate. The current policy is trying to avoid ${ticker.category.toLowerCase()} exposure for this account while it focuses on ${client.investmentPolicy.objective.toLowerCase()}. ${DEFENSIVE_FIT_HINT}`
    );
    scrutinyDelta += 16;
    flags.push("unsuitable-product", "suitability");
  }

  if (
    client.riskProfile === "Conservative" &&
    (ticker.category === "futures" || ticker.sector === "Hedge Funds" || isHighBetaTicker(ticker, allocationPolicy.speculativeBetaThreshold))
  ) {
    reasons.push(
      `Unsuitable product placement: ${ticker.name} is being treated as speculative for a conservative ${client.accountType.toLowerCase()} tied to a ${ageContext(client)} client. ${betaText(ticker)} is elevated beyond the ${allocationPolicy.speculativeBetaThreshold.toFixed(2)} policy threshold for capital-preservation goals. ${DEFENSIVE_FIT_HINT}`
    );
    scrutinyDelta += 20;
    flags.push("unsuitable-product", "suitability");
  }

  if (client.riskProfile === "Moderate" && (ticker.category === "futures" || ticker.sector === "Hedge Funds")) {
    reasons.push(
      `Unsuitable product placement: leveraged futures or hedge-fund style exposure is a stretch for this moderate-risk account. The client needs more balanced risk than a concentrated speculative sleeve. ${DEFENSIVE_FIT_HINT}`
    );
    scrutinyDelta += 15;
    flags.push("unsuitable-product", "suitability");
  }

  if (CAPITAL_PRESERVATION_ACCOUNT_TYPES.has(client.accountType) && ticker.category === "futures") {
    reasons.push(
      "Unsuitable product placement: leveraged futures conflict with capital-preservation and institutional-prudence mandates. These accounts should generally lead with liquidity, diversification, and drawdown control."
    );
    scrutinyDelta += 20;
    flags.push("unsuitable-product", "suitability");
  }

  if (client.accountType === "Institutional Endowment" && ticker.category === "stocks" && projectedEquityExposure > 0.65) {
    reasons.push(
      "Suitability violation: endowment equity concentration is inconsistent with prudent diversification expectations. A single equity-heavy sleeve is too narrow for an institutional preservation-and-growth mandate."
    );
    scrutinyDelta += 16;
    flags.push("suitability");
  }

  const maxSinglePositionPct = (client.investmentPolicy.maxSinglePositionPct ?? 35) / 100;
  if (!isFixedIncomeSuitabilityCategory(ticker) && (projectedCost > client.cash * 0.75 || projectedCost > Math.max(currentAum, projectedCost) * maxSinglePositionPct)) {
    reasons.push(
      `Suitability concern: this single position would take ${((projectedCost / Math.max(currentAum + projectedCost, 1)) * 100).toFixed(0)}% of the account, above the client policy guardrail of ${(maxSinglePositionPct * 100).toFixed(0)}% for a single position.`
    );
    scrutinyDelta += 12;
    flags.push("concentration", "suitability");
  }

  if (
    client.riskProfile === "Moderate" &&
    ticker.category === "stocks" &&
    isHighBetaTicker(ticker, allocationPolicy.speculativeBetaThreshold) &&
    projectedCost > Math.max(currentAum, projectedCost) * 0.2
  ) {
    reasons.push(
      `Risk tolerance override: ${ticker.name} is a high-beta single-name equity, and this ticket is too large for a moderate-risk client. ${betaText(ticker)} plus position size pushes the account beyond a balanced growth profile and over the ${allocationPolicy.speculativeBetaThreshold.toFixed(2)} beta threshold.`
    );
    scrutinyDelta += 14;
    flags.push("risk-override", "suitability");
  }

  return {
    suitable: reasons.length === 0,
    reasons,
    scrutinyDelta,
    flags: [...new Set(flags)]
  };
}

export function applyScrutinyLevel(currentLevel: number, decision: ComplianceDecision) {
  return Math.min(100, currentLevel + decision.scrutinyDelta);
}

export function resolveAuditScrutiny(currentLevel: number, passed: boolean) {
  return passed ? Math.min(40, currentLevel) : 60;
}
