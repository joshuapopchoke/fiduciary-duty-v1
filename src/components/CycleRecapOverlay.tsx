import { useGameStore } from "../store/gameStore";

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function CycleRecapOverlay() {
  const activeCycleRecap = useGameStore((state) => state.activeCycleRecap);
  const dismissCycleRecap = useGameStore((state) => state.dismissCycleRecap);

  if (!activeCycleRecap) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Market Cycle Reset</p>
        <h2>Cycle {activeCycleRecap.cycleNumber} Opened</h2>
        <div className="portfolio-table">
          <div className="portfolio-row recap-row">
            <strong>Theme</strong>
            <span>{activeCycleRecap.eventTitle ?? "Routine sector rotation"}</span>
            <span />
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>Top Mover</strong>
            <span>{activeCycleRecap.leaderSymbol ?? "--"}</span>
            <span className={activeCycleRecap.leaderChange >= 0 ? "up" : "down"}>
              {formatSignedPercent(activeCycleRecap.leaderChange)}
            </span>
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>Weakest Name</strong>
            <span>{activeCycleRecap.laggardSymbol ?? "--"}</span>
            <span className={activeCycleRecap.laggardChange >= 0 ? "up" : "down"}>
              {formatSignedPercent(activeCycleRecap.laggardChange)}
            </span>
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>Player Book</strong>
            <span>Self-directed portfolio impact</span>
            <span className={activeCycleRecap.personalImpactUsd >= 0 ? "up" : "down"}>
              {activeCycleRecap.personalImpactUsd >= 0 ? "+" : "-"}$
              {Math.abs(activeCycleRecap.personalImpactUsd).toLocaleString()}
            </span>
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>Client Book</strong>
            <span>Total managed client impact</span>
            <span className={activeCycleRecap.clientImpactUsd >= 0 ? "up" : "down"}>
              {activeCycleRecap.clientImpactUsd >= 0 ? "+" : "-"}$
              {Math.abs(activeCycleRecap.clientImpactUsd).toLocaleString()}
            </span>
            <span />
            <span />
          </div>
        </div>
        <p className="explanation">
          Prices and charts have been refreshed for the next 15-minute cycle. Review the new leader and laggard before placing the next round of client or personal trades.
        </p>
        {activeCycleRecap.clientAlerts.length > 0 ? (
          <div className="portfolio-section">
            <div className="portfolio-section-title">Client Pulse</div>
            <div className="metric-list">
              {activeCycleRecap.clientAlerts.map((alert) => (
                <span key={alert}>{alert}</span>
              ))}
            </div>
          </div>
        ) : null}
        {activeCycleRecap.lostClientNames.length > 0 ? (
          <div className="order-banner">
            Lost mandates this cycle: {activeCycleRecap.lostClientNames.join(", ")}. Rebuilding trust and fit matters as much as short-term gains.
          </div>
        ) : null}
        <div className="overlay-actions">
          <button className="control-btn active" onClick={() => dismissCycleRecap()}>
            Continue Trading
          </button>
        </div>
      </div>
    </div>
  );
}
