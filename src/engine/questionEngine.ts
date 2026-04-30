import { EXAM_BLUEPRINTS, pickBlueprintDomain } from "../data/examBlueprints";
import { getPlanningQuestionsForClient } from "../data/planningQuestions";
import { AUDIT_QUESTIONS, QUESTION_COOLDOWNS, QUESTION_POOLS } from "../data/questions";
import { getAuthoredQuestionBankSync, getExamKeysForDifficulty, loadAuthoredQuestionBank } from "./questionBank";
import type { ClientAccount } from "../types/client";
import type { ExamName, Question } from "../types/question";
import type { PlayDifficulty } from "../types/gameState";

export interface QuestionTracker {
  recentlyAsked: string[];
  questionsAsked: number;
  lastClientAsked: string | null;
  domainPerformance: Record<string, { seen: number; correct: number; incorrect: number }>;
}

export function createQuestionTracker(): QuestionTracker {
  return {
    recentlyAsked: [],
    questionsAsked: 0,
    lastClientAsked: null,
    domainPerformance: {}
  };
}

function getDomainKey(question: Pick<Question, "exam" | "domain">) {
  return `${question.exam}::${question.domain}`;
}

function choosePriorityDomain(difficulty: PlayDifficulty, tracker: QuestionTracker) {
  const blueprints = EXAM_BLUEPRINTS[difficulty];
  const ranked = blueprints
    .map((domain) => {
      const stats = tracker.domainPerformance[`${domain.exam}::${domain.label}`] ?? { seen: 0, correct: 0, incorrect: 0 };
      const accuracy = stats.seen === 0 ? 0 : stats.correct / stats.seen;
      return {
        blueprint: domain,
        seen: stats.seen,
        accuracy
      };
    })
    .sort((left, right) => left.seen - right.seen || left.accuracy - right.accuracy);

  return ranked[0]?.blueprint ?? pickBlueprintDomain(difficulty);
}

function examToPoolKey(exam: Extract<ExamName, "SIE" | "Series 7" | "Series 65" | "Series 66">) {
  switch (exam) {
    case "SIE":
      return "sie";
    case "Series 7":
      return "series7";
    case "Series 65":
      return "series65";
    case "Series 66":
      return "series66";
  }
}

export function getAvailableQuestions(
  difficulty: PlayDifficulty,
  tracker: QuestionTracker,
  client?: ClientAccount | null
): Promise<Question[]> {
  return getAvailableQuestionsInternal(difficulty, tracker, client);
}

async function getAvailableQuestionsInternal(
  difficulty: PlayDifficulty,
  tracker: QuestionTracker,
  client?: ClientAccount | null
) {
  const exams = [...new Set(EXAM_BLUEPRINTS[difficulty].map((domain) => domain.exam))];
  const authoredKeys = getExamKeysForDifficulty(difficulty);
  const authoredBank = getAuthoredQuestionBankSync(authoredKeys);
  const hasAllRequestedAuthored = authoredKeys.every((key) => authoredBank[key].length > 0);
  const resolvedAuthoredBank = hasAllRequestedAuthored ? authoredBank : await loadAuthoredQuestionBank(authoredKeys);
  const authoredPool: Question[] = exams.flatMap(
    (exam) => resolvedAuthoredBank[examToPoolKey(exam)] as Question[]
  );
  const fallbackPool: Question[] = exams.flatMap(
    (exam) => QUESTION_POOLS[examToPoolKey(exam)] as Question[]
  );
  const preferredPool = authoredPool.length > 0 ? authoredPool : fallbackPool;
  const examQuestions = preferredPool.filter((question) => !tracker.recentlyAsked.includes(question.question));

  if (!client) {
    return examQuestions;
  }

  const planningQuestions = [
    ...client.questionSet,
    ...getPlanningQuestionsForClient(client.id, difficulty)
  ].filter((question) => !tracker.recentlyAsked.includes(question.question));

  return [...examQuestions, ...planningQuestions];
}

export function pickQuestion(
  difficulty: PlayDifficulty,
  tracker: QuestionTracker,
  client?: ClientAccount | null
): Promise<Question> {
  return pickQuestionInternal(difficulty, tracker, client);
}

