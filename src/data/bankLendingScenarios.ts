import type { ClientAccount } from "../types/client";

export type LendingWorkflowDecision = "Approve" | "Conditional" | "Decline";

export interface BankLendingWorkflowScenario {
  id: string;
  title: string;
  segment: "Consumer" | "Business";
  recommendedDecision: LendingWorkflowDecision;
  summary: string;
  rationale: string;
  remediationSteps: string[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function buildBankLendingWorkflowScenarios(client: ClientAccount): BankLendingWorkflowScenario[] {
  const grossIncome = Math.max(1, client.cashFlow.monthlyIncome);
  const consumerDti = (client.cashFlow.monthlyDebtPayments + client.debtProfile.housingPayment) / grossIncome;
  const reserveMonths = client.cash / Math.max(1, client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments);
  const businessCoverage = client.lendingProfile.businessCashFlowCoverage ?? 0.9;

  const consumerDecision: LendingWorkflowDecision =
    client.creditProfile.score >= 740 && consumerDti < 0.38 && reserveMonths >= 4 ? "Approve" :
    client.creditProfile.score >= 680 && consumerDti < 0.45 ? "Conditional" :
    "Decline";
  const businessDecision: LendingWorkflowDecision =
    businessCoverage >= 1.35 && reserveMonths >= 4 ? "Approve" :
    businessCoverage >= 1.1 ? "Conditional" :
    "Decline";

  return [
    {
      id: "consumer-underwriting",
      title: "Consumer Credit Workflow",
      segment: "Consumer",
      recommendedDecision: consumerDecision,
      summary: `Use the consumer lane to decide whether ${client.name.split(" ")[0]} should be approved, approved with conditions, or declined for now based on debt load, reserves, and repayment visibility.`,
      rationale:
        consumerDecision === "Approve"
          ? `The file supports an approval conversation with ${client.creditProfile.score} credit and about ${reserveMonths.toFixed(1)} months of reserves.`
          : consumerDecision === "Conditional"
            ? `The file is not a clean yes. DTI is around ${(consumerDti * 100).toFixed(0)}%, so conditions should target repayment stability and reserve proof.`
            : `The file is better used as a coaching exercise. A ${client.creditProfile.score} score and ${(consumerDti * 100).toFixed(0)}% DTI should push the trainee toward decline-plus-remediation, not approval drift.`,
      remediationSteps: consumerDecision === "Decline"
        ? [
            "Reduce revolving utilization and unpaid debt before resubmission.",
            "Build cash reserves to improve payment resilience.",
            "Request updated income and debt documentation after the repair period."
          ]
        : [
            "Document income cleanly and verify the current debt schedule.",
            "Confirm reserve liquidity before final approval.",
            "Match term and payment to the borrower’s stability, not just maximum capacity."
          ]
    },
    {
      id: "business-underwriting",
      title: "Business Lending Workflow",
      segment: "Business",
      recommendedDecision: businessDecision,
      summary: "Use the business lane to train cash-flow coverage, collateral discipline, and whether the borrower should get clean approval, conditional approval, or a decline with a repair path.",
      rationale:
        businessDecision === "Approve"
          ? `Business cash-flow coverage around ${businessCoverage.toFixed(1)}x supports an approval path if documentation and collateral still hold.`
          : businessDecision === "Conditional"
            ? `Coverage around ${businessCoverage.toFixed(1)}x is workable but not clean, so the better training move is conditional approval with tighter covenants or a lower amount.`
            : `Coverage around ${businessCoverage.toFixed(1)}x does not support a confident approval. The trainee should learn to decline and explain the rebuild path instead of stretching.`,
      remediationSteps: businessDecision === "Decline"
        ? [
            "Request stronger debt-service coverage and updated business financials.",
            "Reduce requested amount or add stronger collateral support.",
            "Revisit the file after liquidity and operating results improve."
          ]
        : [
            "Validate business financial statements and cash-flow durability.",
            "Confirm collateral support and guarantor strength if required.",
            "Set approval conditions that match risk rather than approving on optimism."
          ]
    },
    {
      id: "borderline-file",
      title: "Borderline File Coaching",
      segment: client.lendingProfile.underwritingTrack === "Private Wealth" ? "Business" : "Consumer",
      recommendedDecision: consumerDecision === "Approve" && businessDecision === "Approve" ? "Conditional" : "Decline",
      summary: "Train the user to explain a borderline file in plain language and choose remediation instead of letting momentum push the decision.",
      rationale: `Current liquid reserves are about ${formatCurrency(client.cash)}, and the next best move is to tie the decision to repayability and documentation, not sales pressure.`,
      remediationSteps: [
        "Explain exactly which metric is out of lane and why it matters.",
        "Give the borrower a concrete repair path instead of a vague rejection.",
        "Re-underwrite after improved reserves, cleaner debt, or stronger cash-flow proof."
      ]
    }
  ];
}
