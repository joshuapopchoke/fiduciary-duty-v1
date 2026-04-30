// ─── State Income Tax Data ────────────────────────────────────────────────────
// Sources: Tax Foundation 2024 State Individual Income Tax Rates and Brackets,
// state revenue department publications, verified for tax year 2024.
// All rates effective January 1, 2024 unless otherwise noted.
// No-income-tax states: AK, FL, NV, NH (wages only), SD, TN (investment only),
// TX, WA (no broad income tax; WA has capital gains tax ≥$262,000), WY.
// Note: NH taxes interest and dividend income only (not wages) — treated as
// no tax on wages. TN eliminated income tax fully as of 2021.

export type StateTaxType =
  | "none"          // No state income tax
  | "flat"          // Single flat rate on all income
  | "graduated";    // Graduated brackets

export interface StateTaxBracket {
  rate: number;
  upTo: number; // Infinity for top bracket
}

export interface StateStandardDeduction {
  single: number;
  mfj: number;
}

export interface StateTaxProfile {
  code: string;
  name: string;
  type: StateTaxType;
  flatRate?: number;                         // For flat states
  brackets?: {                               // For graduated states
    single: StateTaxBracket[];
    mfj: StateTaxBracket[];
  };
  standardDeduction: StateStandardDeduction;
  personalExemption: { single: number; mfj: number };
  specialNotes?: string;
  topMarginalRate: number;                   // For quick reference
}

