import { useRef, useState } from "react";
import { DIFFICULTY_LABELS } from "../data/examBlueprints";
import { useGameStore } from "../store/gameStore";

function formatStamp(value: number | null) {
  if (!value) {
    return "Empty";
  }

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export function SessionManagerOverlay() {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const saveSlots = useGameStore((state) => state.saveSlots);
  const saveToSlot = useGameStore((state) => state.saveToSlot);
  const loadFromSlot = useGameStore((state) => state.loadFromSlot);
  const deleteSlot = useGameStore((state) => state.deleteSlot);
  const renameSlot = useGameStore((state) => state.renameSlot);
  const exportSlots = useGameStore((state) => state.exportSlots);
  const importSlots = useGameStore((state) => state.importSlots);

  return (
    <>
      <button className="control-btn" onClick={() => setOpen(true)}>
        Sessions
      </button>
      {open ? (
        <div className="overlay">
          <div className="overlay-card session-card">
            <div className="panel-header">
              <h2>Session Manager</h2>
              <div className="slot-actions">
                <button className="control-btn" onClick={() => exportSlots()}>
                  Export
                </button>
                <button className="control-btn" onClick={() => fileInputRef.current?.click()}>
                  Import
                </button>
                <button className="control-btn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden-input"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void importSlots(file);
                }
                event.currentTarget.value = "";
              }}
            />
            <div className="session-list">
              {saveSlots.map((slot) => (
                <div key={slot.id} className="slot-card">
                  <div className="slot-copy">
                    <input
                      className="slot-name-input"
                      value={slot.label}
                      onChange={(event) => renameSlot(slot.id, event.target.value)}
                    />
                    <span>
                      {slot.savedAt
                        ? `${DIFFICULTY_LABELS[slot.difficulty ?? "trainee"]} - ${slot.score?.toLocaleString() ?? 0} - ${formatStamp(slot.savedAt)}`
                        : "Empty slot"}
                    </span>
                  </div>
                  <div className="slot-actions">
                    <button className="control-btn" onClick={() => saveToSlot(slot.id)}>
                      Save
                    </button>
                    <button className="control-btn" disabled={!slot.savedAt} onClick={() => void loadFromSlot(slot.id)}>
                      Load
                    </button>
                    <button className="control-btn" disabled={!slot.savedAt} onClick={() => deleteSlot(slot.id)}>
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
