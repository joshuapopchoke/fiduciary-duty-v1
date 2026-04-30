// ─── Module Client Questions ──────────────────────────────────────────────────
// FINRA/SEC/IRC accurate question banks for each planning module.
// Each module has questions across 5 difficulty tiers.
// Difficulty ladder: learner → trainee → associate → advisor → senior
// When a module is assigned at difficulty X, questions are drawn from all tiers up to and including X.

export type QuestionDifficulty = "learner" | "trainee" | "associate" | "advisor" | "senior";

export type ModuleQuestionModule =
  | "retirement-planning"
  | "qualified-plans"
  | "estate-planning"
  | "insurance-planning"
  | "tax-planning"
  | "suitability-client-fit"
  | "bank-lending"
  | "mortgage-debt-planning";

export interface ModuleClientQuestion {
  id: string;
  module: ModuleQuestionModule;
  difficulty: QuestionDifficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

// ─── Difficulty tier ordering ─────────────────────────────────────────────────
const DIFFICULTY_ORDER: QuestionDifficulty[] = ["learner", "trainee", "associate", "advisor", "senior"];

export function getEligibleDifficulties(assignedDifficulty: string): QuestionDifficulty[] {
  const idx = DIFFICULTY_ORDER.indexOf(assignedDifficulty as QuestionDifficulty);
  if (idx === -1) return ["learner"];
  return DIFFICULTY_ORDER.slice(0, idx + 1);
}

export function getQuestionsForModule(
  module: ModuleQuestionModule,
  assignedDifficulty: string,
  excludeIds: string[] = []
): ModuleClientQuestion[] {
  const eligible = getEligibleDifficulties(assignedDifficulty);
  return MODULE_CLIENT_QUESTIONS.filter(
    (q) => q.module === module && eligible.includes(q.difficulty) && !excludeIds.includes(q.id)
  );
}

// ─── RETIREMENT PLANNING ──────────────────────────────────────────────────────
const RETIREMENT_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "ret-l-001", module: "retirement-planning", difficulty: "learner",
    question: "At what age can an individual begin taking distributions from a traditional IRA without incurring the 10% early withdrawal penalty?",
    options: [
      "59½",
      "55",
      "62",
      "65"
    ],
    correctIndex: 0,
    explanation: "Under IRC §72(t), distributions from a traditional IRA before age 59½ are subject to a 10% early withdrawal penalty in addition to ordinary income tax, with limited exceptions."
  },
  {
    id: "ret-l-002", module: "retirement-planning", difficulty: "learner",
    question: "What is the primary tax advantage of a traditional IRA for an eligible individual?",
    options: [
      "Contributions grow tax-free and qualified withdrawals are tax-free",
      "Contributions are always tax-deductible regardless of income",
      "Contributions may be tax-deductible and growth is tax-deferred",
      "Withdrawals are never subject to income tax"
    ],
    correctIndex: 2,
    explanation: "Traditional IRA contributions may be tax-deductible depending on income and workplace plan coverage. Growth is tax-deferred, meaning taxes are paid at withdrawal as ordinary income."
  },
  {
    id: "ret-l-003", module: "retirement-planning", difficulty: "learner",
    question: "A client asks what RMD stands for. What is the correct answer?",
    options: [
      "Retirement Mandatory Dividend",
      "Required Maximum Deferral",
      "Retirement Minimum Deposit",
      "Required Minimum Distribution"
    ],
    correctIndex: 3,
    explanation: "RMD stands for Required Minimum Distribution — the minimum amount the IRS requires account holders to withdraw annually from retirement accounts beginning at age 73 under SECURE 2.0."
  },
  // Trainee
  {
    id: "ret-t-001", module: "retirement-planning", difficulty: "trainee",
    question: "Under SECURE 2.0 (2022), at what age must traditional IRA and 401(k) account holders begin taking Required Minimum Distributions?",
    options: [
      "70½",
      "73",
      "72",
      "75"
    ],
    correctIndex: 1,
    explanation: "SECURE 2.0 increased the RMD starting age to 73 for individuals who turn 72 after December 31, 2022. It will increase further to 75 in 2033."
  },
  {
    id: "ret-t-002", module: "retirement-planning", difficulty: "trainee",
    question: "Which of the following accounts is NOT subject to Required Minimum Distributions during the owner's lifetime?",
    options: [
      "Roth IRA",
      "Traditional IRA",
      "SEP-IRA",
      "SIMPLE IRA"
    ],
    correctIndex: 0,
    explanation: "Roth IRAs are not subject to RMDs during the original owner's lifetime under IRC §408A(c)(5). This is one of the key planning advantages of Roth accounts for wealth transfer."
  },
  {
    id: "ret-t-003", module: "retirement-planning", difficulty: "trainee",
    question: "A client age 68 with a conservative risk profile asks about moving 100% of her IRA into a single S&P 500 ETF. What is the most appropriate response?",
    options: [
      "Approve — the S&P 500 has historically delivered strong returns",
      "Approve — ETFs are always suitable for retirees",
      "Defer to the client's preference without comment",
      "Decline — concentration in any single investment is unsuitable for a conservative retiree"
    ],
    correctIndex: 3,
    explanation: "Suitability under FINRA Rule 2111 requires that recommendations be consistent with the client's investment profile including risk tolerance. A 100% equity concentration is inconsistent with a conservative risk profile, especially near or in retirement."
  },
  // Associate
  {
    id: "ret-a-001", module: "retirement-planning", difficulty: "associate",
    question: "A client is 75 years old and failed to take her RMD for the prior year. What is the IRS penalty for a missed RMD?",
    options: [
      "10% of the amount not withdrawn",
      "50% of the amount not withdrawn",
      "25% of the amount not withdrawn (reduced to 10% if corrected within 2 years)",
      "No penalty if corrected within 60 days"
    ],
    correctIndex: 2,
    explanation: "Under SECURE 2.0, the penalty for a missed RMD was reduced from 50% to 25% of the shortfall, further reducible to 10% if corrected within the correction window. This is found in IRC §4974."
  },
  {
    id: "ret-a-002", module: "retirement-planning", difficulty: "associate",
    question: "Which retirement income strategy involves dividing assets into separate pools for near-term, mid-term, and long-term needs?",
    options: ["Total return approach", "Bucket strategy", "Floor-and-upside strategy", "Systematic withdrawal plan"],
    correctIndex: 1,
    explanation: "The bucket strategy allocates assets into time-segmented pools: cash/bonds for near-term income needs (1-3 years), moderate allocation for mid-term (4-10 years), and growth assets for long-term (10+ years). It addresses sequence-of-returns risk behaviorally."
  },
  {
    id: "ret-a-003", module: "retirement-planning", difficulty: "associate",
    question: "A 62-year-old client asks about the impact of claiming Social Security early versus waiting until 70. Which statement is most accurate?",
    options: [
      "Claiming at 62 reduces benefits by approximately 25-30% vs. full retirement age; delaying to 70 increases benefits by 8% per year beyond FRA",
      "Claiming early has no impact on lifetime benefits",
      "Benefits are the same regardless of when you claim",
      "Delaying past 67 provides no additional benefit increase"
    ],
    correctIndex: 0,
    explanation: "Claiming Social Security at 62 reduces benefits approximately 25-30% versus full retirement age (66-67 depending on birth year). Each year of delay past FRA up to age 70 adds an 8% delayed retirement credit, resulting in up to 32% higher monthly benefits at 70 vs. FRA."
  },
  // Advisor
  {
    id: "ret-adv-001", module: "retirement-planning", difficulty: "advisor",
    question: "What is the primary risk addressed by delaying Social Security claiming to age 70 for a healthy 65-year-old client?",
    options: ["Inflation risk", "Longevity risk — the risk of outliving assets", "Market risk", "Credit risk"],
    correctIndex: 1,
    explanation: "Delaying Social Security to 70 maximizes the monthly guaranteed benefit, which increases by 8% per year after FRA. This directly addresses longevity risk — the client cannot outlive their Social Security income regardless of portfolio performance."
  },
  {
    id: "ret-adv-002", module: "retirement-planning", difficulty: "advisor",
    question: "A client with a $2M IRA, age 73, asks whether converting a portion to a Roth IRA makes sense. Which factor most supports a conversion?",
    options: [
      "The client expects to be in a lower tax bracket in retirement than today",
      "Roth conversions are always beneficial at any age",
      "The client needs the IRA funds for income within the next 2 years",
      "The client has outside funds to pay the conversion tax and expects rates to increase"
    ],
    correctIndex: 3,
    explanation: "Roth conversions are most advantageous when the client has outside funds to pay the tax (avoiding erosion of converted principal), expects higher future tax rates, and has a sufficient time horizon. At 73, the break-even horizon and estate planning benefits must be weighed carefully."
  },
  {
    id: "ret-adv-003", module: "retirement-planning", difficulty: "advisor",
    question: "Which withdrawal sequencing strategy is generally most tax-efficient for a retiree with taxable, traditional IRA, and Roth IRA accounts?",
    options: [
      "Withdraw from Roth first to preserve tax-deferred growth",
      "Withdraw pro-rata from all accounts simultaneously",
      "Withdraw from taxable accounts first, then traditional IRA, then Roth last",
      "Withdraw from traditional IRA first to reduce future RMDs"
    ],
    correctIndex: 2,
    explanation: "Conventional tax-efficient sequencing: (1) taxable accounts first — only gains taxed, often at LTCG rates; (2) traditional IRA/401(k) — fills lower brackets; (3) Roth last — tax-free growth preserved longest. However, this must be adjusted for RMD obligations and bracket management."
  },
  // Senior
  {
    id: "ret-s-001", module: "retirement-planning", difficulty: "senior",
    question: "A client has a $3M traditional IRA and a $500K Roth IRA at age 70. She has no other significant assets. Her estate goal is to maximize tax-efficient wealth transfer to her adult children. What is the most sophisticated planning recommendation?",
    options: [
      "Leave all assets as-is and let heirs manage distributions",
      "Annuitize the traditional IRA immediately",
      "Perform systematic Roth conversions to fill lower tax brackets annually before RMDs begin, reducing future taxable IRA balance and RMD pressure",
      "Convert the entire IRA to Roth in one year to minimize future taxes"
    ],
    correctIndex: 2,
    explanation: "Systematic partial Roth conversions before RMD onset (age 73) allow the client to fill lower tax brackets each year, reducing the taxable IRA balance and future RMD amounts. Heirs inherit Roth assets income-tax-free, subject to the 10-year rule under SECURE Act. A lump-sum full conversion would create a massive single-year tax event."
  },
  {
    id: "ret-s-002", module: "retirement-planning", difficulty: "senior",
    question: "Under IRC §401(a)(9) and SECURE 2.0, which beneficiary classification allows the longest tax deferral for an inherited IRA?",
    options: [
      "Eligible Designated Beneficiary (EDB) such as a surviving spouse — may use life expectancy method",
      "Adult child (non-EDB) subject to 10-year rule",
      "Trust as beneficiary",
      "Estate as beneficiary"
    ],
    correctIndex: 0,
    explanation: "Eligible Designated Beneficiaries (EDBs) — including surviving spouses, minor children of the deceased, disabled or chronically ill individuals, and individuals not more than 10 years younger — may still use the life expectancy (stretch) method. A surviving spouse has the most flexibility, including spousal rollover treatment."
  },
];

// ─── QUALIFIED PLANS ──────────────────────────────────────────────────────────
const QUALIFIED_PLAN_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "qp-l-001", module: "qualified-plans", difficulty: "learner",
    question: "What is the 2024 employee elective deferral limit for a 401(k) plan for a participant under age 50?",
    options: [
      "$7,000",
      "$16,000",
      "$69,000",
      "$23,000"
    ],
    correctIndex: 3,
    explanation: "The 2024 IRC §402(g) elective deferral limit for 401(k), 403(b), and most 457 plans is $23,000 for participants under age 50."
  },
  {
    id: "qp-l-002", module: "qualified-plans", difficulty: "learner",
    question: "What additional catch-up contribution amount is available to 401(k) participants age 50 and older in 2024?",
    options: [
      "$1,000",
      "$7,500",
      "$3,500",
      "$10,000"
    ],
    correctIndex: 1,
    explanation: "Participants age 50 and older may contribute an additional $7,500 catch-up contribution to a 401(k) in 2024 under IRC §414(v), bringing their total employee deferral limit to $30,500."
  },
  {
    id: "qp-l-003", module: "qualified-plans", difficulty: "learner",
    question: "A Roth 401(k) differs from a traditional 401(k) in which primary way?",
    options: [
      "Roth 401(k) contributions are after-tax; qualified withdrawals are tax-free",
      "Roth 401(k) contributions are pre-tax; withdrawals are taxed",
      "Roth 401(k) has higher contribution limits than traditional",
      "Roth 401(k) is not subject to RMDs during the owner's lifetime"
    ],
    correctIndex: 0,
    explanation: "Roth 401(k) contributions are made with after-tax dollars. Qualified distributions (account held 5+ years, owner age 59½+) are income-tax-free. Note: Roth 401(k)s were subject to RMDs until SECURE 2.0 eliminated this requirement beginning in 2024."
  },
  // Trainee
  {
    id: "qp-t-001", module: "qualified-plans", difficulty: "trainee",
    question: "What is the 2024 annual additions limit (employer + employee combined) for a defined contribution plan under IRC §415(c)?",
    options: [
      "$23,000",
      "$46,000",
      "$69,000",
      "$76,500"
    ],
    correctIndex: 2,
    explanation: "The 2024 IRC §415(c) limit on annual additions to a defined contribution plan is $69,000 (or $76,500 including catch-up for age 50+). This includes all employer and employee contributions combined."
  },
  {
    id: "qp-t-002", module: "qualified-plans", difficulty: "trainee",
    question: "A sole proprietor earns $300,000 net self-employment income. What is the maximum SEP-IRA contribution for 2024?",
    options: [
      "$23,000",
      "$46,000",
      "$66,000",
      "$69,000"
    ],
    correctIndex: 3,
    explanation: "SEP-IRA contributions are limited to 25% of compensation or $69,000 (2024), whichever is less. For a sole proprietor, compensation for this purpose is net self-employment income reduced by the deductible SE tax. At $300,000 net SE income, the contribution approaches the $69,000 cap."
  },
  {
    id: "qp-t-003", module: "qualified-plans", difficulty: "trainee",
    question: "Under ERISA, what is the primary fiduciary duty of a 401(k) plan trustee?",
    options: ["Maximize plan investment returns at all costs", "Act solely in the interest of plan participants and beneficiaries with the care of a prudent expert", "Follow employer instructions regarding plan investments", "Minimize plan administrative costs above all other considerations"],
    correctIndex: 1,
    explanation: "ERISA §404(a)(1) requires plan fiduciaries to act solely in the interest of plan participants and beneficiaries, with the care, skill, prudence, and diligence of a prudent person familiar with such matters. Self-dealing and conflicts of interest are prohibited transactions."
  },
  // Associate
  {
    id: "qp-a-001", module: "qualified-plans", difficulty: "associate",
    question: "A public school teacher participates in both a 403(b) and a 457(b) plan. What is the maximum combined employee deferral in 2024?",
    options: [
      "$46,000 — each plan has an independent $23,000 limit",
      "$23,000 combined between both plans",
      "$30,500 with catch-up",
      "$69,000 total"
    ],
    correctIndex: 0,
    explanation: "A governmental 457(b) plan has its own independent $23,000 deferral limit that does not aggregate with the 403(b) limit. A participant may defer the maximum to both, for a combined $46,000 (or $61,000 with catch-up contributions at age 50+)."
  },
  {
    id: "qp-a-002", module: "qualified-plans", difficulty: "associate",
    question: "Which plan type automatically satisfies the ADP nondiscrimination test without annual testing?",
    options: [
      "Traditional 401(k)",
      "Safe Harbor 401(k)",
      "SIMPLE IRA",
      "Both Safe Harbor 401(k) and SIMPLE IRA"
    ],
    correctIndex: 3,
    explanation: "Both Safe Harbor 401(k) plans (meeting matching or non-elective contribution requirements) and SIMPLE IRAs automatically satisfy ADP nondiscrimination testing requirements. This allows highly compensated employees (HCEs) to maximize deferrals without restriction."
  },
  {
    id: "qp-a-003", module: "qualified-plans", difficulty: "associate",
    question: "An employee leaves her employer and wants to roll her 401(k) to a traditional IRA. She receives a check directly payable to her. What are the tax consequences?",
    options: [
      "No tax consequences if deposited into an IRA within 60 days",
      "The full amount is immediately taxable as ordinary income",
      "The employer must withhold 20% mandatory federal income tax; the employee must contribute 100% of the pre-withholding amount within 60 days to avoid taxes and penalties on the withheld amount",
      "There is no time limit for completing the rollover"
    ],
    correctIndex: 2,
    explanation: "Under IRC §3405(c), mandatory 20% withholding applies to eligible rollover distributions paid directly to the employee. To avoid taxes and penalties on the withheld 20%, the employee must deposit 100% of the pre-withholding distribution (making up the withheld amount from other funds) into an IRA within 60 days. A direct (trustee-to-trustee) rollover avoids withholding entirely."
  },
  // Advisor
  {
    id: "qp-adv-001", module: "qualified-plans", difficulty: "advisor",
    question: "A client age 55 is separated from service from her employer. She wants penalty-free access to her 401(k). Which rule applies?",
    options: [
      "72(t) substantially equal periodic payments",
      "Age 55 separation from service exception under IRC §72(t)(2)(A)(v)",
      "Roth conversion ladder",
      "Hardship distribution"
    ],
    correctIndex: 1,
    explanation: "The age 55 rule (IRC §72(t)(2)(A)(v)) allows penalty-free distributions from a 401(k) if the participant separates from service in or after the year they turn 55. This exception applies only to the plan of the employer from which they separated — not IRAs or prior employer plans."
  },
  {
    id: "qp-adv-002", module: "qualified-plans", difficulty: "advisor",
    question: "What is a Qualified Domestic Relations Order (QDRO) and when is it required?",
    options: [
      "A court order that gives a former spouse or dependent the right to receive all or part of a participant's qualified plan benefits without early withdrawal penalty",
      "A court order required to transfer IRA assets in divorce",
      "An IRS form required for hardship distributions",
      "A plan document amendment required when adding a Roth feature"
    ],
    correctIndex: 0,
    explanation: "A QDRO (IRC §414(p)) is a domestic relations court order that recognizes an alternate payee's right to receive plan benefits. It allows tax-free transfer of qualified plan assets (not IRAs) to a former spouse incident to divorce. The alternate payee pays income tax on distributions; the 10% penalty does not apply to QDRO distributions regardless of age."
  },
  // Senior
  {
    id: "qp-s-001", module: "qualified-plans", difficulty: "senior",
    question: "A client age 60 with a $2M 401(k) asks about the mega backdoor Roth strategy. Which conditions must be met?",
    options: [
      "The client must have no other retirement accounts",
      "The plan must allow after-tax contributions and in-service distributions or in-plan Roth conversions",
      "The strategy requires a SEP-IRA",
      "The plan must be a SIMPLE IRA"
    ],
    correctIndex: 1,
    explanation: "The mega backdoor Roth requires: (1) the plan permits after-tax (non-Roth) contributions beyond the $23,000 deferral limit up to the §415 total addition limit ($69,000); and (2) the plan allows either in-service distributions (enabling rollover to Roth IRA) or in-plan Roth conversions. Not all plans permit these features — the plan document must be reviewed."
  },
  {
    id: "qp-s-002", module: "qualified-plans", difficulty: "senior",
    question: "A defined benefit pension plan promises a client $8,000/month at age 65. She also has a 401(k). Under PBGC rules, what is the maximum insured monthly benefit for 2024?",
    options: [
      "$5,000/month",
      "$7,050/month",
      "$15,000/month",
      "$9,459/month (2024 PBGC single-employer maximum at age 65)"
    ],
    correctIndex: 3,
    explanation: "The PBGC insures defined benefit plan benefits up to a maximum monthly guarantee amount, which is adjusted annually. For 2024, the maximum guaranteed benefit at age 65 for a single-employer plan is approximately $9,459/month. Benefits above this level are at risk if the plan sponsor becomes insolvent."
  },
];

// ─── ESTATE PLANNING ──────────────────────────────────────────────────────────
const ESTATE_PLANNING_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "ep-l-001", module: "estate-planning", difficulty: "learner",
    question: "What document specifies how a person's assets are to be distributed after death and names an executor?",
    options: [
      "Durable Power of Attorney",
      "Healthcare Directive",
      "Last Will and Testament",
      "Revocable Living Trust"
    ],
    correctIndex: 2,
    explanation: "A Last Will and Testament is the primary document that specifies asset distribution at death for probate assets and names an executor. Without a valid will, assets pass under state intestacy laws which may not reflect the decedent's wishes."
  },
  {
    id: "ep-l-002", module: "estate-planning", difficulty: "learner",
    question: "What is the 2024 federal annual gift tax exclusion per recipient?",
    options: [
      "$10,000",
      "$15,000",
      "$18,000",
      "$25,000"
    ],
    correctIndex: 2,
    explanation: "The 2024 annual gift tax exclusion under IRC §2503(b) is $18,000 per donee. Gifts up to this amount per recipient per year require no gift tax return and do not reduce the lifetime exemption."
  },
  {
    id: "ep-l-003", module: "estate-planning", difficulty: "learner",
    question: "Which document allows a trusted person to make financial decisions on your behalf if you become incapacitated?",
    options: [
      "Durable Power of Attorney",
      "Last Will and Testament",
      "Healthcare Directive",
      "Revocable Trust"
    ],
    correctIndex: 0,
    explanation: "A Durable Power of Attorney designates an agent to manage financial affairs if the principal becomes incapacitated. Without this document, family members may need to petition a court for conservatorship — an expensive and time-consuming process."
  },
  // Trainee
  {
    id: "ep-t-001", module: "estate-planning", difficulty: "trainee",
    question: "What is the 2024 federal lifetime estate and gift tax exemption per individual?",
    options: [
      "$5,490,000",
      "$7,000,000",
      "$25,840,000",
      "$13,610,000"
    ],
    correctIndex: 3,
    explanation: "The 2024 federal unified lifetime estate and gift tax exemption is $13,610,000 per individual under IRC §2010(c). This amount is scheduled to revert to approximately $7M (inflation-adjusted) after December 31, 2025, when the TCJA provisions sunset."
  },
  {
    id: "ep-t-002", module: "estate-planning", difficulty: "trainee",
    question: "Assets that pass through probate are governed by which document?",
    options: ["Beneficiary designations", "The Last Will and Testament", "Joint tenancy agreements", "Trust agreements"],
    correctIndex: 1,
    explanation: "Probate assets — those titled solely in the decedent's name without a beneficiary designation — pass according to the will. Non-probate assets (beneficiary-designated accounts, jointly held property, trust assets) pass outside the will by contract or operation of law."
  },
  {
    id: "ep-t-003", module: "estate-planning", difficulty: "trainee",
    question: "Under IRC §1014, what happens to the cost basis of appreciated assets inherited at death?",
    options: [
      "Basis steps up to fair market value at the date of death, eliminating built-in capital gain",
      "Basis carries over from the decedent to the heir",
      "Basis steps down to original purchase price",
      "No basis adjustment occurs at death"
    ],
    correctIndex: 0,
    explanation: "IRC §1014 provides a step-up in basis to the fair market value of the asset at the date of death. This eliminates any built-in capital gain that accrued during the decedent's lifetime — one of the most powerful income tax planning tools in estate planning."
  },
  // Associate
  {
    id: "ep-a-001", module: "estate-planning", difficulty: "associate",
    question: "A married couple wants to minimize estate taxes. Which strategy allows a deceased spouse's unused estate tax exemption to transfer to the surviving spouse?",
    options: [
      "Credit shelter trust (bypass trust)",
      "QTIP trust",
      "Portability election on Form 706",
      "Annual gifting program"
    ],
    correctIndex: 2,
    explanation: "Portability, enacted under IRC §2010(c)(5), allows the surviving spouse to use the Deceased Spousal Unused Exclusion (DSUE). It must be elected on a timely filed estate tax return (Form 706) after the first spouse's death — even if no estate tax is owed. Portability does NOT protect future appreciation on the DSUE amount."
  },
  {
    id: "ep-a-002", module: "estate-planning", difficulty: "associate",
    question: "Which trust structure removes life insurance death proceeds from the taxable estate?",
    options: [
      "Revocable Living Trust",
      "Qualified Personal Residence Trust (QPRT)",
      "Charitable Remainder Trust (CRT)",
      "Irrevocable Life Insurance Trust (ILIT)"
    ],
    correctIndex: 3,
    explanation: "An Irrevocable Life Insurance Trust (ILIT) owns the life insurance policy, removing proceeds from the insured's taxable estate under IRC §2042. The insured must hold no incidents of ownership. Policies transferred to an ILIT within 3 years of death are pulled back under IRC §2035's 3-year rule."
  },
  {
    id: "ep-a-003", module: "estate-planning", difficulty: "associate",
    question: "Under IRC §691, which assets do NOT receive a step-up in basis at death?",
    options: [
      "Appreciated brokerage stocks",
      "Traditional IRA and 401(k) accounts (IRD assets)",
      "Investment real estate",
      "Rental property with depreciation recapture"
    ],
    correctIndex: 1,
    explanation: "Income in Respect of a Decedent (IRD) assets under IRC §691 — including traditional IRAs, 401(k)s, and deferred compensation — do NOT receive a step-up in basis. Beneficiaries owe ordinary income tax on distributions. The IRD deduction (IRC §691(c)) may partially offset estate taxes paid on these assets."
  },
  // Advisor
  {
    id: "ep-adv-001", module: "estate-planning", difficulty: "advisor",
    question: "A client has a $20M estate and wants to transfer wealth to heirs tax-efficiently before the TCJA exemption sunsets. Which strategy transfers future appreciation out of the estate at minimal gift tax cost?",
    options: [
      "Grantor Retained Annuity Trust (GRAT)",
      "Annual exclusion gifts only",
      "Revocable living trust",
      "Healthcare exclusion payments"
    ],
    correctIndex: 0,
    explanation: "A GRAT (IRC §2702) allows a grantor to transfer assets to a trust, receive an annuity for a fixed term, and pass any appreciation above the §7520 hurdle rate to heirs gift-tax-free. In a low-rate environment, GRATs are highly efficient. If the grantor survives the GRAT term, the strategy succeeds. 'Zeroed-out' GRATs are commonly used to minimize gift tax exposure."
  },
  {
    id: "ep-adv-002", module: "estate-planning", difficulty: "advisor",
    question: "A client gifts $500,000 of stock with a $50,000 basis to her adult son. What is the son's basis in the gifted stock for capital gains purposes?",
    options: [
      "$500,000 (FMV at date of gift)",
      "$0",
      "$250,000 (average of FMV and donor basis)",
      "$50,000 (carryover basis from donor under IRC §1015)"
    ],
    correctIndex: 3,
    explanation: "Under IRC §1015, gifted property takes the donor's carryover basis. The son's basis is $50,000 — the same as the donor's. If he sells for $500,000, he recognizes $450,000 of capital gain. This is why holding appreciated assets until death (IRC §1014 step-up) is often more tax-efficient than gifting them."
  },
  // Senior
  {
    id: "ep-s-001", module: "estate-planning", difficulty: "senior",
    question: "A Spousal Lifetime Access Trust (SLAT) is used by a married client to utilize the current high exemption before TCJA sunset. What is the primary risk of this structure?",
    options: [
      "The trust assets are included in the donor spouse's estate",
      "SLATs are not valid under current IRC provisions",
      "The 'reciprocal trust doctrine' may collapse two SLATs if structured identically, and divorce/death of the beneficiary spouse eliminates indirect access",
      "The beneficiary spouse must pay gift tax on trust distributions"
    ],
    correctIndex: 2,
    explanation: "The primary SLAT risks are: (1) the reciprocal trust doctrine — if spouses create mirror SLATs, the IRS may treat them as if each retained beneficial interests, collapsing the structure; and (2) the 'Unhappy SLAT' problem — if the beneficiary spouse dies or the couple divorces, the donor spouse loses indirect access to the transferred assets permanently."
  },
  {
    id: "ep-s-002", module: "estate-planning", difficulty: "senior",
    question: "Under the SECURE Act, a non-spouse beneficiary inherits a $1M traditional IRA. What is the tax treatment under the 10-year rule?",
    options: ["Beneficiary must take equal annual distributions over 10 years", "Beneficiary must fully distribute the account by December 31 of the 10th year after the owner's death; no annual RMD required in years 1-9 unless owner had already started RMDs", "Beneficiary may stretch distributions over their own life expectancy", "Beneficiary owes estate tax on the full IRA value"],
    correctIndex: 1,
    explanation: "Under SECURE Act (2019) and IRS proposed regulations, most non-EDB beneficiaries must fully distribute inherited IRAs by the end of the 10th year. If the original owner had begun RMDs (died after RBD), annual distributions are required in years 1-9 with full distribution by year 10. If the owner died before RBD, no annual distributions are required — the beneficiary can take distributions on any schedule as long as the account is empty by year 10."
  },
];

