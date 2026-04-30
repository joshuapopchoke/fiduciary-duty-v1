import { useEffect, useMemo, useState } from "react";
import { buildClientTaxGuidance } from "../engine/taxEngine";
import { inferInstrumentBeta } from "../engine/betaEngine";
import { useGameStore } from "../store/gameStore";

const CATEGORY_DESCRIPTIONS = {
  funds:
    "Funds package diversified exposure into a pooled vehicle. Index funds track a benchmark, mutual funds are priced at end-of-day NAV, and hedge-fund style baskets aim for absolute or uncorrelated returns with higher strategy risk.",
  fixedIncome:
    "Fixed-income instruments are driven by rate sensitivity, credit quality, and maturity. T-bills and short Treasuries tend to be steadier, while long duration and lower-credit debt move more when yields or spreads change.",
  bonds:
    "Corporate and income bonds add issuer-specific credit risk on top of interest-rate risk. Coupon, maturity, seniority, and whether interest can be deferred all matter when evaluating total return and default exposure.",
  forex:
    "Forex pairs are quoted as one currency versus another and react quickly to interest-rate policy, growth expectations, and capital flows. Position sizing matters because the price moves are small but continuous.",
  commodities:
    "Commodity prices respond to supply, demand, storage, seasonality, and geopolitics. They can diversify portfolios, but they also introduce cyclical and event-driven volatility.",
  futures:
    "Futures provide leveraged exposure to indexes, rates, and commodities through standardized contracts. They are useful for hedging and directional views, but margin and contract mechanics raise the risk profile."
} as const;

function formatPrice(value: number) {
  return value >= 10 ? value.toFixed(2) : value.toFixed(4);
}

function getCategoryDescription(category: string) {
  if (category === "fixedIncome") {
    return CATEGORY_DESCRIPTIONS.fixedIncome;
  }

  if (category === "funds") {
    return CATEGORY_DESCRIPTIONS.funds;
  }

  if (category === "bonds") {
    return CATEGORY_DESCRIPTIONS.bonds;
  }

  if (category === "forex") {
    return CATEGORY_DESCRIPTIONS.forex;
  }

  if (category === "commodities") {
    return CATEGORY_DESCRIPTIONS.commodities;
  }

  if (category === "futures") {
    return CATEGORY_DESCRIPTIONS.futures;
  }

  return "Equity research highlights valuation, profitability, and business quality alongside price behavior.";
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function safeIncome(profile: NonNullable<ReturnType<typeof useGameStore.getState>["financialProfiles"][string]>) {
  return profile.income ?? {
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    opEx: 0,
    rnd: 0,
    ebit: 0,
    interestExp: 0,
    ebt: 0,
    taxes: 0,
    netIncome: 0
  };
}

function normalizeProfile(profile: NonNullable<ReturnType<typeof useGameStore.getState>["financialProfiles"][string]>) {
  const income = safeIncome(profile);
  const balanceSheet = profile.balanceSheet ?? {
    cash: Math.round(income.revenue * 0.12),
    currentAssets: Math.round(income.revenue * 0.28),
    totalAssets: Math.round(income.revenue * 0.62),
    currentLiabilities: Math.round(income.revenue * 0.1),
    longTermDebt: Math.round(income.revenue * 0.16),
    totalLiabilities: Math.round(income.revenue * 0.26),
    equity: Math.round(income.revenue * 0.36)
  };

  const cashFlow = profile.cashFlow ?? {
    operatingCashFlow: Math.round(income.netIncome * 1.15),
    investingCashFlow: -Math.round(income.revenue * 0.08),
    financingCashFlow: Math.round(income.revenue * 0.03),
    freeCashFlow: Math.round(income.netIncome * 0.92)
  };

  const performance = profile.performance ?? buildMarketPerformance(profile.symbol, "stocks");
  const ratios = profile.ratios ?? {
    peRatio: "N/A",
    eps: "0.00",
    grossMargin: "0.0",
    netMargin: "0.0",
    roe: "0.0",
    debtToEquity: "0.00"
  };

  return {
    ...profile,
    income,
    balanceSheet,
    cashFlow,
    performance,
    ratios,
    recommendation: profile.recommendation ?? "Hold",
    analystNote: profile.analystNote ?? "Additional statement detail has been reconstructed from the current saved profile."
  };
}

function seededNumber(seedText: string, offset: number) {
  let total = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    total += seedText.charCodeAt(index) * (index + 1 + offset);
  }

  const value = Math.sin(total + offset * 97) * 10000;
  return value - Math.floor(value);
}

