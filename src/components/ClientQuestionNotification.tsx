import { useState, useEffect, useCallback } from "react";
import { getQuestionsForModule, type ModuleClientQuestion, type ModuleQuestionModule } from "../data/moduleClientQuestions";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";

interface ClientQuestionNotificationProps {
  module: ModuleQuestionModule;
  assignedDifficulty: string;
  onScoreUpdate: (telemetry: { score: number; scoreCards: ModuleScoreCard[]; answeredCount: number }) => void;
}

interface NotificationState {
  pendingQuestion: ModuleClientQuestion | null;
  isOpen: boolean;
  answeredCount: number;
  correctCount: number;
  usedIds: string[];
  selected: number | null;
  result: { correct: boolean; explanation: string } | null;
}

const MAX_MODULE_QUESTIONS = 20;
const RECENT_QUESTION_WINDOW = 10;

function pickNextQuestion(
  module: ModuleQuestionModule,
  assignedDifficulty: string,
  usedIds: string[]
) {
  const preferredPool = getQuestionsForModule(module, assignedDifficulty, []);
  const fullPool = getQuestionsForModule(module, "senior", []);
  const pool = fullPool.length > preferredPool.length ? fullPool : preferredPool.length > 0 ? preferredPool : fullPool;
  if (pool.length === 0) return null;

  const recentIds = new Set(usedIds.slice(-RECENT_QUESTION_WINDOW));
  const unused = pool.filter(q => !usedIds.includes(q.id) && !recentIds.has(q.id));
  const notRecent = pool.filter(q => !recentIds.has(q.id));
  const candidates = unused.length > 0 ? unused : notRecent.length > 0 ? notRecent : pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getScoreCards(module: ModuleQuestionModule, score: number): ModuleScoreCard[] {
  const s = score;
  const labelMap: Record<ModuleQuestionModule, [string, string, string]> = {
    "retirement-planning":    ["Retirement judgment", "Wealth protection", "Tax-aware planning"],
    "qualified-plans":        ["Plan knowledge", "ERISA compliance", "Contribution optimization"],
    "estate-planning":        ["Estate analysis", "Trust knowledge", "Regulatory compliance"],
    "insurance-planning":     ["Coverage analysis", "Product knowledge", "Regulatory compliance"],
    "tax-planning":           ["Tax accuracy", "Planning judgment", "Code compliance"],
    "suitability-client-fit": ["Best-interest care", "Supervisory controls", "Customer profile fit"],
    "bank-lending":           ["Repayment capacity", "Underwriting controls", "Credit decision discipline"],
    "mortgage-debt-planning": ["Ability-to-repay", "Disclosure compliance", "Loan-fit judgment"],
  };
  const [l1, l2, l3] = labelMap[module];
  return [
    { label: l1, score: s },
    { label: l2, score: Math.max(0, Math.round(s * 0.95)) },
    { label: l3, score: Math.max(0, Math.round(s * 0.9)) },
  ];
}

export function useClientQuestionNotification(
  module: ModuleQuestionModule,
  assignedDifficulty: string,
  onScoreUpdate: (telemetry: { score: number; scoreCards: ModuleScoreCard[]; answeredCount: number }) => void
) {
  const [state, setState] = useState<NotificationState>({
    pendingQuestion: null,
    isOpen: false,
    answeredCount: 0,
    correctCount: 0,
    usedIds: [],
    selected: null,
    result: null,
  });

  // Randomly schedule a new notification every 45-90 seconds
  useEffect(() => {
    const delay = (45 + Math.random() * 45) * 1000;
    const timer = setTimeout(() => {
      setState(prev => {
        if (prev.pendingQuestion || prev.answeredCount >= MAX_MODULE_QUESTIONS) return prev;
        const q = pickNextQuestion(module, assignedDifficulty, prev.usedIds);
        if (!q) return prev;
        return { ...prev, pendingQuestion: q };
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [assignedDifficulty, module]);

  const openNotification = useCallback(() => {
    setState(prev => {
      const pendingQuestion = prev.pendingQuestion
        ?? (prev.answeredCount < MAX_MODULE_QUESTIONS
          ? pickNextQuestion(module, assignedDifficulty, prev.usedIds)
          : null);
      return { ...prev, pendingQuestion, isOpen: !!pendingQuestion, selected: null, result: null };
    });
  }, [assignedDifficulty, module]);

  const closeNotification = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const queueNextQuestion = useCallback((open = true) => {
    setState(prev => {
      if (prev.answeredCount >= MAX_MODULE_QUESTIONS) {
        return {
          ...prev,
          pendingQuestion: null,
          isOpen: false,
          selected: null,
          result: null
        };
      }
      const q = pickNextQuestion(module, assignedDifficulty, prev.usedIds);
      if (!q) {
        return {
          ...prev,
          pendingQuestion: null,
          isOpen: false,
          selected: null,
          result: null
        };
      }
      return {
        ...prev,
        pendingQuestion: q,
        isOpen: open,
        selected: null,
        result: null
      };
    });
  }, [assignedDifficulty, module]);

  const selectAnswer = useCallback((idx: number) => {
    setState(prev => {
      if (!prev.pendingQuestion || prev.result) return prev;
      if (prev.answeredCount >= MAX_MODULE_QUESTIONS) return prev;
      const correct = idx === prev.pendingQuestion.correctIndex;
      const newAnswered = prev.answeredCount + 1;
      const newCorrect = prev.correctCount + (correct ? 1 : 0);
      const netScore = Math.round((newCorrect / newAnswered) * 100);
      const usedIds = [...prev.usedIds, prev.pendingQuestion.id];
      onScoreUpdate({
        score: netScore,
        scoreCards: getScoreCards(module, netScore),
        answeredCount: newAnswered,
      });
      return {
        ...prev,
        selected: idx,
        result: { correct, explanation: prev.pendingQuestion.explanation },
        answeredCount: newAnswered,
        correctCount: newCorrect,
        usedIds,
      };
    });
  }, [module, onScoreUpdate]);

  const dismissQuestion = useCallback(() => {
    setState(prev => {
      if (prev.result && prev.answeredCount < MAX_MODULE_QUESTIONS) {
        const q = pickNextQuestion(module, assignedDifficulty, prev.usedIds);
        if (q) {
          return {
            ...prev,
            pendingQuestion: q,
            isOpen: true,
            selected: null,
            result: null,
          };
        }
      }

      return {
        ...prev,
        isOpen: false,
        pendingQuestion: null,
        selected: null,
        result: null,
      };
    });
  }, [assignedDifficulty, module]);

  return { state, openNotification, closeNotification, selectAnswer, dismissQuestion, queueNextQuestion };
}

export function ClientQuestionBell({
  state,
  onOpen,
}: {
  state: NotificationState;
  onOpen: () => void;
}) {
  const hasPending = !!state.pendingQuestion;
  return (
    <button
      type="button"
      className={`notification-bell ${hasPending ? "notification-bell--active" : ""}`}
      onClick={onOpen}
      title={hasPending ? "Client has a question" : "No pending client questions"}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
        color: hasPending ? "var(--color-accent)" : "var(--color-text-muted)",
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      🔔
      {hasPending && (
        <span style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "var(--color-accent)",
          color: "var(--color-bg)",
          borderRadius: "50%",
          width: 14,
          height: 14,
          fontSize: "0.6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}>1</span>
      )}
    </button>
  );
}

export function ClientQuestionPopup({
  state,
  onSelect,
  onDismiss,
}: {
  state: NotificationState;
  onSelect: (idx: number) => void;
  onDismiss: () => void;
}) {
  const q = state.pendingQuestion;
  if (!state.isOpen || !q) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.78)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#07111f",
        border: "1px solid rgba(72, 115, 171, 0.55)",
        borderRadius: 8,
        padding: 28,
        maxWidth: 640,
        width: "90%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: 1 }}>
            Client Question — {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
          </span>
          <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1rem" }}>✕</button>
        </div>
        <p style={{ fontWeight: 600, marginBottom: 20, lineHeight: 1.5, color: "var(--color-text)" }}>{q.question}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {q.options.map((opt, idx) => {
            let bg = "var(--color-surface-raised)";
            let border = "1px solid var(--color-border)";
            let color = "var(--color-text)";
            if (state.result) {
              if (idx === q.correctIndex) { bg = "var(--color-positive-bg, #0d2b1a)"; border = "1px solid var(--color-positive)"; color = "var(--color-positive)"; }
              else if (idx === state.selected && !state.result.correct) { bg = "var(--color-negative-bg, #2b0d0d)"; border = "1px solid var(--color-negative)"; color = "var(--color-negative)"; }
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => !state.result && onSelect(idx)}
                disabled={!!state.result}
                style={{
                  background: bg, border, borderRadius: 6, padding: "12px 14px",
                  textAlign: "left", cursor: state.result ? "default" : "pointer",
                  color, fontSize: "0.85rem", lineHeight: 1.4,
                  transition: "all 0.15s",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {state.result && (
          <div style={{
            marginTop: 16,
            padding: "12px 16px",
            background: state.result.correct ? "var(--color-positive-bg, #0d2b1a)" : "var(--color-negative-bg, #2b0d0d)",
            border: `1px solid ${state.result.correct ? "var(--color-positive)" : "var(--color-negative)"}`,
            borderRadius: 6,
            fontSize: "0.82rem",
            lineHeight: 1.5,
            color: "var(--color-text)",
          }}>
            <strong style={{ color: state.result.correct ? "var(--color-positive)" : "var(--color-negative)" }}>
              {state.result.correct ? "✓ Correct" : "✗ Incorrect"}
            </strong>
            <p style={{ margin: "6px 0 0" }}>{state.result.explanation}</p>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button type="button" onClick={onDismiss} style={{
                background: "var(--color-accent)", border: "none", borderRadius: 4,
                padding: "6px 16px", cursor: "pointer", color: "var(--color-bg)", fontWeight: 600, fontSize: "0.82rem"
              }}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
