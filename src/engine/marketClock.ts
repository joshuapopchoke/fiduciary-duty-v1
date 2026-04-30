const MARKET_OPEN_HOUR = 8;
const MARKET_OPEN_MINUTE = 30;
const MARKET_CLOSE_HOUR = 16;
const MARKET_CLOSE_MINUTE = 30;
const MARKET_STEP_MINUTES = 30;
const MARKET_DAY_MINUTES = (MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE) - (MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE);
const MARKET_STEP_COUNT = MARKET_DAY_MINUTES / MARKET_STEP_MINUTES;

function atMarketOpen(date: Date) {
  const next = new Date(date);
  next.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0);
  return next;
}

export function createInitialMarketDate() {
  return "2026-01-05";
}

export function parseMarketDate(isoDate: string) {
  return atMarketOpen(new Date(`${isoDate}T00:00:00`));
}

export function advanceTradingDate(isoDate: string) {
  const next = parseMarketDate(isoDate);
  do {
    next.setDate(next.getDate() + 1);
  } while (next.getDay() === 0 || next.getDay() === 6);

  return next.toISOString().slice(0, 10);
}

export function deriveMarketDateTime(isoDate: string, timerSeconds: number, cycleLengthSeconds: number) {
  const base = parseMarketDate(isoDate);
  const stepIndex = deriveMarketStepIndex(timerSeconds, cycleLengthSeconds);
  base.setMinutes(base.getMinutes() + stepIndex * MARKET_STEP_MINUTES);
  return base;
}

export function deriveMarketStepIndex(timerSeconds: number, cycleLengthSeconds: number) {
  if (cycleLengthSeconds <= 0) {
    return 0;
  }

  const elapsedSeconds = Math.max(0, cycleLengthSeconds - timerSeconds);
  const stepSize = cycleLengthSeconds / MARKET_STEP_COUNT;
  return Math.max(0, Math.min(MARKET_STEP_COUNT, Math.floor(elapsedSeconds / stepSize)));
}

export function hasAdvancedMarketStep(previousTimerSeconds: number, nextTimerSeconds: number, cycleLengthSeconds: number) {
  return deriveMarketStepIndex(nextTimerSeconds, cycleLengthSeconds) > deriveMarketStepIndex(previousTimerSeconds, cycleLengthSeconds);
}

export function describeMarketSession(date: Date) {
  const hour = date.getHours();

  if (hour <= 9) {
    return "Opening session";
  }

  if (hour >= 15) {
    return "Closing session";
  }

  return "Market session live";
}
