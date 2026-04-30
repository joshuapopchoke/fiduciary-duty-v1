import type { ClientAccount } from "../types/client";
import type { MortgageStateProfile } from "./mortgageStateProfiles";

export interface MortgageTrainingScenario {
  id: string;
  title: string;
  summary: string;
  recommendedLane: string;
  rationale: string;
  caution: string;
  coachingSteps: string[];
}

export const MORTGAGE_TRAINING_SCENARIO_IDS = [
  "first-time-buyer",
  "investor-property",
  "fha-vs-conventional",
  "rate-lock"
] as const;

function currency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function buildMortgageTrainingScenarios(client: ClientAccount, stateProfile: MortgageStateProfile | null): MortgageTrainingScenario[] {
  const monthlyHousingLoad =
    client.debtProfile.housingPayment +
    client.mortgageProfile.propertyTaxMonthly +
    client.mortgageProfile.homeownerInsuranceMonthly;
  const backEndDti = client.cashFlow.monthlyIncome > 0
    ? (client.cashFlow.monthlyDebtPayments + monthlyHousingLoad) / client.cashFlow.monthlyIncome
    : 0;
  const reserveMonths = client.cash / Math.max(1, client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments);
  const stateName = stateProfile?.name ?? "the assigned state";
  const purchaseLocation = client.mortgagePurchaseProfile
    ? `${client.mortgagePurchaseProfile.city}, ${client.mortgagePurchaseProfile.stateCode}`
    : stateName;
  const targetPriceNote = client.mortgagePurchaseProfile
    ? ` Target home target is about ${currency(client.mortgagePurchaseProfile.targetPurchasePrice)} for a ${client.mortgagePurchaseProfile.propertyType.toLowerCase()}.`
    : "";

  return [
    {
      id: "first-time-buyer",
      title: "First-Time Buyer Readiness",
      summary: `Use this lane to train whether ${client.name.split(" ")[0]} is truly purchase-ready in ${purchaseLocation}, not just able to scrape into an approval.${targetPriceNote}`,
      recommendedLane:
        client.creditProfile.score >= 700 && reserveMonths >= 4 && backEndDti < 0.42
          ? "Move forward with a structured first-time-buyer conversation."
          : "Slow the file down and rebuild reserves or debt profile first.",
      rationale:
        reserveMonths >= 4
          ? `${client.name.split(" ")[0]} has roughly ${reserveMonths.toFixed(1)} months of reserves, which supports a more durable first-home conversation.`
          : `Reserve depth is only about ${reserveMonths.toFixed(1)} months, so the better coaching point is sustainability after move-in, not just getting to closing day.`,
      caution: stateProfile?.firstTimeBuyerFocus ?? "Layer local assistance carefully so it improves affordability instead of hiding a fragile payment profile.",
      coachingSteps: [
        "Compare payment durability after taxes, insurance, and HOA or maintenance costs.",
        "Check whether local or state assistance improves long-run affordability or only masks weak reserves.",
        "Coach the borrower on payment shock, repair reserves, and post-close liquidity."
      ]
    },
    {
      id: "investor-property",
      title: "Investor Property Discipline",
      summary: "Train the user to separate a primary-home mindset from an investor-property underwriting mindset.",
      recommendedLane:
        client.lendingProfile.businessCashFlowCoverage && client.lendingProfile.businessCashFlowCoverage >= 1.25
          ? "Conditional investor-property path is defensible."
          : "Treat this as a caution file unless reserves and rent support improve.",
      rationale:
        client.lendingProfile.businessCashFlowCoverage
          ? `The current business or property cash-flow coverage reads ${client.lendingProfile.businessCashFlowCoverage.toFixed(1)}x, which should drive the conversation more than enthusiasm about the asset.`
          : "No business-style cash-flow coverage is loaded, so the trainer should emphasize reserve depth and downside resilience.",
      caution: stateProfile?.investorPropertyFocus ?? "Investor-property requests should be treated more conservatively than primary-residence files.",
      coachingSteps: [
        "Review reserve expectations, vacancy assumptions, and whether the property can truly carry itself.",
        "Avoid approving the story when the repayment engine is unclear.",
        "Use conditional approval if coverage and liquidity are close but not fully in lane."
      ]
    },
    {
      id: "fha-vs-conventional",
      title: "FHA vs Conventional",
      summary: "Force the trainee to defend why FHA or conventional is the better fit instead of defaulting to whichever clears approval first.",
      recommendedLane:
        client.creditProfile.score < 720 || client.mortgageProfile.closingCostSensitivity === "High"
          ? "Start from FHA, then prove conventional if long-run cost still works."
          : "Start from conventional, then justify FHA only if flexibility is still worth the cost.",
      rationale:
        client.creditProfile.score < 720
          ? `A ${client.creditProfile.score} credit score makes FHA flexibility relevant, but that does not remove the need to discuss mortgage insurance and total payment durability.`
          : `With credit around ${client.creditProfile.score}, the trainee should explain whether conventional pricing and future MI exit improve the long-run lane.`,
      caution: stateProfile?.fhaConventionalFocus ?? "Use FHA for flexibility and conventional for cleaner long-run economics when the file can support it.",
      coachingSteps: [
        "Compare total monthly payment, not just the note rate.",
        "Explain how mortgage insurance behaves over time in each lane.",
        "Tie the recommendation back to reserves, credit, and expected hold horizon."
      ]
    },
    {
      id: "rate-lock",
      title: "Rate-Lock Timing",
      summary: "Train whether the borrower should lock now, float briefly, or avoid paying extension costs into a shaky closing timeline.",
      recommendedLane:
        client.mortgageProfile.refinanceHorizonMonths < 36 || client.mortgageProfile.closingCostSensitivity === "High"
          ? "Use a shorter, disciplined lock conversation with extension-cost caution."
          : "A longer lock can be justified if the file is truly close-ready.",
      rationale:
        `Closing-cost sensitivity is ${client.mortgageProfile.closingCostSensitivity.toLowerCase()}, so the right coaching point is whether lock cost buys certainty or just expensive hope. Estimated housing carry is about ${currency(monthlyHousingLoad)} per month.`,
      caution: stateProfile?.rateLockFocus ?? "Rate-lock choices should be paired with realistic closing readiness, not wishful timing.",
      coachingSteps: [
        "Check appraisal, title, insurance, and document readiness before paying for a longer lock.",
        "Discuss extension risk openly instead of assuming the closing timeline will hold.",
        "Match the lock strategy to the borrower’s tolerance for payment drift and cash-to-close pressure."
      ]
    }
  ];
}
