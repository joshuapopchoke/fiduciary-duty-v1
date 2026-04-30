import { useGameStore } from "../store/gameStore";

export function DocumentationOverlay() {
  const prompt = useGameStore((state) => state.activeDocumentationPrompt);
  const updateDocumentationNote = useGameStore((state) => state.updateDocumentationNote);
  const saveDocumentationNote = useGameStore((state) => state.saveDocumentationNote);
  const dismissDocumentationPrompt = useGameStore((state) => state.dismissDocumentationPrompt);

  if (!prompt) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-header">
          <div className="overlay-copy">
            <p className="eyebrow">Documentation</p>
            <h2>{prompt.title}</h2>
            <p className="explanation">{prompt.context}</p>
            <p className="explanation">Suggested note: {prompt.suggestedNote}</p>
          </div>
        </div>
        <label>
          Advisory note
          <textarea
            className="documentation-textarea"
            value={prompt.noteText}
            onChange={(event) => updateDocumentationNote(event.target.value)}
            rows={6}
          />
        </label>
        <p className="explanation">Good file notes should capture the client need, the recommendation or coaching response, and why it fit the IPS or planning objective.</p>
        <div className="overlay-actions">
          <button className="control-btn" type="button" onClick={dismissDocumentationPrompt}>
            Later
          </button>
          <button className="primary-btn" type="button" onClick={saveDocumentationNote}>
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
