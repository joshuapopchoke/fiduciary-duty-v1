export type TickerCategory = "stocks" | "funds" | "fixedIncome" | "bonds" | "forex" | "commodities" | "futures";

export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  prevPrice: number;
  change: number;
  category: TickerCategory;
  sector?: string;
  beta?: number;
  dividendYield?: number;
  dividendFrequency?: "monthly" | "quarterly" | "semiannual" | "annual";
  dividendPayoutType?: "cash" | "stock";
  stockDividendRate?: number;
  couponRate?: number;
  maturityYears?: number;
  modifiedDuration?: number;
  creditRating?: string;
  callable?: boolean;
  callProtected?: boolean;
  callProtectionLabel?: string;
  seniority?: string;
}

export interface MarketEvent {
  title: string;
  description: string;
  effect: Partial<Record<TickerCategory, number>>;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isBlackSwan?: boolean;
}

export interface FinancialStatementSummary {
  revenue: number;
  cogs: number;
  grossProfit: number;
  opEx: number;
  rnd: number;
  ebit: number;
  interestExp: number;
  ebt: number;
  taxes: number;
  netIncome: number;
}

export interface BalanceSheetSummary {
  cash: number;
  currentAssets: number;
  totalAssets: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  equity: number;
}

export interface CashFlowSummary {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  freeCashFlow: number;
}

export interface PerformanceSnapshot {
  oneDay: number;
  ytd: number;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
}

export interface FinancialRatios {
  eps: string;
  peRatio: string;
  roe: string;
  debtToEquity: string;
  grossMargin: string;
  netMargin: string;
}

export interface FinancialProfile {
  symbol: string;
  name: string;
  recommendation: "BUY" | "HOLD" | "SELL";
  analystNote: string;
  income: FinancialStatementSummary;
  balanceSheet: BalanceSheetSummary;
  cashFlow: CashFlowSummary;
  performance: PerformanceSnapshot;
  ratios: FinancialRatios;
}