// ─── INSURANCE PLANNING ───────────────────────────────────────────────────────
const INSURANCE_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "ins-l-001", module: "insurance-planning", difficulty: "learner",
    question: "What type of life insurance provides pure death benefit protection for a defined period with no cash value?",
    options: [
      "Term life",
      "Whole life",
      "Universal life",
      "Variable life"
    ],
    correctIndex: 0,
    explanation: "Term life insurance provides a death benefit for a specific period (10, 20, or 30 years) at lower premiums than permanent insurance. It has no cash value component and is the most cost-efficient product for pure income replacement needs."
  },
  {
    id: "ins-l-002", module: "insurance-planning", difficulty: "learner",
    question: "What is an umbrella insurance policy designed to do?",
    options: [
      "Replace auto and homeowner's insurance",
      "Provide excess liability coverage above underlying auto and homeowner's policy limits",
      "Cover business liability only",
      "Protect against property damage from weather"
    ],
    correctIndex: 1,
    explanation: "A personal umbrella policy provides excess liability coverage that activates after underlying auto or homeowner's liability limits are exhausted. It protects personal assets from large judgments and often covers some claims (libel, slander) excluded by underlying policies."
  },
  {
    id: "ins-l-003", module: "insurance-planning", difficulty: "learner",
    question: "Long-term care insurance is designed to cover which type of expense?",
    options: [
      "Acute hospital care covered by Medicare",
      "Prescription drug costs",
      "Disability income replacement",
      "Custodial care needs such as assistance with activities of daily living (ADLs)"
    ],
    correctIndex: 3,
    explanation: "Long-term care insurance covers custodial care — assistance with activities of daily living (bathing, dressing, eating, toileting, transferring, continence) — which Medicare does not cover for extended periods. The national median nursing home cost exceeds $90,000 annually."
  },
  // Trainee
  {
    id: "ins-t-001", module: "insurance-planning", difficulty: "trainee",
    question: "Which disability insurance definition provides the strongest protection for a professional who becomes unable to perform their specific occupation?",
    options: [
      "Any-occupation definition",
      "Modified own-occupation",
      "Own-occupation definition",
      "Gainful employment definition"
    ],
    correctIndex: 2,
    explanation: "Own-occupation disability insurance pays benefits if the insured cannot perform the duties of their own specific occupation, even if they could work in another capacity. A surgeon who loses fine motor skills is totally disabled under own-occ even if they could teach medicine."
  },
  {
    id: "ins-t-002", module: "insurance-planning", difficulty: "trainee",
    question: "Under IRC §7702B, which type of policy qualifies as a tax-advantaged long-term care insurance contract?",
    options: [
      "Any whole life policy with a LTC rider",
      "Variable annuity with a LTC rider",
      "A policy that meets the requirements of a qualified LTC insurance contract, including coverage for chronically ill individuals and prohibition on cash surrender value",
      "Any policy sold by an insurance company"
    ],
    correctIndex: 2,
    explanation: "IRC §7702B defines qualified LTC insurance contracts. Benefits from qualified contracts are received income-tax-free. The policy must cover only qualified LTC services, provide for chronically ill individuals (unable to perform 2+ ADLs for 90+ days), and not allow cash surrender value."
  },
  {
    id: "ins-t-003", module: "insurance-planning", difficulty: "trainee",
    question: "A client has a $500,000 whole life policy. The policy's cash value is $80,000. The client surrenders the policy. What is taxable?",
    options: [
      "Only the gain (cash value minus basis/premiums paid) is ordinary income",
      "Nothing — life insurance is always tax-free",
      "The full $80,000 is ordinary income",
      "The $500,000 death benefit is taxable"
    ],
    correctIndex: 0,
    explanation: "Upon surrender of a life insurance policy, only the gain is taxable as ordinary income. The gain equals the cash surrender value minus the client's basis (total premiums paid minus dividends received). The death benefit is generally income-tax-free under IRC §101(a)."
  },
  // Associate
  {
    id: "ins-a-001", module: "insurance-planning", difficulty: "associate",
    question: "The DIME method for calculating life insurance needs accounts for which four components?",
    options: [
      "Death benefit, Income, Mortgage, Education",
      "Disability, Income, Medical, Estate",
      "Debt, Investment, Mortgage, Expenses",
      "Debt, Income replacement, Mortgage balance, Education funding"
    ],
    correctIndex: 3,
    explanation: "The DIME method calculates total life insurance need as: Debt (all consumer debt) + Income replacement (10-12x annual income or PV of future earnings) + Mortgage balance (payoff) + Education funding (projected costs for dependents). It is considered the most comprehensive coverage calculation methodology."
  },
  {
    id: "ins-a-002", module: "insurance-planning", difficulty: "associate",
    question: "A fixed indexed annuity (FIA) provides which combination of features?",
    options: [
      "Guaranteed principal with uncapped market upside",
      "Interest crediting linked to an external index with a floor at 0% and a participation cap",
      "Variable returns based directly on sub-account performance",
      "Guaranteed minimum return of 5% annually"
    ],
    correctIndex: 1,
    explanation: "FIAs credit interest based on the performance of an external index (e.g., S&P 500) subject to: a floor (typically 0% — client cannot lose principal to market losses) and a cap or participation rate that limits upside. The trade-off is protection from loss at the expense of full market participation."
  },
  {
    id: "ins-a-003", module: "insurance-planning", difficulty: "associate",
    question: "Which life insurance product type carries sub-account investment risk for the policyholder?",
    options: [
      "Variable universal life (VUL)",
      "Whole life",
      "Universal life",
      "Indexed universal life (IUL)"
    ],
    correctIndex: 0,
    explanation: "Variable universal life (VUL) policies invest in sub-accounts similar to mutual funds. The death benefit and cash value fluctuate with investment performance. Because of the investment component, VUL is regulated as a security and requires both a life insurance license and securities registration (Series 6 or 7 + Series 63/65/66)."
  },
  // Advisor
  {
    id: "ins-adv-001", module: "insurance-planning", difficulty: "advisor",
    question: "A client owns a $2M life insurance policy. He wants to transfer it to an ILIT to remove it from his taxable estate. What IRC provision must be considered?",
    options: [
      "IRC §101 — income tax exclusion for death benefits",
      "IRC §72 — annuity taxation rules",
      "IRC §2035 — the 3-year rule: transferred policies are included in the estate if the insured dies within 3 years of transfer",
      "IRC §408A — Roth IRA rules"
    ],
    correctIndex: 2,
    explanation: "IRC §2035 (the 3-year rule) requires that life insurance policies transferred to an ILIT within 3 years of the insured's death be included in the taxable estate. To avoid this, new policies should be applied for and owned by the ILIT from inception, rather than transferred from the insured."
  },
  {
    id: "ins-adv-002", module: "insurance-planning", difficulty: "advisor",
    question: "Under FINRA suitability rules, a variable annuity recommendation must consider which specific factors beyond standard suitability?",
    options: [
      "Only the client's net worth",
      "Only the current interest rate environment",
      "Whether the client has other annuities",
      "The client's need for the annuity's specific features (tax deferral, death benefit, living benefits), costs relative to alternatives, surrender charges, and whether the client has already maximized other tax-advantaged options"
    ],
    correctIndex: 3,
    explanation: "FINRA Rule 2330 (variable annuity suitability) requires a principal review of all variable annuity purchase recommendations. Factors include: whether the client genuinely needs the tax deferral (has maxed other accounts), the cost layer analysis (M&E charges, rider fees), surrender period impact on liquidity, and whether the death benefit or living benefits justify the cost."
  },
  // Senior
  {
    id: "ins-s-001", module: "insurance-planning", difficulty: "senior",
    question: "A client age 58 has a $5M estate and wants to fund a buy-sell agreement for her business. Which life insurance structure is typically most appropriate?",
    options: ["Term insurance owned by each partner personally", "Cross-purchase agreement funded by permanent life insurance owned by each co-owner on the other's life, or entity purchase funded by corporate-owned policies", "Group term life through the business", "Variable annuity with a death benefit rider"],
    correctIndex: 1,
    explanation: "Buy-sell agreements are commonly funded by permanent life insurance (typically whole life or UL) due to the indefinite need for coverage. In a cross-purchase arrangement, each owner buys a policy on the other's life; in an entity purchase, the business owns policies on each owner. The choice affects basis step-up treatment at buyout. For partnerships with 3+ owners, an entity purchase avoids the proliferation of policies."
  },
  {
    id: "ins-s-002", module: "insurance-planning", difficulty: "senior",
    question: "A 1035 exchange allows a policyholder to transfer which of the following without triggering immediate taxation?",
    options: ["Life insurance policy to another life insurance policy or annuity; annuity to annuity; but NOT annuity to life insurance", "Any financial product to any other without restriction", "Only term life to term life exchanges", "Only annuity to annuity exchanges"],
    correctIndex: 0,
    explanation: "IRC §1035 permits tax-free exchanges of: (1) life insurance to life insurance; (2) life insurance to annuity or endowment; (3) annuity to annuity; (4) endowment to annuity or endowment. An annuity CANNOT be exchanged for a life insurance policy tax-free. Gains in the original contract carry over to the new contract and are recognized upon subsequent distribution."
  },
];

// ─── TAX PLANNING ─────────────────────────────────────────────────────────────
const TAX_PLANNING_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "tax-l-001", module: "tax-planning", difficulty: "learner",
    question: "What is the 2024 standard deduction for a married filing jointly (MFJ) taxpayer?",
    options: [
      "$13,850",
      "$20,800",
      "$40,000",
      "$29,200"
    ],
    correctIndex: 3,
    explanation: "The 2024 standard deduction for married filing jointly is $29,200 under IRC §63(c). For single filers it is $14,600. Taxpayers itemize only if their itemized deductions exceed the standard deduction."
  },
  {
    id: "tax-l-002", module: "tax-planning", difficulty: "learner",
    question: "Which filing status generally results in the lowest federal income tax rate for eligible taxpayers?",
    options: ["Single", "Married Filing Separately", "Married Filing Jointly", "Head of Household"],
    correctIndex: 2,
    explanation: "Married Filing Jointly generally provides the widest tax brackets and lowest effective tax rate for eligible couples. Head of Household provides better rates than single for qualifying unmarried taxpayers with dependents."
  },
  {
    id: "tax-l-003", module: "tax-planning", difficulty: "learner",
    question: "Long-term capital gains are generally taxed at which rates for 2024?",
    options: ["The same ordinary income rates as wages", "0%, 15%, or 20% depending on taxable income", "A flat 28% rate for all taxpayers", "10% flat rate"],
    correctIndex: 1,
    explanation: "Long-term capital gains (assets held more than 12 months) are taxed at 0%, 15%, or 20% under IRC §1(h), depending on the taxpayer's taxable income. Higher-income taxpayers may also owe the 3.8% Net Investment Income Tax (NIIT) under IRC §1411."
  },
  // Trainee
  {
    id: "tax-t-001", module: "tax-planning", difficulty: "trainee",
    question: "A client is in the 22% marginal tax bracket with a MAGI of $74,000 filing single. What is the most appropriate Roth conversion strategy?",
    options: [
      "Convert enough to fill the top of the 22% bracket without crossing into the 24% bracket",
      "Convert the entire traditional IRA immediately",
      "Do not convert — Roth conversions are never appropriate at this bracket",
      "Wait until retirement to convert"
    ],
    correctIndex: 0,
    explanation: "At 22%, Roth conversion is attractive but the optimal approach is bracket-filling — converting only enough to bring taxable income to the top of the 22% bracket ($100,525 for single filers in 2024) without triggering the 24% rate. This maximizes conversion efficiency while managing the tax cost."
  },
  {
    id: "tax-t-002", module: "tax-planning", difficulty: "trainee",
    question: "What is tax-loss harvesting?",
    options: ["Selling appreciated assets to generate gains taxed at lower LTCG rates", "Selling investments at a loss to offset capital gains and up to $3,000 of ordinary income, then repurchasing similar (not substantially identical) investments", "Converting traditional IRA assets to Roth during a low-income year", "Donating appreciated securities to charity"],
    correctIndex: 1,
    explanation: "Tax-loss harvesting involves strategically selling securities at a loss to offset realized capital gains and up to $3,000 of ordinary income annually under IRC §1211. Excess losses carry forward indefinitely. The wash-sale rule (IRC §1091) prohibits repurchasing substantially identical securities within 30 days before or after the sale."
  },
  {
    id: "tax-t-003", module: "tax-planning", difficulty: "trainee",
    question: "Which type of municipal bond income is generally exempt from federal income tax?",
    options: [
      "Revenue bonds only",
      "General obligation bonds only",
      "Only bonds issued by the U.S. Treasury",
      "Both general obligation and revenue bonds issued by state and local governments"
    ],
    correctIndex: 3,
    explanation: "Interest income from bonds issued by state and local government entities is generally exempt from federal income tax under IRC §103. Municipal bonds may also be exempt from state income tax if held by in-state residents. This makes them particularly valuable for high-bracket investors."
  },
  // Associate
  {
    id: "tax-a-001", module: "tax-planning", difficulty: "associate",
    question: "The Net Investment Income Tax (NIIT) of 3.8% applies to which taxpayers in 2024?",
    options: [
      "All taxpayers with any investment income",
      "Only taxpayers in the top marginal bracket",
      "Single filers with MAGI above $200,000; MFJ filers with MAGI above $250,000, on the lesser of net investment income or MAGI above the threshold",
      "Taxpayers with passive income only"
    ],
    correctIndex: 2,
    explanation: "IRC §1411 imposes a 3.8% NIIT on the lesser of (1) net investment income or (2) the excess of MAGI over the threshold ($200,000 single / $250,000 MFJ). Net investment income includes interest, dividends, capital gains, rental income, and passive business income — but not wages or active business income."
  },
  {
    id: "tax-a-002", module: "tax-planning", difficulty: "associate",
    question: "A client donates $50,000 of highly appreciated stock (basis $10,000) to a donor-advised fund. What is the charitable deduction and what capital gains tax is owed?",
    options: [
      "Deduction of $10,000 (basis); $40,000 gain taxable",
      "Deduction of $50,000; 15% capital gains tax owed",
      "Deduction of $50,000 (FMV); no capital gains tax on the appreciation",
      "No deduction for donations to DAFs"
    ],
    correctIndex: 2,
    explanation: "Donating appreciated securities directly to a public charity (including a donor-advised fund) allows the donor to deduct the full fair market value ($50,000) under IRC §170, subject to AGI limitations (generally 30% of AGI for appreciated property to public charities). The donor avoids capital gains tax on the $40,000 built-in gain entirely."
  },
  {
    id: "tax-a-003", module: "tax-planning", difficulty: "associate",
    question: "What is the wash-sale rule and how many days does the prohibition period cover?",
    options: [
      "Prohibition on selling a security at a loss and repurchasing a substantially identical security within 30 days before or after the sale; 61-day total window",
      "Prohibition on selling and rebuying the same stock; 15 days before and after",
      "Only applies to mutual funds; 60-day window",
      "Applies only to retirement accounts"
    ],
    correctIndex: 0,
    explanation: "IRC §1091 disallows a capital loss if the taxpayer sells a security at a loss and purchases a substantially identical security within 30 days before or after the sale (61-day window total). The disallowed loss is added to the basis of the replacement security, deferring (not eliminating) the tax benefit."
  },
  // Advisor
  {
    id: "tax-adv-001", module: "tax-planning", difficulty: "advisor",
    question: "A client is in a high bracket and owns rental real estate with $500,000 of accumulated depreciation. If she sells the property, what special tax rate applies to the depreciation recapture?",
    options: [
      "0% — depreciation recapture is always tax-free",
      "The same LTCG rate of 0%, 15%, or 20%",
      "Ordinary income rates up to 37%",
      "Maximum 25% unrecaptured §1250 gain rate under IRC §1(h)(6)"
    ],
    correctIndex: 3,
    explanation: "Depreciation taken on real property (IRC §1250 property) creates 'unrecaptured §1250 gain' taxed at a maximum rate of 25% — higher than the standard LTCG rates. Any gain above depreciation recapture is taxed at LTCG rates. This is a critical consideration when advising on real estate sale timing and 1031 exchanges."
  },
  {
    id: "tax-adv-002", module: "tax-planning", difficulty: "advisor",
    question: "A client wants to defer capital gains from selling a highly appreciated business. Which vehicle provides deferral and potential exclusion of gain?",
    options: [
      "Installment sale under IRC §453",
      "Both installment sale and Opportunity Zone investment, with different mechanics and timelines",
      "Opportunity Zone investment under IRC §1400Z-2",
      "1031 exchange of business assets"
    ],
    correctIndex: 1,
    explanation: "Installment sales (IRC §453) defer gain recognition as principal payments are received. Qualified Opportunity Zone (QOZ) investments defer gain until 12/31/2026 or earlier disposition and exclude post-investment appreciation after a 10-year hold. Both are valid strategies; the choice depends on the client's reinvestment goals, timeline, and risk tolerance."
  },
  // Senior
  {
    id: "tax-s-001", module: "tax-planning", difficulty: "senior",
    question: "A client age 72 has a $2M traditional IRA and no charitable intent. Her RMD is $80,000. Her marginal rate is 32%. What is the most tax-efficient RMD strategy if she doesn't need the income?",
    options: [
      "Use a Qualified Charitable Distribution (QCD) up to $105,000 to satisfy the RMD income-tax-free",
      "Take the RMD and invest in a taxable account",
      "Roll the RMD back into the IRA",
      "Convert the RMD to a Roth IRA"
    ],
    correctIndex: 0,
    explanation: "A Qualified Charitable Distribution (QCD) under IRC §408(d)(8) allows IRA owners age 70½+ to transfer up to $105,000 (2024, indexed) directly to a qualified charity income-tax-free. The QCD counts toward the RMD without being included in AGI — reducing Medicare IRMAA exposure, taxation of Social Security, and the NIIT threshold."
  },
  {
    id: "tax-s-002", module: "tax-planning", difficulty: "senior",
    question: "A client plans to sell her C-corporation business for $10M. She originally invested $500,000 in qualified small business stock (QSBS) held for 8 years. What exclusion may apply?",
    options: [
      "No exclusion — business sale gains are fully taxable",
      "Section 1031 exchange exclusion",
      "Section 1202 exclusion — up to 100% of gain excluded from federal income tax (up to $10M or 10x basis) for QSBS held more than 5 years",
      "Capital gains exclusion of $250,000 (like primary residence)"
    ],
    correctIndex: 2,
    explanation: "IRC §1202 provides a federal income tax exclusion on gain from qualified small business stock (QSBS) for non-corporate shareholders who hold the stock for more than 5 years. For stock acquired after 9/27/2010, 100% of gain is excluded up to the greater of $10M or 10 times the taxpayer's basis. This is one of the most significant tax planning opportunities for early investors in C-corporations."
  },
];

// ─── SUITABILITY AND CLIENT FIT ───────────────────────────────────────────────
const SUITABILITY_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "suit-l-001", module: "suitability-client-fit", difficulty: "learner",
    question: "Under FINRA Rule 2111, what does 'suitability' require of a broker-dealer?",
    options: [
      "Only that the client approves the recommendation",
      "That the product has the lowest fees available",
      "That the recommendation matches what the client asks for regardless of risk",
      "That the broker have a reasonable basis to believe the recommendation is suitable based on the customer's investment profile"
    ],
    correctIndex: 3,
    explanation: "FINRA Rule 2111 requires that a broker-dealer have a reasonable basis to believe a recommendation is suitable for a customer based on the customer's investment profile, including: age, financial situation, tax status, investment objectives, experience, time horizon, liquidity needs, and risk tolerance."
  },
  {
    id: "suit-l-002", module: "suitability-client-fit", difficulty: "learner",
    question: "What does 'risk tolerance' mean in the context of an investment profile?",
    options: ["How much money the client can afford to invest", "The client's emotional and financial ability to withstand investment losses without abandoning their strategy", "The maximum return the client expects", "The client's preferred investment time horizon"],
    correctIndex: 1,
    explanation: "Risk tolerance reflects both the client's psychological ability to handle investment volatility (emotional tolerance) and their financial capacity to absorb losses without jeopardizing their goals (financial capacity). Both dimensions must be assessed in building a suitable investment recommendation."
  },
  // Trainee
  {
    id: "suit-t-001", module: "suitability-client-fit", difficulty: "trainee",
    question: "Under Regulation Best Interest (Reg BI), what standard applies to broker-dealer recommendations to retail customers?",
    options: [
      "Best interest standard — the recommendation must be in the retail customer's best interest at the time of the recommendation, without placing the firm's financial interests ahead of the customer's",
      "Suitability standard only",
      "Fiduciary standard applying at all times",
      "No standard — market participants may recommend freely"
    ],
    correctIndex: 0,
    explanation: "SEC Regulation Best Interest (effective June 2020) requires broker-dealers to act in the best interest of retail customers when making recommendations, without placing their own financial interests ahead of the customer's. Reg BI is stronger than the old suitability standard but does not impose a continuous fiduciary duty like the RIA standard."
  },
  {
    id: "suit-t-002", module: "suitability-client-fit", difficulty: "trainee",
    question: "A 70-year-old retired client with moderate risk tolerance asks to put 80% of her liquid assets in a single tech stock. What is the appropriate response?",
    options: [
      "Execute the trade as instructed — the client has the right to choose",
      "Refuse all trading unless the allocation is changed",
      "Contact the manager without speaking to the client",
      "Explain that concentration in a single security is inconsistent with her moderate risk profile and retirement income needs, and document the conversation"
    ],
    correctIndex: 3,
    explanation: "While clients have the right to make their own decisions, the advisor's duty is to ensure the client understands the suitability conflict. The advisor should explain the risks, document the conversation, and if the client insists after being informed, execute with appropriate documentation of the client's informed decision and the advisor's recommendation against it."
  },
  // Associate
  {
    id: "suit-a-001", module: "suitability-client-fit", difficulty: "associate",
    question: "Under the Investment Advisers Act of 1940, what fiduciary duty does a registered investment adviser owe to clients?",
    options: [
      "Suitability standard only when making recommendations",
      "Best interest standard only at point of sale",
      "A fiduciary duty: the duty of loyalty (act in client's best interest) and the duty of care (provide competent advice based on reasonable investigation) at all times",
      "No duty beyond disclosing conflicts of interest"
    ],
    correctIndex: 2,
    explanation: "Registered Investment Advisers (RIAs) owe a fiduciary duty under the Investment Advisers Act of 1940 as interpreted by the SEC. This includes: (1) duty of loyalty — client interests above advisor's; (2) duty of care — reasonable investigation and competent advice. This is a continuous obligation, not just at the point of recommendation."
  },
  {
    id: "suit-a-002", module: "suitability-client-fit", difficulty: "associate",
    question: "Which of the following is an example of a prohibited transaction under ERISA for a plan fiduciary?",
    options: [
      "Investing plan assets in diversified index funds",
      "Self-dealing — the fiduciary uses plan assets for personal benefit or enters transactions on behalf of parties whose interests are adverse to the plan",
      "Selecting a plan administrator through a competitive bid process",
      "Documenting investment policy decisions"
    ],
    correctIndex: 1,
    explanation: "ERISA §406 prohibits transactions between a plan and a 'party in interest,' including: self-dealing by fiduciaries, use of plan assets for the fiduciary's benefit, and receipt of consideration for personal account from a party dealing with the plan. Violations can result in personal liability and excise taxes."
  },
  // Advisor
  {
    id: "suit-adv-001", module: "suitability-client-fit", difficulty: "advisor",
    question: "A client with a moderate risk profile receives a recommendation to purchase a complex structured product with a 7-year lockup. What suitability considerations are most critical?",
    options: [
      "Liquidity needs, time horizon, complexity risk (client's ability to understand the product), and whether the illiquidity premium justifies the lockup given the client's specific situation",
      "Only whether the expected return exceeds inflation",
      "Whether the product was approved by FINRA",
      "Only the credit rating of the issuer"
    ],
    correctIndex: 0,
    explanation: "Complex products with extended illiquidity require thorough suitability documentation. Critical factors: (1) liquidity needs — does the client need these funds within 7 years?; (2) time horizon compatibility; (3) complexity risk — can the client understand the product's mechanics and risks?; (4) whether the illiquidity premium is commensurate with the risk. FINRA Regulatory Notice 12-03 addresses complex product suitability."
  },
  // Senior
  {
    id: "suit-s-001", module: "suitability-client-fit", difficulty: "senior",
    question: "A discretionary RIA manages a client's account and rebalances it without prior client approval. Which legal framework governs this relationship and what are the key obligations?",
    options: [
      "FINRA Rule 2111 suitability standard — best interest at each trade",
      "The Investment Advisers Act fiduciary standard — the adviser must act in the client's best interest at all times, disclose all material conflicts, and manage the account consistently with the client's Investment Policy Statement",
      "SEC Reg BI applies to all discretionary management",
      "No regulation applies to discretionary accounts"
    ],
    correctIndex: 1,
    explanation: "Discretionary RIA management is governed by the Investment Advisers Act fiduciary standard. The adviser must: (1) maintain a written IPS reflecting client goals and constraints; (2) rebalance consistently with the IPS; (3) disclose and manage conflicts; (4) document all investment decisions. Form ADV Parts 1 and 2 must be maintained and delivered to clients."
  },
];

