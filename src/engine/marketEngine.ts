import type { FinancialProfile, MarketEvent, Ticker } from "../types/market";
import { inferInstrumentBeta } from "./betaEngine";
import { refreshCallableBondTerms } from "./rateEngine";

const STOCKS: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.5, sector: "Technology", category: "stocks" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 374.9, sector: "Technology", category: "stocks", dividendYield: 0.007, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.8, sector: "Technology", category: "stocks" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.2, sector: "Technology", category: "stocks" },
  { symbol: "META", name: "Meta Platforms", price: 358.6, sector: "Technology", category: "stocks" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.4, sector: "Technology", category: "stocks" },
  { symbol: "CRM", name: "Salesforce Inc.", price: 262.1, sector: "Technology", category: "stocks" },
  { symbol: "ORCL", name: "Oracle Corp.", price: 118.3, sector: "Technology", category: "stocks" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 214.6, sector: "Technology", category: "stocks" },
  { symbol: "NFLX", name: "Netflix Inc.", price: 612.3, sector: "Technology", category: "stocks" },
  { symbol: "ADBE", name: "Adobe Inc.", price: 521.7, sector: "Technology", category: "stocks" },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 168.4, sector: "Technology", category: "stocks" },
  { symbol: "CSCO", name: "Cisco Systems", price: 49.6, sector: "Technology", category: "stocks", dividendYield: 0.031, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.3, sector: "Financials", category: "stocks", dividendYield: 0.023, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "GS", name: "Goldman Sachs", price: 412.8, sector: "Financials", category: "stocks", dividendYield: 0.024, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "BRK", name: "Berkshire Hathaway", price: 362.1, sector: "Financials", category: "stocks" },
  { symbol: "BAC", name: "Bank of America", price: 33.4, sector: "Financials", category: "stocks", dividendYield: 0.026, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "MS", name: "Morgan Stanley", price: 91.2, sector: "Financials", category: "stocks", dividendYield: 0.035, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "V", name: "Visa Inc.", price: 261.5, sector: "Financials", category: "stocks", dividendYield: 0.007, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "SCHW", name: "Charles Schwab", price: 73.8, sector: "Financials", category: "stocks", dividendYield: 0.012, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.8, sector: "Healthcare", category: "stocks", dividendYield: 0.03, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "UNH", name: "UnitedHealth Group", price: 524.3, sector: "Healthcare", category: "stocks" },
  { symbol: "PFE", name: "Pfizer Inc.", price: 28.4, sector: "Healthcare", category: "stocks", dividendYield: 0.06, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "ABBV", name: "AbbVie Inc.", price: 162.7, sector: "Healthcare", category: "stocks", dividendYield: 0.035, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "LLY", name: "Eli Lilly and Company", price: 782.1, sector: "Healthcare", category: "stocks" },
  { symbol: "MRK", name: "Merck & Co.", price: 129.5, sector: "Healthcare", category: "stocks", dividendYield: 0.026, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "XOM", name: "Exxon Mobil", price: 104.2, sector: "Energy", category: "stocks", dividendYield: 0.035, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "CVX", name: "Chevron Corp.", price: 152.9, sector: "Energy", category: "stocks", dividendYield: 0.041, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "COP", name: "ConocoPhillips", price: 116.4, sector: "Energy", category: "stocks" },
  { symbol: "PG", name: "Procter & Gamble", price: 147.6, sector: "Consumer", category: "stocks", dividendYield: 0.024, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "KO", name: "Coca-Cola Co.", price: 60.2, sector: "Consumer", category: "stocks", dividendYield: 0.031, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "WMT", name: "Walmart Inc.", price: 163.8, sector: "Consumer", category: "stocks", dividendYield: 0.014, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "COST", name: "Costco Wholesale", price: 682.4, sector: "Consumer", category: "stocks", dividendYield: 0.006, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "HD", name: "Home Depot", price: 346.5, sector: "Consumer", category: "stocks", dividendYield: 0.024, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "MCD", name: "McDonald's Corp.", price: 288.4, sector: "Consumer", category: "stocks", dividendYield: 0.022, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "DIS", name: "Walt Disney Co.", price: 112.8, sector: "Consumer", category: "stocks" },
  { symbol: "CAT", name: "Caterpillar Inc.", price: 286.5, sector: "Industrials", category: "stocks", dividendYield: 0.015, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "BA", name: "Boeing Co.", price: 202.1, sector: "Industrials", category: "stocks" },
  { symbol: "GE", name: "GE Aerospace", price: 148.7, sector: "Industrials", category: "stocks" },
  { symbol: "HON", name: "Honeywell International", price: 213.2, sector: "Industrials", category: "stocks" },
  { symbol: "UPS", name: "United Parcel Service", price: 151.6, sector: "Industrials", category: "stocks", dividendYield: 0.046, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "RTX", name: "RTX Corp.", price: 103.4, sector: "Industrials", category: "stocks", dividendYield: 0.021, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "AMT", name: "American Tower REIT", price: 182.3, sector: "Real Estate", category: "stocks", dividendYield: 0.032, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "PLD", name: "Prologis Inc.", price: 129.8, sector: "Real Estate", category: "stocks", dividendYield: 0.028, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "NEE", name: "NextEra Energy", price: 58.9, sector: "Utilities", category: "stocks", dividendYield: 0.03, dividendFrequency: "quarterly", dividendPayoutType: "cash" }
];

