import { useGameStore } from "../store/gameStore";

export function SupervisionRequestOverlay() {
  const request = useGameStore((state) => state.activeSupervisionRequest);
  const clients = useGameStore((state) => state.clients);
  const resolveSupervisionRequest = useGameStore((state) => state.resolveSupervisionRequest);
  const closeSupervisionRequest = useGameStore((state) => state.closeSupervisionRequest);

  if (!request) {
    return null;
  }

  const client = clients.find((entry) => entry.id === request.clientId);

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Firm Supervision</p>
        <h2>{request.title}</h2>
        <p className="panel-meta">{client ? client.name : "Client"} | Branch and compliance review</p>
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
                  onClick={() => resolveSupervisionRequest(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="overlay-actions">
              <button className="control-btn" type="button" onClick={closeSupervisionRequest}>
                Review Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="answer-summary positive">
              <strong>{request.feedback ?? "Supervisory review resolved."}</strong>
              <span>
                The supervisory response has been recorded and any remaining follow-up can be added through the documentation prompt.
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" type="button" onClick={closeSupervisionRequest}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
