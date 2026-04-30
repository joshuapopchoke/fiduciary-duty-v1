export type ExamName = "SIE" | "Series 7" | "Series 65" | "Series 66" | "Audit" | "Client" | "Planning";

export type QuestionDifficulty =
  | "learner"
  | "trainee"
  | "associate"
  | "advisor"
  | "senior"
  | "audit"
  | "client";

export interface Question {
  exam: ExamName;
  domain: string;
  difficulty: QuestionDifficulty;
  cooldown: number;
  topicTag: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
}