const FUNDS: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", price: 519.2, sector: "Index Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 442.7, sector: "Index Funds", category: "funds", dividendYield: 0.006, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", price: 273.4, sector: "Index Funds", category: "funds", dividendYield: 0.014, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 475.6, sector: "Index Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", price: 531.9, sector: "Index Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", price: 209.6, sector: "Small Cap Funds", category: "funds" },
  { symbol: "IJH", name: "iShares Core S&P Mid-Cap ETF", price: 61.8, sector: "Mid Cap Funds", category: "funds" },
  { symbol: "SCHX", name: "Schwab U.S. Large-Cap ETF", price: 66.9, sector: "Large Cap Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VFIAX", name: "Vanguard 500 Index Fund Admiral Shares", price: 487.8, sector: "Mutual Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "FXAIX", name: "Fidelity 500 Index Fund", price: 196.2, sector: "Mutual Funds", category: "funds", dividendYield: 0.013, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VWELX", name: "Vanguard Wellington Fund", price: 44.16, sector: "Mutual Funds", category: "funds", dividendYield: 0.03, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "AGTHX", name: "American Funds Growth Fund of America", price: 67.2, sector: "Active Funds", category: "funds" },
  { symbol: "FCNTX", name: "Fidelity Contrafund", price: 19.6, sector: "Active Funds", category: "funds" },
  { symbol: "PRNHX", name: "T. Rowe Price New Horizons Fund", price: 61.5, sector: "Active Funds", category: "funds" },
  { symbol: "XLK", name: "Technology Select Sector SPDR Fund", price: 226.4, sector: "Sector Funds", category: "funds", dividendYield: 0.007, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "XLF", name: "Financial Select Sector SPDR Fund", price: 43.7, sector: "Sector Funds", category: "funds", dividendYield: 0.018, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "XLE", name: "Energy Select Sector SPDR Fund", price: 96.2, sector: "Sector Funds", category: "funds", dividendYield: 0.03, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VWINX", name: "Vanguard Wellesley Income Fund", price: 24.8, sector: "Hybrid Funds", category: "funds", dividendYield: 0.031, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "AOR", name: "iShares Core Growth Allocation ETF", price: 56.1, sector: "Hybrid Funds", category: "funds", dividendYield: 0.02, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VXUS", name: "Vanguard Total International Stock ETF", price: 64.3, sector: "International Funds", category: "funds", dividendYield: 0.03, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF", price: 52.7, sector: "International Funds", category: "funds", dividendYield: 0.029, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VWO", name: "Vanguard FTSE Emerging Markets ETF", price: 43.8, sector: "International Funds", category: "funds", dividendYield: 0.027, dividendFrequency: "quarterly", dividendPayoutType: "cash" },
  { symbol: "VTTSX", name: "Vanguard Target Retirement 2060 Fund", price: 41.2, sector: "Target Date Funds", category: "funds" },
  { symbol: "SWYNX", name: "Schwab Target 2060 Index Fund", price: 18.4, sector: "Target Date Funds", category: "funds" },
  { symbol: "HFLS", name: "Long/Short Equity Hedge Fund Basket", price: 112.4, sector: "Hedge Funds", category: "funds" },
  { symbol: "HFGM", name: "Global Macro Hedge Fund Basket", price: 108.9, sector: "Hedge Funds", category: "funds" }
];