function buildMarketPerformance(symbol: string, category: string) {
  const scale =
    category === "forex" ? 6 :
    category === "fixedIncome" ? 8 :
    category === "bonds" ? 12 :
    category === "commodities" ? 20 :
    category === "futures" ? 24 :
    category === "funds" ? 18 :
    28;

  return {
    oneDay: Number((((seededNumber(symbol, 1) - 0.5) * scale * 0.35)).toFixed(2)),
    ytd: Number((((seededNumber(symbol, 2) - 0.45) * scale)).toFixed(2)),
    oneYear: Number((((seededNumber(symbol, 3) - 0.4) * scale * 1.4)).toFixed(2)),
    threeYear: Number((((seededNumber(symbol, 4) - 0.3) * scale * 2.2)).toFixed(2)),
    fiveYear: Number((((seededNumber(symbol, 5) - 0.2) * scale * 3)).toFixed(2))
  };
}

function buildInstrumentMetrics(symbol: string, category: string) {
  const liveTicker = useGameStore.getState().tickers[symbol];
  const base = seededNumber(symbol, 6);

  if (category === "bonds" || category === "fixedIncome") {
    return {
      yieldToMaturity: `${(((liveTicker?.couponRate ?? (2 + base * 7)) * 0.92) + seededNumber(symbol, 10) * 0.7).toFixed(2)}%`,
      duration: (liveTicker?.modifiedDuration ?? (1.2 + seededNumber(symbol, 7) * 9)).toFixed(1),
      creditRating: liveTicker?.creditRating ?? ["AAA", "AA", "A", "BBB", "BB", "B"][Math.floor(seededNumber(symbol, 8) * 6)],
      coupon: `${(liveTicker?.couponRate ?? (3 + seededNumber(symbol, 9) * 6)).toFixed(2)}%`,
      callProtection: liveTicker?.callProtectionLabel ?? (liveTicker?.callable ? "Callable now" : "Non-callable")
    };
  }

  if (category === "forex") {
    return {
      volatility: `${(4 + base * 10).toFixed(2)}%`,
      carrySignal: seededNumber(symbol, 7) > 0.5 ? "Positive carry" : "Negative carry",
      macroBias: seededNumber(symbol, 8) > 0.5 ? "USD strengthening" : "USD softening"
    };
  }

  if (category === "commodities" || category === "futures") {
    return {
      inventoryTrend: seededNumber(symbol, 7) > 0.5 ? "Falling inventories" : "Rising inventories",
      curveShape: seededNumber(symbol, 8) > 0.5 ? "Backwardation" : "Contango",
      seasonalBias: seededNumber(symbol, 9) > 0.5 ? "Supportive" : "Neutral"
    };
  }

  return {
    expenseRatio: `${(0.03 + base * 0.9).toFixed(2)}%`,
    turnover: `${(12 + seededNumber(symbol, 7) * 85).toFixed(1)}%`,
    dividendYield: liveTicker?.dividendYield ? `${(liveTicker.dividendYield * 100).toFixed(2)}%` : `${(0.6 + seededNumber(symbol, 8) * 3.8).toFixed(2)}%`
  };
}

function buildResearchInsights(symbol: string, category: string) {
  const liveTicker = useGameStore.getState().tickers[symbol];

  if (category === "stocks") {
      return {
      marketCap: `$${Math.round(40 + seededNumber(symbol, 10) * 1900)}B`,
      beta: inferInstrumentBeta(liveTicker ?? {
        symbol,
        name: symbol,
        price: 0,
        prevPrice: 0,
        change: 0,
        category: "stocks"
      }).toFixed(2),
      range52Week: `$${(60 + seededNumber(symbol, 12) * 120).toFixed(2)} - $${(150 + seededNumber(symbol, 13) * 180).toFixed(2)}`,
      analystSentiment: ["Overweight", "Neutral", "Market Perform", "Outperform"][Math.floor(seededNumber(symbol, 14) * 4)]
    };
  }

  if (category === "funds") {
    return {
      aum: `$${Math.round(5 + seededNumber(symbol, 10) * 650)}B`,
      styleBox: ["Large Blend", "Large Growth", "Large Value", "Balanced", "Global Allocation"][Math.floor(seededNumber(symbol, 11) * 5)],
      beta: inferInstrumentBeta(liveTicker ?? {
        symbol,
        name: symbol,
        price: 0,
        prevPrice: 0,
        change: 0,
        category: "funds"
      }).toFixed(2),
      trackingError: `${(0.05 + seededNumber(symbol, 12) * 1.3).toFixed(2)}%`,
      standardDeviation: `${(6 + seededNumber(symbol, 13) * 18).toFixed(2)}%`
    };
  }

  if (category === "bonds" || category === "fixedIncome") {
    return {
      spread: `${(45 + seededNumber(symbol, 10) * 280).toFixed(0)} bps`,
      maturity: `${(liveTicker?.maturityYears ?? (1 + seededNumber(symbol, 11) * 28)).toFixed(1)} yrs`,
      seniority: liveTicker?.seniority ?? (seededNumber(symbol, 12) > 0.55 ? "Senior unsecured" : "Senior secured"),
      callable: liveTicker?.callable ? (liveTicker.callProtected ? "Callable with protection" : "Currently callable") : "Non-callable"
    };
  }

  return {
    macroDriver: ["Rates", "Growth", "Inflation", "Dollar trend"][Math.floor(seededNumber(symbol, 10) * 4)],
    volatilityBucket: ["Low", "Moderate", "Elevated", "High"][Math.floor(seededNumber(symbol, 11) * 4)],
    regimeView: ["Range-bound", "Momentum", "Mean reversion", "Event-driven"][Math.floor(seededNumber(symbol, 12) * 4)]
  };
}

