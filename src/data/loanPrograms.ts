export type LoanSource =
  | "Federal"
  | "State / HFA"
  | "Local / Municipal"
  | "Bank"
  | "Credit Union"
  | "Private / Specialty";

export interface MortgageLoanProgramDefinition {
  id: string;
  name: string;
  source: LoanSource;
  useCase: string;
  bestFit: string;
  caution: string;
}

export interface LendingProgramDefinition {
  id: string;
  name: string;
  source: LoanSource;
  category: "Consumer" | "Mortgage" | "Small Business" | "Commercial" | "Public / Institutional";
  useCase: string;
  bestFit: string;
  caution: string;
}

export const MORTGAGE_LOAN_PROGRAMS: MortgageLoanProgramDefinition[] = [
  {
    id: "conventional-fixed",
    name: "Conventional Fixed",
    source: "Bank",
    useCase: "Primary mortgage with stable payment needs.",
    bestFit: "Borrowers with stronger credit, documented income, and longer holding periods.",
    caution: "Can be less forgiving than government-backed programs when credit or reserves are thin."
  },
  {
    id: "conventional-arm",
    name: "Conventional ARM",
    source: "Bank",
    useCase: "Lower initial payment for borrowers with shorter horizons or planned turnover.",
    bestFit: "Borrowers who understand reset risk and are unlikely to keep the loan long term.",
    caution: "Payment shock risk matters if the property will be held beyond the fixed introductory period."
  },
  {
    id: "jumbo",
    name: "Jumbo Mortgage",
    source: "Bank",
    useCase: "Higher-balance financing above conforming limits.",
    bestFit: "Higher-income borrowers with stronger reserves and cleaner documentation.",
    caution: "Underwriting is often stricter, especially on reserves, asset sourcing, and debt levels."
  },
  {
    id: "fha",
    name: "FHA",
    source: "Federal",
    useCase: "Lower-down-payment owner-occupied housing finance.",
    bestFit: "Borrowers needing more flexible credit and down-payment treatment.",
    caution: "Mortgage insurance and property/occupancy rules can materially affect total cost."
  },
  {
    id: "va",
    name: "VA",
    source: "Federal",
    useCase: "Eligible veteran/service-member housing finance.",
    bestFit: "Qualified military borrowers seeking owner-occupied housing with favorable leverage options.",
    caution: "Eligibility and funding-fee treatment still need to be confirmed case by case."
  },
  {
    id: "usda",
    name: "USDA",
    source: "Federal",
    useCase: "Rural housing finance for eligible borrowers and properties.",
    bestFit: "Qualified borrowers in eligible rural areas with moderate income profiles.",
    caution: "Geographic and income-eligibility rules are central to fit."
  },
  {
    id: "state-hfa",
    name: "State Housing Finance / Down Payment Assistance",
    source: "State / HFA",
    useCase: "First-time-buyer assistance and state housing support programs.",
    bestFit: "Borrowers who need down-payment support or subsidized rate assistance through state channels.",
    caution: "Income caps, occupancy, and recapture or subordinate-lien terms vary materially by state."
  },
  {
    id: "local-dpa",
    name: "Local Down Payment Assistance",
    source: "Local / Municipal",
    useCase: "City or county buyer-assistance programs.",
    bestFit: "Borrowers whose income and property location match local housing goals.",
    caution: "Program availability, forgivable terms, and reuse restrictions vary by municipality."
  },
  {
    id: "heloc",
    name: "HELOC",
    source: "Bank",
    useCase: "Flexible revolving borrowing against home equity.",
    bestFit: "Borrowers needing staged access to equity rather than a full refinance reset.",
    caution: "Variable-rate risk and draw-period behavior need to be explained clearly."
  },
  {
    id: "home-equity-loan",
    name: "Home Equity Loan",
    source: "Bank",
    useCase: "Fixed second-lien borrowing against existing equity.",
    bestFit: "Borrowers who need a one-time fixed amount without opening a revolving line.",
    caution: "Adds payment load and second-lien complexity even when the first mortgage is attractive."
  },
  {
    id: "cash-out-refi",
    name: "Cash-Out Refinance",
    source: "Bank",
    useCase: "Refinance while drawing equity proceeds.",
    bestFit: "Borrowers with strong equity, clean purpose of funds, and enough runway to justify note reset costs.",
    caution: "Can worsen term economics if used for short-lived spending or to cover weak cash habits."
  },
  {
    id: "streamline-refi",
    name: "Government Streamline Refi",
    source: "Federal",
    useCase: "Simplified refinance path for certain FHA/VA/USDA borrowers.",
    bestFit: "Qualified existing government-program borrowers seeking lower payment or rate friction.",
    caution: "Still must be evaluated for net tangible benefit rather than treated as automatically superior."
  }
];

