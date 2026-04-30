import { useEffect, useRef, useState } from "react";
import { useGameStore, useSelectedClient } from "../store/gameStore";
import { ClientQuestionBell, ClientQuestionPopup, useClientQuestionNotification } from "./ClientQuestionNotification";
import { MarketChart } from "./MarketChart";
import { OrderEntry } from "./OrderEntry";

const SESSION_DURATION_SECONDS = 2 * 60 * 60;

interface IpsViolation {
  ticker: string;
  reason: string;
  compliant: boolean;
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// Exported so ModuleBanner in the workspace can embed it in the header strip
export function useRetirementSessionState() {
  const timerSeconds = useGameStore((state) => state.timerSeconds);
  const isPaused = useGameStore((state) => state.isPaused);
  const tickers = useGameStore((state) => state.tickers);

  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(SESSION_DURATION_SECONDS);
  const [sessionExpired, setSessionExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused || sessionExpired) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSessionSecondsLeft(prev => {
        if (prev <= 1) { setSessionExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, sessionExpired]);

  const [lastSnapshotAt, setLastSnapshotAt] = useState(timerSeconds);
  const [marketSnapshots, setMarketSnapshots] = useState<Array<{ time: number; prices: Record<string, number> }>>([
    { time: timerSeconds, prices: Object.fromEntries(Object.entries(tickers).map(([k, v]) => [k, v.price])) }
  ]);

  useEffect(() => {
    if (timerSeconds - lastSnapshotAt >= 900) {
      setMarketSnapshots(prev => [...prev.slice(-4), {
        time: timerSeconds,
        prices: Object.fromEntries(Object.entries(tickers).map(([k, v]) => [k, v.price]))
      }]);
      setLastSnapshotAt(timerSeconds);
    }
  }, [timerSeconds, lastSnapshotAt, tickers]);

  const countdownColor = sessionSecondsLeft < 900 ? "var(--red)" : sessionSecondsLeft < 1800 ? "var(--amber)" : "var(--green)";
  const nextUpdateIn = Math.max(0, 900 - (timerSeconds - lastSnapshotAt));

  // Market change since last snapshot
  let marketChangeLine = "";
  if (marketSnapshots.length >= 2) {
    const latest = marketSnapshots[marketSnapshots.length - 1];
    const prior = marketSnapshots[marketSnapshots.length - 2];
    marketChangeLine = Object.keys(latest.prices).slice(0, 4).map(tk => {
      const now = latest.prices[tk] ?? 0;
      const then = prior.prices[tk] ?? now;
      const pct = then === 0 ? 0 : ((now - then) / then) * 100;
      return `${tk} ${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    }).join("  ");
  }

  return { sessionSecondsLeft, sessionExpired, countdownColor, nextUpdateIn, marketChangeLine, isPaused, marketSnapshots, tickers };
}

// Small inline strip for the ModuleBanner compact row
export function RetirementSessionStrip() {
  const { sessionSecondsLeft, sessionExpired, countdownColor, nextUpdateIn, marketChangeLine, isPaused } = useRetirementSessionState();
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: "0.68rem", flexWrap: "wrap" }}>
      <span style={{ color: "var(--muted)" }}>Session</span>
      <strong style={{ color: countdownColor, fontVariantNumeric: "tabular-nums" }}>
        {sessionExpired ? "⏱ Expired" : formatCountdown(sessionSecondsLeft)}
      </strong>
      <span style={{ color: "var(--muted)" }}>{isPaused ? "Paused" : `Next update ${nextUpdateIn}s`}</span>
      {marketChangeLine && <span style={{ color: "var(--muted)" }}>{marketChangeLine}</span>}
    </div>
  );
}

// Main panel — just order entry + IPS compliance log
export function RetirementPlanningPanel() {
  const activeClient = useSelectedClient();
  const tickers = useGameStore((state) => state.tickers);
  const activeTraineeId = useGameStore((state) => state.activeTraineeId);
  const updateLiveTraineeScore = useGameStore((state) => state.updateLiveTraineeScore);

  const [ipsLog, setIpsLog] = useState<IpsViolation[]>([]);
  const notif = useClientQuestionNotification("retirement-planning", "trainee", (telemetry) => {
    const correct = Math.round((telemetry.score / 100) * telemetry.answeredCount);
    updateLiveTraineeScore(activeTraineeId, "retirement-planning", correct, telemetry.answeredCount);
  });
  const holdings = useGameStore((state) =>
    activeClient ? state.clients.find(c => c.id === activeClient.id)?.holdings ?? {} : {}
  );
  const prevHoldingsRef = useRef<typeof holdings>({});

  useEffect(() => {
    if (!activeClient) return;
    const prev = prevHoldingsRef.current;
    for (const [key, holding] of Object.entries(holdings)) {
      if (!prev[key]) {
        const ticker = holding.ticker;
        const prohibited = activeClient.investmentPolicy.prohibitedBuckets ?? [];
        const isProhibited = prohibited.some(b => ticker.toLowerCase().includes(b.toLowerCase()));
        let compliant = true;
        let reason = `${ticker} — within IPS parameters for ${activeClient.name}`;
        if (isProhibited) {
          compliant = false;
          reason = `${ticker} is in a prohibited bucket (${prohibited.join(", ")}) per ${activeClient.name}'s IPS.`;
        } else {
          const totalValue = Object.values(holdings).reduce((s, h) => s + (tickers[h.ticker]?.price ?? 0) * h.shares, 0) + activeClient.cash;
          const equityValue = Object.values(holdings).reduce((s, h) => s + (tickers[h.ticker]?.price ?? 0) * h.shares, 0);
          const equityPct = totalValue > 0 ? equityValue / totalValue : 0;
          if (equityPct > (activeClient.investmentPolicy.targetEquityMaxPct ?? 1)) {
            compliant = false;
            reason = `Equity at ${(equityPct * 100).toFixed(0)}% exceeds IPS max of ${((activeClient.investmentPolicy.targetEquityMaxPct ?? 1) * 100).toFixed(0)}% for ${activeClient.name}.`;
          }
        }
        setIpsLog(prev => [{ ticker, reason, compliant }, ...prev.slice(0, 9)]);
      }
    }
    prevHoldingsRef.current = holdings;
  }, [holdings, activeClient, tickers]);

