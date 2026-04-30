import { useGameStore } from "../store/gameStore";

export function OperationsRequestOverlay() {
  const request = useGameStore((state) => state.activeOperationsRequest);
  const clients = useGameStore((state) => state.clients);
  const resolveOperationsRequest = useGameStore((state) => state.resolveOperationsRequest);
  const closeOperationsRequest = useGameStore((state) => state.closeOperationsRequest);

  if (!request) {
    return null;
  }

  const client = clients.find((entry) => entry.id === request.clientId);

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Operations Workflow</p>
        <h2>{request.title}</h2>
        <p className="panel-meta">
          {client ? client.name : "Client"} | {request.requestKind === "rmd" ? "Retirement distribution workflow" : "Service and maintenance request"}
        </p>
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
                  onClick={() => resolveOperationsRequest(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="overlay-actions">
              <button className="control-btn" type="button" onClick={closeOperationsRequest}>
                Discuss Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="answer-summary positive">
              <strong>{request.feedback ?? "Operations request resolved."}</strong>
              <span>
                {request.requestKind === "rmd"
                  ? "The distribution workflow and sleeve movement are now reflected in the client file and taxable reserve planning."
                  : "The client file now reflects the service decision, and any follow-up note can be saved from the documentation prompt."}
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" type="button" onClick={closeOperationsRequest}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
