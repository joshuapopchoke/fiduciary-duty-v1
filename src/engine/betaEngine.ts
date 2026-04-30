import type { Ticker } from "../types/market";

const KNOWN_BETAS: Record<string, number> = {
  AAPL: 1.26,
  MSFT: 0.94,
  GOOGL: 1.06,
  NVDA: 1.74,
  META: 1.24,
  AMZN: 1.17,
  CRM: 1.19,
  ORCL: 1.03,
  TSLA: 2.03,
  NFLX: 1.38,
  ADBE: 1.31,
  AMD: 1.87,
  CSCO: 0.86,
  JPM: 1.12,
  GS: 1.36,
  BRK: 0.89,
  BAC: 1.33,
  MS: 1.31,
  V: 0.96,
  SCHW: 1.12,
  JNJ: 0.54,
  UNH: 0.73,
  PFE: 0.58,
  ABBV: 0.57,
  LLY: 0.52,
  MRK: 0.41,
  XOM: 0.89,
  CVX: 0.95,
  COP: 1.12,
  PG: 0.43,
  KO: 0.47,
  WMT: 0.55,
  COST: 0.83,
  HD: 0.99,
  MCD: 0.59,
  DIS: 1.18,
  CAT: 1.15,
  BA: 1.49,
  GE: 1.23,
  HON: 1.04,
  UPS: 1.02,
  RTX: 0.83,
  AMT: 0.79,
  PLD: 1.06,
  NEE: 0.52,
  SPY: 1.0,
  VOO: 1.0,
  IVV: 1.0,
  VTI: 1.0,
  QQQ: 1.18,
  IWM: 1.18,
  IJH: 1.07,
  SCHX: 0.98,
  VFIAX: 1.0,
  FXAIX: 1.0,
  VXUS: 0.9,
  VEA: 0.88,
  VWO: 0.95,
  VWELX: 0.65,
  VWINX: 0.45,
  AOR: 0.78,
  VTTSX: 0.82,
  SWYNX: 0.8,
  XLK: 1.15,
  XLF: 1.1,
  XLE: 1.08,
  HFLS: 0.72,
  HFGM: 0.55,
  BIL: 0.00,
  SHY: 0.02,
  IEF: 0.27,
  TLT: 0.72,
  TIP: 0.19,
  LQD: 0.49,
  HYG: 0.32,
  MUB: 0.31,
  GLD: -0.08,
  GC: -0.08,
  SLV: 0.18,
  OIL: 0.35,
  CL: 0.35,
  NAT: 0.24,
  COPPER: 0.42,
  CORN: 0.16,
  SOY: 0.18,
  WHT: 0.17,
  ES: 1.0,
  NQ: 1.2,
  YM: 0.95,
  RTY: 1.18,
  ZB: 0.72,
  ZN: 0.27
};

function creditDrivenBeta(ticker: Ticker) {
  const rating = ticker.creditRating ?? "";

  if (["AAA", "AA+", "AA", "AA-"].includes(rating)) {
    return ticker.modifiedDuration && ticker.modifiedDuration >= 10 ? 0.45 : 0.22;
  }

  if (["A+", "A", "A-", "BBB+", "BBB", "BBB-"].includes(rating)) {
    return ticker.modifiedDuration && ticker.modifiedDuration >= 7 ? 0.49 : 0.35;
  }

  if (["BB+", "BB", "BB-", "B+", "B", "B-"].includes(rating)) {
    return 0.32;
  }

  return 0.3;
}

function sectorEquityBeta(sector?: string) {
  switch (sector) {
    case "Technology":
      return 1.22;
    case "Financials":
      return 1.08;
    case "Healthcare":
      return 0.88;
    case "Energy":
      return 1.12;
    case "Consumer":
      return 0.86;
    case "Industrials":
      return 1.02;
    case "Real Estate":
      return 0.9;
    case "Utilities":
      return 0.55;
    default:
      return 1;
  }
}

function sectorFundBeta(sector?: string) {
  switch (sector) {
    case "Index Funds":
      return 1;
    case "Small Cap Funds":
      return 1.18;
    case "Mid Cap Funds":
      return 1.07;
    case "Large Cap Funds":
      return 0.98;
    case "Mutual Funds":
      return 0.96;
    case "Active Funds":
      return 1.02;
    case "Sector Funds":
      return 1.1;
    case "Hybrid Funds":
      return 0.65;
    case "International Funds":
      return 0.9;
    case "Target Date Funds":
      return 0.8;
    case "Hedge Funds":
      return 0.65;
    default:
      return 0.95;
  }
}

function sovereignDurationBeta(ticker: Ticker) {
  const duration = ticker.modifiedDuration ?? ticker.maturityYears ?? 0;
  if (duration <= 0.5) {
    return 0.00;
  }
  if (duration <= 2.5) {
    return 0.02;
  }
  if (duration <= 8) {
    return 0.27;
  }
  return 0.72;
}

export function inferInstrumentBeta(ticker: Ticker) {
  if (typeof ticker.beta === "number") {
    return ticker.beta;
  }

  if (KNOWN_BETAS[ticker.symbol] !== undefined) {
    return KNOWN_BETAS[ticker.symbol];
  }

  switch (ticker.category) {
    case "stocks":
      return sectorEquityBeta(ticker.sector);
    case "funds":
      return sectorFundBeta(ticker.sector);
    case "fixedIncome":
      if (ticker.sector === "Treasuries") {
        return sovereignDurationBeta(ticker);
      }
      if (ticker.sector === "Municipals") {
        return 0.31;
      }
      if (ticker.symbol === "TIP") {
        return 0.19;
      }
      return creditDrivenBeta(ticker);
    case "bonds":
      if ((ticker.sector ?? "").includes("Municipal")) {
        return 0.31;
      }
      return creditDrivenBeta(ticker);
    case "forex":
      return 0.12;
    case "commodities":
      return ticker.symbol === "GLD" ? -0.08 : ticker.symbol === "SLV" ? 0.18 : 0.25;
    case "futures":
      if (ticker.symbol === "ES") return 1.0;
      if (ticker.symbol === "NQ") return 1.2;
      if (ticker.symbol === "YM") return 0.95;
      if (ticker.symbol === "RTY") return 1.18;
      if (ticker.symbol === "ZB") return 0.72;
      if (ticker.symbol === "ZN") return 0.27;
      if (ticker.symbol === "GC") return -0.08;
      if (ticker.symbol === "CL") return 0.35;
      return 1;
    default:
      return 1;
  }
}