export interface InsuranceProduct {
  id: string;
  name: string;
  category: "Life" | "Disability" | "Liability" | "Care" | "Planning";
  pitch: string;
  growthAngle: string;
  bestFor: string;
  compareAgainst: string;
  caution: string;
}

export const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    id: "term-life",
    name: "Term Life Insurance",
    category: "Life",
    pitch: "Replaces income during peak family or debt years without crowding out the investment plan.",
    growthAngle: "Protecting a household cash-flow base can preserve long-term investment compounding because assets do not need to be liquidated after a shock.",
    bestFor: "Working households, young families, and debt-heavy years where income replacement matters most.",
    compareAgainst: "Whole life when the goal is pure protection instead of estate or permanent-liquidity planning.",
    caution: "The value fades when the client really needs permanent estate planning instead of temporary income protection."
  },
  {
    id: "whole-life",
    name: "Whole Life Insurance",
    category: "Life",
    pitch: "Permanent coverage with a cash-value component for estate or liquidity planning cases.",
    growthAngle: "It can support liquidity and estate planning, but the policy only helps when the use case is specific and the funding burden fits the plan.",
    bestFor: "Estate-liquidity cases, permanent protection needs, and clients with a clear long-duration planning use case.",
    compareAgainst: "Term life when the client mainly needs efficient income replacement instead of permanent coverage.",
    caution: "It becomes a weak recommendation when the client just needs affordable protection and flexible cash flow."
  },
  {
    id: "disability",
    name: "Disability Insurance",
    category: "Disability",
    pitch: "Protects earned income when the client still depends on salary or business cash flow.",
    growthAngle: "Income protection can keep a savings plan intact during working years, which indirectly preserves the investing runway.",
    bestFor: "Working clients in their prime earning years, especially where salary or business income drives the whole plan.",
    compareAgainst: "Emergency reserves alone, which usually cannot replace years of lost earnings.",
    caution: "It is far less relevant when the client is already retired or no longer depends on active earned income."
  },
  {
    id: "long-term-care",
    name: "Long-Term Care Coverage",
    category: "Care",
    pitch: "Helps reduce the risk that care costs consume retirement and legacy assets.",
    growthAngle: "When appropriate, it can ring-fence part of the portfolio from a late-life care shock that would otherwise force withdrawals.",
    bestFor: "Older or higher-net-worth households where care costs could materially disrupt retirement or legacy goals.",
    compareAgainst: "Short-term disability or pure self-insuring, which solve a very different planning problem.",
    caution: "Pushing it too early for younger clients can feel mismatched if the core planning priorities are still income protection and accumulation."
  },
  {
    id: "umbrella",
    name: "Umbrella Liability Policy",
    category: "Liability",
    pitch: "Adds liability coverage above auto and homeowners limits for higher-net-worth households.",
    growthAngle: "It protects capital already built, which matters when the wealth plan is starting to compound and the client has more to lose.",
    bestFor: "Households or business owners whose growing assets create more liability exposure.",
    compareAgainst: "Basic auto/home limits that may no longer match the client’s net worth or risk profile.",
    caution: "The recommendation weakens when the client has little exposure or the discussion skips basic coverage review first."
  }
];
