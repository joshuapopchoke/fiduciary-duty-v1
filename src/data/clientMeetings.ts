import type { PlayDifficulty, ClientMeetingKind, ClientMeetingState } from "../types/gameState";
import type { ClientAccount } from "../types/client";

type MeetingTemplate = Omit<ClientMeetingState, "resolved" | "selectedOptionId" | "feedback">;

const CLIENT_MEETING_BANK: Record<string, MeetingTemplate[]> = {
  retiree: [
    {
      clientId: "retiree",
      meetingId: "retiree-healthcare",
      title: "Healthcare Costs Rising",
      summary: "Margaret is worried that prescription and specialist costs are climbing faster than expected.",
      question: "How do you adjust the plan without pushing her into unnecessary risk?",
      options: [
        {
          id: "rebalance-income",
          label: "Increase reserve cash and shift toward steadier income assets",
          outcome: "Margaret feels heard because the plan now treats healthcare cash flow as a first-order need instead of chasing extra upside.",
          trustDelta: 7,
          expenseDelta: 450,
          reserveMonthsDelta: 2,
          liquidityNeed: "High"
        },
        {
          id: "push-growth",
          label: "Recommend higher-growth tech names to outpace medical inflation",
          outcome: "Margaret sees the answer as too speculative for her stage of life and loses confidence in the guidance.",
          trustDelta: -9,
          expenseDelta: 300
        },
        {
          id: "delay-action",
          label: "Tell her to wait a few months before adjusting anything",
          outcome: "Margaret appreciates the calm tone but still feels the plan is not reacting quickly enough to a real cost pressure.",
          trustDelta: -2,
          expenseDelta: 350
        }
      ]
    }
  ],
  young_pro: [
    {
      clientId: "young_pro",
      meetingId: "young-pro-home",
      title: "Considering a Home Purchase",
      summary: "Derek may buy a home within two years and wants to know how much to keep liquid.",
      question: "What is the best planning response?",
      options: [
        {
          id: "fund-down-payment",
          label: "Carve out a down-payment reserve and keep the growth sleeve invested separately",
          outcome: "Derek likes that the plan separates near-term housing cash from long-term compounding instead of gambling with both.",
          trustDelta: 8,
          debtPaymentDelta: 300,
          reserveMonthsDelta: 2,
          liquidityNeed: "High"
        },
        {
          id: "all-in-growth",
          label: "Keep everything aggressively invested until the purchase date is close",
          outcome: "Derek likes growth, but this answer underestimates the timing risk of needing a house down payment in a drawdown.",
          trustDelta: -6,
          liquidityNeed: "Moderate"
        },
        {
          id: "debt-first",
          label: "Pause investing entirely and pay every spare dollar toward future housing costs",
          outcome: "The answer feels too one-dimensional and ignores Derek's long horizon and appetite for controlled growth.",
          trustDelta: -1,
          reserveMonthsDelta: 1
        }
      ]
    }
  ],
  family: [
    {
      clientId: "family",
      meetingId: "family-refi",
      title: "Mortgage Refinance Question",
      summary: "The Kowalskis ask whether refinancing the mortgage would be smarter than investing the cash flow elsewhere.",
      question: "How should you frame the decision?",
      options: [
        {
          id: "compare-rate-and-horizon",
          label: "Compare the refinance rate savings, break-even period, and college-liquidity needs before choosing",
          outcome: "The family trusts the advice because it balances debt, education funding, and time horizon instead of forcing one answer.",
          trustDelta: 8,
          debtPaymentDelta: -350,
          reserveMonthsDelta: 1
        },
        {
          id: "always-refi",
          label: "Tell them refinancing is always the right move if a lower rate is available",
          outcome: "The family feels the answer is too simplistic because fees, timing, and cash-flow needs were ignored.",
          trustDelta: -5
        },
        {
          id: "ignore-refi",
          label: "Tell them to ignore the mortgage and just invest more aggressively",
          outcome: "The family hears this as dismissive of a major household decision and becomes less confident in the advice.",
          trustDelta: -8,
          liquidityNeed: "High"
        }
      ]
    }
  ],
  entrepreneur: [
    {
      clientId: "entrepreneur",
      meetingId: "entrepreneur-tax-bill",
      title: "Liquidity for Upcoming Tax Bill",
      summary: "Sofia wants to deploy capital quickly, but a large tax payment is coming from the business exit.",
      question: "How do you respond?",
      options: [
        {
          id: "tax-reserve",
          label: "Ring-fence a tax reserve first and invest the strategic excess separately",
          outcome: "Sofia sees this as disciplined and strategic because it protects the tax obligation without freezing the whole plan.",
          trustDelta: 8,
          reserveMonthsDelta: 2,
          liquidityNeed: "High"
        },
        {
          id: "invest-all",
          label: "Invest the full balance now and plan to raise cash later if needed",
          outcome: "Sofia hears unnecessary execution risk and becomes less comfortable with the plan.",
          trustDelta: -7,
          liquidityNeed: "High"
        },
        {
          id: "all-cash",
          label: "Keep everything in cash until every tax detail is finalized",
          outcome: "Sofia appreciates the caution but thinks the answer is too passive for a strategic exit-planning mandate.",
          trustDelta: -1
        }
      ]
    }
  ],
  institutional: [
    {
      clientId: "institutional",
      meetingId: "institutional-spending-rule",
      title: "Spending Rule Pressure",
      summary: "The endowment committee asks how to support next year's spending draw without undermining long-run purchasing power.",
      question: "What should you recommend?",
      options: [
        {
          id: "liquidity-sleeve",
          label: "Maintain a spending-support liquidity sleeve and preserve the long-horizon growth core",
          outcome: "The committee sees a prudent balance between current distribution needs and perpetual capital preservation.",
          trustDelta: 7,
          reserveMonthsDelta: 3,
          liquidityNeed: "Moderate"
        },
        {
          id: "sell-growth",
          label: "Meet the spending need by selling whichever assets rallied most recently",
          outcome: "The committee worries that this is reactive and not tied to policy discipline.",
          trustDelta: -5
        },
        {
          id: "higher-risk",
          label: "Take more risk to try to earn the spending need through extra return",
          outcome: "The committee sees this as a governance problem because it confuses spending policy with return chasing.",
          trustDelta: -9
        }
      ]
    }
  ]
};