// ─── BANK LENDING ─────────────────────────────────────────────────────────────
const BANK_LENDING_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "bl-l-001", module: "bank-lending", difficulty: "learner",
    question: "What does DTI stand for in consumer lending and what does it measure?",
    options: [
      "Down payment to Income — the down payment as a percentage of income",
      "Default to Interest — the default risk relative to interest rate",
      "Deferred Tax Income — tax deferral benefit of the loan",
      "Debt-to-Income ratio — monthly debt payments divided by gross monthly income"
    ],
    correctIndex: 3,
    explanation: "Debt-to-Income (DTI) ratio measures the percentage of a borrower's gross monthly income consumed by monthly debt obligations. Front-end DTI covers housing costs only; back-end DTI includes all monthly debt payments. Most conventional mortgage programs require back-end DTI below 43-45%."
  },
  {
    id: "bl-l-002", module: "bank-lending", difficulty: "learner",
    question: "What credit score range is generally considered 'Very Good' by FICO?",
    options: [
      "580-669",
      "670-739",
      "740-799",
      "800-850"
    ],
    correctIndex: 2,
    explanation: "FICO scores range from 300-850. Score ranges: 300-579 (Poor), 580-669 (Fair), 670-739 (Good), 740-799 (Very Good), 800-850 (Exceptional). Scores of 740+ typically qualify for the best interest rates. Lenders use FICO scores to assess creditworthiness and price risk."
  },
  // Trainee
  {
    id: "bl-t-001", module: "bank-lending", difficulty: "trainee",
    question: "Under the Equal Credit Opportunity Act (ECOA), which factors are prohibited bases for credit decisions?",
    options: [
      "Debt-to-income ratio and credit score",
      "Employment history and income stability",
      "Race, color, religion, national origin, sex, marital status, age, or receipt of public assistance income",
      "Collateral type and loan purpose"
    ],
    correctIndex: 2,
    explanation: "ECOA (Regulation B) prohibits creditors from discriminating against credit applicants based on: race, color, religion, national origin, sex, marital status, age (provided the applicant is of legal age), or because the applicant receives income from a public assistance program. Violations can result in regulatory penalties and private lawsuits."
  },
  {
    id: "bl-t-002", module: "bank-lending", difficulty: "trainee",
    question: "What is the primary purpose of the Truth in Lending Act (TILA) in consumer credit?",
    options: [
      "To require clear and standardized disclosure of credit terms including APR, finance charges, and total cost of credit",
      "To set maximum interest rates on consumer loans",
      "To prohibit prepayment penalties on all loans",
      "To regulate credit bureau reporting"
    ],
    correctIndex: 0,
    explanation: "TILA (Regulation Z) requires lenders to disclose credit terms in a standardized format, including: Annual Percentage Rate (APR), finance charges, amount financed, and total payment. The APR includes both interest and certain fees, enabling consumers to compare loan costs across lenders."
  },
  // Associate
  {
    id: "bl-a-001", module: "bank-lending", difficulty: "associate",
    question: "A loan applicant has a 720 FICO score, 38% back-end DTI, and 6 months of reserves. How would a conventional underwriter likely classify this file?",
    options: [
      "Decline — DTI is too high",
      "Conditional approval only due to borderline DTI",
      "Requires additional collateral regardless of metrics",
      "Approve — all three metrics fall within conventional guidelines for a standard approval"
    ],
    correctIndex: 3,
    explanation: "Conventional underwriting guidelines (Fannie Mae/Freddie Mac): FICO 720 exceeds the 620 minimum; 38% back-end DTI is within the standard 43-45% maximum (with compensating factors pushing to 50%); 6 months of reserves exceeds most program minimums. This profile represents a standard approvable file."
  },
  {
    id: "bl-a-002", module: "bank-lending", difficulty: "associate",
    question: "What is the primary distinction between a recourse and non-recourse loan?",
    options: ["Recourse loans have lower interest rates than non-recourse loans", "In a recourse loan, the lender can pursue the borrower's other assets beyond the collateral if the collateral is insufficient to cover the debt; in a non-recourse loan, the lender's remedy is limited to the collateral", "Non-recourse loans require more documentation", "Recourse loans are only available for commercial properties"],
    correctIndex: 1,
    explanation: "A recourse loan allows the lender to seek a deficiency judgment against the borrower's personal assets if collateral sale proceeds are insufficient to cover the outstanding debt. A non-recourse loan limits the lender's remedy to the collateral — the borrower has no personal liability beyond the asset. Commercial real estate lending commonly involves both structures."
  },
  // Advisor
  {
    id: "bl-adv-001", module: "bank-lending", difficulty: "advisor",
    question: "Under the Community Reinvestment Act (CRA), what is required of depository institutions?",
    options: [
      "Banks are encouraged to meet the credit needs of all communities they serve, including low- and moderate-income (LMI) neighborhoods, consistent with safe and sound banking",
      "Banks must lend exclusively to low-income borrowers",
      "Banks must charge below-market rates in underserved areas",
      "CRA applies only to mortgage lending"
    ],
    correctIndex: 0,
    explanation: "The CRA (1977) requires federal banking regulators to assess how well depository institutions meet the credit needs of their entire community, including LMI areas. Banks receive CRA ratings (Outstanding, Satisfactory, Needs to Improve, Substantial Noncompliance) that can affect merger approvals and branch applications."
  },
  // Senior
  {
    id: "bl-s-001", module: "bank-lending", difficulty: "senior",
    question: "A commercial borrower requests a $5M term loan secured by an office building. The lender's underwriting shows a 1.15x DSCR and 72% LTV. How should the lender assess this file?",
    options: [
      "Approve immediately — both metrics are within typical ranges",
      "Decline — 72% LTV is too high",
      "Conditional approval — DSCR of 1.15x is near the minimum threshold (typically 1.20-1.25x for commercial); LTV of 72% is acceptable; require additional reserves or guaranty to compensate for thin debt coverage",
      "Approve without conditions — DSCR above 1.0x is always sufficient"
    ],
    correctIndex: 2,
    explanation: "Commercial real estate underwriting typically requires DSCR of 1.20-1.25x minimum (net operating income / debt service). A 1.15x DSCR is below most standard thresholds and indicates thin coverage — a modest NOI decline could impair debt service. LTV of 72% is within conventional commercial limits (typically 75-80%). The appropriate response is conditional approval with compensating factors such as personal guaranty, reserves, or a lockbox arrangement."
  },
];

// ─── MORTGAGE AND DEBT PLANNING ───────────────────────────────────────────────
const MORTGAGE_QUESTIONS: ModuleClientQuestion[] = [
  // Learner
  {
    id: "mtg-l-001", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is the primary difference between a fixed-rate and adjustable-rate mortgage (ARM)?",
    options: [
      "Fixed-rate mortgages always have lower payments",
      "ARMs are only available for commercial properties",
      "Fixed-rate mortgages have no prepayment penalties",
      "A fixed-rate mortgage has a constant interest rate for the life of the loan; an ARM has a rate that adjusts periodically based on an index after an initial fixed period"
    ],
    correctIndex: 3,
    explanation: "A fixed-rate mortgage maintains the same interest rate and principal/interest payment throughout the loan term, providing payment certainty. An ARM offers a lower initial rate for a fixed period (e.g., 5/1 ARM: fixed for 5 years, adjusts annually), then adjusts based on an index (typically SOFR or Treasury rate) plus a margin."
  },
  {
    id: "mtg-l-002", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is PMI (Private Mortgage Insurance) and when is it typically required?",
    options: [
      "Insurance that pays the borrower's mortgage if the lender fails",
      "Insurance required by lenders when the borrower's down payment is less than 20% of the home's purchase price, protecting the lender from default loss",
      "A government program for first-time homebuyers",
      "Insurance for the home's contents"
    ],
    correctIndex: 1,
    explanation: "PMI protects the lender (not the borrower) against loss if the borrower defaults. It is typically required when LTV exceeds 80% (down payment less than 20%). PMI can be canceled when the loan balance reaches 80% of the original appraised value under the Homeowners Protection Act."
  },
  // Trainee
  {
    id: "mtg-t-001", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "Under the Ability-to-Repay (ATR) rule (CFPB Regulation Z), what must a lender determine before making a residential mortgage?",
    options: [
      "That the borrower has a reasonable ability to repay the loan based on verified income, assets, employment, credit history, monthly mortgage payment, and other obligations",
      "Only that the borrower has a good credit score",
      "That the property will appreciate in value",
      "Only that the LTV is below 90%"
    ],
    correctIndex: 0,
    explanation: "The CFPB's ATR rule (Dodd-Frank/Regulation Z) requires lenders to make a reasonable, good-faith determination that the borrower can repay a residential mortgage. Lenders must verify and document income, assets, employment, credit history, PITIA payment, other debt obligations, and monthly DTI. Qualified Mortgages (QMs) receive a safe harbor presumption of ATR compliance."
  },
  {
    id: "mtg-t-002", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What is the mortgage interest deduction and what is the current limit on deductible mortgage debt?",
    options: [
      "Interest on up to $500,000 of mortgage debt is deductible; available to all taxpayers",
      "All mortgage interest is fully deductible with no limit",
      "The deduction was eliminated by the TCJA",
      "Interest on up to $750,000 of acquisition indebtedness ($375,000 MFS) on a primary or secondary residence is deductible for taxpayers who itemize under IRC §163(h)"
    ],
    correctIndex: 3,
    explanation: "IRC §163(h) allows itemizing taxpayers to deduct interest on up to $750,000 of acquisition indebtedness ($375,000 for married filing separately) for loans originated after 12/15/2017. Grandfathered loans (origination before 12/16/2017) retain the $1M limit. Home equity loan interest is deductible only if proceeds are used to buy, build, or substantially improve the residence."
  },
  // Associate
  {
    id: "mtg-a-001", module: "mortgage-debt-planning", difficulty: "associate",
    question: "A client wants to refinance her mortgage. Her current rate is 7.5% and the new rate would be 6.5%. Closing costs are $6,000. What is the approximate break-even period?",
    options: [
      "6 months",
      "5 years",
      "Approximately 12-24 months — monthly savings must be calculated against closing costs",
      "Break-even analysis is irrelevant for refinancing decisions"
    ],
    correctIndex: 2,
    explanation: "Break-even = Closing costs ÷ Monthly payment savings. At a $400,000 balance, the 1% rate reduction saves approximately $250-280/month. $6,000 ÷ $265/month ≈ 22-23 months break-even. If the client plans to stay in the home longer than 23 months, the refinance is beneficial. This is the standard refinancing analysis framework."
  },
  {
    id: "mtg-a-002", module: "mortgage-debt-planning", difficulty: "associate",
    question: "What is a Qualified Mortgage (QM) under CFPB rules and what protection does it provide lenders?",
    options: ["Any mortgage approved by a licensed lender", "A mortgage meeting CFPB-defined criteria including DTI ≤ 43% (or pricing threshold for GSE-eligible loans), no risky features (IO, negative amortization, balloon payments after 7 years), and limited points and fees — providing a safe harbor for ATR compliance", "A government-backed mortgage only", "A fixed-rate mortgage with a 30-year term"],
    correctIndex: 1,
    explanation: "A Qualified Mortgage under CFPB Regulation Z provides lenders with a safe harbor (or rebuttable presumption) that they complied with the ATR rule. QM criteria prohibit: negative amortization, interest-only periods, balloon payments (except for certain small creditors), loan terms over 30 years, and points/fees exceeding 3% of loan amount. DTI considerations apply through price-based QM thresholds."
  },
  // Advisor
  {
    id: "mtg-adv-001", module: "mortgage-debt-planning", difficulty: "advisor",
    question: "A client with a $1.2M mortgage at 3.25% asks whether she should aggressively pay down the mortgage given current market conditions. What is the most analytically complete response?",
    options: [
      "Compare the after-tax mortgage rate to the risk-adjusted expected return on alternative investments; at 3.25% with a mortgage interest deduction, the hurdle rate is low — investing in a diversified portfolio may generate superior risk-adjusted returns, but behavioral and cash-flow factors must also be considered",
      "Always pay down debt — it is always the safest financial choice",
      "Never pay down a mortgage — always invest instead",
      "Pay down the mortgage only if the balance exceeds $750,000"
    ],
    correctIndex: 0,
    explanation: "Mortgage paydown vs. invest analysis: the effective after-tax cost of a 3.25% mortgage for an itemizing taxpayer in the 32% bracket is approximately 2.21%. Expected long-term diversified portfolio returns historically exceed this threshold. However, the analysis must account for: investment risk and sequence-of-returns, client risk tolerance, behavioral factors, liquidity needs, and the certainty of debt elimination versus uncertain investment returns."
  },
  // Senior
  {
    id: "mtg-s-001", module: "mortgage-debt-planning", difficulty: "senior",
    question: "A 68-year-old client is considering a reverse mortgage (HECM) to supplement retirement income. What are the key FINRA/HUD-required disclosures and considerations?",
    options: [
      "No special disclosures required — treat like a standard mortgage",
      "HUD requires independent HECM counseling before application; key considerations include: non-recourse feature (no liability beyond home value), loan balance grows over time, title remains with borrower but all owners must be 62+, triggers (death, sale, non-occupancy >12 months, failure to maintain taxes/insurance) cause repayment, and impact on Medicaid spend-down",
      "HECM is available at any age",
      "HECM proceeds are taxable income"
    ],
    correctIndex: 1,
    explanation: "HECMs (Home Equity Conversion Mortgages) require HUD-approved counseling before application. Key features: (1) non-recourse — borrower/estate never owes more than home value; (2) no monthly payments required; (3) loan balance accrues with interest; (4) all borrowers must be 62+; (5) home must be primary residence; (6) triggers repayment if borrower dies, sells, or vacates 12+ months; (7) borrower responsible for taxes, insurance, maintenance. HECM proceeds are loan advances — not taxable income."
  },
];

// ─── Master question bank ─────────────────────────────────────────────────────
export const MODULE_CLIENT_QUESTIONS: ModuleClientQuestion[] = [
  ...RETIREMENT_QUESTIONS,
  ...QUALIFIED_PLAN_QUESTIONS,
  ...ESTATE_PLANNING_QUESTIONS,
  ...INSURANCE_QUESTIONS,
  ...TAX_PLANNING_QUESTIONS,
  ...SUITABILITY_QUESTIONS,
  ...BANK_LENDING_QUESTIONS,
  ...MORTGAGE_QUESTIONS,
];

type DepthQuestionSeed = {
  id: string;
  module: ModuleQuestionModule;
  topic: string;
  correct: string;
  wrongA: string;
  wrongB: string;
  wrongC: string;
  explanation: string;
};

function makeDepthExpansion(seeds: DepthQuestionSeed[]): ModuleClientQuestion[] {
  return seeds.map((seed) => ({
    id: seed.id,
    module: seed.module,
    difficulty: "learner",
    question: `Which response best handles ${seed.topic}?`,
    options: [seed.wrongA, seed.correct, seed.wrongB, seed.wrongC],
    correctIndex: 1,
    explanation: seed.explanation
  }));
}