async function pickQuestionInternal(
  difficulty: PlayDifficulty,
  tracker: QuestionTracker,
  client?: ClientAccount | null
): Promise<Question> {
  const exams = [...new Set(EXAM_BLUEPRINTS[difficulty].map((domain) => domain.exam))];
  const authoredKeys = getExamKeysForDifficulty(difficulty);
  const authoredBank = getAuthoredQuestionBankSync(authoredKeys);
  const hasAllRequestedAuthored = authoredKeys.every((key) => authoredBank[key].length > 0);
  const resolvedAuthoredBank = hasAllRequestedAuthored ? authoredBank : await loadAuthoredQuestionBank(authoredKeys);
  const authoredPool: Question[] = exams.flatMap(
    (exam) => resolvedAuthoredBank[examToPoolKey(exam)] as Question[]
  );
  const availableAuthored = authoredPool.filter((question) => !tracker.recentlyAsked.includes(question.question));
  let available = await getAvailableQuestionsInternal(difficulty, tracker, client);
  const planningWeight = {
    learner: 0.2,
    trainee: 0.25,
    associate: 0.35,
    advisor: 0.45,
    senior: 0.5
  } as const;
  const planningAvailable = client
    ? [
        ...client.questionSet,
        ...getPlanningQuestionsForClient(client.id, difficulty)
      ].filter((question) => !tracker.recentlyAsked.includes(question.question))
    : [];

  if (planningAvailable.length > 0 && Math.random() < planningWeight[difficulty]) {
    available = planningAvailable;
  }

  const blueprintDomain = pickBlueprintDomain(difficulty);
  const authoredAligned = availableAuthored.filter(
    (question) => question.exam === blueprintDomain.exam && question.domain === blueprintDomain.label
  );
  const aligned = available.filter(
    (question) => question.exam === blueprintDomain.exam && question.domain === blueprintDomain.label
  );
  const priorityDomain = choosePriorityDomain(difficulty, tracker);
  const authoredPriority = availableAuthored.filter(
    (question) => question.exam === priorityDomain.exam && question.domain === priorityDomain.label
  );
  const priorityAligned = available.filter(
    (question) => question.exam === priorityDomain.exam && question.domain === priorityDomain.label
  );

  if (authoredPriority.length > 0 && Math.random() < 0.7) {
    available = authoredPriority;
  } else if (priorityAligned.length > 0 && Math.random() < 0.7) {
    available = priorityAligned;
  } else if (authoredAligned.length > 0) {
    available = authoredAligned;
  } else {
    const authoredExamMatched = availableAuthored.filter((question) => question.exam === blueprintDomain.exam);
    if (authoredExamMatched.length > 0) {
      available = authoredExamMatched;
    } else if (aligned.length > 0) {
      available = aligned;
    } else {
      const examMatched = available.filter((question) => question.exam === blueprintDomain.exam);
      if (examMatched.length > 0) {
        available = examMatched;
      }
    }
  }

  if (available.length === 0) {
    const halfLength = Math.floor(tracker.recentlyAsked.length / 2);
    tracker.recentlyAsked = tracker.recentlyAsked.slice(halfLength);
    available = await getAvailableQuestionsInternal(difficulty, tracker, client);
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function markQuestionAsked(
  tracker: QuestionTracker,
  difficulty: PlayDifficulty,
  question: Question,
  clientId: string
) {
  const cooldown = QUESTION_COOLDOWNS[difficulty];
  tracker.recentlyAsked.push(question.question);

  while (tracker.recentlyAsked.length > cooldown) {
    tracker.recentlyAsked.shift();
  }

  tracker.questionsAsked += 1;
  tracker.lastClientAsked = clientId;
}

export function recordQuestionOutcome(
  tracker: QuestionTracker,
  question: Pick<Question, "exam" | "domain">,
  correct: boolean
) {
  const key = getDomainKey(question);
  const current = tracker.domainPerformance[key] ?? { seen: 0, correct: 0, incorrect: 0 };
  tracker.domainPerformance[key] = {
    seen: current.seen + 1,
    correct: current.correct + (correct ? 1 : 0),
    incorrect: current.incorrect + (correct ? 0 : 1)
  };
}

export function pickAuditQuestion(tracker: QuestionTracker) {
  const available = AUDIT_QUESTIONS.filter((question) => !tracker.recentlyAsked.includes(question.question));
  return available[Math.floor(Math.random() * available.length)] ?? AUDIT_QUESTIONS[0];
}

export function shuffleQuestion(question: Question) {
  const shuffled = question.options.map((option, index) => ({ option, index })).sort(() => Math.random() - 0.5);
  return {
    shuffledOptions: shuffled.map((entry) => entry.option),
    displayCorrectIndex: shuffled.findIndex((entry) => entry.index === question.correct)
  };
}

export function getBlueprintForDifficulty(difficulty: PlayDifficulty) {
  return EXAM_BLUEPRINTS[difficulty];
}