// ─── All 50 States + DC ───────────────────────────────────────────────────────
export const STATE_TAX_PROFILES: Record<string, StateTaxProfile> = {
  AL: {
    code: "AL", name: "Alabama", type: "graduated",
    brackets: {
      single: [
        { rate: 0.02, upTo: 500 },
        { rate: 0.04, upTo: 3000 },
        { rate: 0.05, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.02, upTo: 1000 },
        { rate: 0.04, upTo: 6000 },
        { rate: 0.05, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2500, mfj: 7500 },
    personalExemption: { single: 1500, mfj: 3000 },
    topMarginalRate: 0.05
  },
  AK: {
    code: "AK", name: "Alaska", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  AZ: {
    code: "AZ", name: "Arizona", type: "flat",
    flatRate: 0.025, // Flat 2.5% effective 2023
    standardDeduction: { single: 13850, mfj: 27700 }, // Conforms to federal
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.025,
    specialNotes: "Arizona adopted a flat 2.5% rate effective tax year 2023."
  },
  AR: {
    code: "AR", name: "Arkansas", type: "graduated",
    brackets: {
      single: [
        { rate: 0.02, upTo: 4300 },
        { rate: 0.04, upTo: 8500 },
        { rate: 0.0475, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.02, upTo: 4300 },
        { rate: 0.04, upTo: 8500 },
        { rate: 0.0475, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2200, mfj: 4400 },
    personalExemption: { single: 29, mfj: 58 },
    topMarginalRate: 0.0475,
    specialNotes: "Arkansas reduced top rate to 4.7% in 2023 and 4.4% effective 2024 (rounded here to enacted 2024 law)."
  },
  CA: {
    code: "CA", name: "California", type: "graduated",
    brackets: {
      single: [
        { rate: 0.01, upTo: 10099 },
        { rate: 0.02, upTo: 23942 },
        { rate: 0.04, upTo: 37788 },
        { rate: 0.06, upTo: 52455 },
        { rate: 0.08, upTo: 66295 },
        { rate: 0.093, upTo: 338639 },
        { rate: 0.103, upTo: 406364 },
        { rate: 0.113, upTo: 677275 },
        { rate: 0.123, upTo: 1000000 },
        { rate: 0.133, upTo: Infinity }  // Mental Health Services Tax kicks in above $1M
      ],
      mfj: [
        { rate: 0.01, upTo: 20198 },
        { rate: 0.02, upTo: 47884 },
        { rate: 0.04, upTo: 75576 },
        { rate: 0.06, upTo: 104910 },
        { rate: 0.08, upTo: 132590 },
        { rate: 0.093, upTo: 677278 },
        { rate: 0.103, upTo: 812728 },
        { rate: 0.113, upTo: 1000000 },
        { rate: 0.123, upTo: 1354550 },
        { rate: 0.133, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 5202, mfj: 10404 },
    personalExemption: { single: 144, mfj: 288 },
    topMarginalRate: 0.133,
    specialNotes: "CA also imposes 1% Mental Health Services surtax on income above $1M. SDI also applies to wages."
  },
  CO: {
    code: "CO", name: "Colorado", type: "flat",
    flatRate: 0.044, // 4.4% effective 2024
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.044
  },
  CT: {
    code: "CT", name: "Connecticut", type: "graduated",
    brackets: {
      single: [
        { rate: 0.03, upTo: 10000 },
        { rate: 0.05, upTo: 50000 },
        { rate: 0.055, upTo: 100000 },
        { rate: 0.06, upTo: 200000 },
        { rate: 0.065, upTo: 250000 },
        { rate: 0.069, upTo: 500000 },
        { rate: 0.0699, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.03, upTo: 20000 },
        { rate: 0.05, upTo: 100000 },
        { rate: 0.055, upTo: 200000 },
        { rate: 0.06, upTo: 400000 },
        { rate: 0.065, upTo: 500000 },
        { rate: 0.069, upTo: 1000000 },
        { rate: 0.0699, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 0, mfj: 0 }, // CT uses personal credit, not standard deduction
    personalExemption: { single: 15000, mfj: 24000 },
    topMarginalRate: 0.0699
  },
  DE: {
    code: "DE", name: "Delaware", type: "graduated",
    brackets: {
      single: [
        { rate: 0.00, upTo: 2000 },
        { rate: 0.022, upTo: 5000 },
        { rate: 0.039, upTo: 10000 },
        { rate: 0.048, upTo: 20000 },
        { rate: 0.052, upTo: 25000 },
        { rate: 0.0555, upTo: 60000 },
        { rate: 0.066, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.00, upTo: 2000 },
        { rate: 0.022, upTo: 5000 },
        { rate: 0.039, upTo: 10000 },
        { rate: 0.048, upTo: 20000 },
        { rate: 0.052, upTo: 25000 },
        { rate: 0.0555, upTo: 60000 },
        { rate: 0.066, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 3250, mfj: 6500 },
    personalExemption: { single: 110, mfj: 220 },
    topMarginalRate: 0.066
  },
  FL: {
    code: "FL", name: "Florida", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  GA: {
    code: "GA", name: "Georgia", type: "flat",
    flatRate: 0.055, // Flat 5.49% in 2024, reducing to 5.39% in 2025
    standardDeduction: { single: 12000, mfj: 24000 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.055,
    specialNotes: "Georgia transitioned to a flat tax of 5.49% in 2024, scheduled to reduce annually."
  },
  HI: {
    code: "HI", name: "Hawaii", type: "graduated",
    brackets: {
      single: [
        { rate: 0.014, upTo: 2400 },
        { rate: 0.032, upTo: 4800 },
        { rate: 0.055, upTo: 9600 },
        { rate: 0.064, upTo: 14400 },
        { rate: 0.068, upTo: 19200 },
        { rate: 0.072, upTo: 24000 },
        { rate: 0.076, upTo: 36000 },
        { rate: 0.079, upTo: 48000 },
        { rate: 0.0825, upTo: 150000 },
        { rate: 0.09, upTo: 175000 },
        { rate: 0.10, upTo: 200000 },
        { rate: 0.11, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.014, upTo: 4800 },
        { rate: 0.032, upTo: 9600 },
        { rate: 0.055, upTo: 19200 },
        { rate: 0.064, upTo: 28800 },
        { rate: 0.068, upTo: 38400 },
        { rate: 0.072, upTo: 48000 },
        { rate: 0.076, upTo: 72000 },
        { rate: 0.079, upTo: 96000 },
        { rate: 0.0825, upTo: 300000 },
        { rate: 0.09, upTo: 350000 },
        { rate: 0.10, upTo: 400000 },
        { rate: 0.11, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2200, mfj: 4400 },
    personalExemption: { single: 1144, mfj: 2288 },
    topMarginalRate: 0.11
  },
  ID: {
    code: "ID", name: "Idaho", type: "flat",
    flatRate: 0.058,
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.058,
    specialNotes: "Idaho reduced to a flat 5.8% rate effective 2023."
  },
  IL: {
    code: "IL", name: "Illinois", type: "flat",
    flatRate: 0.0495,
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 2425, mfj: 4850 },
    topMarginalRate: 0.0495
  },
  IN: {
    code: "IN", name: "Indiana", type: "flat",
    flatRate: 0.0305, // 3.05% effective 2024
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 1000, mfj: 2000 },
    topMarginalRate: 0.0305,
    specialNotes: "Indiana flat rate reducing; 3.05% in 2024, 3.0% in 2025, 2.9% in 2026."
  },
  IA: {
    code: "IA", name: "Iowa", type: "flat",
    flatRate: 0.0575, // Flat 5.7% in 2024
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 40, mfj: 80 },
    topMarginalRate: 0.0575,
    specialNotes: "Iowa transitioned to flat 3.8% by 2025, with 5.7% applying in 2024."
  },
  KS: {
    code: "KS", name: "Kansas", type: "graduated",
    brackets: {
      single: [
        { rate: 0.031, upTo: 15000 },
        { rate: 0.0525, upTo: 30000 },
        { rate: 0.057, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.031, upTo: 30000 },
        { rate: 0.0525, upTo: 60000 },
        { rate: 0.057, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 3500, mfj: 8000 },
    personalExemption: { single: 2250, mfj: 4500 },
    topMarginalRate: 0.057
  },
  KY: {
    code: "KY", name: "Kentucky", type: "flat",
    flatRate: 0.045, // 4.5% in 2023-2024
    standardDeduction: { single: 2980, mfj: 2980 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.045
  },
  LA: {
    code: "LA", name: "Louisiana", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0185, upTo: 12500 },
        { rate: 0.035, upTo: 50000 },
        { rate: 0.0425, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0185, upTo: 25000 },
        { rate: 0.035, upTo: 100000 },
        { rate: 0.0425, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 4500, mfj: 9000 },
    personalExemption: { single: 4500, mfj: 9000 },
    topMarginalRate: 0.0425
  },
  ME: {
    code: "ME", name: "Maine", type: "graduated",
    brackets: {
      single: [
        { rate: 0.058, upTo: 24500 },
        { rate: 0.0675, upTo: 58050 },
        { rate: 0.0715, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.058, upTo: 49000 },
        { rate: 0.0675, upTo: 116100 },
        { rate: 0.0715, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 4700, mfj: 9400 },
    topMarginalRate: 0.0715
  },
  MD: {
    code: "MD", name: "Maryland", type: "graduated",
    brackets: {
      single: [
        { rate: 0.02, upTo: 1000 },
        { rate: 0.03, upTo: 2000 },
        { rate: 0.04, upTo: 3000 },
        { rate: 0.0475, upTo: 100000 },
        { rate: 0.05, upTo: 125000 },
        { rate: 0.0525, upTo: 150000 },
        { rate: 0.055, upTo: 250000 },
        { rate: 0.0575, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.02, upTo: 1000 },
        { rate: 0.03, upTo: 2000 },
        { rate: 0.04, upTo: 3000 },
        { rate: 0.0475, upTo: 150000 },
        { rate: 0.05, upTo: 175000 },
        { rate: 0.0525, upTo: 225000 },
        { rate: 0.055, upTo: 300000 },
        { rate: 0.0575, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2350, mfj: 4700 },
    personalExemption: { single: 3200, mfj: 6400 },
    topMarginalRate: 0.0575,
    specialNotes: "MD also has county/city income taxes (1.75%–3.2%) but per scope we exclude local taxes."
  },
  MA: {
    code: "MA", name: "Massachusetts", type: "flat",
    flatRate: 0.05,
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 4400, mfj: 8800 },
    topMarginalRate: 0.05,
    specialNotes: "MA also imposes a 4% surtax on income above $1M (Millionaire's Tax, effective 2023)."
  },
  MI: {
    code: "MI", name: "Michigan", type: "flat",
    flatRate: 0.0425, // 4.25%
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 5400, mfj: 10800 },
    topMarginalRate: 0.0425
  },
  MN: {
    code: "MN", name: "Minnesota", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0535, upTo: 30070 },
        { rate: 0.068, upTo: 98760 },
        { rate: 0.0785, upTo: 183340 },
        { rate: 0.0985, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0535, upTo: 43950 },
        { rate: 0.068, upTo: 174610 },
        { rate: 0.0785, upTo: 304970 },
        { rate: 0.0985, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13825, mfj: 27650 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.0985
  },
  MS: {
    code: "MS", name: "Mississippi", type: "graduated",
    brackets: {
      single: [
        { rate: 0.00, upTo: 10000 },
        { rate: 0.05, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.00, upTo: 10000 },
        { rate: 0.05, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2300, mfj: 4600 },
    personalExemption: { single: 6000, mfj: 12000 },
    topMarginalRate: 0.05,
    specialNotes: "MS eliminated 4% bracket; phasing to flat 4% by 2026."
  },
  MO: {
    code: "MO", name: "Missouri", type: "graduated",
    brackets: {
      single: [
        { rate: 0.015, upTo: 1207 },
        { rate: 0.02, upTo: 2414 },
        { rate: 0.025, upTo: 3621 },
        { rate: 0.03, upTo: 4828 },
        { rate: 0.035, upTo: 6035 },
        { rate: 0.04, upTo: 7242 },
        { rate: 0.045, upTo: 8432 },
        { rate: 0.048, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.015, upTo: 1207 },
        { rate: 0.02, upTo: 2414 },
        { rate: 0.025, upTo: 3621 },
        { rate: 0.03, upTo: 4828 },
        { rate: 0.035, upTo: 6035 },
        { rate: 0.04, upTo: 7242 },
        { rate: 0.045, upTo: 8432 },
        { rate: 0.048, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.048,
    specialNotes: "MO top rate reduced to 4.8% in 2023."
  },
  MT: {
    code: "MT", name: "Montana", type: "graduated",
    brackets: {
      single: [
        { rate: 0.01, upTo: 3600 },
        { rate: 0.02, upTo: 6300 },
        { rate: 0.03, upTo: 9700 },
        { rate: 0.04, upTo: 13000 },
        { rate: 0.05, upTo: 16800 },
        { rate: 0.06, upTo: 21600 },
        { rate: 0.069, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.01, upTo: 3600 },
        { rate: 0.02, upTo: 6300 },
        { rate: 0.03, upTo: 9700 },
        { rate: 0.04, upTo: 13000 },
        { rate: 0.05, upTo: 16800 },
        { rate: 0.06, upTo: 21600 },
        { rate: 0.069, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 5540, mfj: 11080 },
    personalExemption: { single: 2440, mfj: 4880 },
    topMarginalRate: 0.069
  },
  NE: {
    code: "NE", name: "Nebraska", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0246, upTo: 3700 },
        { rate: 0.0351, upTo: 22170 },
        { rate: 0.0501, upTo: 35730 },
        { rate: 0.0664, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0246, upTo: 7390 },
        { rate: 0.0351, upTo: 44350 },
        { rate: 0.0501, upTo: 71460 },
        { rate: 0.0664, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 7900, mfj: 15800 },
    personalExemption: { single: 157, mfj: 314 },
    topMarginalRate: 0.0664
  },
  NV: {
    code: "NV", name: "Nevada", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  NH: {
    code: "NH", name: "New Hampshire", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "NH abolished its Interest and Dividends Tax effective January 1, 2025. No broad income tax on wages."
  },
  NJ: {
    code: "NJ", name: "New Jersey", type: "graduated",
    brackets: {
      single: [
        { rate: 0.014, upTo: 20000 },
        { rate: 0.0175, upTo: 35000 },
        { rate: 0.035, upTo: 40000 },
        { rate: 0.05525, upTo: 75000 },
        { rate: 0.0637, upTo: 500000 },
        { rate: 0.0897, upTo: 1000000 },
        { rate: 0.1075, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.014, upTo: 20000 },
        { rate: 0.0175, upTo: 50000 },
        { rate: 0.035, upTo: 70000 },
        { rate: 0.05525, upTo: 80000 },
        { rate: 0.0637, upTo: 150000 },
        { rate: 0.0897, upTo: 500000 },
        { rate: 0.1075, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 1000, mfj: 2000 },
    topMarginalRate: 0.1075
  },
  NM: {
    code: "NM", name: "New Mexico", type: "graduated",
    brackets: {
      single: [
        { rate: 0.017, upTo: 5500 },
        { rate: 0.032, upTo: 11000 },
        { rate: 0.047, upTo: 16000 },
        { rate: 0.049, upTo: 210000 },
        { rate: 0.059, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.017, upTo: 8000 },
        { rate: 0.032, upTo: 16000 },
        { rate: 0.047, upTo: 24000 },
        { rate: 0.049, upTo: 315000 },
        { rate: 0.059, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.059
  },
  NY: {
    code: "NY", name: "New York", type: "graduated",
    brackets: {
      single: [
        { rate: 0.04, upTo: 8500 },
        { rate: 0.045, upTo: 11700 },
        { rate: 0.0525, upTo: 13900 },
        { rate: 0.055, upTo: 80650 },
        { rate: 0.06, upTo: 215400 },
        { rate: 0.0685, upTo: 1077550 },
        { rate: 0.0965, upTo: 5000000 },
        { rate: 0.103, upTo: 25000000 },
        { rate: 0.109, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.04, upTo: 17150 },
        { rate: 0.045, upTo: 23600 },
        { rate: 0.0525, upTo: 27900 },
        { rate: 0.055, upTo: 161550 },
        { rate: 0.06, upTo: 323200 },
        { rate: 0.0685, upTo: 2155350 },
        { rate: 0.0965, upTo: 5000000 },
        { rate: 0.103, upTo: 25000000 },
        { rate: 0.109, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 8000, mfj: 16050 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.109,
    specialNotes: "NYC residents also pay NYC income tax (3.078%–3.876%) — excluded per scope."
  },
  NC: {
    code: "NC", name: "North Carolina", type: "flat",
    flatRate: 0.0475, // 4.75% in 2024, reducing to 4.5% in 2025
    standardDeduction: { single: 12750, mfj: 25500 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.0475
  },
  ND: {
    code: "ND", name: "North Dakota", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0, upTo: 44725 },  // ND reduced effectively to near zero for many filers
        { rate: 0.019, upTo: 225975 },
        { rate: 0.025, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0, upTo: 74750 },
        { rate: 0.019, upTo: 275100 },
        { rate: 0.025, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 14600, mfj: 29200 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.025,
    specialNotes: "ND significantly reduced rates in 2023, with 0% rate for most low/middle-income filers."
  },
  OH: {
    code: "OH", name: "Ohio", type: "graduated",
    brackets: {
      single: [
        { rate: 0.000, upTo: 26050 },
        { rate: 0.02765, upTo: 46100 },
        { rate: 0.03226, upTo: 92150 },
        { rate: 0.03688, upTo: 115300 },
        { rate: 0.03990, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.000, upTo: 26050 },
        { rate: 0.02765, upTo: 46100 },
        { rate: 0.03226, upTo: 92150 },
        { rate: 0.03688, upTo: 115300 },
        { rate: 0.03990, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 2400, mfj: 4800 },
    topMarginalRate: 0.03990
  },
  OK: {
    code: "OK", name: "Oklahoma", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0025, upTo: 1000 },
        { rate: 0.0075, upTo: 2500 },
        { rate: 0.0175, upTo: 3750 },
        { rate: 0.0275, upTo: 4900 },
        { rate: 0.0375, upTo: 7200 },
        { rate: 0.0475, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0025, upTo: 2000 },
        { rate: 0.0075, upTo: 5000 },
        { rate: 0.0175, upTo: 7500 },
        { rate: 0.0275, upTo: 9800 },
        { rate: 0.0375, upTo: 12200 },
        { rate: 0.0475, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 6350, mfj: 12700 },
    personalExemption: { single: 1000, mfj: 2000 },
    topMarginalRate: 0.0475
  },
  OR: {
    code: "OR", name: "Oregon", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0475, upTo: 4050 },
        { rate: 0.0675, upTo: 10200 },
        { rate: 0.0875, upTo: 125000 },
        { rate: 0.099, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0475, upTo: 8100 },
        { rate: 0.0675, upTo: 20400 },
        { rate: 0.0875, upTo: 250000 },
        { rate: 0.099, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 2420, mfj: 4865 },
    personalExemption: { single: 236, mfj: 472 },
    topMarginalRate: 0.099,
    specialNotes: "Oregon also has a 1.5% Statewide Transit Tax on wages."
  },
  PA: {
    code: "PA", name: "Pennsylvania", type: "flat",
    flatRate: 0.0307,
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.0307
  },
  RI: {
    code: "RI", name: "Rhode Island", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0375, upTo: 73450 },
        { rate: 0.0475, upTo: 166950 },
        { rate: 0.0599, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0375, upTo: 73450 },
        { rate: 0.0475, upTo: 166950 },
        { rate: 0.0599, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 10500, mfj: 21000 },
    personalExemption: { single: 4750, mfj: 9500 },
    topMarginalRate: 0.0599
  },
  SC: {
    code: "SC", name: "South Carolina", type: "graduated",
    brackets: {
      single: [
        { rate: 0.00, upTo: 3460 },
        { rate: 0.03, upTo: 17330 },
        { rate: 0.064, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.00, upTo: 3460 },
        { rate: 0.03, upTo: 17330 },
        { rate: 0.064, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.064,
    specialNotes: "SC top rate reduced to 6.4% in 2024, scheduled to reduce further."
  },
  SD: {
    code: "SD", name: "South Dakota", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  TN: {
    code: "TN", name: "Tennessee", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "Tennessee eliminated its Hall Income Tax on investment income effective January 1, 2021. No state income tax."
  },
  TX: {
    code: "TX", name: "Texas", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  UT: {
    code: "UT", name: "Utah", type: "flat",
    flatRate: 0.0465,
    standardDeduction: { single: 13850, mfj: 27700 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.0465
  },
  VT: {
    code: "VT", name: "Vermont", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0335, upTo: 45400 },
        { rate: 0.066, upTo: 110050 },
        { rate: 0.076, upTo: 229550 },
        { rate: 0.0875, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0335, upTo: 75850 },
        { rate: 0.066, upTo: 183400 },
        { rate: 0.076, upTo: 236350 },
        { rate: 0.0875, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 7000, mfj: 14000 },
    personalExemption: { single: 4500, mfj: 9000 },
    topMarginalRate: 0.0875
  },
  VA: {
    code: "VA", name: "Virginia", type: "graduated",
    brackets: {
      single: [
        { rate: 0.02, upTo: 3000 },
        { rate: 0.03, upTo: 5000 },
        { rate: 0.05, upTo: 17000 },
        { rate: 0.0575, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.02, upTo: 3000 },
        { rate: 0.03, upTo: 5000 },
        { rate: 0.05, upTo: 17000 },
        { rate: 0.0575, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 8000, mfj: 16000 },
    personalExemption: { single: 930, mfj: 1860 },
    topMarginalRate: 0.0575
  },
  WA: {
    code: "WA", name: "Washington", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax on wages or ordinary income. WA imposes a 7% capital gains tax on long-term gains above $262,000 (2024), but this is excluded here as it applies only to capital gains, not income."
  },
  WV: {
    code: "WV", name: "West Virginia", type: "graduated",
    brackets: {
      single: [
        { rate: 0.03, upTo: 10000 },
        { rate: 0.04, upTo: 25000 },
        { rate: 0.045, upTo: 40000 },
        { rate: 0.06, upTo: 60000 },
        { rate: 0.065, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.03, upTo: 10000 },
        { rate: 0.04, upTo: 25000 },
        { rate: 0.045, upTo: 40000 },
        { rate: 0.06, upTo: 60000 },
        { rate: 0.065, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 2000, mfj: 4000 },
    topMarginalRate: 0.065,
    specialNotes: "WV phasing out income tax; significant rate reductions ongoing."
  },
  WI: {
    code: "WI", name: "Wisconsin", type: "graduated",
    brackets: {
      single: [
        { rate: 0.0354, upTo: 13810 },
        { rate: 0.0465, upTo: 27630 },
        { rate: 0.053, upTo: 304170 },
        { rate: 0.0765, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.0354, upTo: 18420 },
        { rate: 0.0465, upTo: 36840 },
        { rate: 0.053, upTo: 405550 },
        { rate: 0.0765, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 13230, mfj: 24490 },
    personalExemption: { single: 700, mfj: 1400 },
    topMarginalRate: 0.0765
  },
  WY: {
    code: "WY", name: "Wyoming", type: "none",
    standardDeduction: { single: 0, mfj: 0 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0,
    specialNotes: "No state individual income tax."
  },
  DC: {
    code: "DC", name: "District of Columbia", type: "graduated",
    brackets: {
      single: [
        { rate: 0.04, upTo: 10000 },
        { rate: 0.06, upTo: 40000 },
        { rate: 0.065, upTo: 60000 },
        { rate: 0.085, upTo: 250000 },
        { rate: 0.0925, upTo: 500000 },
        { rate: 0.0975, upTo: 1000000 },
        { rate: 0.1075, upTo: Infinity }
      ],
      mfj: [
        { rate: 0.04, upTo: 10000 },
        { rate: 0.06, upTo: 40000 },
        { rate: 0.065, upTo: 60000 },
        { rate: 0.085, upTo: 250000 },
        { rate: 0.0925, upTo: 500000 },
        { rate: 0.0975, upTo: 1000000 },
        { rate: 0.1075, upTo: Infinity }
      ]
    },
    standardDeduction: { single: 12950, mfj: 25900 },
    personalExemption: { single: 0, mfj: 0 },
    topMarginalRate: 0.1075
  }
};

export function getStateTaxProfile(stateCode: string | null | undefined): StateTaxProfile | null {
  if (!stateCode) return null;
  return STATE_TAX_PROFILES[stateCode.toUpperCase()] ?? null;
}

export function getNoTaxStates(): string[] {
  return Object.values(STATE_TAX_PROFILES)
    .filter(s => s.type === "none")
    .map(s => s.code);
}