const FOREX: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0842, category: "forex" },
  { symbol: "GBP/USD", name: "British Pound / USD", price: 1.2634, category: "forex" },
  { symbol: "USD/JPY", name: "USD / Japanese Yen", price: 149.82, category: "forex" },
  { symbol: "USD/CAD", name: "USD / Canadian Dollar", price: 1.3521, category: "forex" },
  { symbol: "AUD/USD", name: "Australian Dollar / USD", price: 0.6512, category: "forex" },
  { symbol: "USD/CHF", name: "USD / Swiss Franc", price: 0.8821, category: "forex" },
  { symbol: "USD/MXN", name: "USD / Mexican Peso", price: 17.24, category: "forex" },
  { symbol: "NZD/USD", name: "New Zealand Dollar / USD", price: 0.6038, category: "forex" },
  { symbol: "EUR/GBP", name: "Euro / British Pound", price: 0.8584, category: "forex" },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", price: 162.39, category: "forex" },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", price: 189.24, category: "forex" },
  { symbol: "USD/SGD", name: "USD / Singapore Dollar", price: 1.3478, category: "forex" },
  { symbol: "USD/CNY", name: "USD / Chinese Yuan", price: 7.2162, category: "forex" },
  { symbol: "USD/NOK", name: "USD / Norwegian Krone", price: 10.73, category: "forex" },
  { symbol: "USD/SEK", name: "USD / Swedish Krona", price: 10.42, category: "forex" },
  { symbol: "USD/BRL", name: "USD / Brazilian Real", price: 5.08, category: "forex" }
];

const FIXED_INCOME: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "BIL", name: "13-Week U.S. T-Bill", price: 99.42, sector: "Treasuries", category: "fixedIncome", couponRate: 5.1, maturityYears: 0.25, modifiedDuration: 0.2, creditRating: "AAA", callable: false, seniority: "Sovereign" },
  { symbol: "SHY", name: "1-3 Year Treasury", price: 81.34, sector: "Treasuries", category: "fixedIncome", couponRate: 4.4, maturityYears: 2.1, modifiedDuration: 1.8, creditRating: "AAA", callable: false, seniority: "Sovereign" },
  { symbol: "IEF", name: "7-10 Year Treasury", price: 94.82, sector: "Treasuries", category: "fixedIncome", couponRate: 4.1, maturityYears: 8.5, modifiedDuration: 7.2, creditRating: "AAA", callable: false, seniority: "Sovereign" },
  { symbol: "TLT", name: "20+ Year Treasury", price: 92.16, sector: "Treasuries", category: "fixedIncome", couponRate: 4.3, maturityYears: 22.4, modifiedDuration: 15.9, creditRating: "AAA", callable: false, seniority: "Sovereign" },
  { symbol: "TIP", name: "Treasury Inflation-Protected Bonds", price: 106.28, sector: "Treasuries", category: "fixedIncome", couponRate: 2.0, maturityYears: 7.4, modifiedDuration: 6.1, creditRating: "AAA", callable: false, seniority: "Sovereign" },
  { symbol: "LQD", name: "Investment Grade Corporate Bonds", price: 108.64, sector: "Corporate Bonds", category: "fixedIncome", couponRate: 5.2, maturityYears: 11.8, modifiedDuration: 8.7, creditRating: "A", callable: true, seniority: "Senior unsecured" },
  { symbol: "HYG", name: "High Yield Corporate Bonds", price: 77.18, sector: "Corporate Bonds", category: "fixedIncome", couponRate: 7.8, maturityYears: 4.6, modifiedDuration: 3.3, creditRating: "BB", callable: true, seniority: "Senior unsecured" },
  { symbol: "MUB", name: "Municipal Bond Basket", price: 106.04, sector: "Municipals", category: "fixedIncome", couponRate: 4.0, maturityYears: 7.9, modifiedDuration: 5.4, creditRating: "AA", callable: true, seniority: "Revenue-backed" }
];

