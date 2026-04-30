type LegacyAssetCategory = "stocks" | "forex" | "commodities" | "futures";
type LegacyMarketEventSeverity = "LOW" | "MEDIUM" | "HIGH";

interface LegacyAssetSeed {
  symbol: string;
  name: string;
  price: number;
  sector?: string;
}

export interface LegacyAsset extends LegacyAssetSeed {
  prevPrice?: number;
  change?: number;
}

export interface LegacyAssetUniverse {
  stocks: LegacyAsset[];
  forex: LegacyAsset[];
  commodities: LegacyAsset[];
  futures: LegacyAsset[];
}

interface LegacyMarketEventEffect {
  stocks?: number;
  bonds?: number;
  forex?: number;
  commodities?: number;
  futures?: number;
}

export interface LegacyMarketEvent {
  id: string;
  title: string;
  description: string;
  effect: LegacyMarketEventEffect;
  severity: LegacyMarketEventSeverity;
  timestamp?: number;
}

export interface LegacyClientQuestion {
  q: string;
  correct: string;
  explanation: string;
  points: number;
}

export interface LegacyClientPersona {
  id: string;
  name: string;
  age: number;
  avatar: string;
  goal: string;
  riskTolerance: string;
  portfolio: number;
  description: string;
  questions: LegacyClientQuestion[];
}

export interface LegacyMarketState {
  tick: number;
  assets: LegacyAssetUniverse;
  history: Record<string, number[]>;
  currentEvent: LegacyMarketEvent | null;
}

