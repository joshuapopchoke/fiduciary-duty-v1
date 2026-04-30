import type { InsiderInfoEvent, PlayerTradeStatus } from "../types/gameState";
import type { Ticker } from "../types/market";

type InsiderDecision = "trade" | "avoid";

interface InsiderTemplate {
  title: string;
  summary: string;
  prompt: string;
  legalToTrade: boolean;
  severity: InsiderInfoEvent["severity"];
}

export interface PlayerComplianceResolution {
  complianceDelta: number;
  fineUsd: number;
  nextStatus: PlayerTradeStatus;
  nextViolationCount: number;
  suspensionRounds: number;
  gameOver: boolean;
  gameOverReason: string | null;
  feedback: string;
}

const LEGAL_TEMPLATES: InsiderTemplate[] = [
  {
    title: "Public Analyst Upgrade",
    summary: "A major sell-side bank published a broad upgrade before the open after management spoke on a public webcast.",
    prompt: "The information is public and broadly disseminated. Do you trade on it?",
    legalToTrade: true,
    severity: "LOW"
  },
  {
    title: "SEC Filing Release",
    summary: "The issuer filed an 8-K with the SEC and the market is digesting the new guidance.",
    prompt: "The disclosure is public. Trading on public information is permitted. Do you take the trade?",
    legalToTrade: true,
    severity: "LOW"
  },
  {
    title: "Press Conference Guidance",
    summary: "Management updated guidance live during a televised investor conference carried to the whole market.",
    prompt: "This was publicly announced to everyone at the same time. Do you trade?",
    legalToTrade: true,
    severity: "MEDIUM"
  }
];

const ILLEGAL_TEMPLATES: InsiderTemplate[] = [
  {
    title: "Boardroom Leak",
    summary: "A friend on the board quietly tells you the company will be acquired before the deal is announced.",
    prompt: "The information is material and nonpublic. Do you trade on it?",
    legalToTrade: false,
    severity: "HIGH"
  },
  {
    title: "Confidential Earnings Draft",
    summary: "A family member in finance shows you an unreleased earnings draft indicating a major miss.",
    prompt: "The information is not yet public and would likely move the price. Do you trade?",
    legalToTrade: false,
    severity: "HIGH"
  },
  {
    title: "Private Fund Allocation Tip",
    summary: "A private placement agent tells you a fund is about to report a surprise redemption gate before clients hear about it.",
    prompt: "The information is nonpublic and commercially sensitive. Do you trade anyway?",
    legalToTrade: false,
    severity: "MEDIUM"
  },
  {
    title: "Compliance Wall Breach",
    summary: "Someone in investment banking hints that a financing announcement is coming after market close.",
    prompt: "The tip came from behind an information barrier. Do you act on it?",
    legalToTrade: false,
    severity: "HIGH"
  }
];

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function candidateSymbols(tickers: Record<string, Ticker>) {
  return Object.values(tickers).filter((ticker) => ticker.category === "stocks" || ticker.category === "funds");
}

export function createInsiderInfoEvent(tickers: Record<string, Ticker>): InsiderInfoEvent | null {
  const symbols = candidateSymbols(tickers);

  if (symbols.length === 0) {
    return null;
  }

  const ticker = randomItem(symbols);
  const templatePool = Math.random() < 0.45 ? LEGAL_TEMPLATES : ILLEGAL_TEMPLATES;
  const template = randomItem(templatePool);

  return {
    id: `${ticker.symbol}-${Date.now()}`,
    symbol: ticker.symbol,
    title: template.title,
    summary: `${template.summary} Security in focus: ${ticker.symbol} (${ticker.name}).`,
    prompt: template.prompt,
    legalToTrade: template.legalToTrade,
    severity: template.severity
  };
}

export function evaluateInsiderDecision(
  event: InsiderInfoEvent,
  decision: InsiderDecision,
  currentViolationCount: number
): PlayerComplianceResolution {
  if (event.legalToTrade) {
    return {
      complianceDelta: 0,
      fineUsd: 0,
      nextStatus: currentViolationCount > 0 ? "fined" : "clear",
      nextViolationCount: currentViolationCount,
      suspensionRounds: 0,
      gameOver: false,
      gameOverReason: null,
      feedback:
        decision === "trade"
          ? "You traded on public information. That is permitted because the market had equal access to the information."
          : "You stood down even though the information was public. Conservative, but not a compliance breach."
    };
  }

  if (decision === "avoid") {
    return {
      complianceDelta: -5,
      fineUsd: 0,
      nextStatus: currentViolationCount > 0 ? "fined" : "clear",
      nextViolationCount: currentViolationCount,
      suspensionRounds: 0,
      gameOver: false,
      gameOverReason: null,
      feedback: "Correct. The information was material and nonpublic, so refusing to trade avoided an insider-trading violation."
    };
  }

  const severityFine = {
    LOW: 25000,
    MEDIUM: 50000,
    HIGH: 100000
  } as const;

  const severityCompliance = {
    LOW: 20,
    MEDIUM: 35,
    HIGH: 50
  } as const;

  const nextViolationCount = currentViolationCount + 1;

  if (nextViolationCount >= 3) {
    return {
      complianceDelta: severityCompliance[event.severity],
      fineUsd: severityFine[event.severity],
      nextStatus: "incarcerated",
      nextViolationCount,
      suspensionRounds: 0,
      gameOver: true,
      gameOverReason: "Prison sentence for repeated insider trading violations.",
      feedback: "You traded on material nonpublic information again. Regulators escalated from fines and suspension to criminal prosecution."
    };
  }

  if (nextViolationCount === 2) {
    return {
      complianceDelta: severityCompliance[event.severity],
      fineUsd: severityFine[event.severity],
      nextStatus: "suspended",
      nextViolationCount,
      suspensionRounds: 2,
      gameOver: false,
      gameOverReason: null,
      feedback: "You traded on material nonpublic information. Your personal account is now suspended for two market cycles."
    };
  }

  return {
    complianceDelta: severityCompliance[event.severity],
    fineUsd: severityFine[event.severity],
    nextStatus: "fined",
    nextViolationCount,
    suspensionRounds: 0,
    gameOver: false,
    gameOverReason: null,
    feedback: "You traded on material nonpublic information and were fined. Another violation will trigger harsher penalties."
  };
}
