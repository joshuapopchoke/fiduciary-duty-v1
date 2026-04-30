import { CLIENT_QUESTION_SETS } from "./questions";
import type { ClientAccount } from "../types/client";

export const CLIENTS: ClientAccount[] = [
  {
    id: "retiree",
    name: "Margaret Chen",
    accountType: "Retirement Income Account",
    age: 68,
    ageLabel: "Age 68",
    householdAges: ["Margaret: 68"],
    avatar: "👩‍💼",
    goal: "Retirement Income",
    riskProfile: "Conservative",
    riskClass: "risk-conservative",
    description: "Retired teacher. Needs stable income. Cannot afford major losses.",
    startingAum: 450000,
    cash: 450000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "retiree-taxable", label: "Taxable Reserve", registration: "Taxable", taxTreatment: "Taxable income and gains", beneficiaryRequired: false },
      { id: "retiree-trad-ira", label: "Traditional IRA", registration: "Traditional IRA", taxTreatment: "Tax-deferred, RMD eligible", beneficiaryRequired: true },
      { id: "retiree-roth", label: "Roth IRA", registration: "Roth IRA", taxTreatment: "Tax-free qualified withdrawals", beneficiaryRequired: true }
    ],
    sleeveCashBalances: {
      "retiree-taxable": 140000,
      "retiree-trad-ira": 220000,
      "retiree-roth": 90000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 58,
    mandateScore: 22,
    advisorNote: "Wants calm, income-focused guidance and reacts poorly to speculative positioning.",
    mandateTargets: ["fixedIncome", "bonds", "funds"],
    watchouts: ["futures", "forex", "commodities", "Hedge Funds"],
    insuranceNeeds: ["long-term-care", "umbrella"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 28,
    insuranceNote: "Needs a careful conversation around long-term care and liability protection, but does not want an aggressive insurance pitch.",
    cashFlow: {
      monthlyIncome: 6200,
      monthlyExpenses: 5100,
      monthlyDebtPayments: 0,
      emergencyReserveMonths: 18,
      nearTermLiquidityNeed: "High"
    },
    creditProfile: {
      score: 782,
      scoreBand: "Very Good",
      utilizationPct: 8,
      recentInquiries: 1,
      delinquentAccounts: 0,
      unpaidCollections: 0,
      trend: "Stable"
    },
    debtProfile: {
      mortgageBalance: 0,
      mortgageRate: 0,
      mortgageTermYearsRemaining: 0,
      propertyValue: 0,
      housingPayment: 0,
      creditCardBalance: 2400,
      autoLoanBalance: 0,
      studentLoanBalance: 0,
      helocBalance: 0,
      unsecuredDebt: 0,
      unpaidDebtBalance: 0
    },
    mortgageProfile: {
      occupancy: "Not Applicable",
      loanPreference: "Not Applicable",
      refinanceHorizonMonths: 0,
      pmiActive: false,
      propertyTaxMonthly: 0,
      homeownerInsuranceMonthly: 0,
      closingCostSensitivity: "Moderate"
    },
    lendingProfile: {
      underwritingTrack: "Consumer",
      employmentStrength: "Moderate",
      collateralStrength: "Strong",
      businessCashFlowCoverage: null,
      recentLatePayments: 0,
      requestedLoanPurpose: "Retirement liquidity reserve only"
    },
    taxProfile: {
      filingStatus: "Single retiree",
      taxBracketLabel: "Moderate ordinary-income bracket",
      accountTreatment: "Mix of retirement income assets and taxable reserve cash"
    },
    investmentPolicy: {
      objective: "Sustain retirement cash flow with limited drawdown risk.",
      timeHorizon: "Current withdrawals with a 20+ year planning horizon",
      liquidityNeeds: "High monthly liquidity for living expenses and healthcare flexibility",
      constraints: ["Principal stability matters more than maximizing upside", "Income reliability is critical"],
      prohibitedStrategies: ["Concentrated speculative equities", "Leveraged products", "Short-term momentum trading"],
      prohibitedBuckets: ["futures", "commodities", "forex"],
      maxSinglePositionPct: 12,
      equityRangeLabel: "15% - 30% equity sleeve",
      targetEquityMinPct: 0.15,
      targetEquityMaxPct: 0.3,
      maxNonEquityPct: 0.85,
      speculativeBetaThreshold: 1.5,
      reviewCadence: "Quarterly policy review",
      nextReviewFocus: "Verify income stability, reserve coverage, and whether the equity sleeve still fits a retiree drawdown budget.",
      retirementIncomeNeed: "Needs about $5,100 per month covered without major capital disruption"
    },
    retirementDistribution: {
      distributionPhase: true,
      socialSecurityStrategy: "Benefits already claimed; portfolio must complement reliable income rather than chase upside.",
      rmdStatus: "RMD age reached, so distribution planning and tax coordination matter now.",
      withdrawalApproach: "Blend portfolio income with measured reserve withdrawals instead of forced equity sales.",
      reserveBucketYears: 3,
      targetWithdrawalRate: 0.038
    },
    benefitsProfile: {
      primaryPlan: "Medicare and personal reserve planning",
      employerMatch: "No active employer match",
      hsaStrategy: "No longer adding through payroll; focus is on spending coordination and healthcare reserves.",
      equityCompensation: "None",
      planningFocus: "Healthcare cash flow and benefit coordination matter more than workplace accumulation."
    },
    estateProfile: {
      coreDocuments: ["Will", "Power of Attorney", "Healthcare Directive"],
      trustStructure: "Revocable trust review may be appropriate if probate avoidance is a priority.",
      beneficiaryReview: "Retirement beneficiaries should stay aligned with the current family plan.",
      liquidityRisk: "Care events or legacy gifts could pressure liquid reserves if not planned ahead of time.",
      planningFocus: "Keep legal documents current and protect the retirement-income plan from late-life disruptions."
    },
    accountStructure: {
      registration: "Retirement income sleeve with taxable reserve cash",
      taxAdvantagedPriority: "Income-heavy holdings should be coordinated with retirement-account distribution rules.",
      assetLocationNote: "Use lower-volatility income assets and reserve buckets where distribution timing stays manageable."
    },
    educationPlanning: {
      active: false,
      objective: "No active education-funding mandate",
      targetYears: "Not applicable",
      fundingPriority: "Keep retirement cash flow ahead of new gifting goals.",
      planningNote: "Education planning is not a current primary driver for this relationship."
    },
    revenueProfile: {
      advisoryFeeBps: 85,
      serviceTier: "Retirement income advisory",
      annualRevenueTarget: 3825
    },
    retirementMath: {
      annualSpendingGoal: 61200,
      annualGuaranteedIncome: 48200,
      expectedReturn: 0.048,
      inflationAssumption: 0.027,
      assumedLongevityAge: 93,
      safeWithdrawalGuardrail: 0.04
    },
    productComparison: {
      primaryNeed: "Reliable income with limited drawdown risk",
      recommendedLane: "Blend high-quality bonds, short-duration reserves, and modest equity income exposure",
      lowerCostAlternative: "Core treasury and balanced-income ETF sleeve",
      caution: "Avoid treating blue-chip equities as a substitute for the reserve and bond ladder."
    },
    crmProfile: {
      serviceModel: "Quarterly retirement-income review",
      nextReviewWindow: "Next 30 days",
      nextTask: "Review reserve bucket and income coverage before the next withdrawal cycle.",
      lastContactSummary: "Client wants calm explanations and reassurance around volatility.",
      referralPotential: "Moderate"
    },
    supervisionProfile: {
      reviewLevel: "Heightened suitability review",
      exceptionFocus: "High-beta equities, leverage, and income shortfall pressure",
      documentationPriority: "Income recommendations and volatility discussions",
      supervisionNote: "Retiree recommendations need especially clear suitability support and reserve planning."
    },
    clientNotes: ["Initial IPS emphasizes calm income generation and drawdown control."],
    questionSet: CLIENT_QUESTION_SETS.retiree
  },
  {
    id: "young_pro",
    name: "Derek Washington",
    accountType: "Growth Brokerage",
    age: 31,
    ageLabel: "Age 31",
    householdAges: ["Derek: 31"],
    avatar: "👨‍💻",
    goal: "Wealth Accumulation",
    riskProfile: "Aggressive",
    riskClass: "risk-aggressive",
    description: "Software engineer. Long time horizon. Wants maximum growth.",
    startingAum: 85000,
    cash: 85000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "young-401k", label: "401(k)", registration: "401(k)", taxTreatment: "Tax-deferred payroll retirement account", beneficiaryRequired: true },
      { id: "young-roth", label: "Roth IRA", registration: "Roth IRA", taxTreatment: "Tax-free qualified withdrawals", beneficiaryRequired: true },
      { id: "young-taxable", label: "Taxable Brokerage", registration: "Taxable", taxTreatment: "Taxable capital gains and dividends", beneficiaryRequired: false }
    ],
    sleeveCashBalances: {
      "young-401k": 42000,
      "young-roth": 18000,
      "young-taxable": 25000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 52,
    mandateScore: 22,
    advisorNote: "Comfortable with growth risk, but expects a coherent thesis rather than random momentum chasing.",
    mandateTargets: ["stocks", "funds"],
    watchouts: [],
    insuranceNeeds: ["disability", "umbrella"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 34,
    insuranceNote: "Primary planning gap is protecting future income and growing assets without treating insurance like an unnecessary drag.",
    cashFlow: {
      monthlyIncome: 11000,
      monthlyExpenses: 5400,
      monthlyDebtPayments: 900,
      emergencyReserveMonths: 6,
      nearTermLiquidityNeed: "Moderate"
    },
    creditProfile: {
      score: 571,
      scoreBand: "Poor",
      utilizationPct: 84,
      recentInquiries: 6,
      delinquentAccounts: 2,
      unpaidCollections: 1,
      trend: "Pressured"
    },
    debtProfile: {
      mortgageBalance: 285000,
      mortgageRate: 0.068,
      mortgageTermYearsRemaining: 28,
      propertyValue: 385000,
      housingPayment: 2480,
      creditCardBalance: 18400,
      autoLoanBalance: 22600,
      studentLoanBalance: 18200,
      helocBalance: 0,
      unsecuredDebt: 8200,
      unpaidDebtBalance: 3100
    },
    mortgageProfile: {
      occupancy: "Primary Residence",
      loanPreference: "Fixed",
      refinanceHorizonMonths: 60,
      pmiActive: false,
      propertyTaxMonthly: 410,
      homeownerInsuranceMonthly: 125,
      closingCostSensitivity: "Moderate"
    },
    lendingProfile: {
      underwritingTrack: "Mortgage",
      employmentStrength: "Strong",
      collateralStrength: "Moderate",
      businessCashFlowCoverage: null,
      recentLatePayments: 0,
      requestedLoanPurpose: "Home upgrade and cash-flow flexibility"
    },
    taxProfile: {
      filingStatus: "Single W-2 earner",
      taxBracketLabel: "Upper-middle marginal bracket",
      accountTreatment: "Taxable brokerage growth focus with future retirement account coordination"
    },
    investmentPolicy: {
      objective: "Compound long-term growth while keeping enough liquidity for career and housing flexibility.",
      timeHorizon: "30+ years to retirement",
      liquidityNeeds: "Moderate emergency reserve and optional home-upgrade flexibility",
      constraints: ["Wants growth, but still needs a disciplined reserve", "Does not want insurance pitched as a pure investment"],
      prohibitedStrategies: ["Oversized single-name leverage in the core account"],
      prohibitedBuckets: ["futures"],
      maxSinglePositionPct: 18,
      equityRangeLabel: "55% - 80% equity sleeve",
      targetEquityMinPct: 0.55,
      targetEquityMaxPct: 0.8,
      maxNonEquityPct: 0.45,
      speculativeBetaThreshold: 1.8,
      reviewCadence: "Semiannual policy review",
      nextReviewFocus: "Track house-fund liquidity, keep leverage sized modestly, and keep core growth diversified instead of overconcentrated.",
      retirementIncomeNeed: "No current retirement withdrawals; focus is accumulation"
    },
    retirementDistribution: {
      distributionPhase: false,
      socialSecurityStrategy: "Too early for claiming decisions; current focus is compounding and tax-advantaged contributions.",
      rmdStatus: "No RMD pressure",
      withdrawalApproach: "Stay in accumulation mode and avoid raiding long-term accounts for short-term wants.",
      reserveBucketYears: 1,
      targetWithdrawalRate: 0
    },
    benefitsProfile: {
      primaryPlan: "401(k) and taxable brokerage coordination",
      employerMatch: "Potential employer match should be fully captured before stretching for taxable extras.",
      hsaStrategy: "HSA can double as healthcare reserve and long-term tax-advantaged savings if eligible.",
      equityCompensation: "Possible future RSU or stock-option planning should avoid concentration drift.",
      planningFocus: "Optimize workplace benefits before taking unnecessary taxable or speculative risk."
    },
    estateProfile: {
      coreDocuments: ["Beneficiary review", "Basic will"],
      trustStructure: "No advanced trust structure likely needed yet unless net worth or family complexity rises.",
      beneficiaryReview: "Retirement and insurance beneficiaries should stay current as life changes happen.",
      liquidityRisk: "Low today, but disability or liability events could derail accumulation if ignored.",
      planningFocus: "Keep the foundation simple: beneficiaries, emergency documents, and liability protection."
    },
    accountStructure: {
      registration: "401(k) plus taxable growth sleeve",
      taxAdvantagedPriority: "Capture match and tax-advantaged space before overloading taxable speculation.",
      assetLocationNote: "Keep broad equity exposure in low-drag accounts first and watch concentration from equity comp."
    },
    educationPlanning: {
      active: false,
      objective: "No current education-funding mandate",
      targetYears: "Not applicable",
      fundingPriority: "Maximize workplace benefits and reserve discipline before adding future child-planning goals.",
      planningNote: "Education funding is not the core planning issue yet."
    },
    revenueProfile: {
      advisoryFeeBps: 95,
      serviceTier: "Emerging wealth planning",
      annualRevenueTarget: 807.50  // 85,000 AUM × 95bps / 10,000 = $807.50 (was incorrectly 8075, off by 10×)
    },
    retirementMath: {
      annualSpendingGoal: 64800,
      annualGuaranteedIncome: 0,
      expectedReturn: 0.075,
      inflationAssumption: 0.028,
      assumedLongevityAge: 95,
      safeWithdrawalGuardrail: 0.04
    },
    productComparison: {
      primaryNeed: "Tax-aware accumulation with benefit optimization",
      recommendedLane: "Broad equity core with workplace-plan optimization and a reserve sleeve",
      lowerCostAlternative: "Index ETF core instead of higher-turnover active tilts",
      caution: "Do not confuse growth orientation with permission for concentrated speculation."
    },
    crmProfile: {
      serviceModel: "Semiannual accumulation review",
      nextReviewWindow: "Next 45 days",
      nextTask: "Confirm 401(k) match capture and whether taxable contributions should shift to HSA or retirement accounts.",
      lastContactSummary: "Client wants direct, thesis-driven advice and dislikes product fluff.",
      referralPotential: "High"
    },
    supervisionProfile: {
      reviewLevel: "Standard branch review",
      exceptionFocus: "Concentration drift and margin use in growth accounts",
      documentationPriority: "Workplace-benefit recommendations and leverage discussions",
      supervisionNote: "Growth recommendations are acceptable, but concentration and margin need discipline."
    },
    clientNotes: ["Primary planning opportunity is disciplined workplace-benefit optimization before excess risk."],
    questionSet: CLIENT_QUESTION_SETS.young_pro
  },
  {
    id: "family",
    name: "The Kowalski Family",
    accountType: "Household Planning",
    age: 42,
    ageLabel: "Adults 42 / 40 | Children 10 / 7",
    householdAges: ["Parent 1: 42", "Parent 2: 40", "Child 1: 10", "Child 2: 7"],
    avatar: "👨‍👩‍👧",
    goal: "College Fund + Mortgage",
    riskProfile: "Moderate",
    riskClass: "risk-moderate",
    description: "Dual income household. Two kids. College in 6-10 years.",
    startingAum: 220000,
    cash: 220000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "family-529", label: "529 Education", registration: "529 Plan", taxTreatment: "Tax-advantaged education savings", beneficiaryRequired: true },
      { id: "family-401k", label: "Retirement Accounts", registration: "401(k)/IRA mix", taxTreatment: "Tax-deferred retirement savings", beneficiaryRequired: true },
      { id: "family-taxable", label: "Taxable Household", registration: "Joint Taxable", taxTreatment: "Taxable household investing", beneficiaryRequired: false }
    ],
    sleeveCashBalances: {
      "family-529": 45000,
      "family-401k": 120000,
      "family-taxable": 55000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 55,
    mandateScore: 22,
    advisorNote: "Needs a balanced plan that respects education funding and liquidity needs at the same time.",
    mandateTargets: ["funds", "fixedIncome", "bonds", "stocks"],
    watchouts: ["futures", "forex"],
    insuranceNeeds: ["term-life", "umbrella", "disability"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 42,
    insuranceNote: "Family cash flow and liability protection matter because the plan has education, debt, and income dependencies all at once.",
    cashFlow: {
      monthlyIncome: 16500,
      monthlyExpenses: 9700,
      monthlyDebtPayments: 2850,
      emergencyReserveMonths: 9,
      nearTermLiquidityNeed: "High"
    },
    creditProfile: {
      score: 682,
      scoreBand: "Good",
      utilizationPct: 38,
      recentInquiries: 2,
      delinquentAccounts: 0,
      unpaidCollections: 0,
      trend: "Stable"
    },
    debtProfile: {
      mortgageBalance: 418000,
      mortgageRate: 0.071,
      mortgageTermYearsRemaining: 24,
      propertyValue: 640000,
      housingPayment: 3240,
      creditCardBalance: 8600,
      autoLoanBalance: 23600,
      studentLoanBalance: 42000,
      helocBalance: 18000,
      unsecuredDebt: 0,
      unpaidDebtBalance: 0
    },
    mortgageProfile: {
      occupancy: "Primary Residence",
      loanPreference: "Either",
      refinanceHorizonMonths: 84,
      pmiActive: false,
      propertyTaxMonthly: 640,
      homeownerInsuranceMonthly: 190,
      closingCostSensitivity: "High"
    },
    lendingProfile: {
      underwritingTrack: "Mortgage",
      employmentStrength: "Strong",
      collateralStrength: "Strong",
      businessCashFlowCoverage: null,
      recentLatePayments: 0,
      requestedLoanPurpose: "Mortgage relief and college-cash-flow flexibility"
    },
    taxProfile: {
      filingStatus: "Married filing jointly",
      taxBracketLabel: "High household marginal bracket",
      accountTreatment: "Mix of taxable savings, college-funding goals, and debt-management tradeoffs"
    },
    investmentPolicy: {
      objective: "Balance growth for education and retirement with mortgage and family liquidity needs.",
      timeHorizon: "6-10 years to first tuition wave; 20+ years to retirement",
      liquidityNeeds: "High because college, home costs, and family emergencies can arrive together",
      constraints: ["Cannot be overexposed to drawdowns right before tuition years", "Needs flexibility for refinancing or debt paydown decisions"],
      prohibitedStrategies: ["Leveraged speculation", "Illiquid alternatives in the core education sleeve"],
      prohibitedBuckets: ["futures", "commodities"],
      maxSinglePositionPct: 15,
      equityRangeLabel: "40% - 60% equity sleeve",
      targetEquityMinPct: 0.4,
      targetEquityMaxPct: 0.6,
      maxNonEquityPct: 0.6,
      speculativeBetaThreshold: 1.6,
      reviewCadence: "Quarterly household review",
      nextReviewFocus: "Revisit mortgage, tuition reserve, and whether family liquidity still matches the current market allocation.",
      retirementIncomeNeed: "No retirement withdrawals yet, but household cash-flow stability is essential"
    },
    retirementDistribution: {
      distributionPhase: false,
      socialSecurityStrategy: "Too early for claiming choices; present focus is balancing accumulation with family obligations.",
      rmdStatus: "No RMD pressure",
      withdrawalApproach: "Prioritize liquidity buckets for tuition and family shocks instead of tapping long-term retirement assets.",
      reserveBucketYears: 1,
      targetWithdrawalRate: 0
    },
    benefitsProfile: {
      primaryPlan: "Dual 401(k) and family cash-flow coordination",
      employerMatch: "Each spouse should capture available match before overfunding lower-priority goals.",
      hsaStrategy: "If eligible, HSA can support family medical costs and long-term planning.",
      equityCompensation: "Any stock compensation should be sized against mortgage, tuition, and reserve needs.",
      planningFocus: "Benefits decisions should support tuition, mortgage flexibility, and retirement at the same time."
    },
    estateProfile: {
      coreDocuments: ["Wills", "Guardianship documents", "Powers of attorney"],
      trustStructure: "Basic revocable trust discussion may help if probate and guardianship simplicity matter.",
      beneficiaryReview: "Life insurance and retirement accounts should line up with guardianship and child-related goals.",
      liquidityRisk: "A death or disability event could hit mortgage, tuition, and income at once.",
      planningFocus: "Estate planning here is about protecting children, decision authority, and smooth transfer mechanics."
    },
    accountStructure: {
      registration: "Family taxable savings plus retirement accounts",
      taxAdvantagedPriority: "Coordinate college goals, retirement deferrals, and debt choices without starving liquidity.",
      assetLocationNote: "Place steadier or income-heavy sleeves where taxes and tuition timing create the least friction."
    },
    educationPlanning: {
      active: true,
      objective: "Fund two education tracks without derailing retirement and mortgage flexibility.",
      targetYears: "6-10 years to first tuition draw",
      fundingPriority: "Build dedicated college reserves and avoid overexposure to drawdown risk near tuition years.",
      planningNote: "Education planning should use time-segmented funding rather than treating the whole household portfolio as one generic pool."
    },
    revenueProfile: {
      advisoryFeeBps: 90,
      serviceTier: "Family planning relationship",
      annualRevenueTarget: 1980
    },
    retirementMath: {
      annualSpendingGoal: 151800,
      annualGuaranteedIncome: 0,
      expectedReturn: 0.061,
      inflationAssumption: 0.028,
      assumedLongevityAge: 92,
      safeWithdrawalGuardrail: 0.04
    },
    productComparison: {
      primaryNeed: "Balance tuition funding, retirement savings, and mortgage flexibility",
      recommendedLane: "Time-segmented 529 and balanced household portfolio approach",
      lowerCostAlternative: "Broad index and short-duration reserve mix rather than complex active sleeves",
      caution: "Avoid treating every dollar as long-term retirement money when tuition and mortgage needs are closer."
    },
    crmProfile: {
      serviceModel: "Quarterly household planning review",
      nextReviewWindow: "Next 21 days",
      nextTask: "Refresh tuition timeline, emergency reserve, and mortgage decision framework.",
      lastContactSummary: "Family wants coordination across debt, education, and investing rather than isolated product pitches.",
      referralPotential: "High"
    },
    supervisionProfile: {
      reviewLevel: "Family-plan supervision review",
      exceptionFocus: "Liquidity stress, insurance gaps, and unsuitable leverage",
      documentationPriority: "Education planning tradeoffs and protection recommendations",
      supervisionNote: "Household plans should document how tuition, debt, and insurance interact with allocation decisions."
    },
    clientNotes: ["Household planning should balance tuition, mortgage, and reserve flexibility."],
    questionSet: CLIENT_QUESTION_SETS.family
  },
  {
    id: "first_home_family",
    name: "The Lopez Family",
    accountType: "First Home Planning",
    age: 35,
    ageLabel: "Adults 35 / 33 | Child 4",
    householdAges: ["Parent 1: 35", "Parent 2: 33", "Child: 4"],
    avatar: "👨‍👩‍👦",
    goal: "First Home Purchase",
    riskProfile: "Moderate",
    riskClass: "risk-moderate",
    description: "Young family renting today and deciding how to structure a first home purchase without crushing reserves.",
    startingAum: 95000,
    cash: 95000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "lopez-529", label: "529 Starter", registration: "529 Plan", taxTreatment: "Tax-advantaged education savings", beneficiaryRequired: true },
      { id: "lopez-retirement", label: "Retirement Savings", registration: "401(k)/IRA mix", taxTreatment: "Tax-deferred and Roth retirement savings", beneficiaryRequired: true },
      { id: "lopez-house", label: "House Fund", registration: "Joint Taxable", taxTreatment: "Taxable cash and reserve sleeve", beneficiaryRequired: false }
    ],
    sleeveCashBalances: {
      "lopez-529": 12000,
      "lopez-retirement": 43000,
      "lopez-house": 40000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 54,
    mandateScore: 22,
    advisorNote: "Needs a practical first-home plan that keeps reserves intact instead of stretching for the largest approval.",
    mandateTargets: ["funds", "fixedIncome", "bonds"],
    watchouts: ["futures", "forex", "commodities"],
    insuranceNeeds: ["term-life", "disability", "umbrella"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 46,
    insuranceNote: "Buying a first home raises the need for income protection and liability coverage, but the family still needs to preserve down-payment liquidity.",
    cashFlow: {
      monthlyIncome: 9800,
      monthlyExpenses: 6100,
      monthlyDebtPayments: 2480,
      emergencyReserveMonths: 3,
      nearTermLiquidityNeed: "High"
    },
    creditProfile: {
      score: 618,
      scoreBand: "Fair",
      utilizationPct: 58,
      recentInquiries: 4,
      delinquentAccounts: 1,
      unpaidCollections: 1,
      trend: "Pressured"
    },
    debtProfile: {
      mortgageBalance: 0,
      mortgageRate: 0,
      mortgageTermYearsRemaining: 0,
      propertyValue: 525000,
      housingPayment: 2150,
      creditCardBalance: 14200,
      autoLoanBalance: 24700,
      studentLoanBalance: 31400,
      helocBalance: 0,
      unsecuredDebt: 4800,
      unpaidDebtBalance: 2100
    },
    mortgageProfile: {
      occupancy: "Primary Residence",
      loanPreference: "Either",
      refinanceHorizonMonths: 0,
      pmiActive: false,
      propertyTaxMonthly: 540,
      homeownerInsuranceMonthly: 145,
      closingCostSensitivity: "High"
    },
    mortgagePurchaseProfile: {
      stage: "First-time purchase",
      stateCode: "CA",
      metroArea: "Los Angeles-Long Beach-Anaheim",
      city: "Los Angeles",
      county: "Los Angeles County",
      propertyType: "Starter condo or townhome",
      targetPurchasePrice: 980000,
      maxComfortPurchasePrice: 760000,
      availableCashToClose: 70000,
      targetDownPaymentPct: 0.08,
      hoaMonthly: 375,
      localMarketPressure: "Very High",
      localRateAdjustmentBps: 12,
      localHousingNote: "This family wants to buy in Los Angeles, where even entry-level ownership can carry high taxes, HOA dues, insurance, and larger cash-to-close pressure than the state average suggests."
    },
    lendingProfile: {
      underwritingTrack: "Mortgage",
      employmentStrength: "Moderate",
      collateralStrength: "Moderate",
      businessCashFlowCoverage: null,
      recentLatePayments: 0,
      requestedLoanPurpose: "First-time home purchase with sustainable reserves"
    },
    taxProfile: {
      filingStatus: "Married filing jointly",
      taxBracketLabel: "Middle-income household bracket",
      accountTreatment: "Down-payment cash, retirement savings, and young-family debt obligations"
    },
    investmentPolicy: {
      objective: "Prepare for a first home purchase without depleting reserves or derailing long-term savings.",
      timeHorizon: "Home purchase in the next 12-24 months; retirement and education still ongoing",
      liquidityNeeds: "High because the down payment, closing cash, and emergency reserves all matter now",
      constraints: ["Must preserve emergency liquidity after closing", "Cannot treat retirement accounts as free down-payment money"],
      prohibitedStrategies: ["Using speculative assets as a house fund", "Stretching into a payment that destroys reserves"],
      prohibitedBuckets: ["futures", "forex", "commodities"],
      maxSinglePositionPct: 15,
      equityRangeLabel: "Low-volatility house-fund focus",
      targetEquityMinPct: 0.1,
      targetEquityMaxPct: 0.25,
      maxNonEquityPct: 0.9,
      speculativeBetaThreshold: 1.5,
      reviewCadence: "Quarterly home-purchase review",
      nextReviewFocus: "Test down payment, PMI, and payment durability before choosing a loan lane.",
      retirementIncomeNeed: "No current retirement withdrawals; focus is accumulation and housing stability"
    },
    retirementDistribution: {
      distributionPhase: false,
      socialSecurityStrategy: "Not an active planning issue yet.",
      rmdStatus: "No RMD pressure",
      withdrawalApproach: "Stay in accumulation mode and avoid raiding retirement accounts for the house purchase unless absolutely necessary.",
      reserveBucketYears: 1,
      targetWithdrawalRate: 0
    },
    benefitsProfile: {
      primaryPlan: "401(k) plus family reserve coordination",
      employerMatch: "Employer match should stay funded before stretching the house budget too far.",
      hsaStrategy: "HSA use can protect taxable liquidity if the household is eligible.",
      equityCompensation: "None currently",
      planningFocus: "Balance a first-home purchase with family protection and retirement continuity."
    },
    estateProfile: {
      coreDocuments: ["Beneficiary review", "Basic will", "Guardian discussion"],
      trustStructure: "No complex trust structure needed yet, but titling and beneficiary basics matter.",
      beneficiaryReview: "Retirement and insurance beneficiaries should align with the family plan before purchase.",
      liquidityRisk: "A big down payment without reserve protection would leave the household exposed.",
      planningFocus: "The estate lens here is keeping guardianship and beneficiary basics aligned while the family builds net worth."
    },
    accountStructure: {
      registration: "Joint taxable house fund plus retirement savings",
      taxAdvantagedPriority: "Keep retirement contributions and match discipline intact while building the house fund.",
      assetLocationNote: "The house fund should stay liquid and low-volatility rather than being forced into aggressive growth assets."
    },
    educationPlanning: {
      active: true,
      objective: "Keep a modest education start without sacrificing the house purchase.",
      targetYears: "14 years to first tuition draw",
      fundingPriority: "Do not overfund education at the cost of home purchase or reserves.",
      planningNote: "The family needs balance, not competing all-in goals."
    },
    revenueProfile: {
      advisoryFeeBps: 95,
      serviceTier: "Young family planning",
      annualRevenueTarget: 902.50  // 95,000 AUM × 95bps / 10,000 = $902.50
    },
    retirementMath: {
      annualSpendingGoal: 73200,
      annualGuaranteedIncome: 0,
      expectedReturn: 0.059,
      inflationAssumption: 0.028,
      assumedLongevityAge: 92,
      safeWithdrawalGuardrail: 0.04
    },
    productComparison: {
      primaryNeed: "Affordable first-home purchase without sacrificing reserve safety",
      recommendedLane: "Disciplined down-payment strategy with payment durability and reserve protection",
      lowerCostAlternative: "Smaller down payment with PMI if that preserves emergency cash and avoids unsafe payment stretch",
      caution: "A larger house or larger down payment is not automatically the better decision if it leaves the family cash-poor."
    },
    crmProfile: {
      serviceModel: "Quarterly first-home planning review",
      nextReviewWindow: "Next 21 days",
      nextTask: "Compare FHA, conventional, and reserve-protection lanes before shopping homes.",
      lastContactSummary: "Family wants a clear answer on what they can safely afford, not just the biggest number a lender might quote.",
      referralPotential: "High"
    },
    supervisionProfile: {
      reviewLevel: "Mortgage suitability review",
      exceptionFocus: "Payment stretch, reserve depletion, and misuse of retirement savings",
      documentationPriority: "Affordability rationale and reserve-protection notes",
      supervisionNote: "The first-home recommendation should be defended with affordability and reserve logic, not just approval eligibility."
    },
    clientNotes: ["First-home purchase planning should focus on affordability, reserves, and sustainable cash-to-close."],
    questionSet: CLIENT_QUESTION_SETS.family
  },
  {
    id: "entrepreneur",
    name: "Sofia Reyes",
    accountType: "Business Exit Planning",
    age: 52,
    ageLabel: "Age 52",
    householdAges: ["Sofia: 52"],
    avatar: "👩‍🏫",
    goal: "Business Exit Planning",
    riskProfile: "Moderate-Aggressive",
    riskClass: "risk-moderate-aggressive",
    description: "Sold her business. Large cash position. Needs tax-efficient deployment.",
    startingAum: 1200000,
    cash: 1200000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "entrepreneur-taxable", label: "Taxable Liquidity", registration: "Individual/Trust Taxable", taxTreatment: "Taxable event-driven capital pool", beneficiaryRequired: false },
      { id: "entrepreneur-retirement", label: "Retirement Sleeve", registration: "SEP / IRA style", taxTreatment: "Tax-advantaged retirement capital", beneficiaryRequired: true },
      { id: "entrepreneur-trust", label: "Trust / Estate Sleeve", registration: "Trust", taxTreatment: "Trust and legacy planning sleeve", beneficiaryRequired: true }
    ],
    sleeveCashBalances: {
      "entrepreneur-taxable": 575000,
      "entrepreneur-retirement": 325000,
      "entrepreneur-trust": 300000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 57,
    mandateScore: 22,
    advisorNote: "Open to growth and alternatives, but wants tax-aware, strategic deployment of capital.",
    mandateTargets: ["funds", "stocks", "bonds"],
    watchouts: ["forex"],
    insuranceNeeds: ["umbrella", "whole-life", "disability"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 38,
    insuranceNote: "A stronger planning conversation can connect liability, estate liquidity, and business-owner risk without overselling permanent coverage.",
    cashFlow: {
      monthlyIncome: 22000,
      monthlyExpenses: 13000,
      monthlyDebtPayments: 2400,
      emergencyReserveMonths: 12,
      nearTermLiquidityNeed: "Moderate"
    },
    creditProfile: {
      score: 768,
      scoreBand: "Very Good",
      utilizationPct: 11,
      recentInquiries: 1,
      delinquentAccounts: 0,
      unpaidCollections: 0,
      trend: "Stable"
    },
    debtProfile: {
      mortgageBalance: 610000,
      mortgageRate: 0.064,
      mortgageTermYearsRemaining: 19,
      propertyValue: 1040000,
      housingPayment: 4620,
      creditCardBalance: 7100,
      autoLoanBalance: 0,
      studentLoanBalance: 0,
      helocBalance: 95000,
      unsecuredDebt: 0,
      unpaidDebtBalance: 0
    },
    mortgageProfile: {
      occupancy: "Primary Residence",
      loanPreference: "Fixed",
      refinanceHorizonMonths: 48,
      pmiActive: false,
      propertyTaxMonthly: 980,
      homeownerInsuranceMonthly: 240,
      closingCostSensitivity: "Low"
    },
    lendingProfile: {
      underwritingTrack: "Private Wealth",
      employmentStrength: "Strong",
      collateralStrength: "Strong",
      businessCashFlowCoverage: 2.4,
      recentLatePayments: 0,
      requestedLoanPurpose: "Liquidity bridge and private-banking flexibility"
    },
    taxProfile: {
      filingStatus: "High-net-worth entrepreneur",
      taxBracketLabel: "Top federal bracket with capital-gain planning sensitivity",
      accountTreatment: "Large taxable liquidity event requiring tax-aware deployment and estate coordination"
    },
    investmentPolicy: {
      objective: "Deploy post-exit capital tax-efficiently while preserving optionality for future ventures and estate planning.",
      timeHorizon: "10+ years for growth, with shorter windows for tax and liquidity decisions",
      liquidityNeeds: "Moderate to high around tax payments, estate planning, and opportunity capital",
      constraints: ["Wants strategy, not generic product dumping", "Needs planning around taxes, liability, and concentrated wealth psychology"],
      prohibitedStrategies: ["Random speculative trading detached from tax and estate consequences"],
      prohibitedBuckets: ["futures"],
      maxSinglePositionPct: 20,
      equityRangeLabel: "45% - 70% equity sleeve",
      targetEquityMinPct: 0.45,
      targetEquityMaxPct: 0.7,
      maxNonEquityPct: 0.55,
      speculativeBetaThreshold: 1.7,
      reviewCadence: "Quarterly founder review",
      nextReviewFocus: "Balance tax reserve, estate planning, and concentrated wealth decisions before stretching into opportunistic risk.",
      retirementIncomeNeed: "May need future lifestyle distributions, but the immediate issue is strategic capital deployment"
    },
    retirementDistribution: {
      distributionPhase: false,
      socialSecurityStrategy: "Claiming is still a later-stage issue; current focus is post-liquidity-event deployment.",
      rmdStatus: "No immediate RMD pressure",
      withdrawalApproach: "Use taxable liquidity strategically while preserving future optionality for retirement income.",
      reserveBucketYears: 2,
      targetWithdrawalRate: 0
    },
    benefitsProfile: {
      primaryPlan: "Business-owner and post-exit retirement plan coordination",
      employerMatch: "Traditional match less relevant; planning centers on solo or executive-style savings decisions if future ventures emerge.",
      hsaStrategy: "Healthcare savings can still be useful if eligible, but tax and estate coordination dominate.",
      equityCompensation: "Private-business equity and concentrated wealth mentality are bigger issues than public RSUs.",
      planningFocus: "Use business-owner style planning discipline around taxes, reserves, and concentrated wealth."
    },
    estateProfile: {
      coreDocuments: ["Will", "Revocable trust review", "Power of attorney", "Healthcare directive"],
      trustStructure: "Trust structure may matter for privacy, control, and post-exit estate coordination.",
      beneficiaryReview: "Account titling and beneficiaries should match the estate and legacy plan after the liquidity event.",
      liquidityRisk: "Tax bills, estate equalization, or family transfers can pressure cash unexpectedly.",
      planningFocus: "Estate planning here is tied closely to taxes, control, and protecting newly created wealth."
    },
    accountStructure: {
      registration: "Large taxable liquidity-event portfolio",
      taxAdvantagedPriority: "Asset location should reduce unnecessary income drag and keep optionality for estate moves.",
      assetLocationNote: "Favor tax-aware placement and liquidity buckets before adding higher-distribution or illiquid sleeves."
    },
    educationPlanning: {
      active: false,
      objective: "No dedicated child-education mandate",
      targetYears: "Not applicable",
      fundingPriority: "Tax, estate, and liquidity deployment take priority over education-planning structures.",
      planningNote: "Education planning is secondary to post-exit capital strategy."
    },
    revenueProfile: {
      advisoryFeeBps: 70,
      serviceTier: "Advanced private wealth",
      annualRevenueTarget: 8400
    },
    retirementMath: {
      annualSpendingGoal: 156000,
      annualGuaranteedIncome: 0,
      expectedReturn: 0.064,
      inflationAssumption: 0.028,
      assumedLongevityAge: 92,
      safeWithdrawalGuardrail: 0.04
    },
    productComparison: {
      primaryNeed: "Tax-efficient deployment of post-exit liquidity",
      recommendedLane: "Layered taxable portfolio with tax reserve, municipal options, and diversified growth sleeves",
      lowerCostAlternative: "Broad ETF core with direct muni and treasury reserves",
      caution: "Do not let alternative-product packaging replace clear tax and liquidity math."
    },
    crmProfile: {
      serviceModel: "Quarterly private-wealth strategy review",
      nextReviewWindow: "Next 14 days",
      nextTask: "Review tax reserve, estate transfer strategy, and concentrated wealth behavior after the liquidity event.",
      lastContactSummary: "Client expects sophistication and will notice generic recommendations immediately.",
      referralPotential: "High"
    },
    supervisionProfile: {
      reviewLevel: "Heightened private-wealth review",
      exceptionFocus: "Tax-sensitive product placement, estate liquidity, and concentrated bets",
      documentationPriority: "Large-allocation changes and insurance/estate rationale",
      supervisionNote: "Post-liquidity-event clients need especially careful documentation around taxes and estate alignment."
    },
    clientNotes: ["Post-exit planning needs tax-aware deployment, estate coordination, and liability review."],
    questionSet: CLIENT_QUESTION_SETS.entrepreneur
  },
  {
    id: "institutional",
    name: "Meridian Endowment Fund",
    accountType: "Institutional Endowment",
    age: null,
    ageLabel: "Institutional mandate",
    householdAges: ["Institutional account"],
    avatar: "🏛️",
    goal: "Endowment Preservation & Growth",
    riskProfile: "Moderate",
    riskClass: "risk-moderate",
    description: "University endowment. Must follow UPIA with a spending rule.",
    startingAum: 5000000,
    cash: 5000000,
    holdings: {},
    shortHoldings: {},
    marginDebt: 0,
    marginCall: false,
    accountSleeves: [
      { id: "institutional-operating", label: "Operating Reserve", registration: "Institutional Reserve", taxTreatment: "Tax-exempt reserve pool", beneficiaryRequired: false },
      { id: "institutional-longterm", label: "Long-Term Pool", registration: "Endowment Long-Term", taxTreatment: "Tax-exempt growth sleeve", beneficiaryRequired: false },
      { id: "institutional-spending", label: "Spending Support", registration: "Spending Support Sleeve", taxTreatment: "Tax-exempt spending rule sleeve", beneficiaryRequired: false }
    ],
    sleeveCashBalances: {
      "institutional-operating": 1000000,
      "institutional-longterm": 3000000,
      "institutional-spending": 1000000
    },
    holdingAccountMap: {},
    shortHoldingAccountMap: {},
    status: "pending",
    trustScore: 60,
    mandateScore: 22,
    advisorNote: "Prefers disciplined diversification and preservation of purchasing power over flashy bets.",
    mandateTargets: ["funds", "fixedIncome", "bonds", "stocks"],
    watchouts: ["futures", "forex", "commodities"],
    insuranceNeeds: ["umbrella"],
    insuranceCoverage: [],
    insurancePressure: 0,
    insuranceGapScore: 18,
    insuranceNote: "Insurance matters less here than liquidity, governance, and fiduciary structure, so product pushing will land poorly.",
    cashFlow: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlyDebtPayments: 0,
      emergencyReserveMonths: 24,
      nearTermLiquidityNeed: "Moderate"
    },
    creditProfile: {
      score: 490,
      scoreBand: "Poor",
      utilizationPct: 92,
      recentInquiries: 8,
      delinquentAccounts: 3,
      unpaidCollections: 2,
      trend: "Pressured"
    },
    debtProfile: {
      mortgageBalance: 0,
      mortgageRate: 0,
      mortgageTermYearsRemaining: 0,
      propertyValue: 0,
      housingPayment: 0,
      creditCardBalance: 0,
      autoLoanBalance: 0,
      studentLoanBalance: 0,
      helocBalance: 0,
      unsecuredDebt: 0,
      unpaidDebtBalance: 0
    },
    mortgageProfile: {
      occupancy: "Not Applicable",
      loanPreference: "Not Applicable",
      refinanceHorizonMonths: 0,
      pmiActive: false,
      propertyTaxMonthly: 0,
      homeownerInsuranceMonthly: 0,
      closingCostSensitivity: "Low"
    },
    lendingProfile: {
      underwritingTrack: "Institutional",
      employmentStrength: "Strong",
      collateralStrength: "Strong",
      businessCashFlowCoverage: 3.1,
      recentLatePayments: 0,
      requestedLoanPurpose: "Institutional spending support and reserve continuity"
    },
    taxProfile: {
      filingStatus: "Institutional / tax-exempt",
      taxBracketLabel: "Tax-exempt policy portfolio",
      accountTreatment: "Endowment-style pool with spending-rule and governance constraints"
    },
    investmentPolicy: {
      objective: "Preserve purchasing power while supporting a disciplined annual spending requirement.",
      timeHorizon: "Perpetual institutional horizon",
      liquidityNeeds: "Moderate because annual spending draws still need funded reserves",
      constraints: ["Must respect prudent diversification and spending-policy discipline", "Optics and governance matter as much as return"],
      prohibitedStrategies: ["Speculative leverage", "Concentrated directional bets", "Products that undermine governance discipline"],
      prohibitedBuckets: ["futures", "forex", "commodities"],
      maxSinglePositionPct: 10,
      equityRangeLabel: "35% - 55% equity sleeve",
      targetEquityMinPct: 0.35,
      targetEquityMaxPct: 0.55,
      maxNonEquityPct: 0.65,
      speculativeBetaThreshold: 1.6,
      reviewCadence: "Quarterly committee review",
      nextReviewFocus: "Validate spending-rule support, governance discipline, and whether any sleeve is drifting too far from policy.",
      spendingRule: "Approximate 4.5% annual spending support target"
    },
    retirementDistribution: {
      distributionPhase: true,
      socialSecurityStrategy: "Not applicable to an institutional pool.",
      rmdStatus: "No RMDs; the key issue is spending-rule discipline.",
      withdrawalApproach: "Fund annual distributions through a prudent reserve and total-return framework.",
      reserveBucketYears: 2,
      targetWithdrawalRate: 0.045
    },
    benefitsProfile: {
      primaryPlan: "Institutional benefits planning not applicable",
      employerMatch: "No employer-match lens for an endowment pool",
      hsaStrategy: "Not applicable",
      equityCompensation: "Not applicable",
      planningFocus: "Governance, spending support, and prudence matter more than workplace benefit design."
    },
    estateProfile: {
      coreDocuments: ["Investment policy statement", "Spending policy", "Governance oversight"],
      trustStructure: "Institutional governance structure replaces personal-estate mechanics.",
      beneficiaryReview: "Not a personal beneficiary-driven account.",
      liquidityRisk: "Annual distributions and board expectations create their own liquidity discipline.",
      planningFocus: "Institutional stewardship is the analog to estate planning here: continuity, governance, and prudent support."
    },
    accountStructure: {
      registration: "Institutional tax-exempt pool",
      taxAdvantagedPriority: "Tax drag is lower, but asset placement still matters for liquidity and governance discipline.",
      assetLocationNote: "Keep spending-support reserves and governance-sensitive sleeves clearly aligned to policy."
    },
    educationPlanning: {
      active: false,
      objective: "Institutional spending support rather than household education planning",
      targetYears: "Perpetual support horizon",
      fundingPriority: "Support the spending rule and governance discipline.",
      planningNote: "This pool behaves more like an endowment-spending mandate than a family 529 discussion."
    },
    revenueProfile: {
      advisoryFeeBps: 45,
      serviceTier: "Institutional consulting",
      annualRevenueTarget: 22500
    },
    retirementMath: {
      annualSpendingGoal: 225000,
      annualGuaranteedIncome: 0,
      expectedReturn: 0.058,
      inflationAssumption: 0.025,
      assumedLongevityAge: null,
      safeWithdrawalGuardrail: 0.045
    },
    productComparison: {
      primaryNeed: "Support spending policy while preserving purchasing power",
      recommendedLane: "Diversified institutional pool with disciplined liquidity and duration management",
      lowerCostAlternative: "Core index and high-quality fixed-income implementation",
      caution: "Avoid chasing complexity when governance and spending support are the actual objectives."
    },
    crmProfile: {
      serviceModel: "Quarterly committee review",
      nextReviewWindow: "Next investment committee meeting",
      nextTask: "Prepare spending-rule, drift, and governance exception summary for committee oversight.",
      lastContactSummary: "Institutional contact cares most about discipline, governance, and defendable process.",
      referralPotential: "Low"
    },
    supervisionProfile: {
      reviewLevel: "Institutional oversight review",
      exceptionFocus: "Governance exceptions, spending-rule support, and policy drift",
      documentationPriority: "Committee-ready rationale and policy alignment",
      supervisionNote: "Institutional mandates require defensible process more than story-driven recommendations."
    },
    clientNotes: ["Governance, spending support, and disciplined diversification drive this relationship."],
    questionSet: CLIENT_QUESTION_SETS.institutional
  }
];