const BONDS: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "IBM30", name: "IBM 5.20% Corporate Bond 2030", price: 101.8, sector: "Investment Grade Corporate", category: "bonds", couponRate: 5.2, maturityYears: 4.6, modifiedDuration: 4.1, creditRating: "A", callable: false, seniority: "Senior unsecured" },
  { symbol: "JPM31", name: "JPMorgan 5.10% Senior Note 2031", price: 102.4, sector: "Investment Grade Corporate", category: "bonds", couponRate: 5.1, maturityYears: 5.7, modifiedDuration: 4.9, creditRating: "A", callable: true, seniority: "Senior unsecured" },
  { symbol: "T40", name: "AT&T 6.00% Income Bond 2040", price: 96.7, sector: "Income Bonds", category: "bonds", couponRate: 6.0, maturityYears: 14.2, modifiedDuration: 9.8, creditRating: "BBB", callable: true, seniority: "Senior unsecured" },
  { symbol: "VZ38", name: "Verizon 5.85% Debenture 2038", price: 98.3, sector: "Corporate Debentures", category: "bonds", couponRate: 5.85, maturityYears: 12.7, modifiedDuration: 8.9, creditRating: "BBB+", callable: true, seniority: "Debenture" },
  { symbol: "F32", name: "Ford 7.45% High Yield Bond 2032", price: 94.1, sector: "High Yield Corporate", category: "bonds", couponRate: 7.45, maturityYears: 6.1, modifiedDuration: 4.8, creditRating: "BB-", callable: true, seniority: "Senior unsecured" },
  { symbol: "CCL31", name: "Carnival 9.25% Senior Secured Note 2031", price: 91.2, sector: "High Yield Corporate", category: "bonds", couponRate: 9.25, maturityYears: 5.4, modifiedDuration: 4.0, creditRating: "B", callable: true, seniority: "Senior secured" },
  { symbol: "ET35", name: "Energy Transfer 7.13% Income Bond 2035", price: 97.8, sector: "Income Bonds", category: "bonds", couponRate: 7.13, maturityYears: 9.3, modifiedDuration: 6.7, creditRating: "BBB-", callable: true, seniority: "Senior unsecured" },
  { symbol: "MUNI34", name: "Metro Revenue Bond 2034", price: 100.6, sector: "Municipal Revenue", category: "bonds", couponRate: 4.4, maturityYears: 8.4, modifiedDuration: 6.0, creditRating: "AA-", callable: true, seniority: "Revenue-backed" }
];

const COMMODITIES: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "GLD", name: "Gold (oz)", price: 2021.4, category: "commodities" },
  { symbol: "SLV", name: "Silver (oz)", price: 23.18, category: "commodities" },
  { symbol: "OIL", name: "Crude Oil (bbl)", price: 78.42, category: "commodities" },
  { symbol: "NAT", name: "Natural Gas", price: 2.61, category: "commodities" },
  { symbol: "COPPER", name: "Copper (lb)", price: 3.84, category: "commodities" },
  { symbol: "CORN", name: "Corn (bu)", price: 438.5, category: "commodities" },
  { symbol: "SOY", name: "Soybeans (bu)", price: 1248.75, category: "commodities" },
  { symbol: "WHT", name: "Wheat (bu)", price: 582.25, category: "commodities" }
];

const FUTURES: Omit<Ticker, "prevPrice" | "change">[] = [
  { symbol: "ES", name: "S&P 500 Futures", price: 4892.5, category: "futures" },
  { symbol: "NQ", name: "Nasdaq 100 Futures", price: 17124.75, category: "futures" },
  { symbol: "YM", name: "Dow Jones Futures", price: 38412, category: "futures" },
  { symbol: "RTY", name: "Russell 2000 Futures", price: 2018.4, category: "futures" },
  { symbol: "ZB", name: "30-Year T-Bond Futures", price: 118.28, category: "futures" },
  { symbol: "ZN", name: "10-Year T-Note Futures", price: 109.14, category: "futures" },
  { symbol: "GC", name: "Gold Futures", price: 2028.6, category: "futures" },
  { symbol: "CL", name: "Crude Oil Futures", price: 79.1, category: "futures" }
];

const ALL_TICKERS = [...STOCKS, ...FUNDS, ...FIXED_INCOME, ...BONDS, ...FOREX, ...COMMODITIES, ...FUTURES];

