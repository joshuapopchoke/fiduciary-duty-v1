import { EXAM_BLUEPRINTS } from "../data/examBlueprints";
import { useGameStore } from "../store/gameStore";

export function StudyDashboard() {
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const answerStreak = useGameStore((state) => state.answerStreak);
  const bestAnswerStreak = useGameStore((state) => state.bestAnswerStreak);

  const rows = EXAM_BLUEPRINTS[activeDifficulty].map((domain) => {
    const outcomes = questionOutcomes.filter(
      (outcome) => outcome.exam === domain.exam && outcome.domain === domain.label
    );
    const correct = outcomes.filter((outcome) => outcome.correct).length;
    const incorrect = outcomes.length - correct;
    const accuracy = outcomes.length === 0 ? 0 : (correct / outcomes.length) * 100;

    return {
      key: `${domain.exam}-${domain.key}`,
      exam: domain.exam,
      domain: domain.label,
      correct,
      incorrect,
      total: outcomes.length,
      accuracy
    };
  });
  const seenRows = rows.filter((row) => row.total > 0);
  const strongest = [...seenRows].sort((left, right) => right.accuracy - left.accuracy || right.total - left.total)[0];
  const weakest = [...seenRows].sort((left, right) => left.accuracy - right.accuracy || right.total - left.total)[0];
  const leastSeen = [...rows].sort((left, right) => left.total - right.total || left.accuracy - right.accuracy)[0];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Study Dashboard</h2>
        <span className="panel-meta">Live domain accuracy</span>
      </div>
      <div className="study-dashboard">
        <div className="study-summary-grid">
          <div className="study-summary-card">
            <span>Current Streak</span>
            <strong>{answerStreak}</strong>
            <small>Best {bestAnswerStreak}</small>
          </div>
          <div className="study-summary-card">
            <span>Strongest Domain</span>
            <strong>{strongest ? strongest.domain : "Build a sample"}</strong>
            <small>{strongest ? `${strongest.accuracy.toFixed(0)}% accuracy` : "No answered questions yet"}</small>
          </div>
          <div className="study-summary-card">
            <span>Focus Next</span>
            <strong>{weakest ? weakest.domain : "Open the first domain"}</strong>
            <small>{weakest ? `${weakest.accuracy.toFixed(0)}% accuracy` : "Use learner mode to build confidence"}</small>
          </div>
          <div className="study-summary-card">
            <span>Adaptive Queue</span>
            <strong>{leastSeen ? leastSeen.domain : "Waiting for data"}</strong>
            <small>{leastSeen ? `${leastSeen.total} seen so far` : "The engine will target thinner domains next"}</small>
          </div>
        </div>
        {rows.map((row) => (
          <div className="study-row" key={row.key}>
            <div className="study-copy">
              <strong>{row.exam}</strong>
              <span>{row.domain}</span>
            </div>
            <div className="study-stats">
              <span>{row.correct} right</span>
              <span>{row.incorrect} wrong</span>
              <span>{row.total} seen</span>
            </div>
            <div className="study-meter">
              <div className="study-meter-track">
                <div className="study-meter-fill" style={{ width: `${row.accuracy}%` }} />
              </div>
              <span className={row.accuracy >= 70 ? "up" : row.accuracy >= 50 ? "" : "down"}>
                {row.total === 0 ? "No answers yet" : `${row.accuracy.toFixed(0)}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
