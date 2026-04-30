import type { ClientAccount } from "../types/client";
import type { PlayDifficulty, RecommendationDialogueState } from "../types/gameState";

export interface RecommendationCard {
  id: string;
  title: string;
  summary: string;
  followUpTask: string;
}

function buildDialogue(
  client: ClientAccount,
  recommendationId: string,
  title: string,
  summary: string,
  clientQuestion: string,
  options: RecommendationDialogueState["options"]
): RecommendationDialogueState {
  return {
    clientId: client.id,
    recommendationId,
    title,
    summary,
    clientQuestion,
    options,
    resolved: false,
    selectedOptionId: null,
    accepted: null,
    feedback: null
  };
}

export function buildRecommendationCards(client: ClientAccount): RecommendationCard[] {
  switch (client.id) {
    case "retiree":
      return [
        {
          id: "social-security-timing",
          title: "Review Social Security timing",
          summary: "Walk through how earlier versus later claiming changes guaranteed income and portfolio withdrawal pressure.",
          followUpTask: "Compare filing-age tradeoffs against the reserve and withdrawal plan."
        },
        {
          id: "income-balance",
          title: "Stabilize the income sleeve",
          summary: "Shift the retiree toward a steadier bond-and-income mix instead of letting the equity sleeve do all the work.",
          followUpTask: "Review income ladder and reserve coverage."
        },
        {
          id: "roth-flexibility",
          title: "Preserve Roth flexibility",
          summary: "Keep the Roth sleeve positioned as longer-term flexibility capital rather than the main monthly-spending bucket.",
          followUpTask: "Confirm the taxable reserve can cover near-term distributions."
        }
      ];
    case "young_pro":
      return [
        {
          id: "match-first",
          title: "Capture the 401(k) match first",
          summary: "Route more of the growth plan through workplace benefits before stretching taxable risk.",
          followUpTask: "Verify match capture and contribution pacing."
        },
        {
          id: "concentration-control",
          title: "Control concentration risk",
          summary: "Keep large single-name growth exposure from becoming the whole story of the account.",
          followUpTask: "Set a concentration guardrail for growth names."
        }
      ];
    case "family":
      return [
        {
          id: "family-balance",
          title: "Balance education and retirement goals",
          summary: "Build the 529 plan without stripping the household reserve or retirement savings.",
          followUpTask: "Set monthly education and reserve targets."
        },
        {
          id: "insurance-foundation",
          title: "Strengthen the family protection layer",
          summary: "Pair investment growth with insurance and reserve planning that can actually protect the household plan.",
          followUpTask: "Revisit life and disability coverage needs."
        }
      ];
    case "entrepreneur":
      return [
        {
          id: "liquidity-discipline",
          title: "Separate liquidity from growth capital",
          summary: "Keep business-sale or operating liquidity from being confused with long-term investment assets.",
          followUpTask: "Review reserve, trust, and long-term sleeve roles."
        },
        {
          id: "estate-coordination",
          title: "Coordinate the trust and taxable sleeves",
          summary: "Align the account structure with the estate plan before adding more complexity.",
          followUpTask: "Schedule trust and titling follow-up."
        }
      ];
    case "institutional":
      return [
        {
          id: "spending-support",
          title: "Protect the spending support sleeve",
          summary: "Keep the operating and spending-support pools stable before chasing return with the long-term pool.",
          followUpTask: "Recheck liquidity and spending policy."
        },
        {
          id: "policy-discipline",
          title: "Use policy first, performance second",
          summary: "Frame new investments through the IPS and reserve structure instead of one-year returns.",
          followUpTask: "Document policy-based allocation rationale."
        }
      ];
    default:
      return [];
  }
}

