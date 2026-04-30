import { useGameStore } from "../store/gameStore";

export function InsuranceDialogueOverlay() {
  const dialogue = useGameStore((state) => state.activeInsuranceDialogue);
  const clients = useGameStore((state) => state.clients);
  const answerInsuranceDialogue = useGameStore((state) => state.answerInsuranceDialogue);
  const advanceInsuranceDialogue = useGameStore((state) => state.advanceInsuranceDialogue);
  const closeInsuranceDialogue = useGameStore((state) => state.closeInsuranceDialogue);

  if (!dialogue) {
    return null;
  }

  const client = clients.find((entry) => entry.id === dialogue.clientId);
  const prompt = dialogue.prompts[dialogue.stepIndex];

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Insurance Recommendation</p>
        <h2>{dialogue.title}</h2>
        <p className="panel-meta">
          {client ? client.name : "Client"} | Question {dialogue.stepIndex + 1} of {dialogue.prompts.length}
        </p>
        {!dialogue.completed ? (
          <>
            <p>{prompt.question}</p>
            <div className="option-list">
              {prompt.options.map((option, index) => {
                const isSelected = dialogue.selectedIndex === index;
                const isCorrect = prompt.correct === index;
                const className = dialogue.answered
                  ? isCorrect
                    ? "option-btn correct"
                    : isSelected
                      ? "option-btn wrong"
                      : "option-btn"
                  : "option-btn";

                return (
                  <button
                    key={`${prompt.id}-${index}`}
                    className={className}
                    disabled={dialogue.answered}
                    onClick={() => answerInsuranceDialogue(index)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {dialogue.feedback ? <p className="explanation">{dialogue.feedback}</p> : null}
            <div className="overlay-actions">
              <button className="control-btn" onClick={() => closeInsuranceDialogue()}>
                Cancel
              </button>
              <button className="control-btn active" onClick={() => advanceInsuranceDialogue()}>
                {dialogue.answered ? (dialogue.stepIndex >= dialogue.prompts.length - 1 ? "Finish" : "Next") : "Skip"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="explanation">{dialogue.feedback}</p>
            <div className={`answer-summary ${dialogue.accepted ? "positive" : "warning"}`}>
              <strong>{dialogue.accepted ? "Client accepted the planning discussion" : "Client is holding off for now"}</strong>
              <span>
                {dialogue.accepted
                  ? "The client felt the recommendation was explained clearly enough to fit into the plan."
                  : "The client was not convinced yet, so trust now depends on whether you revisit the need more thoughtfully later."}
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" onClick={() => closeInsuranceDialogue()}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