const MODULE_DEPTH_EXPANSION = makeDepthExpansion([
  { id: "ret-d-001", module: "retirement-planning", topic: "a retiree who wants income before age 59 1/2", correct: "Review penalty exceptions, cash reserves, taxable assets, and whether a 72(t) schedule is appropriate before using retirement funds", wrongA: "Recommend an immediate IRA withdrawal because retirement funds are always available", wrongB: "Move the full account to equities to replace the withdrawn cash", wrongC: "Ignore taxes because early withdrawals are only a brokerage issue", explanation: "Early retirement-account withdrawals can create ordinary income tax and a 10% penalty unless an exception applies. The advisor should compare taxable liquidity, cash reserves, and structured exceptions before recommending a distribution." },
  { id: "ret-d-002", module: "retirement-planning", topic: "a client deciding between Roth and traditional contributions", correct: "Compare current tax bracket, expected retirement bracket, employer match rules, and future tax-rate risk", wrongA: "Always recommend Roth contributions for every client", wrongB: "Always recommend traditional contributions because deductions are immediate", wrongC: "Base the decision only on the client's age", explanation: "Roth versus traditional analysis depends on tax-rate timing and cash-flow tradeoffs. A good recommendation also considers plan features, employer contributions, and whether tax diversification is useful." },
  { id: "ret-d-003", module: "retirement-planning", topic: "sequence-of-returns risk during the first years of retirement", correct: "Maintain near-term spending reserves and avoid forced equity sales after market declines", wrongA: "Increase withdrawals after a decline to keep income level", wrongB: "Concentrate all assets in the best recent performer", wrongC: "Ignore the risk because long-term returns average out", explanation: "Losses early in retirement can permanently impair a portfolio when withdrawals continue during a downturn. Cash reserves, bond ladders, and flexible spending rules reduce the need to sell depressed growth assets." },
  { id: "ret-d-004", module: "retirement-planning", topic: "a client with multiple old 401(k) accounts", correct: "Compare fees, investment menus, creditor protection, service needs, and rollover consequences before consolidating", wrongA: "Roll every plan to an IRA automatically", wrongB: "Leave every account untouched regardless of cost", wrongC: "Liquidate the plans and rebuild in a taxable account", explanation: "Consolidation can simplify oversight but may reduce ERISA creditor protection or change available investment options. The recommendation should document why a rollover, plan-to-plan transfer, or status quo fits the client's facts." },
  { id: "ret-d-005", module: "retirement-planning", topic: "retirement healthcare costs before Medicare eligibility", correct: "Model ACA coverage, COBRA, HSA assets, bridge reserves, and the risk of high out-of-pocket expenses", wrongA: "Assume Medicare begins at retirement regardless of age", wrongB: "Use IRA funds without considering tax impact", wrongC: "Recommend dropping coverage until age 65", explanation: "Clients retiring before age 65 need a healthcare bridge because Medicare generally does not begin until 65. Premium subsidies, taxable income, and reserve planning should be reviewed together." },
  { id: "ret-d-006", module: "retirement-planning", topic: "a client asking whether to annuitize part of retirement assets", correct: "Assess essential expenses, Social Security, pension income, liquidity needs, inflation risk, and insurer strength", wrongA: "Annuitize the entire portfolio for maximum certainty", wrongB: "Reject annuities automatically because they pay commissions", wrongC: "Choose the highest first-year payout only", explanation: "Annuities can help cover essential lifetime expenses but reduce liquidity and may expose the client to inflation or insurer risk. The analysis should separate income-floor needs from discretionary and legacy assets." },
  { id: "ret-d-007", module: "retirement-planning", topic: "RMD coordination across multiple traditional IRAs", correct: "Calculate each IRA's RMD separately but allow the aggregate IRA RMD to be taken from one or more IRAs", wrongA: "Take a separate RMD from every IRA with no aggregation allowed", wrongB: "Aggregate IRA and 401(k) RMDs and take the total from any account", wrongC: "Skip RMDs from small accounts", explanation: "Traditional IRA RMDs are calculated separately but may generally be aggregated and withdrawn from one or more IRAs. Employer plan RMDs usually cannot be satisfied from an IRA, so account type matters." },
  { id: "ret-d-008", module: "retirement-planning", topic: "a retiree considering a large one-year Roth conversion", correct: "Model marginal brackets, Medicare IRMAA, NIIT, cash tax payment, and multi-year conversion windows", wrongA: "Convert everything immediately because Roth money is tax-free", wrongB: "Never convert after retirement begins", wrongC: "Convert only enough to empty taxable accounts", explanation: "A Roth conversion can improve long-term tax diversification but may create avoidable tax spikes. IRMAA surcharges, bracket stacking, and available cash for taxes must be modeled before recommending size." },
  { id: "ret-d-009", module: "retirement-planning", topic: "beneficiary designations on retirement accounts", correct: "Verify primary and contingent beneficiaries and coordinate them with the estate plan and trust language", wrongA: "Rely on the will to override all retirement beneficiaries", wrongB: "Name the estate by default for every account", wrongC: "Avoid contingent beneficiaries to keep choices flexible", explanation: "Retirement accounts usually pass by beneficiary designation rather than by will. Incorrect or outdated designations can create tax acceleration, probate involvement, or results that conflict with the client's estate plan." },
  { id: "ret-d-010", module: "retirement-planning", topic: "a client who wants to spend aggressively early in retirement", correct: "Stress test the withdrawal rate, inflation, market downturns, healthcare costs, and later-life care before approving the plan", wrongA: "Approve any withdrawal if the first-year balance is high", wrongB: "Assume future returns will cover spending increases", wrongC: "Use only average annual return in the projection", explanation: "Sustainable spending depends on more than the current portfolio value. Stress testing poor return sequences and rising expenses helps show whether early spending could jeopardize later retirement security." },
  { id: "ret-d-011", module: "retirement-planning", topic: "a client holding concentrated employer stock in a retirement plan", correct: "Review NUA treatment, tax basis, diversification needs, and rollover consequences before moving the shares", wrongA: "Roll everything to an IRA immediately", wrongB: "Sell the stock inside the plan without tax review", wrongC: "Keep all employer stock forever to avoid taxes", explanation: "Net Unrealized Appreciation treatment may allow favorable capital-gain taxation on employer stock distributed in kind. A rollover can eliminate that opportunity, so the tax analysis must happen before the transaction." },
  { id: "ret-d-012", module: "retirement-planning", topic: "a retired client with high cash balances", correct: "Match cash reserves to spending needs while evaluating inflation drag and reinvestment risk", wrongA: "Move all cash to long-term equities immediately", wrongB: "Keep all retirement assets in cash permanently", wrongC: "Ignore cash because it has no market volatility", explanation: "Cash reduces short-term volatility but loses purchasing power when inflation exceeds yields. The right reserve level should support near-term withdrawals without sacrificing the long-term growth needed for retirement." },
  { id: "ret-d-013", module: "retirement-planning", topic: "a client with pension lump-sum versus monthly annuity options", correct: "Compare mortality assumptions, survivor benefits, discount rate, inflation protection, liquidity, and pension guaranty risk", wrongA: "Take the lump sum automatically", wrongB: "Take the monthly annuity automatically", wrongC: "Choose based only on the largest first-year payment", explanation: "The pension decision is a present-value and risk-transfer analysis. Survivor needs, health, inflation features, and the client's ability to manage assets all affect the recommendation." },
  { id: "ret-d-014", module: "retirement-planning", topic: "retirement income for a client with variable expenses", correct: "Separate essential, discretionary, and legacy goals and fund each with appropriate risk and liquidity", wrongA: "Use one fixed withdrawal for all spending categories", wrongB: "Invest all assets the same way regardless of purpose", wrongC: "Fund legacy goals before essential expenses", explanation: "Different spending categories have different flexibility and risk tolerance. Essential expenses often need stable funding, while discretionary and legacy goals can tolerate more market exposure." },
  { id: "ret-d-015", module: "retirement-planning", topic: "a client retiring with a mortgage", correct: "Compare after-tax mortgage cost, liquidity, portfolio return assumptions, risk tolerance, and psychological preference", wrongA: "Always pay off the mortgage before retirement", wrongB: "Never pay off low-rate debt", wrongC: "Use retirement withdrawals without tax analysis", explanation: "Mortgage payoff in retirement is not only an interest-rate comparison. Taxes, cash reserves, sequence risk, and client comfort with debt must all be weighed." },
  { id: "ret-d-016", module: "retirement-planning", topic: "Social Security claiming for a married couple", correct: "Coordinate both spouses' ages, earnings records, survivor benefit needs, health, and expected longevity", wrongA: "Have both spouses claim at 62 by default", wrongB: "Have both spouses delay to 70 in every case", wrongC: "Analyze each spouse separately with no survivor review", explanation: "Married claiming strategies affect both lifetime income and survivor benefits. The higher earner's delay can materially improve the surviving spouse's future income floor." },
  { id: "ret-d-017", module: "retirement-planning", topic: "retirement plan loans near separation from service", correct: "Review repayment rules, offset treatment, rollover deadline, and tax consequences if the loan defaults", wrongA: "Ignore the loan because it is owed to the client", wrongB: "Treat the outstanding balance as tax-free income", wrongC: "Recommend separation without loan review", explanation: "Outstanding plan loans can become taxable deemed distributions or loan offsets after employment ends. The client may have a limited rollover window to avoid taxes and penalties." },
  { id: "ret-d-018", module: "retirement-planning", topic: "inflation protection in retirement income planning", correct: "Include COLA sources, TIPS, equity exposure, spending flexibility, and healthcare inflation in the plan", wrongA: "Use nominal dollars only", wrongB: "Assume inflation is always 2% without stress testing", wrongC: "Move everything to fixed nominal payments", explanation: "Inflation erodes purchasing power over a retirement that may last decades. Plans should test higher inflation and include assets or income sources that can adjust over time." },
  { id: "ret-d-019", module: "retirement-planning", topic: "a retiree making Qualified Charitable Distributions", correct: "Confirm age eligibility, IRA source, direct transfer to charity, annual limit, and RMD coordination", wrongA: "Send funds from a 401(k) directly as a QCD", wrongB: "Let the client receive the cash first and donate later", wrongC: "Use QCDs before age 59 1/2", explanation: "QCDs can exclude IRA distributions from taxable income when paid directly to a qualified charity by an eligible IRA owner. They can also satisfy RMDs, but the transaction must be structured correctly." },
  { id: "ret-d-020", module: "retirement-planning", topic: "a client with retirement assets and no emergency fund", correct: "Build liquid reserves before relying on retirement accounts for unpredictable expenses", wrongA: "Use retirement accounts as the emergency fund", wrongB: "Invest emergency assets in illiquid alternatives", wrongC: "Skip reserves because retirement accounts are large", explanation: "Retirement accounts may carry tax costs, penalties, or market timing risk when used for emergencies. Liquid reserves reduce forced distributions and protect the retirement plan during shocks." },
  { id: "ret-d-021", module: "retirement-planning", topic: "a client asking about target-date funds in retirement", correct: "Review glide path, fees, asset allocation, withdrawal needs, and whether the fund remains appropriate after retirement", wrongA: "Assume every target-date fund is identical", wrongB: "Use only the date in the fund name", wrongC: "Switch automatically to money market at retirement", explanation: "Target-date funds differ significantly in risk level and post-retirement glide path. The fund should be evaluated against actual spending needs and risk tolerance rather than selected only by retirement year." },
  { id: "ret-d-022", module: "retirement-planning", topic: "retirement account titling after divorce", correct: "Review beneficiary updates, QDRO requirements, IRA transfer rules, and estate documents after the decree", wrongA: "Assume divorce automatically changes every beneficiary", wrongB: "Transfer qualified plan assets without a QDRO", wrongC: "Delay account updates until the next annual review", explanation: "Divorce can create major retirement-account and beneficiary issues if documents are not updated. Qualified plans generally require a QDRO for division, while IRAs use transfer incident to divorce rules." },

  { id: "qp-d-001", module: "qualified-plans", topic: "a plan participant requesting a hardship distribution", correct: "Confirm plan terms, immediate and heavy financial need, available alternatives, taxes, penalties, and documentation", wrongA: "Approve every hardship request immediately", wrongB: "Treat hardship withdrawals as tax-free loans", wrongC: "Ignore plan-document limits", explanation: "Hardship distributions must satisfy plan and tax requirements and are generally taxable. Documentation and participant consequences should be reviewed before a recommendation is made." },
  { id: "qp-d-002", module: "qualified-plans", topic: "automatic enrollment in a 401(k) plan", correct: "Explain default deferral, opt-out rights, qualified default investment alternatives, and escalation features", wrongA: "Tell employees enrollment cannot be declined", wrongB: "Default all assets to employer stock", wrongC: "Skip notice requirements", explanation: "Automatic enrollment can improve participation but must follow notice and default investment rules. Employees retain opt-out rights, and default investments should be prudent QDIAs." },
  { id: "qp-d-003", module: "qualified-plans", topic: "a late employee deferral deposit", correct: "Identify the operational failure, calculate lost earnings, correct promptly, and document the process", wrongA: "Wait until year-end to deposit all missed deferrals", wrongB: "Ignore small late deposits", wrongC: "Offset late deposits with future employer match", explanation: "Employee deferrals must be deposited as soon as they can reasonably be segregated from employer assets. Late deposits can require correction, lost earnings, and reporting." },
  { id: "qp-d-004", module: "qualified-plans", topic: "plan fee reasonableness", correct: "Benchmark investment and administrative fees and document fiduciary review of service providers", wrongA: "Select the cheapest provider without service review", wrongB: "Assume fees are reasonable because participants pay them", wrongC: "Review fees only when sued", explanation: "ERISA fiduciaries must monitor plan fees and services for reasonableness. The process and documentation matter even when fees are not the lowest available." },
  { id: "qp-d-005", module: "qualified-plans", topic: "a participant with employer stock in a qualified plan", correct: "Review concentration risk, diversification rights, NUA treatment, and fiduciary monitoring obligations", wrongA: "Require all participants to hold employer stock", wrongB: "Sell all shares without tax review", wrongC: "Ignore concentration because it is inside a plan", explanation: "Employer stock can create both investment concentration and special tax planning issues. Participants may have diversification rights, and NUA should be reviewed before rollover decisions." },
  { id: "qp-d-006", module: "qualified-plans", topic: "safe harbor match notices", correct: "Confirm the plan provides required notices and funds contributions according to the safe harbor formula", wrongA: "Skip notices if the match is generous", wrongB: "Change the formula informally midyear", wrongC: "Use forfeitures to avoid required contributions without plan authority", explanation: "Safe harbor status depends on satisfying plan terms and notice requirements. Failure can jeopardize nondiscrimination testing relief and require correction." },
  { id: "qp-d-007", module: "qualified-plans", topic: "a participant exceeding the annual deferral limit", correct: "Return excess deferrals and earnings by the correction deadline and coordinate across all plans", wrongA: "Leave the excess in the plan permanently", wrongB: "Reclassify the excess as employer match", wrongC: "Ignore deferrals made to another employer's plan", explanation: "Excess deferrals can create double taxation if not corrected timely. Participants must coordinate deferrals across unrelated employers because the limit is personal." },
  { id: "qp-d-008", module: "qualified-plans", topic: "a plan loan request", correct: "Apply plan loan limits, repayment terms, interest rules, and default consequences before approval", wrongA: "Allow any loan amount if the account balance is high", wrongB: "Treat loan proceeds as taxable at issuance", wrongC: "Skip repayment schedules for owners", explanation: "Plan loans must satisfy statutory and plan limits, including repayment and amortization rules. Defaults can become taxable distributions and may trigger penalties." },
  { id: "qp-d-009", module: "qualified-plans", topic: "required minimum distributions from employer plans", correct: "Confirm age, ownership status, still-working exception, plan type, and separate-plan RMD rules", wrongA: "Aggregate all employer plan RMDs with IRAs", wrongB: "Skip RMDs for every active employee", wrongC: "Use Roth IRA rules for traditional 401(k) balances", explanation: "Employer plan RMD rules differ from IRA rules and may include a still-working exception for non-5% owners. Each plan's RMD usually must be satisfied from that plan." },
  { id: "qp-d-010", module: "qualified-plans", topic: "a QDRO review", correct: "Verify the order assigns plan benefits clearly and is qualified before distributing assets", wrongA: "Pay benefits based only on a divorce decree", wrongB: "Apply IRA transfer rules to every qualified plan", wrongC: "Distribute assets before administrator approval", explanation: "Qualified plans require a valid QDRO before benefits can be assigned to an alternate payee. The administrator must determine whether the order meets plan and ERISA requirements." },
  { id: "qp-d-011", module: "qualified-plans", topic: "top-heavy plan status", correct: "Review key employee balances, required minimum contributions, and testing results", wrongA: "Ignore top-heavy rules for small employers", wrongB: "Count only current-year contributions", wrongC: "Eliminate testing by freezing participant accounts", explanation: "Top-heavy rules apply when key employees hold too much of the plan's value. If triggered, the employer may owe minimum contributions to non-key employees." },
  { id: "qp-d-012", module: "qualified-plans", topic: "investment menu monitoring", correct: "Document a prudent process for selecting, monitoring, replacing, and mapping investment options", wrongA: "Never remove underperforming funds", wrongB: "Choose funds only by brand recognition", wrongC: "Let participants bear all fiduciary responsibility", explanation: "Plan fiduciaries must follow a prudent process for the investment lineup. Participant choice does not eliminate the duty to monitor available options." },
  { id: "qp-d-013", module: "qualified-plans", topic: "forfeiture use in a retirement plan", correct: "Apply forfeitures according to plan terms for expenses, employer contributions, or allocations", wrongA: "Return forfeitures to business owners personally", wrongB: "Hold forfeitures indefinitely", wrongC: "Use forfeitures contrary to the plan document", explanation: "Forfeitures must be used according to plan terms and applicable rules. Misuse can create operational failures requiring correction." },
  { id: "qp-d-014", module: "qualified-plans", topic: "a SIMPLE IRA employer contribution choice", correct: "Compare the required match and nonelective formulas and communicate the selected method timely", wrongA: "Skip employer contributions when profits are low", wrongB: "Use a discretionary profit-sharing formula", wrongC: "Change the formula after employees defer", explanation: "SIMPLE IRAs require employer contributions under either a matching or nonelective formula. Employees must receive proper notice so they can make informed deferral decisions." },
  { id: "qp-d-015", module: "qualified-plans", topic: "a cash balance plan for a high-income owner", correct: "Evaluate age, staff demographics, required contributions, nondiscrimination testing, and funding commitment", wrongA: "Open the plan only for the owner", wrongB: "Promise deductions without testing", wrongC: "Treat it as a no-cost 401(k) feature", explanation: "Cash balance plans can allow large deductible contributions but carry funding and testing obligations. Workforce demographics determine whether the design is practical and compliant." },
  { id: "qp-d-016", module: "qualified-plans", topic: "a 401(k) plan document amendment", correct: "Confirm the amendment is adopted timely and operations match the written plan terms", wrongA: "Operate informally before updating documents", wrongB: "Assume vendor emails amend the plan", wrongC: "Ignore participant notice impact", explanation: "Qualified plans must be operated according to written plan terms. Amendments and participant communications should be completed within required deadlines." },
  { id: "qp-d-017", module: "qualified-plans", topic: "a participant rollover into the plan", correct: "Confirm the source is eligible, documentation is complete, and the plan accepts rollovers", wrongA: "Accept every check made payable to the participant", wrongB: "Accept inherited IRA assets into the plan", wrongC: "Skip source verification", explanation: "Plans may accept only eligible rollover contributions under their terms. Source verification prevents prohibited or ineligible assets from entering the plan." },
  { id: "qp-d-018", module: "qualified-plans", topic: "correcting an ADP test failure", correct: "Use permitted correction methods such as refunds to HCEs or qualified nonelective contributions within deadlines", wrongA: "Ignore the failure if participation is high", wrongB: "Adjust prior payroll records manually", wrongC: "Remove NHCE participants from testing", explanation: "ADP failures must be corrected using permitted methods and deadlines. Untimely correction can jeopardize plan qualification and create excise taxes." },
  { id: "qp-d-019", module: "qualified-plans", topic: "ERISA bonding requirements", correct: "Confirm the plan has sufficient fidelity bond coverage for persons handling plan funds", wrongA: "Use professional liability insurance instead", wrongB: "Skip bonding for small plans", wrongC: "Rely only on the recordkeeper's coverage", explanation: "ERISA generally requires bonding for persons who handle plan funds or property. The bond protects the plan from losses caused by fraud or dishonesty." },
  { id: "qp-d-020", module: "qualified-plans", topic: "a missing participant with a terminated plan", correct: "Use documented search procedures before distributing or escheating plan assets", wrongA: "Forfeit the balance immediately", wrongB: "Send funds to the employer", wrongC: "Ignore small balances", explanation: "Plan fiduciaries must make reasonable efforts to locate missing participants. Terminated plans require careful handling so benefits remain protected." },
  { id: "qp-d-021", module: "qualified-plans", topic: "participant education versus advice", correct: "Distinguish general investment education from individualized fiduciary investment advice", wrongA: "Call every recommendation education", wrongB: "Avoid all participant communication", wrongC: "Let sales compensation determine the answer", explanation: "General plan education can be provided without becoming individualized advice. Specific recommendations based on participant facts may create fiduciary or advisory obligations." },
  { id: "qp-d-022", module: "qualified-plans", topic: "a plan blackout period", correct: "Provide required notices and explain temporary restrictions on transactions or investment changes", wrongA: "Block access without notice", wrongB: "Allow insiders to trade during blackout restrictions", wrongC: "Cancel participant rights permanently", explanation: "Blackout periods require participant notice and careful administration. Restrictions should be temporary, clearly explained, and applied consistently." },
  { id: "qp-d-023", module: "qualified-plans", topic: "a plan sponsor changing recordkeepers", correct: "Plan mapping, blackout timing, participant notices, data validation, and fee comparison before conversion", wrongA: "Move assets without reconciling participant balances", wrongB: "Skip notices if the new platform is better", wrongC: "Map all assets to money market permanently", explanation: "Recordkeeper conversions create operational and fiduciary risk. Proper planning protects participant balances and ensures investment mapping and notices are accurate." },
]);

// ─── ESTATE PLANNING DEPTH EXPANSION ─────────────────────────────────────────
const ESTATE_PLANNING_DEPTH: ModuleClientQuestion[] = [
  {
    id: "ep-d-001", module: "estate-planning", difficulty: "trainee",
    question: "A client's revocable living trust was signed five years ago but no assets have been transferred into it. What is the most important action?",
    options: [
      "Redraft the trust with updated terms",
      "Convert the revocable trust to an irrevocable trust",
      "File the trust with the probate court for pre-approval",
      "Fund the trust by retitling assets into the trust's name"
    ],
    correctIndex: 3,
    explanation: "An unfunded revocable trust provides no probate-avoidance benefit because assets titled in the client's individual name still pass through probate. The immediate priority is retitling accounts, real estate, and other assets into the trust name or naming the trust as beneficiary where appropriate."
  },
  {
    id: "ep-d-002", module: "estate-planning", difficulty: "trainee",
    question: "A client names a minor child as direct beneficiary of a $400,000 life insurance policy. What is the primary planning problem?",
    options: [
      "Minors receive favorable tax treatment on life insurance proceeds",
      "The death benefit will be included in the minor's gross estate",
      "A minor cannot legally receive the funds directly and a court-appointed guardian of the property will control the assets",
      "Insurance companies are prohibited from paying minors under federal law"
    ],
    correctIndex: 2,
    explanation: "Minors cannot legally manage significant assets. Without a trust or UTMA designation, insurance proceeds payable to a minor will require a court-appointed guardian of the property to manage funds, which is costly and inflexible. A better structure names a trust or custodian as beneficiary."
  },
  {
    id: "ep-d-003", module: "estate-planning", difficulty: "trainee",
    question: "A client wants to make annual exclusion gifts to seven family members. What is the annual federal gift tax exclusion per recipient in 2024?",
    options: [
      "$10,000",
      "$15,000",
      "$18,000",
      "$25,000"
    ],
    correctIndex: 2,
    explanation: "The federal annual gift tax exclusion is $18,000 per recipient in 2024. Gifts up to this amount per person per year do not require a gift tax return and do not reduce the lifetime exemption. A client with seven recipients could transfer up to $126,000 annually free of gift tax."
  },
  {
    id: "ep-d-004", module: "estate-planning", difficulty: "associate",
    question: "A client owns appreciated stock with a $50,000 cost basis now worth $300,000. They want to pass it to their children. What is the primary tax advantage of holding until death versus gifting now?",
    options: [
      "Inherited assets receive a step-up in basis to fair market value at death, eliminating the built-in capital gain",
      "Gifted assets receive a step-up in basis; inherited assets do not",
      "Annual gift tax exclusions shelter the entire gain if spread over several years",
      "Capital gains tax does not apply to transfers between family members"
    ],
    correctIndex: 0,
    explanation: "Assets transferred at death receive a step-up in income tax basis to fair market value on the date of death, eliminating the embedded capital gain. If the client gifts the stock during life, the recipient takes the donor's carryover basis and will owe capital gains tax on the full appreciation when sold."
  },
  {
    id: "ep-d-005", module: "estate-planning", difficulty: "associate",
    question: "A surviving spouse wants to preserve the deceased spouse's unused federal estate tax exemption. What election must be made?",
    options: [
      "Generation-skipping transfer exemption allocation",
      "Marital deduction bypass trust funding",
      "Qualified terminable interest property election",
      "Portability election on a timely filed estate tax return"
    ],
    correctIndex: 3,
    explanation: "Portability allows a surviving spouse to use the deceased spouse's unused federal estate tax exemption, but only if an estate tax return is filed on time after the first spouse's death. The election is not automatic and can be lost if the return is missed."
  },
  {
    id: "ep-d-006", module: "estate-planning", difficulty: "associate",
    question: "A client in a blended family has children from a prior marriage and a current spouse. What estate planning structure best protects both the spouse and the prior children?",
    options: [
      "Leave everything outright to the spouse and trust the spouse to share",
      "Use a Qualified Terminable Interest Property trust to provide income to the spouse while preserving remainder for prior children",
      "Name only the prior children as beneficiaries to prevent disinheritance",
      "Split the estate equally between the spouse and each child"
    ],
    correctIndex: 1,
    explanation: "A QTIP trust qualifies for the marital deduction, provides income to the surviving spouse for life, and directs the remainder to the client's children at the spouse's death. This protects the surviving spouse while ensuring prior children are not disinherited if the spouse remarries or changes plans."
  },
  {
    id: "ep-d-007", module: "estate-planning", difficulty: "associate",
    question: "A client wants to leave assets to a child with a severe disability who receives SSI and Medicaid. What is the correct planning structure?",
    options: [
      "Use a third-party special needs trust to supplement without disqualifying benefits",
      "Leave assets outright to the child to maximize flexibility",
      "Disinherit the child to preserve government benefit eligibility",
      "Fund a 529 ABLE account with the entire inheritance"
    ],
    correctIndex: 0,
    explanation: "A third-party special needs trust can hold assets for a disabled beneficiary without disqualifying them from needs-based government benefits like SSI and Medicaid. Outright inheritance above program asset limits would terminate eligibility."
  },
  {
    id: "ep-d-008", module: "estate-planning", difficulty: "associate",
    question: "A client owns real estate in three states. Why does this create an estate administration problem?",
    options: [
      "Real estate in multiple states is subject to federal double taxation",
      "Out-of-state real estate automatically passes to the state government",
      "Each state where real property is located may require a separate ancillary probate proceeding",
      "Multi-state real estate must be sold before death to avoid estate tax"
    ],
    correctIndex: 2,
    explanation: "Real property is subject to the probate laws of the state where it is located. Owning property in three states can trigger three separate probate proceedings, each with its own costs, delays, and legal requirements. Holding property in a revocable trust or LLC can avoid ancillary probate."
  },
  {
    id: "ep-d-009", module: "estate-planning", difficulty: "advisor",
    question: "A client's estate is valued at $16 million. The federal estate tax exemption is $13.61 million in 2024. Approximately how much of the estate is subject to federal estate tax?",
    options: [
      "The entire $16 million",
      "$13.61 million",
      "Nothing because spousal transfers are always exempt",
      "$2.39 million"
    ],
    correctIndex: 3,
    explanation: "The taxable estate is the gross estate minus the applicable exemption. $16 million minus $13.61 million leaves approximately $2.39 million subject to federal estate tax at the 40% marginal rate. Proper planning through gifting, trusts, or charitable strategies can reduce this exposure."
  },
  {
    id: "ep-d-010", module: "estate-planning", difficulty: "advisor",
    question: "A client made lifetime taxable gifts totaling $2 million before 2024. How does this affect their remaining federal estate and gift tax exemption?",
    options: ["Lifetime gifts do not affect the estate tax exemption", "The $2 million reduces the remaining exemption available at death dollar for dollar", "Only gifts above $1 million reduce the estate tax exemption", "Gifts made more than three years before death are excluded from the calculation"],
    correctIndex: 1,
    explanation: "The federal estate and gift tax system uses a unified lifetime exemption. Prior taxable gifts reduce the exemption available at death on a dollar-for-dollar basis. Advisors must track cumulative gift tax returns to accurately project remaining estate tax exposure."
  },
  {
    id: "ep-d-011", module: "estate-planning", difficulty: "advisor",
    question: "A client wants to transfer a family business worth $5 million to the next generation with minimal transfer tax. Which technique uses valuation discounts to reduce the taxable transfer?",
    options: [
      "Family limited partnership with gifts of minority limited partner interests",
      "Charitable remainder trust",
      "Grantor retained annuity trust funded with publicly traded stock",
      "Qualified personal residence trust"
    ],
    correctIndex: 0,
    explanation: "A family limited partnership can hold business assets while the senior generation gifts or sells minority limited partner interests at discounts for lack of control and marketability. These valuation discounts reduce the taxable value transferred, making it an efficient business succession tool."
  },
  {
    id: "ep-d-012", module: "estate-planning", difficulty: "advisor",
    question: "A client's estate plan has not been reviewed since their divorce seven years ago. The ex-spouse is still named as primary beneficiary on a $500,000 IRA. What happens at death in most states?",
    options: [
      "Federal law automatically removes ex-spouses from retirement account beneficiary designations after divorce",
      "The IRA passes to the estate because the beneficiary designation is void",
      "State community property law overrides the federal beneficiary form",
      "The ex-spouse may still receive the IRA because beneficiary designations on retirement accounts are generally not automatically revoked by divorce"
    ],
    correctIndex: 3,
    explanation: "Unlike some probate assets, beneficiary designations on IRAs and employer plans are governed by federal law and are generally not automatically revoked by divorce. ERISA preempts state revocation-on-divorce statutes for employer plans. The ex-spouse may still receive the funds unless the form is updated."
  },
  {
    id: "ep-d-013", module: "estate-planning", difficulty: "advisor",
    question: "A client wants to make a large charitable bequest and also leave assets to children. Which trust structure provides an income stream to the charity for a term of years and then passes remainder to heirs?",
    options: [
      "Charitable remainder unitrust",
      "Grantor retained annuity trust",
      "Charitable lead annuity trust",
      "Qualified personal residence trust"
    ],
    correctIndex: 2,
    explanation: "A charitable lead annuity trust pays a fixed annuity to the charity for a term of years. At the end of the term, the remaining assets pass to the heirs. The present value of the charitable payments reduces the taxable gift to heirs, making CLATs useful for estate planning in low interest rate environments."
  },
  {
    id: "ep-d-014", module: "estate-planning", difficulty: "senior",
    question: "A generation-skipping transfer is made to a grandchild. What tax applies in addition to any gift or estate tax?",
    options: ["Net investment income tax at 3.8%", "Generation-skipping transfer tax at a flat 40% rate", "Alternative minimum tax on the full transfer", "Kiddie tax on the grandchild's investment income"],
    correctIndex: 1,
    explanation: "The generation-skipping transfer tax is a separate flat 40% tax imposed on transfers that skip a generation, such as gifts to grandchildren. It applies in addition to gift or estate tax and has its own exemption amount equal to the basic estate tax exclusion. GST planning requires careful exemption allocation."
  },
  {
    id: "ep-d-015", module: "estate-planning", difficulty: "senior",
    question: "A client used a grantor retained annuity trust and died during the trust term. What is the estate tax result?",
    options: [
      "The full fair market value of GRAT assets is pulled back into the gross estate",
      "Only the original gift value is included in the estate",
      "Nothing is included because the GRAT was irrevocable",
      "The annuity stream is included but not the remainder"
    ],
    correctIndex: 0,
    explanation: "If the grantor dies during the GRAT term, IRC Section 2036 pulls the full fair market value of the trust assets back into the gross estate. This is one of the primary risks of a GRAT strategy. Shorter GRAT terms reduce mortality risk but require higher annuity payments to zero out the gift."
  },
  {
    id: "ep-d-016", module: "estate-planning", difficulty: "learner",
    question: "What document authorizes a named individual to make healthcare decisions for a client who becomes incapacitated?",
    options: ["Durable power of attorney for finances", "Healthcare proxy or healthcare power of attorney", "Revocable living trust", "Letter of instruction"],
    correctIndex: 1,
    explanation: "A healthcare proxy or healthcare power of attorney names an agent to make medical decisions when the client cannot make them personally. This is separate from a financial power of attorney. Without it, family members may need court intervention to make healthcare decisions."
  },
  {
    id: "ep-d-017", module: "estate-planning", difficulty: "learner",
    question: "What is the primary purpose of a will?",
    options: [
      "To avoid probate on all assets",
      "To transfer retirement accounts to beneficiaries",
      "To reduce estate taxes automatically",
      "To direct how probate assets are distributed and name an executor and guardians for minor children"
    ],
    correctIndex: 3,
    explanation: "A will directs the distribution of probate assets, names an executor to administer the estate, and for parents of minor children, names a guardian. It does not control assets with beneficiary designations or joint titling, and it does not by itself avoid probate."
  },
  {
    id: "ep-d-018", module: "estate-planning", difficulty: "learner",
    question: "A client has a $1.2 million estate and no estate planning documents. They die without a will. What happens?",
    options: [
      "Assets pass according to the client's verbal wishes",
      "The federal government claims the estate",
      "Assets pass under state intestacy laws which may not match the client's actual wishes",
      "Assets automatically transfer to the surviving spouse in all states"
    ],
    correctIndex: 2,
    explanation: "Dying without a will means dying intestate. State intestacy statutes determine who receives assets, and the result may differ significantly from what the client would have chosen. For example, a long-term unmarried partner typically receives nothing under intestacy laws."
  },
  {
    id: "ep-d-019", module: "estate-planning", difficulty: "trainee",
    question: "A client has significant digital assets including cryptocurrency and online accounts. What is the most important estate planning step regarding these assets?",
    options: [
      "Leave access credentials in the will which becomes a public record",
      "Assume heirs will discover the accounts on their own",
      "Document access credentials in a secure private location and include digital asset provisions in estate documents",
      "Convert all digital assets to cash before death"
    ],
    correctIndex: 2,
    explanation: "Digital assets including cryptocurrency, online accounts, and cloud-stored data require specific planning. Access credentials should be documented securely but privately — not in a will, which becomes public record. Estate documents should include fiduciary access authorization under applicable state law."
  },
  {
    id: "ep-d-020", module: "estate-planning", difficulty: "associate",
    question: "A client relocates from a community property state to a common law state. How does this affect their existing community property?",
    options: [
      "The community property character of assets generally follows them to the new state as quasi-community property",
      "All community property automatically converts to joint tenancy",
      "Community property loses its character and becomes solely owned by whoever holds title",
      "The IRS determines new ownership at the time of relocation"
    ],
    correctIndex: 0,
    explanation: "Community property generally retains its character when moved to a common law state, though rules vary. Many common law states recognize quasi-community property concepts. The step-up in basis rules for community property, which allow both halves of community property to receive a basis adjustment at death, may also be preserved."
  },
  {
    id: "ep-d-021", module: "estate-planning", difficulty: "associate",
    question: "A closely held business owner wants to ensure business continuity at death and provide liquidity for the estate. What planning tool typically addresses both?",
    options: [
      "A qualified personal residence trust",
      "A charitable lead trust with the business as the lead asset",
      "An irrevocable life insurance trust holding the business interests",
      "A buy-sell agreement funded with life insurance"
    ],
    correctIndex: 3,
    explanation: "A buy-sell agreement establishes a mechanism for the surviving owners or the business to purchase a deceased owner's interest at a pre-agreed value. Funding it with life insurance provides the liquidity to complete the purchase without forcing a distressed sale or burdening the business with debt."
  },
  {
    id: "ep-d-022", module: "estate-planning", difficulty: "advisor",
    question: "A trustee of an irrevocable trust has investment discretion. Under the Uniform Prudent Investor Act, what is the primary standard the trustee must follow?",
    options: [
      "Maximize income for current beneficiaries",
      "Manage the portfolio as a prudent investor would, balancing risk and return in light of the trust's purposes and beneficiaries",
      "Invest only in government bonds to minimize risk",
      "Follow the investment strategy the grantor used during their lifetime"
    ],
    correctIndex: 1,
    explanation: "The Uniform Prudent Investor Act requires trustees to invest trust assets as a prudent investor would, considering risk and return in the context of the overall portfolio and the trust's specific purposes, distribution requirements, and beneficiary needs. Concentrating in a single asset class or ignoring diversification can be a breach."
  },
  {
    id: "ep-d-023", module: "estate-planning", difficulty: "senior",
    question: "A client funded an irrevocable life insurance trust with a $2 million policy. The trustee failed to send Crummey notices to beneficiaries before the premium was paid. What is the consequence?",
    options: [
      "The premium payment may be treated as a taxable gift rather than a gift qualifying for the annual exclusion",
      "The policy is void and the trust must be refunded",
      "There is no consequence because the trust is irrevocable",
      "The IRS will reclassify the trust as a grantor trust"
    ],
    correctIndex: 0,
    explanation: "Crummey notices give beneficiaries a temporary right to withdraw contributions to the trust, which is what qualifies the transfer for the annual gift tax exclusion. If notices are not sent before the premium deadline, the IRS may deny the annual exclusion treatment and treat the full premium as a taxable gift reducing the lifetime exemption."
  },
];

