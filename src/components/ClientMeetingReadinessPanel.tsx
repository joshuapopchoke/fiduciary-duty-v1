import { useEffect, useMemo, useState } from "react";
import { CLIENT_READINESS_SCENARIOS } from "../data/clientMeetingReadiness";
import { evaluateClientReadinessResponse, type ClientReadinessEvaluation } from "../engine/clientMeetingReadinessEngine";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";

interface ClientMeetingReadinessPanelProps {
  onTelemetryChange: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

export function ClientMeetingReadinessPanel({ onTelemetryChange }: ClientMeetingReadinessPanelProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(CLIENT_READINESS_SCENARIOS[0]?.id ?? "");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, ClientReadinessEvaluation>>({});

  const activeScenario = useMemo(
    () => CLIENT_READINESS_SCENARIOS.find((scenario) => scenario.id === activeScenarioId) ?? CLIENT_READINESS_SCENARIOS[0],
    [activeScenarioId]
  );

  const answeredCount = Object.keys(evaluations).length;
  const average = answeredCount > 0
    ? Object.values(evaluations).reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / answeredCount
    : 0;
  const scoreCards = useMemo<ModuleScoreCard[]>(() => {
    if (answeredCount === 0) {
      return [
        { label: "Communication", score: 0 },
        { label: "Compliance", score: 0 },
        { label: "Rational thinking", score: 0 }
      ];
    }

    const evaluationsList = Object.values(evaluations);
    const averageLane = (selector: (evaluation: ClientReadinessEvaluation) => number) =>
      Math.round(evaluationsList.reduce((sum, evaluation) => sum + selector(evaluation), 0) / evaluationsList.length);

    return [
      { label: "Communication", score: averageLane((evaluation) => evaluation.communicationScore) },
      { label: "Compliance", score: averageLane((evaluation) => evaluation.complianceScore) },
      { label: "Rational thinking", score: averageLane((evaluation) => Math.round((evaluation.rationaleScore + evaluation.suitabilityScore) / 2)) }
    ];
  }, [answeredCount, evaluations]);

  useEffect(() => {
    onTelemetryChange({
      score: Math.round(average),
      scoreCards,
      answeredCount
    });
  }, [average, answeredCount, onTelemetryChange, scoreCards]);

  if (!activeScenario) {
    return (
      <section className="panel">
        <div className="empty-state">No client-readiness scenarios are loaded yet.</div>
      </section>
    );
  }

  const activeEvaluation = evaluations[activeScenario.id] ?? null;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Client Meeting Readiness</h2>
        <span className="panel-meta">Type your response. Graded on compliance, communication clarity, rationale, and suitability connection — not emotion detection.</span>
      </div>
      <div className="tabs">
        {CLIENT_READINESS_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className={scenario.id === activeScenario.id ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveScenarioId(scenario.id)}
          >
            {scenario.title}
          </button>
        ))}
      </div>
      <div className="portfolio-summary-card">
        <span>{activeScenario.clientName}</span>
        <strong>{activeScenario.prompt}</strong>
        <small>Goals: {activeScenario.goals.join(" | ")}</small>
      </div>
      <label className="manager-form-grid">
        <span className="panel-meta">Your response</span>
        <textarea
          className="manager-textarea"
          value={responses[activeScenario.id] ?? ""}
          onChange={(event) => setResponses((current) => ({ ...current, [activeScenario.id]: event.target.value }))}
          rows={8}
        />
      </label>
      <div className="slot-actions">
        <button
          type="button"
          className="primary-btn manager-inline-btn"
          onClick={() => {
            const evaluation = evaluateClientReadinessResponse(activeScenario, responses[activeScenario.id] ?? "");
            setEvaluations((current) => ({ ...current, [activeScenario.id]: evaluation }));
          }}
        >
          Evaluate Response
        </button>
      </div>
      {activeEvaluation ? (
        <div className="comparison-grid">
          <div className="comparison-card">
            <span>Overall readiness</span>
            <strong>{activeEvaluation.overallScore}/100</strong>
            <small>{activeEvaluation.feedback}</small>
          </div>
          <div className="comparison-card">
            <span>Scoring breakdown</span>
            <strong>Comp {activeEvaluation.complianceScore} | Comm {activeEvaluation.communicationScore}</strong>
            <small>Rationale {activeEvaluation.rationaleScore} | Suitability {activeEvaluation.suitabilityScore}</small>
          </div>
          <div className="comparison-card">
            <span>Strengths</span>
            <strong>{activeEvaluation.strengths[0] ?? "Still building"}</strong>
            <small>{activeEvaluation.strengths.slice(1).join(" | ") || "Keep practicing to build more clear strengths."}</small>
          </div>
          <div className="comparison-card">
            <span>Improve next</span>
            <strong>{activeEvaluation.improvements[0] ?? "Solid answer"}</strong>
            <small>{activeEvaluation.improvements.slice(1).join(" | ") || "No major coaching flags on this draft."}</small>
          </div>
        </div>
      ) : null}
    </section>
  );
}
