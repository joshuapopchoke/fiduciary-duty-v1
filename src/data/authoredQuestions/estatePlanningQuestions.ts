import type { Question } from "../../types/question";

// ─── Estate Planning Question Bank ───────────────────────────────────────────
// Verified against: IRC §§2001-2210, §1014, §1015, §2503, §2056, §2055,
// §2035, §2036, §2042, §408(d)(8) (QCD), and Rev. Proc. 2023-34 (2024 limits).

export const ESTATE_PLANNING_QUESTIONS: Question[] = [
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "estate-gift-annual-exclusion-2024-1",
    question: "The annual gift tax exclusion per donee in 2024 under IRC §2503(b) is:",
    options: ["$15,000", "$16,000", "$17,000", "$18,000"],
    correct: 3,
    explanation: "The annual gift tax exclusion is $18,000 per donee in 2024 (Rev. Proc. 2023-34). This amount is indexed for inflation in $1,000 increments. A married couple can split gifts to give $36,000 per donee per year with no gift tax consequences and without using any of their lifetime exemption.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "estate-lifetime-exemption-2024-1",
    question: "The federal estate and gift tax lifetime exemption per person in 2024 is approximately:",
    options: ["$7,000,000", "$10,000,000", "$12,920,000", "$13,610,000"],
    correct: 3,
    explanation: "The unified credit exemption under IRC §2010(c) is $13,610,000 per person in 2024 (Rev. Proc. 2023-34). This amount was doubled by TCJA (2017) and is indexed annually for inflation. CRITICAL: This exemption sunsets after December 31, 2025 and is expected to revert to approximately $7 million (inflation-adjusted) unless Congress acts.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-portability-706-1",
    question: "To preserve a deceased spouse's unused estate tax exemption (DSUE) through portability under IRC §2010(c)(5), the surviving spouse must:",
    options: [
      "File an estate tax return within 30 days of the spouse's death",
      "File a timely estate tax return (Form 706) within 9 months of death, extended to 15 months",
      "Make an irrevocable election within 60 days",
      "No action is required — portability is automatic"
    ],
    correct: 1,
    explanation: "Portability of the deceased spouse's unused exemption (DSUE) requires a timely estate tax return (Form 706) to be filed — within 9 months of death, or 15 months with an extension. This election must be made even if no estate tax is owed. Failure to file means the DSUE is permanently lost. The IRS has provided simplified late portability relief but relying on it is risky.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-tcja-sunset-planning-1",
    question: "A client has a $10 million estate in 2024. Which statement BEST reflects TCJA sunset planning considerations?",
    options: [
      "No action needed — the $13.61M exemption will be permanent",
      "The client should consider gifts or trust structures before 12/31/2025 to utilize today's higher exemption",
      "The client should wait until after 2025 to assess the situation",
      "Sunset only affects income taxes, not estate taxes"
    ],
    correct: 1,
    explanation: "TCJA estate exemption of $13.61M sunsets after 12/31/2025 and is expected to revert to ~$7M (inflation-adjusted). A client with a $10M estate currently has no estate tax exposure but could face significant tax if the exemption is cut. IRS Notice 2019-1 confirmed that gifts made under the higher exemption will not be 'clawed back' — making pre-sunset gifting a valuable strategy.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-revocable-trust-probate-1",
    question: "A primary benefit of a revocable living trust compared to a will is:",
    options: [
      "Assets in the trust avoid estate taxation",
      "The trust avoids the probate process and maintains privacy",
      "Contributions to the trust are income-tax deductible",
      "Creditors cannot reach assets held in a revocable trust"
    ],
    correct: 1,
    explanation: "A revocable living trust avoids probate (which can take 1-3 years and cost 3-8% of the estate in many states) and keeps asset distribution private (wills are public record when probated). However, a revocable trust does NOT reduce estate taxes — the grantor retains control and the assets are included in the taxable estate. It also does NOT protect from creditors, as the grantor can revoke the trust.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "estate-ilit-3year-rule-1",
    question: "Under IRC §2035, if an insured transfers a life insurance policy to an ILIT and dies within how many years, the death benefit may still be included in the taxable estate?",
    options: ["1 year", "2 years", "3 years", "5 years"],
    correct: 2,
    explanation: "IRC §2035 (the 3-year rule) provides that if the insured transfers a life insurance policy within 3 years of death, the death benefit proceeds are included in the gross estate as if the insured still owned the policy. To avoid this, ILITs should either purchase new policies directly (no transfer required) or the grantor must survive 3 years after any transfer of an existing policy.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "estate-grat-hurdle-rate-1",
    question: "A Grantor Retained Annuity Trust (GRAT) transfers appreciation to beneficiaries estate-tax-free when assets grow at a rate exceeding the:",
    options: [
      "Federal funds rate",
      "IRS §7520 rate",
      "10-year Treasury yield",
      "Client's marginal tax rate"
    ],
    correct: 1,
    explanation: "A GRAT works when trust assets grow faster than the IRS §7520 rate (120% of the applicable federal mid-term rate, published monthly). The grantor receives annuity payments for the GRAT term; any growth above the 7520 hurdle rate passes to remainder beneficiaries estate-tax-free. In low 7520 rate environments, GRATs are particularly powerful. Risk: the grantor must survive the GRAT term (IRC §2036 inclusion if they don't).",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-beneficiary-override-will-1",
    question: "A client's will leaves all assets to their children. Their IRA beneficiary designation names their ex-spouse. Who receives the IRA upon the client's death?",
    options: [
      "The children, because the will controls all assets",
      "The ex-spouse, because beneficiary designations override the will for IRAs",
      "The estate, because the designation is invalid post-divorce",
      "It is split equally between the ex-spouse and children"
    ],
    correct: 1,
    explanation: "Beneficiary designations on IRAs, 401(k)s, life insurance, and annuities are contractual and pass assets outside of probate — they override the will completely. Unless the client updated the IRA beneficiary designation after the divorce, the ex-spouse receives the IRA regardless of what the will says. Note: some states have 'revocation-on-divorce' statutes for wills, but federal law (ERISA) preempts state law for 401(k)s and does not automatically change beneficiary designations.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "estate-ird-no-stepup-1",
    question: "Which of the following assets is classified as Income in Respect of a Decedent (IRD) under IRC §691 and does NOT receive a step-up in basis at death?",
    options: [
      "Appreciated corporate stock held in a brokerage account",
      "Real estate with significant unrealized gain",
      "Traditional IRA account balance",
      "Artwork held as a collection"
    ],
    correct: 2,
    explanation: "A Traditional IRA (and 401(k), deferred compensation, and similar pre-tax retirement account) is Income in Respect of a Decedent (IRD) under IRC §691. IRD assets do NOT receive a step-up in basis — distributions remain fully taxable as ordinary income to the beneficiary. IRD assets are often best candidates for charitable bequests (leaving them to charity via QCD or charitable bequest while leaving stepped-up basis assets to heirs).",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-529-superfunding-1",
    question: "The 529 plan 'superfunding' or '5-year election' under IRC §529(c)(2) allows a contributor to:",
    options: [
      "Contribute up to $69,000 and deduct it from income",
      "Front-load 5 years of annual gift exclusions ($90,000 in 2024) into a 529 plan at once",
      "Contribute up to $35,000 per year without using the lifetime exemption",
      "Make contributions that bypass the annual exclusion entirely"
    ],
    correct: 1,
    explanation: "IRC §529(c)(2) allows a contributor to elect to treat a lump-sum 529 contribution as made equally over 5 years for gift tax purposes — 'superfunding.' In 2024, this allows $90,000 per beneficiary (5 × $18,000) to be contributed in one year without using any lifetime exemption. The contributor cannot make additional annual exclusion gifts to that beneficiary during the 5-year period. SECURE 2.0 also allows unused 529 funds to be rolled to a Roth IRA under certain conditions.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "estate-slat-risk-1",
    question: "A Spousal Lifetime Access Trust (SLAT) poses what unique risk compared to other irrevocable trusts?",
    options: [
      "The grantor is taxed on trust income",
      "If the beneficiary spouse dies or the couple divorces, the grantor loses indirect access to the assets",
      "The trust must be funded with only cash, not appreciated assets",
      "SLATs require annual IRS filings not required for other irrevocable trusts"
    ],
    correct: 1,
    explanation: "A SLAT removes assets from the grantor's taxable estate while allowing the beneficiary spouse to access income and principal. The primary risk: if the beneficiary spouse predeceases the grantor or the couple divorces, the grantor permanently loses all indirect access to those assets. 'Reciprocal trust' doctrine must also be considered — spouses cannot create mirror-image SLATs for each other simultaneously.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "estate-marital-deduction-1",
    question: "Under IRC §2056, the unlimited marital deduction allows assets to pass to a surviving spouse with:",
    options: [
      "No estate or gift tax, provided the spouse is a U.S. citizen",
      "No estate or gift tax, regardless of the spouse's citizenship",
      "Reduced estate tax, but not full elimination",
      "No estate tax but the spouse must pay income tax on the transfer"
    ],
    correct: 0,
    explanation: "IRC §2056 provides an unlimited marital deduction for assets passing to a surviving SPOUSE WHO IS A U.S. CITIZEN. This defers (not eliminates) estate tax — the estate pays tax when the surviving spouse later dies. For non-citizen spouses, a Qualified Domestic Trust (QDOT) under IRC §2056A is required to qualify for the marital deduction.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-crt-income-tax-1",
    question: "A Charitable Remainder Trust (CRT) allows a donor to contribute appreciated assets and receive what immediate tax benefit?",
    options: [
      "A charitable deduction equal to 100% of the asset's FMV",
      "A partial charitable deduction based on the present value of the remainder interest",
      "Avoidance of all income tax on distributions from the trust",
      "An immediate exclusion of all gains from income"
    ],
    correct: 1,
    explanation: "A CRT provides a partial charitable income tax deduction equal to the present value of the remainder interest that will ultimately pass to charity (IRC §170(f)(2)). This is calculated using the §7520 rate and the trust terms. The full FMV deduction is not available because the donor retains an income interest. However, contributing appreciated assets avoids immediate capital gains tax recognition, which is often the primary motivation.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "estate-secure2-10year-rule-1",
    question: "Under the SECURE Act (2019) and SECURE 2.0 (2022), most non-spouse beneficiaries who inherit an IRA must:",
    options: [
      "Take annual RMDs based on their life expectancy (stretch IRA)",
      "Distribute the entire inherited IRA within 5 years",
      "Distribute the entire inherited IRA within 10 years",
      "Roll the inherited IRA into their own IRA"
    ],
    correct: 2,
    explanation: "The SECURE Act (2019) eliminated the 'stretch IRA' for most non-spouse beneficiaries, requiring full distribution within 10 years of the original owner's death (IRC §401(a)(9)(H)). Exceptions exist for: surviving spouses, minor children (until age of majority), disabled or chronically ill individuals, and beneficiaries not more than 10 years younger than the decedent. IRS regulations have clarified that annual RMDs are required in years 1-9 if the decedent had already started RMDs.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Estate Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "estate-power-of-attorney-1",
    question: "A Durable Power of Attorney differs from a standard Power of Attorney in that:",
    options: [
      "It allows the agent to make healthcare decisions",
      "It remains effective if the principal becomes incapacitated",
      "It can only be used for real estate transactions",
      "It requires court approval to be valid"
    ],
    correct: 1,
    explanation: "A 'durable' power of attorney includes language stating it remains effective (or becomes effective) upon the principal's incapacity. A standard POA typically terminates automatically when the principal loses capacity — exactly the time when it is most needed. Without a durable POA, family members may need to seek court-appointed guardianship or conservatorship to manage the incapacitated person's affairs.",
    points: 15
  }
];
