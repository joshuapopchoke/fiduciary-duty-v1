import { INSURANCE_PRODUCTS } from "./insuranceProducts";

export interface InsuranceDialoguePrompt {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface InsuranceDialogueScenario {
  clientId: string;
  insuranceId: string;
  title: string;
  prompts: InsuranceDialoguePrompt[];
}

function buildPrompt(
  insuranceId: string,
  suffix: string,
  question: string,
  options: string[],
  correct: number,
  explanation: string
): InsuranceDialoguePrompt {
  return {
    id: `${insuranceId}-${suffix}`,
    question,
    options,
    correct,
    explanation
  };
}

export const INSURANCE_DIALOGUES: InsuranceDialogueScenario[] = [
  {
    clientId: "retiree",
    insuranceId: "long-term-care",
    title: "Margaret Chen wants to understand why care planning belongs in retirement.",
    prompts: [
      buildPrompt(
        "long-term-care",
        "retiree-need",
        "Why are you bringing this up now instead of just telling me to keep buying bonds?",
        [
          "Because later-life care costs can force unplanned withdrawals from the retirement portfolio",
          "Because every retiree automatically needs the same policy",
          "Because insurance usually earns more than a bond fund",
          "Because it is easier than updating your income plan"
        ],
        0,
        "Long-term care planning matters because a large care event can damage an otherwise solid retirement-income strategy. The best explanation connects the product to asset protection and withdrawal risk, not to a generic sales script."
      ),
      buildPrompt(
        "long-term-care",
        "retiree-fit",
        "What would make this worth considering for me specifically?",
        [
          "Whether the premium fits cash flow, whether the coverage addresses a real care-cost risk, and whether it protects the rest of the plan",
          "The fact that your neighbor bought one",
          "The idea that all retirees should own permanent insurance products",
          "The chance to move your investment assets into the policy quickly"
        ],
        0,
        "A recommendation should be tied to affordability, actual risk exposure, and how the coverage fits into the broader retirement plan. Good advice explains suitability, not social proof or urgency."
      )
    ]
  },
  {
    clientId: "young_pro",
    insuranceId: "disability",
    title: "Derek Washington is skeptical that income protection matters while he is young.",
    prompts: [
      buildPrompt(
        "disability",
        "young-pro-value",
        "Why should I pay for this when I would rather invest the money?",
        [
          "Because your future earning power may be your largest asset, and protecting it can preserve your investment plan",
          "Because disability policies usually outperform growth stocks",
          "Because insurance replaces the need for an emergency fund",
          "Because everyone in their thirties should buy the most expensive policy available"
        ],
        0,
        "For a young professional, the planning case is usually that income interruption can derail saving, investing, and debt goals. The product is there to protect the plan's engine, not to replace investing."
      ),
      buildPrompt(
        "disability",
        "young-pro-fit",
        "What would make me say yes instead of just skipping it?",
        [
          "A policy that fits your budget and realistically protects the income your savings plan depends on",
          "A guaranteed return that beats the stock market",
          "A promise that you will never need emergency cash again",
          "A complex rider package whether or not it solves a real need"
        ],
        0,
        "The recommendation should be framed around budget, real exposure, and the role income plays in the rest of the financial plan. Good advice is about right-sizing protection, not overselling complexity."
      )
    ]
  },
  {
    clientId: "family",
    insuranceId: "term-life",
    title: "The Kowalski family wants to know why life insurance belongs in a family plan.",
    prompts: [
      buildPrompt(
        "term-life",
        "family-purpose",
        "What problem are you trying to solve for us with this recommendation?",
        [
          "Protecting the mortgage, children, and household cash flow if one income disappears",
          "Replacing the need for college savings",
          "Creating a speculative cash-value strategy right away",
          "Reducing our homeowners premium"
        ],
        0,
        "For a family with dependents, term life usually addresses lost income and unfinished obligations. The right explanation keeps the focus on household resilience rather than product features alone."
      ),
      buildPrompt(
        "term-life",
        "family-affordability",
        "How do we know this helps instead of just taking money away from other goals?",
        [
          "Because low-cost coverage can protect the plan without overwhelming debt payoff, emergency reserves, and college funding",
          "Because insurance should always take priority over every other financial goal",
          "Because the most expensive policy is usually the safest recommendation",
          "Because once you own it, budgeting matters less"
        ],
        0,
        "A strong recommendation acknowledges tradeoffs and shows how protection can coexist with other goals. The best answer is not 'buy the most insurance,' but 'buy the right amount without damaging the rest of the plan.'"
      )
    ]
  },
  {
    clientId: "entrepreneur",
    insuranceId: "umbrella",
    title: "Sofia Reyes wants to know why liability coverage belongs in a wealth plan.",
    prompts: [
      buildPrompt(
        "umbrella",
        "entrepreneur-risk",
        "Why would this matter more now than before I sold my business?",
        [
          "Because your balance sheet is larger now, which means liability risk can threaten more accumulated capital",
          "Because umbrella coverage can replace your investment allocation",
          "Because it guarantees a better estate-tax outcome",
          "Because wealthy clients should automatically buy every coverage available"
        ],
        0,
        "As wealth grows, liability protection becomes more important because there is simply more capital exposed to a legal claim. The planning value is defensive and strategic, not magical."
      ),
      buildPrompt(
        "umbrella",
        "entrepreneur-fit",
        "How would you explain this without sounding like you're just cross-selling me?",
        [
          "By tying it to protecting the capital we are trying to deploy and preserve, not to production or fear tactics",
          "By saying all wealthy clients are required to buy it",
          "By comparing it to a high-growth alternative fund",
          "By avoiding any mention of how it fits the rest of the plan"
        ],
        0,
        "Clients respond better when the adviser explains how liability coverage protects the same assets the investment plan is trying to grow. The right conversation is integrated and needs-based."
      )
    ]
  },
  {
    clientId: "institutional",
    insuranceId: "umbrella",
    title: "Meridian Endowment Fund is questioning whether this recommendation is even relevant.",
    prompts: [
      buildPrompt(
        "umbrella",
        "institutional-fit",
        "Why are you bringing this up to an endowment account?",
        [
          "Because for this client it may not be a priority, and part of good advice is knowing when not to force a product",
          "Because every account type should own umbrella coverage",
          "Because insurance is easier than a governance discussion",
          "Because product penetration is part of fiduciary success"
        ],
        0,
        "This is a trickier client because insurance may not be the central issue. Sometimes the best advice is to acknowledge that a product is lower priority and keep the focus on governance, liquidity, and mandate fit."
      ),
      buildPrompt(
        "umbrella",
        "institutional-credibility",
        "So what makes this a credible recommendation, if at all?",
        [
          "Only if there is a real institutional liability exposure outside the investment sleeve; otherwise it should stay secondary to the core policy statement",
          "It is credible because all clients should be sold at least one insurance product",
          "It is credible because insurance replaces diversification",
          "It is credible because the endowment has a large account size"
        ],
        0,
        "For an institutional client, product recommendations should stay subordinate to actual mission, governance, and risk needs. This kind of conversation is as much about restraint as it is about technical knowledge."
      )
    ]
  }
];

export function getInsuranceDialogue(clientId: string, insuranceId: string) {
  const direct = INSURANCE_DIALOGUES.find((entry) => entry.clientId === clientId && entry.insuranceId === insuranceId);
  if (direct) {
    return direct;
  }

  const product = INSURANCE_PRODUCTS.find((entry) => entry.id === insuranceId);
  if (!product) {
    return null;
  }

  return {
    clientId,
    insuranceId,
    title: `${product.name} recommendation review`,
    prompts: [
      buildPrompt(
        insuranceId,
        "generic-need",
        "Why are you recommending this product in my plan?",
        [
          "Because it should address a specific planning risk that fits your goals and budget",
          "Because every client should buy the same protection package",
          "Because the policy is more important than your investment plan",
          "Because I need to increase insurance sales activity"
        ],
        0,
        "Insurance should be recommended to solve a real planning problem, not to fill a quota or replace thoughtful planning. The strongest answer ties the product to a specific household or balance-sheet risk."
      ),
      buildPrompt(
        insuranceId,
        "generic-fit",
        "How do I know this fits instead of just adding another bill?",
        [
          "It only fits if it protects an important risk without weakening the broader cash-flow and investment plan",
          "It fits because coverage is always better than saving",
          "It fits because the most expensive version is usually best",
          "It fits because insurance questions never depend on the client"
        ],
        0,
        "A good recommendation respects tradeoffs. The adviser should show that the coverage solves a meaningful problem and still leaves room for the rest of the plan to work."
      )
    ]
  };
}
