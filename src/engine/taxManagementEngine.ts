import type { ClientAccount, ClientHolding } from "../types/client";
import type { Ticker } from "../types/market";

export interface TaxLotInsightRow {
  ticker: string;
  name: string;
  unrealized: number;
  marketValue: number;
}

export interface TaxManagementSnapshot {
  taxableMarketValue: number;
  unrealizedGainTotal: number;
  unrealizedLossTotal: number;
  netTaxableGain: number;
  harvestCandidates: TaxLotInsightRow[];
  gainBudgetUsd: number;
  gainBudgetLabel: string;
  summary: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function inferGainBudget(client: ClientAccount) {
  // Higher tax bracket = higher cost to realize gains = LESS gain budget
  // 0% LTCG rate applies up to ~$47K taxable income (single) / ~$94K (MFJ) in 2024
  // As bracket rises, the 15% and 20% LTCG rates erode the budget
  const label = client.taxProfile.taxBracketLabel.toLowerCase();
  if (label.includes("top")) {
    return 12000;   // 37% ordinary / 20% LTCG + 3.8% NIIT — very limited room
  }
  if (label.includes("high")) {
    return 18000;   // 35% ordinary / 20% LTCG — limited room
  }
  if (label.includes("upper")) {
    return 24000;   // 32-24% ordinary / 15% LTCG — moderate room
  }
  if (label.includes("moderate")) {
    return 36000;   // 22% ordinary / 15% LTCG — more room
  }
  return 47000;     // 12% ordinary / 0% LTCG — maximum room (within 0% LTCG threshold)
}

function isTaxableSleeve(client: ClientAccount, sleeveId: string) {
  const sleeve = client.accountSleeves.find((entry) => entry.id === sleeveId);
  if (!sleeve) {
    return false;
  }

  return sleeve.registration.toLowerCase().includes("taxable") || sleeve.registration.toLowerCase().includes("joint taxable");
}

export function buildTaxManagementSnapshot(
  client: ClientAccount,
  tickers: Record<string, Ticker>
): TaxManagementSnapshot {
  const taxableRows = Object.entries(client.holdings).reduce<TaxLotInsightRow[]>((rows, [holdingKey, holding]) => {
    const sleeveId = client.holdingAccountMap[holdingKey] ?? client.accountSleeves[0]?.id ?? "";
    if (!isTaxableSleeve(client, sleeveId)) {
      return rows;
    }

    const ticker = tickers[holding.ticker];
    if (!ticker) {
      return rows;
    }

    const marketValue = ticker.price * holding.shares;
    const costBasis = holding.averageCost * holding.shares;
    rows.push({
      ticker: holding.ticker,
      name: ticker.name,
      unrealized: marketValue - costBasis,
      marketValue
    });
    return rows;
  }, []);

  const taxableMarketValue = taxableRows.reduce((sum, row) => sum + row.marketValue, 0);
  const unrealizedGainTotal = taxableRows.filter((row) => row.unrealized > 0).reduce((sum, row) => sum + row.unrealized, 0);
  const unrealizedLossTotal = Math.abs(taxableRows.filter((row) => row.unrealized < 0).reduce((sum, row) => sum + row.unrealized, 0));
  const netTaxableGain = unrealizedGainTotal - unrealizedLossTotal;
  const harvestCandidates = taxableRows
    .filter((row) => row.unrealized < 0)
    .sort((left, right) => left.unrealized - right.unrealized)
    .slice(0, 3);
  const gainBudgetUsd = inferGainBudget(client);
  const remainingBudget = gainBudgetUsd - Math.max(0, netTaxableGain);
  const gainBudgetLabel =
    remainingBudget >= gainBudgetUsd * 0.5 ? "Plenty of room left" :
    remainingBudget > 0 ? "Partial gain budget left" :
    "Gain budget mostly used";

  const summary =
    taxableRows.length === 0
      ? "There are no taxable holdings yet, so gain budgeting and harvesting are limited for now."
      : harvestCandidates.length > 0
        ? `Taxable unrealized losses of ${formatCurrency(unrealizedLossTotal)} could offset gains if harvesting fits the client's objectives and wash-sale rules are respected.`
        : `Taxable gains currently sit around ${formatCurrency(Math.max(0, netTaxableGain))}, so pacing realized gains against the annual budget matters more than harvesting.`;

  return {
    taxableMarketValue,
    unrealizedGainTotal,
    unrealizedLossTotal,
    netTaxableGain,
    harvestCandidates,
    gainBudgetUsd,
    gainBudgetLabel,
    summary
  };
}