// ─── INSURANCE PLANNING DEPTH EXPANSION ──────────────────────────────────────
const INSURANCE_PLANNING_DEPTH: ModuleClientQuestion[] = [
  {
    id: "ins-d-001", module: "insurance-planning", difficulty: "learner",
    question: "A 35-year-old client needs life insurance primarily to replace income if they die while their children are young. Which policy type is most cost-effective for this purpose?",
    options: [
      "Whole life insurance for permanent coverage",
      "Variable universal life for investment growth",
      "Term life insurance matched to the income replacement period",
      "Single premium immediate annuity"
    ],
    correctIndex: 2,
    explanation: "Term life insurance provides the highest death benefit per premium dollar and is well-suited for temporary income replacement needs such as supporting dependents through college. Once the need expires, the coverage can be dropped. Permanent insurance carries significantly higher premiums for the same death benefit."
  },
  {
    id: "ins-d-002", module: "insurance-planning", difficulty: "learner",
    question: "A client asks what 'own-occupation' means in a disability insurance policy. Which answer is correct?",
    options: [
      "The policy pays only if the insured cannot perform any job",
      "The policy pays only for disabilities caused by workplace accidents",
      "Own-occupation coverage requires the insured to be hospitalized to qualify",
      "The policy pays if the insured cannot perform the material duties of their specific occupation, even if they can work in another field"
    ],
    correctIndex: 3,
    explanation: "Own-occupation disability coverage is the most favorable definition for the insured. It pays benefits if the insured cannot perform the material and substantial duties of their specific occupation, even if they are capable of working in a different field. Any-occupation policies are more restrictive and harder to qualify for."
  },
  {
    id: "ins-d-003", module: "insurance-planning", difficulty: "learner",
    question: "A client is replacing an existing life insurance policy with a new one from a different carrier. What regulatory protection must the advisor follow?",
    options: ["No special rules apply to replacements", "State replacement regulations require disclosure, comparison of both policies, and a free-look period for the client", "The old policy must be surrendered before the new policy can be applied for", "Replacement is only permitted if the new policy has a lower premium"],
    correctIndex: 1,
    explanation: "State replacement regulations exist to protect clients from churning and unsuitable replacements. Advisors must provide comparison documents, disclose costs and benefits of both policies, and ensure the client has a free-look period on the new policy. Failure to follow replacement rules is a regulatory violation."
  },
  {
    id: "ins-d-004", module: "insurance-planning", difficulty: "trainee",
    question: "A client purchases a life insurance policy and pays premiums that exceed the MEC limit in the first seven years. What is the tax consequence?",
    options: [
      "Distributions and loans are taxed as ordinary income first, and a 10% penalty may apply before age 59 1/2",
      "The death benefit becomes partially taxable",
      "The policy is automatically converted to term insurance",
      "MEC status has no impact on the death benefit or distributions"
    ],
    correctIndex: 0,
    explanation: "A modified endowment contract results when premium payments exceed the seven-pay test. MEC treatment changes the tax rules: policy loans and withdrawals are treated as income first (LIFO) and may carry a 10% penalty if taken before age 59 1/2. The death benefit itself remains income-tax free."
  },
  {
    id: "ins-d-005", module: "insurance-planning", difficulty: "trainee",
    question: "A client with a $2 million net worth asks how much personal umbrella liability coverage they need. What is the standard starting-point guideline?",
    options: [
      "$300,000 regardless of net worth",
      "The maximum available limit regardless of cost",
      "No umbrella needed if auto and homeowner limits are high",
      "Umbrella coverage equal to net worth as a baseline, adjusted for specific risk factors"
    ],
    correctIndex: 3,
    explanation: "A common guideline is to match umbrella coverage to net worth as a starting point, then increase based on risk factors such as teenage drivers, swimming pools, rental properties, or public visibility. Umbrella policies require underlying auto and homeowner policies to meet minimum liability limits before the umbrella triggers."
  },
  {
    id: "ins-d-006", module: "insurance-planning", difficulty: "trainee",
    question: "A client is evaluating an indexed universal life insurance illustration showing 7% annual growth. What should the advisor emphasize?",
    options: [
      "The illustrated rate is guaranteed as long as the index performs well",
      "IUL policies cannot lose value so the illustration is conservative",
      "IUL illustrations use hypothetical non-guaranteed assumptions and actual performance can be materially lower",
      "The index return is paid in full with no cap or floor adjustments"
    ],
    correctIndex: 2,
    explanation: "IUL illustrations are based on non-guaranteed assumptions about future index performance and credited rates. Caps, participation rates, and spreads reduce the actual credit relative to the index return. Regulators have increased scrutiny of IUL illustrations because aggressive assumptions can create unrealistic expectations."
  },
  {
    id: "ins-d-007", module: "insurance-planning", difficulty: "associate",
    question: "A business owner wants to fund a buy-sell agreement. They are choosing between a cross-purchase plan and an entity-purchase plan. With multiple owners, what is the primary administrative advantage of an entity-purchase plan?",
    options: [
      "Each owner receives a step-up in basis on the purchased shares",
      "The entity owns and manages fewer policies than a cross-purchase structure with many owners",
      "Entity-purchase plans avoid all estate tax on the proceeds",
      "Entity-purchase plans are not subject to state insurance regulation"
    ],
    correctIndex: 1,
    explanation: "In a cross-purchase plan, each owner buys a policy on every other owner, creating a large number of policies. With four owners, that is 12 policies. An entity-purchase plan has the business own one policy per owner, dramatically reducing administrative complexity. The tradeoff is that owners do not get a basis step-up on purchased shares."
  },
  {
    id: "ins-d-008", module: "insurance-planning", difficulty: "associate",
    question: "A client owns a $1 million life insurance policy personally. The death benefit will be included in their taxable estate. What planning structure removes it?",
    options: [
      "Transfer the policy to an irrevocable life insurance trust at least three years before death",
      "Name a charity as beneficiary",
      "Change the policy to a term policy",
      "Name the spouse as beneficiary to use the marital deduction"
    ],
    correctIndex: 0,
    explanation: "Life insurance proceeds are included in the insured's gross estate if they hold any incidents of ownership. Transferring the policy to an irrevocable life insurance trust removes it from the taxable estate, provided the insured survives three years after the transfer. The ILIT also keeps proceeds outside the beneficiary's estate."
  },
  {
    id: "ins-d-009", module: "insurance-planning", difficulty: "associate",
    question: "A client is 58 years old and considering long-term care insurance. A financial advisor recommends purchasing now rather than waiting until 65. What is the primary reason?",
    options: [
      "LTC premiums are tax-deductible only before age 60",
      "Premiums are significantly lower when purchased at a younger age and health issues can make coverage unavailable later",
      "LTC insurance is not available after age 65",
      "Waiting until 65 triggers a mandatory elimination period"
    ],
    correctIndex: 1,
    explanation: "LTC insurance premiums are based on age and health at the time of purchase. Waiting increases premiums substantially and, more importantly, a health event can make the applicant uninsurable. Purchasing at a younger age while healthy locks in lower premiums and ensures eligibility."
  },
  {
    id: "ins-d-010", module: "insurance-planning", difficulty: "associate",
    question: "A variable annuity owner is 55 and wants to take a withdrawal. What tax treatment applies?",
    options: [
      "Withdrawals are always tax-free from annuities",
      "Variable annuity gains are taxed at long-term capital gain rates",
      "The entire annuity value is taxable only at annuitization",
      "Withdrawals come out earnings-first and are taxed as ordinary income, plus a 10% penalty before age 59 1/2"
    ],
    correctIndex: 3,
    explanation: "Non-qualified annuities use LIFO treatment — gains are withdrawn first and taxed as ordinary income. Before age 59 1/2, a 10% early withdrawal penalty also applies. Unlike qualified accounts, there is no RMD requirement during the owner's lifetime for non-qualified annuities."
  },
  {
    id: "ins-d-011", module: "insurance-planning", difficulty: "advisor",
    question: "A client's homeowner policy covers their home for actual cash value rather than replacement cost. Their 15-year-old roof is destroyed. What is the likely claims impact?",
    options: [
      "The insurer pays the full current cost to replace the roof",
      "Actual cash value and replacement cost produce the same payout for roofs",
      "The insurer pays the depreciated value of the roof, which may be far less than replacement cost",
      "The policy pays nothing for roofs older than 10 years"
    ],
    correctIndex: 2,
    explanation: "Actual cash value coverage deducts depreciation from the claim payout. A 15-year-old roof may have a depreciated value of only a fraction of replacement cost, leaving the client to fund the gap. Replacement cost coverage pays the full amount to restore the property without deducting for age."
  },
  {
    id: "ins-d-012", module: "insurance-planning", difficulty: "advisor",
    question: "A client receives group life insurance through their employer equal to three times their $200,000 salary. How much of this benefit creates imputed income?",
    options: [
      "No imputed income on employer-provided group life insurance",
      "The full $600,000 of coverage is taxed as ordinary income",
      "The cost of coverage above $50,000 is imputed as taxable income based on IRS Table I rates",
      "Imputed income applies only to executive group life plans"
    ],
    correctIndex: 2,
    explanation: "Under IRC Section 79, employer-paid group term life insurance in excess of $50,000 creates imputed taxable income calculated using IRS Table I rates based on the employee's age. In this case, $550,000 of the $600,000 coverage exceeds the threshold and generates imputed income."
  },
  {
    id: "ins-d-013", module: "insurance-planning", difficulty: "advisor",
    question: "A client's disability insurance policy has a 90-day elimination period. They become disabled and cannot work. When do benefits begin?",
    options: [
      "After 90 consecutive days of disability have passed",
      "Immediately upon disability",
      "After one year if the disability continues",
      "Benefits are prorated starting at 45 days"
    ],
    correctIndex: 0,
    explanation: "The elimination period is the waiting period between the onset of disability and when benefits begin. A 90-day elimination period means the client receives no benefit for the first three months of disability. Longer elimination periods reduce premiums. Clients need liquid reserves to cover the elimination period."
  },
  {
    id: "ins-d-014", module: "insurance-planning", difficulty: "senior",
    question: "A client is evaluating a Medicare Supplement plan versus a Medicare Advantage plan. Which statement accurately distinguishes them?",
    options: [
      "Medicare Advantage is a federal government plan; Medicare Supplement is private",
      "Medicare Supplement requires referrals; Medicare Advantage does not",
      "Both plans pay the same costs but differ only in premium",
      "Medicare Supplement pays costs not covered by original Medicare; Medicare Advantage replaces original Medicare with a bundled private plan"
    ],
    correctIndex: 3,
    explanation: "Medicare Supplement policies wrap around original Medicare, paying covered gaps such as copays and deductibles while allowing access to any Medicare-accepting provider. Medicare Advantage plans replace original Medicare with a private insurer's bundled plan, typically with network restrictions but often including drug coverage and lower premiums."
  },
  {
    id: "ins-d-015", module: "insurance-planning", difficulty: "senior",
    question: "A client wants to evaluate a life insurance carrier before purchasing a large permanent policy. What rating agency information is most relevant?",
    options: ["The carrier's stock price performance over the past year", "Financial strength ratings from AM Best, Moody's, or S&P reflecting claims-paying ability", "The number of states where the carrier is licensed", "The carrier's market share in term life insurance"],
    correctIndex: 1,
    explanation: "Financial strength ratings from agencies like AM Best, Moody's, S&P, and Fitch assess the insurer's ability to pay future claims. For permanent policies that may be held for decades, carrier financial strength is critical. An insurer with a weak rating may face solvency issues before a long-term policy matures."
  },
  {
    id: "ins-d-016", module: "insurance-planning", difficulty: "learner",
    question: "A client's health insurance plan has a $3,000 deductible and a $7,000 out-of-pocket maximum. If they incur $15,000 of covered expenses, how much do they pay?",
    options: [
      "$7,000",
      "$15,000",
      "$3,000",
      "$12,000"
    ],
    correctIndex: 0,
    explanation: "The out-of-pocket maximum caps total cost-sharing at $7,000. Once the client has paid $7,000 in deductibles, copays, and coinsurance, the insurer covers 100% of remaining covered costs. The deductible is the first layer, but total exposure is capped by the out-of-pocket maximum."
  },
  {
    id: "ins-d-017", module: "insurance-planning", difficulty: "trainee",
    question: "A client contributes $4,000 to an HSA. They are enrolled in a family HDHP. Is this contribution within the 2024 IRS limit?",
    options: [
      "No, the family HSA limit is $3,200",
      "No, HSA contributions are capped at $2,000 regardless of plan type",
      "Yes, the 2024 family HSA contribution limit is $8,300",
      "Yes, but only if the client is under age 55"
    ],
    correctIndex: 2,
    explanation: "The 2024 HSA contribution limit for family HDHP coverage is $8,300. A $4,000 contribution is well within this limit. Individuals age 55 and older can make an additional $1,000 catch-up contribution. HSA funds can be invested, grow tax-free, and are withdrawn tax-free for qualified medical expenses."
  },
  {
    id: "ins-d-018", module: "insurance-planning", difficulty: "associate",
    question: "A whole life policy accumulates cash value of $80,000 and the client takes a $30,000 policy loan. What happens if the client dies with the loan outstanding?",
    options: [
      "The full death benefit is paid with no reduction",
      "The loan becomes a taxable distribution at death",
      "The policy is voided and no death benefit is paid",
      "The death benefit is reduced by the outstanding loan balance and any accrued interest"
    ],
    correctIndex: 3,
    explanation: "Policy loans reduce the net death benefit paid to beneficiaries. If the client dies with a $30,000 loan outstanding, beneficiaries receive the death benefit minus the loan and accumulated interest. Loans do not affect the cash value directly but accrue interest that compounds if not repaid."
  },
  {
    id: "ins-d-019", module: "insurance-planning", difficulty: "advisor",
    question: "A client asks whether their annuity death benefit proceeds are subject to income tax when paid to beneficiaries. What is the correct answer?",
    options: [
      "Annuity death benefits are always income-tax free like life insurance",
      "Beneficiaries owe ordinary income tax on the gain portion of annuity death benefit proceeds",
      "Annuity gains receive a step-up in basis at death",
      "The beneficiary pays capital gains tax only if the annuity was held more than one year"
    ],
    correctIndex: 1,
    explanation: "Unlike life insurance, annuity death benefits do not receive income-tax-free treatment. Beneficiaries owe ordinary income tax on the portion representing accumulated gain. The basis (cost) portion is not taxed. There is no step-up in basis for annuities, which is an important distinction from inherited investment accounts."
  },
  {
    id: "ins-d-020", module: "insurance-planning", difficulty: "senior",
    question: "A business owner wants key person life insurance. What is the correct tax treatment of premiums and death benefit proceeds?",
    options: [
      "Premiums are not deductible and death benefit proceeds are generally received income-tax free by the business",
      "Premiums are deductible and proceeds are tax-free",
      "Premiums are deductible and proceeds are taxable as ordinary income",
      "Both premiums and proceeds are tax-free for C corporations"
    ],
    correctIndex: 0,
    explanation: "Key person life insurance premiums paid by the business are not deductible because the business is the beneficiary. The death benefit proceeds are generally received income-tax free under IRC Section 101(a). However, C corporations should be aware of the alternative minimum tax implications of large life insurance proceeds."
  },
  {
    id: "ins-d-021", module: "insurance-planning", difficulty: "trainee",
    question: "A client's auto policy has 100/300/100 liability limits. What does this mean?",
    options: [
      "$100,000 total per accident for all claims combined",
      "$100 deductible, $300 copay, $100 medical payment",
      "$300,000 total coverage divided among 100 potential accidents",
      "$100,000 per person bodily injury, $300,000 per accident bodily injury, $100,000 property damage"
    ],
    correctIndex: 3,
    explanation: "Auto liability limits expressed as 100/300/100 mean: $100,000 maximum per injured person, $300,000 maximum for all bodily injuries per accident, and $100,000 for property damage per accident. These limits represent the insurer's maximum payout — amounts above these limits become the insured's personal responsibility."
  },
  {
    id: "ins-d-022", module: "insurance-planning", difficulty: "associate",
    question: "A client owns a rental property. Their standard homeowner policy excludes the rental. What coverage does the client need?",
    options: [
      "Adding a rider to the existing homeowner policy is always sufficient",
      "Renters insurance purchased by the tenant covers the building structure",
      "A separate landlord or dwelling fire policy specifically designed for non-owner-occupied rental properties",
      "No additional coverage is needed if the rental is in the same city as the primary home"
    ],
    correctIndex: 2,
    explanation: "Standard homeowner policies typically exclude properties rented to others. A landlord or dwelling fire policy covers the rental structure, potential liability as a landlord, and lost rental income. The tenant's renter's insurance covers only the tenant's personal property, not the building."
  },
  {
    id: "ins-d-023", module: "insurance-planning", difficulty: "senior",
    question: "A client is considering surrendering a whole life policy with $120,000 cash value and a $40,000 cost basis. What is the tax consequence of a full surrender?",
    options: ["No tax is owed on life insurance surrenders", "The $80,000 gain is taxed as ordinary income in the year of surrender", "The gain is taxed at long-term capital gain rates", "Only the cost basis portion is taxable upon surrender"],
    correctIndex: 1,
    explanation: "When a life insurance policy is surrendered, the gain — cash value minus premiums paid (cost basis) — is taxed as ordinary income. In this case, $120,000 minus $40,000 equals $80,000 of taxable ordinary income. This is a significant difference from the income-tax-free death benefit, which reinforces the planning value of keeping policies in force."
  },
];

