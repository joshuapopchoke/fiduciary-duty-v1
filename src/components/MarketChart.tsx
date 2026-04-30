import { useEffect, useMemo, useRef, useState } from "react";
import type { FinancialProfile, TickerCategory } from "../types/market";
import { useGameStore } from "../store/gameStore";
import type { ChartPeriod } from "../types/gameState";

const CATEGORY_LABELS: Record<TickerCategory, string> = {
  stocks: "Equities",
  funds: "Funds",
  fixedIncome: "Fixed Income",
  bonds: "Bonds",
  forex: "Forex",
  commodities: "Commodities",
  futures: "Futures"
};

const CATEGORY_ORDER: TickerCategory[] = ["stocks", "funds", "fixedIncome", "bonds", "forex", "commodities", "futures"];
const CHART_PERIODS: ChartPeriod[] = ["current", "1D", "6M", "YTD", "1Y", "3Y", "5Y"];

function formatPrice(value: number, category: TickerCategory) {
  if (category === "forex") {
    return value.toFixed(value >= 10 ? 2 : 4);
  }

  return value.toFixed(2);
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    path += ` L ${point.x} ${point.y}`;
  }
  return path;
}

function seededNumber(seedText: string, offset: number) {
  let total = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    total += seedText.charCodeAt(index) * (index + 1 + offset);
  }

  const value = Math.sin(total + offset * 97) * 10000;
  return value - Math.floor(value);
}

function deriveReturnForPeriod(period: ChartPeriod, tickerSymbol: string, category: TickerCategory, profile?: FinancialProfile | null) {
  if (period === "current") {
    return null;
  }

  if (profile?.performance) {
    if (period === "1D") return profile.performance.oneDay;
    if (period === "YTD") return profile.performance.ytd;
    if (period === "1Y") return profile.performance.oneYear;
    if (period === "3Y") return profile.performance.threeYear;
    if (period === "5Y") return profile.performance.fiveYear;
    if (period === "6M") {
      return Number((((profile.performance.oneYear * 0.52) + (profile.performance.ytd * 0.48)) / 1.35).toFixed(2));
    }
  }

  const categoryScale =
    category === "forex" ? 5 :
    category === "fixedIncome" ? 8 :
    category === "bonds" ? 10 :
    category === "commodities" ? 18 :
    category === "futures" ? 22 :
    category === "funds" ? 14 :
    24;

  const base = {
    "1D": (seededNumber(tickerSymbol, 1) - 0.5) * categoryScale * 0.4,
    "6M": (seededNumber(tickerSymbol, 2) - 0.42) * categoryScale * 0.9,
    "YTD": (seededNumber(tickerSymbol, 3) - 0.38) * categoryScale,
    "1Y": (seededNumber(tickerSymbol, 4) - 0.34) * categoryScale * 1.4,
    "3Y": (seededNumber(tickerSymbol, 5) - 0.24) * categoryScale * 2.3,
    "5Y": (seededNumber(tickerSymbol, 6) - 0.18) * categoryScale * 3.1,
    current: 0
  } as const;

  return Number(base[period].toFixed(2));
}

