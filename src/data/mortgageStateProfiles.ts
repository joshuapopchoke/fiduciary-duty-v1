import { US_STATES } from "./usStates";

export type ForeclosureTrack = "Judicial primary" | "Nonjudicial primary" | "Mixed / varies";
export type DeficiencyExposure = "Lower consumer exposure" | "Case-specific exposure" | "Higher recourse exposure";
export type ClosingStyle = "Attorney-centered" | "Title / escrow-centered" | "Mixed closing practice";

export interface MortgageStateProfile {
  code: string;
  name: string;
  foreclosureTrack: ForeclosureTrack;
  deficiencyExposure: DeficiencyExposure;
  closingStyle: ClosingStyle;
  firstTimeBuyerFocus: string;
  fhaConventionalFocus: string;
  investorPropertyFocus: string;
  rateLockFocus: string;
  trainingNote: string;
}

function buildDefaultProfile(code: string, name: string): MortgageStateProfile {
  return {
    code,
    name,
    foreclosureTrack: "Mixed / varies",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Mixed closing practice",
    firstTimeBuyerFocus: "Review state housing-finance agency support, local down-payment assistance, and reserve expectations before stretching into a thin approval.",
    fhaConventionalFocus: "Coach the trainee to compare FHA flexibility against conventional mortgage insurance exit potential, credit profile, and total payment durability.",
    investorPropertyFocus: "Investor-property files should be treated more conservatively on reserves, vacancy risk, and payment shock than primary-residence files.",
    rateLockFocus: "Rate-lock discussions should weigh closing timeline reliability, cost to extend, and whether the borrower can survive a delayed close.",
    trainingNote: "Use federal mortgage rules as the baseline, then layer in this state’s foreclosure, closing, and consumer-protection posture as a training overlay rather than a substitute for legal counsel."
  };
}

const PROFILE_OVERRIDES: Record<string, Partial<MortgageStateProfile>> = {
  CA: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Lower consumer exposure",
    closingStyle: "Title / escrow-centered",
    firstTimeBuyerFocus: "California cases should push trainees to compare high-cost-area pressure, local down-payment support, and whether the borrower can survive insurance, tax, and HOA carry.",
    investorPropertyFocus: "California investor-property training should stress DSCR realism, reserve depth, and not assuming appreciation will bail out a thin file.",
    rateLockFocus: "In California, rate-lock coaching should emphasize volatile high-balance files, escrow timing, and extension-cost sensitivity in competitive markets."
  },
  MD: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered",
    firstTimeBuyerFocus: "Maryland training should emphasize mediation-aware borrower coaching, state and county assistance layering, and avoiding over-approval on taxes and insurance.",
    fhaConventionalFocus: "Maryland FHA-versus-conventional cases should balance payment durability, closing-cost support, and whether stronger credit can justify a conventional lane with cleaner long-run cost."
  },
  MI: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Title / escrow-centered",
    firstTimeBuyerFocus: "Michigan first-time-buyer files should push reserve discipline, property-condition realism, and whether assistance programs are helping affordability or merely masking stress.",
    investorPropertyFocus: "Michigan investor-property cases should stress rent durability, property-condition risk, and winter-cycle maintenance drag instead of optimistic valuation stories."
  },
  FL: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Higher recourse exposure",
    closingStyle: "Title / escrow-centered"
  },
  TX: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Title / escrow-centered",
    rateLockFocus: "Texas training should address fast-moving close timelines, property-tax shock, and whether lock costs still make sense if closing readiness is weak."
  },
  NY: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  NJ: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  PA: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Mixed closing practice"
  },
  NC: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  GA: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Higher recourse exposure",
    closingStyle: "Attorney-centered"
  },
  VA: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  WA: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Lower consumer exposure",
    closingStyle: "Title / escrow-centered"
  },
  OR: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Lower consumer exposure",
    closingStyle: "Title / escrow-centered"
  },
  CT: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  MA: {
    foreclosureTrack: "Nonjudicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  },
  IL: {
    foreclosureTrack: "Judicial primary",
    deficiencyExposure: "Case-specific exposure",
    closingStyle: "Attorney-centered"
  }
};

export const MORTGAGE_STATE_PROFILES: MortgageStateProfile[] = US_STATES.map((state) => ({
  ...buildDefaultProfile(state.code, state.name),
  ...PROFILE_OVERRIDES[state.code]
}));

export function getMortgageStateProfile(stateCode: string | null | undefined) {
  if (!stateCode) {
    return null;
  }

  return MORTGAGE_STATE_PROFILES.find((profile) => profile.code === stateCode) ?? null;
}
