import type { Question } from "./question";

export type RiskProfile =
  | "Conservative"
  | "Moderate"
  | "Moderate-Aggressive"
  | "Aggressive";

export type ClientStatus = "satisfied" | "pending" | "at-risk";

export interface ClientHolding {
  ticker: string;
  shares: number;
  averageCost: number;
}

export interface MarginPosition extends ClientHolding {}

export interface ClientAccountSleeve {
  id: string;
  label: string;
  registration: string;
  taxTreatment: string;
  beneficiaryRequired: boolean;
}

export interface ClientCashFlowProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyDebtPayments: number;
  emergencyReserveMonths: number;
  nearTermLiquidityNeed: "Low" | "Moderate" | "High";
}

export interface CreditProfile {
  score: number;
  scoreBand: "Poor" | "Fair" | "Good" | "Very Good" | "Excellent";
  utilizationPct: number;
  recentInquiries: number;
  delinquentAccounts: number;
  unpaidCollections: number;
  trend: "Improving" | "Stable" | "Pressured";
}

export interface DebtProfile {
  mortgageBalance: number;
  mortgageRate: number;
  mortgageTermYearsRemaining: number;
  propertyValue: number;
  housingPayment: number;
  creditCardBalance: number;
  autoLoanBalance: number;
  studentLoanBalance: number;
  helocBalance: number;
  unsecuredDebt: number;
  unpaidDebtBalance: number;
}

export interface MortgagePlanningProfile {
  occupancy: "Primary Residence" | "Second Home" | "Investment Property" | "Not Applicable";
  loanPreference: "Fixed" | "ARM" | "Either" | "Not Applicable";
  refinanceHorizonMonths: number;
  pmiActive: boolean;
  propertyTaxMonthly: number;
  homeownerInsuranceMonthly: number;
  closingCostSensitivity: "Low" | "Moderate" | "High";
}

export interface MortgagePurchaseProfile {
  stage: "First-time purchase" | "Move-up purchase" | "Investment acquisition";
  stateCode: string;
  metroArea: string;
  city: string;
  county: string;
  propertyType: string;
  targetPurchasePrice: number;
  maxComfortPurchasePrice: number;
  availableCashToClose: number;
  targetDownPaymentPct: number;
  hoaMonthly: number;
  localMarketPressure: "Low" | "Moderate" | "High" | "Very High";
  localRateAdjustmentBps: number;
  localHousingNote: string;
}

export interface LendingProfile {
  underwritingTrack: "Consumer" | "Mortgage" | "Private Wealth" | "Institutional";
  employmentStrength: "Weak" | "Moderate" | "Strong";
  collateralStrength: "Weak" | "Moderate" | "Strong";
  businessCashFlowCoverage: number | null;
  recentLatePayments: number;
  requestedLoanPurpose: string;
}

export interface ClientTaxProfile {
  filingStatus: string;
  taxBracketLabel: string;
  accountTreatment: string;
}

export interface InvestmentPolicyProfile {
  objective: string;
  timeHorizon: string;
  liquidityNeeds: string;
  constraints: string[];
  prohibitedStrategies: string[];
  prohibitedBuckets?: string[];
  maxSinglePositionPct?: number;
  equityRangeLabel?: string;
  targetEquityMinPct?: number;
  targetEquityMaxPct?: number;
  maxNonEquityPct?: number;
  speculativeBetaThreshold?: number;
  reviewCadence: string;
  nextReviewFocus: string;
  spendingRule?: string;
  retirementIncomeNeed?: string;
}

export interface RetirementDistributionProfile {
  distributionPhase: boolean;
  socialSecurityStrategy: string;
  rmdStatus: string;
  withdrawalApproach: string;
  reserveBucketYears: number;
  targetWithdrawalRate: number;
}

export interface BenefitsProfile {
  primaryPlan: string;
  employerMatch: string;
  hsaStrategy: string;
  equityCompensation: string;
  planningFocus: string;
}

export interface EstatePlanningProfile {
  coreDocuments: string[];
  trustStructure: string;
  beneficiaryReview: string;
  liquidityRisk: string;
  planningFocus: string;
}

export interface AccountStructureProfile {
  registration: string;
  taxAdvantagedPriority: string;
  assetLocationNote: string;
}

export interface EducationPlanningProfile {
  active: boolean;
  objective: string;
  targetYears: string;
  fundingPriority: string;
  planningNote: string;
}

export interface RevenueProfile {
  advisoryFeeBps: number;
  serviceTier: string;
  annualRevenueTarget: number;
}

export interface RetirementMathProfile {
  annualSpendingGoal: number;
  annualGuaranteedIncome: number;
  expectedReturn: number;
  inflationAssumption: number;
  assumedLongevityAge: number | null;
  safeWithdrawalGuardrail: number;
}

export interface ProductComparisonProfile {
  primaryNeed: string;
  recommendedLane: string;
  lowerCostAlternative: string;
  caution: string;
}

export interface CrmWorkflowProfile {
  serviceModel: string;
  nextReviewWindow: string;
  nextTask: string;
  lastContactSummary: string;
  referralPotential: "Low" | "Moderate" | "High";
}

export interface SupervisionProfile {
  reviewLevel: string;
  exceptionFocus: string;
  documentationPriority: string;
  supervisionNote: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  accountType: string;
  age: number | null;
  ageLabel: string;
  householdAges: string[];
  avatar: string;
  goal: string;
  riskProfile: RiskProfile;
  riskClass: string;
  description: string;
  startingAum: number;
  cash: number;
  holdings: Record<string, ClientHolding>;
  shortHoldings: Record<string, MarginPosition>;
  marginDebt: number;
  marginCall: boolean;
  accountSleeves: ClientAccountSleeve[];
  sleeveCashBalances: Record<string, number>;
  holdingAccountMap: Record<string, string>;
  shortHoldingAccountMap: Record<string, string>;
  status: ClientStatus;
  trustScore: number;
  mandateScore: number;
  advisorNote: string;
  mandateTargets: string[];
  watchouts: string[];
  insuranceNeeds: string[];
  insuranceCoverage: string[];
  insurancePressure: number;
  insuranceGapScore: number;
  insuranceNote: string;
  cashFlow: ClientCashFlowProfile;
  creditProfile: CreditProfile;
  debtProfile: DebtProfile;
  mortgageProfile: MortgagePlanningProfile;
  mortgagePurchaseProfile?: MortgagePurchaseProfile | null;
  lendingProfile: LendingProfile;
  taxProfile: ClientTaxProfile;
  investmentPolicy: InvestmentPolicyProfile;
  retirementDistribution: RetirementDistributionProfile;
  benefitsProfile: BenefitsProfile;
  estateProfile: EstatePlanningProfile;
  accountStructure: AccountStructureProfile;
  educationPlanning: EducationPlanningProfile;
  revenueProfile: RevenueProfile;
  retirementMath: RetirementMathProfile;
  productComparison: ProductComparisonProfile;
  crmProfile: CrmWorkflowProfile;
  supervisionProfile: SupervisionProfile;
  clientNotes: string[];
  questionSet: Question[];
}