const MARKET_EVENTS: MarketEvent[] = [
  {
    title: "Fed Rate Hike",
    description: "Federal Reserve raises rates by 25bps. Long-duration assets and growth stocks come under pressure.",
    effect: { stocks: -0.03, funds: -0.02, fixedIncome: -0.018, bonds: -0.014 },
    severity: "HIGH"
  },
  {
    title: "Fed Rate Cut",
    description: "Federal Reserve cuts rates. Equities rally broadly while Treasuries and investment-grade debt firm up.",
    effect: { stocks: 0.04, funds: 0.03, fixedIncome: 0.015, bonds: 0.01 },
    severity: "HIGH"
  },
  {
    title: "CPI Beat",
    description: "Inflation exceeds forecasts. Markets sell off on rate fear while hard assets catch a bid.",
    effect: { stocks: -0.025, funds: -0.018, fixedIncome: -0.014, bonds: -0.012, commodities: 0.02 },
    severity: "MEDIUM"
  },
  { title: "Strong Jobs Report", description: "Non-farm payrolls beat estimates. Economy resilient.", effect: { stocks: 0.02, funds: 0.015 }, severity: "MEDIUM" },
  { title: "Earnings Miss", description: "Blue-chip company misses estimates widely. Sector selloff begins.", effect: { stocks: -0.04, funds: -0.018 }, severity: "HIGH" },
  {
    title: "Geopolitical Shock",
    description: "International conflict escalates. Safe havens surge while risk assets wobble.",
    effect: { stocks: -0.03, funds: -0.015, fixedIncome: 0.02, bonds: 0.015, commodities: 0.05 },
    severity: "HIGH"
  },
  { title: "Oil Supply Shock", description: "OPEC cuts production. Energy rallies.", effect: { commodities: 0.08, stocks: -0.01, funds: -0.005 }, severity: "MEDIUM" },
  { title: "Market Sentiment Surge", description: "Investor confidence hits yearly high. Broad rally.", effect: { stocks: 0.05, funds: 0.03 }, severity: "LOW" },
  {
    title: "Recession Fears",
    description: "Leading indicators flash warning signs. Defensive assets outperform while credit risk widens.",
    effect: { stocks: -0.05, funds: -0.025, fixedIncome: 0.018, bonds: -0.008, futures: -0.01 },
    severity: "HIGH"
  },
  { title: "Dollar Strengthens", description: "USD rallies. International holdings face headwinds.", effect: { forex: 0.02, stocks: -0.01, funds: -0.01 }, severity: "LOW" },
  {
    title: "Systemic Liquidity Collapse",
    description: "A major clearinghouse fails. Global markets freeze and correlations break down.",
    effect: { stocks: -0.25, funds: -0.18, fixedIncome: 0.06, bonds: -0.08, forex: -0.15, commodities: 0.4, futures: -0.2 },
    severity: "CRITICAL",
    isBlackSwan: true
  }
];

function isLastTradingDaysOfYear(date: Date) {
  if (date.getMonth() !== 11) {
    return false;
  }

  return date.getDate() >= 24;
}

function isFirstTradingDaysOfYear(date: Date) {
  return date.getMonth() === 0 && date.getDate() <= 4;
}

function isTurnOfMonth(date: Date) {
  return date.getDate() <= 3 || date.getDate() >= 28;
}

function inHalloweenWindow(date: Date) {
  return date.getMonth() >= 10 || date.getMonth() <= 3;
}

function isSeptember(date: Date) {
  return date.getMonth() === 8;
}

function inSadWindow(date: Date) {
  return date.getMonth() >= 8 || date.getMonth() <= 1;
}

export interface MarketSimulationState {
  tickers: Record<string, Ticker>;
  histories: Record<string, number[]>;
  currentEvent: MarketEvent | null;
}

export class MarketEngine {
  private tickers: Record<string, Ticker>;
  private histories: Record<string, number[]>;
  private currentEvent: MarketEvent | null;
  private cascadeTicksRemaining: number;
  private cascadeEffect: Partial<Record<Ticker["category"], number>> | null;
  private blackSwanFired: boolean;
  private finSeeds: Record<string, number>;

  constructor() {
    this.tickers = Object.fromEntries(
      ALL_TICKERS.map((ticker) => [
        ticker.symbol,
        {
          ...ticker,
          beta: inferInstrumentBeta(ticker as Ticker),
          prevPrice: ticker.price,
          change: 0
        }
      ])
    );
    this.tickers = refreshCallableBondTerms(this.tickers, 1);
    this.histories = Object.fromEntries(ALL_TICKERS.map((ticker) => [ticker.symbol, [ticker.price]]));
    this.currentEvent = null;
    this.cascadeTicksRemaining = 0;
    this.cascadeEffect = null;
    this.blackSwanFired = false;
    this.finSeeds = {};
  }

  getState(): MarketSimulationState {
    return {
      tickers: this.tickers,
      histories: this.histories,
      currentEvent: this.currentEvent
    };
  }

  listTickers(): Ticker[] {
    return Object.values(this.tickers);
  }

  listEvents(): MarketEvent[] {
    return MARKET_EVENTS;
  }

