import { useGameStore } from "../store/gameStore";

export function ClientMeetingOverlay() {
  const meeting = useGameStore((state) => state.activeClientMeeting);
  const clients = useGameStore((state) => state.clients);
  const resolveClientMeeting = useGameStore((state) => state.resolveClientMeeting);
  const closeClientMeeting = useGameStore((state) => state.closeClientMeeting);

  if (!meeting) {
    return null;
  }

  const client = clients.find((entry) => entry.id === meeting.clientId);

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Client Meeting</p>
        <h2>{meeting.title}</h2>
        <p className="panel-meta">
          {client ? client.name : "Client"} | {meeting.meetingKind === "review" ? "Annual review workflow" : "Real-world planning scenario"}
        </p>
        {!meeting.resolved ? (
          <>
            <p>{meeting.summary}</p>
            <p className="explanation">{meeting.question}</p>
            <div className="option-list">
              {meeting.options.map((option) => (
                <button
                  key={option.id}
                  className="option-btn"
                  onClick={() => resolveClientMeeting(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="overlay-actions">
              <button className="control-btn" onClick={() => closeClientMeeting()}>
                Discuss Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`answer-summary ${meeting.feedback && meeting.feedback.length > 0 ? "positive" : "warning"}`}>
              <strong>{meeting.feedback ?? "Meeting resolved."}</strong>
              <span>
                {meeting.meetingKind === "review"
                  ? "The annual review outcome, planning focus, and next follow-up notes are now part of the live client file."
                  : "The client record has been updated with the new cash-flow and trust context, so the rest of the session now reflects this conversation."}
              </span>
            </div>
            <div className="overlay-actions">
              <button className="control-btn active" onClick={() => closeClientMeeting()}>
                Continue Session
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
