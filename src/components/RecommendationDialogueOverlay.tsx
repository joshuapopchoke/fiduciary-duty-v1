import { useGameStore } from "../store/gameStore";

export function RecommendationDialogueOverlay() {
  const dialogue = useGameStore((state) => state.activeRecommendationDialogue);
  const clients = useGameStore((state) => state.clients);
  const resolveRecommendationDialogue = useGameStore((state) => state.resolveRecommendationDialogue);
  const closeRecommendationDialogue = useGameStore((state) => state.closeRecommendationDialogue);

  if (!dialogue) {
    return null;
  }

  const client = clients.find((entry) => entry.id === dialogue.clientId);

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Client Recommendation</p>
        <h2>{dialogue.title}</h2>
        <p className="panel-meta">{client ? client.name : "Client"} | Recommendation and client response</p>
        {!dialogue.resolved ? (
          <>
            <p>{dialogue.summary}</p>
            <p className="explanation">{dialogue.clientQuestion}</p>
            <div className="option-list">
              {dialogue.options.map((option) => (
                <button
                  key={option.id}
                  className="option-btn"
                  type="button"
                  onClick={() => resolveRecommendationDialogue(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="overlay-actions">
              <button className="control-btn" type="button" onClick={closeRecommendationDialogue}>
                Revisit Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`answer-summary ${dialogue.accepted ? "positive" : "warning"}`}>
              <strong>{dialogue.feedback ?? "Recommendation handled."}</strong>
              <span>
                The response, client reaction, and follow-up task are now ready to be saved into the client file.
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" type="button" onClick={closeRecommendationDialogue}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