const CLIENT_REVIEW_BANK: Record<string, MeetingTemplate> = {
  retiree: {
    clientId: "retiree",
    meetingId: "retiree-annual-review",
    meetingKind: "review",
    title: "Annual Retirement Income Review",
    summary: "Margaret wants to walk through withdrawals, Social Security support, and whether the current reserve bucket still fits her age and spending needs.",
    question: "How should the review be framed so the plan stays realistic and reassuring?",
    options: [
      {
        id: "review-income-buckets",
        label: "Review reserve buckets, income sources, and a modest equity sleeve together before changing anything major",
        outcome: "Margaret felt the review was calm, realistic, and tied directly to how her retirement cash flow actually works.",
        trustDelta: 8,
        reserveMonthsDelta: 1,
        liquidityNeed: "High"
      },
      {
        id: "review-chase-return",
        label: "Push harder into growth names because inflation means the account needs more upside immediately",
        outcome: "Margaret felt the review leaned too hard on return chasing and not enough on protecting a retirement-income plan.",
        trustDelta: -8,
        expenseDelta: 150
      },
      {
        id: "review-no-change",
        label: "Tell her everything is fine and skip a deeper review for now",
        outcome: "Margaret appreciated the reassurance, but the review felt too light for the planning questions she raised.",
        trustDelta: -2
      }
    ]
  },
  young_pro: {
    clientId: "young_pro",
    meetingId: "young-pro-annual-review",
    meetingKind: "review",
    title: "Accumulation Review Meeting",
    summary: "Derek wants an annual review that covers workplace benefits, concentrated growth risk, and whether the taxable account should still be this aggressive.",
    question: "What kind of review keeps the advice useful instead of generic?",
    options: [
      {
        id: "review-benefits-and-risk",
        label: "Tie the review to match capture, reserve needs, and concentration discipline before changing the growth sleeve",
        outcome: "Derek saw the review as practical because it linked growth decisions back to real planning priorities.",
        trustDelta: 7,
        reserveMonthsDelta: 1,
        liquidityNeed: "Moderate"
      },
      {
        id: "review-performance-only",
        label: "Make the whole review about the best-performing names and whether to add more to them",
        outcome: "Derek liked the energy, but the review felt shallow because it ignored the rest of the plan.",
        trustDelta: -5
      },
      {
        id: "review-delay",
        label: "Keep the review very short and push bigger planning questions to later",
        outcome: "Derek stayed engaged, but the review missed a chance to connect benefits and risk to the portfolio.",
        trustDelta: -1
      }
    ]
  },
  family: {
    clientId: "family",
    meetingId: "family-annual-review",
    meetingKind: "review",
    title: "Household Review Meeting",
    summary: "The Kowalskis want their annual review to cover tuition funding, the mortgage, insurance, and whether the current account mix still matches family priorities.",
    question: "What review structure gives them the best planning value?",
    options: [
      {
        id: "review-balance-household",
        label: "Review tuition, reserves, protection, and debt together before making new investment promises",
        outcome: "The family felt the review finally treated the whole household plan as one connected system.",
        trustDelta: 8,
        reserveMonthsDelta: 1,
        liquidityNeed: "High"
      },
      {
        id: "review-college-only",
        label: "Focus only on the 529 and ignore the mortgage, reserves, and insurance questions",
        outcome: "The family felt the review became too narrow for the real tradeoffs they are living with.",
        trustDelta: -6
      },
      {
        id: "review-market-opinion",
        label: "Spend most of the review talking about where the stock market might go next",
        outcome: "The family heard market commentary, but not enough about their actual planning decisions.",
        trustDelta: -4
      }
    ]
  },
  entrepreneur: {
    clientId: "entrepreneur",
    meetingId: "entrepreneur-annual-review",
    meetingKind: "review",
    title: "Private Wealth Strategy Review",
    summary: "Sofia wants a full strategy review covering tax reserves, trust structure, liquidity buckets, and whether the investment sleeves still match post-exit goals.",
    question: "How should the review be framed?",
    options: [
      {
        id: "review-liquidity-tax-estate",
        label: "Review taxes, liquidity, estate structure, and long-term deployment before adding complexity",
        outcome: "Sofia liked that the review stayed strategic and coordinated instead of turning into product clutter.",
        trustDelta: 8,
        reserveMonthsDelta: 1,
        liquidityNeed: "Moderate"
      },
      {
        id: "review-chase-opportunity",
        label: "Spend the review mostly on the next opportunistic trade ideas",
        outcome: "Sofia felt the review drifted away from the bigger tax and estate issues that actually matter.",
        trustDelta: -6
      },
      {
        id: "review-slow-walk",
        label: "Keep the review high-level and defer the hard decisions again",
        outcome: "The review felt polished but not decisive enough for a complex planning relationship.",
        trustDelta: -2
      }
    ]
  },
  institutional: {
    clientId: "institutional",
    meetingId: "institutional-annual-review",
    meetingKind: "review",
    title: "Committee Review Meeting",
    summary: "The committee wants a formal review of spending support, policy drift, liquidity, and whether recent performance is masking governance issues.",
    question: "What review style best fits the mandate?",
    options: [
      {
        id: "review-policy-and-spending",
        label: "Review spending support, policy drift, and governance before discussing return enhancements",
        outcome: "The committee saw the review as disciplined and consistent with fiduciary oversight.",
        trustDelta: 7,
        reserveMonthsDelta: 2,
        liquidityNeed: "Moderate"
      },
      {
        id: "review-performance-chasing",
        label: "Frame the review mostly around recent winners and what to add more of now",
        outcome: "The committee felt the review drifted away from process and toward performance chasing.",
        trustDelta: -8
      },
      {
        id: "review-minimal",
        label: "Keep the review light and avoid deeper spending-policy questions",
        outcome: "The committee wanted a more rigorous policy review than the meeting delivered.",
        trustDelta: -3
      }
    ]
  }
};

