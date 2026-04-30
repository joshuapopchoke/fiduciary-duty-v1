import type { ChartPeriod, InterestRateSnapshot } from "../types/gameState";
import type { Ticker } from "../types/market";

function seededValue(seedText: string, offset: number) {
  let total = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    total += seedText.charCodeAt(index) * (index + 1 + offset);
  }

  const wave = Math.sin(total + offset * 97) * 10000;
  return wave - Math.floor(wave);
}

function syntheticDayIndex(cycleNumber: number) {
  return Math.max(0, cycleNumber - 1);
}

function syntheticMonthIndex(cycleNumber: number) {
  return Math.floor(syntheticDayIndex(cycleNumber) / 20);
}

function syntheticCalendarLabel(cycleNumber: number) {
  const monthIndex = syntheticMonthIndex(cycleNumber);
  const dayOfMonth = (syntheticDayIndex(cycleNumber) % 20) + 1;
  return `M${monthIndex + 1} D${dayOfMonth}`;
}

export function buildInterestRateSnapshot(cycleNumber: number, period: ChartPeriod): InterestRateSnapshot {
  const dayIndex = syntheticDayIndex(cycleNumber);
  const monthIndex = syntheticMonthIndex(cycleNumber);
  const regimeBias = (seededValue("rates-regime", monthIndex) - 0.5) * 0.8;
  const dailyBias = (seededValue("rates-daily", dayIndex) - 0.5) * 0.18;
  const longEndSkew = (seededValue("rates-curve", monthIndex + 4) - 0.5) * 0.7;

  const currentFed = 4.55 + regimeBias + dailyBias * 0.35;
  const currentTwoYear = 4.18 + regimeBias * 0.85 + dailyBias * 0.5;
  const currentTenYear = 3.96 + regimeBias * 0.55 + longEndSkew + dailyBias * 0.2;
  const currentMortgage = 6.62 + regimeBias * 0.4 + Math.max(0, longEndSkew) * 0.8 + dailyBias * 0.35;
  const currentPrime = currentFed + 3;

  const periodLens = {
    current: { label: syntheticCalendarLabel(cycleNumber), scale: 1, offset: 0 },
    "1D": { label: "1-day lens", scale: 0.9, offset: 1 },
    "6M": { label: "6-month lens", scale: 0.75, offset: 12 },
    YTD: { label: "YTD lens", scale: 0.8, offset: 18 },
    "1Y": { label: "1-year lens", scale: 0.95, offset: 24 },
    "3Y": { label: "3-year lens", scale: 1.15, offset: 36 },
    "5Y": { label: "5-year lens", scale: 1.3, offset: 48 }
  } as const;

  const lens = periodLens[period];
  const periodDrift = (seededValue(`rates-${period}`, monthIndex + lens.offset) - 0.5) * lens.scale;
  const bpsMove = Math.round(periodDrift * 100);

  return {
    period,
    label: lens.label,
    fedFunds: Number((currentFed + periodDrift * 0.3).toFixed(2)),
    twoYearTreasury: Number((currentTwoYear + periodDrift * 0.45).toFixed(2)),
    tenYearTreasury: Number((currentTenYear + periodDrift * 0.25).toFixed(2)),
    mortgage30Year: Number((currentMortgage + periodDrift * 0.2).toFixed(2)),
    primeRate: Number((currentPrime + periodDrift * 0.3).toFixed(2)),
    periodChangeBps: bpsMove
  };
}

export function refreshCallableBondTerms(
  tickers: Record<string, Ticker>,
  cycleNumber: number
): Record<string, Ticker> {
  const monthIndex = syntheticMonthIndex(cycleNumber);

  return Object.fromEntries(
    Object.entries(tickers).map(([symbol, ticker]) => {
      if (!ticker.callable || (ticker.category !== "bonds" && ticker.category !== "fixedIncome")) {
        return [symbol, ticker];
      }

      const protectionWindowMonths = 1 + Math.floor(seededValue(`${symbol}-protection-window`, monthIndex) * 4);
      const protectedNow = seededValue(`${symbol}-call-flag`, monthIndex) > 0.36;
      const protectionLabel = protectedNow
        ? `Call protected through M${monthIndex + protectionWindowMonths}`
        : `Currently callable as of ${syntheticCalendarLabel(cycleNumber)}`;

      return [
        symbol,
        {
          ...ticker,
          callProtected: protectedNow,
          callProtectionLabel: protectionLabel
        }
      ];
    })
  );
}
