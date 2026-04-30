import type { PlayDifficulty } from "../types/gameState";
import type { Question } from "../types/question";

const QUESTION_POINTS: Record<PlayDifficulty, number> = {
  learner: 12,
  trainee: 14,
  associate: 18,
  advisor: 22,
  senior: 26
};

const QUESTION_COOLDOWNS: Record<PlayDifficulty, number> = {
  learner: 14,
  trainee: 14,
  associate: 12,
  advisor: 10,
  senior: 10
};

function makePlanningQuestion(
  topicTag: string,
  difficulty: PlayDifficulty,
  domain: string,
  question: string,
  options: string[],
  correct: number,
  explanation: string
): Question {
  return {
    exam: "Planning",
    domain,
    difficulty,
    cooldown: QUESTION_COOLDOWNS[difficulty],
    topicTag,
    question,
    options,
    correct,
    explanation,
    points: QUESTION_POINTS[difficulty]
  };
}

export const PLANNING_QUESTIONS: Question[] = [
  makePlanningQuestion(
    "planning-all-emergency-fund-learner",
    "learner",
    "Cash Flow Planning",
    "Before a household begins investing aggressively, what is usually the most practical first planning step?",
    [
      "Build an emergency reserve that can cover near-term surprises",
      "Move every spare dollar into equities immediately",
      "Close all savings accounts and rely on credit cards",
      "Use retirement assets as the primary emergency fund"
    ],
    0,
    "An emergency fund helps a client handle job loss, repairs, or medical costs without blowing up the long-term investment plan. It creates planning stability and reduces the chance that good investments must be sold at the wrong time."
  ),
  makePlanningQuestion(
    "planning-retiree-ltc-learner",
    "learner",
    "Insurance and Risk Planning",
    "A retiree asks why long-term care planning matters. What is the best high-level answer?",
    [
      "It can help reduce the risk that later-life care costs consume portfolio assets",
      "It guarantees market-beating investment returns",
      "It replaces Social Security benefits",
      "It makes every retirement withdrawal tax-free"
    ],
    0,
    "Long-term care expenses can become a major draw on retirement assets if they are not planned for ahead of time. Coverage is not right for every client, but the planning conversation matters because the risk can be financially disruptive."
  ),
  makePlanningQuestion(
    "planning-family-term-life-learner",
    "learner",
    "Insurance and Risk Planning",
    "For a family with children and a mortgage, which insurance conversation is often especially important?",
    [
      "Term life insurance to protect income and household obligations",
      "A speculative variable annuity for daily liquidity",
      "Only collision insurance on one car",
      "A short-term trading account instead of any insurance"
    ],
    0,
    "Families that depend on earned income often need to consider what happens if one breadwinner dies prematurely. Term life coverage can help protect the mortgage, education goals, and day-to-day cash flow without overcomplicating the plan."
  ),
  makePlanningQuestion(
    "planning-young-pro-disability-learner",
    "learner",
    "Insurance and Risk Planning",
    "A young professional says, 'I have no dependents, so I don't need insurance.' Which response is usually most appropriate?",
    [
      "Disability insurance may still matter because future earnings power can be the biggest asset",
      "Insurance never matters until retirement",
      "Only whole life insurance is relevant in that situation",
      "The client should borrow more instead of insuring risk"
    ],
    0,
    "For many working clients, future income is one of the most important economic assets they have. Disability coverage can protect the ability to save and invest if an illness or injury interrupts earnings."
  ),
  makePlanningQuestion(
    "planning-family-refi-trainee",
    "trainee",
    "Housing and Debt",
    "A homeowner asks whether refinancing a mortgage can help. Which factor is most important to review first?",
    [
      "Whether the monthly savings outweigh the closing costs over the expected holding period",
      "Whether a refinance always raises the home's resale value",
      "Whether mortgage refinancing eliminates all future interest",
      "Whether the new lender also sells the client's mutual funds"
    ],
    0,
    "Refinancing is usually an economic tradeoff, not an automatic win. The adviser should compare the new payment and interest profile against the fees and the amount of time the client expects to keep the loan."
  ),
  makePlanningQuestion(
    "planning-entrepreneur-liability-trainee",
    "trainee",
    "Insurance and Risk Planning",
    "A recently wealthy entrepreneur has rising assets, real estate, and teenage drivers in the household. What planning item often deserves attention?",
    [
      "Umbrella liability coverage",
      "Higher concentration in one speculative stock",
      "Eliminating all property insurance",
      "Ignoring liability because the investment account is diversified"
    ],
    0,
    "As net worth grows, liability exposure can become a more serious threat to accumulated capital. Umbrella coverage can add another layer of protection above existing auto and homeowners policies."
  ),
  makePlanningQuestion(
    "planning-all-debt-paydown-associate",
    "associate",
    "Debt and Investing Tradeoffs",
    "A client with 22% credit-card debt asks whether to keep investing instead of paying the card down. Which answer is usually strongest?",
    [
      "High-interest revolving debt often deserves priority because the guaranteed interest savings are hard to beat after tax and risk",
      "Always ignore debt and invest every extra dollar",
      "Refinance the card into a margin loan and keep trading",
      "Buy only growth stocks because they eventually beat debt costs"
    ],
    0,
    "Very high-interest debt can act like a negative return that compounds against the household. In many cases, paying it down improves the client's financial resilience and frees future cash flow for investing."
  ),
  makePlanningQuestion(
    "planning-family-mortgage-associate",
    "associate",
    "Housing and Debt",
    "A family asks whether extra mortgage payments or additional investing should come first. Which framing is most appropriate?",
    [
      "Compare mortgage rate, liquidity needs, tax context, and the household's other goals before choosing a split or priority",
      "Always pay off the mortgage immediately regardless of the rate",
      "Always invest and never reduce debt",
      "Choose whichever option sounds more emotional to the client"
    ],
    0,
    "Mortgage prepayment versus investing is usually a planning tradeoff rather than a universal rule. The rate on the mortgage, emergency reserve, tax picture, time horizon, and stress tolerance all matter."
  ),
  makePlanningQuestion(
    "planning-retiree-annuity-advisor",
    "advisor",
    "Retirement Income Planning",
    "A retiree asks whether an annuity should replace the bond sleeve entirely. Which answer is best?",
    [
      "An annuity can solve part of the income problem, but it should be evaluated alongside liquidity needs, fees, surrender terms, and the rest of the income plan",
      "Yes, annuities should always replace every bond holding",
      "No, annuities can never be used in retirement planning",
      "Only buy the annuity if the commission is high enough to justify the paperwork"
    ],
    0,
    "Annuities can be useful in some retirement income plans, but they are not automatic substitutes for a diversified fixed-income allocation. The adviser needs to evaluate liquidity, insurer strength, payout structure, cost, and the client's broader objectives."
  ),
  makePlanningQuestion(
    "planning-retiree-social-security-advisor",
    "advisor",
    "Retirement Income Planning",
    "A retired client asks why Social Security timing still matters in the broader income plan. Which response is best?",
    [
      "Because claim timing affects how much guaranteed income the portfolio must replace over time",
      "Because claiming later guarantees the client will never need bonds",
      "Because Social Security automatically removes all tax planning",
      "Because timing only matters for clients with margin accounts"
    ],
    0,
    "Social Security is one of the few sources of lifetime income many retirees have, so the timing decision changes how much stress the portfolio must absorb. A stronger guaranteed-income base can reduce pressure on withdrawals, though the answer is still client-specific."
  ),
  makePlanningQuestion(
    "planning-retiree-rmd-advisor",
    "advisor",
    "Retirement Distribution Planning",
    "A retired client says required minimum distributions are irrelevant because they do not need the cash. Which response is best?",
    [
      "RMDs can still matter because they may force taxable distributions and change cash-flow and asset-location decisions",
      "RMDs can be ignored whenever the market is strong",
      "RMDs apply only to taxable brokerage accounts",
      "RMDs automatically reduce the need for beneficiary reviews"
    ],
    0,
    "RMD rules can affect taxes, cash management, and the way income-heavy assets are positioned across accounts. Even if the client does not need the cash for spending, the distribution still has planning consequences that an adviser should address."
  ),
  makePlanningQuestion(
    "planning-retiree-roth-senior",
    "senior",
    "Retirement Distribution Planning",
    "A client nearing retirement asks why a Roth conversion discussion might come up in a low-income year. Which answer is strongest?",
    [
      "Because filling lower tax brackets strategically can reduce future tax pressure on retirement distributions",
      "Because Roth conversions guarantee better stock returns",
      "Because conversions eliminate the need for estate planning",
      "Because conversions should always be done with borrowed money"
    ],
    0,
    "Roth conversion analysis is fundamentally a tax-bracket management question. In some years, accelerating income deliberately can reduce future distribution drag, but it still needs to be weighed against liquidity, Medicare effects, and the broader plan."
  ),
  makePlanningQuestion(
    "planning-entrepreneur-disability-advisor",
    "advisor",
    "Insurance and Risk Planning",
    "A self-employed client says disability insurance is unnecessary because the business can keep running without them. What is the best planning response?",
    [
      "Review how much of the firm's cash flow depends on the client's own production, relationships, or decision-making before dismissing the risk",
      "Agree immediately because business owners never need disability coverage",
      "Replace disability planning with a volatile options strategy",
      "Focus only on estate taxes and ignore the income problem"
    ],
    0,
    "Business ownership does not eliminate disability risk; in some cases it increases it because the owner is central to revenue and operations. A needs analysis should test how the firm and the household would function if the client could not work."
  ),
  makePlanningQuestion(
    "planning-family-whole-life-advisor",
    "advisor",
    "Insurance and Risk Planning",
    "A young family with tight cash flow is pitched a large whole life policy instead of low-cost term coverage. What concern should an adviser review most carefully?",
    [
      "Whether the premium burden could crowd out the family's emergency reserve, debt reduction, and core savings plan",
      "Whether the policy has a glossy brochure",
      "Whether the surrender charge is emotionally reassuring",
      "Whether the policy is more complicated than a checking account"
    ],
    0,
    "Permanent insurance can be useful in the right cases, but it is not automatically best for every young family. The adviser should test whether the premium load harms the family's broader financial plan and whether the use case truly justifies the structure."
  ),
  makePlanningQuestion(
    "planning-institutional-liquidity-senior",
    "senior",
    "Cash Flow Planning",
    "An endowment client wants more illiquid alternatives while also funding a steady spending rule. Which planning concern is most immediate?",
    [
      "Whether the liquidity profile still supports spending needs and rebalancing under stress",
      "Whether alternatives always outperform public markets",
      "Whether illiquid assets remove the need for cash management",
      "Whether spending policies can be ignored during strong years"
    ],
    0,
    "Institutional planning has to consider both return objectives and ongoing liquidity obligations. If too much capital is locked up, the client may be forced into poor decisions when spending needs or rebalancing pressures arrive."
  ),
  makePlanningQuestion(
    "planning-all-cashout-refi-senior",
    "senior",
    "Housing and Debt",
    "A client proposes a cash-out refinance to invest the proceeds aggressively. Which adviser response is strongest?",
    [
      "Stress-test the leverage, rate, cash-flow burden, and downside scenario before treating the trade as an investing opportunity",
      "Encourage the idea because leverage always improves wealth outcomes",
      "Ignore the mortgage terms and focus only on expected stock returns",
      "Assume refinancing risk disappears if the client is optimistic"
    ],
    0,
    "Borrowing against a home to invest adds leverage to both the household balance sheet and the portfolio decision. A prudent adviser should evaluate payment flexibility, rate risk, downside tolerance, and what happens if markets fall soon after closing."
  ),
  makePlanningQuestion(
    "planning-retiree-estate-senior",
    "senior",
    "Insurance and Risk Planning",
    "A high-net-worth retiree asks whether permanent life insurance still belongs in the plan. Which answer is best?",
    [
      "It may fit if there is a real estate-liquidity, legacy, or tax-driven objective, but the adviser should compare that use case against cost, liquidity, and alternative structures",
      "Permanent insurance should always be sold to wealthy clients",
      "Insurance is never relevant after retirement",
      "The client should buy it only to raise the book's production numbers"
    ],
    0,
    "Permanent insurance can be appropriate in estate or legacy planning, but only when there is a defined need that the policy solves efficiently. The adviser should test whether the funding burden, liquidity tradeoff, and estate objective justify the recommendation."
  ),
  makePlanningQuestion(
    "planning-young-pro-401k-match-trainee",
    "trainee",
    "Employer Benefits Planning",
    "A working client is investing in a taxable account but has not captured the full 401(k) match. Which answer is usually strongest?",
    [
      "Review whether capturing the full match should come first because it can be a high-value workplace benefit",
      "Ignore the match because taxable investing is always better",
      "Skip the employer plan and use margin to catch up",
      "Assume the match does not matter unless the market is bearish"
    ],
    0,
    "An employer match is often one of the most attractive low-friction planning opportunities available to a working client. It should not automatically override every other priority, but it usually deserves attention before reaching for less efficient options."
  ),
  makePlanningQuestion(
    "planning-family-hsa-associate",
    "associate",
    "Employer Benefits Planning",
    "A family is eligible for an HSA and asks why it matters. What is the best answer?",
    [
      "It can support current medical costs and also provide tax-advantaged long-term planning flexibility if used carefully",
      "It replaces life insurance for the whole household",
      "It guarantees higher returns than every mutual fund",
      "It should only be used after retirement begins"
    ],
    0,
    "An HSA can be useful because it may combine tax benefits with healthcare flexibility, especially for families managing ongoing expenses. It is not a universal solution, but it can become an efficient part of the broader plan when coordinated with cash flow and investment choices."
  ),
  makePlanningQuestion(
    "planning-family-529-associate",
    "associate",
    "Education Planning",
    "A family wants to start saving for children’s college costs. Which framing is usually strongest?",
    [
      "Match the funding vehicle and investment risk to the tuition timeline instead of treating education savings exactly like retirement money",
      "Put all education savings into the most aggressive sector fund available regardless of timing",
      "Use only checking accounts because investment risk is never acceptable for education goals",
      "Ignore education planning until the first tuition bill arrives"
    ],
    0,
    "Education planning is often time-segmented because the money may be needed much sooner than retirement assets. The adviser should consider the time horizon, tax vehicle, and the family’s broader liquidity needs together."
  ),
  makePlanningQuestion(
    "planning-family-529-senior",
    "senior",
    "Education Planning",
    "A household is underfunding retirement but wants to front-load every extra dollar into college savings. What is the best adviser response?",
    [
      "Balance the education goal against retirement security, tax benefits, cash-flow flexibility, and the fact that retirement usually cannot be financed with loans",
      "Always prioritize college funding over retirement regardless of the household balance sheet",
      "Stop all college saving and speculate in options instead",
      "Treat retirement and college risk exactly the same because both are long term"
    ],
    0,
    "Families often need to balance multiple important goals rather than maximize one in isolation. Education funding matters, but retirement security and emergency resilience can be just as important because there are fewer fallback options later in life."
  ),
  makePlanningQuestion(
    "planning-family-estate-associate",
    "associate",
    "Estate Planning Basics",
    "A couple with young children asks why estate documents matter even though their net worth is not huge. Which answer is best?",
    [
      "Because guardianship, decision-making authority, and beneficiary coordination can matter even before a family becomes wealthy",
      "Because trusts only matter after the family owns commercial real estate",
      "Because estate planning begins only after age 65",
      "Because insurance makes legal documents unnecessary"
    ],
    0,
    "Estate planning is not only about taxes or very high net worth. For younger families, wills, guardianship planning, and powers of attorney can be essential because they determine who can act and care for children if something goes wrong."
  ),
  makePlanningQuestion(
    "planning-entrepreneur-estate-senior",
    "senior",
    "Estate Planning Basics",
    "A business owner after a liquidity event says estate planning can wait because the investment portfolio is already diversified. What is the best response?",
    [
      "Diversification does not solve titling, control, beneficiary, or estate-liquidity issues, so the legal and transfer structure still matters",
      "A diversified portfolio automatically replaces a will and trust review",
      "Estate planning only matters if the client buys permanent insurance immediately",
      "The client should focus only on quarterly performance and ignore transfer planning"
    ],
    0,
    "Investment diversification can help manage market risk, but it does not address who controls assets, how they transfer, or whether liquidity is available for the estate plan. After a liquidity event, those structural decisions often become more important, not less."
  ),
  makePlanningQuestion(
    "planning-retiree-social-security-timing-senior",
    "senior",
    "Retirement Distribution Planning",
    "A retiree asks whether claiming Social Security later can still matter if the portfolio is already large. Which answer is strongest?",
    [
      "Yes, because a higher guaranteed-income floor can reduce portfolio withdrawal pressure and improve flexibility later in retirement",
      "No, because Social Security timing stops mattering once a client has invested assets",
      "Only bond investors should care about Social Security timing",
      "Claim timing matters only if the client plans to use margin"
    ],
    0,
    "Social Security timing is fundamentally a guaranteed-income decision, not just a portfolio-size question. Even affluent clients may benefit from understanding how a larger lifetime income base changes withdrawal pressure, survivor protection, and overall retirement flexibility."
  ),
  makePlanningQuestion(
    "planning-entrepreneur-roth-conversion-senior",
    "senior",
    "Tax Planning",
    "A client has a lower-income year after a business sale and asks why Roth conversions are being discussed. What is the best explanation?",
    [
      "A lower bracket year may create room to recognize income strategically now and reduce future distribution drag later",
      "Roth conversions guarantee the account will outperform the market",
      "Roth conversions eliminate all estate planning needs immediately",
      "Roth conversions should only be considered when interest rates fall"
    ],
    0,
    "Roth conversion analysis is mainly about managing tax brackets across time. If income is temporarily lower, the client may have an opportunity to shift future taxable distributions into a more favorable long-term framework, though liquidity and Medicare effects still matter."
  ),
  makePlanningQuestion(
    "planning-young-pro-rsu-associate",
    "associate",
    "Employer Benefits Planning",
    "A client receives RSUs from an employer and asks why the adviser keeps mentioning concentration risk. Which answer is best?",
    [
      "Because a career and a growing investment stake in the same company can create double exposure to one source of risk",
      "Because RSUs are never allowed in a financial plan",
      "Because concentration only matters after retirement",
      "Because employer stock automatically replaces emergency savings"
    ],
    0,
    "Employer stock can become especially risky when the client's paycheck and portfolio both depend on the same company. The concern is not that the company is always bad, but that too much combined exposure can undermine diversification and planning resilience."
  ),
  makePlanningQuestion(
    "planning-family-daf-advisor",
    "advisor",
    "Tax Planning",
    "A high-income family wants to make a large charitable gift after a strong market year. Why might a donor-advised fund discussion come up?",
    [
      "Because it can help coordinate charitable intent with timing, appreciated assets, and tax planning",
      "Because it replaces the need for every other estate-planning decision",
      "Because it guarantees higher portfolio returns next year",
      "Because charitable planning matters only for institutions"
    ],
    0,
    "Charitable planning can intersect with taxes, appreciated securities, and family legacy goals. A donor-advised fund is not right in every case, but it may be a useful structure when the client wants flexibility and tax-aware gifting coordination."
  ),
  makePlanningQuestion(
    "planning-family-account-location-advisor",
    "advisor",
    "Tax Planning",
    "A client asks what 'asset location' means. Which explanation is strongest?",
    [
      "It means thinking about which assets belong in taxable versus tax-advantaged accounts to improve after-tax results",
      "It means choosing which branch office is closest to the client",
      "It means moving all growth assets into cash",
      "It means replacing diversification with tax-free municipal bonds"
    ],
    0,
    "Asset location is about placing different asset types in the most suitable account wrappers when possible. It does not change the investment thesis itself, but it can improve how much of the return the client keeps after taxes."
  )
];

export function getPlanningQuestionsForClient(clientId: string, difficulty: PlayDifficulty) {
  return PLANNING_QUESTIONS.filter((question) => {
    const tag = question.topicTag.toLowerCase();
    return question.difficulty === difficulty && (tag.includes("planning-all") || tag.includes(clientId));
  });
}
