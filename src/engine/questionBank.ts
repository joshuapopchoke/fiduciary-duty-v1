import { EXAM_BLUEPRINTS } from "../data/examBlueprints";
import { AUDIT_QUESTIONS, QUESTION_POOLS } from "../data/questions";
import type { Question } from "../types/question";
import type { PlayDifficulty } from "../types/gameState";

export type AuthoredQuestionBankKey = "sie" | "series7" | "series65" | "series66";
export type AuthoredQuestionBank = Record<AuthoredQuestionBankKey, Question[]>;

const emptyAuthoredBank = (): AuthoredQuestionBank => ({
  sie: [],
  series7: [],
  series65: [],
  series66: []
});

const authoredBankCache: Partial<AuthoredQuestionBank> = {};
const authoredBankPromises: Partial<Record<AuthoredQuestionBankKey, Promise<Question[]>>> = {};

function validateQuestions(label: string, questions: Question[], enforceBlueprintDomains = true) {
  const seenTags = new Set<string>();
  const blueprintDomains = new Set<string>(
    Object.values(EXAM_BLUEPRINTS)
      .flat()
      .map((domain) => `${domain.exam}:${domain.label}`)
  );
  const allowedLegacyDomainAliases = new Set(["SIE:Overview of Regulatory Framework"]);

  questions.forEach((question, index) => {
    const pointer = `${label}[${index}]`;

    if (!question.question.trim()) {
      throw new Error(`${pointer} is missing question text.`);
    }

    if (question.options.length !== 4) {
      throw new Error(`${pointer} must have exactly 4 options.`);
    }

    if (question.correct < 0 || question.correct >= question.options.length) {
      throw new Error(`${pointer} has an out-of-range correct index.`);
    }

    if (!question.explanation.trim()) {
      throw new Error(`${pointer} is missing an explanation.`);
    }

    if (seenTags.has(question.topicTag)) {
      throw new Error(`${pointer} reuses topicTag "${question.topicTag}".`);
    }

    seenTags.add(question.topicTag);

    if (enforceBlueprintDomains && question.exam !== "Audit" && question.exam !== "Client") {
      const domainKey = `${question.exam}:${question.domain}`;
      if (
        !blueprintDomains.has(domainKey) &&
        !allowedLegacyDomainAliases.has(domainKey) &&
        question.domain !== "Legacy Foundation"
      ) {
        throw new Error(`${pointer} uses unexpected domain "${question.domain}" for ${question.exam}.`);
      }
    }
  });
}

function validateQuestionBank(bank: Partial<AuthoredQuestionBank>) {
  if (bank.sie) validateQuestions("authored.sie", bank.sie);
  if (bank.series7) validateQuestions("authored.series7", bank.series7);
  if (bank.series65) validateQuestions("authored.series65", bank.series65);
  if (bank.series66) validateQuestions("authored.series66", bank.series66);
  validateQuestions("fallback.sie", QUESTION_POOLS.sie, false);
  validateQuestions("fallback.series7", QUESTION_POOLS.series7, false);
  validateQuestions("fallback.series65", QUESTION_POOLS.series65, false);
  validateQuestions("fallback.series66", QUESTION_POOLS.series66, false);
  validateQuestions("audit", AUDIT_QUESTIONS, false);
}

function examToKey(exam: "SIE" | "Series 7" | "Series 65" | "Series 66"): AuthoredQuestionBankKey {
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

export function getExamKeysForDifficulty(difficulty: PlayDifficulty): AuthoredQuestionBankKey[] {
  return [...new Set(EXAM_BLUEPRINTS[difficulty].map((domain) => examToKey(domain.exam)))];
}

async function loadAuthoredQuestionSet(key: AuthoredQuestionBankKey): Promise<Question[]> {
  if (authoredBankCache[key]) {
    return authoredBankCache[key] as Question[];
  }

  if (!authoredBankPromises[key]) {
    authoredBankPromises[key] = (async () => {
      switch (key) {
        case "sie": {
          const module = await import("../data/authoredQuestions/sie");
          return module.SIE_AUTHORED_QUESTIONS;
        }
        case "series7": {
          const module = await import("../data/authoredQuestions/series7");
          return module.SERIES7_AUTHORED_QUESTIONS;
        }
        case "series65": {
          const module = await import("../data/authoredQuestions/series65");
          return module.SERIES65_AUTHORED_QUESTIONS;
        }
        case "series66": {
          const module = await import("../data/authoredQuestions/series66");
          return module.SERIES66_AUTHORED_QUESTIONS;
        }
      }
    })().then((questions) => {
      authoredBankCache[key] = questions;
      validateQuestionBank({ [key]: questions });
      return questions;
    });
  }

  return authoredBankPromises[key] as Promise<Question[]>;
}

export async function loadAuthoredQuestionBank(keys?: AuthoredQuestionBankKey[]) {
  const requestedKeys = keys ?? (["sie", "series7", "series65", "series66"] satisfies AuthoredQuestionBankKey[]);
  const bank = emptyAuthoredBank();

  await Promise.all(
    requestedKeys.map(async (key) => {
      bank[key] = await loadAuthoredQuestionSet(key);
    })
  );

  validateQuestionBank(bank);
  return bank;
}

export function getAuthoredQuestionBankSync(keys?: AuthoredQuestionBankKey[]) {
  const requestedKeys = keys ?? (["sie", "series7", "series65", "series66"] satisfies AuthoredQuestionBankKey[]);
  const bank = emptyAuthoredBank();

  requestedKeys.forEach((key) => {
    bank[key] = authoredBankCache[key] ?? [];
  });

  return bank;
}

export function getLoadedQuestionBankKeys() {
  return (Object.keys(authoredBankCache) as AuthoredQuestionBankKey[]).filter((key) => {
    const questions = authoredBankCache[key];
    return Array.isArray(questions) && questions.length > 0;
  });
}