function buildResearchBenchmarks(symbol: string, category: string) {
  if (category === "stocks") {
    return {
      benchmark: "S&P 500",
      benchmarkYtd: `${((seededNumber(symbol, 21) - 0.2) * 24).toFixed(2)}%`,
      peerMedianPe: `${(12 + seededNumber(symbol, 22) * 18).toFixed(1)}x`,
      peerMedianMargin: `${(10 + seededNumber(symbol, 23) * 22).toFixed(1)}%`
    };
  }

  if (category === "funds") {
    return {
      benchmark: "Style Index",
      benchmarkYtd: `${((seededNumber(symbol, 21) - 0.15) * 18).toFixed(2)}%`,
      peerMedianExpense: `${(0.04 + seededNumber(symbol, 22) * 0.75).toFixed(2)}%`,
      peerMedianTracking: `${(0.05 + seededNumber(symbol, 23) * 0.9).toFixed(2)}%`
    };
  }

  if (category === "bonds" || category === "fixedIncome") {
    return {
      benchmark: "Agg / Treasury Curve",
      benchmarkYtd: `${((seededNumber(symbol, 21) - 0.35) * 12).toFixed(2)}%`,
      peerMedianSpread: `${(55 + seededNumber(symbol, 22) * 210).toFixed(0)} bps`,
      peerMedianDuration: `${(2 + seededNumber(symbol, 23) * 7).toFixed(1)} yrs`
    };
  }

  return {
    benchmark: "Macro Basket",
    benchmarkYtd: `${((seededNumber(symbol, 21) - 0.3) * 16).toFixed(2)}%`,
    peerMedianVol: `${(5 + seededNumber(symbol, 22) * 17).toFixed(2)}%`,
    peerMedianTrend: seededNumber(symbol, 23) > 0.5 ? "Bullish" : "Neutral"
  };
}

function buildIssuerSummary(symbol: string, category: string) {
  if (category === "stocks") {
    return `${symbol} is being framed as an operating company first, so the key question is whether earnings quality, margin durability, and balance-sheet flexibility justify the current multiple against sector peers.`;
  }

  if (category === "funds") {
    return `${symbol} should be reviewed as a fund family product with a defined mandate, benchmark, and cost structure. The real edge comes from understanding whether the wrapper improves diversification and fits the account objective better than a direct holding.`;
  }

  if (category === "bonds" || category === "fixedIncome") {
    return `${symbol} belongs in a credit-and-duration framework. The issuer, spread behavior, seniority, and benchmark sensitivity matter more here than short-term chart momentum alone.`;
  }

  return `${symbol} should be interpreted through its benchmark basket, macro regime, and event sensitivity. The most useful comparison is how it behaves relative to similar instruments under the same backdrop.`;
}