  simulateTick(volatilityMultiplier = 1, eventChance = 0.06, marketDate = new Date()): MarketSimulationState {
    const isMondayEffect = marketDate.getDay() === 1;
    const isJanuaryEffect = marketDate.getMonth() === 0;
    const isHalloween = inHalloweenWindow(marketDate);
    const isSantaClaus = isLastTradingDaysOfYear(marketDate) || isFirstTradingDaysOfYear(marketDate);
    const isTurnMonth = isTurnOfMonth(marketDate);
    const isSeptemberEffect = isSeptember(marketDate);
    const isSadSeason = inSadWindow(marketDate);
    const intradayHour = marketDate.getHours() + marketDate.getMinutes() / 60;
    const isOpenWindow = intradayHour <= 10;
    const isCloseWindow = intradayHour >= 15.5;

    ALL_TICKERS.forEach((asset) => {
      const ticker = this.tickers[asset.symbol];
      const volatility = this.getVolatility(asset.symbol) * volatilityMultiplier;
      let drift = (Math.random() - 0.48) * volatility;

      if (isMondayEffect && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift -= 0.003 + Math.random() * 0.004;
      }

      if (isJanuaryEffect && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift += 0.002 + Math.random() * 0.004;
      }

      if (isHalloween && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift += 0.0015 + Math.random() * 0.0025;
      }

      if (!isHalloween && marketDate.getMonth() >= 4 && marketDate.getMonth() <= 9 && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift -= 0.001 + Math.random() * 0.0015;
      }

      if (isSantaClaus && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift += 0.0025 + Math.random() * 0.003;
      }

      if (isTurnMonth && (ticker.category === "stocks" || ticker.category === "funds" || ticker.category === "bonds" || ticker.category === "fixedIncome")) {
        drift += 0.0012 + Math.random() * 0.002;
      }

      if (isSeptemberEffect && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift -= 0.002 + Math.random() * 0.0035;
      }

      if (isSadSeason && (ticker.category === "stocks" || ticker.category === "funds")) {
        drift -= 0.0008 + Math.random() * 0.0012;
      }

      if (ticker.category === "stocks" || ticker.category === "funds") {
        const betaTilt = (ticker.beta ?? 1) - 1;
        drift += betaTilt * (Math.random() - 0.5) * volatility * 0.85;
      }

      if (isOpenWindow) {
        drift += (Math.random() - 0.5) * volatility * 0.75;
      }

      if (isCloseWindow) {
        drift += (Math.random() - 0.5) * volatility * 0.45;
      }

      const eventEffect = this.getEventEffect(asset.symbol);
      ticker.prevPrice = ticker.price;
      ticker.price = Math.max(0.01, ticker.price * (1 + drift + eventEffect));
      ticker.change = ((ticker.price - ticker.prevPrice) / ticker.prevPrice) * 100;
      this.histories[ticker.symbol].push(ticker.price);

      if (this.histories[ticker.symbol].length > 60) {
        this.histories[ticker.symbol].shift();
      }
    });

    if (Math.random() < eventChance) {
      this.triggerMarketEvent();
    } else if (this.currentEvent && Math.random() < 0.25) {
      this.currentEvent = null;
    }

    if (this.cascadeTicksRemaining > 0) {
      this.cascadeTicksRemaining -= 1;

      if (this.cascadeEffect) {
        Object.keys(this.cascadeEffect).forEach((key) => {
          const category = key as Ticker["category"];
          this.cascadeEffect![category] = (this.cascadeEffect![category] ?? 0) * 0.4;
        });
      }

      if (this.cascadeTicksRemaining === 0) {
        this.cascadeEffect = null;
      }
    }

    return this.getState();
  }

