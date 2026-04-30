import { useGameStore } from "../store/gameStore";

export function BehaviorEventOverlay() {
  const event = useGameStore((state) => state.activeBehaviorEvent);
  const resolveBehaviorEvent = useGameStore((state) => state.resolveBehaviorEvent);
  const closeBehaviorEvent = useGameStore((state) => state.closeBehaviorEvent);

  if (!event) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-copy">
          <p className="eyebrow">Client Behavior</p>
          <h2>{event.title}</h2>
          <p className="explanation">{event.summary}</p>
          <p>{event.prompt}</p>
        </div>
        {!event.resolved ? (
          <div className="option-list">
            {event.options.map((option) => (
              <button
                key={option.id}
                className="option-btn"
                type="button"
                onClick={() => resolveBehaviorEvent(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="answer-summary positive">
            <strong>Client response</strong>
            <p className="explanation">{event.feedback}</p>
          </div>
        )}
        <div className="overlay-actions">
          <button className="control-btn" type="button" onClick={closeBehaviorEvent}>
            {event.resolved ? "Continue" : "Discuss Later"}
          </button>
        </div>
      </div>
    </div>
  );
}