function buildDeskLens(symbol: string, category: string) {
  if (category === "stocks") {
    return {
      thesis: "Revenue durability, margin direction, and capital discipline are the main drivers of the desk view.",
      risk: "A multiple reset or weaker forward guide would matter more than a single quarter headline.",
      watch: "Watch guidance revisions, buyback cadence, and relative valuation versus direct peers."
    };
  }

  if (category === "funds") {
    return {
      thesis: "The key question is whether the wrapper gives cleaner exposure than building the basket yourself.",
      risk: "Style drift, fee drag, and benchmark slippage can quietly erode the strategy value.",
      watch: "Track benchmark fit, category ranking, and whether the fund still solves the account objective."
    };
  }

  if (category === "bonds" || category === "fixedIncome") {
    return {
      thesis: "Carry only matters if the spread and duration risk are still being paid appropriately.",
      risk: "Credit deterioration or a rates shock can quickly offset coupon income.",
      watch: "Focus on spread moves, refinancing risk, and whether the bond belongs in this sleeve of the portfolio."
    };
  }

  return {
    thesis: "Macro regime and event sensitivity matter more than bottom-up fundamentals here.",
    risk: "Volatility and leverage can dominate the thesis if sizing gets loose.",
    watch: "Track catalysts, regime shifts, and whether the move is trend-driven or event-driven."
  };
}

function buildRiskReporting(symbol: string, category: string) {
  const base = seededNumber(symbol, 41);

  if (category === "stocks" || category === "funds") {
    return {
      relativeStrength: `${((base - 0.32) * 18).toFixed(2)}% vs benchmark`,
      correlation: `${(0.42 + seededNumber(symbol, 42) * 0.48).toFixed(2)} to core benchmark`,
      drawdown: `${(8 + seededNumber(symbol, 43) * 30).toFixed(1)}% peak-to-trough band`
    };
  }

  if (category === "bonds" || category === "fixedIncome") {
    return {
      relativeStrength: `${((base - 0.38) * 9).toFixed(2)}% vs Agg`,
      correlation: `${(0.18 + seededNumber(symbol, 42) * 0.34).toFixed(2)} to equities`,
      drawdown: `${(2 + seededNumber(symbol, 43) * 10).toFixed(1)}% stress band`
    };
  }

  return {
    relativeStrength: `${((base - 0.42) * 13).toFixed(2)}% regime spread`,
    correlation: `${(0.08 + seededNumber(symbol, 42) * 0.52).toFixed(2)} to risk assets`,
    drawdown: `${(5 + seededNumber(symbol, 43) * 22).toFixed(1)}% event band`
  };
}

function buildQuoteTape(symbol: string, price: number, prevPrice: number, category: string) {
  const volatilityBase = seededNumber(symbol, 31);
  const spread = Math.max(price * (0.002 + volatilityBase * 0.01), category === "forex" ? 0.0004 : 0.04);
  const dayLow = Math.max(0.01, Math.min(price, prevPrice) - spread * 0.6);
  const dayHigh = Math.max(price, prevPrice) + spread * 0.9;
  const dayOpen = prevPrice;
  const averageVolume =
    category === "stocks" || category === "funds"
      ? `${Math.round(2 + seededNumber(symbol, 32) * 95)}M`
      : category === "bonds" || category === "fixedIncome"
        ? `${Math.round(45 + seededNumber(symbol, 33) * 380)}k`
        : `${Math.round(15 + seededNumber(symbol, 34) * 140)}k`;

  return {
    dayOpen,
    dayLow,
    dayHigh,
    averageVolume,
    spread: category === "forex" ? spread.toFixed(4) : spread.toFixed(2)
  };
}

function humanizeKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase());
}

