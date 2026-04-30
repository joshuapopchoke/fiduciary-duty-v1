import type { Question } from "../../types/question";

// ─── Qualified Plan Question Bank ─────────────────────────────────────────────
// Verified against: IRC §§401-417, §403(b), §457, §408 (IRA), §408A (Roth),
// ERISA Title I, SECURE Act (2019), SECURE 2.0 Act (2022),
// IRS Notice 2023-75 (2024 limits), DOL regulations.

export const QUALIFIED_PLAN_QUESTIONS: Question[] = [
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "qplan-401k-deferral-limit-2024-1",
    question: "The maximum employee elective deferral to a 401(k) plan in 2024 under IRC §402(g)(1) is:",
    options: ["$20,500", "$22,500", "$23,000", "$24,000"],
    correct: 2,
    explanation: "The 401(k) employee elective deferral limit is $23,000 for 2024 (IRS Notice 2023-75). An additional $7,500 catch-up contribution is permitted for participants age 50 or older, bringing the maximum to $30,500. SECURE 2.0 Act §109 increases the catch-up for ages 60-63 to $11,250 beginning in 2025.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "qplan-sep-ira-limit-2024-1",
    question: "The maximum SEP-IRA contribution in 2024 is the lesser of $69,000 or what percentage of the participant's compensation?",
    options: ["15%", "20%", "25%", "33%"],
    correct: 2,
    explanation: "A SEP-IRA (IRC §408(k)) allows employer contributions of up to 25% of the employee's compensation or $69,000 (2024), whichever is less. The compensation cap is $345,000 (2024), so the effective maximum is $69,000. SEP-IRAs are popular for self-employed individuals because they allow much larger contributions than Traditional IRAs at lower administrative cost than a 401(k).",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-erisa-prudent-expert-1",
    question: "ERISA §404(a)(1)(B) requires plan fiduciaries to apply the 'prudent expert' standard, which means acting with the care of:",
    options: [
      "A reasonable layperson under similar circumstances",
      "A knowledgeable fiduciary familiar with retirement plan management under similar circumstances",
      "A conservative investor avoiding all speculative assets",
      "A majority vote of plan participants"
    ],
    correct: 1,
    explanation: "ERISA §404(a)(1)(B) requires fiduciaries to act with the care, skill, prudence, and diligence that a 'prudent person familiar with such matters' acting in a similar capacity would use. This is the 'prudent expert' standard — not merely a reasonable layperson standard. Fiduciaries who lack expertise must seek professional guidance; ignorance is not a defense.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-safe-harbor-match-1",
    question: "A Safe Harbor 401(k) plan under IRC §401(k)(12) automatically satisfies the ADP nondiscrimination test. Which of the following is a valid Safe Harbor contribution formula?",
    options: [
      "50% match on the first 6% of compensation deferred",
      "100% match on the first 3% of compensation plus 50% match on the next 2%",
      "25% match on all employee deferrals up to $10,000",
      "3% non-elective contribution only to HCEs"
    ],
    correct: 1,
    explanation: "IRC §401(k)(12) requires one of these Safe Harbor formulas: (1) 100% match on first 3% + 50% match on next 2% (net 4% of compensation), (2) 100% match on first 4% of compensation, or (3) 3% non-elective contribution to all eligible employees. The 50%/6% formula (option A) does NOT qualify as a Safe Harbor. All Safe Harbor contributions must vest immediately.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "qplan-simple-ira-early-penalty-1",
    question: "What is the early withdrawal penalty for a SIMPLE IRA distribution within the first 2 years of plan participation?",
    options: ["10%", "15%", "25%", "No penalty"],
    correct: 2,
    explanation: "SIMPLE IRA distributions within the first 2 years of plan participation are subject to a 25% early withdrawal penalty (IRC §72(t)(6)), compared to the standard 10% for other retirement accounts. After 2 years, the penalty drops to the standard 10% for pre-59½ distributions. This 2-year restriction is unique to SIMPLE IRAs and is designed to prevent early plan termination.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-20pct-withholding-rule-1",
    question: "When a plan participant receives an eligible rollover distribution directly from a qualified plan (not an IRA), the plan must withhold:",
    options: ["0% — withholding is voluntary", "10%", "20%", "30%"],
    correct: 2,
    explanation: "IRC §3405(c) requires mandatory 20% federal income tax withholding on eligible rollover distributions paid directly to the participant from a qualified plan (401(k), 403(b), etc.). To roll over the full amount, the participant must replace the 20% withheld from other funds within 60 days. This trap is avoided entirely by requesting a direct trustee-to-trustee transfer, which is not subject to mandatory withholding.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "qplan-nua-1",
    question: "Net Unrealized Appreciation (NUA) treatment under IRC §402(e)(4) allows a participant to pay ordinary income tax only on the cost basis of employer stock, with the NUA taxed at:",
    options: [
      "Ordinary income rates when stock is distributed",
      "Long-term capital gains rates when the stock is eventually sold",
      "Short-term capital gains rates at distribution",
      "No tax — NUA is always excluded from income"
    ],
    correct: 1,
    explanation: "NUA treatment (IRC §402(e)(4)) applies to lump-sum distributions of employer stock from a qualified plan. The participant pays ordinary income tax on the plan's cost basis (typically low). The NUA — the appreciation above the basis — is taxed at preferential long-term capital gains rates when the stock is ultimately sold. NUA treatment is permanently lost if the stock is rolled into an IRA, which is why participants with highly appreciated employer stock should analyze NUA before rolling over.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-erisa-exclusive-benefit-1",
    question: "ERISA §404(a)(1)(A) requires plan fiduciaries to act for the exclusive purpose of:",
    options: [
      "Maximizing plan investment returns",
      "Providing benefits to participants and beneficiaries and defraying reasonable plan expenses",
      "Protecting the employer's financial interests",
      "Minimizing regulatory liability for the plan sponsor"
    ],
    correct: 1,
    explanation: "The exclusive benefit rule (ERISA §404(a)(1)(A)) requires fiduciaries to act solely in the interest of plan participants and beneficiaries, for the exclusive purpose of providing benefits and defraying reasonable expenses. This prohibits using plan assets or decisions for any purpose that benefits the employer, service providers, or any party other than participants — even if it might indirectly benefit participants.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "qplan-roth-401k-no-rmd-1",
    question: "Beginning in 2024 per SECURE 2.0 Act §325, designated Roth accounts in 401(k) plans are:",
    options: [
      "Subject to RMDs at the same age as Traditional 401(k) accounts",
      "No longer subject to lifetime RMDs during the owner's lifetime",
      "Subject to RMDs but at a reduced rate",
      "Only exempt from RMDs after 5 years of participation"
    ],
    correct: 1,
    explanation: "SECURE 2.0 Act §325 (effective 2024) eliminated the RMD requirement for designated Roth accounts in employer plans (401(k), 403(b), 457(b)) during the owner's lifetime — aligning them with Roth IRA treatment. Previously, Roth 401(k) accounts were subject to lifetime RMDs unlike Roth IRAs, which was a significant disadvantage. This change makes Roth 401(k) even more attractive for estate planning.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-qdia-protection-1",
    question: "A plan fiduciary receives relief from liability for default investments under the QDIA regulation (29 CFR §2550.404c-5) when:",
    options: [
      "Any investment is used as the default regardless of type",
      "The default investment is a QDIA (target-date fund, balanced fund, or managed account) with proper participant notices",
      "The employer directs all default investments to guaranteed products",
      "The plan has been in operation for at least 5 years"
    ],
    correct: 1,
    explanation: "The QDIA regulation provides fiduciary protection for default investments only if the investment qualifies as a QDIA — a target-date or lifecycle fund, a balanced fund, or a managed account. The plan must also provide proper advance notice to participants and allow them to redirect their investments. Stable value funds and money market funds are NOT QDIAs and do not provide fiduciary protection.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "qplan-prohibited-transaction-1",
    question: "Which of the following is a prohibited transaction under ERISA §406?",
    options: [
      "Investing plan assets in publicly traded mutual funds",
      "Hiring an independent investment adviser to manage plan assets",
      "Selling real estate owned by the plan sponsor to the plan",
      "Rebalancing plan assets annually to maintain target allocation"
    ],
    correct: 2,
    explanation: "ERISA §406 prohibits transactions between the plan and 'parties in interest' — including the plan sponsor, plan fiduciaries, and their affiliates. Selling property from the plan sponsor to the plan (or vice versa) is a classic prohibited transaction. Violations can result in excise taxes (IRC §4975) of 15% per year on the transaction amount, plus mandatory correction. PTE (Prohibited Transaction Exemption) approval is required to proceed with such transactions.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-secure2-autoenrollment-1",
    question: "SECURE 2.0 Act §101 requires new 401(k) plans established after December 29, 2022 to include automatic enrollment at what minimum deferral rate?",
    options: ["1%", "3%", "5%", "10%"],
    correct: 1,
    explanation: "SECURE 2.0 Act §101 requires new 401(k) and 403(b) plans established after December 29, 2022 to automatically enroll eligible employees at a minimum of 3% of compensation. The plan must also include automatic escalation of 1% per year until reaching at least 10% (but not more than 15%). Employees may opt out. Plans existing before December 30, 2022 are grandfathered and not required to comply.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "qplan-hce-threshold-2024-1",
    question: "For 2024, an employee is considered a Highly Compensated Employee (HCE) under IRC §414(q) if they earned more than:",
    options: ["$100,000", "$125,000", "$135,000", "$155,000"],
    correct: 3,
    explanation: "The HCE threshold for 2024 is $155,000 (IRS Notice 2023-75). An employee is also an HCE if they own more than 5% of the employer. HCE status matters for nondiscrimination testing — the Actual Deferral Percentage (ADP) test limits how much HCEs can defer relative to non-HCEs. Safe harbor plans avoid this testing requirement.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "qplan-top-heavy-rule-1",
    question: "A 401(k) plan is considered 'top-heavy' under IRC §416 when more than 60% of plan benefits are held by 'key employees.' What is the required minimum contribution for non-key employees in a top-heavy year?",
    options: [
      "No minimum required — top-heavy is only a disclosure requirement",
      "1% of compensation",
      "3% of compensation",
      "5% of compensation"
    ],
    correct: 2,
    explanation: "IRC §416 requires that in a top-heavy plan year, the employer must make minimum contributions of 3% of compensation to all non-key employees, regardless of whether they defer anything themselves. Key employees are defined as officers earning >$220,000, 5%+ owners, or 1%+ owners earning >$150,000. Top-heavy testing is done annually on the determination date (last day of the preceding plan year).",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Qualified Plans",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "qplan-vesting-erisa-min-1",
    question: "Under ERISA §203, which of the following represents the minimum permissible vesting schedule for employer matching contributions in a 401(k) plan?",
    options: [
      "5-year cliff vesting (0% before 5 years, 100% after)",
      "3-year cliff vesting (0% before 3 years, 100% after) or 6-year graded vesting",
      "Immediate vesting for all contributions",
      "7-year graded vesting (10% per year)"
    ],
    correct: 1,
    explanation: "ERISA §203 sets minimum vesting standards. For employer matching contributions: either 3-year cliff vesting (0% before 3 full years, 100% thereafter) or 6-year graded vesting (20% per year from year 2 through year 6) is the minimum. For employer non-elective contributions, the minimum is 3-year cliff or 6-year graded as well. Employee contributions must always vest immediately (100%). Safe harbor contributions must also vest immediately.",
    points: 20
  }
];
