import type { PlayDifficulty } from "../types/gameState";

export type TrainingModuleWorkspace =
  | "exam-foundations"
  | "suitability-client-fit"
  | "retirement-planning"
  | "mortgage-debt-planning"
  | "bank-lending"
  | "phishing-scams-trainee"
  | "phishing-scams-it"
  | "client-meeting-readiness"
  | "tax-planning"
  | "insurance-planning"
  | "estate-planning"
  | "qualified-plans"
  | "stock-game";

export interface TrainingModuleDefinition {
  id: string;
  title: string;
  audience: "college" | "ria" | "shared";
  description: string;
  focus: string;
  workspace: TrainingModuleWorkspace;
  requiredDifficulty: PlayDifficulty | null;
  minimumAccuracy: number;
  completionScoreTarget: number | null;
  minimumAnsweredQuestions: number;
  completionLabel: string;
  coachingSignals: string[];
  endsWhenCompleted: boolean;
}

export const TRAINING_MODULES: TrainingModuleDefinition[] = [
  {
    id: "foundations-sie",
    title: "Exam Foundations",
    audience: "shared",
    description: "Build a reliable base in licensing concepts before moving into more advanced client work.",
    focus: "SIE and early Series readiness",
    workspace: "exam-foundations",
    requiredDifficulty: "learner",
    minimumAccuracy: 70,
    completionScoreTarget: 76,
    minimumAnsweredQuestions: 12,
    completionLabel: "Reach a 76 readiness score with 70% accuracy across the assigned exam bank.",
    coachingSignals: ["Exam readiness", "Accuracy discipline", "Knowledge breadth"],
    endsWhenCompleted: true
  },
  {
    id: "suitability-practice",
    title: "Suitability and Client Fit",
    audience: "shared",
    description: "Apply knowledge inside client accounts without drifting outside mandate, tax, and risk boundaries.",
    focus: "Suitability and product fit",
    workspace: "suitability-client-fit",
    requiredDifficulty: "associate",
    minimumAccuracy: 0,
    completionScoreTarget: 80,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 80 suitability score while keeping compliance and client-fit decisions in lane.",
    coachingSignals: ["Suitability", "Compliance", "Rational trade discipline"],
    endsWhenCompleted: true
  },
  {
    id: "retirement-planning-lab",
    title: "Retirement Planning",
    audience: "ria",
    description: "Practice tax-aware retirement planning, account sleeves, distributions, and planning judgment.",
    focus: "Retirement, tax, and sleeve planning",
    workspace: "retirement-planning",
    requiredDifficulty: "advisor",
    minimumAccuracy: 0,
    completionScoreTarget: 84,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 84 retirement-planning score by protecting income, reserves, and long-term wealth.",
    coachingSignals: ["Retirement judgment", "Wealth protection", "Tax-aware planning"],
    endsWhenCompleted: true
  },
  {
    id: "mortgage-debt-planning",
    title: "Mortgage and Debt Planning",
    audience: "shared",
    description: "Work through refinance, debt-service, and housing-cash-flow tradeoffs without unrelated market clutter.",
    focus: "Mortgage guidance and debt planning",
    workspace: "mortgage-debt-planning",
    requiredDifficulty: "associate",
    minimumAccuracy: 0,
    completionScoreTarget: 82,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 82 planning score by balancing debt logic, affordability, reserves, and client fit.",
    coachingSignals: ["Debt analysis", "Affordability judgment", "Client-fit reasoning"],
    endsWhenCompleted: true
  },
  {
    id: "bank-lending",
    title: "Bank Lending",
    audience: "shared",
    description: "Practice basic underwriting logic, reserve review, and lending judgment using client cash-flow and debt context.",
    focus: "Credit and lending decisions",
    workspace: "bank-lending",
    requiredDifficulty: "associate",
    minimumAccuracy: 0,
    completionScoreTarget: 83,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 83 lending score by weighing repayment strength, liquidity, and risk discipline.",
    coachingSignals: ["Underwriting logic", "Risk control", "Decision consistency"],
    endsWhenCompleted: true
  },
  {
    id: "phishing-for-scams-trainee",
    title: "Phishing for Scams - Trainee Edition",
    audience: "shared",
    description: "Work a desktop-style inbox, identify scam tells, protect clients, and respond to malware using security tools or escalation paths.",
    focus: "Phishing, client scam triage, and trainee malware response",
    workspace: "phishing-scams-trainee",
    requiredDifficulty: "trainee",
    minimumAccuracy: 0,
    completionScoreTarget: 84,
    minimumAnsweredQuestions: 8,
    completionLabel: "Reach an 84 phishing-defense score by identifying scam emails, protecting clients, and escalating malware incidents appropriately.",
    coachingSignals: ["Threat detection", "Client safeguarding", "Escalation judgment"],
    endsWhenCompleted: true
  },
  {
    id: "phishing-for-scams-it",
    title: "Phishing for Scams - IT Edition",
    audience: "shared",
    description: "Work a desktop-style inbox, identify scam tells, protect clients, and remove malware directly when a malicious message lands on the machine.",
    focus: "Phishing, client scam triage, and IT malware response",
    workspace: "phishing-scams-it",
    requiredDifficulty: "trainee",
    minimumAccuracy: 0,
    completionScoreTarget: 84,
    minimumAnsweredQuestions: 8,
    completionLabel: "Reach an 84 phishing-defense score by identifying scam emails, protecting clients, and resolving malware incidents cleanly.",
    coachingSignals: ["Threat detection", "Client safeguarding", "Endpoint response"],
    endsWhenCompleted: true
  },
  {
    id: "client-meeting-readiness",
    title: "Client Meeting Readiness",
    audience: "shared",
    description: "Respond in your own words to client prompts and get coached on compliance, rationale, empathy, and practical judgment.",
    focus: "Free-response client communication",
    workspace: "client-meeting-readiness",
    requiredDifficulty: "advisor",
    minimumAccuracy: 0,
    completionScoreTarget: 85,
    minimumAnsweredQuestions: 3,
    completionLabel: "Reach an 85 readiness score across compliance, suitability, empathy, and rationale in live written responses.",
    coachingSignals: ["Communication", "Compliance", "Rational thinking"],
    endsWhenCompleted: true
  },
  {
    id: "stock-game",
    title: "Stock Game",
    audience: "shared",
    description: "Run the full workstation with every planning, market, and advisory system active at once.",
    focus: "Capstone full-sim access",
    workspace: "stock-game",
    requiredDifficulty: null,
    minimumAccuracy: 0,
    completionScoreTarget: null,
    minimumAnsweredQuestions: 0,
    completionLabel: "No fixed endpoint. Use this as the advanced sandbox and capstone practice mode.",
    coachingSignals: ["Knowledge", "Judgment", "Compliance", "Client outcomes"],
    endsWhenCompleted: false
  },
  {
    id: "tax-planning-lab",
    title: "Tax Planning",
    audience: "ria",
    description: "Work through real client tax situations: bracket analysis, Roth conversions, RMDs, tax-loss harvesting, asset location, and charitable giving strategies.",
    focus: "Federal income tax, LTCG, NIIT, RMDs, and planning decisions",
    workspace: "tax-planning",
    requiredDifficulty: "advisor",
    minimumAccuracy: 0,
    completionScoreTarget: 82,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 82 tax-planning score by making accurate bracket, conversion, RMD, and harvesting decisions across the client roster.",
    coachingSignals: ["Tax accuracy", "Planning judgment", "IRC compliance"],
    endsWhenCompleted: true
  },
  {
    id: "insurance-planning-lab",
    title: "Insurance Planning",
    audience: "shared",
    description: "Analyze coverage gaps, select appropriate policy types, structure disability and LTC recommendations, and defend each decision against client-specific needs.",
    focus: "Life, disability, LTC, and umbrella insurance planning",
    workspace: "insurance-planning",
    requiredDifficulty: "associate",
    minimumAccuracy: 0,
    completionScoreTarget: 80,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 80 insurance-planning score by identifying gaps and selecting appropriate coverage structures for each client profile.",
    coachingSignals: ["Coverage analysis", "Product knowledge", "Regulatory compliance"],
    endsWhenCompleted: true
  },
  {
    id: "estate-planning-lab",
    title: "Estate Planning",
    audience: "ria",
    description: "Review estate exposure, identify document gaps, recommend appropriate trust structures, evaluate gifting strategies, and apply basis planning rules across client portfolios.",
    focus: "Estate tax, trusts, gifting, and basis planning",
    workspace: "estate-planning",
    requiredDifficulty: "advisor",
    minimumAccuracy: 0,
    completionScoreTarget: 82,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 82 estate-planning score by making accurate exposure, document, trust, and gifting decisions with full IRC regulatory grounding.",
    coachingSignals: ["Estate analysis", "Trust knowledge", "Regulatory compliance"],
    endsWhenCompleted: true
  },
  {
    id: "qualified-plans-lab",
    title: "Qualified Plans",
    audience: "shared",
    description: "Compare plan types, maximize contributions, handle rollover decisions including NUA analysis, apply ERISA fiduciary standards, and evaluate plan design choices.",
    focus: "401(k), IRA, ERISA, rollovers, and plan design",
    workspace: "qualified-plans",
    requiredDifficulty: "associate",
    minimumAccuracy: 0,
    completionScoreTarget: 82,
    minimumAnsweredQuestions: 20,
    completionLabel: "Reach an 82 qualified-plans score by selecting appropriate plan types, maximizing contributions, and applying ERISA fiduciary standards correctly.",
    coachingSignals: ["Plan knowledge", "ERISA compliance", "Contribution optimization"],
    endsWhenCompleted: true
  }

];

// Appended by module expansion — modules 8-11