export function getClientMeetingScenario(client: ClientAccount, difficulty: PlayDifficulty, cycleNumber: number): ClientMeetingState {
  const bank = CLIENT_MEETING_BANK[client.id] ?? [];
  const fallback = bank[0];
  const index = bank.length > 1 ? cycleNumber % bank.length : 0;
  const base = bank[index] ?? fallback;

  const options = base.options.map((option) => ({
    ...option,
    trustDelta:
      difficulty === "senior" ? Math.round(option.trustDelta * 1.1) :
      difficulty === "advisor" ? option.trustDelta :
      difficulty === "associate" ? Math.round(option.trustDelta * 0.95) :
      difficulty === "trainee" ? Math.round(option.trustDelta * 0.9) :
      Math.round(option.trustDelta * 0.85)
  }));

  return {
    ...base,
    options,
    resolved: false,
    selectedOptionId: null,
    feedback: null
  };
}

export function getClientReviewMeetingScenario(
  client: ClientAccount,
  difficulty: PlayDifficulty,
  cycleNumber: number
): ClientMeetingState {
  const base = CLIENT_REVIEW_BANK[client.id] ?? CLIENT_MEETING_BANK[client.id]?.[0];
  const reviewKind: ClientMeetingKind = "review";

  if (!base) {
    return getClientMeetingScenario(client, difficulty, cycleNumber);
  }

  const options = base.options.map((option) => ({
    ...option,
    trustDelta:
      difficulty === "senior" ? Math.round(option.trustDelta * 1.1) :
      difficulty === "advisor" ? option.trustDelta :
      difficulty === "associate" ? Math.round(option.trustDelta * 0.95) :
      difficulty === "trainee" ? Math.round(option.trustDelta * 0.9) :
      Math.round(option.trustDelta * 0.85)
  }));

  return {
    ...base,
    meetingKind: reviewKind,
    options,
    resolved: false,
    selectedOptionId: null,
    feedback: null
  };
}