export function getRecommendationDialogue(
  client: ClientAccount,
  recommendationId: string,
  difficulty: PlayDifficulty
): RecommendationDialogueState | null {
  const advanced = difficulty === "advisor" || difficulty === "senior";

  switch (recommendationId) {
    case "social-security-timing":
      return buildDialogue(
        client,
        recommendationId,
        "Social Security timing recommendation",
        "You are recommending a Social Security timing review so the client can see how guaranteed income changes the withdrawal burden on the portfolio.",
        advanced
          ? "If I can afford to wait, why does the exact claiming date still matter to the investment plan?"
          : "Why does when I claim Social Security matter so much?",
        [
          {
            id: "good",
            label: "Because each claiming age changes how much guaranteed income the portfolio has to replace, which affects withdrawal pressure and flexibility later.",
            outcome: "The client understood that claiming is not just a benefits decision; it changes the whole income plan.",
            trustDelta: 6,
            followUpTask: "Document the claiming-age comparison and how it changes withdrawal pressure.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because waiting usually gives a higher check, so it is often the safer choice.",
            outcome: "The client heard the point, but wanted a clearer explanation of how the portfolio fits into the decision.",
            trustDelta: 1,
            followUpTask: "Clarify guaranteed-income tradeoffs versus liquidity needs.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because claiming early is generally the wrong choice for retirees.",
            outcome: "The client felt the answer was too absolute and not tailored to the actual plan.",
            trustDelta: -4,
            followUpTask: "Repair trust with a client-specific income-planning explanation.",
            accepted: false
          }
        ]
      );
    case "income-balance":
      return buildDialogue(
        client,
        recommendationId,
        "Income sleeve recommendation",
        "You are recommending a steadier income-and-reserve posture for the retiree account.",
        advanced
          ? "Why should I give up some upside if the stock market still looks healthy?"
          : "Why not just leave more of this in stocks?",
        [
          {
            id: "good",
            label: "Because your plan depends on reliable withdrawals, so the account needs more stability than a growth-only mix can usually deliver.",
            outcome: "The client understood that the recommendation was about funding the plan, not chasing less return.",
            trustDelta: 6,
            followUpTask: "Document the income and drawdown rationale.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because bonds are safer, and safer is usually better for retirees.",
            outcome: "The client partially understood the recommendation, but the explanation felt too generic.",
            trustDelta: 1,
            followUpTask: "Clarify the reserve and spending rationale in the next review.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because stocks are speculative and should mostly be avoided entirely.",
            outcome: "The client felt the advice was too absolute and not especially thoughtful.",
            trustDelta: -4,
            followUpTask: "Repair trust and explain that appropriate equity still has a role in the plan.",
            accepted: false
          }
        ]
      );
    case "match-first":
      return buildDialogue(
        client,
        recommendationId,
        "Workplace-benefit recommendation",
        "You are recommending that the client capture the employer match before leaning harder into taxable investing.",
        "Why should I lock up more money in the 401(k) when I could just buy what I want in taxable?",
        [
          {
            id: "good",
            label: "Because the employer match is an immediate return, and capturing it first usually improves the whole accumulation plan.",
            outcome: "The client understood why the match changes the planning order.",
            trustDelta: 6,
            followUpTask: "Document the benefit-priority recommendation.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because retirement accounts are always better than taxable accounts.",
            outcome: "The client heard the point, but the explanation ignored liquidity and flexibility tradeoffs.",
            trustDelta: 1,
            followUpTask: "Clarify the tradeoff between match capture and taxable flexibility.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because taxable investing is not really appropriate until later.",
            outcome: "The client felt the advice was too rigid for a growth-oriented plan.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more balanced explanation of account roles.",
            accepted: false
          }
        ]
      );
    case "concentration-control":
      return buildDialogue(
        client,
        recommendationId,
        "Concentration-control recommendation",
        "You are recommending that the client keep growth names from becoming an outsized percentage of the whole account.",
        "If I like the company and it keeps performing, why should I trim it at all?",
        [
          {
            id: "good",
            label: "Because a good company can still become too much of the plan if one position starts controlling the whole outcome.",
            outcome: "The client understood that concentration risk is different from disliking the company itself.",
            trustDelta: 6,
            followUpTask: "Document the concentration limit and trim discipline.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because diversification is generally a smart investing habit.",
            outcome: "The client understood the idea, but wanted a more concrete reason tied to the account.",
            trustDelta: 1,
            followUpTask: "Follow up with a more specific concentration explanation.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because large positions are usually speculative by definition.",
            outcome: "The client felt the recommendation overstated the issue and trust slipped.",
            trustDelta: -4,
            followUpTask: "Repair trust by distinguishing concentration risk from speculation.",
            accepted: false
          }
        ]
      );
    case "family-balance":
      return buildDialogue(
        client,
        recommendationId,
        "Family planning recommendation",
        "You are recommending a balance between education funding, reserves, and retirement savings.",
        "If college matters so much, why not just pour everything into the 529 now?",
        [
          {
            id: "good",
            label: "Because the education goal matters, but the household still needs reserve protection and retirement progress at the same time.",
            outcome: "The family accepted the recommendation because it felt balanced and realistic.",
            trustDelta: 6,
            followUpTask: "Document the balance between education, reserve, and retirement goals.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because diversifying goals is usually a good idea.",
            outcome: "The family understood part of the message, but it was still too vague.",
            trustDelta: 1,
            followUpTask: "Add more concrete household cash-flow reasoning in the follow-up.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because retirement is always more important than education.",
            outcome: "The family felt the advice missed the emotional and practical reality of the goal.",
            trustDelta: -4,
            followUpTask: "Repair trust by reframing the advice around household tradeoffs instead of absolutes.",
            accepted: false
          }
        ]
      );
    case "insurance-foundation":
      return buildDialogue(
        client,
        recommendationId,
        "Protection-first recommendation",
        "You are recommending that the family pair investment growth with appropriate protection planning.",
        "Why should we spend money on protection products when we could just invest more instead?",
        [
          {
            id: "good",
            label: "Because the growth plan only works if the household can absorb a disability, death, or liability shock without derailing everything else.",
            outcome: "The family accepted that protection planning supports the investment plan instead of competing with it.",
            trustDelta: 6,
            followUpTask: "Document the protection gap and household-risk rationale.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because most families should probably have more insurance than they think.",
            outcome: "The family saw the point, but the explanation felt a little too generic.",
            trustDelta: 1,
            followUpTask: "Clarify the specific family planning risk being addressed.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because insurance products are just part of a complete financial plan.",
            outcome: "The family felt the answer sounded more like a sales line than advice.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more client-specific protection explanation.",
            accepted: false
          }
        ]
      );
    case "liquidity-discipline":
      return buildDialogue(
        client,
        recommendationId,
        "Liquidity-structure recommendation",
        "You are recommending that the client separate operating liquidity from long-term growth capital.",
        "Why can’t we just keep this all in one big account if the money is still ours?",
        [
          {
            id: "good",
            label: "Because the liquidity sleeve and the long-term sleeve do different jobs, and mixing them usually makes both decisions worse.",
            outcome: "The client understood why separating liquidity from growth capital improves both planning and investment discipline.",
            trustDelta: 6,
            followUpTask: "Document the reserve-versus-growth sleeve rationale.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because it is usually cleaner to split accounts when things get more complicated.",
            outcome: "The client understood the direction, but the explanation still felt too general.",
            trustDelta: 1,
            followUpTask: "Clarify the operational and planning advantages of sleeve separation.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because large accounts should usually be spread around as much as possible.",
            outcome: "The client felt the explanation was broad but not especially thoughtful.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more precise explanation of liquidity discipline.",
            accepted: false
          }
        ]
      );
    case "estate-coordination":
      return buildDialogue(
        client,
        recommendationId,
        "Estate-coordination recommendation",
        "You are recommending better coordination between taxable assets, trust structure, and estate implementation.",
        "Why does it matter which sleeve or title these assets sit in if the beneficiaries already know what we want?",
        [
          {
            id: "good",
            label: "Because titling, trust structure, and beneficiary alignment are what make the estate plan actually work instead of just sounding right on paper.",
            outcome: "The client understood why account structure matters to estate execution, not just legal intent.",
            trustDelta: 6,
            followUpTask: "Document the titling and estate-coordination recommendation.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because better coordination usually makes things cleaner later on.",
            outcome: "The client agreed in principle, but the recommendation still felt a little abstract.",
            trustDelta: 1,
            followUpTask: "Clarify the practical estate consequences of misaligned titling.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because trust sleeves are generally more appropriate once an account gets large enough.",
            outcome: "The client felt the recommendation was too broad and not specific enough to the actual plan.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more concrete estate-execution explanation.",
            accepted: false
          }
        ]
      );
    case "spending-support":
      return buildDialogue(
        client,
        recommendationId,
        "Spending support recommendation",
        "You are recommending that the institution protect the spending-support sleeve before stretching for more return.",
        "Why shouldn’t we just lean harder into return if the markets look favorable?",
        [
          {
            id: "good",
            label: "Because the institution still has near-term spending obligations, and those should not depend on a risky return forecast.",
            outcome: "The institution accepted the recommendation because it tied return expectations back to spending-policy discipline.",
            trustDelta: 6,
            followUpTask: "Document the spending-support and liquidity rationale.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because safer sleeves should usually stay safer.",
            outcome: "The institution heard the point, but the explanation could have been more policy-driven.",
            trustDelta: 1,
            followUpTask: "Reframe the answer through the spending policy and reserve structure.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because long-term pools should not really be used until the markets settle down.",
            outcome: "The institution felt the recommendation was too reactive and not especially policy-based.",
            trustDelta: -4,
            followUpTask: "Repair trust with a clearer policy-first explanation.",
            accepted: false
          }
        ]
      );
    case "policy-discipline":
      return buildDialogue(
        client,
        recommendationId,
        "Policy-discipline recommendation",
        "You are recommending that new investments be framed through policy and mandate, not just recent performance.",
        "Why shouldn’t we just put more money into what is working if performance is strong?",
        [
          {
            id: "good",
            label: "Because the policy exists to protect the institution from making emotional allocation decisions based only on recent returns.",
            outcome: "The institution accepted the recommendation because it felt grounded in governance rather than opinion.",
            trustDelta: 6,
            followUpTask: "Document the policy-first rationale for allocation discipline.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because chasing performance can backfire if the cycle turns.",
            outcome: "The institution understood the warning, but the answer could have been more policy-specific.",
            trustDelta: 1,
            followUpTask: "Tie the recommendation back to the IPS and spending-support mandate.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because strong recent performance usually means the position is already too expensive.",
            outcome: "The institution felt the answer relied too much on market opinion instead of governance logic.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more mandate-driven explanation.",
            accepted: false
          }
        ]
      );
    case "roth-flexibility":
      return buildDialogue(
        client,
        recommendationId,
        "Roth flexibility recommendation",
        "You are recommending that the Roth sleeve stay positioned as longer-term flexibility capital.",
        "Why not spend from the Roth first if it is the easiest account to access cleanly later?",
        [
          {
            id: "good",
            label: "Because preserving the Roth sleeve can give the plan more flexibility later, especially if taxable and traditional IRA withdrawals can cover current needs first.",
            outcome: "The client understood why Roth flexibility can matter later in retirement.",
            trustDelta: 6,
            followUpTask: "Document the withdrawal-order and Roth-preservation rationale.",
            accepted: true
          },
          {
            id: "middle",
            label: "Because retirement accounts should generally stay untouched as long as possible.",
            outcome: "The client heard the idea, but the answer was broader than needed.",
            trustDelta: 1,
            followUpTask: "Clarify why this specific Roth sleeve matters to future flexibility.",
            accepted: false
          },
          {
            id: "bad",
            label: "Because Roth assets are always the best assets and should almost never be used.",
            outcome: "The client felt the answer sounded absolute instead of planning-based.",
            trustDelta: -4,
            followUpTask: "Repair trust with a more balanced withdrawal-order explanation.",
            accepted: false
          }
        ]
      );
    default:
      return null;
  }
}
