import type { PlayDifficulty } from "../types/gameState";

export interface ExamDomainBlueprint {
  exam: "SIE" | "Series 7" | "Series 65" | "Series 66";
  key: string;
  label: string;
  weight: number;
}

export const DIFFICULTY_LABELS: Record<PlayDifficulty, string> = {
  learner: "Learner",
  trainee: "Easy",
  associate: "Medium",
  advisor: "Hard",
  senior: "Pro"
};

export const EXAM_BLUEPRINTS: Record<PlayDifficulty, ExamDomainBlueprint[]> = {
  learner: [
    { exam: "SIE", key: "sie-capital-markets", label: "Knowledge of Capital Markets", weight: 0.16 },
    { exam: "SIE", key: "sie-products-risks", label: "Understanding Products and Their Risks", weight: 0.44 },
    { exam: "SIE", key: "sie-trading-accounts", label: "Understanding Trading, Customer Accounts and Prohibited Activities", weight: 0.31 },
    { exam: "SIE", key: "sie-reg-framework", label: "Overview of the Regulatory Framework", weight: 0.09 }
  ],
  trainee: [
    { exam: "SIE", key: "sie-capital-markets", label: "Knowledge of Capital Markets", weight: 0.096 },
    { exam: "SIE", key: "sie-products-risks", label: "Understanding Products and Their Risks", weight: 0.264 },
    { exam: "SIE", key: "sie-trading-accounts", label: "Understanding Trading, Customer Accounts and Prohibited Activities", weight: 0.186 },
    { exam: "SIE", key: "sie-reg-framework", label: "Overview of the Regulatory Framework", weight: 0.054 },
    { exam: "Series 65", key: "series65-econ", label: "Economic Factors and Business Information", weight: 0.06 },
    { exam: "Series 65", key: "series65-vehicles", label: "Investment Vehicle Characteristics", weight: 0.1 },
    { exam: "Series 65", key: "series65-recs", label: "Client Investment Recommendations and Strategies", weight: 0.12 },
    { exam: "Series 65", key: "series65-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.12 }
  ],
  associate: [
    { exam: "SIE", key: "sie-capital-markets", label: "Knowledge of Capital Markets", weight: 0.096 },
    { exam: "SIE", key: "sie-products-risks", label: "Understanding Products and Their Risks", weight: 0.264 },
    { exam: "SIE", key: "sie-trading-accounts", label: "Understanding Trading, Customer Accounts and Prohibited Activities", weight: 0.186 },
    { exam: "SIE", key: "sie-reg-framework", label: "Overview of the Regulatory Framework", weight: 0.054 },
    { exam: "Series 65", key: "series65-econ", label: "Economic Factors and Business Information", weight: 0.06 },
    { exam: "Series 65", key: "series65-vehicles", label: "Investment Vehicle Characteristics", weight: 0.1 },
    { exam: "Series 65", key: "series65-recs", label: "Client Investment Recommendations and Strategies", weight: 0.12 },
    { exam: "Series 65", key: "series65-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.12 }
  ],
  advisor: [
    { exam: "SIE", key: "sie-capital-markets", label: "Knowledge of Capital Markets", weight: 0.048 },
    { exam: "SIE", key: "sie-products-risks", label: "Understanding Products and Their Risks", weight: 0.132 },
    { exam: "SIE", key: "sie-trading-accounts", label: "Understanding Trading, Customer Accounts and Prohibited Activities", weight: 0.093 },
    { exam: "SIE", key: "sie-reg-framework", label: "Overview of the Regulatory Framework", weight: 0.027 },
    { exam: "Series 65", key: "series65-econ", label: "Economic Factors and Business Information", weight: 0.045 },
    { exam: "Series 65", key: "series65-vehicles", label: "Investment Vehicle Characteristics", weight: 0.075 },
    { exam: "Series 65", key: "series65-recs", label: "Client Investment Recommendations and Strategies", weight: 0.09 },
    { exam: "Series 65", key: "series65-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.09 },
    { exam: "Series 7", key: "series7-f1", label: "Seeks Business for the Broker-Dealer from Customers and Potential Customers", weight: 0.0144 },
    { exam: "Series 7", key: "series7-f2", label: "Opens Accounts After Obtaining and Evaluating Customers' Financial Profile and Investment Objectives", weight: 0.0176 },
    { exam: "Series 7", key: "series7-f3", label: "Provides Customers with Information about Investments, Makes Recommendations, Transfers Assets and Maintains Appropriate Records", weight: 0.1456 },
    { exam: "Series 7", key: "series7-f4", label: "Obtains and Verifies Customers' Purchase and Sales Instructions and Agreements; Processes, Completes, and Confirms Transactions", weight: 0.0224 },
    { exam: "Series 66", key: "series66-econ", label: "Economic Factors and Business Information", weight: 0.01 },
    { exam: "Series 66", key: "series66-vehicles", label: "Investment Vehicle Characteristics", weight: 0.04 },
    { exam: "Series 66", key: "series66-recs", label: "Client/Customer Investment Recommendations and Strategies", weight: 0.06 },
    { exam: "Series 66", key: "series66-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.09 }
  ],
  senior: [
    { exam: "SIE", key: "sie-capital-markets", label: "Knowledge of Capital Markets", weight: 0.032 },
    { exam: "SIE", key: "sie-products-risks", label: "Understanding Products and Their Risks", weight: 0.088 },
    { exam: "SIE", key: "sie-trading-accounts", label: "Understanding Trading, Customer Accounts and Prohibited Activities", weight: 0.062 },
    { exam: "SIE", key: "sie-reg-framework", label: "Overview of the Regulatory Framework", weight: 0.018 },
    { exam: "Series 65", key: "series65-econ", label: "Economic Factors and Business Information", weight: 0.045 },
    { exam: "Series 65", key: "series65-vehicles", label: "Investment Vehicle Characteristics", weight: 0.075 },
    { exam: "Series 65", key: "series65-recs", label: "Client Investment Recommendations and Strategies", weight: 0.09 },
    { exam: "Series 65", key: "series65-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.09 },
    { exam: "Series 7", key: "series7-f1", label: "Seeks Business for the Broker-Dealer from Customers and Potential Customers", weight: 0.018 },
    { exam: "Series 7", key: "series7-f2", label: "Opens Accounts After Obtaining and Evaluating Customers' Financial Profile and Investment Objectives", weight: 0.022 },
    { exam: "Series 7", key: "series7-f3", label: "Provides Customers with Information about Investments, Makes Recommendations, Transfers Assets and Maintains Appropriate Records", weight: 0.182 },
    { exam: "Series 7", key: "series7-f4", label: "Obtains and Verifies Customers' Purchase and Sales Instructions and Agreements; Processes, Completes, and Confirms Transactions", weight: 0.028 },
    { exam: "Series 66", key: "series66-econ", label: "Economic Factors and Business Information", weight: 0.0125 },
    { exam: "Series 66", key: "series66-vehicles", label: "Investment Vehicle Characteristics", weight: 0.05 },
    { exam: "Series 66", key: "series66-recs", label: "Client/Customer Investment Recommendations and Strategies", weight: 0.075 },
    { exam: "Series 66", key: "series66-laws", label: "Laws, Regulations, and Guidelines Including Prohibition on Unethical Business Practices", weight: 0.1125 }
  ]
};

export function pickBlueprintDomain(difficulty: PlayDifficulty): ExamDomainBlueprint {
  const domains = EXAM_BLUEPRINTS[difficulty];
  const roll = Math.random();
  let cumulative = 0;

  for (const domain of domains) {
    cumulative += domain.weight;
    if (roll <= cumulative) {
      return domain;
    }
  }

  return domains[domains.length - 1];
}
