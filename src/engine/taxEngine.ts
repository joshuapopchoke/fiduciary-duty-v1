import type { ClientAccount, ClientHolding } from "../types/client";
import type { Ticker } from "../types/market";

export interface ClientTaxGuidance {
  fitLabel: "Tax-efficient" | "Neutral" | "Tax drag risk";
  summary: string;
  bestHome: string;
  caution: string;
  estimatedTaxDrag: string;
}

export interface PortfolioTaxSnapshot {
  dragLabel: "Low drag" | "Moderate drag" | "High drag";
  weightedScore: number;
  summary: string;
}

export interface AdvancedTaxPlanningSnapshot {
  assetLocationNote: string;
  harvestingLens: string;
  withdrawalSequencingNote: string;
}

function incomeTypeForTicker(ticker: Ticker) {
  if (ticker.symbol === "MUB" || ticker.sector?.includes("Municipal")) {
    return "tax-exempt income";
  }

  if (ticker.category === "fixedIncome" || ticker.category === "bonds") {
    return "ordinary income";
  }

  if (ticker.category === "funds") {
    if (ticker.sector === "Index Funds" || ticker.sector === "Large Cap Funds") {
      return "tax-efficient distributions";
    }

    if (ticker.sector === "Mutual Funds" || ticker.sector === "Active Funds" || ticker.sector === "Sector Funds") {
      return "capital-gain distributions";
    }

    return "mixed distributions";
  }

  if (ticker.category === "stocks") {
    return ticker.dividendYield && ticker.dividendYield > 0.02 ? "qualified dividends" : "capital appreciation";
  }

  if (ticker.category === "forex" || ticker.category === "commodities" || ticker.category === "futures") {
    return "mark-to-market / blended or complex tax treatment";
  }

  return "mixed tax treatment";
}

function taxScoreForTicker(ticker: Ticker) {
  if (ticker.symbol === "MUB" || ticker.sector?.includes("Municipal")) {
    return 0.12;
  }

  if (ticker.category === "fixedIncome" || ticker.category === "bonds") {
    return 0.82;
  }

  if (ticker.category === "funds") {
    if (ticker.sector === "Index Funds" || ticker.sector === "Large Cap Funds") {
      return 0.22;
    }

    if (ticker.sector === "Mutual Funds" || ticker.sector === "Active Funds" || ticker.sector === "Sector Funds") {
      return 0.58;
    }

    if (ticker.sector === "Hedge Funds") {
      return 0.74;
    }

    return 0.4;
  }

  if (ticker.category === "stocks") {
    return ticker.dividendYield && ticker.dividendYield > 0.03 ? 0.35 : 0.22;
  }

  if (ticker.category === "forex" || ticker.category === "commodities" || ticker.category === "futures") {
    return 0.68;
  }

  return 0.4;
}

function isTaxSensitiveClient(client: ClientAccount) {
  return !client.taxProfile.filingStatus.toLowerCase().includes("institutional");
}

export function buildClientTaxGuidance(client: ClientAccount, ticker: Ticker): ClientTaxGuidance {
  const score = taxScoreForTicker(ticker);
  const incomeType = incomeTypeForTicker(ticker);
  const taxExempt = client.taxProfile.filingStatus.toLowerCase().includes("institutional") || client.taxProfile.accountTreatment.toLowerCase().includes("tax-exempt");

  if (taxExempt) {
    return {
      fitLabel: "Neutral",
      summary: `${ticker.name} generates ${incomeType}, but this mandate is largely tax-exempt. The main question is mandate fit, not tax drag.`,
      bestHome: "Tax-exempt institutional pool",
      caution: "Do not chase tax shelters here if the real issue is governance, liquidity, or diversification.",
      estimatedTaxDrag: "Minimal tax drag"
    };
  }

  if (ticker.symbol === "MUB" || ticker.sector?.includes("Municipal")) {
    return {
      fitLabel: "Tax-efficient",
      summary: `${ticker.name} offers tax-exempt income, which can be attractive for a client in ${client.taxProfile.taxBracketLabel.toLowerCase()}.`,
      bestHome: "Taxable account for after-tax income needs",
      caution: "Still check credit quality, duration, and whether muni income actually fits the objective.",
      estimatedTaxDrag: "Low drag"
    };
  }

  if ((ticker.category === "fixedIncome" || ticker.category === "bonds") && isTaxSensitiveClient(client)) {
    return {
      fitLabel: "Tax drag risk",
      summary: `${ticker.name} mainly creates ordinary-income style tax drag, which matters more in a taxable account for a client in ${client.taxProfile.taxBracketLabel.toLowerCase()}.`,
      bestHome: "Tax-deferred sleeve or retirement-income bucket",
      caution: "If the client needs taxable-account income, compare it against muni options or more tax-aware fixed-income wrappers.",
      estimatedTaxDrag: "Higher drag"
    };
  }

  if (ticker.category === "funds" && (ticker.sector === "Mutual Funds" || ticker.sector === "Active Funds" || ticker.sector === "Sector Funds")) {
    return {
      fitLabel: score > 0.5 ? "Tax drag risk" : "Neutral",
      summary: `${ticker.name} can distribute capital gains more aggressively than a broad index wrapper, so taxes matter more for this client.`,
      bestHome: "Tax-deferred account or a taxable sleeve with a strong thesis",
      caution: "If the same exposure exists in a lower-turnover ETF, compare after-tax efficiency before recommending it.",
      estimatedTaxDrag: score > 0.5 ? "Moderate-to-high drag" : "Moderate drag"
    };
  }

  if (ticker.category === "stocks") {
    return {
      fitLabel: "Tax-efficient",
      summary: `${ticker.name} is generally more tax-manageable than high-distribution fixed income because the main driver is capital appreciation and possibly qualified dividends.`,
      bestHome: "Taxable growth sleeve or broad core equity allocation",
      caution: "Tax-efficient does not mean suitable; beta, concentration, and time horizon still control the recommendation.",
      estimatedTaxDrag: ticker.dividendYield && ticker.dividendYield > 0.03 ? "Moderate drag" : "Low drag"
    };
  }

  return {
    fitLabel: score >= 0.6 ? "Tax drag risk" : "Neutral",
    summary: `${ticker.name} carries more complex tax treatment than a plain stock or broad index fund, so after-tax fit should be reviewed before sizing it in a taxable sleeve.`,
    bestHome: "Specialist sleeve or tax-deferred account when possible",
    caution: "Use this only when the client objective justifies the extra tax complexity.",
    estimatedTaxDrag: score >= 0.6 ? "Moderate-to-high drag" : "Moderate drag"
  };
}

