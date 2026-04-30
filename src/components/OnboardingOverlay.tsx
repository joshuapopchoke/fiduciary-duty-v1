import { useGameStore } from "../store/gameStore";

export function OnboardingOverlay() {
  const onboardingDismissed = useGameStore((state) => state.onboardingDismissed);
  const questionOutcomes = useGameStore((state) => state.questionOutcomes);
  const dismissOnboarding = useGameStore((state) => state.dismissOnboarding);

  if (onboardingDismissed || questionOutcomes.length > 0) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <p className="eyebrow">Desk Briefing</p>
        <h2>Run the desk like an advisor and a student</h2>
        <div className="portfolio-table">
          <div className="portfolio-row recap-row">
            <strong>1. Pick a client</strong>
            <span>Draw a question and understand the account goal before you trade.</span>
            <span />
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>2. Answer well</strong>
            <span>Correct answers improve score, build streaks, and add capital to your personal book.</span>
            <span />
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>3. Trade intentionally</strong>
            <span>Client trades must fit the mandate. Personal trades can still trigger compliance penalties.</span>
            <span />
            <span />
            <span />
          </div>
          <div className="portfolio-row recap-row">
            <strong>4. Watch the cycle</strong>
            <span>Every 15-minute reset refreshes prices, relationships, and the market backdrop.</span>
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className="explanation">
          Start in Learner or Easy if you want a slower study ramp. Use the research rail before trusting any recommendation blindly, and watch trust plus mandate fit in the client roster after each major decision.
        </p>
        <div className="overlay-actions">
          <button className="control-btn active" onClick={() => dismissOnboarding()}>
            Start Trading
          </button>
        </div>
      </div>
    </div>
  );
}