  return (
    <div className="retirement-stock-workspace">
      <ClientQuestionPopup state={notif.state} onSelect={notif.selectAnswer} onDismiss={notif.dismissQuestion} />
      <MarketChart />
      <section className="panel">
        <div className="panel-header">
          <div className="side-panel-heading">
            <h2>Retirement Client Questions</h2>
            <span className="panel-meta">{activeClient ? `${activeClient.name} retirement account guidance` : "Select a client to begin"}</span>
          </div>
          <ClientQuestionBell state={notif.state} onOpen={notif.openNotification} />
        </div>
        <div className="question-panel">
          <div className="question-toolbar">
            <span className="question-chip">IRA / 401(k)</span>
            <span className="question-chip">RMDs</span>
            <span className="question-chip">Roth strategy</span>
            <span className="question-chip">{notif.state.answeredCount} answered</span>
          </div>
          <p className="explanation">
            {notif.state.pendingQuestion
              ? "A client retirement-account question is waiting."
              : "Use the client bell to draw retirement-account questions while managing the account and IPS."}
          </p>
          <button type="button" className="primary-btn" onClick={() => notif.queueNextQuestion(true)}>
            Ask Retirement Question
          </button>
        </div>
      </section>
      <OrderEntry />
      {ipsLog.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <h2>IPS Compliance Log</h2>
            <span className="panel-meta">{ipsLog.filter(e => e.compliant).length}/{ipsLog.length} compliant</span>
          </div>
          <div style={{ display: "grid", gap: 4, padding: "0 10px 10px" }}>
            {ipsLog.map((entry, i) => (
              <div key={i} className={entry.compliant ? "portfolio-summary-card decision-feedback-correct" : "portfolio-summary-card decision-feedback-wrong"} style={{ padding: "4px 10px" }}>
                <span style={{ fontSize: "0.62rem" }}>{entry.compliant ? "✓ Compliant" : "✗ IPS Violation"}</span>
                <small>{entry.reason}</small>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// IPS reference card — rendered inside the Portfolio side panel
export function RetirementIpsReference() {
  const activeClient = useSelectedClient();
  const tickers = useGameStore((state) => state.tickers);
  const { marketSnapshots } = useRetirementSessionState();

  if (!activeClient) return null;
  const ips = activeClient.investmentPolicy;

  return (
    <div style={{ display: "grid", gap: 8, padding: 10 }}>
      <div className="portfolio-summary-card">
        <span>IPS — {activeClient.name}</span>
        <strong>{ips.equityRangeLabel}</strong>
        <small>{ips.objective}</small>
      </div>
      <div className="portfolio-summary-card">
        <span>Prohibited strategies</span>
        <strong style={{ color: "var(--red)", fontSize: "0.68rem" }}>{ips.prohibitedStrategies?.join(" | ") ?? "None"}</strong>
        <small>Prohibited buckets: {ips.prohibitedBuckets?.join(", ") ?? "None"}</small>
      </div>
      <div className="portfolio-summary-card">
        <span>Max single position / Liquidity</span>
        <strong>{ips.maxSinglePositionPct ?? "—"}% max | {activeClient.cashFlow.nearTermLiquidityNeed} liquidity need</strong>
        <small>Review: {ips.reviewCadence}</small>
      </div>
      {marketSnapshots.length > 0 && (
        <div className="portfolio-summary-card">
          <span>Market Tracker (15-min intervals)</span>
          <div style={{ overflowX: "auto", marginTop: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.65rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: "var(--muted)", padding: "2px 6px", borderBottom: "1px solid var(--border)" }}>Ticker</th>
                  {marketSnapshots.map((_, i) => (
                    <th key={i} style={{ textAlign: "right", color: "var(--muted)", padding: "2px 6px", borderBottom: "1px solid var(--border)" }}>T+{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(marketSnapshots[0].prices).map(ticker => (
                  <tr key={ticker}>
                    <td style={{ padding: "2px 6px", color: "var(--accent)" }}>{ticker}</td>
                    {marketSnapshots.map((s, i) => {
                      const price = s.prices[ticker] ?? 0;
                      const prev = i > 0 ? (marketSnapshots[i - 1].prices[ticker] ?? price) : price;
                      return (
                        <td key={i} style={{ textAlign: "right", padding: "2px 6px", color: price >= prev ? "var(--green)" : "var(--red)" }}>
                          {formatCurrency(price)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