export function estimatePortfolioTaxSnapshot(
  client: ClientAccount,
  holdings: Record<string, ClientHolding>,
  tickers: Record<string, Ticker>
): PortfolioTaxSnapshot {
  const rows = Object.values(holdings);

  if (rows.length === 0) {
    return {
      dragLabel: "Low drag",
      weightedScore: 0,
      summary: "No current tax drag yet because this sleeve has not been invested."
    };
  }

  const totalValue = rows.reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const weightedScore = rows.reduce((sum, holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker || totalValue <= 0) {
      return sum;
    }

    const weight = ((tickers[holding.ticker]?.price ?? 0) * holding.shares) / totalValue;
    return sum + taxScoreForTicker(ticker) * weight;
  }, 0);

  if (!isTaxSensitiveClient(client)) {
    return {
      dragLabel: "Low drag",
      weightedScore,
      summary: "This mandate is largely tax-exempt, so portfolio tax drag is a secondary concern versus policy and diversification."
    };
  }

  if (weightedScore >= 0.58) {
    return {
      dragLabel: "High drag",
      weightedScore,
      summary: "This mix leans toward ordinary income, active distributions, or tax-complex exposures that could erode after-tax returns."
    };
  }

  if (weightedScore >= 0.32) {
    return {
      dragLabel: "Moderate drag",
      weightedScore,
      summary: "This portfolio is usable, but there is room to improve after-tax efficiency through wrapper choice and asset location."
    };
  }

  return {
    dragLabel: "Low drag",
    weightedScore,
    summary: "This mix is relatively tax-aware for a taxable client, with lower-distribution or more tax-manageable exposures."
  };
}

export function buildAdvancedTaxPlanningSnapshot(client: ClientAccount, snapshot: PortfolioTaxSnapshot): AdvancedTaxPlanningSnapshot {
  const taxExempt = client.taxProfile.filingStatus.toLowerCase().includes("institutional");
  const assetLocationNote = taxExempt
    ? "Tax location is secondary here; governance and liquidity are the bigger drivers."
    : `${client.accountStructure.assetLocationNote} Current drag reads as ${snapshot.dragLabel.toLowerCase()}.`;

  const harvestingLens =
    snapshot.dragLabel === "High drag"
      ? "Look for lower-turnover replacements, loss-harvesting opportunities, and whether income-heavy assets belong in tax-deferred space."
      : snapshot.dragLabel === "Moderate drag"
        ? "There may be room to improve after-tax efficiency with wrapper choice, lot management, or asset location."
        : "Tax drag is manageable, so the next gain likely comes from disciplined location and avoiding unnecessary turnover.";

  const withdrawalSequencingNote =
    client.retirementDistribution.distributionPhase
      ? "Coordinate guaranteed income, taxable cash, and required distributions before forcing equity sales."
      : "Stay focused on contribution placement and account location now so future distribution years remain more flexible.";

  return {
    assetLocationNote,
    harvestingLens,
    withdrawalSequencingNote
  };
}
