import { useGameStore } from "../store/gameStore";

export function AccountTransferOverlay() {
  const request = useGameStore((state) => state.activeAccountTransferRequest);
  const clients = useGameStore((state) => state.clients);
  const resolveAccountTransferRequest = useGameStore((state) => state.resolveAccountTransferRequest);
  const closeAccountTransferRequest = useGameStore((state) => state.closeAccountTransferRequest);

  if (!request) {
    return null;
  }

  const client = clients.find((entry) => entry.id === request.clientId);

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Rollover / Transfer Request</p>
        <h2>{request.title}</h2>
        <p className="panel-meta">{client ? client.name : "Client"} | Account movement workflow</p>
        {!request.resolved ? (
          <>
            <p>{request.summary}</p>
            <p className="explanation">{request.prompt}</p>
            <div className="option-list">
              {request.options.map((option) => (
                <button
                  key={option.id}
                  className="option-btn"
                  type="button"
                  onClick={() => resolveAccountTransferRequest(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="overlay-actions">
              <button className="control-btn" type="button" onClick={closeAccountTransferRequest}>
                Discuss Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="answer-summary positive">
              <strong>{request.feedback ?? "Transfer request resolved."}</strong>
              <span>
                The client file and account sleeves now reflect the decision, so future trades and planning notes use the updated registration path.
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" type="button" onClick={closeAccountTransferRequest}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