function buildPeriodSeries(
  tickerSymbol: string,
  currentPrice: number,
  beta: number,
  category: TickerCategory,
  period: ChartPeriod,
  currentSeries: number[],
  profile?: FinancialProfile | null
) {
  if (period === "current") {
    return currentSeries;
  }

  const points = 48;
  const totalReturn = deriveReturnForPeriod(period, tickerSymbol, category, profile) ?? 0;
  const startPrice = currentPrice / Math.max(0.1, 1 + totalReturn / 100);
  const volatility =
    category === "forex" ? 0.004 :
    category === "fixedIncome" ? 0.003 :
    category === "bonds" ? 0.005 :
    category === "commodities" ? 0.012 :
    category === "futures" ? 0.016 :
    category === "funds" ? 0.007 :
    0.011;
  const normalizedBeta = Math.max(0.05, Math.abs(beta || 1));
  const generated: number[] = [startPrice];
  let walker = startPrice;

  for (let index = 1; index < points - 1; index += 1) {
    const progress = index / Math.max(points - 1, 1);
    const targetAtProgress = startPrice + (currentPrice - startPrice) * progress;
    const remaining = points - 1 - index;
    const anchorStep = (currentPrice - walker) / Math.max(remaining, 1);
    const meanReversion = (targetAtProgress - walker) * (0.18 + normalizedBeta * 0.03);
    const swingBase = currentPrice * volatility * (0.65 + normalizedBeta * 0.55);
    const shock =
      (seededNumber(`${tickerSymbol}-${period}`, index) - 0.5) * swingBase +
      Math.sin(progress * Math.PI * 6 * (0.9 + seededNumber(`${tickerSymbol}-${period}`, 101))) * swingBase * 0.35 +
      Math.cos(progress * Math.PI * 10 * (0.7 + seededNumber(`${tickerSymbol}-${period}`, 202))) * swingBase * 0.22;
    walker = Math.max(0.01, walker + anchorStep * 0.55 + meanReversion + shock);
    generated.push(walker);
  }
  generated.push(currentPrice);
  return generated;
}