export function ResearchTerminal() {
  const selectedTicker = useGameStore((state) => state.selectedTicker);
  const ticker = useGameStore((state) => state.tickers[selectedTicker]);
  const tickers = useGameStore((state) => state.tickers);
  const clients = useGameStore((state) => state.clients);
  const activeClientId = useGameStore((state) => state.activeClientId);
  const currentEvent = useGameStore((state) => state.currentEvent);
  const profile = useGameStore((state) => state.financialProfiles[selectedTicker]);
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const researchUnlocks = useGameStore((state) => state.researchUnlocks);
  const unlockResearch = useGameStore((state) => state.unlockResearch);
  const [activeView, setActiveView] = useState<"overview" | "income" | "balance" | "cashflow">("overview");
  const showRecommendation =
    activeDifficulty === "learner" || activeDifficulty === "trainee" || activeDifficulty === "associate" || researchUnlocks[selectedTicker];
  const activeClient = useMemo(
    () => clients.find((client) => client.id === activeClientId) ?? null,
    [clients, activeClientId]
  );
  const normalizedProfile = profile ? normalizeProfile(profile) : null;

  useEffect(() => {
    if (!normalizedProfile && activeView !== "overview") {
      setActiveView("overview");
    }
  }, [activeView, normalizedProfile]);

  const marketPerformance = useMemo(
    () => (ticker ? (normalizedProfile?.performance ?? buildMarketPerformance(ticker.symbol, ticker.category)) : null),
    [normalizedProfile, ticker]
  );
  const instrumentMetrics = useMemo(
    () => (ticker ? buildInstrumentMetrics(ticker.symbol, ticker.category) : null),
    [ticker]
  );
  const researchInsights = useMemo(
    () => (ticker ? buildResearchInsights(ticker.symbol, ticker.category) : null),
    [ticker]
  );
  const benchmarkSnapshot = useMemo(
    () => (ticker ? buildResearchBenchmarks(ticker.symbol, ticker.category) : null),
    [ticker]
  );
  const peerComparisons = useMemo(() => {
    if (!ticker) {
      return [];
    }

    return Object.values(tickers)
      .filter((entry) =>
        entry.symbol !== ticker.symbol &&
        entry.category === ticker.category &&
        (ticker.sector ? entry.sector === ticker.sector : true)
      )
      .slice(0, 3)
      .map((entry) => ({
        symbol: entry.symbol,
        name: entry.name,
        change: entry.change,
        price: entry.price
      }));
  }, [ticker, tickers]);
  const strategySummary = useMemo(() => {
    if (!ticker) {
      return "";
    }

    if (ticker.category === "stocks") {
      return `${ticker.name} trades like a ${ticker.sector?.toLowerCase() ?? "core"} franchise where valuation, earnings quality, and margin durability drive the setup. Compare its price reaction, margin profile, and balance-sheet leverage against direct peers before leaning on the recommendation.`;
    }

    if (ticker.category === "funds") {
      return `${ticker.name} should be evaluated as a strategy wrapper, not just a ticker. Focus on mandate fit, diversification role, expense drag, tracking behavior, and whether the style profile matches the client or player objective.`;
    }

    if (ticker.category === "bonds" || ticker.category === "fixedIncome") {
      return `${ticker.name} is more about credit and term structure than simple price momentum. Review spread, maturity, seniority, yield profile, and rate sensitivity together before deciding whether the carry justifies the risk.`;
    }

    return `${ticker.name} should be read through its macro driver, volatility regime, and the current event cycle. Use the instrument metrics and recent performance windows as context, not as a stand-alone signal.`;
  }, [ticker]);
  const issuerSummary = useMemo(
    () => (ticker ? buildIssuerSummary(ticker.symbol, ticker.category) : ""),
    [ticker]
  );
  const quoteTape = useMemo(
    () => (ticker ? buildQuoteTape(ticker.symbol, ticker.price, ticker.prevPrice, ticker.category) : null),
    [ticker]
  );
  const deskLens = useMemo(
    () => (ticker ? buildDeskLens(ticker.symbol, ticker.category) : null),
    [ticker]
  );
  const riskReporting = useMemo(
    () => (ticker ? buildRiskReporting(ticker.symbol, ticker.category) : null),
    [ticker]
  );
  const taxGuidance = useMemo(
    () => (ticker && activeClient ? buildClientTaxGuidance(activeClient, ticker) : null),
    [activeClient, ticker]
  );

  if (!ticker) {
    return <div className="empty-state">Select an instrument to load research.</div>;
  }

  if (!normalizedProfile) {
    return (
      <div className="side-panel">
        <h3>{selectedTicker}</h3>
        <div className="research-tabs">
          <button className="tab-btn active">Overview</button>
        </div>
        {marketPerformance ? (
          <div className="metric-grid compact">
            <span className={marketPerformance.oneDay >= 0 ? "up" : "down"}>1D {formatSignedPercent(marketPerformance.oneDay)}</span>
            <span className={marketPerformance.ytd >= 0 ? "up" : "down"}>YTD {formatSignedPercent(marketPerformance.ytd)}</span>
            <span className={marketPerformance.oneYear >= 0 ? "up" : "down"}>1Y {formatSignedPercent(marketPerformance.oneYear)}</span>
            <span className={marketPerformance.threeYear >= 0 ? "up" : "down"}>3Y {formatSignedPercent(marketPerformance.threeYear)}</span>
            <span className={marketPerformance.fiveYear >= 0 ? "up" : "down"}>5Y {formatSignedPercent(marketPerformance.fiveYear)}</span>
          </div>
        ) : null}
        {quoteTape ? (
          <div className="research-callout-grid">
            <div className="research-callout">
              <span>Open</span>
              <strong>{formatPrice(quoteTape.dayOpen)}</strong>
            </div>
            <div className="research-callout">
              <span>Day Range</span>
              <strong>{formatPrice(quoteTape.dayLow)} - {formatPrice(quoteTape.dayHigh)}</strong>
            </div>
            <div className="research-callout">
              <span>Avg Volume</span>
              <strong>{quoteTape.averageVolume}</strong>
            </div>
            <div className="research-callout">
              <span>Spread</span>
              <strong>{quoteTape.spread}</strong>
            </div>
          </div>
        ) : null}
        {currentEvent ? (
          <div className="research-callout">
            <span>Event Lens</span>
            <strong>{currentEvent}</strong>
          </div>
        ) : null}
        <div className="metric-list">
          <span>{ticker.name}</span>
          <span>Category: {ticker.category}</span>
          {ticker.sector ? <span>Segment: {ticker.sector}</span> : null}
          <span>Price: {formatPrice(ticker.price)}</span>
          <span>Previous: {formatPrice(ticker.prevPrice)}</span>
          <span className={ticker.change >= 0 ? "up" : "down"}>Change: {ticker.change >= 0 ? "+" : ""}{ticker.change.toFixed(2)}%</span>
          {instrumentMetrics ? Object.entries(instrumentMetrics).map(([key, value]) => (
            <span key={key}>{key.replace(/([A-Z])/g, " $1")}: {value}</span>
          )) : null}
        </div>
        {researchInsights ? (
          <div className="research-callout-grid research-callout-grid--metrics">
            {Object.entries(researchInsights).map(([key, value]) => (
              <div className="research-callout" key={key}>
                <span>{humanizeKey(key)}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        ) : null}
        {peerComparisons.length > 0 ? (
          <div className="comparison-section">
            <div className="peer-table-title">Peer Snapshot</div>
            <div className="comparison-grid">
              {peerComparisons.map((peer) => (
                <div className="comparison-card" key={peer.symbol}>
                  <span>{peer.symbol}</span>
                  <strong>{peer.name}</strong>
                  <small>{formatPrice(peer.price)}</small>
                  <small className={peer.change >= 0 ? "up" : "down"}>{formatSignedPercent(peer.change)}</small>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {benchmarkSnapshot ? (
          <div className="comparison-section">
            <div className="peer-table-title">Benchmark Comparison</div>
            <div className="comparison-grid">
              {Object.entries(benchmarkSnapshot).map(([key, value]) => (
                <div className="comparison-card" key={key}>
                  <span>{humanizeKey(key)}</span>
                  <strong>{String(value)}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {riskReporting ? (
          <div className="comparison-section">
            <div className="peer-table-title">Risk Reporting</div>
            <div className="comparison-grid">
              <div className="comparison-card">
                <span>Relative Strength</span>
                <strong>{riskReporting.relativeStrength}</strong>
              </div>
              <div className="comparison-card">
                <span>Correlation</span>
                <strong>{riskReporting.correlation}</strong>
              </div>
              <div className="comparison-card">
                <span>Drawdown Band</span>
                <strong>{riskReporting.drawdown}</strong>
              </div>
            </div>
          </div>
        ) : null}
        {taxGuidance ? (
          <div className="comparison-section">
            <div className="peer-table-title">Tax Lens</div>
            <div className="comparison-grid">
              <div className="comparison-card">
                <span>Fit</span>
                <strong>{taxGuidance.fitLabel}</strong>
                <small>{taxGuidance.estimatedTaxDrag}</small>
              </div>
              <div className="comparison-card">
                <span>Best Home</span>
                <strong>{taxGuidance.bestHome}</strong>
                <small>{activeClient?.name}</small>
              </div>
            </div>
            <div className="research-callout-grid research-callout-grid--stacked">
              <div className="research-callout">
                <span>Tax Takeaway</span>
                <strong>{taxGuidance.summary}</strong>
              </div>
              <div className="research-callout">
                <span>Planner Caution</span>
                <strong>{taxGuidance.caution}</strong>
              </div>
            </div>
          </div>
        ) : null}
        {deskLens ? (
          <div className="research-callout-grid research-callout-grid--stacked">
            <div className="research-callout">
              <span>Desk Thesis</span>
              <strong>{deskLens.thesis}</strong>
            </div>
            <div className="research-callout">
              <span>Primary Risk</span>
              <strong>{deskLens.risk}</strong>
            </div>
            <div className="research-callout">
              <span>What To Watch</span>
              <strong>{deskLens.watch}</strong>
            </div>
          </div>
        ) : null}
        <p className="explanation">
          {getCategoryDescription(ticker.category)}
        </p>
        <p className="explanation">{issuerSummary}</p>
        <p className="explanation">{strategySummary}</p>
      </div>
    );
  }

  return (
    <div className="side-panel">
      <h3>{selectedTicker}</h3>
      <div className="research-tabs">
        <button className={activeView === "overview" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveView("overview")}>Overview</button>
        <button className={activeView === "income" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveView("income")}>Income Statement</button>
        <button className={activeView === "balance" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveView("balance")}>Balance Sheet</button>
        <button className={activeView === "cashflow" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveView("cashflow")}>Cash Flows</button>
      </div>
      {marketPerformance ? (
        <div className="metric-grid compact">
          <span className={marketPerformance.oneDay >= 0 ? "up" : "down"}>1D {formatSignedPercent(marketPerformance.oneDay)}</span>
          <span className={marketPerformance.ytd >= 0 ? "up" : "down"}>YTD {formatSignedPercent(marketPerformance.ytd)}</span>
          <span className={marketPerformance.oneYear >= 0 ? "up" : "down"}>1Y {formatSignedPercent(marketPerformance.oneYear)}</span>
          <span className={marketPerformance.threeYear >= 0 ? "up" : "down"}>3Y {formatSignedPercent(marketPerformance.threeYear)}</span>
          <span className={marketPerformance.fiveYear >= 0 ? "up" : "down"}>5Y {formatSignedPercent(marketPerformance.fiveYear)}</span>
        </div>
      ) : null}
      {quoteTape ? (
        <div className="research-callout-grid">
          <div className="research-callout">
            <span>Open</span>
            <strong>{formatPrice(quoteTape.dayOpen)}</strong>
          </div>
          <div className="research-callout">
            <span>Day Range</span>
            <strong>{formatPrice(quoteTape.dayLow)} - {formatPrice(quoteTape.dayHigh)}</strong>
          </div>
          <div className="research-callout">
            <span>Avg Volume</span>
            <strong>{quoteTape.averageVolume}</strong>
          </div>
          <div className="research-callout">
            <span>Spread</span>
            <strong>{quoteTape.spread}</strong>
          </div>
        </div>
      ) : null}
      {currentEvent ? (
        <div className="research-callout">
          <span>Event Lens</span>
          <strong>{currentEvent}</strong>
        </div>
      ) : null}
      {activeView === "overview" ? (
        <>
          <div className="metric-list">
            <span>P/E: {normalizedProfile.ratios.peRatio}x</span>
            <span>EPS: ${normalizedProfile.ratios.eps}</span>
            <span>Gross Margin: {normalizedProfile.ratios.grossMargin}%</span>
            <span>Net Margin: {normalizedProfile.ratios.netMargin}%</span>
            <span>ROE: {normalizedProfile.ratios.roe}%</span>
            <span>Debt/Equity: {normalizedProfile.ratios.debtToEquity}</span>
          </div>
          {researchInsights ? (
            <div className="research-callout-grid research-callout-grid--metrics">
              {Object.entries(researchInsights).map(([key, value]) => (
                <div className="research-callout" key={key}>
                  <span>{humanizeKey(key)}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          ) : null}
          {peerComparisons.length > 0 ? (
            <div className="comparison-section">
              <div className="peer-table-title">Peer Snapshot</div>
              <div className="comparison-grid">
                {peerComparisons.map((peer) => (
                  <div className="comparison-card" key={peer.symbol}>
                    <span>{peer.symbol}</span>
                    <strong>{peer.name}</strong>
                    <small>{formatPrice(peer.price)}</small>
                    <small className={peer.change >= 0 ? "up" : "down"}>{formatSignedPercent(peer.change)}</small>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {benchmarkSnapshot ? (
            <div className="comparison-section">
              <div className="peer-table-title">Benchmark Comparison</div>
              <div className="comparison-grid">
                {Object.entries(benchmarkSnapshot).map(([key, value]) => (
                  <div className="comparison-card" key={key}>
                    <span>{humanizeKey(key)}</span>
                    <strong>{String(value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {riskReporting ? (
            <div className="comparison-section">
              <div className="peer-table-title">Risk Reporting</div>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <span>Relative Strength</span>
                  <strong>{riskReporting.relativeStrength}</strong>
                </div>
                <div className="comparison-card">
                  <span>Correlation</span>
                  <strong>{riskReporting.correlation}</strong>
                </div>
                <div className="comparison-card">
                  <span>Drawdown Band</span>
                  <strong>{riskReporting.drawdown}</strong>
                </div>
              </div>
            </div>
          ) : null}
          {taxGuidance ? (
            <div className="comparison-section">
              <div className="peer-table-title">Tax Lens</div>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <span>Fit</span>
                  <strong>{taxGuidance.fitLabel}</strong>
                  <small>{taxGuidance.estimatedTaxDrag}</small>
                </div>
                <div className="comparison-card">
                  <span>Best Home</span>
                  <strong>{taxGuidance.bestHome}</strong>
                  <small>{activeClient?.name}</small>
                </div>
              </div>
              <div className="research-callout-grid research-callout-grid--stacked">
                <div className="research-callout">
                  <span>Tax Takeaway</span>
                  <strong>{taxGuidance.summary}</strong>
                </div>
                <div className="research-callout">
                  <span>Planner Caution</span>
                  <strong>{taxGuidance.caution}</strong>
                </div>
              </div>
            </div>
          ) : null}
          {deskLens ? (
            <div className="research-callout-grid research-callout-grid--stacked">
              <div className="research-callout">
                <span>Desk Thesis</span>
                <strong>{deskLens.thesis}</strong>
              </div>
              <div className="research-callout">
                <span>Primary Risk</span>
                <strong>{deskLens.risk}</strong>
              </div>
              <div className="research-callout">
                <span>What To Watch</span>
                <strong>{deskLens.watch}</strong>
              </div>
            </div>
          ) : null}
          <div className="income-lines">
            <p>Revenue: ${normalizedProfile.income.revenue.toLocaleString()}M</p>
            <p>Gross Profit: ${normalizedProfile.income.grossProfit.toLocaleString()}M</p>
            <p>Net Income: ${normalizedProfile.income.netIncome.toLocaleString()}M</p>
          </div>
          <p className="explanation">{issuerSummary}</p>
          <p className="explanation">{strategySummary}</p>
        </>
      ) : null}
      {activeView === "income" ? (
        <div className="statement-list">
          <span>Revenue: ${normalizedProfile.income.revenue.toLocaleString()}M</span>
          <span>COGS: ${normalizedProfile.income.cogs.toLocaleString()}M</span>
          <span>Gross Profit: ${normalizedProfile.income.grossProfit.toLocaleString()}M</span>
          <span>Operating Expense: ${normalizedProfile.income.opEx.toLocaleString()}M</span>
          <span>R&D: ${normalizedProfile.income.rnd.toLocaleString()}M</span>
          <span>EBIT: ${normalizedProfile.income.ebit.toLocaleString()}M</span>
          <span>Interest Expense: ${normalizedProfile.income.interestExp.toLocaleString()}M</span>
          <span>Pre-Tax Income: ${normalizedProfile.income.ebt.toLocaleString()}M</span>
          <span>Taxes: ${normalizedProfile.income.taxes.toLocaleString()}M</span>
          <span>Net Income: ${normalizedProfile.income.netIncome.toLocaleString()}M</span>
        </div>
      ) : null}
      {activeView === "balance" ? (
        <div className="statement-list">
          <span>Cash: ${normalizedProfile.balanceSheet.cash.toLocaleString()}M</span>
          <span>Current Assets: ${normalizedProfile.balanceSheet.currentAssets.toLocaleString()}M</span>
          <span>Total Assets: ${normalizedProfile.balanceSheet.totalAssets.toLocaleString()}M</span>
          <span>Current Liabilities: ${normalizedProfile.balanceSheet.currentLiabilities.toLocaleString()}M</span>
          <span>Long-Term Debt: ${normalizedProfile.balanceSheet.longTermDebt.toLocaleString()}M</span>
          <span>Total Liabilities: ${normalizedProfile.balanceSheet.totalLiabilities.toLocaleString()}M</span>
          <span>Equity: ${normalizedProfile.balanceSheet.equity.toLocaleString()}M</span>
        </div>
      ) : null}
      {activeView === "cashflow" ? (
        <div className="statement-list">
          <span>Operating Cash Flow: ${normalizedProfile.cashFlow.operatingCashFlow.toLocaleString()}M</span>
          <span>Investing Cash Flow: ${normalizedProfile.cashFlow.investingCashFlow.toLocaleString()}M</span>
          <span>Financing Cash Flow: ${normalizedProfile.cashFlow.financingCashFlow.toLocaleString()}M</span>
          <span>Free Cash Flow: ${normalizedProfile.cashFlow.freeCashFlow.toLocaleString()}M</span>
        </div>
      ) : null}
      {showRecommendation ? (
        <>
          <div className="recommendation">{normalizedProfile.recommendation}</div>
          <p className="explanation">{normalizedProfile.analystNote}</p>
        </>
      ) : (
        <button className="primary-btn" onClick={() => unlockResearch(selectedTicker)}>
          Unlock Recommendation (-5)
        </button>
      )}
    </div>
  );
}