// ─── TAX PLANNING DEPTH EXPANSION ────────────────────────────────────────────
const TAX_PLANNING_DEPTH: ModuleClientQuestion[] = [
  {
    id: "tax-d-001", module: "tax-planning", difficulty: "learner",
    question: "A client realizes a $20,000 long-term capital gain and has $8,000 of capital loss carryforwards. What is the net capital gain subject to tax?",
    options: [
      "$12,000",
      "$20,000",
      "$8,000",
      "$28,000"
    ],
    correctIndex: 0,
    explanation: "Capital losses offset capital gains dollar for dollar. The $8,000 loss carryforward reduces the $20,000 gain to $12,000 of net long-term capital gain. Net long-term capital gains are taxed at preferential rates of 0%, 15%, or 20% depending on taxable income."
  },
  {
    id: "tax-d-002", module: "tax-planning", difficulty: "learner",
    question: "A client sells stock at a loss and repurchases the same stock 20 days later. What tax rule applies?",
    options: [
      "The loss is recognized immediately because the position was closed",
      "The wash sale rule disallows the loss because substantially identical stock was repurchased within 30 days before or after the sale",
      "The loss is deferred until the repurchased shares are sold",
      "No rule applies because the repurchase was after the sale"
    ],
    correctIndex: 1,
    explanation: "The wash sale rule under IRC Section 1091 disallows a capital loss when substantially identical securities are purchased within 30 days before or after the sale. The disallowed loss is added to the basis of the repurchased shares, deferring rather than permanently eliminating the tax benefit."
  },
  {
    id: "tax-d-003", module: "tax-planning", difficulty: "learner",
    question: "A married couple filing jointly has $85,000 of taxable income in 2024. What rate applies to their long-term capital gains?",
    options: [
      "20%",
      "15%",
      "Same as their ordinary income rate",
      "0%"
    ],
    correctIndex: 3,
    explanation: "The 0% long-term capital gains rate applies to married filers with taxable income up to $94,050 in 2024. At $85,000 of taxable income, this couple pays no federal tax on long-term capital gains. This creates a significant planning opportunity to harvest gains in low-income years."
  },
  {
    id: "tax-d-004", module: "tax-planning", difficulty: "trainee",
    question: "A client wants to donate $50,000 of appreciated stock held more than one year to a public charity. What is the optimal tax result?",
    options: [
      "Sell the stock, pay capital gains tax, and donate the after-tax cash",
      "Donate the stock and deduct only the cost basis",
      "Donate the stock directly and deduct the full fair market value without recognizing the capital gain",
      "The donation is not deductible because it is appreciated property"
    ],
    correctIndex: 2,
    explanation: "Donating appreciated securities held more than one year to a public charity allows the donor to deduct the full fair market value while permanently avoiding the embedded capital gain tax. Selling first triggers capital gains tax unnecessarily. This is one of the most tax-efficient charitable giving strategies available."
  },
  {
    id: "tax-d-005", module: "tax-planning", difficulty: "trainee",
    question: "A client has significant itemized deductions that slightly exceed the standard deduction each year. What strategy could increase the tax benefit?",
    options: [
      "Take the standard deduction every year",
      "Avoid deductions to simplify tax filing",
      "Bunch deductions into alternating years to exceed the standard deduction by a larger margin",
      "Convert all itemized deductions to above-the-line deductions"
    ],
    correctIndex: 2,
    explanation: "Bunching involves accelerating deductible expenses such as charitable gifts or property taxes into one year and deferring them from the next, creating a large itemized deduction one year and taking the standard deduction the other. This strategy can increase the total tax benefit compared to splitting deductions evenly across years."
  },
  {
    id: "tax-d-006", module: "tax-planning", difficulty: "trainee",
    question: "A client with $250,000 of net investment income and $50,000 above the MAGI threshold is subject to which additional tax?",
    options: [
      "Net investment income tax of 3.8% on the lesser of NII or the excess above the threshold",
      "Alternative minimum tax on investment income",
      "A 20% surtax on all investment income above $200,000",
      "Self-employment tax on passive investment income"
    ],
    correctIndex: 0,
    explanation: "The net investment income tax under IRC Section 1411 applies a 3.8% tax on the lesser of net investment income or the amount of MAGI exceeding threshold amounts ($200,000 single, $250,000 married). With $50,000 above the threshold and $250,000 NII, the tax applies to $50,000, the lesser amount."
  },
  {
    id: "tax-d-007", module: "tax-planning", difficulty: "associate",
    question: "A self-employed consultant earns $200,000 in net self-employment income. They want to reduce taxable income. What is the maximum contribution they can make to a solo 401(k)?",
    options: [
      "$23,000 employee deferral only",
      "$6,500 IRA contribution",
      "$58,000 employee deferral plus employer match",
      "$69,000 total combining employee deferral and employer profit-sharing contribution (subject to earned income limits)"
    ],
    correctIndex: 3,
    explanation: "A solo 401(k) allows a self-employed individual to contribute as both employee ($23,000 in 2024 plus catch-up if eligible) and employer (up to 25% of net self-employment income). The combined limit is $69,000 in 2024. This can create a substantially larger deduction than a SEP-IRA or SIMPLE IRA."
  },
  {
    id: "tax-d-008", module: "tax-planning", difficulty: "associate",
    question: "An S corporation owner pays themselves a $60,000 salary when the market rate for their work is $150,000. The IRS challenges this. Why?",
    options: [
      "S corporation distributions are always subject to payroll tax and salary is irrelevant",
      "The IRS requires reasonable compensation to prevent payroll tax avoidance on S corporation income",
      "S corporation owners are not required to take any salary",
      "Salaries above $60,000 trigger the net investment income tax"
    ],
    correctIndex: 1,
    explanation: "S corporation income passed through to shareholder-employees is not subject to self-employment or payroll tax. To prevent abuse, the IRS requires S corporation owner-employees who perform services to pay themselves reasonable compensation — a salary comparable to what a third party would earn for the same work."
  },
  {
    id: "tax-d-009", module: "tax-planning", difficulty: "associate",
    question: "A client exercises incentive stock options but does not sell in the same year. What tax consequence may arise?",
    options: [
      "The spread between exercise price and FMV at exercise is an AMT preference item but not regular income in the exercise year",
      "Ordinary income equal to the spread at exercise",
      "No tax applies until the shares are sold regardless of AMT",
      "ISO exercises are always tax-free"
    ],
    correctIndex: 0,
    explanation: "For regular tax purposes, ISO exercises are not taxable at exercise. However, the spread between the exercise price and fair market value is an alternative minimum tax preference item in the year of exercise. Clients with large ISO exercises may owe AMT even though no cash was received, requiring careful planning."
  },
  {
    id: "tax-d-010", module: "tax-planning", difficulty: "associate",
    question: "A client sells their primary residence after living there for 3 years. They are married filing jointly. How much gain can they exclude?",
    options: [
      "$250,000",
      "$750,000",
      "$500,000",
      "None — principal residence gain is fully taxable"
    ],
    correctIndex: 2,
    explanation: "IRC Section 121 allows married couples filing jointly to exclude up to $500,000 of gain from the sale of a primary residence if they owned and used it as their main home for at least two of the five years before sale. Single filers may exclude up to $250,000. The client's 3-year ownership qualifies."
  },
  {
    id: "tax-d-011", module: "tax-planning", difficulty: "advisor",
    question: "A client owns rental property with $200,000 of accumulated depreciation. They sell the property at a gain. What tax rate applies to the depreciation recapture?",
    options: [
      "0% because depreciation recapture is capital gain",
      "Ordinary income rates up to 37%",
      "15% long-term capital gain rate",
      "25% unrecaptured Section 1250 gain rate"
    ],
    correctIndex: 3,
    explanation: "Unrecaptured Section 1250 gain, which is the portion of gain attributable to depreciation on real property, is taxed at a maximum rate of 25% rather than the standard long-term capital gain rates. This is an important distinction — depreciation recapture on real estate is taxed less favorably than other long-term capital gains."
  },
  {
    id: "tax-d-012", module: "tax-planning", difficulty: "advisor",
    question: "A client has a large IRA and a taxable brokerage account. They want to hold both bonds and equities. For optimal tax efficiency, where should each be held?",
    options: ["Hold equities in the IRA and bonds in taxable", "Hold bonds in the IRA and equities in taxable to benefit from lower capital gain and dividend rates in taxable", "Asset location has no impact on after-tax returns", "Hold everything in the IRA to defer all taxes"],
    correctIndex: 1,
    explanation: "Asset location places less tax-efficient assets (bonds, REITs, high-turnover funds) in tax-deferred accounts and more tax-efficient assets (equities held long-term, index funds) in taxable accounts. Bond interest taxed at ordinary rates benefits from deferral; equity gains taxed at preferential rates lose less to taxes in taxable accounts."
  },
  {
    id: "tax-d-013", module: "tax-planning", difficulty: "advisor",
    question: "A client's total income is $480,000. They receive $40,000 of qualified dividends. At what federal tax rate are the qualified dividends taxed?",
    options: [
      "20%",
      "0%",
      "15%",
      "37% as ordinary income"
    ],
    correctIndex: 0,
    explanation: "The 20% long-term capital gains and qualified dividend rate applies to taxpayers with taxable income above $583,750 (single) or $523,050 (married) in 2024. At $480,000 of income, this client is in the 15% qualified dividend bracket. The 20% rate does not apply unless income exceeds the top threshold."
  },
  {
    id: "tax-d-014", module: "tax-planning", difficulty: "advisor",
    question: "A client has $30,000 of passive activity losses from a rental property and $80,000 of W-2 income. No other passive income exists. How much passive loss can they deduct?",
    options: [
      "The full $30,000 is deductible against W-2 income",
      "None — passive losses can only offset passive income",
      "The full $30,000 is deductible because rental income is active",
      "Up to $25,000 if MAGI is under $100,000, phased out between $100,000 and $150,000"
    ],
    correctIndex: 3,
    explanation: "Passive activity losses generally cannot offset active income. However, the special $25,000 rental real estate allowance permits up to $25,000 of rental losses to offset other income for taxpayers who actively participate and have MAGI below $100,000. The allowance phases out ratably between $100,000 and $150,000 of MAGI."
  },
  {
    id: "tax-d-015", module: "tax-planning", difficulty: "senior",
    question: "A client is retiring and will receive $80,000 in Social Security benefits. Their provisional income is $95,000. What percentage of their Social Security benefit is includable in gross income?",
    options: ["0%", "50%", "85%", "100%"],
    correctIndex: 2,
    explanation: "Up to 85% of Social Security benefits are includable in gross income when provisional income (AGI plus non-taxable interest plus half of Social Security) exceeds $44,000 for married filers or $34,000 for single filers. At $95,000 of provisional income, this client is above both thresholds and 85% of their benefit is taxable."
  },
  {
    id: "tax-d-016", module: "tax-planning", difficulty: "senior",
    question: "A client's MAGI is $210,000 in 2024. How does this affect their Medicare Part B premium?",
    options: ["No impact — Medicare Part B premiums are fixed for all enrollees", "Income-related monthly adjustment amounts increase the Part B premium above the base rate for higher earners", "Medicare Part B is not available to clients earning over $200,000", "The client pays a flat 20% surcharge on top of the standard premium"],
    correctIndex: 1,
    explanation: "Medicare IRMAA surcharges increase Part B and Part D premiums based on income from two years prior. At $210,000 MAGI, the client pays a higher premium tier above the standard Part B rate. Advisors should model Roth conversions and other income events for clients near IRMAA thresholds."
  },
  {
    id: "tax-d-017", module: "tax-planning", difficulty: "trainee",
    question: "A client uses a 529 plan to pay $20,000 for a child's college tuition. $15,000 represents earnings growth. How is the distribution taxed?",
    options: [
      "The entire $20,000 is tax-free because it was used for qualified education expenses",
      "The entire $20,000 is taxable",
      "Only the $15,000 earnings portion is taxable",
      "The distribution is tax-free only if the account was open for at least five years"
    ],
    correctIndex: 0,
    explanation: "529 plan distributions used for qualified education expenses are completely income-tax free at the federal level, including the earnings portion. Qualified expenses include tuition, fees, books, and room and board for eligible institutions. Using the funds for non-qualified expenses triggers tax and a 10% penalty on the earnings."
  },
  {
    id: "tax-d-018", module: "tax-planning", difficulty: "associate",
    question: "A client has restricted stock units that vest in January. They want to minimize current year ordinary income. What strategy could help?",
    options: ["Make an 83(b) election after vesting", "Negotiate a later vesting date or defer other income to offset the RSU income in the vesting year", "RSU income can always be deferred until the shares are sold", "Convert the RSUs to non-qualified options before vesting"],
    correctIndex: 1,
    explanation: "RSU income is recognized as ordinary income at vesting at the fair market value of shares received and cannot be deferred after vesting. Planning should occur before vesting — identifying whether the vesting year will have offsetting deductions, capital losses, or retirement contributions that can absorb the income."
  },
  {
    id: "tax-d-019", module: "tax-planning", difficulty: "associate",
    question: "A client's business generates $300,000 of qualified business income. They are a sole proprietor. What deduction may be available?",
    options: [
      "No deduction is available for sole proprietors",
      "A flat $50,000 deduction for self-employed individuals",
      "20% of gross revenue regardless of profit",
      "Up to 20% of qualified business income, subject to income limits and business type"
    ],
    correctIndex: 3,
    explanation: "The Section 199A qualified business income deduction allows eligible self-employed individuals and pass-through entity owners to deduct up to 20% of QBI. The deduction is subject to W-2 wage and property limitations above certain income thresholds and is not available for specified service trades or businesses above the income caps."
  },
  {
    id: "tax-d-020", module: "tax-planning", difficulty: "advisor",
    question: "A client relocates from California to Nevada to avoid state income tax. What factor could cause California to still tax them?",
    options: [
      "California taxes all former residents for five years after departure",
      "Nevada residents are exempt from California tax on all income",
      "If the client maintains domicile in California or spends more than 546 days in California over two years, California may assert residency",
      "Only federal, not state, rules apply to multi-state situations"
    ],
    correctIndex: 2,
    explanation: "California aggressively pursues residency claims. Maintaining a California home, spending significant time there, retaining California business ties, or failing to establish clear Nevada domicile can result in California continuing to tax the client as a resident. Advisors must document domicile change carefully."
  },
  {
    id: "tax-d-021", module: "tax-planning", difficulty: "senior",
    question: "A client has $500,000 of qualified opportunity zone fund investments. They hold the investment for 10 years before selling. What is the tax benefit on appreciation?",
    options: [
      "Capital gains are reduced by 15% only",
      "Gains are deferred to a future year chosen by the taxpayer",
      "Appreciation in the QOZ fund held at least 10 years is permanently excluded from federal capital gains tax",
      "Only the original deferred gain is excluded, not new appreciation"
    ],
    correctIndex: 2,
    explanation: "Qualified opportunity zone investments held at least 10 years allow the taxpayer to permanently exclude post-investment appreciation from federal capital gains tax. The original deferred gain from the rolled investment is recognized in 2026 or earlier, but new appreciation generated within the fund is permanently excluded."
  },
  {
    id: "tax-d-022", module: "tax-planning", difficulty: "learner",
    question: "A client is unsure whether to take the standard deduction or itemize. Their total itemized deductions are $16,000 and they file single. What should they do in 2024?",
    options: [
      "Itemize because the itemized amount exceeds the 2024 single standard deduction of $14,600",
      "Always itemize to maximize deductions",
      "Take the standard deduction because $14,600 standard is less than $16,000 in itemized deductions",
      "The choice has no impact on tax owed"
    ],
    correctIndex: 0,
    explanation: "The 2024 standard deduction for single filers is $14,600. With $16,000 of itemized deductions, the client should itemize to deduct the larger amount. The additional $1,400 above the standard deduction reduces taxable income. The decision should be made by comparing total itemized deductions to the applicable standard deduction."
  },
  {
    id: "tax-d-023", module: "tax-planning", difficulty: "trainee",
    question: "A client wants to avoid an underpayment penalty. What is the IRS safe harbor for estimated tax payments?",
    options: [
      "Pay any amount by April 15",
      "Pay exactly what was owed last year",
      "Safe harbor only applies to W-2 employees",
      "Pay at least 90% of the current year tax or 100% of the prior year tax (110% if prior year AGI exceeded $150,000)"
    ],
    correctIndex: 3,
    explanation: "The IRS underpayment safe harbor requires paying the lesser of 90% of the current year's tax or 100% of the prior year's tax liability. High-income taxpayers with prior year AGI above $150,000 must pay 110% of the prior year tax to use the prior-year safe harbor. Adequate estimated payments avoid the underpayment penalty."
  },
];

MODULE_CLIENT_QUESTIONS.push(
  ...MODULE_DEPTH_EXPANSION,
  ...ESTATE_PLANNING_DEPTH,
  ...INSURANCE_PLANNING_DEPTH,
  ...TAX_PLANNING_DEPTH
);

const SUITABILITY_EXPANSION: ModuleClientQuestion[] = [
  // Learner
  {
    id: "suit-l-003", module: "suitability-client-fit", difficulty: "learner",
    question: "Which of the following best describes the difference between a broker-dealer and a registered investment adviser (RIA)?",
    options: ["They are the same — both are held to the fiduciary standard", "A broker-dealer is primarily transaction-based and held to Reg BI; an RIA provides ongoing advice and is held to a fiduciary standard under the Investment Advisers Act", "An RIA can only manage pension funds", "A broker-dealer must always act as a fiduciary"],
    correctIndex: 1,
    explanation: "Broker-dealers execute transactions and are regulated by FINRA under Reg BI. RIAs provide investment advice for compensation and are registered with the SEC or state regulators, subject to a fiduciary duty of loyalty and care under the Investment Advisers Act of 1940."
  },
  {
    id: "suit-l-004", module: "suitability-client-fit", difficulty: "learner",
    question: "What is the primary purpose of a customer's Investment Policy Statement (IPS)?",
    options: [
      "To establish the client's investment objectives, constraints, risk tolerance, and guidelines that govern the management of their portfolio",
      "To document the adviser's fee schedule",
      "To list every security the client owns",
      "To satisfy IRS reporting requirements"
    ],
    correctIndex: 0,
    explanation: "An IPS documents the framework governing a client's portfolio — objectives (return goals), constraints (liquidity, time horizon, taxes, legal, unique circumstances), and risk tolerance. It serves as the benchmark for all investment decisions and is required for fiduciary accounts."
  },
  {
    id: "suit-l-005", module: "suitability-client-fit", difficulty: "learner",
    question: "A client's 'time horizon' refers to which of the following?",
    options: [
      "The time it takes to execute a trade",
      "The broker's holding period for customer funds",
      "The length of time an investor expects to hold an investment or portfolio before needing the funds",
      "The expiration date of a mutual fund"
    ],
    correctIndex: 2,
    explanation: "Time horizon is the expected duration of the investment before the client needs to access the funds. Longer time horizons generally support higher-risk allocations since there is more time to recover from market downturns. It is a critical component of the suitability analysis."
  },
  {
    id: "suit-l-006", module: "suitability-client-fit", difficulty: "learner",
    question: "Which document must a broker-dealer provide to a retail customer before or at the time of a recommendation under Reg BI?",
    options: [
      "Form ADV Part 2",
      "Form 1099",
      "Form W-9",
      "Form CRS (Customer Relationship Summary)"
    ],
    correctIndex: 3,
    explanation: "Regulation Best Interest requires broker-dealers to deliver Form CRS to retail customers at account opening and before making a recommendation. Form CRS summarizes the nature of the relationship, services offered, fees, conflicts of interest, and any disciplinary history in plain language."
  },
  {
    id: "suit-l-007", module: "suitability-client-fit", difficulty: "learner",
    question: "What does 'concentration risk' mean in a client's portfolio?",
    options: ["The risk that interest rates will rise", "The risk that an excessive portion of a portfolio is allocated to a single security, sector, or asset class, magnifying potential losses", "The risk of investing in foreign markets", "The risk that a mutual fund will close"],
    correctIndex: 1,
    explanation: "Concentration risk arises when a portfolio is overweighted in a single position, sector, or correlated asset class. If that position declines sharply, the portfolio suffers disproportionate losses. Diversification is the standard remedy. Suitability analysis must flag excessive concentration relative to the client's risk profile."
  },
  // Trainee
  {
    id: "suit-t-003", module: "suitability-client-fit", difficulty: "trainee",
    question: "FINRA Rule 2111 identifies three components of suitability obligations. Which of the following is NOT one of them?",
    options: [
      "Market-timing suitability",
      "Reasonable-basis suitability",
      "Customer-specific suitability",
      "Quantitative suitability"
    ],
    correctIndex: 0,
    explanation: "FINRA Rule 2111 identifies three suitability obligations: (1) Reasonable-basis — the recommendation is suitable for at least some investors; (2) Customer-specific — the recommendation is suitable for this particular customer's profile; (3) Quantitative — the overall frequency and cost of recommendations are not excessive. Market-timing suitability is not a recognized category."
  },
  {
    id: "suit-t-004", module: "suitability-client-fit", difficulty: "trainee",
    question: "Which of the following best describes 'churning' in a customer account?",
    options: [
      "Recommending low-cost index funds",
      "Rebalancing a portfolio annually",
      "Converting a traditional IRA to a Roth IRA",
      "Excessive trading in a customer's account primarily to generate commissions for the broker, without regard to the client's investment objectives"
    ],
    correctIndex: 3,
    explanation: "Churning (FINRA Rule 2111 quantitative suitability / SEC Rule 15c1-7) involves excessive trading that is in the interest of the broker rather than the client. Indicators include high turnover ratio, high cost-to-equity ratio, and trading frequency inconsistent with the client's stated objectives. It is a serious violation subject to sanctions."
  },
  {
    id: "suit-t-005", module: "suitability-client-fit", difficulty: "trainee",
    question: "Under SEC Regulation Best Interest, which of the following conflicts of interest must a broker-dealer disclose to retail customers?",
    options: [
      "Only conflicts that resulted in past customer complaints",
      "Conflicts of interest are not required to be disclosed under Reg BI",
      "All material conflicts of interest that could affect the recommendation, including compensation structures, proprietary products, and third-party payments",
      "Only conflicts exceeding $10,000 in value"
    ],
    correctIndex: 2,
    explanation: "Reg BI's Disclosure Obligation requires broker-dealers to disclose all material facts about the scope of the relationship and all material conflicts of interest — including how the firm and its associated persons are compensated, whether they recommend proprietary products, and any third-party payments that could influence recommendations."
  },
  {
    id: "suit-t-006", module: "suitability-client-fit", difficulty: "trainee",
    question: "A new client completes a risk tolerance questionnaire indicating she is 'conservative.' The advisor recommends a 70% equity portfolio. What is the primary concern?",
    options: [
      "The equity allocation is too low for a conservative investor",
      "The recommendation is inconsistent with the client's stated risk tolerance and requires documented justification or a change in recommendation",
      "Conservative investors should always hold 70% equities for inflation protection",
      "There is no concern — advisors may override questionnaire results"
    ],
    correctIndex: 1,
    explanation: "A 70% equity allocation is generally inconsistent with a conservative risk profile. Under both suitability (FINRA Rule 2111) and Reg BI, the advisor must have a reasonable basis that the recommendation matches the client's investment profile. If the advisor believes the questionnaire underestimates the client's actual tolerance, this must be documented through additional discovery and client confirmation."
  },
  {
    id: "suit-t-007", module: "suitability-client-fit", difficulty: "trainee",
    question: "Which of the following is a 'red flag' indicator of potential elder financial exploitation in a client account?",
    options: [
      "Sudden, large, or unexplained withdrawals; changes in beneficiary designations; a new third party begins accompanying the client and speaking for them; confusion about recent transactions the client did not initiate",
      "The client adds a new beneficiary at age 75",
      "The client requests a transfer to a new brokerage firm",
      "The client asks for a copy of their account statement"
    ],
    correctIndex: 0,
    explanation: "FINRA Rule 4512 and 2010 address elder financial exploitation. Red flags include: unexplained large withdrawals, sudden changes in account instructions or beneficiaries, a new third party asserting control, the client appearing confused or afraid, and unusual requests inconsistent with long-standing account patterns. Firms must have written procedures to detect, prevent, and report suspected exploitation."
  },
  // Associate
  {
    id: "suit-a-003", module: "suitability-client-fit", difficulty: "associate",
    question: "What is the 'know your customer' (KYC) obligation under FINRA Rule 4512 and how does it differ from suitability?",
    options: [
      "KYC and suitability are identical obligations",
      "KYC requires firms to collect and update essential facts about every customer and their account; suitability uses that information to evaluate whether a specific recommendation is appropriate",
      "KYC applies only to institutional customers",
      "KYC requires annual in-person meetings with every client"
    ],
    correctIndex: 1,
    explanation: "FINRA Rule 4512 (KYC) requires firms to use reasonable diligence to know each customer's essential facts — financial situation, investment objectives, risk tolerance, tax status. Suitability (Rule 2111) then uses that profile to evaluate whether specific recommendations are appropriate. KYC is the data-gathering obligation; suitability is the application obligation."
  },
  {
    id: "suit-a-004", module: "suitability-client-fit", difficulty: "associate",
    question: "A client's net worth is $2M but she has only $50,000 in liquid assets and needs the funds within 18 months for a home purchase. Which portfolio is most suitable?",
    options: [
      "70% equities / 30% bonds — net worth supports equity exposure",
      "100% equities — maximum growth potential",
      "50% equities / 50% alternatives for diversification",
      "Capital preservation allocation — short-duration bonds, money market, CDs — matching the 18-month liquidity need"
    ],
    correctIndex: 3,
    explanation: "Suitability requires matching the portfolio to the client's actual constraints — not just their net worth. With a specific 18-month liquidity need, the appropriate allocation prioritizes capital preservation and liquidity. Market risk on a portfolio that must be liquidated in 18 months is not suitable regardless of net worth."
  },
  {
    id: "suit-a-005", module: "suitability-client-fit", difficulty: "associate",
    question: "Under the Investment Advisers Act, what must an RIA do when a material conflict of interest exists that cannot be eliminated?",
    options: [
      "Terminate the client relationship",
      "Disclose the conflict only in the Form ADV filed with the SEC",
      "Fully disclose the conflict to the client and obtain informed consent, or decline to act",
      "Conflicts cannot exist if the adviser is registered"
    ],
    correctIndex: 2,
    explanation: "The RIA fiduciary duty requires full disclosure of all material conflicts of interest. If the conflict cannot be eliminated, the adviser must: (1) make full and fair disclosure sufficient for the client to provide informed consent; and (2) obtain that consent. If the conflict is so severe that it cannot be managed, the adviser must decline to act. Burying disclosure only in Form ADV without meaningful client communication is insufficient."
  },
  {
    id: "suit-a-006", module: "suitability-client-fit", difficulty: "associate",
    question: "What is a 'solicitor arrangement' under the Investment Advisers Act and what disclosure is required?",
    options: [
      "An arrangement where clients solicit new investors on behalf of the adviser",
      "A marketing agreement exempt from all disclosure requirements",
      "An arrangement where the adviser pays a third party to refer clients; the solicitor must provide clients with a written disclosure statement describing the arrangement and compensation paid",
      "An arrangement only available to institutional investors"
    ],
    correctIndex: 2,
    explanation: "Under SEC Rule 206(4)-3 (and the updated Marketing Rule under 206(4)-1), cash solicitation arrangements require the solicitor to provide clients with a written disclosure statement identifying the solicitor, the adviser, the nature of the arrangement, and the compensation paid. The client must acknowledge receipt. Undisclosed cash payments for referrals are fraudulent under the Advisers Act."
  },
  // Advisor
  {
    id: "suit-adv-002", module: "suitability-client-fit", difficulty: "advisor",
    question: "A portfolio manager runs a concentrated equity strategy. Her client's IPS specifies no more than 5% in any single position. She allows a winner to grow to 12% of the portfolio without rebalancing. What obligation has she potentially violated?",
    options: [
      "The duty of care under the fiduciary standard and the written IPS guidelines; failure to rebalance to IPS constraints constitutes a breach absent documented client approval for the deviation",
      "No obligation — letting winners run is a valid strategy",
      "The duty of loyalty only",
      "FINRA suitability rules only — not the fiduciary standard"
    ],
    correctIndex: 0,
    explanation: "An RIA managing a discretionary account is bound by the client's IPS. Allowing a position to exceed stated concentration limits without client authorization violates both the duty of care (competent management per the agreed strategy) and the written agreement with the client. The adviser must either rebalance or document an explicit client-approved deviation from the IPS constraints."
  },
  {
    id: "suit-adv-003", module: "suitability-client-fit", difficulty: "advisor",
    question: "Under FINRA Notice 12-25, what enhanced suitability obligations apply to recommendations of non-traditional ETFs (leveraged, inverse, or inverse-leveraged)?",
    options: [
      "No enhanced obligations — ETFs are always suitable",
      "Non-traditional ETFs require only a standard suitability review",
      "Enhanced obligations apply only to options, not ETFs",
      "Firms must ensure the registered representative understands the product and that it is suitable for the specific customer; these products are generally only appropriate for sophisticated investors with short-term trading objectives due to daily rebalancing decay"
    ],
    correctIndex: 3,
    explanation: "FINRA Regulatory Notice 09-31 (updated in 12-03) addresses leveraged, inverse, and inverse-leveraged ETFs. These products reset daily, causing performance to diverge from the stated multiple over holding periods longer than one day. They are generally suitable only for sophisticated investors with frequent monitoring capability and short-term objectives. Standard long-term buy-and-hold suitability analysis is insufficient."
  },
  {
    id: "suit-adv-004", module: "suitability-client-fit", difficulty: "advisor",
    question: "What is the 'best execution' obligation and to whom does it apply?",
    options: ["Best execution applies only to market makers", "Broker-dealers have an obligation to seek the most favorable terms reasonably available for customer orders, considering price, speed, likelihood of execution, and overall transaction quality — not merely the lowest commission", "Best execution requires always routing to the exchange with the highest volume", "Best execution applies only to orders over $1M"],
    correctIndex: 1,
    explanation: "Best execution is an obligation under SEC and FINRA rules requiring broker-dealers to seek the most favorable terms for customer orders. Factors include: price improvement opportunities, speed and likelihood of execution, order size, transaction costs, and market conditions. Payment for order flow arrangements must not compromise best execution. RIAs also have a fiduciary best execution obligation."
  },
  {
    id: "suit-adv-005", module: "suitability-client-fit", difficulty: "advisor",
    question: "A 78-year-old client with mild cognitive decline asks to transfer her entire $800,000 IRA to a new account in favor of someone you don't recognize. What is the regulatory framework for responding?",
    options: [
      "Under FINRA Rule 4512 and Rule 2165, you may place a temporary hold on a disbursement if there is a reasonable belief of financial exploitation; you must also contact a trusted contact person on file and notify appropriate parties per firm procedures",
      "Execute the transfer — the client has the legal right to direct her own account",
      "Report only to the IRS",
      "Require the client to obtain a court order before any action"
    ],
    correctIndex: 0,
    explanation: "FINRA Rule 2165 (Financial Exploitation of Specified Adults) permits firms to place a temporary hold (up to 25 business days) on disbursements when there is reasonable belief of financial exploitation. Rule 4512 requires firms to make reasonable efforts to obtain a trusted contact person at account opening. The firm must also review the situation and notify the trusted contact person of the hold."
  },
  // Senior
  {
    id: "suit-s-002", module: "suitability-client-fit", difficulty: "senior",
    question: "An institutional client asks an RIA to implement a complex derivatives overlay strategy. The client has confirmed they are an 'institutional account' under FINRA Rule 4512(c). Does the full suitability obligation apply?",
    options: [
      "Yes — full suitability applies to all clients regardless of classification",
      "No suitability obligation applies to institutional accounts under any circumstances",
      "FINRA Rule 2111 provides reduced suitability obligations for institutional accounts — the firm may rely on the institution's independent judgment if the institution independently evaluates and expresses understanding of the recommendation's risks",
      "Institutional accounts require more documentation than retail accounts under suitability rules"
    ],
    correctIndex: 2,
    explanation: "FINRA Rule 2111 provides an institutional suitability exemption: for institutional accounts, the broker-dealer may fulfill its suitability obligation by (1) having a reasonable basis to believe the institutional customer can evaluate investment risks independently, and (2) the institutional customer affirmatively indicates it is exercising independent judgment. The broker must still have a reasonable basis for the recommendation and must not make materially false statements."
  },
  {
    id: "suit-s-003", module: "suitability-client-fit", difficulty: "senior",
    question: "A dual-registrant (both broker-dealer and RIA) recommends a rollover of a client's 401(k) to an IRA where the adviser will earn ongoing advisory fees. What specific obligations apply under DOL and SEC rules?",
    options: [
      "No special obligations — rollovers are standard transactions",
      "Only Reg BI applies — DOL rules are separate and do not overlap",
      "Rollover recommendations require only a suitability analysis, not fiduciary analysis",
      "Under DOL PTE 2020-02, the adviser must act in the client's best interest, document that the rollover is in the client's best interest (comparing plan vs. IRA fees, services, investment options, and penalties), disclose all conflicts, and provide a written acknowledgment of fiduciary status"
    ],
    correctIndex: 3,
    explanation: "DOL Prohibited Transaction Exemption 2020-02 applies to rollover recommendations where the adviser receives compensation. The adviser must: (1) acknowledge fiduciary status in writing; (2) document that the rollover is in the client's best interest by comparing costs, services, investment options, employer stock considerations, creditor protection, and RMD requirements; (3) disclose all conflicts. Failure to comply exposes the adviser to DOL prohibited transaction penalties."
  },
  {
    id: "suit-s-004", module: "suitability-client-fit", difficulty: "senior",
    question: "Under the SEC's Marketing Rule (Rule 206(4)-1), what are the key requirements for an RIA using client testimonials in advertising?",
    options: [
      "Client testimonials are prohibited for all RIAs",
      "Testimonials are permitted but must include: disclosure that the testimonial was provided by a current client, whether compensation was paid, and a clear disclosure that the testimonial may not be representative of all clients' experiences; the adviser must have a reasonable basis for the claims",
      "Testimonials require no specific disclosures if unpaid",
      "Only past performance data must be disclosed alongside testimonials"
    ],
    correctIndex: 1,
    explanation: "The SEC Marketing Rule (effective November 2022) permits RIA use of testimonials and endorsements subject to: (1) disclosing whether the person is a current client, (2) disclosing whether compensation was paid (cash or non-cash), (3) clear and prominent disclosure that the testimonial may not be representative of all clients' experiences, and (4) the adviser having a reasonable basis for all factual claims. Compliance programs must include policies governing the use and review of testimonials."
  },
  {
    id: "suit-s-005", module: "suitability-client-fit", difficulty: "senior",
    question: "What is the primary regulatory distinction between a 'held' and 'non-held' order in a discretionary advisory account?",
    options: [
      "A held order requires execution at the best available price immediately; a non-held order grants the broker or adviser discretion over the timing and price of execution — shifting the best execution obligation and potential liability",
      "Held orders are always executed immediately; non-held orders are cancelled after 30 days",
      "Non-held orders are prohibited in retail accounts",
      "There is no regulatory distinction between held and non-held orders"
    ],
    correctIndex: 0,
    explanation: "A 'held' order requires immediate execution at the best available market price — the firm is responsible for best execution at that moment. A 'non-held' order grants the executing party discretion over timing and price, relieving the firm of strict price liability but maintaining the obligation to use reasonable judgment. Discretionary portfolio managers routinely use non-held orders for block trading and algorithmic execution strategies."
  },
  {
    id: "suit-s-006", module: "suitability-client-fit", difficulty: "senior",
    question: "An RIA allocates block trades across multiple client accounts. What fair allocation obligations apply?",
    options: [
      "The RIA may allocate trades in any order it chooses without restriction",
      "Only ERISA accounts require fair allocation procedures",
      "Fair allocation only applies to trades over $1M",
      "The RIA must maintain written policies ensuring fair and equitable allocation across accounts; cherry-picking favorable executions for certain accounts (including proprietary accounts) at the expense of clients is a fraud violation under the Advisers Act"
    ],
    correctIndex: 3,
    explanation: "The SEC has held that allocating block trades unfairly — such as waiting to see how trades perform before allocating favorable fills to preferred accounts — constitutes a breach of fiduciary duty and fraud under the Advisers Act. RIAs must maintain written trade allocation policies, apply them consistently, and document allocations. Systematic patterns favoring proprietary accounts or high-fee clients over others are violations."
  },
  {
    id: "suit-s-007", module: "suitability-client-fit", difficulty: "senior",
    question: "What is 'reverse churning' and how does it differ from churning?",
    options: [
      "Reverse churning and churning are the same violation",
      "Reverse churning only applies to bond portfolios",
      "Reverse churning occurs in fee-based accounts where the adviser earns a flat fee but trades too infrequently, leaving clients in a fee arrangement that is not in their best interest for their actual level of activity; the opposite of commission-driven overtrading",
      "Reverse churning is not a recognized regulatory concept"
    ],
    correctIndex: 2,
    explanation: "Reverse churning occurs when a client is placed in a fee-based account but the adviser trades very rarely — meaning the client would pay lower total costs in a transaction-based commission account. The fee arrangement benefits the adviser (predictable revenue) but not the client. Under Reg BI and the fiduciary standard, placing a client in a fee arrangement that is not in their best interest is a violation."
  },
  {
    id: "suit-s-008", module: "suitability-client-fit", difficulty: "senior",
    question: "Under FINRA Rule 3110, what supervisory system must a broker-dealer maintain regarding suitability of recommendations?",
    options: ["Supervision is optional for firms with fewer than 50 registered representatives", "Broker-dealers must establish and maintain a system reasonably designed to achieve compliance, including written supervisory procedures (WSPs), principal review of recommendations, exception reports for outlier activity, and branch office examinations", "Supervision only applies to options trading", "Supervisory obligations are delegated entirely to individual registered representatives"],
    correctIndex: 1,
    explanation: "FINRA Rule 3110 requires broker-dealers to establish and maintain a supervisory system that includes: written supervisory procedures (WSPs) tailored to the firm's business; designation of qualified supervisors; principal review of recommendations and transactions; exception reports identifying potential suitability violations (high turnover, concentration, unsuitable products); and periodic branch office inspections. Failure to supervise is an independent violation regardless of whether the underlying conduct caused harm."
  },
];

