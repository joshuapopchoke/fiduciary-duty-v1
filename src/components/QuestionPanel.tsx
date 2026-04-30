import { useGameStore } from "../store/gameStore";

function getDifficultyRewardProfile(difficulty: ReturnType<typeof useGameStore.getState>["activeDifficulty"]) {
  switch (difficulty) {
    case "senior":
      return { reward: 10000, penalty: 20000, label: "Pro" };
    case "advisor":
      return { reward: 10000, penalty: 15000, label: "Hard" };
    case "associate":
      return { reward: 10000, penalty: 10000, label: "Medium" };
    case "trainee":
      return { reward: 10000, penalty: 10000, label: "Easy" };
    case "learner":
    default:
      return { reward: 10000, penalty: 10000, label: "Learner" };
  }
}

export function QuestionPanel() {
  const activeQuestion = useGameStore((state) => state.activeQuestion);
  const questionBankStatus = useGameStore((state) => state.questionBankStatus);
  const questionBankError = useGameStore((state) => state.questionBankError);
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const answerStreak = useGameStore((state) => state.answerStreak);
  const bestAnswerStreak = useGameStore((state) => state.bestAnswerStreak);
  const questionTracker = useGameStore((state) => state.questionTracker);
  const activeClient = useGameStore((state) => state.clients.find((client) => client.id === state.activeClientId) ?? null);
  const answerQuestion = useGameStore((state) => state.answerQuestion);
  const nextQuestion = useGameStore((state) => state.nextQuestion);
  const initializeQuestionBank = useGameStore((state) => state.initializeQuestionBank);
  const rewardProfile = getDifficultyRewardProfile(activeDifficulty);
  const domainOutcomes = activeQuestion.question
    ? questionOutcomes.filter(
        (outcome) =>
          outcome.exam === activeQuestion.question?.exam &&
          outcome.domain === activeQuestion.question?.domain
      )
    : [];
  const domainCorrect = domainOutcomes.filter((outcome) => outcome.correct).length;
  const domainAccuracy = domainOutcomes.length === 0 ? 0 : (domainCorrect / domainOutcomes.length) * 100;
  const coachingNote = !activeQuestion.question
    ? ""
    : domainOutcomes.length === 0
      ? "Fresh concept. Use the explanation to build your first anchor before moving on."
      : domainAccuracy >= 75
        ? "This domain is becoming a strength. Keep the pace and protect the streak."
        : domainAccuracy >= 50
          ? "You are in the learning zone here. Slow down and compare the distractors carefully."
          : "This is currently a weak domain. Treat the explanation like a mini review before the next draw.";
  const adaptiveTarget = activeQuestion.question
    ? questionTracker.domainPerformance[`${activeQuestion.question.exam}::${activeQuestion.question.domain}`]
    : null;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Question Panel</h2>
      </div>
      {activeQuestion.question ? (
        <div className="question-panel">
          <div className="question-toolbar">
            <p className="question-domain">{activeQuestion.question.exam}</p>
            <span className="question-chip">{activeQuestion.question.domain}</span>
            <span className="question-chip">{rewardProfile.label} Mode</span>
            <span className="question-chip">
              Personal USD: +${rewardProfile.reward.toLocaleString()} / -${rewardProfile.penalty.toLocaleString()}
            </span>
            {activeClient ? <span className="question-chip">Client: {activeClient.name}</span> : null}
            <span className="question-chip">Streak: {answerStreak} | Best: {bestAnswerStreak}</span>
            <span className="question-chip">Domain Accuracy: {domainOutcomes.length === 0 ? "New" : `${domainAccuracy.toFixed(0)}%`}</span>
            <span className="question-chip">
              Adaptive Focus: {adaptiveTarget ? `${adaptiveTarget.seen} seen` : "Priority review"}
            </span>
          </div>
          <h3>{activeQuestion.question.question}</h3>
          <p className="explanation">{coachingNote}</p>
          <div className="option-list">
            {activeQuestion.shuffledOptions.map((option, index) => {
              const isSelected = activeQuestion.selectedIndex === index;
              const isCorrect = activeQuestion.displayCorrectIndex === index;
              const className = activeQuestion.answered
                ? isCorrect
                  ? "option-btn correct"
                  : isSelected
                    ? "option-btn wrong"
                    : "option-btn"
                : "option-btn";

              return (
                <button
                  key={`${option}-${index}`}
                  className={className}
                  disabled={activeQuestion.answered}
                  onClick={() => answerQuestion(index)}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {activeQuestion.answered ? (
            <>
              <div className={`answer-summary ${activeQuestion.selectedIndex === activeQuestion.displayCorrectIndex ? "positive" : "warning"}`}>
                <strong>{activeQuestion.selectedIndex === activeQuestion.displayCorrectIndex ? "Correct read" : "Needs review"}</strong>
                <span>
                  {activeQuestion.selectedIndex === activeQuestion.displayCorrectIndex
                    ? `Score and personal USD improved. ${activeClient?.name ?? "The client"} is building confidence in your guidance.`
                    : `You lost points and personal USD on this one. Slow down on ${activeQuestion.question.domain.toLowerCase()} before the next draw.`}
                </span>
              </div>
              <p className="explanation">{activeQuestion.question.explanation}</p>
              <button className="primary-btn" onClick={nextQuestion}>
                Next
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <div className="empty-state">
          {questionBankStatus === "loading"
            ? "Loading the study bank..."
            : questionBankStatus === "error"
              ? (
                <>
                  <p>{`Question bank error: ${questionBankError}`}</p>
                  <button className="primary-btn retry-btn" onClick={() => void initializeQuestionBank(activeDifficulty)}>
                    Retry Load
                  </button>
                </>
              )
              : (
                <>
                  <p>Select a client to draw a question.</p>
                  <p className="empty-state-hint">
                    Each correct answer improves your score and boosts your personal trading capital, while wrong answers reduce your personal USD by the current difficulty rules.
                  </p>
                </>
              )}
        </div>
      )}
    </section>
  );
}