export const LENDING_PROGRAMS: LendingProgramDefinition[] = [
  {
    id: "personal-installment",
    name: "Personal Installment Loan",
    source: "Bank",
    category: "Consumer",
    useCase: "Unsecured consumer borrowing with fixed repayment.",
    bestFit: "Borrowers with stable income and moderate debt loads needing a defined repayment path.",
    caution: "Should not be used to paper over chronic cash-flow instability."
  },
  {
    id: "credit-union-consumer",
    name: "Credit Union Consumer Loan",
    source: "Credit Union",
    category: "Consumer",
    useCase: "Member-focused consumer lending.",
    bestFit: "Borrowers eligible for membership who benefit from relationship-driven pricing or service.",
    caution: "Eligibility and offered terms vary materially by institution."
  },
  {
    id: "auto-loan",
    name: "Auto Loan",
    source: "Bank",
    category: "Consumer",
    useCase: "Vehicle-secured installment lending.",
    bestFit: "Borrowers needing transportation finance with a clear amortization schedule.",
    caution: "Negative equity and term stretch can hide affordability problems."
  },
  {
    id: "federal-student",
    name: "Federal Student Loan",
    source: "Federal",
    category: "Consumer",
    useCase: "Education lending through federal programs.",
    bestFit: "Borrowers evaluating repayment protections and federal program benefits.",
    caution: "Repayment options, forgiveness, and servicing rules are program-specific and can change."
  },
  {
    id: "private-student",
    name: "Private Student Loan",
    source: "Private / Specialty",
    category: "Consumer",
    useCase: "Supplemental education lending outside federal channels.",
    bestFit: "Borrowers who have exhausted federal options and understand cosigner and rate implications.",
    caution: "Usually offers fewer borrower protections than federal student lending."
  },
  {
    id: "sba-7a",
    name: "SBA 7(a)",
    source: "Federal",
    category: "Small Business",
    useCase: "General small-business financing supported by SBA guarantee structure.",
    bestFit: "Operating businesses needing working capital, acquisition support, or flexible business-purpose funding.",
    caution: "Eligibility, use-of-proceeds rules, and lender overlays still matter."
  },
  {
    id: "sba-504",
    name: "SBA 504",
    source: "Federal",
    category: "Small Business",
    useCase: "Longer-term fixed-asset and owner-occupied project finance.",
    bestFit: "Businesses financing real estate or major equipment with durable business use.",
    caution: "Structure is more specialized and usually not a fit for general working capital."
  },
  {
    id: "business-line",
    name: "Business Line of Credit",
    source: "Bank",
    category: "Small Business",
    useCase: "Flexible revolving credit for working-capital swings.",
    bestFit: "Businesses with recurring cash-flow cycles and clear short-term funding use.",
    caution: "Weak discipline can turn a seasonal tool into persistent structural debt."
  },
  {
    id: "equipment-loan",
    name: "Equipment Loan",
    source: "Bank",
    category: "Commercial",
    useCase: "Asset-backed financing for machinery or business equipment.",
    bestFit: "Borrowers financing identifiable income-producing equipment with measurable useful life.",
    caution: "Collateral resale value and cash-flow support both matter."
  },
  {
    id: "commercial-real-estate",
    name: "Commercial Real Estate Loan",
    source: "Bank",
    category: "Commercial",
    useCase: "Income-property or owner-occupied commercial property finance.",
    bestFit: "Borrowers with strong cash-flow support and documented collateral quality.",
    caution: "Tenant quality, lease rollover, DSCR, and property condition can change the risk materially."
  },
  {
    id: "construction-loan",
    name: "Construction / Bridge Loan",
    source: "Bank",
    category: "Commercial",
    useCase: "Shorter-term funding for buildout, transition, or redevelopment periods.",
    bestFit: "Projects with well-defined exit strategies and strong sponsor oversight.",
    caution: "Exit risk and cost overruns make this a very different risk profile from permanent financing."
  },
  {
    id: "municipal-obligation",
    name: "Municipal / Local Public Borrowing",
    source: "Local / Municipal",
    category: "Public / Institutional",
    useCase: "Public-purpose borrowing through municipal channels or local issuers.",
    bestFit: "Institutional or public borrowers with governance, revenue, and public-purpose support.",
    caution: "Public finance structure, legal authority, and repayment source must be validated separately."
  },
  {
    id: "state-infrastructure",
    name: "State / Agency Credit Program",
    source: "State / HFA",
    category: "Public / Institutional",
    useCase: "State-backed or agency credit support programs.",
    bestFit: "Borrowers whose purpose fits state-sponsored development, housing, or infrastructure lanes.",
    caution: "Program-specific eligibility and public-purpose restrictions matter more than generic bank logic."
  },
  {
    id: "private-credit",
    name: "Private Credit / Specialty Finance",
    source: "Private / Specialty",
    category: "Commercial",
    useCase: "Non-bank or bespoke credit solutions.",
    bestFit: "Borrowers with time-sensitive or more specialized structures that fall outside standard bank appetite.",
    caution: "Pricing, covenants, and control rights can be materially more demanding."
  }
];
