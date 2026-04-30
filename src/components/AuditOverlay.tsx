import { useGameStore } from "../store/gameStore";

export function AuditOverlay() {
  const auditTriggered = useGameStore((state) => state.auditTriggered);
  const auditQuestion = useGameStore((state) => state.auditQuestion);
  const resolveAudit = useGameStore((state) => state.resolveAudit);

  if (!auditTriggered || !auditQuestion.question) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">SEC Audit</p>
        <h2>{auditQuestion.question.question}</h2>
        <div className="option-list">
          {auditQuestion.shuffledOptions.map((option, index) => (
            <button key={`${option}-${index}`} className="option-btn" onClick={() => resolveAudit(index)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