// ─── BANK LENDING EXPANSION (bl-l-003 through bl-s-009) ──────────────────────
const BANK_LENDING_EXPANSION: ModuleClientQuestion[] = [
  // Learner
  {
    id: "bl-l-003", module: "bank-lending", difficulty: "learner",
    question: "What does LTV stand for in lending and what does it measure?",
    options: ["Loan-to-Value ratio — the loan amount divided by the appraised value of the collateral", "Long-Term Viability — a measure of borrower stability", "Lender Total Value — the bank's total loan portfolio value", "Leverage-to-Value — the borrower's total debt relative to net worth"],
    correctIndex: 0,
    explanation: "Loan-to-Value (LTV) ratio is the loan amount divided by the appraised value of the property or collateral. An 80% LTV means the loan is 80% of the property's value. Higher LTV indicates lower equity cushion and higher lender risk. Most conventional mortgage programs require LTV ≤ 80% to avoid PMI."
  },
  {
    id: "bl-l-004", module: "bank-lending", difficulty: "learner",
    question: "What is a credit report and who may access it under the Fair Credit Reporting Act (FCRA)?",
    options: [
      "A credit report is a bank statement; anyone may access it freely",
      "A credit report is a detailed record of a person's credit history compiled by credit bureaus; access is restricted to parties with a permissible purpose such as credit application, employment, or insurance underwriting",
      "Credit reports are only available to federal agencies",
      "Anyone may access a credit report with written consent from the subject only if paid"
    ],
    correctIndex: 1,
    explanation: "The Fair Credit Reporting Act (FCRA) restricts access to consumer credit reports to parties with a 'permissible purpose' — including creditors evaluating applications, employers (with consent), landlords, and insurance underwriters. Unauthorized access is a federal violation. Consumers have the right to free annual reports from each bureau and to dispute inaccurate information."
  },
  {
    id: "bl-l-005", module: "bank-lending", difficulty: "learner",
    question: "What is the difference between secured and unsecured debt?",
    options: [
      "Secured debt has lower interest rates; unsecured debt always has higher rates regardless of credit quality",
      "Secured debt is only available to businesses",
      "Unsecured debt requires a co-signer in all cases",
      "Secured debt is backed by collateral the lender can seize upon default; unsecured debt has no collateral — the lender's recourse is limited to legal judgment against the borrower"
    ],
    correctIndex: 3,
    explanation: "Secured debt (mortgages, auto loans) is backed by specific collateral. If the borrower defaults, the lender can repossess or foreclose on the collateral. Unsecured debt (credit cards, personal loans) relies solely on the borrower's creditworthiness — lenders must sue to obtain a judgment and then garnish wages or bank accounts to collect."
  },
  {
    id: "bl-l-006", module: "bank-lending", difficulty: "learner",
    question: "What is an origination fee in the context of a loan?",
    options: [
      "A fee charged by the credit bureau for pulling the borrower's credit report",
      "A government fee required on all federally backed loans",
      "A fee charged by the lender for processing and underwriting the loan, typically expressed as a percentage of the loan amount (points)",
      "A fee charged when the borrower pays off the loan early"
    ],
    correctIndex: 2,
    explanation: "An origination fee (or points) is charged by the lender to cover the cost of processing, underwriting, and closing the loan. One point equals 1% of the loan amount. Origination fees are disclosed on the Loan Estimate and Closing Disclosure under TRID (TILA-RESPA Integrated Disclosure) rules. They factor into the APR calculation."
  },
  {
    id: "bl-l-007", module: "bank-lending", difficulty: "learner",
    question: "Which federal law requires lenders to disclose the Annual Percentage Rate (APR) on consumer credit products?",
    options: [
      "Fair Housing Act",
      "Equal Credit Opportunity Act (ECOA)",
      "Truth in Lending Act (TILA) / Regulation Z",
      "Dodd-Frank Wall Street Reform Act"
    ],
    correctIndex: 2,
    explanation: "The Truth in Lending Act (TILA), implemented by the Federal Reserve's Regulation Z (now CFPB), requires lenders to disclose the APR — which includes interest plus certain fees — in a standardized format. APR enables consumers to compare the true cost of credit across different lenders and loan products."
  },
  // Trainee
  {
    id: "bl-t-003", module: "bank-lending", difficulty: "trainee",
    question: "What is the difference between 'front-end' and 'back-end' DTI ratios in mortgage underwriting?",
    options: [
      "Front-end DTI (housing ratio) = PITIA / gross monthly income; back-end DTI (total debt ratio) = all monthly debt obligations including PITIA / gross monthly income",
      "Front-end and back-end DTI are the same calculation",
      "Front-end DTI includes student loans; back-end DTI excludes them",
      "Back-end DTI is used only for FHA loans"
    ],
    correctIndex: 0,
    explanation: "Front-end DTI (housing ratio) measures only the proposed housing payment (Principal, Interest, Taxes, Insurance, and HOA) relative to gross monthly income. Back-end DTI includes all monthly debt obligations — housing plus car loans, student loans, minimum credit card payments, and other installment or revolving debts. Conventional guidelines typically require front-end ≤ 28% and back-end ≤ 43-45%."
  },
  {
    id: "bl-t-004", module: "bank-lending", difficulty: "trainee",
    question: "Under the Home Mortgage Disclosure Act (HMDA), what are lenders required to do?",
    options: [
      "Set maximum interest rates on home loans",
      "Offer mortgages to all applicants regardless of creditworthiness",
      "Provide free credit counseling to all applicants",
      "Collect, record, and report data on mortgage applications and originations by borrower demographics and loan characteristics to help identify discriminatory lending patterns"
    ],
    correctIndex: 3,
    explanation: "HMDA (1975, implemented by Regulation C) requires most mortgage lenders to collect and report data on mortgage applications including loan type, purpose, borrower demographics (race, ethnicity, sex, income), and loan disposition. The data is used by regulators to identify fair lending violations and underserved communities."
  },
  {
    id: "bl-t-005", module: "bank-lending", difficulty: "trainee",
    question: "What is a 'hard inquiry' on a credit report and how does it affect a credit score?",
    options: [
      "A hard inquiry has no impact on credit scores",
      "A hard inquiry occurs when a lender pulls your credit for a credit application; it typically reduces the FICO score by a few points and remains on the report for 2 years",
      "A hard inquiry remains on the report for 7 years and reduces the score by 50 points",
      "Hard inquiries only affect credit scores for business loans"
    ],
    correctIndex: 1,
    explanation: "A hard inquiry (hard pull) occurs when a lender checks credit in connection with a credit application. It typically reduces the FICO score by 1-5 points and remains on the report for 2 years but affects the score for 12 months. Multiple mortgage or auto loan inquiries within a 14-45 day window are typically treated as a single inquiry by FICO (rate shopping protection)."
  },
  {
    id: "bl-t-006", module: "bank-lending", difficulty: "trainee",
    question: "What is 'predatory lending' and which federal laws are primarily designed to combat it?",
    options: [
      "Predatory lending involves deceptive, unfair, or abusive loan terms that harm borrowers; primary federal protections include TILA (Reg Z), HOEPA (High Cost Mortgage rules), Dodd-Frank UDAP/UDAAP provisions, and ECOA",
      "Predatory lending is a marketing term with no legal definition",
      "Predatory lending only applies to payday loans",
      "Predatory lending is only prohibited in mortgage transactions over $500,000"
    ],
    correctIndex: 0,
    explanation: "Predatory lending exploits borrowers through deceptive practices, excessive fees, inappropriate products, or terms the borrower cannot afford. Key federal protections: TILA/Reg Z requires cost disclosure; HOEPA (High Cost Mortgage) imposes restrictions on high-rate loans; Dodd-Frank UDAAP (Unfair, Deceptive, or Abusive Acts or Practices) gives the CFPB broad authority to prohibit harmful practices; ECOA prohibits discriminatory lending."
  },
  {
    id: "bl-t-007", module: "bank-lending", difficulty: "trainee",
    question: "What is the purpose of the Uniform Residential Loan Application (URLA / Fannie Mae Form 1003)?",
    options: [
      "To document the lender's internal credit decision only",
      "To set the interest rate on the loan",
      "To collect standardized information about the borrower's income, assets, liabilities, employment, and the subject property — used by lenders and GSEs (Fannie Mae/Freddie Mac) to evaluate mortgage applications",
      "To report the loan to the IRS"
    ],
    correctIndex: 2,
    explanation: "The URLA (Form 1003) is the standardized mortgage application used across the industry. It collects: borrower and co-borrower information, employment and income history, assets and liabilities, real estate owned, loan purpose and property details, and demographic information for HMDA reporting. It is required for all conventional and government-backed mortgage originations."
  },
  // Associate
  {
    id: "bl-a-003", module: "bank-lending", difficulty: "associate",
    question: "A borrower has a 680 FICO score, 42% back-end DTI, and only 2 months of reserves. How should an underwriter assess this file for a conventional mortgage?",
    options: [
      "Approve — all metrics are within guidelines",
      "Approve with no conditions — FICO 680 is sufficient",
      "Decline only because of the credit score",
      "Conditional or decline — the file has layered risk: DTI is above the standard threshold, reserves are below typical minimums, and the credit score is at the lower end of conventional eligibility; compensating factors are needed"
    ],
    correctIndex: 3,
    explanation: "This file has 'layered risk' — multiple marginal factors that compound each other. Individually, each factor might be manageable, but together they represent elevated default risk. Conventional underwriting (DU/LP) may still approve with compensating factors (strong income, low LTV, longer credit history), but the underwriter should flag the combined risk and may require additional documentation or conditions."
  },
  {
    id: "bl-a-004", module: "bank-lending", difficulty: "associate",
    question: "What is Debt Service Coverage Ratio (DSCR) in commercial real estate lending and what does a DSCR below 1.0 indicate?",
    options: ["DSCR is the same as LTV; below 1.0 means the loan exceeds the property value", "DSCR = Net Operating Income / Annual Debt Service; a DSCR below 1.0 means the property does not generate enough income to cover its debt payments — the borrower must contribute personal funds to service the debt", "DSCR below 1.0 is acceptable for new construction loans", "DSCR only applies to residential loans"],
    correctIndex: 1,
    explanation: "DSCR measures whether a property's income covers its debt service. A DSCR of 1.25x means the property generates 25% more income than needed to service the debt — standard lender minimum. A DSCR below 1.0 means the property operates at a cash-flow deficit; the borrower must inject personal funds to make payments, representing significant lender risk. Commercial lenders typically require DSCR of 1.20-1.30x minimum."
  },
  {
    id: "bl-a-005", module: "bank-lending", difficulty: "associate",
    question: "What is a 'conditional approval' in mortgage underwriting and what are common conditions?",
    options: [
      "A conditional approval means the underwriter approves the loan subject to the borrower satisfying specific outstanding requirements before closing — common conditions include updated pay stubs, explanation letters, appraisal review, title insurance commitment, and proof of insurance",
      "A conditional approval means the loan is declined pending further review",
      "Conditional approvals expire after 24 hours",
      "Conditional approvals are only issued for FHA loans"
    ],
    correctIndex: 0,
    explanation: "A conditional approval (also called 'approved with conditions' or 'credit approval') means the underwriter has reviewed the file and approves the credit, subject to receipt and review of specific outstanding items. Common conditions: most recent pay stubs/bank statements, letter of explanation for credit inquiries or late payments, gift letter for down payment funds, satisfactory appraisal, title commitment, homeowner's insurance binder."
  },
  {
    id: "bl-a-006", module: "bank-lending", difficulty: "associate",
    question: "Under the Bank Secrecy Act (BSA), what is a Suspicious Activity Report (SAR) and when must a bank file one?",
    options: [
      "A SAR is filed when a customer's credit score drops below 600",
      "SARs are voluntary reports filed at the bank's discretion with no minimum threshold",
      "SARs are only required for wire transfers",
      "A SAR must be filed when a bank knows, suspects, or has reason to suspect that a transaction involves funds from illegal activity, is designed to evade reporting requirements, lacks a lawful purpose, or involves potential money laundering — generally for transactions of $5,000 or more"
    ],
    correctIndex: 3,
    explanation: "Under the BSA (31 USC §5318(g)) and FinCEN regulations, banks must file a SAR within 30 days of detecting suspicious activity involving $5,000 or more (or $2,000 for MSBs). SAR filings are confidential — banks may not disclose to the subject of the report that a SAR was filed. SARs are a key tool in anti-money laundering (AML) compliance programs."
  },
  // Advisor
  {
    id: "bl-adv-002", module: "bank-lending", difficulty: "advisor",
    question: "What is the difference between a loan covenant and a loan condition in commercial lending?",
    options: [
      "Loan covenants and conditions are interchangeable terms",
      "Covenants apply only to personal guarantees",
      "Conditions are requirements that must be met before loan funding; covenants are ongoing obligations the borrower must maintain throughout the loan term — violations of covenants can trigger a default even if payments are current",
      "Conditions apply only after closing"
    ],
    correctIndex: 2,
    explanation: "Loan conditions (precedent) must be satisfied before funding — e.g., title insurance, appraisal, insurance. Covenants are ongoing contractual obligations: financial covenants (maintain minimum DSCR, maximum leverage ratio, minimum liquidity); reporting covenants (submit annual financials); affirmative covenants (maintain insurance, pay taxes); negative covenants (no additional debt without consent). A covenant breach gives the lender the right to call the loan or require cure."
  },
  {
    id: "bl-adv-003", module: "bank-lending", difficulty: "advisor",
    question: "A business loan applicant presents three years of tax returns showing declining revenue. How should a commercial underwriter approach the income analysis?",
    options: ["Use the most recent year's income only", "Analyze the trend — declining revenue is a key risk indicator; the underwriter should determine the cause (cyclical vs. structural), average income appropriately or use the lowest year conservatively, stress-test debt service at the lower income level, and consider requesting updated interim financials", "Average all three years without further analysis", "Decline automatically — any revenue decline disqualifies the borrower"],
    correctIndex: 1,
    explanation: "Declining revenue is a material underwriting concern. The underwriter should: (1) identify the cause — one-time events vs. structural trends; (2) use the most conservative income figure or a declining trend adjustment rather than a simple average; (3) stress-test the DSCR at reduced income levels; (4) request current-year interim financials and a business explanation. Averaging three years when the trend is downward overstates supportable income."
  },
  {
    id: "bl-adv-004", module: "bank-lending", difficulty: "advisor",
    question: "What is 'relationship lending' and how does it affect the underwriting process?",
    options: [
      "Relationship lending refers to extending credit based on a long-term banking relationship with knowledge of the borrower beyond the current application — it can provide qualitative information that improves underwriting accuracy, but creates risk of credit decisions being influenced by relationship pressure rather than credit quality",
      "Relationship lending means approving loans for family members only",
      "Relationship lending is prohibited by federal regulation",
      "Relationship lending eliminates the need for financial documentation"
    ],
    correctIndex: 0,
    explanation: "Relationship lending uses private information accumulated over time (deposit patterns, cash flows, business cycles) to reduce information asymmetry. This can improve underwriting accuracy. However, it creates risks: pressure to accommodate valued customers despite marginal credit profiles, and potential ECOA violations if relationship factors serve as proxies for protected classes. Sound credit culture requires that relationship context inform — but not override — objective underwriting standards."
  },
  {
    id: "bl-adv-005", module: "bank-lending", difficulty: "advisor",
    question: "Under RESPA (Real Estate Settlement Procedures Act), what is prohibited regarding referral fees in the mortgage settlement process?",
    options: ["RESPA prohibits lenders from recommending title companies", "RESPA Section 8 prohibits the payment or receipt of any fee, kickback, or thing of value in exchange for the referral of settlement service business — including fees between lenders, title companies, real estate agents, and other settlement service providers", "RESPA only applies to FHA loans", "RESPA prohibitions only apply to fees over $1,000"],
    correctIndex: 1,
    explanation: "RESPA Section 8 prohibits kickbacks and referral fees in the settlement services industry. For example, a lender may not pay a real estate agent for referring borrowers, nor may a title company pay a mortgage broker for steering business. Violations can result in criminal penalties, civil liability, and regulatory sanctions. Permitted arrangements include payments for actual services rendered at market rates."
  },
  // Senior
  {
    id: "bl-s-002", module: "bank-lending", difficulty: "senior",
    question: "A bank's loan portfolio shows significant concentration in commercial real estate (CRE). What regulatory guidance applies and what actions should risk management take?",
    options: [
      "CRE concentration has no specific regulatory guidance",
      "CRE concentration is managed solely through higher loan loss reserves",
      "CRE concentration only applies to community banks",
      "OCC/FDIC/Fed guidance (2006 CRE Concentration Guidance) advises banks with CRE loans exceeding 300% of risk-based capital (or construction/land > 100%) to implement enhanced risk management: board oversight, stress testing, concentration limits, independent loan review, and portfolio-level risk analysis"
    ],
    correctIndex: 3,
    explanation: "The 2006 interagency CRE Concentration Guidance identifies concentration thresholds that trigger heightened regulatory scrutiny: total CRE > 300% of risk-based capital, or construction/land > 100% of risk-based capital. Banks exceeding these thresholds should implement: formal CRE risk management policies, stress testing under adverse scenarios, independent loan review, limits on new CRE originations, and board-level reporting of portfolio concentrations."
  },
  {
    id: "bl-s-003", module: "bank-lending", difficulty: "senior",
    question: "What is a 'participation loan' in commercial banking and what risk management considerations apply?",
    options: [
      "A loan where the borrower participates in profit-sharing with the bank",
      "A government-guaranteed loan program",
      "A loan originated by a lead bank and then sold in whole or in part to one or more participating banks; risk management considerations include due diligence on the lead bank's underwriting standards, legal documentation of participation rights, monitoring obligations, and concentration limits",
      "A loan requiring multiple borrower signatures"
    ],
    correctIndex: 2,
    explanation: "In a loan participation, the lead bank originates and services the loan while selling interests to participating banks to manage concentration risk or fund larger credits. Key risk considerations for participants: (1) reliance on lead bank's underwriting — verify standards independently; (2) participation agreement terms — right to approve modifications, vote on waivers; (3) asset quality monitoring — participants may have limited information rights; (4) regulatory treatment — OCC guidance requires participants to conduct independent credit analysis, not rely solely on the lead bank."
  },
  {
    id: "bl-s-004", module: "bank-lending", difficulty: "senior",
    question: "Under Basel III capital requirements, how does a well-capitalized bank's lending capacity relate to its Tier 1 capital ratio?",
    options: [
      "There is no relationship between Tier 1 capital and lending capacity",
      "Basel III only applies to investment banks",
      "Well-capitalized status requires a Tier 1 capital ratio of at least 6% (8% for Total Capital) under Basel III; capital requirements constrain lending capacity because risk-weighted assets must be supported by adequate capital — additional lending increases RWA and may require additional capital to maintain well-capitalized status",
      "Tier 1 capital requirements only apply to international banks"
    ],
    correctIndex: 2,
    explanation: "Basel III (implemented in the U.S. as enhanced prudential standards) requires: CET1 ≥ 4.5%, Tier 1 ≥ 6%, Total Capital ≥ 8%, plus a Capital Conservation Buffer of 2.5%. As a bank makes loans, risk-weighted assets (RWA) increase. If RWA grows faster than capital, ratios decline. Banks approaching minimum thresholds must choose between raising capital, reducing risk-weighted assets (tightening lending), or both."
  },
  {
    id: "bl-s-005", module: "bank-lending", difficulty: "senior",
    question: "What is 'credit risk migration' and why is it important for bank loan portfolio management?",
    options: [
      "Credit risk migration refers to changes in a borrower's credit rating or risk classification over time — monitoring migration from investment grade to sub-investment grade (or internal risk grades) enables early identification of deteriorating credits, proactive workout strategies, and appropriate loan loss reserve adjustments under CECL",
      "Credit risk migration only applies to bond portfolios, not bank loans",
      "Credit risk migration refers to transferring loans between banks",
      "Credit risk migration has no impact on loan loss reserves"
    ],
    correctIndex: 0,
    explanation: "Credit risk migration tracks how borrowers move between risk grades over time. Under CECL (Current Expected Credit Loss — ASC 326), banks must estimate lifetime expected credit losses, making migration analysis critical for reserve adequacy. A portfolio migrating toward higher-risk grades requires increased reserves. Internal risk rating systems, quarterly reviews, and migration matrices are standard tools for monitoring portfolio quality and capital planning."
  },
];

