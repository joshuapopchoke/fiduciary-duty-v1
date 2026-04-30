import fs from "node:fs";
import path from "node:path";
import type { Question } from "../src/types/question";

type LegacyDifficulty = "trainee" | "associate" | "advisor" | "senior" | "audit" | "client";

interface LegacyQuestionSeed {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
  passPoints?: number;
}

interface LegacyClientSeed {
  id: string;
  questions: LegacyQuestionSeed[];
}

interface PoolMeta {
  exam: "SIE" | "Series 7" | "Series 65" | "Series 66";
  domain: string;
  difficulty: Exclude<LegacyDifficulty, "audit" | "client">;
  cooldown: number;
  topicTag: string;
}

type LegacyQuestionPools = Record<string, LegacyQuestionSeed[]>;

const html = fs.readFileSync(path.join("public", "legacy", "index.html"), "utf8");

function extract(name: string): string {
  const idx = html.indexOf(`const ${name} =`);

  if (idx < 0) {
    throw new Error(`Missing constant: ${name}`);
  }

  let start = html.indexOf("{", idx);
  const arrayStart = html.indexOf("[", idx);

  if (arrayStart !== -1 && (start === -1 || arrayStart < start)) {
    start = arrayStart;
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (inTemplate) {
      if (ch === "`") {
        inTemplate = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === "`") {
      inTemplate = true;
      continue;
    }

    if (ch === "{" || ch === "[") {
      depth += 1;
    }
    if (ch === "}" || ch === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  return html.slice(start, end);
}

function evaluateLegacyValue<T>(name: string): T {
  const raw = extract(name);
  return Function(`"use strict"; return (${raw});`)() as T;
}

const legacyPools = evaluateLegacyValue<LegacyQuestionPools>("QUESTION_POOLS");
const auditQuestions = evaluateLegacyValue<LegacyQuestionSeed[]>("AUDIT_QUESTIONS");
const clients = evaluateLegacyValue<LegacyClientSeed[]>("CLIENTS");
const institutional = evaluateLegacyValue<LegacyClientSeed>("INSTITUTIONAL_CLIENT");

const poolMeta: Record<string, PoolMeta> = {
  basic: { exam: "SIE", domain: "Legacy Foundation", difficulty: "trainee", cooldown: 62, topicTag: "legacy-basic" },
  intermediate: { exam: "Series 7", domain: "Legacy Foundation", difficulty: "associate", cooldown: 45, topicTag: "legacy-intermediate" },
  advanced: { exam: "Series 65", domain: "Legacy Foundation", difficulty: "advisor", cooldown: 30, topicTag: "legacy-advanced" },
  expert: { exam: "Series 66", domain: "Legacy Foundation", difficulty: "senior", cooldown: 28, topicTag: "legacy-expert" }
};

const mappedLegacyPools = Object.fromEntries(
  Object.entries(legacyPools).map(([key, questions]) => {
    const meta = poolMeta[key];
    return [
      key,
      questions.map<Question>((question, index) => ({
        exam: meta.exam,
        domain: meta.domain,
        difficulty: meta.difficulty,
        cooldown: meta.cooldown,
        topicTag: `${meta.topicTag}-${index + 1}`,
        question: question.q,
        options: question.options,
        correct: question.correct,
        explanation: question.explanation,
        points: question.points
      }))
    ];
  })
) as Record<string, Question[]>;

const mappedClientQuestionSets = Object.fromEntries(
  [...clients, institutional].map((client) => [
    client.id,
    client.questions.map<Question>((question, index) => ({
      exam: "Client",
      domain: "Client Suitability",
      difficulty: "client",
      cooldown: 12,
      topicTag: `${client.id}-${index + 1}`,
      question: question.q,
      options: question.options,
      correct: question.correct,
      explanation: question.explanation,
      points: question.points
    }))
  ])
) as Record<string, Question[]>;

const mappedAuditQuestions = auditQuestions.map<Question>((question, index) => ({
  exam: "Audit",
  domain: "Fiduciary Audit",
  difficulty: "audit",
  cooldown: 6,
  topicTag: `audit-${index + 1}`,
  question: question.q,
  options: question.options,
  correct: question.correct,
  explanation: question.explanation,
  points: question.passPoints ?? question.points
}));

const file = `import type { Question } from "../types/question";

export const LEGACY_QUESTION_POOLS = ${JSON.stringify(mappedLegacyPools, null, 2)} satisfies Record<string, Question[]>;

export const CLIENT_QUESTION_SETS = ${JSON.stringify(mappedClientQuestionSets, null, 2)} satisfies Record<string, Question[]>;

export const AUDIT_QUESTIONS = ${JSON.stringify(mappedAuditQuestions, null, 2)} satisfies Question[];

export const QUESTION_COOLDOWNS = {
  trainee: 62,
  associate: 45,
  advisor: 30,
  senior: 28,
  audit: 6,
  client: 12
} as const;

const WRAPPERS = [
  "On a licensing exam, ",
  "A candidate is asked: ",
  "During a practice question, ",
  "A client scenario asks, ",
  "In a regulatory review, ",
  "For exam prep, ",
  "A study prompt states, ",
  "A knowledge check asks, ",
  "An exam scenario says, ",
  "A review question asks, "
];

function wrapQuestion(question: Question, variant: number): Question {
  const prefix = WRAPPERS[variant % WRAPPERS.length];

  return {
    ...question,
    topicTag: \`\${question.topicTag}-variant-\${variant + 1}\`,
    question: \`\${prefix}\${question.question.charAt(0).toLowerCase()}\${question.question.slice(1)}\`
  };
}

function inflatePool(base: Question[], generated: Question[], target: number): Question[] {
  const pool = [...base];

  if (pool.length >= target) {
    return pool.slice(0, target);
  }

  if (generated.length === 0) {
    return pool;
  }

  let variant = 0;
  while (pool.length < target) {
    const source = generated[variant % generated.length];
    pool.push(wrapQuestion(source, variant));
    variant += 1;
  }

  return pool;
}

function makeQuestion(question: Question): Question {
  return question;
}

const SIE_GENERATED: Question[] = [
  makeQuestion({
    exam: "SIE",
    domain: "Knowledge of Capital Markets",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-primary-market",
    question: "Which market handles the sale of newly issued securities in which the issuer receives the proceeds?",
    options: ["Primary market", "Secondary market", "OTC aftermarket", "Auction facility"],
    correct: 0,
    explanation: "The primary market is where issuers sell new securities and receive capital. The secondary market is where investors trade outstanding securities with each other after issuance.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Knowledge of Capital Markets",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-rate-impact",
    question: "When interest rates rise, what generally happens to outstanding bond prices?",
    options: ["They generally rise", "They generally fall", "They are unchanged", "They become tax-free"],
    correct: 1,
    explanation: "Bond prices and interest rates usually move in opposite directions. When market rates rise, older bonds with lower coupons become less attractive and their prices usually fall.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Understanding Products and Their Risks",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-common-stock",
    question: "Which feature is typically associated with common stock?",
    options: ["Voting rights and residual ownership", "A fixed maturity date", "Guaranteed dividends", "Priority over secured creditors"],
    correct: 0,
    explanation: "Common stock represents an ownership interest in a corporation and often includes voting rights. Common shareholders are residual owners, so they are paid after creditors and preferred shareholders in liquidation.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Understanding Trading, Customer Accounts and Prohibited Activities",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-stop-order",
    question: "Which order becomes a market order once the stop price is reached?",
    options: ["Stop order", "Limit order", "Fill-or-kill order", "Market-on-close order"],
    correct: 0,
    explanation: "A stop order activates once the stop price is reached and then becomes a market order. That means the execution price can differ from the trigger price depending on market conditions.",
    points: 10
  }),
  makeQuestion({
    exam: "SIE",
    domain: "Overview of Regulatory Framework",
    difficulty: "trainee",
    cooldown: QUESTION_COOLDOWNS.trainee,
    topicTag: "sie-finra",
    question: "Which organization is the primary self-regulatory organization for broker-dealers in the United States?",
    options: ["FINRA", "IRS", "Treasury Department", "Federal Reserve Board"],
    correct: 0,
    explanation: "FINRA is the primary self-regulatory organization that oversees broker-dealers and their registered representatives. It operates under SEC oversight but is not itself a federal agency.",
    points: 10
  })
];

export const QUESTION_POOLS = {
  sie: inflatePool(LEGACY_QUESTION_POOLS.basic, SIE_GENERATED, 300),
  series7: inflatePool(LEGACY_QUESTION_POOLS.intermediate, [], 500),
  series65: inflatePool(LEGACY_QUESTION_POOLS.advanced, [], 400),
  series66: inflatePool(LEGACY_QUESTION_POOLS.expert, [], 400)
} as const;

export const DIFFICULTY_TO_POOL_KEY = {
  trainee: "sie",
  associate: "series7",
  advisor: "series65",
  senior: "series66"
} as const;

export function getQuestionsForDifficulty(difficulty: "trainee" | "associate" | "advisor" | "senior"): Question[] {
  return QUESTION_POOLS[DIFFICULTY_TO_POOL_KEY[difficulty]];
}
`;

fs.mkdirSync(path.join("src", "data"), { recursive: true });
fs.writeFileSync(path.join("src", "data", "questions.ts"), file);
