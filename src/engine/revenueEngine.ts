import type { ClientAccount } from "../types/client";
import type { RevenueSnapshot } from "../types/gameState";
import type { Ticker } from "../types/market";

function computeAccountValue(client: ClientAccount, tickers: Record<string, Ticker>) {
  const longValue = Object.values(client.holdings).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const shortValue = Object.values(client.shortHoldings ?? {}).reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  return Math.max(0, client.cash + longValue - shortValue - (client.marginDebt ?? 0));
}

export function buildRevenueSnapshot(
  clients: ClientAccount[],
  tickers: Record<string, Ticker>,
  priorTrailingCycleRevenue = 0
): RevenueSnapshot {
  const annualizedGrossRevenue = clients.reduce((sum, client) => {
    const accountValue = computeAccountValue(client, tickers);
    return sum + (accountValue * client.revenueProfile.advisoryFeeBps) / 10000;
  }, 0);

  const cycleRevenue = annualizedGrossRevenue / 240;
  const trailingCycleRevenue = (priorTrailingCycleRevenue * 0.82) + cycleRevenue;

  return {
    annualizedGrossRevenue: Number(annualizedGrossRevenue.toFixed(2)),
    cycleRevenue: Number(cycleRevenue.toFixed(2)),
    retainedClients: clients.length,
    trailingCycleRevenue: Number(trailingCycleRevenue.toFixed(2))
  };
}
