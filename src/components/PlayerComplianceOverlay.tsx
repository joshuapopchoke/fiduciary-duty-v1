import { useGameStore } from "../store/gameStore";

export function PlayerComplianceOverlay() {
  const activeInsiderEvent = useGameStore((state) => state.activeInsiderEvent);
  const playerComplianceFeedback = useGameStore((state) => state.playerComplianceFeedback);
  const playerGameOver = useGameStore((state) => state.playerGameOver);
  const playerGameOverReason = useGameStore((state) => state.playerGameOverReason);
  const resetSession = useGameStore((state) => state.resetSession);
  const resolveInsiderEvent = useGameStore((state) => state.resolveInsiderEvent);
  const dismissPlayerComplianceFeedback = useGameStore((state) => state.dismissPlayerComplianceFeedback);

  if (playerGameOver) {
    return (
      <div className="overlay">
        <div className="overlay-card">
          <p className="eyebrow">Regulatory Lockdown</p>
          <h2>Personal Trading Account Closed</h2>
          <p>{playerGameOverReason ?? "Repeated insider-trading violations ended the session."}</p>
          <button className="primary-btn" onClick={() => resetSession()}>
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  if (!activeInsiderEvent) {
    if (!playerComplianceFeedback) {
      return null;
    }

    return (
      <div className="overlay">
        <div className="overlay-card">
          <p className="eyebrow">Compliance Review</p>
          <h2>{playerComplianceFeedback.title}</h2>
          <p className="panel-meta">
            {playerComplianceFeedback.legalToTrade ? "Public information scenario" : "Material nonpublic information scenario"} | Severity {playerComplianceFeedback.severity}
          </p>
          <p className="explanation">{playerComplianceFeedback.detail}</p>
          <div className="overlay-actions">
            <button className="control-btn active" onClick={() => dismissPlayerComplianceFeedback()}>
              Continue Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Player Compliance</p>
        <h2>{activeInsiderEvent.title}</h2>
        <p className="panel-meta">Ticker in focus: {activeInsiderEvent.symbol}</p>
        <p>{activeInsiderEvent.summary}</p>
        <p className="explanation">{activeInsiderEvent.prompt}</p>
        <div className="overlay-actions">
          <button className="control-btn" onClick={() => resolveInsiderEvent("avoid")}>
            Stand Down
          </button>
          <button className="control-btn active" onClick={() => resolveInsiderEvent("trade")}>
            Trade It
          </button>
        </div>
      </div>
    </div>
  );
}