export function MarketChart() {
  const tickers = useGameStore((state) => state.tickers);
  const histories = useGameStore((state) => state.histories);
  const financialProfiles = useGameStore((state) => state.financialProfiles);
  const selectedTicker = useGameStore((state) => state.selectedTicker);
  const selectTicker = useGameStore((state) => state.selectTicker);
  const currentEvent = useGameStore((state) => state.currentEvent);
  const cycleNumber = useGameStore((state) => state.cycleNumber);
  const lastMarketRefreshAt = useGameStore((state) => state.lastMarketRefreshAt);
  const lastCycleSummary = useGameStore((state) => state.lastCycleSummary);
  const timerSeconds = useGameStore((state) => state.timerSeconds);
  const activePeriod = useGameStore((state) => state.selectedChartPeriod);
  const setChartPeriod = useGameStore((state) => state.setChartPeriod);
  const tickerStripRef = useRef<HTMLDivElement | null>(null);

  const ticker = tickers[selectedTicker];
  const [activeCategory, setActiveCategory] = useState<TickerCategory>(ticker?.category ?? "stocks");

  useEffect(() => {
    if (ticker?.category) {
      setActiveCategory(ticker.category);
    }
  }, [ticker?.category]);

  const visibleTickers = useMemo(
    () => Object.values(tickers).filter((entry) => entry.category === activeCategory),
    [activeCategory, tickers]
  );
  const displayTicker = (ticker && ticker.category === activeCategory ? ticker : visibleTickers[0]) ?? ticker;
  const rawSeries = displayTicker ? histories[displayTicker.symbol] ?? [] : [];
  const series = useMemo(() => {
    if (!displayTicker) {
      return [];
    }

    return buildPeriodSeries(
      displayTicker.symbol,
      displayTicker.price,
      displayTicker.beta ?? 1,
      displayTicker.category,
      activePeriod,
      rawSeries,
      financialProfiles[displayTicker.symbol]
    );
  }, [activePeriod, displayTicker, financialProfiles, rawSeries]);

  const chartPoints = useMemo(() => {
    if (series.length === 0) {
      return [];
    }

    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = Math.max(max - min, 1);
    const padding = 8;

    return series
      .map((value, index) => {
        const x = (index / Math.max(series.length - 1, 1)) * 100;
        const y = 100 - padding - ((value - min) / range) * (100 - padding * 2);
        return { x, y };
      });
  }, [series]);

  const linePath = useMemo(() => buildLinePath(chartPoints), [chartPoints]);
  const fillPath = useMemo(() => {
    if (chartPoints.length === 0) {
      return "";
    }

    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    return `${buildLinePath(chartPoints)} L ${last.x} 100 L ${first.x} 100 Z`;
  }, [chartPoints]);

  const refreshStamp = lastMarketRefreshAt
    ? new Date(lastMarketRefreshAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "Pending";
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="market-title">
          <h2>Market Chart</h2>
          <span className="panel-meta">{displayTicker?.name ?? "Select an instrument"}</span>
        </div>
        <div className={`ticker-move ${displayTicker?.change >= 0 ? "up" : "down"}`}>
          <strong>{displayTicker?.name ?? "--"}</strong>
          <small>
            {displayTicker ? `${displayTicker.symbol} ${formatPrice(displayTicker.price, displayTicker.category)}` : "--"}
          </small>
          <span>{displayTicker ? `${displayTicker.change >= 0 ? "+" : ""}${displayTicker.change.toFixed(2)}%` : "0.00%"}</span>
        </div>
      </div>
      <div className="market-toolbar">
        <div className="category-strip">
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              className={category === activeCategory ? "ticker-pill active" : "ticker-pill"}
              onClick={() => {
                setActiveCategory(category);
                const fallbackTicker = Object.values(tickers).find((entry) => entry.category === category);
                if (fallbackTicker) {
                  selectTicker(fallbackTicker.symbol);
                }
              }}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
        <div className="period-strip">
          {CHART_PERIODS.map((period) => (
            <button
              key={period}
              className={period === activePeriod ? "ticker-pill active" : "ticker-pill"}
              onClick={() => setChartPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="ticker-strip-wrap">
        <button
          type="button"
          className="ticker-scroll-btn"
          aria-label="Scroll instruments left"
          onClick={() => tickerStripRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
        >
          ‹
        </button>
        <div className="ticker-strip" ref={tickerStripRef}>
          {visibleTickers.map((entry) => (
            <button
              key={entry.symbol}
              className={entry.symbol === displayTicker?.symbol ? "ticker-pill active" : "ticker-pill"}
              onClick={() => {
                setActiveCategory(entry.category);
                selectTicker(entry.symbol);
              }}
            >
              <span className="ticker-pill-content">
                <strong>{entry.symbol}</strong>
                <small>{formatPrice(entry.price, entry.category)}</small>
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ticker-scroll-btn"
          aria-label="Scroll instruments right"
          onClick={() => tickerStripRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
        >
          ›
        </button>
      </div>
      <div className="market-banner">
        <span>{CATEGORY_LABELS[activeCategory]} universe</span>
        <strong>{visibleTickers.length} instruments loaded</strong>
        <span>View {activePeriod}</span>
        <span>Cycle {cycleNumber} live</span>
        <span>Next refresh {minutes}:{seconds.toString().padStart(2, "0")}</span>
        <span>{currentEvent ? `Event: ${currentEvent}` : "No active market event"}</span>
      </div>
      <div className="market-summary-strip">
        <div className="market-summary-card">
          <span>Last Market Reset</span>
          <strong>{refreshStamp}</strong>
        </div>
        <div className="market-summary-card">
          <span>Top Mover</span>
          <strong>
            {lastCycleSummary?.leaderSymbol ?? "--"} {lastCycleSummary ? `${lastCycleSummary.leaderChange >= 0 ? "+" : ""}${lastCycleSummary.leaderChange.toFixed(2)}%` : ""}
          </strong>
        </div>
        <div className="market-summary-card">
          <span>Weakest Name</span>
          <strong>
            {lastCycleSummary?.laggardSymbol ?? "--"} {lastCycleSummary ? `${lastCycleSummary.laggardChange >= 0 ? "+" : ""}${lastCycleSummary.laggardChange.toFixed(2)}%` : ""}
          </strong>
        </div>
        <div className="market-summary-card">
          <span>Cycle Event</span>
          <strong>{lastCycleSummary?.eventTitle ?? "Routine rotation"}</strong>
        </div>
      </div>
      <div className="chart-wrap">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g className="chart-grid">
            {[20, 40, 60, 80].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} />
            ))}
          </g>
          {fillPath ? <path d={fillPath} fill="url(#chartFill)" /> : null}
          <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.35" className="chart-line" />
        </svg>
      </div>
    </section>
  );
}
