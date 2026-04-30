import type { PlayDifficulty } from "../types/gameState";

const DIFFICULTIES: PlayDifficulty[] = ["learner", "trainee", "associate", "advisor", "senior"];

interface ManagerPreviewOverlayProps {
  difficulty: PlayDifficulty;
  onDifficultyChange: (d: PlayDifficulty) => void;
  onExit: () => void;
}

export function ManagerPreviewOverlay({ difficulty, onDifficultyChange, onExit }: ManagerPreviewOverlayProps) {
  return (
    <div style={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 99999,
      background: "rgba(7, 17, 31, 0.92)",
      border: "1px solid rgba(72, 115, 171, 0.6)",
      borderRadius: 8,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      fontSize: "0.8rem",
    }}>
      <span style={{ color: "var(--color-accent)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
        Manager Preview
      </span>
      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as PlayDifficulty)}
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          color: "var(--color-text)",
          padding: "3px 8px",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={onExit}
        style={{
          background: "var(--color-accent)",
          border: "none",
          borderRadius: 4,
          color: "var(--color-bg)",
          fontWeight: 700,
          padding: "4px 12px",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
      >
        Exit Preview
      </button>
    </div>
  );
}