  generateFinancials(symbol: string): FinancialProfile | null {
    const asset = this.tickers[symbol];

    if (!asset || (asset.category !== "stocks" && asset.category !== "funds")) {
      return null;
    }

    const priceScale = asset.price;
    const rand = (offset: number) => this.seededRand(symbol, offset);

    const revenue = Math.floor((priceScale * 180 + rand(1) * priceScale * 40) * (1 + rand(2) * 0.3));
    const cogs = Math.floor(revenue * (0.38 + rand(3) * 0.18));
    const grossProfit = revenue - cogs;
    const opEx = Math.floor(revenue * (0.12 + rand(4) * 0.08));
    const rnd = Math.floor(revenue * (0.05 + rand(5) * 0.07));
    const ebit = grossProfit - opEx - rnd;
    const interestExp = Math.floor(revenue * (0.01 + rand(6) * 0.02));
    const ebt = ebit - interestExp;
    // U.S. federal corporate tax rate is a flat 21% per TCJA 2017 (IRC §11(b)), still current law.
    // Prior floor of 18% was incorrect — no U.S. corporation pays below 21% federal rate.
    // Range 21%-25% accounts for state corporate income taxes on top of federal.
    const taxRate = 0.21 + rand(7) * 0.04;
    const taxes = Math.floor(ebt * taxRate);
    const netIncome = ebt - taxes;

    const cash = Math.floor(revenue * (0.1 + rand(10) * 0.15));
    const receivables = Math.floor(revenue * (0.08 + rand(11) * 0.06));
    const inventory = Math.floor(revenue * (0.05 + rand(12) * 0.05));
    const currentAssets = cash + receivables + inventory;
    const ppe = Math.floor(revenue * (0.18 + rand(13) * 0.15));
    const intangibles = Math.floor(revenue * (0.04 + rand(14) * 0.12));
    const totalAssets = currentAssets + ppe + intangibles;
    const currentLiab = Math.floor(revenue * (0.08 + rand(20) * 0.07));
    const longTermDebt = Math.floor(revenue * (0.1 + rand(21) * 0.2));
    const totalLiab = currentLiab + longTermDebt;
    const equity = Math.max(1, totalAssets - totalLiab);
    const operatingCashFlow = Math.floor(netIncome * (1.08 + rand(40) * 0.45));
    const investingCashFlow = -Math.floor(revenue * (0.05 + rand(41) * 0.08));
    const financingCashFlow = Math.floor((longTermDebt - currentLiab) * (rand(42) - 0.4));
    const freeCashFlow = operatingCashFlow + investingCashFlow;

    const sharesOut = Math.max(50, Math.floor(priceScale * (1.2 + rand(22) * 2.5)));
    const eps = (netIncome / sharesOut).toFixed(2);
    const peRatio = (asset.price / Math.max(0.01, Number.parseFloat(eps))).toFixed(1);
    const roe = ((netIncome / Math.max(1, equity)) * 100).toFixed(1);
    const debtToEquity = (longTermDebt / Math.max(1, equity)).toFixed(2);
    const grossMargin = ((grossProfit / revenue) * 100).toFixed(1);
    const netMargin = ((netIncome / revenue) * 100).toFixed(1);

    const profitScore = netIncome / revenue + (rand(30) - 0.4);
    const recommendation = profitScore > 0.08 ? "BUY" : profitScore > 0.02 ? "HOLD" : "SELL";
    const notes = {
      BUY: `Strong margins (${grossMargin}% gross) and healthy ROE of ${roe}% suggest continued outperformance. P/E of ${peRatio}x is reasonable relative to peers.`,
      HOLD: `Mixed signals: gross margin of ${grossMargin}% is respectable, but net margin of ${netMargin}% leaves room for improvement. Monitor leverage and execution trends closely.`,
      SELL: `Elevated debt-to-equity of ${debtToEquity} and thin net margin of ${netMargin}% raise sustainability concerns. The balance between valuation and profitability looks less attractive.`
    } as const;
    const performance = {
      oneDay: Number((((rand(50) - 0.5) * 4)).toFixed(2)),
      ytd: Number((((rand(51) - 0.35) * 28)).toFixed(2)),
      oneYear: Number((((rand(52) - 0.3) * 42)).toFixed(2)),
      threeYear: Number((((rand(53) - 0.2) * 65)).toFixed(2)),
      fiveYear: Number((((rand(54) - 0.15) * 95)).toFixed(2))
    };

    return {
      symbol,
      name: asset.name,
      recommendation,
      analystNote: notes[recommendation],
      income: { revenue, cogs, grossProfit, opEx, rnd, ebit, interestExp, ebt, taxes, netIncome },
      balanceSheet: { cash, currentAssets, totalAssets, currentLiabilities: currentLiab, longTermDebt, totalLiabilities: totalLiab, equity },
      cashFlow: { operatingCashFlow, investingCashFlow, financingCashFlow, freeCashFlow },
      performance,
      ratios: { eps, peRatio, roe, debtToEquity, grossMargin, netMargin }
    };
  }

  refreshStructuralTerms(cycleNumber: number) {
    this.tickers = refreshCallableBondTerms(this.tickers, cycleNumber);
    return this.getState();
  }

  private seededRand(symbol: string, offset: number): number {
    if (!this.finSeeds[symbol]) {
      this.finSeeds[symbol] = Math.floor(Math.random() * 100000);
    }

    const value = Math.sin(this.finSeeds[symbol] + offset) * 10000;
    return value - Math.floor(value);
  }

