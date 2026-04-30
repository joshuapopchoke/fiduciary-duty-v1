import type { Question } from "../../types/question";

// ─── Tax Planning Question Bank ───────────────────────────────────────────────
// All questions verified against: IRC as amended through SECURE 2.0 (2022),
// TCJA (2017), IRS Rev. Proc. 2023-34 (2024 inflation adjustments),
// IRC §1 (brackets), §1(h) (LTCG), §1411 (NIIT), §219 (IRA), §408A (Roth),
// §401(a)(9) (RMDs), §1091 (wash sale), §1014 (step-up), §1015 (gift basis).

export const TAX_PLANNING_QUESTIONS: Question[] = [
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-brackets-2024-marginal-1",
    question: "A single filer has $55,000 of taxable income in 2024. What is their marginal federal income tax rate?",
    options: ["12%", "22%", "24%", "10%"],
    correct: 1,
    explanation: "The 22% bracket for single filers in 2024 applies to taxable income between $47,151 and $100,525 (IRC §1, as adjusted by Rev. Proc. 2023-34). A $55,000 income falls in this range. The marginal rate is the rate on the last dollar of income.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-ltcg-rate-2024-1",
    question: "A single filer with $60,000 of taxable income sells stock held for 18 months at a $10,000 gain. What long-term capital gains rate applies?",
    options: ["0%", "15%", "20%", "Same as ordinary income rate"],
    correct: 1,
    explanation: "The 15% LTCG rate applies to single filers with taxable income between $47,026 and $518,900 in 2024 (IRC §1(h), Rev. Proc. 2023-34). Assets held more than one year qualify for preferential LTCG rates rather than ordinary income rates.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-niit-threshold-1",
    question: "The Net Investment Income Tax (NIIT) of 3.8% applies to single filers when MAGI exceeds what threshold in 2024?",
    options: ["$150,000", "$200,000", "$250,000", "$400,000"],
    correct: 1,
    explanation: "IRC §1411 imposes the 3.8% NIIT on the lesser of net investment income or the excess of MAGI above $200,000 (single) or $250,000 (married filing jointly). This threshold is not inflation-indexed.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-rmd-age-secure2-1",
    question: "Under SECURE 2.0 Act (2022), at what age must required minimum distributions from a Traditional IRA begin for someone born in 1955?",
    options: ["70½", "72", "73", "75"],
    correct: 2,
    explanation: "SECURE 2.0 Act (2022) raised the RMD starting age to 73 for individuals born between 1951-1959 (IRC §401(a)(9) as amended). The age was 70½ before SECURE Act (2019), then 72 from 2020-2022. It rises to 75 for those born after 1960, effective 2033.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-wash-sale-rule-1",
    question: "Under the wash sale rule (IRC §1091), a loss is disallowed if the taxpayer repurchases a substantially identical security within how many days before or after the sale?",
    options: ["15 days", "30 days", "60 days", "90 days"],
    correct: 1,
    explanation: "IRC §1091 disallows a loss if the taxpayer purchases the same or substantially identical security within 30 days before OR after the sale at a loss. The disallowed loss is added to the cost basis of the replacement shares, effectively deferring rather than permanently eliminating the loss.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-step-up-basis-1",
    question: "Under IRC §1014, what happens to the cost basis of appreciated assets included in a decedent's gross estate?",
    options: [
      "The basis carries over to the heir unchanged",
      "The basis is stepped up to fair market value at the date of death",
      "The basis is stepped up to the original purchase price plus inflation",
      "The basis is eliminated and all gains become taxable immediately"
    ],
    correct: 1,
    explanation: "IRC §1014 provides that the cost basis of assets included in a decedent's gross estate is adjusted to fair market value on the date of death (or alternate valuation date). This 'step-up in basis' eliminates capital gains tax on all appreciation during the decedent's lifetime — one of the most powerful wealth transfer tools in the tax code.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-gift-carryover-basis-1",
    question: "Under IRC §1015, when a taxpayer receives an asset as a gift, what cost basis does the recipient use?",
    options: [
      "Fair market value on the date of the gift",
      "The donor's original cost basis (carryover basis)",
      "Zero basis, regardless of donor's basis",
      "The higher of donor's basis or FMV at gift date"
    ],
    correct: 1,
    explanation: "Under IRC §1015, the recipient of a gift takes the donor's carryover (substituted) basis. This contrasts with inherited assets which receive a step-up under IRC §1014. If you receive a gift of stock the donor bought for $10,000 (now worth $100,000), you will owe capital gains on $90,000 when you sell.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-ira-deductibility-phaseout-1",
    question: "In 2024, the deductibility of Traditional IRA contributions phases out for a single filer who is an active participant in a workplace retirement plan between what MAGI range?",
    options: [
      "$60,000 – $70,000",
      "$77,000 – $87,000",
      "$100,000 – $125,000",
      "$161,000 – $176,000"
    ],
    correct: 1,
    explanation: "In 2024, the phase-out range for IRA deductibility for single filers covered by a workplace plan is $77,000-$87,000 MAGI (Rev. Proc. 2023-34). The $161,000-$176,000 range applies to Roth IRA contribution eligibility for single filers.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-roth-conversion-taxable-1",
    question: "When a client converts Traditional IRA funds to a Roth IRA under IRC §408A(d)(3), the converted amount is:",
    options: [
      "Always tax-free if converted before age 59½",
      "Included in gross income in the year of conversion at ordinary income rates",
      "Taxed at long-term capital gains rates",
      "Tax-free if the IRA was open for at least 5 years"
    ],
    correct: 1,
    explanation: "Roth conversions are taxable events — the converted amount is included in gross income in the year of conversion and taxed at ordinary income rates (IRC §408A(d)(3)). This is why Roth conversions are typically most efficient in lower-income years. The 5-year rule applies to penalty-free distributions from the Roth, not to the conversion itself.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-qcd-limit-2024-1",
    question: "In 2024, a Qualified Charitable Distribution (QCD) from an IRA under IRC §408(d)(8) may be made by taxpayers age 70½ or older up to what annual limit?",
    options: ["$50,000", "$75,000", "$100,000", "$105,000"],
    correct: 3,
    explanation: "The QCD limit was $100,000 for many years but SECURE 2.0 Act (2022) indexed it for inflation beginning in 2024. The 2024 limit is $105,000. QCDs satisfy RMDs and exclude the distributed amount from gross income — making them more tax-efficient than taking an RMD and donating the after-tax proceeds.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "tax-niit-applies-to-1",
    question: "Which of the following is included in 'net investment income' for purposes of the 3.8% NIIT under IRC §1411?",
    options: [
      "Wages from employment",
      "Distributions from a 401(k) plan",
      "Interest, dividends, capital gains, rents, and royalties",
      "Social Security benefits"
    ],
    correct: 2,
    explanation: "Net investment income (NII) under IRC §1411 includes interest, dividends, capital gains, rents, royalties, and passive activity income. It does NOT include wages, self-employment income, distributions from qualified retirement plans (IRAs, 401(k)s), or Social Security benefits — those are excluded even though they may increase MAGI.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-ordinary-loss-cap-1",
    question: "Under IRC §1211(b), how much in net capital losses may an individual deduct against ordinary income per year?",
    options: ["$1,000", "$3,000", "$5,000", "Unlimited"],
    correct: 1,
    explanation: "IRC §1211(b) limits the deduction of net capital losses against ordinary income to $3,000 per year ($1,500 if married filing separately). Losses in excess of this limit carry forward indefinitely and can be used against future capital gains or deducted up to $3,000 per year against ordinary income.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "tax-ird-no-stepup-1",
    question: "Which type of asset does NOT receive a step-up in basis at death under IRC §1014?",
    options: [
      "Appreciated stocks held in a taxable brokerage account",
      "Real estate held individually",
      "Traditional IRA and 401(k) balances",
      "Artwork and collectibles"
    ],
    correct: 2,
    explanation: "Income in Respect of a Decedent (IRD) assets — including Traditional IRA and 401(k) balances, deferred compensation, and installment sale proceeds — do NOT receive a step-up in basis under IRC §1014. These amounts are subject to IRC §691 and remain taxable as ordinary income to the beneficiary when distributed. This is a critical planning distinction.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-asset-location-bonds-1",
    question: "Which account type is generally most appropriate for holding taxable bond funds from a tax-efficiency standpoint?",
    options: [
      "Taxable brokerage account",
      "Roth IRA",
      "Tax-deferred account such as Traditional IRA or 401(k)",
      "Health Savings Account"
    ],
    correct: 2,
    explanation: "Taxable bonds generate ordinary income taxed at the highest rates. Placing them in a tax-deferred account (Traditional IRA, 401(k)) shelters this income from current taxation. Tax-efficient assets like broad equity index funds (qualified dividends and LTCG) are better suited for taxable accounts. Roth accounts should hold the highest-growth assets to maximize tax-free compounding.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-529-charitable-qpd-1",
    question: "Under IRC §2503(e), direct payments for tuition and medical expenses on behalf of another person are:",
    options: [
      "Subject to the annual gift tax exclusion of $18,000",
      "Excluded from gift tax entirely — unlimited in amount, no exclusion required",
      "Deductible as charitable contributions",
      "Subject to the lifetime estate and gift tax exemption"
    ],
    correct: 1,
    explanation: "IRC §2503(e) provides that direct transfers to educational institutions (tuition only, not room and board) and direct payments to medical providers are excluded from gift tax completely — they are not subject to the annual exclusion or the lifetime exemption. The payments must be made directly to the institution or provider, not to the individual.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "tax-tcja-sunset-2025-1",
    question: "The Tax Cuts and Jobs Act (TCJA) individual income tax provisions, including the current estate tax exemption, are scheduled to do what after December 31, 2025?",
    options: [
      "Become permanent",
      "Sunset and revert to pre-2018 law unless Congress acts",
      "Be replaced by a flat tax system",
      "Apply only to corporations going forward"
    ],
    correct: 1,
    explanation: "TCJA §11011 includes a sunset provision causing most individual income tax changes — including the increased standard deduction, modified brackets, and the doubled estate tax exemption (~$13.61M in 2024 reverting to ~$7M inflation-adjusted) — to expire after December 31, 2025. Without Congressional action, 2026 will see significantly different tax rules, particularly for estate planning.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-rmd-missed-penalty-1",
    question: "Under SECURE 2.0 Act (2022), the penalty for failing to take a required minimum distribution was reduced from 50% to what amount?",
    options: ["10%", "15%", "25%", "The penalty was eliminated entirely"],
    correct: 2,
    explanation: "SECURE 2.0 Act §302 reduced the excise tax on missed RMDs from 50% to 25% of the amount that should have been distributed. If the missed RMD is corrected within a 2-year correction window, the penalty is further reduced to 10%.",
    points: 20
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "associate",
    cooldown: 30,
    topicTag: "tax-roth-ira-income-limit-2024-1",
    question: "In 2024, direct Roth IRA contributions phase out for single filers between what MAGI range?",
    options: [
      "$77,000 – $87,000",
      "$120,000 – $135,000",
      "$161,000 – $176,000",
      "$200,000 – $215,000"
    ],
    correct: 2,
    explanation: "In 2024, the Roth IRA contribution phase-out for single filers is $161,000-$176,000 MAGI (Rev. Proc. 2023-34, IRC §408A(c)(3)). Above $176,000, direct contributions are not permitted. High-income taxpayers may use the 'backdoor Roth' — contributing to a non-deductible Traditional IRA and then converting — as income limits do not apply to conversions.",
    points: 15
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "senior",
    cooldown: 28,
    topicTag: "tax-backdoor-roth-pro-rata-1",
    question: "A client executes a backdoor Roth IRA conversion. They have $90,000 in pre-tax Traditional IRA funds and contribute $7,000 in after-tax (non-deductible) funds. Under the pro-rata rule (IRC §408(d)(2)), what percentage of the conversion is taxable?",
    options: ["0% — after-tax contributions are never taxed twice", "7.2%", "92.8%", "100%"],
    correct: 2,
    explanation: "The pro-rata rule aggregates ALL Traditional IRA balances. Total IRA value = $90,000 + $7,000 = $97,000. After-tax portion = $7,000/$97,000 = 7.2%. Therefore 92.8% of any conversion is taxable. The pro-rata rule prevents 'cherry-picking' only after-tax amounts for conversion. Clients with large pre-tax IRA balances may find the backdoor Roth inefficient unless they can roll pre-tax amounts into an employer plan.",
    points: 25
  },
  {
    exam: "Planning",
    domain: "Tax Planning",
    difficulty: "advisor",
    cooldown: 30,
    topicTag: "tax-muni-bond-tax-exempt-1",
    question: "Interest from a general obligation municipal bond issued by a state is generally:",
    options: [
      "Taxable at preferential capital gains rates",
      "Exempt from federal income tax and often exempt from state/local tax for in-state residents",
      "Exempt from federal tax only if issued before 1986",
      "Taxable as ordinary income at the federal level"
    ],
    correct: 1,
    explanation: "Interest on state and local government bonds (municipal bonds) is generally exempt from federal income tax under IRC §103. Many states also exempt interest on their own bonds from state income tax. However, some municipal bonds (private activity bonds) may be subject to the Alternative Minimum Tax. The tax-exempt status makes munis particularly attractive for investors in higher tax brackets.",
    points: 20
  }
];