const ASSET_SEEDS: LegacyAssetUniverse = {
  stocks: [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.5, sector: "Technology" },
    { symbol: "JPM", name: "JPMorgan Chase", price: 198.3, sector: "Financials" },
    { symbol: "XOM", name: "Exxon Mobil", price: 104.2, sector: "Energy" },
    { symbol: "JNJ", name: "Johnson & Johnson", price: 156.8, sector: "Healthcare" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 374.9, sector: "Technology" },
    { symbol: "BRK", name: "Berkshire Hathaway", price: 362.1, sector: "Financials" },
    { symbol: "PG", name: "Procter & Gamble", price: 147.6, sector: "Consumer" },
    { symbol: "GS", name: "Goldman Sachs", price: 412.8, sector: "Financials" }
  ],
  forex: [
    { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0842 },
    { symbol: "GBP/USD", name: "British Pound / US Dollar", price: 1.2634 },
    { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", price: 149.82 },
    { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", price: 1.3521 }
  ],
  commodities: [
    { symbol: "GLD", name: "Gold (oz)", price: 2021.4 },
    { symbol: "SLV", name: "Silver (oz)", price: 23.18 },
    { symbol: "OIL", name: "Crude Oil (bbl)", price: 78.42 },
    { symbol: "NAT", name: "Natural Gas (MMBtu)", price: 2.61 },
    { symbol: "WHT", name: "Wheat (bu)", price: 582.25 }
  ],
  futures: [
    { symbol: "ES", name: "S&P 500 Futures", price: 4892.5 },
    { symbol: "NQ", name: "Nasdaq 100 Futures", price: 17124.75 },
    { symbol: "YM", name: "Dow Jones Futures", price: 38412 },
    { symbol: "ZB", name: "30-Year T-Bond Futures", price: 118.28 }
  ]
};

export const MARKET_EVENTS: LegacyMarketEvent[] = [
  {
    id: "fed_hike",
    title: "Fed Rate Hike",
    description: "Federal Reserve raises rates by 25bps. Bonds fall, growth stocks under pressure.",
    effect: { stocks: -0.03, bonds: -0.05, forex: 0.01 },
    severity: "HIGH"
  },
  {
    id: "fed_cut",
    title: "Fed Rate Cut",
    description: "Federal Reserve cuts rates by 25bps. Growth stocks rally, dollar weakens.",
    effect: { stocks: 0.04, bonds: 0.03, forex: -0.01 },
    severity: "HIGH"
  },
  {
    id: "cpi_hot",
    title: "CPI Exceeds Expectations",
    description: "Inflation data comes in hotter than expected. Market sells off.",
    effect: { stocks: -0.025, commodities: 0.02 },
    severity: "MEDIUM"
  },
  {
    id: "jobs_strong",
    title: "Strong Jobs Report",
    description: "Non-farm payrolls beat estimates. Economy showing resilience.",
    effect: { stocks: 0.02, forex: 0.01 },
    severity: "MEDIUM"
  },
  {
    id: "earnings_miss",
    title: "Major Earnings Miss",
    description: "A blue-chip company misses earnings estimates by wide margin. Sector selloff begins.",
    effect: { stocks: -0.04 },
    severity: "HIGH"
  },
  {
    id: "geo_tension",
    title: "Geopolitical Tensions Rise",
    description: "International conflict escalates. Safe haven assets surge.",
    effect: { stocks: -0.03, commodities: 0.05, forex: -0.02 },
    severity: "HIGH"
  },
  {
    id: "oil_spike",
    title: "Oil Supply Shock",
    description: "OPEC cuts production unexpectedly. Energy sector rallies, transportation costs rise.",
    effect: { stocks: -0.01, commodities: 0.08 },
    severity: "MEDIUM"
  },
  {
    id: "bull_run",
    title: "Market Sentiment Surge",
    description: "Investor confidence hits yearly high. Broad market rally across sectors.",
    effect: { stocks: 0.05, futures: 0.03 },
    severity: "LOW"
  },
  {
    id: "recession_fear",
    title: "Recession Fears Mount",
    description: "Leading economic indicators flash warning signs. Defensive stocks outperform.",
    effect: { stocks: -0.05, commodities: 0.02 },
    severity: "HIGH"
  },
  {
    id: "dollar_strong",
    title: "Dollar Strengthens",
    description: "USD rallies on safe haven demand. International holdings face headwinds.",
    effect: { forex: 0.03, stocks: -0.01 },
    severity: "LOW"
  }
];

export const CLIENT_PERSONAS: LegacyClientPersona[] = [
  {
    id: "retiree",
    name: "Margaret Chen",
    age: 68,
    avatar: "👩‍💼",
    goal: "Retirement Income",
    riskTolerance: "Conservative",
    portfolio: 450000,
    description: "Recently retired teacher. Needs stable income. Cannot afford major losses.",
    questions: [
      {
        q: "Should I move everything into stocks for higher returns?",
        correct: "No",
        explanation:
          "At 68 with conservative risk tolerance, heavy equity exposure is unsuitable. A balanced income-focused allocation is appropriate.",
        points: 15
      },
      {
        q: "How will selling my bond fund affect my taxes this year?",
        correct: "Capital gains tax applies. If held over 1 year, long-term rates apply (0%, 15%, or 20% depending on income).",
        explanation: "Bond fund sales trigger capital gains events. Duration of holding determines tax rate.",
        points: 20
      },
      {
        q: "My neighbor says I should put it all in gold. Good idea?",
        correct: "No",
        explanation: "Gold is a hedge, not an income generator. A 5-10% allocation may be appropriate but not 100%.",
        points: 15
      }
    ]
  },
  {
    id: "young_pro",
    name: "Derek Washington",
    age: 31,
    avatar: "👨‍💻",
    goal: "Wealth Accumulation",
    riskTolerance: "Aggressive",
    portfolio: 85000,
    description: "Software engineer. Long time horizon. Wants maximum growth. Can tolerate volatility.",
    questions: [
      {
        q: "Should I use margin to buy more tech stocks?",
        correct: "Cautiously yes with limits",
        explanation:
          "With aggressive tolerance and long horizon, moderate margin use is acceptable but should be disclosed and limited.",
        points: 15
      },
      {
        q: "I want to buy call options on AAPL before earnings. Is this suitable?",
        correct: "Yes with risk disclosure",
        explanation:
          "Speculative options are suitable for aggressive risk profiles. Full disclosure of loss potential required.",
        points: 20
      },
      {
        q: "Should I max my 401k or invest in a taxable account first?",
        correct: "Max 401k first",
        explanation:
          "Tax-advantaged accounts should be maximized before taxable investing for long-term wealth accumulation.",
        points: 15
      }
    ]
  },
  {
    id: "family",
    name: "The Kowalski Family",
    age: 42,
    avatar: "👨‍👩‍👧",
    goal: "College Fund + Mortgage",
    riskTolerance: "Moderate",
    portfolio: 220000,
    description: "Dual income household. Two kids (8 and 12). Mortgage up for renewal. College in 6-10 years.",
    questions: [
      {
        q: "Should we pay off the mortgage or invest more?",
        correct: "Compare mortgage rate to expected returns",
        explanation:
          "If mortgage rate is below 5% and expected returns are higher, investing may be optimal. Depends on their rate.",
        points: 20
      },
      {
        q: "What account should we use for the college fund?",
        correct: "529 Plan",
        explanation:
          "529 plans offer tax-advantaged growth for education expenses and are the standard vehicle for college funding.",
        points: 15
      },
      {
        q: "Our 12 year old's fund is in aggressive stocks. Should we rebalance?",
        correct: "Yes, shift toward moderate allocation",
        explanation:
          "With college 6 years away, gradually reducing equity risk is appropriate because the time horizon is shortening.",
        points: 20
      }
    ]
  },
  {
    id: "entrepreneur",
    name: "Sofia Reyes",
    age: 52,
    avatar: "👩‍🏫",
    goal: "Business Exit Planning",
    riskTolerance: "Moderate-Aggressive",
    portfolio: 1200000,
    description: "Sold her business. Large cash position. Needs tax-efficient deployment strategy.",
    questions: [
      {
        q: "I just received $1.2M. What are the tax implications?",
        correct: "Depends on structure — asset vs stock sale. Could trigger capital gains up to 20% plus state taxes.",
        explanation:
          "Business sale taxation is complex. Asset sales vs stock sales are taxed differently. Professional tax advice required.",
        points: 25
      },
      {
        q: "Should I put it all in the market at once or dollar cost average?",
        correct: "Lump sum statistically outperforms but DCA reduces timing risk",
        explanation:
          "Research favors lump sum investing about two-thirds of the time, but dollar-cost averaging is psychologically easier and still appropriate for large sums.",
        points: 20
      },
      {
        q: "Can I use a Roth conversion to reduce future taxes?",
        correct: "Yes, if income allows",
        explanation:
          "Roth conversions can make sense post-exit if income is temporarily lower. It requires careful tax bracket analysis.",
        points: 20
      }
    ]
  }
];

export const ASSETS: LegacyAssetUniverse = cloneAssetUniverse(ASSET_SEEDS);

function cloneAssetUniverse(universe: LegacyAssetUniverse): LegacyAssetUniverse {
  return {
    stocks: universe.stocks.map((asset) => ({ ...asset })),
    forex: universe.forex.map((asset) => ({ ...asset })),
    commodities: universe.commodities.map((asset) => ({ ...asset })),
    futures: universe.futures.map((asset) => ({ ...asset }))
  };
}

function flattenAssets(universe: LegacyAssetUniverse): LegacyAsset[] {
  return [...universe.stocks, ...universe.forex, ...universe.commodities, ...universe.futures];
}

export class LegacyMarketEngine {
  private assets: LegacyAssetUniverse;
  private history: Record<string, number[]>;
  private currentEvent: LegacyMarketEvent | null;
  private tick: number;

  constructor() {
    this.assets = cloneAssetUniverse(ASSET_SEEDS);
    this.history = {};
    this.currentEvent = null;
    this.tick = 0;
    this.initHistory();
  }

  private initHistory(): void {
    flattenAssets(this.assets).forEach((asset) => {
      this.history[asset.symbol] = [asset.price];
    });
  }

  simulateTick(): LegacyMarketState {
    this.tick += 1;

    flattenAssets(this.assets).forEach((asset) => {
      const volatility = this.getVolatility(asset.symbol);
      const drift = (Math.random() - 0.48) * volatility;
      const eventEffect = this.getEventEffect(asset.symbol);
      const previousPrice = asset.price;
      const nextPrice = Math.max(0.01, previousPrice * (1 + drift + eventEffect));

      asset.prevPrice = previousPrice;
      asset.price = nextPrice;
      asset.change = ((nextPrice - previousPrice) / previousPrice) * 100;

      const symbolHistory = this.history[asset.symbol] ?? [];
      symbolHistory.push(nextPrice);
      if (symbolHistory.length > 50) {
        symbolHistory.shift();
      }
      this.history[asset.symbol] = symbolHistory;
    });

    if (Math.random() < 0.08) {
      this.triggerRandomEvent();
    } else if (this.currentEvent && Math.random() < 0.3) {
      this.currentEvent = null;
    }

    return this.getState();
  }

  private getVolatility(symbol: string): number {
    if (["AAPL", "MSFT", "GS"].includes(symbol)) {
      return 0.018;
    }
    if (["EUR/USD", "GBP/USD"].includes(symbol)) {
      return 0.004;
    }
    if (["GLD", "SLV"].includes(symbol)) {
      return 0.012;
    }
    if (["OIL", "NAT"].includes(symbol)) {
      return 0.025;
    }
    if (["ES", "NQ", "YM"].includes(symbol)) {
      return 0.01;
    }
    return 0.015;
  }

  private getEventEffect(symbol: string): number {
    if (!this.currentEvent) {
      return 0;
    }

    const effect = this.currentEvent.effect;
    const category = this.findAssetCategory(symbol);

    if (!category) {
      return 0;
    }

    const categoryEffect = effect[category];
    if (!categoryEffect) {
      return 0;
    }

    return categoryEffect * (0.5 + Math.random());
  }

  private findAssetCategory(symbol: string): LegacyAssetCategory | null {
    if (this.assets.stocks.some((asset) => asset.symbol === symbol)) {
      return "stocks";
    }
    if (this.assets.forex.some((asset) => asset.symbol === symbol)) {
      return "forex";
    }
    if (this.assets.commodities.some((asset) => asset.symbol === symbol)) {
      return "commodities";
    }
    if (this.assets.futures.some((asset) => asset.symbol === symbol)) {
      return "futures";
    }
    return null;
  }

  triggerRandomEvent(): LegacyMarketEvent {
    const event = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    const stampedEvent: LegacyMarketEvent = { ...event, timestamp: Date.now() };
    this.currentEvent = stampedEvent;
    return stampedEvent;
  }

  getState(): LegacyMarketState {
    return {
      tick: this.tick,
      assets: this.assets,
      history: this.history,
      currentEvent: this.currentEvent
    };
  }

  getClients(): LegacyClientPersona[] {
    return CLIENT_PERSONAS;
  }

  getEvents(): LegacyMarketEvent[] {
    return MARKET_EVENTS;
  }
}