  private getVolatility(symbol: string): number {
    if (["NVDA", "META", "AMZN", "GOOGL", "TSLA", "NFLX", "AMD"].includes(symbol)) return 0.02;
    if (["AAPL", "MSFT", "GS", "CRM", "ORCL", "ADBE", "SCHW", "LLY"].includes(symbol)) return 0.016;
    if (["BA", "COP", "ABBV", "DIS", "RTX"].includes(symbol)) return 0.018;
    if (["PFE", "KO", "PG", "NEE"].includes(symbol)) return 0.008;
    if (["UNH", "COST", "CAT", "V", "HD", "MCD", "HON", "UPS", "PLD"].includes(symbol)) return 0.012;
    if (["JPM", "BAC", "MS", "XOM", "CVX", "MRK", "CSCO"].includes(symbol)) return 0.014;
    if (["BRK", "WMT", "AMT", "GE"].includes(symbol)) return 0.01;
    if (["SPY", "VTI", "VOO", "IVV", "VFIAX", "FXAIX", "SCHX"].includes(symbol)) return 0.006;
    if (["QQQ", "IWM", "IJH"].includes(symbol)) return 0.009;
    if (["VWELX", "VWINX", "AOR", "VTTSX", "SWYNX"].includes(symbol)) return 0.004;
    if (["VXUS", "VEA", "VWO"].includes(symbol)) return 0.007;
    if (["AGTHX", "FCNTX", "PRNHX"].includes(symbol)) return 0.01;
    if (["HFLS", "HFGM"].includes(symbol)) return 0.015;
    if (["IBM30", "JPM31", "MUNI34"].includes(symbol)) return 0.004;
    if (["T40", "VZ38", "ET35"].includes(symbol)) return 0.006;
    if (["F32", "CCL31"].includes(symbol)) return 0.009;
    if (symbol.includes("/") && (symbol.includes("JPY") || symbol.includes("BRL"))) return 0.004;
    if (symbol.includes("/") && ["MXN", "CNY", "NOK", "SEK"].some((currency) => symbol.includes(currency))) return 0.006;
    if (symbol.includes("/")) return 0.003;
    if (["GLD", "GC"].includes(symbol)) return 0.009;
    if (["SLV", "COPPER"].includes(symbol)) return 0.013;
    if (["OIL", "CL", "NAT"].includes(symbol)) return 0.022;
    if (["CORN", "SOY", "WHT"].includes(symbol)) return 0.016;
    if (["ES", "NQ", "YM", "RTY"].includes(symbol)) return 0.009;
    if (["BIL", "SHY"].includes(symbol)) return 0.0016;
    if (["IEF", "TIP", "MUB"].includes(symbol)) return 0.003;
    if (["TLT", "LQD"].includes(symbol)) return 0.0045;
    if (["HYG"].includes(symbol)) return 0.006;
    if (["ZB", "ZN"].includes(symbol)) return 0.005;
    return 0.013;
  }

  private getEventEffect(symbol: string): number {
    const activeEffect = this.cascadeTicksRemaining > 0 ? this.cascadeEffect : this.currentEvent?.effect;
    const ticker = this.tickers[symbol];

    if (!activeEffect || !ticker) {
      return 0;
    }

    const categoryEffect = activeEffect[ticker.category];

    if (!categoryEffect) {
      return 0;
    }

    return categoryEffect * (0.5 + Math.random() * 0.5);
  }

  private triggerMarketEvent() {
    const eligibleEvents = MARKET_EVENTS.filter((event) => {
      if (!event.isBlackSwan) {
        return true;
      }

      return !this.blackSwanFired && Math.random() < 0.08;
    });

    const pool = eligibleEvents.length > 0 ? eligibleEvents : MARKET_EVENTS.filter((event) => !event.isBlackSwan);
    const event = pool[Math.floor(Math.random() * pool.length)];
    this.currentEvent = { ...event };

    if (event.isBlackSwan) {
      this.blackSwanFired = true;
      this.cascadeTicksRemaining = 3;
      this.cascadeEffect = {
        stocks: (event.effect.stocks ?? 0) * 0.4,
        funds: (event.effect.funds ?? 0) * 0.4,
        fixedIncome: (event.effect.fixedIncome ?? 0) * 0.4,
        bonds: (event.effect.bonds ?? 0) * 0.4,
        forex: (event.effect.forex ?? 0) * 0.4,
        commodities: (event.effect.commodities ?? 0) * 0.4,
        futures: (event.effect.futures ?? 0) * 0.4
      };
    }
  }
}

export function createMarketEngine() {
  return new MarketEngine();
}