// ─── MORTGAGE AND DEBT PLANNING EXPANSION ────────────────────────────────────
const MORTGAGE_EXPANSION: ModuleClientQuestion[] = [
  // Learner
  {
    id: "mtg-l-003", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is PITI in the context of a mortgage payment?",
    options: [
      "Premium, Index, Term, Income — components used to calculate an ARM rate",
      "Principal, Interest, Title, Inspection — closing cost components",
      "Payment, Income, Term, Insurance — DTI calculation inputs",
      "Principal, Interest, Taxes, Insurance — the four components of a typical monthly mortgage payment"
    ],
    correctIndex: 3,
    explanation: "PITI refers to the four components of a monthly mortgage payment: Principal (loan balance reduction), Interest (cost of borrowing), Taxes (property tax escrow), and Insurance (homeowner's insurance escrow, and PMI if applicable). Lenders use total PITI to calculate the front-end DTI ratio."
  },
  {
    id: "mtg-l-004", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is a 'down payment' and how does its size affect the borrower?",
    options: ["A down payment is a fee paid to the real estate agent", "A down payment is the portion of the purchase price paid upfront by the buyer; a larger down payment reduces the loan amount, avoids PMI (if ≥20%), and results in lower monthly payments and less interest paid over the loan term", "Down payments are required only for FHA loans", "Down payment size has no impact on the loan terms"],
    correctIndex: 1,
    explanation: "The down payment is the buyer's equity contribution at closing. Benefits of a larger down payment: lower LTV (reduces lender risk and may improve rate), avoidance of PMI at ≥20% down, smaller loan balance, lower monthly payment, and less total interest. First-time buyer programs (FHA, VA, USDA) allow down payments as low as 0-3.5%."
  },
  {
    id: "mtg-l-005", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is the difference between pre-qualification and pre-approval for a mortgage?",
    options: [
      "Pre-qualification is an informal estimate based on self-reported information with no credit check; pre-approval involves a formal application, credit pull, income/asset verification, and is a conditional commitment from the lender",
      "Pre-qualification and pre-approval are legally identical",
      "Pre-approval guarantees the loan will close",
      "Pre-qualification is only available for FHA loans"
    ],
    correctIndex: 0,
    explanation: "Pre-qualification provides a quick estimate of how much a borrower might qualify for based on self-reported data — no credit check, no documentation. Pre-approval involves a full application, hard credit inquiry, income and asset verification, and a conditional loan commitment. Pre-approval is significantly stronger for sellers and more reliable for buyers budgeting their purchase."
  },
  {
    id: "mtg-l-006", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What is 'amortization' in the context of a mortgage loan?",
    options: [
      "Amortization is the process of adding interest to the loan balance",
      "Amortization only applies to adjustable-rate mortgages",
      "Amortization is the scheduled repayment of a loan through regular payments that cover both principal and interest, gradually reducing the loan balance to zero over the loan term",
      "Amortization refers to the depreciation of the property value"
    ],
    correctIndex: 2,
    explanation: "Amortization describes the gradual payoff of a loan through scheduled payments. Early payments are predominantly interest (the balance is high); as the balance decreases, more of each payment goes toward principal. A standard 30-year fixed mortgage fully amortizes — meaning the balance reaches exactly zero — after 360 payments."
  },
  {
    id: "mtg-l-007", module: "mortgage-debt-planning", difficulty: "learner",
    question: "What does 'closing costs' refer to in a mortgage transaction?",
    options: [
      "The final monthly mortgage payment",
      "The cost of the home inspection only",
      "Closing costs are paid by the seller in all transactions",
      "The fees and expenses paid at closing to complete the mortgage transaction, typically 2-5% of the loan amount, including origination fees, appraisal, title insurance, escrow fees, and prepaid items"
    ],
    correctIndex: 3,
    explanation: "Closing costs are the fees required to complete a mortgage transaction. Typical costs: loan origination fee, appraisal fee, credit report fee, title search and insurance, escrow/closing fee, recording fees, prepaid interest, initial escrow deposits (taxes and insurance). Under TRID rules, lenders must provide a Loan Estimate within 3 days of application and a Closing Disclosure 3 business days before closing."
  },
  // Trainee
  {
    id: "mtg-t-003", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What are the key differences between FHA, VA, and conventional mortgage loans?",
    options: ["They are identical products offered by different lenders", "FHA loans (3.5% down, MIP required, FICO ≥ 580) are government-insured for lower-credit borrowers; VA loans (0% down, no PMI, for eligible veterans) are government-guaranteed; conventional loans (typically 5-20% down, FICO ≥ 620) are not government-backed and follow Fannie Mae/Freddie Mac guidelines", "VA loans require 10% down", "FHA loans are only for first-time homebuyers"],
    correctIndex: 1,
    explanation: "FHA (Federal Housing Administration): government-insured, 3.5% minimum down (FICO 580+), requires upfront and annual MIP. VA: available to eligible veterans/active duty, 0% down, no PMI, VA funding fee applies. USDA: 0% down for eligible rural properties. Conventional: not government-backed, follows GSE guidelines, 3-20% down, PMI required if <20% down, generally best pricing for strong-credit borrowers."
  },
  {
    id: "mtg-t-004", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What is negative amortization and why is it considered a risky mortgage feature?",
    options: [
      "Negative amortization occurs when the scheduled payment is less than the interest due, causing the unpaid interest to be added to the loan balance — the borrower owes more than they originally borrowed despite making payments",
      "Negative amortization occurs when extra principal payments are made, reducing the balance faster",
      "Negative amortization is a feature exclusive to commercial loans",
      "Negative amortization is required by federal law for option-ARM mortgages"
    ],
    correctIndex: 0,
    explanation: "Negative amortization (NegAm) occurs in certain loan structures (option ARMs, graduated payment mortgages) where minimum payments don't cover accruing interest. The unpaid interest is added to the principal balance, creating 'deferred interest' or 'accrued interest.' This can result in the loan balance exceeding the original amount borrowed — called being 'upside down' — and is a prohibited feature in Qualified Mortgages under Dodd-Frank."
  },
  {
    id: "mtg-t-005", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What is the TRID rule and what disclosures does it require?",
    options: [
      "TRID applies only to commercial real estate loans",
      "TRID requires lenders to match the lowest competitor rate",
      "TRID only applies to adjustable-rate mortgages",
      "TRID (TILA-RESPA Integrated Disclosure) combines the old Good Faith Estimate and Truth-in-Lending disclosures into two forms: the Loan Estimate (provided within 3 business days of application) and the Closing Disclosure (provided 3 business days before consummation), enabling borrowers to understand and compare loan costs"
    ],
    correctIndex: 3,
    explanation: "TRID (effective October 2015) created two integrated disclosure forms: (1) Loan Estimate — replaces the GFE and early TIL, due within 3 business days of application, shows estimated costs in a standardized format; (2) Closing Disclosure — replaces the HUD-1 Settlement Statement and final TIL, due 3 business days before closing, shows final costs. The 3-day waiting period for the CD gives borrowers time to review final terms before signing."
  },
  {
    id: "mtg-t-006", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What is a 'cash-out refinance' and what are the key financial planning considerations?",
    options: [
      "A cash-out refinance is where the borrower pays extra cash at closing to reduce the principal",
      "Cash-out refinancing is prohibited by federal regulation",
      "A cash-out refinance replaces the existing mortgage with a new, larger loan — the borrower receives the difference in cash; considerations include: the new interest rate vs. current rate, reset of amortization schedule, use of proceeds (investment vs. consumption), and impact on home equity",
      "Cash-out refinances are only available for investment properties"
    ],
    correctIndex: 2,
    explanation: "A cash-out refinance allows homeowners to tap home equity by refinancing to a larger loan amount and receiving the excess as cash. Key considerations: (1) rate comparison — if refinancing a 3% mortgage to 7% to pull cash, the all-in cost may be very high; (2) purpose — using proceeds for home improvements (productive) vs. consumption (destroys equity); (3) LTV after cash-out — typically limited to 80% LTV for conventional; (4) tax implications — interest on cash-out proceeds used for non-home purposes is not deductible under current law."
  },
  {
    id: "mtg-t-007", module: "mortgage-debt-planning", difficulty: "trainee",
    question: "What is a debt avalanche strategy for consumer debt payoff?",
    options: [
      "Pay off the smallest balance first to build momentum",
      "Pay minimum payments on all debts and direct extra payments to the debt with the highest interest rate first — minimizes total interest paid over the repayment period",
      "Pay all debts equally regardless of interest rate",
      "Only make minimum payments until debts are consolidated"
    ],
    correctIndex: 1,
    explanation: "The debt avalanche strategy directs extra payments to the highest-interest-rate debt first while making minimum payments on all others. Once the highest-rate debt is eliminated, redirect payments to the next highest. This minimizes total interest paid over the repayment period and is mathematically optimal. The debt snowball (smallest balance first) may be psychologically preferable but costs more in total interest."
  },
  // Associate
  {
    id: "mtg-a-003", module: "mortgage-debt-planning", difficulty: "associate",
    question: "A client has a $400,000 home with a $250,000 mortgage at 6.5% and $80,000 in a HELOC at 9.5%. She wants to consolidate. What analysis is required?",
    options: [
      "Analyze the combined LTV (82.5% — likely too high without PMI), compare the blended rate of the existing structure vs. consolidation cost, evaluate whether refinancing the first mortgage forfeits a favorable rate, assess closing costs vs. interest savings, and determine if cash-flow improvement justifies the transaction costs",
      "Simply refinance everything into one loan at the current market rate without further analysis",
      "Refinance only if the rate drops by exactly 1%",
      "Always recommend paying off the HELOC first before any refinancing"
    ],
    correctIndex: 0,
    explanation: "Debt consolidation analysis requires: (1) LTV calculation — ($250K + $80K) / $400K = 82.5%, requiring PMI unless the home has appreciated; (2) blended rate comparison — weighted average current rate vs. new consolidated rate; (3) break-even on closing costs; (4) whether the first mortgage rate is worth sacrificing (a 3% first mortgage + 9.5% HELOC may be better than a single 7% loan); (5) tax treatment of consolidated HELOC interest."
  },
  {
    id: "mtg-a-004", module: "mortgage-debt-planning", difficulty: "associate",
    question: "A client in California is purchasing a $980,000 home with 20% down. What type of mortgage is required for the $784,000 loan?",
    options: [
      "Standard conforming conventional loan — under all loan limits",
      "Jumbo mortgage — the loan amount exceeds the 2024 conforming loan limit of $766,550 (standard areas) and requires jumbo underwriting with stricter credit, reserve, and documentation requirements",
      "FHA loan — available for any loan amount",
      "VA loan — available for any veteran regardless of loan size"
    ],
    correctIndex: 1,
    explanation: "The 2024 conforming loan limit (Fannie Mae/Freddie Mac) is $766,550 for most U.S. areas ($1,149,825 in high-cost areas like parts of California). A $784,000 loan in a standard-limit area is a jumbo loan — it cannot be sold to the GSEs and must be kept on the lender's balance sheet or sold in the private market. Jumbo underwriting typically requires: FICO ≥ 700-720, reserves of 6-12 months, lower DTI, and full documentation."
  },
  {
    id: "mtg-a-005", module: "mortgage-debt-planning", difficulty: "associate",
    question: "What is a Section 1031 exchange and how can it benefit a real estate investor's debt planning?",
    options: [
      "A 1031 exchange allows investors to exchange residential mortgages",
      "1031 exchanges apply to all real estate including primary residences",
      "1031 exchanges require the new property to have a lower mortgage than the relinquished property",
      "A 1031 exchange (IRC §1031) allows the deferral of capital gains tax on investment property sales if the proceeds are reinvested in a like-kind property within specified time limits (45-day identification, 180-day closing); it allows an investor to leverage equity into a larger property without a tax drag, potentially increasing the debt capacity for a new acquisition"
    ],
    correctIndex: 3,
    explanation: "A like-kind exchange under IRC §1031 defers recognition of capital gain on the sale of investment or business property. Requirements: (1) exchange of like-kind property (real estate for real estate); (2) identify replacement property within 45 days; (3) close on replacement within 180 days; (4) use a qualified intermediary (QI) to hold proceeds. The investor must acquire equal or greater debt on the replacement property to defer all gain — receiving 'boot' (cash or debt relief) is partially taxable."
  },
  {
    id: "mtg-a-006", module: "mortgage-debt-planning", difficulty: "associate",
    question: "What is a 'streamline refinance' and for which loan types is it available?",
    options: [
      "A streamline refinance is available for all mortgage types and allows any borrower to reduce their rate without an appraisal",
      "Streamline refinancing requires a new full appraisal in all cases",
      "A streamline refinance is a simplified refinance program for existing government-backed loans (FHA Streamline, VA IRRRL, USDA Streamline) that reduces documentation and often waives the appraisal requirement, available only when the result is a net tangible benefit to the borrower",
      "Streamline refinancing is available only once per borrower"
    ],
    correctIndex: 2,
    explanation: "Streamline refinance programs are available for FHA (FHA Streamline), VA (Interest Rate Reduction Refinance Loan — IRRRL), and USDA loans. They simplify the process for borrowers with existing government-backed loans: no new appraisal typically required, reduced documentation, no cash-out. The borrower must demonstrate a 'net tangible benefit' — typically a lower payment, lower rate, or movement from ARM to fixed. Not available for conventional loans."
  },
  // Advisor
  {
    id: "mtg-adv-002", module: "mortgage-debt-planning", difficulty: "advisor",
    question: "A client is deciding between a 15-year and 30-year fixed mortgage on a $600,000 purchase. What is the most comprehensive analysis framework?",
    options: [
      "Always choose the 15-year — it saves the most interest",
      "Always choose the 30-year for flexibility",
      "Compare: total interest cost over each loan term, monthly payment difference, opportunity cost of the payment differential (invest the difference in a taxable account at an expected return), after-tax mortgage cost (if itemizing), flexibility value of lower required payments (30-year), and the client's other financial priorities (retirement savings, emergency fund, education)",
      "The decision depends solely on current interest rates"
    ],
    correctIndex: 2,
    explanation: "15 vs. 30-year analysis: (1) total interest — 15-year saves substantially (often $200K+ over the loan life at current rates); (2) monthly cash flow — 30-year payment is ~30-40% lower; (3) opportunity cost — the payment differential invested in a diversified portfolio may outperform the interest savings; (4) after-tax cost — mortgage interest deduction reduces the effective rate for itemizers; (5) behavioral — many clients benefit from forced equity building of the 15-year; (6) financial priorities — if client is behind on retirement savings, the 30-year payment frees cash for 401(k) contributions."
  },
  {
    id: "mtg-adv-003", module: "mortgage-debt-planning", difficulty: "advisor",
    question: "What is 'mortgage recasting' and how does it differ from refinancing?",
    options: [
      "Mortgage recasting involves making a large principal payment and asking the lender to re-amortize the remaining balance over the remaining term at the existing interest rate — the rate and term don't change, but the monthly payment decreases; unlike refinancing, there are no closing costs or new underwriting",
      "Recasting and refinancing are the same transaction",
      "Recasting changes the interest rate of the existing loan",
      "Recasting is only available for jumbo loans"
    ],
    correctIndex: 0,
    explanation: "Recasting (re-amortization) allows a borrower to make a lump-sum principal payment (typically $10,000+ minimum) and have the lender recalculate the monthly payment over the remaining term at the existing rate. Benefits: lower monthly payment without refinancing costs or new underwriting. Limitations: doesn't change the rate, not all loan types qualify (FHA and VA typically don't allow recasting), and the lender must agree. Ideal when the client has a low existing rate but wants to reduce monthly cash outflow."
  },
  {
    id: "mtg-adv-004", module: "mortgage-debt-planning", difficulty: "advisor",
    question: "A client has a $750,000 interest-only loan resetting to fully amortizing in 24 months. What planning steps are most critical?",
    options: [
      "No action needed until the reset occurs",
      "Simply refinance at any rate to avoid the reset",
      "Advise the client to sell the property immediately",
      "Model the new fully amortizing payment now (will increase significantly — potentially doubling); stress test the client's cash flow under the new payment; evaluate: refinance before reset (rate comparison), accelerate principal paydown to reduce balance, or budget for the payment increase; assess whether the property value supports a refinance LTV"
    ],
    correctIndex: 3,
    explanation: "Interest-only loan resets create significant payment shock. A $750,000 IO loan at 7% has an IO payment of $4,375/month; fully amortizing over the remaining term (often 20 years) would be approximately $5,820/month — a 33% increase. Planning steps: (1) calculate the reset payment precisely; (2) assess if cash flow supports the increase; (3) evaluate refinancing economics — current market rate vs. reset risk; (4) consider accelerated principal paydown during the IO period to reduce the reset balance; (5) if refinancing is warranted, begin 6-12 months early to allow time for underwriting."
  },
  {
    id: "mtg-adv-005", module: "mortgage-debt-planning", difficulty: "advisor",
    question: "What is the impact of student loan debt on mortgage qualification under current GSE guidelines?",
    options: ["Student loans are excluded from DTI calculations entirely", "For deferred or income-driven repayment plan student loans, Fannie Mae allows use of the actual IBR payment if greater than $0; Freddie Mac requires 0.5% of the outstanding balance as the monthly payment if the actual payment is $0; FHA uses 1% of the outstanding balance — these differences can significantly affect qualifying DTI", "All student loans use 1% of the balance in DTI regardless of the loan program", "Student loan payments only affect front-end DTI"],
    correctIndex: 1,
    explanation: "GSE treatment of deferred student loans differs by program and materially affects qualifying: Fannie Mae: use the actual monthly payment from the credit report; if $0 (IBR), use $0 but document. Freddie Mac: use 0.5% of the balance if the payment is $0 or not on the credit report. FHA: use the greater of the actual payment or 1% of the balance (unless a fully amortizing payment is documented). Choosing the right loan program for borrowers with large student loan balances can be the difference between qualifying and not qualifying."
  },
  // Senior
  {
    id: "mtg-s-002", module: "mortgage-debt-planning", difficulty: "senior",
    question: "A client owns a rental property with $300,000 equity, a primary residence with $500,000 equity, and $200,000 in student loans at 6.5%. What is the most tax-efficient debt restructuring strategy?",
    options: [
      "Analyze: student loan interest is deductible up to $2,500 (subject to income limits); mortgage interest on up to $750,000 of acquisition debt is deductible; a cash-out refinance of the rental or primary using the equity to pay off student loans converts potentially non-deductible student loan interest to potentially deductible mortgage interest — but only if the refinance proceeds are used for home improvements under current law; evaluate after-tax cost of each debt",
      "Refinance everything into one large mortgage",
      "Simply pay off the student loans with investment assets",
      "There is no tax-efficient restructuring available in this scenario"
    ],
    correctIndex: 0,
    explanation: "Post-TCJA, mortgage interest on cash-out proceeds used for non-home purposes is NOT deductible under current law — only acquisition indebtedness (used to buy, build, or substantially improve the home) qualifies. However, if the client uses rental property equity for a cash-out refinance and uses proceeds for property improvements, it qualifies. The student loan deduction phases out at higher incomes. A comprehensive analysis must compare after-tax cost of each debt source considering the specific facts of the client's income, filing status, and use of proceeds."
  },
  {
    id: "mtg-s-003", module: "mortgage-debt-planning", difficulty: "senior",
    question: "What is a 'pledged asset' mortgage and in what client situation is it most appropriate?",
    options: [
      "A mortgage where the property itself is pledged — identical to all mortgages",
      "Pledged asset mortgages are only for commercial properties",
      "A pledged asset mortgage (also called an asset-backed mortgage or collateral pledge program) allows a borrower to pledge a financial portfolio (typically at a brokerage) as additional collateral in lieu of a cash down payment — enabling a jumbo purchase with low down payment while preserving the invested assets; most appropriate for high-net-worth clients with concentrated liquid portfolios who don't want to liquidate investments for a down payment",
      "Pledged asset mortgages require liquidating the pledged assets at closing"
    ],
    correctIndex: 2,
    explanation: "Pledged asset mortgages allow clients to use an investment portfolio as collateral instead of a cash down payment. The portfolio remains invested (and invested — not liquidated), but the brokerage places a lien on it. If the borrower defaults, the lender can liquidate the pledged assets. Appropriate for: affluent clients with large liquid portfolios who would face tax consequences from liquidating (capital gains), concentrated stock positions, or RSU/option awards. The cost is the risk that the portfolio could be liquidated in a market downturn at the same time the home value may be declining."
  },
  {
    id: "mtg-s-004", module: "mortgage-debt-planning", difficulty: "senior",
    question: "Under the Servicemembers Civil Relief Act (SCRA), what mortgage protections are available to active duty military personnel?",
    options: [
      "No special mortgage protections exist for military personnel",
      "SCRA eliminates all mortgage payments during deployment",
      "SCRA only applies to VA loans",
      "SCRA caps the interest rate on pre-service mortgage debt at 6% during active duty (and for 12 months post-deployment for mortgages), provides protection against foreclosure without a court order during active duty and for 12 months after, and requires the servicemember to provide written notice and a copy of deployment orders to the lender"
    ],
    correctIndex: 3,
    explanation: "The SCRA provides critical mortgage protections: (1) 6% interest rate cap — applies to mortgage loans originated before active duty begins; lenders must reduce the rate to 6% and forgive (not defer) excess interest upon written request and documentation; (2) foreclosure protection — a lender cannot foreclose on a covered mortgage without a court order during active duty and for 12 months afterward; (3) the servicemember must notify the lender and provide deployment orders. These protections are non-waivable and apply to both the borrower and their dependents."
  },
  {
    id: "mtg-s-005", module: "mortgage-debt-planning", difficulty: "senior",
    question: "A client owns a $1.5M primary residence (no mortgage) and a $2M income-producing rental property ($800,000 mortgage at 5.5%). For optimal debt structure, what factors should govern which asset carries debt?",
    options: [
      "Always put debt on the primary residence for the mortgage interest deduction",
      "Analyze: rental property mortgage interest is fully deductible as a business expense against rental income (Schedule E) without the $750,000 limit; primary residence mortgage interest is limited to $750,000 of acquisition debt; carrying the mortgage on the rental property typically produces greater tax efficiency; also evaluate: rate differential, amortization impact on rental income/cash flow, and depreciation interaction with passive activity rules",
      "Always eliminate debt entirely on both properties",
      "Debt structure has no tax implications between property types"
    ],
    correctIndex: 1,
    explanation: "Rental property mortgage interest is deducted on Schedule E (rental income and expenses) as a business expense — not subject to the $750,000 acquisition debt limitation that applies to personal residence mortgages under IRC §163(h). This makes the rental mortgage fully deductible against rental income. The primary residence interest is limited to $750,000 of acquisition debt. From a pure tax efficiency standpoint, maintaining debt on the income-producing property maximizes deductibility — but this must be analyzed alongside cash flow, passive activity rules (IRC §469), and the client's overall tax situation."
  },
];

// Append to master question bank
MODULE_CLIENT_QUESTIONS.push(
  ...SUITABILITY_EXPANSION,
  ...BANK_LENDING_EXPANSION,
  ...MORTGAGE_EXPANSION
);
