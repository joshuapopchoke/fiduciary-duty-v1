import type { Question } from "../../types/question";

// ─── Insurance Planning Question Bank ────────────────────────────────────────
// All questions verified against: IRC §7702 (life insurance definition),
// IRC §7702A (MEC rules), IRC §7702B (LTC), IRC §101(a) (death benefit
// exclusion), IRC §72 (annuity taxation), NAIC Model regulations, and
// state insurance regulatory frameworks.

export const INSURANCE_PLANNING_QUESTIONS: Question[] = [
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-death-benefit-exclusion-1",
    question: "Under IRC §101(a), life insurance death benefits paid to a beneficiary are generally:",
    options: [
      "Taxable as ordinary income",
      "Taxable at long-term capital gains rates",
      "Excluded from the beneficiary's gross income",
      "Subject to the estate tax but not income tax"
    ],
    correct: 2,
    explanation: "IRC §101(a)(1) excludes life insurance death benefits from the gross income of the beneficiary. This exclusion applies regardless of the policy type (term, whole life, universal life). Exceptions exist for transfer-for-value situations (IRC §101(a)(2)) where a policy is sold to a third party.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-irc-7702-life-definition-1",
    question: "Under IRC §7702, a life insurance contract must meet certain tests to qualify for favorable tax treatment. Which test measures the ratio of premiums to the death benefit?",
    options: [
      "Cash Value Accumulation Test (CVAT)",
      "Guideline Premium Test (GPT)",
      "Modified Endowment Contract Test",
      "Net Amount at Risk Test"
    ],
    correct: 1,
    explanation: "IRC §7702 provides two alternative tests a contract must satisfy to qualify as life insurance: the Cash Value Accumulation Test (CVAT) and the Guideline Premium Test (GPT) combined with a Cash Value Corridor. The GPT limits the premiums that can be paid into the contract relative to the death benefit. If a policy fails IRC §7702, gains inside are taxable currently.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-mec-7702a-1",
    question: "A Modified Endowment Contract (MEC) under IRC §7702A results when a life insurance policy is:",
    options: [
      "Purchased by a trust rather than an individual",
      "Overfunded beyond the 7-pay test limit",
      "Surrendered within the first 2 years",
      "Owned by a corporation rather than an individual"
    ],
    correct: 1,
    explanation: "IRC §7702A defines a MEC as a life insurance contract that fails the 7-pay test — meaning cumulative premiums paid in the first 7 years exceed the net level premium for a paid-up policy. MEC distributions are subject to last-in-first-out (LIFO) tax treatment and a 10% early withdrawal penalty before age 59½, unlike non-MEC policies which use FIFO for basis recovery.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-disability-own-occupation-1",
    question: "Which disability insurance policy definition provides the strongest protection for a physician who becomes unable to perform surgery but could still work in another occupation?",
    options: [
      "Any occupation definition",
      "Modified own occupation definition",
      "Own occupation definition",
      "Presumptive disability definition"
    ],
    correct: 2,
    explanation: "The 'own occupation' definition pays benefits if the insured cannot perform the material duties of their specific occupation, even if they are working in another capacity. An 'any occupation' definition only pays if the insured cannot work in any occupation for which they are reasonably suited by education, training, or experience — providing significantly weaker protection for specialized professionals.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-ltc-7702b-1",
    question: "Under IRC §7702B, benefits received from a qualified long-term care insurance contract are generally:",
    options: [
      "Taxable as ordinary income",
      "Excluded from income, subject to a per diem limit",
      "Taxable only to the extent they exceed actual LTC expenses",
      "Fully taxable as they are insurance proceeds"
    ],
    correct: 1,
    explanation: "Benefits from a qualified LTC contract under IRC §7702B are generally excluded from income. For per diem or indemnity-style policies (which pay a fixed daily benefit regardless of actual expenses), the exclusion is limited to the greater of actual LTC costs or the IRS per diem limit ($420/day in 2024). Reimbursement-style policies that pay only actual expenses have no per diem limit.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "ins-ilit-incidents-of-ownership-1",
    question: "For life insurance proceeds to be excluded from the insured's taxable estate, the insured must not retain which of the following?",
    options: [
      "The right to name the policy beneficiary",
      "Any incidents of ownership in the policy",
      "The right to receive dividend payments from the policy",
      "Any knowledge of the policy's existence"
    ],
    correct: 1,
    explanation: "IRC §2042 includes life insurance proceeds in the insured's taxable estate if the insured possessed any incidents of ownership in the policy at death. Incidents of ownership include: the right to change beneficiaries, borrow against the policy, surrender or cancel the policy, or assign the policy. An Irrevocable Life Insurance Trust (ILIT) owned by a trustee — not the insured — removes the policy from the taxable estate, provided the 3-year rule of IRC §2035 is satisfied for transferred policies.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-term-vs-perm-1",
    question: "Which type of life insurance provides the highest death benefit per premium dollar for a 35-year-old client in accumulation phase?",
    options: [
      "Whole life insurance",
      "Variable universal life insurance",
      "Level term life insurance",
      "Indexed universal life insurance"
    ],
    correct: 2,
    explanation: "Level term life insurance provides the highest death benefit per premium dollar because the premium is used entirely for death benefit protection, with no cash value component. For clients in accumulation phase who need maximum protection at minimum cost, term insurance is typically the most efficient choice. Permanent products (whole life, VUL, IUL) build cash value but at significantly higher premiums for the same death benefit amount.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-disability-employer-taxability-1",
    question: "A client receives disability insurance benefits. Under what condition are the benefits taxable income?",
    options: [
      "Benefits are always tax-free regardless of who paid the premium",
      "Benefits are taxable if the employer paid the premiums (deducted by employer under IRC §162)",
      "Benefits are taxable only if received as a lump sum",
      "Benefits are always taxable as they replace earned income"
    ],
    correct: 1,
    explanation: "Disability benefits are taxable if the premiums were paid by the employer and deducted as a business expense under IRC §162. If the employee paid the premiums with after-tax dollars, benefits are received tax-free. If premiums were split, benefits are taxable in proportion to the employer's contribution. This is why many financial planners recommend employees pay their own disability premiums to ensure tax-free benefits if a claim occurs.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-1035-exchange-1",
    question: "A Section 1035 exchange allows a tax-free exchange between which of the following?",
    options: [
      "A life insurance policy and a Roth IRA",
      "An annuity contract and a term life insurance policy",
      "An annuity contract and another annuity contract",
      "A 401(k) and a life insurance policy"
    ],
    correct: 2,
    explanation: "IRC §1035 permits tax-free exchanges of: (1) life insurance for life insurance or an annuity, (2) an endowment for life insurance, annuity, or another endowment, and (3) an annuity for another annuity. You cannot exchange an annuity back into a life insurance policy. The gain inside the old contract carries over — tax is deferred, not eliminated. 1035 exchanges are commonly used to upgrade to lower-cost or better-performing policies.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "ins-genworth-ltc-costs-1",
    question: "According to national median data, approximately how much does a private room in a nursing home cost per month in 2024?",
    options: ["$3,500/month", "$5,500/month", "$7,500/month", "$9,700/month"],
    correct: 3,
    explanation: "According to the Genworth 2024 Cost of Care Survey, the national median cost for a private room in a nursing home is approximately $9,733 per month. Home health aide costs approximately $33/hour. These figures vary significantly by geographic region — costs in urban areas and states like New York, Connecticut, and California can be 50-100% higher than the national median.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-dime-method-life-1",
    question: "The DIME method for calculating life insurance needs stands for which four components?",
    options: [
      "Death benefit, Income, Mortgage, Emergency fund",
      "Debt, Income replacement, Mortgage payoff, Education funding",
      "Dependents, Income, Medical, Estate planning",
      "Death benefit, Inflation, Mortgage, Expenses"
    ],
    correct: 1,
    explanation: "DIME is a life insurance needs calculation method: Debt (all non-mortgage debt), Income (gross annual income × years until retirement or youngest child's independence), Mortgage (outstanding balance), and Education (estimated future education costs for dependents). It typically produces a higher — and arguably more comprehensive — coverage estimate than simpler income-multiple methods.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-umbrella-trigger-1",
    question: "An umbrella liability policy is designed to provide what type of protection?",
    options: [
      "Coverage for property damage to your own home",
      "Liability coverage above and beyond the limits of underlying auto and homeowner's policies",
      "Coverage for professional liability and errors and omissions",
      "First-dollar coverage for medical expenses"
    ],
    correct: 1,
    explanation: "An umbrella policy provides excess liability coverage — it activates when the liability limits of underlying policies (auto, homeowner's) are exhausted. Umbrella policies typically provide $1M-$5M of additional coverage at relatively low annual cost ($150-$300 per $1M). They are among the most cost-effective risk management tools available to high-income or high-net-worth individuals.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "ins-hybrid-ltc-7702b-1",
    question: "A hybrid life insurance/LTC policy under IRC §7702B allows the policyholder to:",
    options: [
      "Deduct the full premium as a medical expense",
      "Accelerate the death benefit tax-free for qualifying LTC expenses",
      "Convert the LTC benefit to an annuity without tax consequences",
      "Avoid all estate inclusion of the policy value"
    ],
    correct: 1,
    explanation: "Hybrid life/LTC policies allow the death benefit to be accelerated for qualifying long-term care expenses on a tax-free basis under IRC §7702B. The key advantage over standalone LTC insurance is that if LTC is never needed, the remaining death benefit passes to heirs income-tax-free under IRC §101(a) — addressing the 'use it or lose it' objection. Premiums must satisfy IRC §7702B to maintain the qualified LTC status.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "ins-ssdi-waiting-period-1",
    question: "Before Social Security Disability Insurance (SSDI) benefits begin, a qualified disabled worker must satisfy a waiting period of:",
    options: ["30 days", "90 days", "5 months", "12 months"],
    correct: 2,
    explanation: "SSDI benefits do not begin until the sixth month of disability — there is a mandatory 5-month waiting period after the date of disability onset (42 U.S.C. §423(a)(1)(A)). This reinforces why private disability insurance is critical: an individual who becomes disabled must survive 5 months on savings or other resources before any SSDI benefits begin, and the average approved SSDI benefit (~$1,500/month) is far below most professionals' income needs.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Insurance Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "ins-disability-benefit-pct-1",
    question: "The industry standard for disability insurance income replacement is what percentage of pre-disability gross income?",
    options: ["40-50%", "60-70%", "80-90%", "100%"],
    correct: 1,
    explanation: "Disability insurance policies are designed to replace approximately 60-70% of pre-disability gross income. The lower replacement rate (rather than 100%) is intentional: disability benefits are often tax-free (when paid for with after-tax premiums), so 60-70% of gross income approximates the after-tax take-home pay the insured was living on. Replacing 100% would reduce the financial incentive to return to work.",
    points: 15
  }
];
