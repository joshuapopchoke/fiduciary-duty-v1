import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAccountTransferRequest } from "../data/accountTransferRequests";
import { CLIENTS } from "../data/clients";
import { getBehaviorScenario } from "../data/clientBehaviorEvents";
import { getClientMeetingScenario, getClientReviewMeetingScenario } from "../data/clientMeetings";
import { getInsuranceDialogue } from "../data/insuranceDialogues";
import { INSURANCE_PRODUCTS } from "../data/insuranceProducts";
import { MORTGAGE_TRAINING_SCENARIO_IDS } from "../data/mortgageTrainingScenarios";
import { TRAINING_MODULES } from "../data/trainingModules";
import { buildSupervisionRequest } from "../data/supervisionRequests";
import { advanceTradingDate, createInitialMarketDate, deriveMarketDateTime, hasAdvancedMarketStep, parseMarketDate } from "../engine/marketClock";
import { createMarketEngine } from "../engine/marketEngine";
import { getOperationsRequest, getOperationsRequestByKind } from "../data/operationsRequests";
import { betaRangeForRisk, calculatePortfolioBeta } from "../engine/portfolioAnalytics";
import { getRecommendationDialogue } from "../engine/recommendationEngine";
import { buildRevenueSnapshot } from "../engine/revenueEngine";
import { buildInterestRateSnapshot, refreshCallableBondTerms } from "../engine/rateEngine";
import { buildRetirementIncomeSnapshot } from "../engine/retirementIncomeEngine";
import { buildTaxManagementSnapshot } from "../engine/taxManagementEngine";
import { getAllocationExposure, getAllocationPolicy } from "../engine/allocationPolicyEngine";
import { updateAssignmentsFromReport } from "../engine/trainingCurriculumEngine";
import { buildTrainingPerformanceSummary } from "../engine/trainingScoreEngine";
import { createInsiderInfoEvent, evaluateInsiderDecision } from "../engine/playerComplianceEngine";
import { applyClientRebalance } from "../engine/rebalancingEngine";
import { applyScrutinyLevel, evaluateTradeSuitability, resolveAuditScrutiny } from "../engine/complianceEngine";
import {
  createQuestionTracker,
  markQuestionAsked,
  pickAuditQuestion,
  pickQuestion,
  recordQuestionOutcome,
  shuffleQuestion
} from "../engine/questionEngine";
import { getExamKeysForDifficulty, loadAuthoredQuestionBank } from "../engine/questionBank";
import type {
  ActiveQuestionState,
  AccountTransferRequestState,
  AppTab,
  ChartPeriod,
  ClientMeetingState,
  DocumentationPromptState,
  GameStateShape,
  OperationsWorkflowKind,
  OperationsRequestState,
  PlayDifficulty,
  QuestionBankStatus,
  QuestionBankWarmStatus,
  RecommendationDialogueState,
  SaveSlotId,
  SaveSlotSummary,
  ModuleAssessmentCard,
  TrainingAssignment,
  TrainingSessionReport,
  SupervisionRequestState,
  TraineeProfile,
  TradeFundingMode
} from "../types/gameState";
import type { ClientAccount, ClientAccountSleeve, ClientHolding, ClientStatus } from "../types/client";

const marketEngine = createMarketEngine();
const SAVE_SLOT_STORAGE_KEY = "fiduciary-duty-save-slots";
const SAVE_SLOT_IDS: SaveSlotId[] = ["slot-1", "slot-2", "slot-3", "slot-4", "slot-5", "slot-6"];
const STARTING_PERSONAL_PORTFOLIO_USD = 100000;
const DEFAULT_TRAINEE_ID = "trainee-primary";
const PLAYER_BOOK_ID = "player";
const PLAYER_TAXABLE_SLEEVE: ClientAccountSleeve = {
  id: "player-taxable",
  label: "Taxable Brokerage",
  registration: "Taxable Brokerage",
  taxTreatment: "Taxable capital gains and dividends",
  beneficiaryRequired: false
};
const PLAYER_OPTIONAL_SLEEVES: Record<"401k" | "traditional-ira" | "roth-ira", ClientAccountSleeve> = {
  "401k": {
    id: "player-401k",
    label: "401(k)",
    registration: "401(k)",
    taxTreatment: "Tax-deferred payroll retirement account",
    beneficiaryRequired: true
  },
  "traditional-ira": {
    id: "player-traditional-ira",
    label: "Traditional IRA",
    registration: "Traditional IRA",
    taxTreatment: "Tax-deferred retirement account",
    beneficiaryRequired: true
  },
  "roth-ira": {
    id: "player-roth-ira",
    label: "Roth IRA",
    registration: "Roth IRA",
    taxTreatment: "Tax-free qualified withdrawals",
    beneficiaryRequired: true
  }
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function cloneClients(): ClientAccount[] {
  return CLIENTS.map((client) => {
    const creditScoreDrift = Math.round((Math.random() - 0.5) * 34);
    const debtDriftMultiplier = 1 + (Math.random() - 0.5) * 0.16;
    const unpaidDrift = Math.max(0, Math.round(client.debtProfile.unpaidDebtBalance * (0.75 + Math.random() * 0.6)));
    const creditScore = clamp(client.creditProfile.score + creditScoreDrift, 580, 835);
    const scoreBand: ClientAccount["creditProfile"]["scoreBand"] =
      creditScore >= 780 ? "Excellent" :
      creditScore >= 740 ? "Very Good" :
      creditScore >= 670 ? "Good" :
      creditScore >= 580 ? "Fair" :
      "Poor";

    return {
      ...client,
      cash: client.startingAum,
      sleeveCashBalances: { ...client.sleeveCashBalances },
      holdings: {},
      shortHoldings: {},
      marginDebt: 0,
      marginCall: false,
      insuranceCoverage: [],
      insurancePressure: 0,
      insuranceGapScore: client.insuranceGapScore,
      status: "pending" as const,
      creditProfile: {
        ...client.creditProfile,
        score: creditScore,
        scoreBand,
        utilizationPct: clamp(Math.round(client.creditProfile.utilizationPct * (0.8 + Math.random() * 0.45)), 0, 95),
        recentInquiries: Math.max(0, client.creditProfile.recentInquiries + Math.round((Math.random() - 0.5) * 2)),
        unpaidCollections: client.creditProfile.unpaidCollections > 0 ? Math.max(0, client.creditProfile.unpaidCollections + Math.round((Math.random() - 0.5) * 2)) : 0,
        trend: creditScoreDrift > 10 ? "Improving" : creditScoreDrift < -10 ? "Pressured" : "Stable"
      },
      debtProfile: {
        ...client.debtProfile,
        mortgageBalance: Number((client.debtProfile.mortgageBalance * debtDriftMultiplier).toFixed(0)),
        propertyValue: Number((client.debtProfile.propertyValue * (0.96 + Math.random() * 0.1)).toFixed(0)),
        housingPayment: Number((client.debtProfile.housingPayment * (0.94 + Math.random() * 0.12)).toFixed(0)),
        creditCardBalance: Number((client.debtProfile.creditCardBalance * (0.7 + Math.random() * 0.7)).toFixed(0)),
        autoLoanBalance: Number((client.debtProfile.autoLoanBalance * (0.82 + Math.random() * 0.24)).toFixed(0)),
        studentLoanBalance: Number((client.debtProfile.studentLoanBalance * (0.9 + Math.random() * 0.14)).toFixed(0)),
        helocBalance: Number((client.debtProfile.helocBalance * (0.75 + Math.random() * 0.35)).toFixed(0)),
        unsecuredDebt: Number((client.debtProfile.unsecuredDebt * (0.7 + Math.random() * 0.7)).toFixed(0)),
        unpaidDebtBalance: unpaidDrift
      },
      lendingProfile: {
        ...client.lendingProfile,
        recentLatePayments: client.lendingProfile.recentLatePayments + (unpaidDrift > 0 && Math.random() < 0.45 ? 1 : 0)
      }
    };
  });
}

function createDefaultPersonalAccountSleeves() {
  return [{ ...PLAYER_TAXABLE_SLEEVE }];
}

function createDefaultTrainees(): TraineeProfile[] {
  return [
    {
      id: DEFAULT_TRAINEE_ID,
      name: "Primary Trainee",
      role: "Trainee",
      createdAt: Date.now()
    }
  ];
}

function createDefaultTrainingAssignments(): TrainingAssignment[] {
  return [];
}

function pickRandomMortgageRate() {
  const rawRate = 0.055 + Math.random() * 0.03;
  return Number(rawRate.toFixed(4));
}

function pickRandomMortgageScenarioId() {
  const scenarioIndex = Math.floor(Math.random() * MORTGAGE_TRAINING_SCENARIO_IDS.length);
  return MORTGAGE_TRAINING_SCENARIO_IDS[scenarioIndex] ?? MORTGAGE_TRAINING_SCENARIO_IDS[0];
}

function buildSessionReportKey(cycleNumber: number, difficulty: PlayDifficulty, traineeId: string) {
  return `${traineeId}::${difficulty}::${cycleNumber}`;
}

function createDefaultPersonalSleeveCashBalances(totalCash = STARTING_PERSONAL_PORTFOLIO_USD) {
  return {
    [PLAYER_TAXABLE_SLEEVE.id]: Number(totalCash.toFixed(2))
  };
}

function normalizePersonalSleeveCashBalances(
  sleeves: ClientAccountSleeve[],
  balances: Record<string, number> | undefined,
  totalCash: number
) {
  const nextBalances = Object.fromEntries(
    sleeves.map((sleeve) => [sleeve.id, Number((balances?.[sleeve.id] ?? 0).toFixed(2))])
  ) as Record<string, number>;
  const currentTotal = sumSleeveCashBalances(nextBalances);
  const difference = Number((Number(totalCash.toFixed(2)) - currentTotal).toFixed(2));
  if (Math.abs(difference) > 0.009) {
    const primarySleeveId = sleeves[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id;
    nextBalances[primarySleeveId] = Number(((nextBalances[primarySleeveId] ?? 0) + difference).toFixed(2));
  }
  return nextBalances;
}

function personalPrimarySleeveId(sleeves: ClientAccountSleeve[]) {
  return sleeves[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id;
}

function sumSleeveCashBalances(balances: Record<string, number>) {
  return Number(Object.values(balances).reduce((total, value) => total + value, 0).toFixed(2));
}

function normalizeSleeveCashBalances(
  client: Pick<ClientAccount, "accountSleeves" | "startingAum" | "cash">,
  balances: Record<string, number> | undefined,
  fallbackBalances?: Record<string, number>
) {
  const template = fallbackBalances ?? {};
  const nextBalances = Object.fromEntries(
    client.accountSleeves.map((sleeve) => [
      sleeve.id,
      Number((balances?.[sleeve.id] ?? template[sleeve.id] ?? 0).toFixed(2))
    ])
  ) as Record<string, number>;

  const currentTotal = sumSleeveCashBalances(nextBalances);
  const fallbackTotal = sumSleeveCashBalances(template);
  const desiredTotal =
    currentTotal > 0 ? currentTotal :
    fallbackTotal > 0 ? fallbackTotal :
    Number((client.cash || client.startingAum).toFixed(2));

  const difference = Number((desiredTotal - currentTotal).toFixed(2));
  if (Math.abs(difference) > 0.009 && client.accountSleeves[0]) {
    const primarySleeveId = client.accountSleeves[0].id;
    nextBalances[primarySleeveId] = Number(((nextBalances[primarySleeveId] ?? 0) + difference).toFixed(2));
  }

  return nextBalances;
}

function clientPrimarySleeveId(client: ClientAccount) {
  return client.accountSleeves[0]?.id ?? "primary";
}

function getSleeveCashBalance(client: ClientAccount, sleeveId: string) {
  return client.sleeveCashBalances[sleeveId] ?? 0;
}

function setSleeveCashBalance(client: ClientAccount, sleeveId: string, value: number) {
  const sleeveCashBalances = {
    ...client.sleeveCashBalances,
    [sleeveId]: Number(Math.max(0, value).toFixed(2))
  };

  return {
    ...client,
    sleeveCashBalances,
    cash: sumSleeveCashBalances(sleeveCashBalances)
  };
}

function adjustSleeveCashBalance(client: ClientAccount, sleeveId: string, delta: number) {
  return setSleeveCashBalance(client, sleeveId, getSleeveCashBalance(client, sleeveId) + delta);
}

function findPositionKeyForSleeve(
  holdings: Record<string, ClientHolding>,
  accountMap: Record<string, string>,
  ticker: string,
  sleeveId: string
) {
  return Object.entries(holdings).find(([holdingKey, holding]) =>
    holding.ticker === ticker && (accountMap[holdingKey] ?? "") === sleeveId
  )?.[0] ?? null;
}

function createPositionKey(
  holdings: Record<string, ClientHolding>,
  ticker: string,
  sleeveId: string
) {
  const baseKey = `${ticker}::${sleeveId}`;
  if (!holdings[baseKey]) {
    return baseKey;
  }

  let suffix = 2;
  while (holdings[`${baseKey}::${suffix}`]) {
    suffix += 1;
  }

  return `${baseKey}::${suffix}`;
}

function inferSleeveIdFromPositionKey(positionKey: string, ticker: string) {
  if (!positionKey.startsWith(`${ticker}::`)) {
    return null;
  }

  const suffix = positionKey.slice(ticker.length + 2);
  const parts = suffix.split("::");
  if (parts.length === 0) {
    return null;
  }

  const maybeSequence = parts[parts.length - 1];
  return /^\d+$/.test(maybeSequence) ? parts.slice(0, -1).join("::") : parts.join("::");
}

function normalizePositionAccountMap(
  holdings: Record<string, ClientHolding>,
  accountMap: Record<string, string> | undefined,
  primarySleeveId: string
) {
  const nextMap = { ...(accountMap ?? {}) };

  Object.entries(holdings).forEach(([holdingKey, holding]) => {
    if (nextMap[holdingKey]) {
      return;
    }

    const inferredSleeveId =
      inferSleeveIdFromPositionKey(holdingKey, holding.ticker) ??
      nextMap[holding.ticker] ??
      primarySleeveId;

    nextMap[holdingKey] = inferredSleeveId;
  });

  return nextMap;
}

function transferBetweenSleeves(client: ClientAccount, fromSleeveId: string, toSleeveId: string, amount: number) {
  const transferAmount = Math.max(0, Number(amount.toFixed(2)));
  const available = getSleeveCashBalance(client, fromSleeveId);
  const movedAmount = Math.min(available, transferAmount);

  if (movedAmount <= 0) {
    return {
      client,
      movedAmount: 0
    };
  }

  const nextBalances = {
    ...client.sleeveCashBalances,
    [fromSleeveId]: Number((available - movedAmount).toFixed(2)),
    [toSleeveId]: Number((getSleeveCashBalance(client, toSleeveId) + movedAmount).toFixed(2))
  };

  return {
    client: {
      ...client,
      sleeveCashBalances: nextBalances,
      cash: sumSleeveCashBalances(nextBalances)
    },
    movedAmount
  };
}

function findSleeveByRegistrationKeyword(client: ClientAccount, keyword: string) {
  return client.accountSleeves.find((sleeve) => sleeve.registration.toLowerCase().includes(keyword.toLowerCase())) ?? null;
}

function buildClientTradeMemo(
  client: ClientAccount,
  ticker: string,
  direction: "buy" | "sell",
  quantity: number,
  accountId: string,
  mode: TradeFundingMode,
  suitable: boolean,
  assetName: string
) {
  const sleeveLabel = client.accountSleeves.find((sleeve) => sleeve.id === accountId)?.label ?? "selected sleeve";
  return `${direction === "buy" ? "Recommended purchase" : "Recommended sale"} of ${quantity} ${ticker} (${assetName}) in ${sleeveLabel}${mode === "margin" ? " using margin" : ""}. ${suitable ? "Trade aligned with the current planning objective and account role." : "Trade requires corrective suitability review before it becomes a standing recommendation."}`;
}

function emptyQuestionState(): ActiveQuestionState {
  return {
    question: null,
    shuffledOptions: [],
    displayCorrectIndex: -1,
    selectedIndex: null,
    answered: false
  };
}

function emptyComplianceStats() {
  return {
    suitabilityViolations: 0,
    riskOverrides: 0,
    unsuitableProductPlacements: 0,
    concentrationFlags: 0
  };
}

function computeLongValue(holdings: Record<string, ClientHolding>, tickers: GameState["tickers"]) {
  return Object.values(holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
}

function computeShortValue(holdings: Record<string, ClientHolding>, tickers: GameState["tickers"]) {
  return Object.values(holdings).reduce((total, holding) => total + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
}

function computeMarginEquity(cash: number, longValue: number, shortValue: number, marginDebt: number) {
  return cash + longValue - shortValue - marginDebt;
}

function getMaintenanceRequirement(difficulty: PlayDifficulty) {
  return difficulty === "senior" ? 0.35 : 0.3;
}

function isMarginDifficulty(difficulty: PlayDifficulty) {
  return difficulty === "advisor" || difficulty === "senior";
}

function allowsShortSelling(difficulty: PlayDifficulty) {
  return difficulty === "senior";
}

function isMarginableTicker(category: string) {
  return category === "stocks" || category === "funds";
}

function computeCurrentExposure(
  holdings: Record<string, ClientHolding>,
  shortHoldings: Record<string, ClientHolding>,
  tickers: GameState["tickers"]
) {
  return computeLongValue(holdings, tickers) + computeShortValue(shortHoldings, tickers);
}

function computeAvailableMarginExposure(
  cash: number,
  holdings: Record<string, ClientHolding>,
  shortHoldings: Record<string, ClientHolding>,
  marginDebt: number,
  tickers: GameState["tickers"]
) {
  const longValue = computeLongValue(holdings, tickers);
  const shortValue = computeShortValue(shortHoldings, tickers);
  const equity = computeMarginEquity(cash, longValue, shortValue, marginDebt);
  const currentExposure = longValue + shortValue;
  const maxExposure = Math.max(0, equity / 0.5);
  return Math.max(0, maxExposure - currentExposure);
}

function computeClientAum(client: ClientAccount, tickers: GameState["tickers"]) {
  const longValue = computeLongValue(client.holdings, tickers);
  const shortValue = computeShortValue(client.shortHoldings ?? {}, tickers);
  return computeMarginEquity(client.cash, longValue, shortValue, client.marginDebt ?? 0);
}

function computeTotalAum(clients: ClientAccount[], tickers: GameState["tickers"]) {
  return clients.reduce((total, client) => total + computeClientAum(client, tickers), 0);
}

function computePortfolioBetaForAccount(
  holdings: Record<string, ClientHolding>,
  shortHoldings: Record<string, ClientHolding>,
  tickers: GameState["tickers"]
) {
  return calculatePortfolioBeta(holdings, shortHoldings, tickers);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function liquidityReserveRatio(client: ClientAccount) {
  const monthlyNeed = Math.max(1, client.cashFlow.monthlyExpenses + client.cashFlow.monthlyDebtPayments);
  return client.cash / monthlyNeed;
}

function liquidityReserveTarget(client: ClientAccount) {
  return client.cashFlow.emergencyReserveMonths;
}

function buildMandateSnapshot(client: ClientAccount, tickers: GameState["tickers"]) {
  const holdings = Object.values(client.holdings);
  const portfolioBeta = computePortfolioBetaForAccount(client.holdings, client.shortHoldings ?? {}, tickers);
  const betaRange = betaRangeForRisk(client.riskProfile);
  const allocationPolicy = getAllocationPolicy(client);
  const retirementSnapshot = buildRetirementIncomeSnapshot(client, tickers);
  const betaPenalty =
    portfolioBeta > betaRange.max ? Math.min(18, (portfolioBeta - betaRange.max) * 22) :
    portfolioBeta > 0 && portfolioBeta < betaRange.min ? Math.min(10, (betaRange.min - portfolioBeta) * 16) :
    0;
  const insurancePenalty = Math.max(0, client.insuranceGapScore - 25) * 0.2;
  const reserveRatio = liquidityReserveRatio(client);
  const reserveTarget = liquidityReserveTarget(client);
  const liquidityPenalty =
    client.cashFlow.nearTermLiquidityNeed === "High" && reserveRatio < reserveTarget
      ? Math.min(16, (reserveTarget - reserveRatio) * 1.4)
      : client.cashFlow.nearTermLiquidityNeed === "Moderate" && reserveRatio < reserveTarget * 0.75
        ? Math.min(10, (reserveTarget * 0.75 - reserveRatio) * 1.25)
        : 0;
  const retirementPenalty = retirementSnapshot.applicable ? retirementSnapshot.pressureScore * 0.18 : 0;

  if (holdings.length === 0) {
    return {
      score: 18,
      label: "Mandate building",
      note: `${client.name.split(" ")[0]} still needs an allocation plan that matches the stated objective and risk budget.`,
      alignedCategories: [] as string[]
    };
  }

  const totalValue = holdings.reduce((sum, holding) => sum + (tickers[holding.ticker]?.price ?? 0) * holding.shares, 0);
  const allocationExposure = getAllocationExposure(client.cash, client.holdings, tickers);
  const bucketWeights = holdings.reduce<Record<string, number>>((accumulator, holding) => {
    const ticker = tickers[holding.ticker];
    if (!ticker) {
      return accumulator;
    }
    const value = ticker.price * holding.shares;
    accumulator[ticker.category] = (accumulator[ticker.category] ?? 0) + value;
    if (ticker.sector) {
      accumulator[ticker.sector] = (accumulator[ticker.sector] ?? 0) + value;
    }
    return accumulator;
  }, {});

  const weight = (bucket: string) => totalValue === 0 ? 0 : ((bucketWeights[bucket] ?? 0) / totalValue) * 100;
  const alignedCategories = client.mandateTargets.filter((target) => weight(target) > 8);
  const targetScore = client.mandateTargets.reduce((score, target) => score + Math.min(weight(target), 35) * 0.9, 0);
  const watchoutPenalty = client.watchouts.reduce((score, target) => {
    if (["funds", "fixedIncome", "bonds", "commodities"].includes(target)) {
      return score;
    }
    return score + weight(target) * 1.1;
  }, 0);
  const allocationPenalty =
    allocationExposure.totalAum <= 0
      ? 0
      : allocationExposure.equityExposure > allocationPolicy.maxEquityPct
        ? Math.min(20, (allocationExposure.equityExposure - allocationPolicy.maxEquityPct) * 90)
        : allocationExposure.equityExposure < allocationPolicy.minEquityPct
          ? Math.min(14, (allocationPolicy.minEquityPct - allocationExposure.equityExposure) * 65)
          : 0;
  const diversificationBonus = holdings.length >= 3 ? Math.min(15, holdings.length * 2) : 0;
  const score = clamp(
    Math.round(18 + targetScore - watchoutPenalty + diversificationBonus - allocationPenalty - betaPenalty - insurancePenalty - liquidityPenalty - retirementPenalty),
    0,
    100
  );

  if (score >= 74) {
    return {
      score,
      label: "Mandate fit strong",
      note: `${client.name.split(" ")[0]} is seeing a portfolio mix that lines up with the stated goal, the ${client.investmentPolicy.equityRangeLabel ?? "current equity lane"}, and the current beta target.`,
      alignedCategories
    };
  }

  if (score >= 48) {
    return {
      score,
      label: "Mandate fit mixed",
      note: `${client.name.split(" ")[0]} has some on-target exposures, but the account still needs cleaner alignment on volatility, liquidity, or planning protection.`,
      alignedCategories
    };
  }

  return {
    score,
    label: "Mandate drifting",
    note: `${client.name.split(" ")[0]} is drifting away from the stated objective, with risk, liquidity, income-support, or planning gaps beginning to stand out.`,
    alignedCategories
  };
}

function updateClientNarrative(client: ClientAccount, tickers: GameState["tickers"], trustDelta: number, note: string, status?: ClientAccount["status"]) {
  const mandate = buildMandateSnapshot(client, tickers);
  const trustScore = clamp(client.trustScore + trustDelta, 0, 100);
  const nextStatus: ClientStatus = status ?? (trustScore < 38 || mandate.score < 40 ? "at-risk" : trustScore > 64 ? "satisfied" : client.status);
  return {
    ...client,
    trustScore,
    mandateScore: mandate.score,
    advisorNote: note || mandate.note,
    status: nextStatus
  };
}

function appendClientNote(client: ClientAccount, note: string) {
  const nextNotes = [note, ...(client.clientNotes ?? [])].slice(0, 6);
  return {
    ...client,
    clientNotes: nextNotes
  };
}

function buildDocumentationPrompt(clientId: string, title: string, context: string, suggestedNote: string): DocumentationPromptState {
  return {
    clientId,
    title,
    context,
    suggestedNote,
    noteText: suggestedNote
  };
}

function applyClientMeetingChoice(
  client: ClientAccount,
  meeting: ClientMeetingState,
  optionId: string,
  tickers: GameState["tickers"]
) {
  const option = meeting.options.find((entry) => entry.id === optionId);

  if (!option) {
    return client;
  }

  const nextClient = {
    ...client,
    cashFlow: {
      ...client.cashFlow,
      monthlyIncome: Math.max(0, client.cashFlow.monthlyIncome + (option.incomeDelta ?? 0)),
      monthlyExpenses: Math.max(0, client.cashFlow.monthlyExpenses + (option.expenseDelta ?? 0)),
      monthlyDebtPayments: Math.max(0, client.cashFlow.monthlyDebtPayments + (option.debtPaymentDelta ?? 0)),
      emergencyReserveMonths: Math.max(1, client.cashFlow.emergencyReserveMonths + (option.reserveMonthsDelta ?? 0)),
      nearTermLiquidityNeed: option.liquidityNeed ?? client.cashFlow.nearTermLiquidityNeed
    },
    insuranceGapScore: clamp(client.insuranceGapScore + (option.insuranceGapDelta ?? 0), 0, 100)
  };

  return updateClientNarrative(nextClient, tickers, option.trustDelta, option.outcome);
}

function remapSleeveAssignments(
  client: ClientAccount,
  fromSleeveId: string,
  toSleeveId: string
) {
  const nextHoldingMap = { ...(client.holdingAccountMap ?? {}) };
  const nextShortHoldingMap = { ...(client.shortHoldingAccountMap ?? {}) };
  let movedLongCount = 0;
  let movedShortCount = 0;

  Object.keys(client.holdings).forEach((ticker) => {
    const assignedSleeveId = nextHoldingMap[ticker] ?? client.accountSleeves[0]?.id ?? null;
    if (assignedSleeveId === fromSleeveId) {
      nextHoldingMap[ticker] = toSleeveId;
      movedLongCount += 1;
    }
  });

  Object.keys(client.shortHoldings ?? {}).forEach((ticker) => {
    const assignedSleeveId = nextShortHoldingMap[ticker] ?? client.accountSleeves[0]?.id ?? null;
    if (assignedSleeveId === fromSleeveId) {
      nextShortHoldingMap[ticker] = toSleeveId;
      movedShortCount += 1;
    }
  });

  const nextSleeveCashBalances = { ...client.sleeveCashBalances };
  const transferredCash = nextSleeveCashBalances[fromSleeveId] ?? 0;
  nextSleeveCashBalances[fromSleeveId] = 0;
  nextSleeveCashBalances[toSleeveId] = Number(((nextSleeveCashBalances[toSleeveId] ?? 0) + transferredCash).toFixed(2));

  return {
    client: {
      ...client,
      sleeveCashBalances: nextSleeveCashBalances,
      cash: sumSleeveCashBalances(nextSleeveCashBalances),
      holdingAccountMap: nextHoldingMap,
      shortHoldingAccountMap: nextShortHoldingMap
    },
    movedLongCount,
    movedShortCount
  };
}

function applyAccountTransferChoice(
  client: ClientAccount,
  request: AccountTransferRequestState,
  optionId: string,
  tickers: GameState["tickers"]
) {
  const option = request.options.find((entry) => entry.id === optionId);

  if (!option) {
    return {
      client,
      feedback: "The transfer request could not be matched to a valid action.",
      movedLongCount: 0,
      movedShortCount: 0
    };
  }

  if (option.fromSleeveId && option.toSleeveId) {
    const fromSleeve = client.accountSleeves.find((sleeve) => sleeve.id === option.fromSleeveId);
    const toSleeve = client.accountSleeves.find((sleeve) => sleeve.id === option.toSleeveId);

    if (fromSleeve && toSleeve) {
      const transferResult = remapSleeveAssignments(client, fromSleeve.id, toSleeve.id);
      const movedCount = transferResult.movedLongCount + transferResult.movedShortCount;
      const outcome =
        movedCount > 0
          ? `${option.outcome} ${movedCount} position${movedCount === 1 ? "" : "s"} moved from ${fromSleeve.label} to ${toSleeve.label}.`
          : `${option.outcome} No current positions were mapped in ${fromSleeve.label}, so the request was documented and the sleeve structure is now ready for future assets.`;

      return {
        client: updateClientNarrative(transferResult.client, tickers, option.trustDelta, outcome),
        feedback: outcome,
        movedLongCount: transferResult.movedLongCount,
        movedShortCount: transferResult.movedShortCount
      };
    }
  }

  return {
    client: updateClientNarrative(client, tickers, option.trustDelta, option.outcome),
    feedback: option.outcome,
    movedLongCount: 0,
    movedShortCount: 0
  };
}

function applyOperationsRequestChoice(
  client: ClientAccount,
  request: OperationsRequestState,
  optionId: string,
  tickers: GameState["tickers"]
) {
  const option = request.options.find((entry) => entry.id === optionId);

  if (!option) {
    return {
      client,
      feedback: "The service request could not be matched to a valid action.",
      movedAmount: 0
    };
  }

  let nextClient = client;
  let movedAmount = 0;
  let sleeveTransferLabel: string | null = null;

  if (option.fromSleeveId && option.toSleeveId && option.transferAmount) {
    const transferResult = transferBetweenSleeves(client, option.fromSleeveId, option.toSleeveId, option.transferAmount);
    nextClient = transferResult.client;
    movedAmount = transferResult.movedAmount;
    const fromLabel = client.accountSleeves.find((sleeve) => sleeve.id === option.fromSleeveId)?.label ?? option.fromSleeveId;
    const toLabel = client.accountSleeves.find((sleeve) => sleeve.id === option.toSleeveId)?.label ?? option.toSleeveId;
    sleeveTransferLabel = `${fromLabel} to ${toLabel}`;
  }

  if (option.cashDelta) {
    nextClient = setSleeveCashBalance(
      nextClient,
      clientPrimarySleeveId(nextClient),
      Math.max(0, nextClient.cash + option.cashDelta)
    );
  }

  nextClient = updateClientNarrative(nextClient, tickers, option.trustDelta, option.outcome);

  return {
    client: nextClient,
    feedback:
      movedAmount > 0 && sleeveTransferLabel
        ? `${option.outcome} ${formatCurrency(movedAmount)} moved from ${sleeveTransferLabel}.`
        : option.outcome,
    movedAmount
  };
}

function applySupervisionChoice(
  client: ClientAccount,
  request: SupervisionRequestState,
  optionId: string,
  tickers: GameState["tickers"]
) {
  const option = request.options.find((entry) => entry.id === optionId);

  if (!option) {
    return {
      client,
      feedback: "The supervisory review could not be matched to a valid action.",
      secDelta: 0
    };
  }

  return {
    client: updateClientNarrative(client, tickers, option.trustDelta, option.outcome),
    feedback: option.outcome,
    secDelta: option.secDelta
  };
}

function insuranceDifficultyTolerance(difficulty: PlayDifficulty) {
  switch (difficulty) {
    case "senior":
      return 0.85;
    case "advisor":
      return 0.95;
    case "associate":
      return 1;
    case "trainee":
      return 1.08;
    case "learner":
    default:
      return 1.15;
  }
}

function recommendInsuranceForClient(client: ClientAccount, insuranceId: string, tickers: GameState["tickers"], difficulty: PlayDifficulty) {
  const product = INSURANCE_PRODUCTS.find((entry) => entry.id === insuranceId);

  if (!product) {
    return client;
  }

  const alreadyCovered = client.insuranceCoverage.includes(insuranceId);
  const needsProduct = client.insuranceNeeds.includes(insuranceId);
  const pressureDelta = needsProduct ? 6 : 18;
  const nextPressure = clamp(client.insurancePressure + pressureDelta, 0, 100);
  const tolerance = 42 * insuranceDifficultyTolerance(difficulty);
  const tooPushy = nextPressure > tolerance;
  const trustDelta =
    alreadyCovered ? -3 :
    needsProduct && !tooPushy ? 6 :
    needsProduct && tooPushy ? -2 :
    -8;
  const nextCoverage = needsProduct && !alreadyCovered ? [...client.insuranceCoverage, insuranceId] : client.insuranceCoverage;
  const nextGap = clamp(
    client.insuranceGapScore + (needsProduct && !alreadyCovered ? -18 : 9),
    0,
    100
  );
  const note = alreadyCovered
    ? `${client.name.split(" ")[0]} already has ${product.name.toLowerCase()} in the plan and does not want the same recommendation repeated.`
    : needsProduct && !tooPushy
      ? `${client.name.split(" ")[0]} accepted the ${product.name.toLowerCase()} discussion because it fit the plan and protected long-term goals.`
      : needsProduct
        ? `${client.name.split(" ")[0]} agrees the coverage may matter, but the pitch felt too heavy-handed for the moment.`
        : `${client.name.split(" ")[0]} does not see ${product.name.toLowerCase()} as a need right now and is resisting the push.`;

  return updateClientNarrative(
    {
      ...client,
      insuranceCoverage: nextCoverage,
      insurancePressure: nextPressure,
      insuranceGapScore: nextGap,
      insuranceNote: `${product.name}: ${product.growthAngle}`
    },
    tickers,
    trustDelta,
    note,
    trustDelta >= 0 ? "satisfied" : client.status
  );
}

function deferInsuranceForClient(client: ClientAccount, insuranceId: string, tickers: GameState["tickers"]) {
  const product = INSURANCE_PRODUCTS.find((entry) => entry.id === insuranceId);

  if (!product) {
    return client;
  }

  const needsProduct = client.insuranceNeeds.includes(insuranceId);
  const trustDelta = needsProduct ? -4 : 1;
  const nextGap = clamp(client.insuranceGapScore + (needsProduct ? 8 : -2), 0, 100);
  const note = needsProduct
    ? `${client.name.split(" ")[0]} noticed that ${product.name.toLowerCase()} was deferred even though it still addresses a real planning gap.`
    : `${client.name.split(" ")[0]} appreciated that you did not force an unnecessary ${product.name.toLowerCase()} pitch.`;

  return updateClientNarrative(
    {
      ...client,
      insuranceGapScore: nextGap,
      insurancePressure: clamp(client.insurancePressure - 4, 0, 100)
    },
    tickers,
    trustDelta,
    note,
    trustDelta >= 0 ? "pending" : client.status
  );
}

function applySaleProceedsToDebt(cash: number, marginDebt: number, proceeds: number) {
  if (marginDebt <= 0) {
    return { cash: cash + proceeds, marginDebt };
  }

  const debtPaydown = Math.min(marginDebt, proceeds);
  return {
    cash: cash + Math.max(0, proceeds - debtPaydown),
    marginDebt: marginDebt - debtPaydown
  };
}

function accountMarginRatio(
  cash: number,
  holdings: Record<string, ClientHolding>,
  shortHoldings: Record<string, ClientHolding>,
  marginDebt: number,
  tickers: GameState["tickers"]
) {
  const longValue = computeLongValue(holdings, tickers);
  const shortValue = computeShortValue(shortHoldings, tickers);
  const exposure = longValue + shortValue;
  const equity = computeMarginEquity(cash, longValue, shortValue, marginDebt);

  return {
    longValue,
    shortValue,
    exposure,
    equity,
    ratio: exposure <= 0 ? 1 : equity / exposure
  };
}

function withMarginDecisionAdjustment(
  decision: ReturnType<typeof evaluateTradeSuitability>,
  client: ClientAccount,
  asset: GameState["tickers"][string],
  mode: TradeFundingMode,
  difficulty: PlayDifficulty,
  isShortSale: boolean
) {
  if (!isMarginDifficulty(difficulty) || mode !== "margin") {
    return decision;
  }

  const reasons = [...decision.reasons];
  const flags = [...decision.flags];
  let scrutinyDelta = decision.scrutinyDelta;

  if (client.riskProfile === "Conservative") {
    reasons.push("Unsuitable product placement: margin or leverage conflicts with this conservative account profile.");
    scrutinyDelta += 22;
    flags.push("unsuitable-product", "suitability", "risk-override");
  } else if (client.riskProfile === "Moderate" && (isShortSale || asset.category === "stocks")) {
    reasons.push("Risk tolerance override: leveraged equity exposure is elevated for this moderate-risk account.");
    scrutinyDelta += 14;
    flags.push("risk-override", "suitability");
  }

  if (isShortSale) {
    reasons.push("Suitability concern: short selling introduces borrowing and unlimited-loss risk that requires stronger client sophistication.");
    scrutinyDelta += client.riskProfile === "Aggressive" ? 8 : 16;
    flags.push("suitability", "risk-override");
  }

  return {
    suitable: reasons.length === 0,
    reasons,
    scrutinyDelta,
    flags: [...new Set(flags)]
  };
}

function resolveMarginPressureForClients(
  clients: ClientAccount[],
  tickers: GameState["tickers"],
  difficulty: PlayDifficulty
) {
  if (!isMarginDifficulty(difficulty)) {
    return { clients, alerts: [] as string[] };
  }

  const alerts: string[] = [];
  const nextClients = clients.map((client) => {
    const margin = accountMarginRatio(client.cash, client.holdings, client.shortHoldings ?? {}, client.marginDebt ?? 0, tickers);
    if (margin.exposure <= 0) {
      return { ...client, marginCall: false };
    }

    if (margin.ratio >= getMaintenanceRequirement(difficulty)) {
      return { ...client, marginCall: false };
    }

    if (!client.marginCall) {
      alerts.push(`${client.name}: maintenance margin breached. A margin call is now active.`);
      return {
        ...client,
        marginCall: true,
        advisorNote: `${client.name.split(" ")[0]} is under a margin call and needs de-risking before the next market reset.`
      };
    }

    const liquidationValue = Math.max(0, computeClientAum(client, tickers));
    const primarySleeveId = clientPrimarySleeveId(client);
    const nextSleeveCashBalances = Object.fromEntries(
      client.accountSleeves.map((sleeve) => [sleeve.id, sleeve.id === primarySleeveId ? liquidationValue : 0])
    ) as Record<string, number>;
    alerts.push(`${client.name}: forced liquidation executed after an unresolved margin call.`);
    return {
      ...client,
      cash: liquidationValue,
      sleeveCashBalances: nextSleeveCashBalances,
      holdings: {},
      shortHoldings: {},
      marginDebt: 0,
      marginCall: false,
      trustScore: clamp(client.trustScore - 18, 0, 100),
      advisorNote: `${client.name.split(" ")[0]} was forced out of leveraged positions after the margin call was not resolved.`,
      status: "at-risk" as ClientStatus
    };
  });

  return { clients: nextClients, alerts };
}

function resolvePlayerMarginPressure(
  cash: number,
  holdings: GameState["personalHoldings"],
  shortHoldings: GameState["personalShortHoldings"],
  marginDebt: number,
  marginCall: boolean,
  tickers: GameState["tickers"],
  difficulty: PlayDifficulty
) {
  if (!isMarginDifficulty(difficulty)) {
    return {
      personalPortfolioUsd: cash,
      personalHoldings: holdings,
      personalShortHoldings: shortHoldings,
      personalMarginDebt: marginDebt,
      personalMarginCall: false,
      alert: null as string | null
    };
  }

  const margin = accountMarginRatio(cash, holdings, shortHoldings, marginDebt, tickers);
  if (margin.exposure <= 0 || margin.ratio >= getMaintenanceRequirement(difficulty)) {
    return {
      personalPortfolioUsd: cash,
      personalHoldings: holdings,
      personalShortHoldings: shortHoldings,
      personalMarginDebt: marginDebt,
      personalMarginCall: false,
      alert: null as string | null
    };
  }

  if (!marginCall) {
    return {
      personalPortfolioUsd: cash,
      personalHoldings: holdings,
      personalShortHoldings: shortHoldings,
      personalMarginDebt: marginDebt,
      personalMarginCall: true,
      alert: "Player portfolio breached maintenance margin and is now under a margin call."
    };
  }

  return {
    personalPortfolioUsd: Math.max(0, computeMarginEquity(cash, margin.longValue, margin.shortValue, marginDebt)),
    personalHoldings: {},
    personalShortHoldings: {},
    personalMarginDebt: 0,
    personalMarginCall: false,
    alert: "Player portfolio was forcibly liquidated after the margin call was not resolved."
  };
}

function buildTradeFeedback(title: string, detail: string, tone: "positive" | "warning" | "neutral") {
  return { title, detail, tone };
}

function buildSuitabilityCoachingBullets(client: ClientAccount, ticker: GameState["tickers"][string]) {
  const bullets = [
    `Client equity lane: ${client.investmentPolicy.equityRangeLabel ?? "Policy-led allocation range"}`,
    `Selected asset: ${ticker.name} | ${ticker.category === "stocks" || ticker.category === "funds" ? `Beta ${(ticker.beta ?? 0).toFixed(2)}` : ticker.category}`
  ];

  if (client.riskProfile === "Conservative") {
    bullets.push("Better fit examples: diversified dividend funds, short-duration bonds, balanced funds, or high-quality large-cap income names.");
  } else if (client.riskProfile === "Moderate") {
    bullets.push("Better fit examples: balanced funds, broad market funds, laddered bonds, or lower-volatility equity sleeves sized modestly.");
  } else {
    bullets.push("Better fit examples: diversified core equity funds, staged growth exposure, and position sizes that stay inside the IPS guardrails.");
  }

  return bullets;
}

function workflowCooldownIncrement(
  eventKind: "meeting" | "behavior" | "transfer" | "operations" | "supervision",
  difficulty: PlayDifficulty
) {
  const difficultyBase =
    difficulty === "learner" || difficulty === "trainee" ? 3 :
    difficulty === "associate" ? 2 :
    2;

  const eventBump =
    eventKind === "supervision" ? 2 :
    eventKind === "operations" ? 1 :
    0;

  return difficultyBase + eventBump;
}

function paymentsPerYear(frequency: "monthly" | "quarterly" | "semiannual" | "annual" | undefined) {
  switch (frequency) {
    case "monthly":
      return 12;
    case "semiannual":
      return 2;
    case "annual":
      return 1;
    case "quarterly":
    default:
      return 4;
  }
}

function shouldPayDividend(ticker: GameState["tickers"][string], cycleNumber: number) {
  if (!ticker?.dividendPayoutType) {
    return false;
  }

  const cadence = paymentsPerYear(ticker.dividendFrequency);
  const cycleInterval =
    cadence === 12 ? 1 :
    cadence === 4 ? 4 :
    cadence === 2 ? 8 :
    16;

  return cycleNumber % cycleInterval === 0;
}

function applyDividendPayoutsToHoldings(
  holdings: Record<string, ClientHolding>,
  tickers: GameState["tickers"],
  cycleNumber: number
) {
  let cashDividendUsd = 0;
  let stockDividendShares = 0;
  const nextHoldings = { ...holdings };

  Object.entries(holdings).forEach(([holdingKey, holding]) => {
    const ticker = tickers[holding.ticker];
    if (!ticker || !shouldPayDividend(ticker, cycleNumber)) {
      return;
    }

    if (ticker.dividendPayoutType === "cash" && ticker.dividendYield) {
      cashDividendUsd += holding.shares * ticker.price * (ticker.dividendYield / paymentsPerYear(ticker.dividendFrequency));
      return;
    }

    if (ticker.dividendPayoutType === "stock" && ticker.stockDividendRate) {
      const extraShares = Number((holding.shares * ticker.stockDividendRate).toFixed(4));
      if (extraShares > 0) {
        nextHoldings[holdingKey] = {
          ...holding,
          shares: Number((holding.shares + extraShares).toFixed(4))
        };
        stockDividendShares += extraShares;
      }
    }
  });

  return {
    holdings: nextHoldings,
    cashDividendUsd: Number(cashDividendUsd.toFixed(2)),
    stockDividendShares: Number(stockDividendShares.toFixed(4))
  };
}

function buildDividendCashBySleeve(
  client: ClientAccount,
  tickers: GameState["tickers"],
  cycleNumber: number
) {
  const cashBySleeve: Record<string, number> = {};

  Object.entries(client.holdings).forEach(([holdingKey, holding]) => {
    const ticker = tickers[holding.ticker];

    if (!ticker || ticker.dividendPayoutType !== "cash" || !ticker.dividendYield || !shouldPayDividend(ticker, cycleNumber)) {
      return;
    }

    const sleeveId = client.holdingAccountMap[holdingKey] ?? clientPrimarySleeveId(client);
    const payout = holding.shares * ticker.price * (ticker.dividendYield / paymentsPerYear(ticker.dividendFrequency));
    cashBySleeve[sleeveId] = Number(((cashBySleeve[sleeveId] ?? 0) + payout).toFixed(2));
  });

  return cashBySleeve;
}

function buildPersonalDividendCashBySleeve(
  holdings: GameState["personalHoldings"],
  holdingAccountMap: GameState["personalHoldingAccountMap"],
  sleeves: ClientAccountSleeve[],
  tickers: GameState["tickers"],
  cycleNumber: number
) {
  const cashBySleeve: Record<string, number> = {};
  const primarySleeveId = personalPrimarySleeveId(sleeves);

  Object.entries(holdings).forEach(([holdingKey, holding]) => {
    const ticker = tickers[holding.ticker];

    if (!ticker || ticker.dividendPayoutType !== "cash" || !ticker.dividendYield || !shouldPayDividend(ticker, cycleNumber)) {
      return;
    }

    const sleeveId = holdingAccountMap[holdingKey] ?? primarySleeveId;
    const payout = holding.shares * ticker.price * (ticker.dividendYield / paymentsPerYear(ticker.dividendFrequency));
    cashBySleeve[sleeveId] = Number(((cashBySleeve[sleeveId] ?? 0) + payout).toFixed(2));
  });

  return cashBySleeve;
}

function applyDividendPayouts(
  clients: ClientAccount[],
  personalCash: number,
  personalAccountSleeves: ClientAccountSleeve[],
  personalSleeveCashBalances: Record<string, number>,
  personalHoldings: GameState["personalHoldings"],
  personalHoldingAccountMap: GameState["personalHoldingAccountMap"],
  tickers: GameState["tickers"],
  cycleNumber: number
) {
  const personalPayout = applyDividendPayoutsToHoldings(personalHoldings, tickers, cycleNumber);
  const personalCashBySleeve = buildPersonalDividendCashBySleeve(
    personalHoldings,
    personalHoldingAccountMap,
    personalAccountSleeves,
    tickers,
    cycleNumber
  );
  const nextPersonalSleeveCashBalances = { ...personalSleeveCashBalances };
  Object.entries(personalCashBySleeve).forEach(([sleeveId, amount]) => {
    nextPersonalSleeveCashBalances[sleeveId] = Number(((nextPersonalSleeveCashBalances[sleeveId] ?? 0) + amount).toFixed(2));
  });
  const nextClients = clients.map((client) => {
    const payout = applyDividendPayoutsToHoldings(client.holdings, tickers, cycleNumber);
    const cashBySleeve = buildDividendCashBySleeve(client, tickers, cycleNumber);
    const nextSleeveCashBalances = { ...client.sleeveCashBalances };
    Object.entries(cashBySleeve).forEach(([sleeveId, amount]) => {
      nextSleeveCashBalances[sleeveId] = Number(((nextSleeveCashBalances[sleeveId] ?? 0) + amount).toFixed(2));
    });

    return {
      ...client,
      sleeveCashBalances: nextSleeveCashBalances,
      cash: sumSleeveCashBalances(nextSleeveCashBalances),
      holdings: payout.holdings
    };
  });

  const clientCashDividends = Number(
    nextClients.reduce((sum, client, index) => sum + (client.cash - clients[index].cash), 0).toFixed(2)
  );

  return {
    clients: nextClients,
    personalPortfolioUsd: Number((personalCash + personalPayout.cashDividendUsd).toFixed(2)),
    personalSleeveCashBalances: normalizePersonalSleeveCashBalances(
      personalAccountSleeves,
      nextPersonalSleeveCashBalances,
      Number((personalCash + personalPayout.cashDividendUsd).toFixed(2))
    ),
    personalHoldings: personalPayout.holdings,
    personalCashDividends: personalPayout.cashDividendUsd,
    personalStockDividends: personalPayout.stockDividendShares,
    clientCashDividends
  };
}

function sanitizeClients(clients: ClientAccount[], tickers: GameState["tickers"]) {
  const mergedClients = clients.map((client, index) => {
    const template = CLIENTS.find((entry) => entry.id === client.id) ?? CLIENTS[index] ?? CLIENTS[0];
    const mergedClient: ClientAccount = {
      ...template,
      ...client,
      shortHoldings: client.shortHoldings ?? {},
      marginDebt: client.marginDebt ?? 0,
      marginCall: client.marginCall ?? false,
      accountSleeves: Array.isArray(client.accountSleeves) && client.accountSleeves.length > 0 ? client.accountSleeves : template.accountSleeves,
      sleeveCashBalances: normalizeSleeveCashBalances(
        {
          accountSleeves: Array.isArray(client.accountSleeves) && client.accountSleeves.length > 0 ? client.accountSleeves : template.accountSleeves,
          startingAum: client.startingAum ?? template.startingAum,
          cash: client.cash ?? template.cash
        },
        (client as ClientAccount).sleeveCashBalances,
        template.sleeveCashBalances
      ),
      holdingAccountMap: normalizePositionAccountMap(
        client.holdings ?? {},
        client.holdingAccountMap,
        (Array.isArray(client.accountSleeves) && client.accountSleeves.length > 0 ? client.accountSleeves : template.accountSleeves)[0]?.id ?? "primary"
      ),
      shortHoldingAccountMap: normalizePositionAccountMap(
        client.shortHoldings ?? {},
        client.shortHoldingAccountMap,
        (Array.isArray(client.accountSleeves) && client.accountSleeves.length > 0 ? client.accountSleeves : template.accountSleeves)[0]?.id ?? "primary"
      ),
      insuranceNeeds: Array.isArray(client.insuranceNeeds) ? client.insuranceNeeds : template.insuranceNeeds,
      insuranceCoverage: Array.isArray(client.insuranceCoverage) ? client.insuranceCoverage : template.insuranceCoverage,
      insurancePressure: typeof client.insurancePressure === "number" ? client.insurancePressure : template.insurancePressure,
      insuranceGapScore: typeof client.insuranceGapScore === "number" ? client.insuranceGapScore : template.insuranceGapScore,
      insuranceNote: client.insuranceNote ?? template.insuranceNote,
      cashFlow: client.cashFlow ?? template.cashFlow,
      creditProfile: {
        ...template.creditProfile,
        ...(client.creditProfile ?? {})
      },
      debtProfile: {
        ...template.debtProfile,
        ...(client.debtProfile ?? {})
      },
      mortgageProfile: {
        ...template.mortgageProfile,
        ...(client.mortgageProfile ?? {})
      },
      lendingProfile: {
        ...template.lendingProfile,
        ...(client.lendingProfile ?? {})
      },
      taxProfile: client.taxProfile ?? template.taxProfile,
      investmentPolicy: {
        ...template.investmentPolicy,
        ...(client.investmentPolicy ?? {})
      },
      retirementDistribution: client.retirementDistribution ?? template.retirementDistribution,
      benefitsProfile: client.benefitsProfile ?? template.benefitsProfile,
      estateProfile: client.estateProfile ?? template.estateProfile,
      accountStructure: client.accountStructure ?? template.accountStructure,
      educationPlanning: client.educationPlanning ?? template.educationPlanning,
      revenueProfile: client.revenueProfile ?? template.revenueProfile,
      retirementMath: client.retirementMath ?? template.retirementMath,
      productComparison: client.productComparison ?? template.productComparison,
      crmProfile: client.crmProfile ?? template.crmProfile,
      supervisionProfile: client.supervisionProfile ?? template.supervisionProfile,
      clientNotes: Array.isArray(client.clientNotes) ? client.clientNotes : template.clientNotes,
      ageLabel: client.ageLabel ?? template.ageLabel,
      householdAges: Array.isArray(client.householdAges) ? client.householdAges : template.householdAges,
      trustScore: typeof client.trustScore === "number" ? client.trustScore : template.trustScore,
      mandateScore: typeof client.mandateScore === "number" ? client.mandateScore : template.mandateScore,
      advisorNote: client.advisorNote ?? template.advisorNote,
      mandateTargets: Array.isArray(client.mandateTargets) ? client.mandateTargets : template.mandateTargets,
      watchouts: Array.isArray(client.watchouts) ? client.watchouts : template.watchouts
    };
    mergedClient.cash = sumSleeveCashBalances(mergedClient.sleeveCashBalances);
    const mandate = buildMandateSnapshot(mergedClient, tickers);
    return {
      ...mergedClient,
      mandateScore: mandate.score,
      advisorNote: mergedClient.advisorNote || mandate.note
    };
  });

  const existingIds = new Set(mergedClients.map((client) => client.id));
  const missingTemplates = CLIENTS
    .filter((template) => !existingIds.has(template.id))
    .map((template) => {
      const clonedTemplate: ClientAccount = {
        ...template,
        holdings: {},
        shortHoldings: {},
        marginDebt: 0,
        marginCall: false,
        insuranceCoverage: [],
        insurancePressure: 0,
        insuranceGapScore: template.insuranceGapScore,
        status: "pending",
        sleeveCashBalances: { ...template.sleeveCashBalances },
        holdingAccountMap: {},
        shortHoldingAccountMap: {},
        clientNotes: [...template.clientNotes]
      };
      clonedTemplate.cash = sumSleeveCashBalances(clonedTemplate.sleeveCashBalances);
      const mandate = buildMandateSnapshot(clonedTemplate, tickers);
      return {
        ...clonedTemplate,
        mandateScore: mandate.score,
        advisorNote: clonedTemplate.advisorNote || mandate.note
      };
    });

  return [...mergedClients, ...missingTemplates];
}

function computePersonalNetWorth(
  personalPortfolioUsd: number,
  personalHoldings: GameState["personalHoldings"],
  personalShortHoldings: GameState["personalShortHoldings"],
  personalMarginDebt: number,
  tickers: GameState["tickers"]
) {
  return computeMarginEquity(
    personalPortfolioUsd,
    computeLongValue(personalHoldings, tickers),
    computeShortValue(personalShortHoldings, tickers),
    personalMarginDebt
  );
}

function buildFinancialProfiles(tickers: GameState["tickers"]) {
  return Object.fromEntries(
    Object.values(tickers)
      .filter((ticker) => ticker.category === "stocks" || ticker.category === "funds")
      .map((ticker) => [ticker.symbol, marketEngine.generateFinancials(ticker.symbol)!])
  );
}

function createCurrentMarketSnapshot() {
  return createMarketEngine().getState();
}

function mergeMarketState(
  tickers: GameState["tickers"],
  histories: GameState["histories"],
  currentEvent: string | null,
  selectedTicker: string
) {
  const currentMarket = createCurrentMarketSnapshot();
  const mergedTickers = { ...currentMarket.tickers, ...tickers };
  const mergedHistories = { ...currentMarket.histories, ...histories };
  const nextSelectedTicker = mergedTickers[selectedTicker] ? selectedTicker : Object.keys(mergedTickers)[0] ?? "AAPL";
  const nextCurrentEvent =
    currentEvent ??
    currentMarket.currentEvent?.title ??
    null;

  return {
    tickers: mergedTickers,
    histories: mergedHistories,
    currentEvent: nextCurrentEvent,
    selectedTicker: nextSelectedTicker
  };
}

function buildCycleSummary(
  tickers: GameState["tickers"],
  cycleNumber: number,
  currentEvent: string | null,
  personalImpactUsd = 0,
  clientImpactUsd = 0,
  clientAlerts: string[] = [],
  lostClientNames: string[] = []
) {
  const instruments = Object.values(tickers);

  if (instruments.length === 0) {
    return {
      cycleNumber,
      eventTitle: currentEvent,
      leaderSymbol: null,
      leaderChange: 0,
      laggardSymbol: null,
      laggardChange: 0,
      personalImpactUsd,
      clientImpactUsd,
      clientAlerts,
      lostClientNames
    };
  }

  const sortedByChange = [...instruments].sort((left, right) => right.change - left.change);
  const leader = sortedByChange[0];
  const laggard = sortedByChange[sortedByChange.length - 1];

  return {
    cycleNumber,
    eventTitle: currentEvent,
    leaderSymbol: leader?.symbol ?? null,
    leaderChange: leader?.change ?? 0,
    laggardSymbol: laggard?.symbol ?? null,
    laggardChange: laggard?.change ?? 0,
    personalImpactUsd,
    clientImpactUsd,
    clientAlerts,
    lostClientNames
  };
}

function evaluateClientCycleState(clients: ClientAccount[], tickers: GameState["tickers"]) {
  const alerts: string[] = [];
  const lostClientNames: string[] = [];

  const updatedClients = clients.map((client) => {
    const mandate = buildMandateSnapshot(client, tickers);
    let status: ClientStatus = client.status;
    let note = client.advisorNote;

    if (client.trustScore >= 82 && mandate.score >= 72) {
      status = "satisfied";
      note = `${client.name.split(" ")[0]} is increasingly confident in the strategy and staying engaged.`;
      alerts.push(`${client.name}: confidence is building around the current plan.`);
    } else if (client.trustScore <= 32 || mandate.score <= 32) {
      status = "at-risk";
      note = `${client.name.split(" ")[0]} is unhappy with the current direction and may pull assets if the plan does not improve.`;
      alerts.push(`${client.name}: relationship is under pressure and needs attention.`);
    } else {
      status = "pending";
      note = `${client.name.split(" ")[0]} is waiting for the next few decisions before fully buying into the plan.`;
    }

    return {
      ...client,
      status,
      mandateScore: mandate.score,
      advisorNote: note
    };
  });

  const retainedClients = updatedClients.filter((client) => {
    const shouldLeave = client.trustScore <= 14 || client.mandateScore <= 12;
    if (shouldLeave) {
      lostClientNames.push(client.name);
    }
    return !shouldLeave;
  });

  return { updatedClients: retainedClients, alerts, lostClientNames };
}

function buildFreshDifficultyState(
  difficulty: PlayDifficulty,
  tickers: GameState["tickers"],
  histories: GameState["histories"],
  currentEvent: string | null
) {
  const baseScores = {
    learner: 1500,
    trainee: 1500,
    associate: 1250,
    advisor: 1000,
    senior: 1000
  };
  const clients = cloneClients();
  const personalAccountSleeves = createDefaultPersonalAccountSleeves();
  const personalSleeveCashBalances = createDefaultPersonalSleeveCashBalances();
  const trainees = createDefaultTrainees();
  const trainingAssignments = createDefaultTrainingAssignments();

  return {
    trainees,
    activeTraineeId: trainees[0].id,
    trainingAssignments,
    trainingReports: [],
    lastRecordedSessionKey: null,
    liveTraineeScore: null,
    score: baseScores[difficulty],
    personalPortfolioUsd: STARTING_PERSONAL_PORTFOLIO_USD,
    personalAccountSleeves,
    personalSleeveCashBalances,
    personalHoldings: {},
    personalHoldingAccountMap: {},
    personalShortHoldings: {},
    personalShortHoldingAccountMap: {},
    personalMarginDebt: 0,
    personalMarginCall: false,
    playerComplianceLevel: 0,
    playerViolationCount: 0,
    playerTradeStatus: "clear" as const,
    playerSuspensionRounds: 0,
    activeInsiderEvent: null,
    playerComplianceFeedback: null,
    playerGameOver: false,
    playerGameOverReason: null,
    secMeterLevel: 0,
    timerSeconds: 15 * 60,
    isPaused: false,
    activeDifficulty: difficulty,
    selectedChartPeriod: "current" as const,
    gameDateIso: createInitialMarketDate(),
    activeClientId: CLIENTS[0].id,
    selectedTicker: "AAPL",
    activeTab: "research" as const,
    clients,
    tickers,
    histories,
    currentEvent,
    cycleNumber: 1,
    workflowCooldownUntilCycle: 1,
    lastMarketRefreshAt: Date.now(),
    lastCycleSummary: buildCycleSummary(tickers, 1, currentEvent),
    activeCycleRecap: null,
    interestRates: buildInterestRateSnapshot(1, "current"),
    revenueSnapshot: buildRevenueSnapshot(clients, tickers),
    activeQuestion: emptyQuestionState(),
    auditQuestion: emptyQuestionState(),
    auditTriggered: false,
    auditHistory: [],
    removedClientIds: [],
    questionOutcomes: [],
    complianceStats: emptyComplianceStats(),
    researchUnlocks: {},
    questionTracker: createQuestionTracker(),
    financialProfiles: buildFinancialProfiles(tickers),
    answerStreak: 0,
    bestAnswerStreak: 0,
    tradeFeedback: null,
    totalAum: computeTotalAum(clients, tickers),
    questionBankStatus: "idle" as QuestionBankStatus,
    questionBankWarmStatus: "idle" as QuestionBankWarmStatus,
    loadedQuestionBankKeys: [],
    questionBankError: null,
    activeInsuranceDialogue: null,
    activeClientMeeting: null,
    activeAccountTransferRequest: null,
    activeOperationsRequest: null,
    activeRecommendationDialogue: null,
    activeSupervisionRequest: null,
    activeDocumentationPrompt: null,
    activeBehaviorEvent: null
  };
}

type GameState = GameStateShape & {
  totalAum: number;
  activeDifficulty: PlayDifficulty;
  setDifficulty: (difficulty: PlayDifficulty) => void;
  setChartPeriod: (period: ChartPeriod) => void;
  togglePause: () => void;
  resetSession: () => void;
  resetSecMeter: (restoreLevel?: number) => void;
  saveSecToAssignment: (assignmentId: string) => void;
  updateLiveTraineeScore: (traineeId: string, moduleId: string | null, correct: number, total: number) => void;
  renameSlot: (slotId: SaveSlotId, label: string) => void;
  saveToSlot: (slotId: SaveSlotId) => void;
  loadFromSlot: (slotId: SaveSlotId) => Promise<void>;
  deleteSlot: (slotId: SaveSlotId) => void;
  exportSlots: () => void;
  importSlots: (file: File) => Promise<void>;
  initializeQuestionBank: (difficulty?: PlayDifficulty) => Promise<void>;
  createTrainee: (name: string, role?: TraineeProfile["role"]) => void;
  upsertTrainee: (trainee: TraineeProfile) => void;
  removeTrainee: (traineeId: string) => void;
  setActiveTrainee: (traineeId: string) => void;
  assignTrainingModule: (traineeId: string, moduleId: string, assignedDifficulty: PlayDifficulty, dueAt?: number | null, jurisdictionCode?: string | null) => void;
  removeTrainingModule: (assignmentId: string) => void;
  recordTrainingReport: (moduleReport?: {
    moduleId: string;
    moduleTitle: string;
    moduleScore: number;
    moduleSummary: string;
    moduleScoreCards: ModuleAssessmentCard[];
  } | null) => void;
  setTab: (tab: AppTab) => void;
  selectTicker: (symbol: string) => void;
  selectClient: (clientId: string) => Promise<void>;
  openPersonalAccount: (accountType: "401k" | "traditional-ira" | "roth-ira") => void;
  answerQuestion: (selectedIndex: number) => void;
  nextQuestion: () => void;
  rebalanceActiveClient: () => void;
  startClientReviewMeeting: (clientId: string) => void;
  startOperationsWorkflow: (clientId: string, kind: OperationsWorkflowKind) => void;
  executeEducationFundingPlan: (clientId: string) => void;
  runTaxManagementAction: (clientId: string, action: "harvest-losses" | "gain-budget") => void;
  resolveClientMeeting: (optionId: string) => void;
  closeClientMeeting: () => void;
  resolveAccountTransferRequest: (optionId: string) => void;
  closeAccountTransferRequest: () => void;
  resolveOperationsRequest: (optionId: string) => void;
  closeOperationsRequest: () => void;
  startRecommendationDialogue: (clientId: string, recommendationId: string) => void;
  resolveRecommendationDialogue: (optionId: string) => void;
  closeRecommendationDialogue: () => void;
  resolveSupervisionRequest: (optionId: string) => void;
  closeSupervisionRequest: () => void;
  updateDocumentationNote: (value: string) => void;
  saveDocumentationNote: () => void;
  dismissDocumentationPrompt: () => void;
  resolveBehaviorEvent: (optionId: string) => void;
  closeBehaviorEvent: () => void;
  startInsuranceRecommendation: (clientId: string, insuranceId: string) => void;
  answerInsuranceDialogue: (selectedIndex: number) => void;
  advanceInsuranceDialogue: () => void;
  closeInsuranceDialogue: () => void;
  recommendInsurance: (clientId: string, insuranceId: string) => void;
  deferInsurance: (clientId: string, insuranceId: string) => void;
  submitOrder: (input: { ticker: string; direction: "buy" | "sell"; quantity: number; clientId: string; accountId: string; mode: TradeFundingMode }) => void;
  tickMarket: () => void;
  tickTimer: () => void;
  unlockResearch: (symbol: string) => void;
  resolveAudit: (selectedIndex: number) => void;
  resolveInsiderEvent: (decision: "trade" | "avoid") => void;
  dismissPlayerComplianceFeedback: () => void;
  dismissCycleRecap: () => void;
  dismissOnboarding: () => void;
};

const DIFFICULTY_ORDER: PlayDifficulty[] = ["learner", "trainee", "associate", "advisor", "senior"];

type PersistedGameSnapshot = Pick<
  GameState,
  | "trainees"
  | "activeTraineeId"
  | "trainingAssignments"
  | "trainingReports"
  | "lastRecordedSessionKey"
  | "score"
  | "personalPortfolioUsd"
  | "personalAccountSleeves"
  | "personalSleeveCashBalances"
  | "personalHoldings"
  | "personalHoldingAccountMap"
  | "personalShortHoldings"
  | "personalShortHoldingAccountMap"
  | "personalMarginDebt"
  | "personalMarginCall"
  | "playerComplianceLevel"
  | "playerViolationCount"
  | "playerTradeStatus"
  | "playerSuspensionRounds"
  | "activeInsiderEvent"
  | "playerComplianceFeedback"
  | "playerGameOver"
  | "playerGameOverReason"
  | "secMeterLevel"
  | "timerSeconds"
  | "isPaused"
  | "activeDifficulty"
  | "selectedChartPeriod"
  | "gameDateIso"
  | "activeClientId"
  | "selectedTicker"
  | "activeTab"
  | "clients"
  | "tickers"
  | "histories"
  | "currentEvent"
  | "cycleNumber"
  | "workflowCooldownUntilCycle"
  | "lastMarketRefreshAt"
  | "lastCycleSummary"
  | "activeCycleRecap"
  | "interestRates"
  | "revenueSnapshot"
  | "activeQuestion"
  | "auditQuestion"
  | "auditTriggered"
  | "auditHistory"
  | "removedClientIds"
  | "questionOutcomes"
  | "complianceStats"
  | "researchUnlocks"
  | "questionTracker"
  | "financialProfiles"
  | "answerStreak"
  | "bestAnswerStreak"
  | "tradeFeedback"
  | "totalAum"
  | "onboardingDismissed"
  | "lastSavedAt"
  >;

function isPersistedGameSnapshot(value: unknown): value is PersistedGameSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const snapshot = value as Partial<PersistedGameSnapshot>;
  return (
    typeof snapshot.activeDifficulty === "string" &&
    typeof snapshot.selectedTicker === "string" &&
    typeof snapshot.selectedChartPeriod === "string" &&
    typeof snapshot.gameDateIso === "string" &&
    snapshot.tickers !== null &&
    typeof snapshot.tickers === "object" &&
    snapshot.histories !== null &&
    typeof snapshot.histories === "object" &&
    Array.isArray(snapshot.clients)
  );
}

function resolveDifficultySessionSnapshot(snapshot: unknown) {
  if (!isPersistedGameSnapshot(snapshot)) {
    return null;
  }

  try {
    return hydrateSnapshotMarketState(snapshot);
  } catch {
    return null;
  }
}

function hydrateSnapshotMarketState(snapshot: PersistedGameSnapshot): PersistedGameSnapshot {
  const marketState = mergeMarketState(
    snapshot.tickers,
    snapshot.histories,
    snapshot.currentEvent,
    snapshot.selectedTicker
  );
  const cycleNumber = Math.max(1, snapshot.cycleNumber ?? 1);
  const workflowCooldownUntilCycle = Math.max(1, snapshot.workflowCooldownUntilCycle ?? 1);
  const selectedChartPeriod = snapshot.selectedChartPeriod ?? "current";
  const gameDateIso = snapshot.gameDateIso ?? createInitialMarketDate();
  const hydratedTickers = refreshCallableBondTerms(marketState.tickers, cycleNumber);

  return {
    ...snapshot,
    ...marketState,
    selectedChartPeriod,
    gameDateIso,
    workflowCooldownUntilCycle,
    interestRates: buildInterestRateSnapshot(cycleNumber, selectedChartPeriod),
    tickers: hydratedTickers,
    personalAccountSleeves:
      Array.isArray(snapshot.personalAccountSleeves) && snapshot.personalAccountSleeves.length > 0
        ? snapshot.personalAccountSleeves
        : createDefaultPersonalAccountSleeves(),
    personalSleeveCashBalances: normalizePersonalSleeveCashBalances(
      Array.isArray(snapshot.personalAccountSleeves) && snapshot.personalAccountSleeves.length > 0
        ? snapshot.personalAccountSleeves
        : createDefaultPersonalAccountSleeves(),
      snapshot.personalSleeveCashBalances,
      snapshot.personalPortfolioUsd
    ),
    personalShortHoldings: snapshot.personalShortHoldings ?? {},
    personalHoldingAccountMap: normalizePositionAccountMap(
      snapshot.personalHoldings ?? {},
      snapshot.personalHoldingAccountMap,
      (Array.isArray(snapshot.personalAccountSleeves) && snapshot.personalAccountSleeves.length > 0
        ? snapshot.personalAccountSleeves
        : createDefaultPersonalAccountSleeves())[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id
    ),
    personalShortHoldingAccountMap: normalizePositionAccountMap(
      snapshot.personalShortHoldings ?? {},
      snapshot.personalShortHoldingAccountMap,
      (Array.isArray(snapshot.personalAccountSleeves) && snapshot.personalAccountSleeves.length > 0
        ? snapshot.personalAccountSleeves
        : createDefaultPersonalAccountSleeves())[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id
    ),
    personalMarginDebt: snapshot.personalMarginDebt ?? 0,
    personalMarginCall: false,
    clients: sanitizeClients(snapshot.clients, hydratedTickers),
    financialProfiles: buildFinancialProfiles(hydratedTickers),
    totalAum: computeTotalAum(snapshot.clients, hydratedTickers),
    revenueSnapshot: buildRevenueSnapshot(snapshot.clients, hydratedTickers, snapshot.revenueSnapshot?.trailingCycleRevenue ?? 0),
    lastCycleSummary: buildCycleSummary(
      hydratedTickers,
      cycleNumber,
      marketState.currentEvent
    )
  };
}

interface StoredSaveSlot {
  summary: SaveSlotSummary;
  snapshot: PersistedGameSnapshot;
}

function createDefaultSaveSlots(): SaveSlotSummary[] {
  return SAVE_SLOT_IDS.map((id, index) => ({
    id,
    label: `Slot ${index + 1}`,
    savedAt: null,
    difficulty: null,
    score: null
  }));
}

function safeLocalStorage() {
  return typeof localStorage === "undefined" ? null : localStorage;
}

function emptyStoredSlots(): Record<SaveSlotId, StoredSaveSlot | null> {
  return Object.fromEntries(SAVE_SLOT_IDS.map((id) => [id, null])) as Record<SaveSlotId, StoredSaveSlot | null>;
}

function normalizeStoredSlots(
  parsed?: Partial<Record<SaveSlotId, StoredSaveSlot | null>>
): Record<SaveSlotId, StoredSaveSlot | null> {
  const base = emptyStoredSlots();
  SAVE_SLOT_IDS.forEach((id) => {
    base[id] = parsed?.[id] ?? null;
  });
  return base;
}

function readStoredSlots(): Record<SaveSlotId, StoredSaveSlot | null> {
  const storage = safeLocalStorage();

  if (!storage) {
    return emptyStoredSlots();
  }

  try {
    const raw = storage.getItem(SAVE_SLOT_STORAGE_KEY);
    if (!raw) {
      return emptyStoredSlots();
    }

    const parsed = JSON.parse(raw) as Partial<Record<SaveSlotId, StoredSaveSlot | null>>;
    return normalizeStoredSlots(parsed);
  } catch {
    return emptyStoredSlots();
  }
}

function writeStoredSlots(slots: Record<SaveSlotId, StoredSaveSlot | null>) {
  const storage = safeLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(SAVE_SLOT_STORAGE_KEY, JSON.stringify(slots));
}

function buildSaveSlotSummaries() {
  const stored = readStoredSlots();
  return createDefaultSaveSlots().map((slot) => stored[slot.id]?.summary ?? slot);
}

function mergeKeys(...groups: string[][]) {
  return [...new Set(groups.flat())];
}

function getWarmupKeys(difficulty: PlayDifficulty) {
  const currentIndex = DIFFICULTY_ORDER.indexOf(difficulty);
  const nextDifficulty = DIFFICULTY_ORDER[currentIndex + 1];

  if (!nextDifficulty) {
    return [];
  }

  const currentKeys = getExamKeysForDifficulty(difficulty);
  const nextKeys = getExamKeysForDifficulty(nextDifficulty);
  return nextKeys.filter((key) => !currentKeys.includes(key));
}

function buildSnapshot(state: GameState): PersistedGameSnapshot {
  return {
    trainees: state.trainees,
    activeTraineeId: state.activeTraineeId,
    trainingAssignments: state.trainingAssignments,
    trainingReports: state.trainingReports,
    lastRecordedSessionKey: state.lastRecordedSessionKey,
    score: state.score,
    personalPortfolioUsd: state.personalPortfolioUsd,
    personalAccountSleeves: state.personalAccountSleeves,
    personalSleeveCashBalances: state.personalSleeveCashBalances,
    personalHoldings: state.personalHoldings,
    personalHoldingAccountMap: state.personalHoldingAccountMap,
    personalShortHoldings: state.personalShortHoldings,
    personalShortHoldingAccountMap: state.personalShortHoldingAccountMap,
    personalMarginDebt: state.personalMarginDebt,
    personalMarginCall: state.personalMarginCall,
    playerComplianceLevel: state.playerComplianceLevel,
    playerViolationCount: state.playerViolationCount,
    playerTradeStatus: state.playerTradeStatus,
    playerSuspensionRounds: state.playerSuspensionRounds,
    activeInsiderEvent: state.activeInsiderEvent,
    playerComplianceFeedback: state.playerComplianceFeedback,
    playerGameOver: state.playerGameOver,
    playerGameOverReason: state.playerGameOverReason,
    secMeterLevel: state.secMeterLevel,
    timerSeconds: state.timerSeconds,
    isPaused: state.isPaused,
    activeDifficulty: state.activeDifficulty,
    selectedChartPeriod: state.selectedChartPeriod,
    gameDateIso: state.gameDateIso,
    activeClientId: state.activeClientId,
    selectedTicker: state.selectedTicker,
    activeTab: state.activeTab,
    clients: state.clients,
    tickers: state.tickers,
    histories: state.histories,
    currentEvent: state.currentEvent,
    cycleNumber: state.cycleNumber,
    workflowCooldownUntilCycle: state.workflowCooldownUntilCycle,
    lastMarketRefreshAt: state.lastMarketRefreshAt,
    lastCycleSummary: state.lastCycleSummary,
    activeCycleRecap: state.activeCycleRecap,
    interestRates: state.interestRates,
    revenueSnapshot: state.revenueSnapshot,
    activeQuestion: state.activeQuestion,
    auditQuestion: state.auditQuestion,
    auditTriggered: state.auditTriggered,
    auditHistory: state.auditHistory,
    removedClientIds: state.removedClientIds,
    questionOutcomes: state.questionOutcomes,
    complianceStats: state.complianceStats,
    researchUnlocks: state.researchUnlocks,
    questionTracker: state.questionTracker,
    financialProfiles: state.financialProfiles,
    answerStreak: state.answerStreak,
    bestAnswerStreak: state.bestAnswerStreak,
    tradeFeedback: state.tradeFeedback,
    totalAum: state.totalAum,
    onboardingDismissed: state.onboardingDismissed,
    lastSavedAt: state.lastSavedAt
  };
}

function buildPersistentTrainingState(state: Pick<GameState,
  "trainees" |
  "activeTraineeId" |
  "trainingAssignments" |
  "trainingReports" |
  "lastRecordedSessionKey"
>) {
  return {
    trainees: state.trainees,
    activeTraineeId: state.activeTraineeId,
    trainingAssignments: state.trainingAssignments,
    trainingReports: state.trainingReports,
    lastRecordedSessionKey: state.lastRecordedSessionKey
  };
}

function buildTrainingSessionReport(
  state: GameState,
  moduleReport: {
    moduleId: string;
    moduleTitle: string;
    moduleScore: number;
    moduleSummary: string;
    moduleScoreCards: ModuleAssessmentCard[];
  } | null = null
): TrainingSessionReport {
  const startingBook = CLIENTS.reduce((total, client) => total + client.startingAum, 0);
  const correctAnswers = state.questionOutcomes.filter((outcome) => outcome.correct).length;
  const answeredQuestions = state.questionOutcomes.length;
  const studyAccuracy = answeredQuestions === 0 ? 0 : (correctAnswers / answeredQuestions) * 100;
  const trainee = state.trainees.find((entry) => entry.id === state.activeTraineeId) ?? state.trainees[0];
  const summary = buildTrainingPerformanceSummary({
    questionOutcomes: state.questionOutcomes,
    clients: state.clients,
    removedClientIds: state.removedClientIds,
    secMeterLevel: state.secMeterLevel,
    auditHistory: state.auditHistory,
    complianceStats: state.complianceStats,
    playerComplianceLevel: state.playerComplianceLevel,
    totalAum: state.totalAum,
    startingBook,
    personalEquity: state.personalPortfolioUsd,
    startingPersonalEquity: STARTING_PERSONAL_PORTFOLIO_USD
  });

  return {
    id: `${Date.now()}-${state.activeDifficulty}`,
    traineeId: trainee?.id ?? DEFAULT_TRAINEE_ID,
    traineeName: trainee?.name ?? "Primary Trainee",
    difficulty: state.activeDifficulty,
    endedAt: Date.now(),
    moduleId: moduleReport?.moduleId ?? null,
    moduleTitle: moduleReport?.moduleTitle ?? null,
    moduleScore: moduleReport?.moduleScore ?? null,
    moduleSummary: moduleReport?.moduleSummary ?? null,
    moduleScoreCards: moduleReport?.moduleScoreCards ?? [],
    overall: summary.overall,
    examReadiness: summary.examReadiness,
    advisorPerformance: summary.advisorPerformance,
    clientOutcome: summary.clientOutcome,
    compliance: summary.compliance,
    portfolioOutcome: summary.portfolioOutcome,
    finalScore: state.score,
    totalAum: state.totalAum,
    personalEquity: state.personalPortfolioUsd,
    studyAccuracy,
    correctAnswers,
    answeredQuestions,
    clientCount: state.clients.length,
    lostClientCount: state.removedClientIds.length
  };
}

type BaseGameState = GameStateShape & {
  totalAum: number;
};

function buildInitialState(): BaseGameState {
  const marketState = marketEngine.getState();
  const freshLearner = buildFreshDifficultyState("learner", marketState.tickers, marketState.histories, marketState.currentEvent?.title ?? null);

  return {
    ...freshLearner,
    lastSavedAt: null,
    lastRestoredAt: null,
    sessionRestored: false,
    onboardingDismissed: false,
    saveSlots: buildSaveSlotSummaries(),
    difficultySessions: {}
  };
}

function getQuestionPortfolioDelta(difficulty: PlayDifficulty, isCorrect: boolean) {
  if (isCorrect) {
    return 10000;
  }

  if (difficulty === "senior") {
    return -20000;
  }

  if (difficulty === "advisor") {
    return -15000;
  }

  return -10000;
}

export const useGameStore = create<GameState>()(persist((set, get) => {
  const initialState = buildInitialState();
  const commit = (
    partial:
      | Partial<GameState>
      | ((state: GameState) => Partial<GameState>),
    options?: { touchSave?: boolean }
  ) =>
    set((state) => {
      const resolved = typeof partial === "function" ? partial(state) : partial;
      if (options?.touchSave === false) {
        return resolved;
      }
      return {
        ...resolved,
        lastSavedAt: Date.now()
      };
    });

  return {
    ...initialState,
    initializeQuestionBank: async (difficulty = get().activeDifficulty) => {
      const status = get().questionBankStatus;
      const currentKeys = getExamKeysForDifficulty(difficulty);
      const loadedKeys = get().loadedQuestionBankKeys;
      const hasCurrentKeys = currentKeys.every((key) => loadedKeys.includes(key));

      if (status === "loading" || hasCurrentKeys) {
        if (hasCurrentKeys) {
          set({ questionBankStatus: "ready", loadedQuestionBankKeys: currentKeys, questionBankError: null, questionBankWarmStatus: "idle" });
        }
        return;
      }

      set({ questionBankStatus: "loading", questionBankError: null });

      try {
        await loadAuthoredQuestionBank(currentKeys);
        set({
          questionBankStatus: "ready",
          loadedQuestionBankKeys: currentKeys,
          questionBankError: null,
          questionBankWarmStatus: "idle"
        });
      } catch (error) {
        set({
          questionBankStatus: "error",
          questionBankError: error instanceof Error ? error.message : "Unable to load the authored question bank."
        });
      }
    },
    setDifficulty: (difficulty) => {
      const currentState = get();
      if (currentState.activeDifficulty === difficulty) {
        return;
      }

      const currentSnapshot = buildSnapshot(currentState);
      const persistentTrainingState = buildPersistentTrainingState(currentState);
      const storedTargetSnapshot = resolveDifficultySessionSnapshot(currentState.difficultySessions[difficulty]);
      const targetState = storedTargetSnapshot
        ? {
            ...storedTargetSnapshot,
            ...persistentTrainingState,
            activeDifficulty: difficulty,
            questionBankStatus: "idle" as QuestionBankStatus,
            questionBankWarmStatus: "idle" as QuestionBankWarmStatus,
            loadedQuestionBankKeys: [],
            questionBankError: null,
            activeInsiderEvent: null,
            playerComplianceFeedback: null,
            activeCycleRecap: null,
            activeClientMeeting: null,
            activeAccountTransferRequest: null,
            activeOperationsRequest: null,
            activeRecommendationDialogue: null,
            activeSupervisionRequest: null,
            activeDocumentationPrompt: null,
            activeBehaviorEvent: null
          }
        : {
            ...buildFreshDifficultyState(difficulty, currentState.tickers, currentState.histories, currentState.currentEvent),
            ...persistentTrainingState
          };

      set((state) => ({
        ...state,
        ...targetState,
        activeDifficulty: difficulty,
        lastSavedAt: Date.now(),
        difficultySessions: {
          ...state.difficultySessions,
          [state.activeDifficulty]: currentSnapshot
        }
      }));

      void get().initializeQuestionBank(difficulty);
    },
    setChartPeriod: (period) => {
      const state = get();
      commit({
        selectedChartPeriod: period,
        interestRates: buildInterestRateSnapshot(state.cycleNumber, period)
      }, { touchSave: false });
    },
    togglePause: () => commit((state) => ({ isPaused: !state.isPaused })),
    resetSession: () => {
      const state = get();
      const persistentTrainingState = buildPersistentTrainingState(state);
      const freshState = buildFreshDifficultyState(
        state.activeDifficulty,
        state.tickers,
        state.histories,
        state.currentEvent
      );

      set({
        ...state,
        ...freshState,
        ...persistentTrainingState,
        difficultySessions: {
          ...state.difficultySessions,
          [state.activeDifficulty]: {
            ...buildSnapshot({ ...state, ...freshState, ...persistentTrainingState } as GameState),
            activeDifficulty: state.activeDifficulty
          }
        }
      });
    },
    resetSecMeter: (restoreLevel = 0) => {
      commit({ secMeterLevel: restoreLevel });
    },
    saveSecToAssignment: (assignmentId: string) => {
      const state = get();
      commit({
        trainingAssignments: state.trainingAssignments.map(a =>
          a.id === assignmentId ? { ...a, savedSecLevel: state.secMeterLevel } : a
        )
      });
    },
    updateLiveTraineeScore: (traineeId, moduleId, correct, total) => {
      commit({
        liveTraineeScore: {
          traineeId,
          moduleId,
          correct,
          total,
          pct: total === 0 ? 0 : Math.round((correct / total) * 100),
          updatedAt: Date.now()
        }
      });
    },
    renameSlot: (slotId, label) => {
      const normalized = label.trim() || createDefaultSaveSlots().find((slot) => slot.id === slotId)?.label || slotId;
      const stored = readStoredSlots();
      const existing = stored[slotId];

      if (existing) {
        existing.summary.label = normalized;
      } else {
        stored[slotId] = {
          summary: {
            id: slotId,
            label: normalized,
            savedAt: null,
            difficulty: null,
            score: null
          },
          snapshot: buildSnapshot(get())
        };
        stored[slotId] = {
          ...stored[slotId],
          snapshot: {
            ...stored[slotId]!.snapshot,
            score: 1500,
            personalPortfolioUsd: STARTING_PERSONAL_PORTFOLIO_USD,
            personalHoldings: {},
            playerComplianceLevel: 0,
            playerViolationCount: 0,
            playerTradeStatus: "clear",
            playerSuspensionRounds: 0,
            activeInsiderEvent: null,
            playerGameOver: false,
            playerGameOverReason: null,
            secMeterLevel: 0,
            timerSeconds: 15 * 60
          }
        };
      }

      writeStoredSlots(stored);
      commit({
        saveSlots: createDefaultSaveSlots().map((slot) => stored[slot.id]?.summary ?? slot)
      });
    },
    saveToSlot: (slotId) => {
      const state = get();
      const stored = readStoredSlots();
      const existingLabel = stored[slotId]?.summary.label;
      const summary: SaveSlotSummary = {
        id: slotId,
        label: existingLabel ?? createDefaultSaveSlots().find((slot) => slot.id === slotId)?.label ?? slotId,
        savedAt: Date.now(),
        difficulty: state.activeDifficulty,
        score: state.score
      };

      stored[slotId] = {
        summary,
        snapshot: buildSnapshot(state)
      };
      writeStoredSlots(stored);
      commit({
        saveSlots: createDefaultSaveSlots().map((slot) => stored[slot.id]?.summary ?? slot)
      });
    },
    loadFromSlot: async (slotId) => {
      const stored = readStoredSlots()[slotId];

      if (!stored) {
        return;
      }

      const restoredClients = sanitizeClients(stored.snapshot.clients, stored.snapshot.tickers);
      const restoredActiveClientId = stored.snapshot.activeClientId === PLAYER_BOOK_ID
        ? PLAYER_BOOK_ID
        : restoredClients.some((client) => client.id === stored.snapshot.activeClientId)
        ? stored.snapshot.activeClientId
        : restoredClients[0]?.id ?? null;

      set({
        ...stored.snapshot,
        clients: restoredClients,
        activeClientId: restoredActiveClientId,
        totalAum: computeTotalAum(restoredClients, stored.snapshot.tickers),
        activeClientMeeting: null,
        activeAccountTransferRequest: null,
        activeOperationsRequest: null,
        activeRecommendationDialogue: null,
        activeSupervisionRequest: null,
        activeDocumentationPrompt: null,
        activeBehaviorEvent: null,
        questionBankStatus: "idle",
        questionBankWarmStatus: "idle",
        loadedQuestionBankKeys: [],
        questionBankError: null,
        lastRestoredAt: Date.now(),
        sessionRestored: true,
        saveSlots: buildSaveSlotSummaries()
      });

      await get().initializeQuestionBank(stored.snapshot.activeDifficulty);
    },
    deleteSlot: (slotId) => {
      const stored = readStoredSlots();
      stored[slotId] = null;
      writeStoredSlots(stored);
      commit({
        saveSlots: createDefaultSaveSlots().map((slot) => stored[slot.id]?.summary ?? slot)
      });
    },
    exportSlots: () => {
      const payload = {
        exportedAt: Date.now(),
        slots: readStoredSlots()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fiduciary-duty-save-slots.json";
      link.click();
      URL.revokeObjectURL(url);
    },
    importSlots: async (file) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as { slots?: Partial<Record<SaveSlotId, StoredSaveSlot | null>> };
        const normalized = normalizeStoredSlots(parsed.slots);
        writeStoredSlots(normalized);
        commit({
          saveSlots: createDefaultSaveSlots().map((slot) => normalized[slot.id]?.summary ?? slot),
          tradeFeedback: buildTradeFeedback("Save slots imported", "Imported session slots were loaded successfully.", "positive")
        });
      } catch {
        commit({
          tradeFeedback: buildTradeFeedback(
            "Import failed",
            "The selected file could not be parsed as a valid Fiduciary Duty save export.",
            "warning"
          )
        });
      }
    },
    createTrainee: (name, role = "Trainee") => {
      const trimmed = name.trim();
      if (!trimmed) {
        return;
      }

      const trainee: TraineeProfile = {
        id: `trainee-${Date.now()}`,
        name: trimmed,
        role,
        createdAt: Date.now()
      };

      commit({
        trainees: [...get().trainees, trainee],
        activeTraineeId: trainee.id
      });
    },
    upsertTrainee: (trainee) => {
      const state = get();
      const existingIndex = state.trainees.findIndex((entry) => entry.id === trainee.id);
      const nextTrainees = existingIndex >= 0
        ? state.trainees.map((entry) => entry.id === trainee.id ? trainee : entry)
        : [...state.trainees, trainee];

      commit({
        trainees: nextTrainees
      });
    },
    removeTrainee: (traineeId) => {
      const state = get();
      const nextTrainees = state.trainees.filter((entry) => entry.id !== traineeId);
      const fallbackTrainees = nextTrainees.length > 0 ? nextTrainees : createDefaultTrainees();
      commit({
        trainees: fallbackTrainees,
        activeTraineeId: state.activeTraineeId === traineeId ? fallbackTrainees[0].id : state.activeTraineeId,
        trainingAssignments: state.trainingAssignments.filter((assignment) => assignment.traineeId !== traineeId),
        trainingReports: state.trainingReports.filter((report) => report.traineeId !== traineeId)
      });
    },
    setActiveTrainee: (traineeId) => {
      if (!get().trainees.some((entry) => entry.id === traineeId)) {
        return;
      }

      commit({ activeTraineeId: traineeId }, { touchSave: false });
    },
    assignTrainingModule: (traineeId, moduleId, assignedDifficulty, dueAt = null, jurisdictionCode = null) => {
      const state = get();
      if (!state.trainees.some((entry) => entry.id === traineeId)) {
        return;
      }

      const moduleDefinition = TRAINING_MODULES.find((module) => module.id === moduleId);
      if (!moduleDefinition) {
        return;
      }

      const assignmentMortgageRate =
        moduleDefinition.workspace === "mortgage-debt-planning"
          ? pickRandomMortgageRate()
          : null;
      const assignmentMortgageScenarioId =
        moduleDefinition.workspace === "mortgage-debt-planning"
          ? pickRandomMortgageScenarioId()
          : null;

      const existingAssignment = state.trainingAssignments.find((assignment) => assignment.traineeId === traineeId && assignment.moduleId === moduleId && assignment.status !== "completed");
      if (existingAssignment) {
        commit({
          trainingAssignments: state.trainingAssignments.map((assignment) => assignment.id === existingAssignment.id ? {
            ...assignment,
            assignedDifficulty,
            jurisdictionCode,
            assignedMortgageRate: assignmentMortgageRate,
            assignedMortgageScenarioId: assignmentMortgageScenarioId,
            dueAt,
            status: "pending",
            completedAt: null,
            assignedAt: Date.now()
          } : assignment)
        });
        return;
      }

      const nextAssignment: TrainingAssignment = {
        id: `assignment-${Date.now()}`,
        traineeId,
        moduleId,
        assignedDifficulty,
        jurisdictionCode,
        assignedMortgageRate: assignmentMortgageRate,
        assignedMortgageScenarioId: assignmentMortgageScenarioId,
        assignedAt: Date.now(),
        dueAt,
        status: "pending",
        completedAt: null
      };

      commit({
        trainingAssignments: [nextAssignment, ...state.trainingAssignments]
      });
    },
    removeTrainingModule: (assignmentId) => {
      const state = get();
      commit({
        trainingAssignments: state.trainingAssignments.filter((assignment) => assignment.id !== assignmentId)
      });
    },
    recordTrainingReport: (moduleReport = null) => {
      const state = get();
      const nextSessionKey = `${buildSessionReportKey(state.cycleNumber, state.activeDifficulty, state.activeTraineeId)}::${moduleReport?.moduleId ?? "session"}`;
      if (state.lastRecordedSessionKey === nextSessionKey) {
        return;
      }

      const report = buildTrainingSessionReport(state, moduleReport);
      commit({
        trainingAssignments: updateAssignmentsFromReport(state.trainingAssignments, report),
        trainingReports: [report, ...state.trainingReports].slice(0, 60),
        lastRecordedSessionKey: nextSessionKey
      });
    },
    setTab: (tab) => commit({ activeTab: tab }),
    selectTicker: (symbol) => commit({ selectedTicker: symbol }),
    selectClient: async (clientId) => {
      if (clientId === PLAYER_BOOK_ID) {
        commit({
          activeClientId: PLAYER_BOOK_ID,
          activeTab: "portfolio"
        }, { touchSave: false });
        return;
      }

      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client || state.auditTriggered) {
        return;
      }

      if (state.questionBankStatus !== "ready") {
        await get().initializeQuestionBank();
      }

      const nextState = get();
      if (nextState.questionBankStatus === "error") {
        return;
      }

      const question = await pickQuestion(nextState.activeDifficulty, nextState.questionTracker, client);
      const shuffled = shuffleQuestion(question);

      commit({
        activeClientId: clientId,
        activeQuestion: {
          question,
          shuffledOptions: shuffled.shuffledOptions,
          displayCorrectIndex: shuffled.displayCorrectIndex,
          selectedIndex: null,
          answered: false
        },
        clients: get().clients.map((entry) => ({
          ...entry,
          status: entry.id === clientId ? "pending" : entry.status
        }))
      });
    },
    openPersonalAccount: (accountType) => {
      const state = get();
      const sleeveTemplate = PLAYER_OPTIONAL_SLEEVES[accountType];

      if (state.personalAccountSleeves.some((sleeve) => sleeve.id === sleeveTemplate.id)) {
        commit({
          activeClientId: PLAYER_BOOK_ID,
          activeTab: "portfolio",
          tradeFeedback: buildTradeFeedback("Account already open", `${sleeveTemplate.label} is already available in your personal book.`, "neutral")
        });
        return;
      }

      const taxableCash = state.personalSleeveCashBalances[PLAYER_TAXABLE_SLEEVE.id] ?? state.personalPortfolioUsd;
      const seedUsd = Math.min(
        taxableCash,
        accountType === "401k" ? 20000 : accountType === "traditional-ira" ? 12000 : 7000
      );
      const nextSleeves = [...state.personalAccountSleeves, sleeveTemplate];
      const nextBalances = {
        ...state.personalSleeveCashBalances,
        [PLAYER_TAXABLE_SLEEVE.id]: Number((taxableCash - seedUsd).toFixed(2)),
        [sleeveTemplate.id]: seedUsd
      };

      commit({
        activeClientId: PLAYER_BOOK_ID,
        activeTab: "portfolio",
        personalAccountSleeves: nextSleeves,
        personalSleeveCashBalances: nextBalances,
        personalPortfolioUsd: sumSleeveCashBalances(nextBalances),
        tradeFeedback: buildTradeFeedback(
          `${sleeveTemplate.label} opened`,
          `${formatCurrency(seedUsd)} moved from Taxable Brokerage into ${sleeveTemplate.label}. Use the account selector to compare tax-deferred and after-tax investing.`,
          "positive"
        )
      });
    },
    answerQuestion: (selectedIndex) => {
      const state = get();
      const active = state.activeQuestion;
      const client = state.clients.find((entry) => entry.id === state.activeClientId);

      if (!active.question || active.answered || !client) {
        return;
      }

      const question = active.question;
      const isCorrect = selectedIndex === active.displayCorrectIndex;
      const scoreDelta = isCorrect ? question.points : -question.points;
      const portfolioDelta = getQuestionPortfolioDelta(state.activeDifficulty, isCorrect);
      const nextStreak = isCorrect ? state.answerStreak + 1 : 0;
      const tracker = {
        ...state.questionTracker,
        recentlyAsked: [...state.questionTracker.recentlyAsked],
        domainPerformance: { ...state.questionTracker.domainPerformance }
      };
      markQuestionAsked(tracker, state.activeDifficulty, question, client.id);
      recordQuestionOutcome(tracker, question, isCorrect);
      const updatedClients = state.clients.map((entry) => {
        if (entry.id !== client.id) {
          return entry;
        }

        const note = isCorrect
          ? `${client.name.split(" ")[0]} gained confidence after a strong explanation in ${question.domain.toLowerCase()}.`
          : `${client.name.split(" ")[0]} is uneasy after the missed concept in ${question.domain.toLowerCase()}.`;

        return updateClientNarrative(
          entry,
          state.tickers,
          isCorrect ? 4 : -6,
          note,
          isCorrect ? "satisfied" : "at-risk"
        );
      });

      commit({
        score: state.score + scoreDelta,
        personalPortfolioUsd: Math.max(0, state.personalPortfolioUsd + portfolioDelta),
        answerStreak: nextStreak,
        bestAnswerStreak: Math.max(state.bestAnswerStreak, nextStreak),
        questionTracker: tracker,
        questionOutcomes: [
          ...state.questionOutcomes,
          {
            exam: question.exam,
            domain: question.domain,
            topicTag: question.topicTag,
            correct: isCorrect
          }
        ],
        activeQuestion: {
          ...active,
          selectedIndex,
          answered: true
        },
        clients: updatedClients
      });

      // Push live coaching score — increment from current live score, not cumulative tracker
      const currentState = get();
      if (currentState.liveTraineeScore !== null) {
        const prev = currentState.liveTraineeScore;
        const newTotal = prev.total + 1;
        const newCorrect = prev.correct + (isCorrect ? 1 : 0);
        commit({
          liveTraineeScore: {
            traineeId: currentState.activeTraineeId,
            moduleId: prev.moduleId,
            correct: newCorrect,
            total: newTotal,
            pct: Math.round((newCorrect / newTotal) * 100),
            updatedAt: Date.now()
          }
        });
      }
    },
    nextQuestion: () =>
      commit({
        activeQuestion: emptyQuestionState()
      }),
    rebalanceActiveClient: () => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === state.activeClientId);

      if (!client) {
        return;
      }

      const result = applyClientRebalance(client, state.tickers);
      const nextClients = state.clients.map((entry) => (entry.id === client.id ? updateClientNarrative(result.client, state.tickers, 5, `Rebalanced toward target sleeves. ${result.plan.summary}`) : entry));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          "Document IPS rebalance",
          `Record why the rebalance was appropriate for ${client.name}'s mandate, risk profile, and current drift.`,
          `Rebalanced ${client.name} toward target sleeves because drift reached ${result.plan.driftScore.toFixed(0)} and the account needed to realign with the IPS objective, diversification targets, and liquidity needs.`
        ),
        tradeFeedback: {
          ...buildTradeFeedback(`${client.name} rebalanced`, result.plan.summary, "positive"),
          bullets: [
            ...result.plan.buySuggestions.slice(0, 2).map((entry) => `Buy sleeve: ${entry.name} (${formatCurrency(entry.usd)} target)`),
            ...result.plan.sellSuggestions.slice(0, 2).map((entry) => `Trim sleeve: ${entry.name} (${formatCurrency(entry.usd)} target)`)
          ]
        }
      });
    },
    startClientReviewMeeting: (clientId) => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client) {
        return;
      }

      commit({
        activeClientId: clientId,
        activeClientMeeting: getClientReviewMeetingScenario(client, state.activeDifficulty, state.cycleNumber),
        activeAccountTransferRequest: null,
        activeOperationsRequest: null,
        activeRecommendationDialogue: null,
        activeSupervisionRequest: null,
        activeBehaviorEvent: null
      }, { touchSave: false });
    },
    startOperationsWorkflow: (clientId, kind) => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client) {
        return;
      }

      const request = getOperationsRequestByKind(client, state.activeDifficulty, state.cycleNumber, kind);
      if (!request) {
        return;
      }

      commit({
        activeClientId: clientId,
        activeClientMeeting: null,
        activeAccountTransferRequest: null,
        activeOperationsRequest: request,
        activeRecommendationDialogue: null,
        activeSupervisionRequest: null,
        activeBehaviorEvent: null
      }, { touchSave: false });
    },
    executeEducationFundingPlan: (clientId) => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client || !client.educationPlanning.active) {
        return;
      }

      const educationSleeve = findSleeveByRegistrationKeyword(client, "529");
      const taxableSleeve =
        client.accountSleeves.find((sleeve) => sleeve.registration.toLowerCase().includes("taxable")) ??
        client.accountSleeves[0] ??
        null;

      if (!educationSleeve || !taxableSleeve) {
        return;
      }

      const sourceCash = getSleeveCashBalance(client, taxableSleeve.id);
      const contribution = Math.min(sourceCash, 5000);
      const transferResult = transferBetweenSleeves(client, taxableSleeve.id, educationSleeve.id, contribution);
      const updatedClient = appendClientNote(
        updateClientNarrative(
          transferResult.client,
          state.tickers,
          transferResult.movedAmount > 0 ? 5 : -2,
          transferResult.movedAmount > 0
            ? `${client.name.split(" ")[0]} funded the education sleeve without starving the household reserve plan.`
            : `${client.name.split(" ")[0]} could not fund the education sleeve because taxable liquidity was too thin.`
        ),
        transferResult.movedAmount > 0
          ? `529 funding: moved ${formatCurrency(transferResult.movedAmount)} from ${taxableSleeve.label} to ${educationSleeve.label}.`
          : "529 funding review: taxable sleeve lacked enough available cash for a planned contribution."
      );
      const nextClients = state.clients.map((entry) => (entry.id === clientId ? updatedClient : entry));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        tradeFeedback: {
          ...buildTradeFeedback(
            transferResult.movedAmount > 0 ? `${client.name} education funding` : `${client.name} education funding paused`,
            transferResult.movedAmount > 0
              ? `${formatCurrency(transferResult.movedAmount)} moved into the 529 sleeve for the selected education plan.`
              : "No education contribution was made because the taxable sleeve does not have enough available liquidity right now.",
            transferResult.movedAmount > 0 ? "positive" : "warning"
          ),
          bullets: [
            `Source sleeve: ${taxableSleeve.label}`,
            `Destination sleeve: ${educationSleeve.label}`,
            `${educationSleeve.label} balance is now ${formatCurrency(getSleeveCashBalance(updatedClient, educationSleeve.id))}.`
          ]
        },
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          `${client.name} education funding note`,
          "Document the education-planning contribution, why it fit the family timeline, and how the household reserve still supports other goals.",
          transferResult.movedAmount > 0
            ? `Moved ${formatCurrency(transferResult.movedAmount)} from ${taxableSleeve.label} to ${educationSleeve.label} to support the education timeline while preserving the broader household plan.`
            : `Education contribution was reviewed, but taxable liquidity was not strong enough to move funds into ${educationSleeve.label} without pressuring the household reserve.`
        )
      });
    },
    runTaxManagementAction: (clientId, action) => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client) {
        return;
      }

      const snapshot = buildTaxManagementSnapshot(client, state.tickers);
      const memo =
        action === "harvest-losses"
          ? snapshot.harvestCandidates.length > 0
            ? `Reviewed taxable loss-harvesting candidates for ${client.name}: ${snapshot.harvestCandidates.map((row) => row.ticker).join(", ")}. Any harvest recommendation should still respect replacement exposure and wash-sale limits.`
            : `Reviewed loss-harvesting opportunities for ${client.name}, but there are no meaningful taxable loss candidates at the moment.`
          : `Reviewed taxable gain budget for ${client.name}. Net taxable gain is ${formatCurrency(Math.max(0, snapshot.netTaxableGain))} against a working annual budget of ${formatCurrency(snapshot.gainBudgetUsd)}.`;
      const nextClients = state.clients.map((entry) => (
        entry.id === clientId
          ? appendClientNote(updateClientNarrative(entry, state.tickers, 2, memo), memo)
          : entry
      ));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        tradeFeedback: {
          ...buildTradeFeedback(
            action === "harvest-losses" ? `${client.name} tax-loss review` : `${client.name} gain-budget review`,
            memo,
            "neutral"
          ),
          bullets:
            action === "harvest-losses"
              ? snapshot.harvestCandidates.length > 0
                ? snapshot.harvestCandidates.map((row) => `${row.ticker}: ${formatCurrency(Math.abs(row.unrealized))} unrealized loss`)
                : ["No significant taxable loss candidates are available right now."]
              : [
                  `Taxable unrealized gains: ${formatCurrency(snapshot.unrealizedGainTotal)}`,
                  `Taxable unrealized losses: ${formatCurrency(snapshot.unrealizedLossTotal)}`,
                  `Budget status: ${snapshot.gainBudgetLabel}`
                ]
        },
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          `${client.name} tax management memo`,
          action === "harvest-losses"
            ? "Document the taxable loss-harvesting review, any replacement-exposure considerations, and whether wash-sale risk was discussed."
            : "Document the gain-budget review, how much taxable gain room remains, and how future realizations should be paced.",
          memo
        )
      });
    },
    resolveClientMeeting: (optionId) => {
      const state = get();
      const meeting = state.activeClientMeeting;

      if (!meeting || meeting.resolved) {
        return;
      }

      const client = state.clients.find((entry) => entry.id === meeting.clientId);

      if (!client) {
        commit({ activeClientMeeting: null });
        return;
      }

      const chosen = meeting.options.find((entry) => entry.id === optionId);
      const nextClients = state.clients.map((entry) =>
        entry.id === meeting.clientId ? applyClientMeetingChoice(entry, meeting, optionId, state.tickers) : entry
      );
      const projectedIncome = client.cashFlow.monthlyIncome + (chosen?.incomeDelta ?? 0);
      const projectedOutflow =
        client.cashFlow.monthlyExpenses +
        client.cashFlow.monthlyDebtPayments +
        (chosen?.expenseDelta ?? 0) +
        (chosen?.debtPaymentDelta ?? 0);

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeClientMeeting: {
          ...meeting,
          resolved: true,
          selectedOptionId: optionId,
          feedback: chosen?.outcome ?? "Client meeting resolved."
        },
        tradeFeedback: chosen
          ? {
              ...buildTradeFeedback(`${client.name} meeting updated`, chosen.outcome, chosen.trustDelta >= 0 ? "positive" : "warning"),
              bullets: [
                `Cash flow now points to ${formatCurrency(projectedIncome)} monthly income and ${formatCurrency(projectedOutflow)} monthly outflow.`,
                `Liquidity need is now ${chosen.liquidityNeed ?? client.cashFlow.nearTermLiquidityNeed}.`,
                `${meeting.meetingKind === "review" ? "Annual review focus" : "Next IPS review focus"}: ${client.investmentPolicy.nextReviewFocus}`
              ]
            }
          : state.tradeFeedback,
        activeDocumentationPrompt: chosen
          ? buildDocumentationPrompt(
              client.id,
              `${client.name} ${meeting.meetingKind === "review" ? "review" : "meeting"} note`,
              "Document the planning change and why the guidance fit the client’s household needs.",
              `${chosen.outcome} Planning follow-up should focus on cash flow, liquidity, and the next review checkpoint.`
            )
          : state.activeDocumentationPrompt
      });
    },
    closeClientMeeting: () => commit({ activeClientMeeting: null }),
    resolveAccountTransferRequest: (optionId) => {
      const state = get();
      const request = state.activeAccountTransferRequest;

      if (!request || request.resolved) {
        return;
      }

      const client = state.clients.find((entry) => entry.id === request.clientId);

      if (!client) {
        commit({ activeAccountTransferRequest: null });
        return;
      }

      const chosen = request.options.find((entry) => entry.id === optionId);
      const transferResult = applyAccountTransferChoice(client, request, optionId, state.tickers);
      const nextClients = state.clients.map((entry) => (
        entry.id === client.id ? transferResult.client : entry
      ));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeAccountTransferRequest: {
          ...request,
          resolved: true,
          selectedOptionId: optionId,
          feedback: transferResult.feedback
        },
        tradeFeedback: {
          ...buildTradeFeedback(
            `${client.name} transfer request`,
            transferResult.feedback,
            (chosen?.trustDelta ?? 0) >= 0 ? "positive" : "warning"
          ),
          bullets: chosen
            ? [
                chosen.fromSleeveId && chosen.toSleeveId
                  ? `Route: ${client.accountSleeves.find((sleeve) => sleeve.id === chosen.fromSleeveId)?.label ?? "source"} -> ${client.accountSleeves.find((sleeve) => sleeve.id === chosen.toSleeveId)?.label ?? "destination"}`
                  : "No sleeve movement was executed.",
                `${transferResult.movedLongCount} long positions moved`,
                `${transferResult.movedShortCount} short positions moved`
              ]
            : []
        },
        activeDocumentationPrompt: chosen
          ? buildDocumentationPrompt(
              client.id,
              `${client.name} rollover / transfer note`,
              "Document the client's request, the account sleeves involved, any tax or beneficiary considerations, and the next follow-up step.",
              chosen.noteHint ?? `${transferResult.feedback} Follow-up should confirm registration, beneficiary, and tax-treatment alignment.`
            )
          : state.activeDocumentationPrompt
      });
    },
    closeAccountTransferRequest: () => commit({ activeAccountTransferRequest: null }, { touchSave: false }),
    resolveOperationsRequest: (optionId) => {
      const state = get();
      const request = state.activeOperationsRequest;

      if (!request || request.resolved) {
        return;
      }

      const client = state.clients.find((entry) => entry.id === request.clientId);
      if (!client) {
        commit({ activeOperationsRequest: null });
        return;
      }

      const chosen = request.options.find((entry) => entry.id === optionId);
      const result = applyOperationsRequestChoice(client, request, optionId, state.tickers);
      const nextClients = state.clients.map((entry) => (entry.id === client.id ? result.client : entry));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeOperationsRequest: {
          ...request,
          resolved: true,
          selectedOptionId: optionId,
          feedback: result.feedback
        },
        tradeFeedback: {
          ...buildTradeFeedback(
            `${client.name} service request`,
            result.feedback,
            (chosen?.trustDelta ?? 0) >= 0 ? "positive" : "warning"
          ),
          bullets: chosen
            ? [
                ...(chosen.cashDelta
                  ? [`Client cash moved ${chosen.cashDelta >= 0 ? "up" : "down"} by ${formatCurrency(Math.abs(chosen.cashDelta))}`]
                  : []),
                ...(chosen.fromSleeveId && chosen.toSleeveId && chosen.transferAmount
                  ? [`Sleeve flow: ${client.accountSleeves.find((sleeve) => sleeve.id === chosen.fromSleeveId)?.label ?? "source"} -> ${client.accountSleeves.find((sleeve) => sleeve.id === chosen.toSleeveId)?.label ?? "destination"} | ${formatCurrency(result.movedAmount ?? chosen.transferAmount)}`]
                  : [])
              ]
            : []
        },
        activeDocumentationPrompt: chosen
          ? buildDocumentationPrompt(
              client.id,
              `${client.name} ${request.requestKind === "rmd" ? "distribution" : "service workflow"} note`,
              request.requestKind === "rmd"
                ? "Document the retirement distribution amount, source and destination sleeves, withdrawal rationale, and any tax follow-up."
                : "Document the maintenance or service request, the action taken, and any follow-up tasks that remain open.",
              chosen.noteHint ?? `${result.feedback} Record the operational change, the client request, and the next service checkpoint.`
            )
          : state.activeDocumentationPrompt
      });
    },
    closeOperationsRequest: () => commit({ activeOperationsRequest: null }, { touchSave: false }),
    startRecommendationDialogue: (clientId, recommendationId) => {
      const state = get();
      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client) {
        return;
      }

      const dialogue = getRecommendationDialogue(client, recommendationId, state.activeDifficulty);
      if (!dialogue) {
        return;
      }

      commit({
        activeRecommendationDialogue: dialogue
      }, { touchSave: false });
    },
    resolveRecommendationDialogue: (optionId) => {
      const state = get();
      const dialogue = state.activeRecommendationDialogue;

      if (!dialogue || dialogue.resolved) {
        return;
      }

      const client = state.clients.find((entry) => entry.id === dialogue.clientId);
      const option = dialogue.options.find((entry) => entry.id === optionId);

      if (!client || !option) {
        commit({ activeRecommendationDialogue: null }, { touchSave: false });
        return;
      }

      const updatedClient = appendClientNote(
        updateClientNarrative(client, state.tickers, option.trustDelta, option.outcome),
        `${dialogue.title}: ${option.followUpTask}`
      );
      const nextClients = state.clients.map((entry) => (entry.id === client.id ? updatedClient : entry));

      commit({
        clients: nextClients,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeRecommendationDialogue: {
          ...dialogue,
          resolved: true,
          selectedOptionId: optionId,
          accepted: option.accepted,
          feedback: option.outcome
        },
        tradeFeedback: {
          ...buildTradeFeedback(
            `${client.name} recommendation`,
            option.outcome,
            option.accepted ? "positive" : option.trustDelta >= 0 ? "neutral" : "warning"
          ),
          bullets: [option.followUpTask]
        },
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          `${client.name} recommendation note`,
          "Document the recommendation, the client objection or question, the response you gave, and the follow-up task.",
          `${option.outcome} Follow-up: ${option.followUpTask}.`
        )
      });
    },
    closeRecommendationDialogue: () => commit({ activeRecommendationDialogue: null }, { touchSave: false }),
    resolveSupervisionRequest: (optionId) => {
      const state = get();
      const request = state.activeSupervisionRequest;

      if (!request || request.resolved) {
        return;
      }

      const client = state.clients.find((entry) => entry.id === request.clientId);
      const option = request.options.find((entry) => entry.id === optionId);

      if (!client || !option) {
        commit({ activeSupervisionRequest: null }, { touchSave: false });
        return;
      }

      const result = applySupervisionChoice(client, request, optionId, state.tickers);
      const nextClients = state.clients.map((entry) => (entry.id === client.id ? result.client : entry));
      const nextSecMeter = Math.max(0, Math.min(100, state.secMeterLevel + result.secDelta));

      commit({
        clients: nextClients,
        secMeterLevel: nextSecMeter,
        totalAum: computeTotalAum(nextClients, state.tickers),
        activeSupervisionRequest: {
          ...request,
          resolved: true,
          selectedOptionId: optionId,
          feedback: result.feedback
        },
        tradeFeedback: {
          ...buildTradeFeedback(
            `${client.name} supervision review`,
            result.feedback,
            result.secDelta <= 0 ? "positive" : "warning"
          ),
          bullets: [`SEC scrutiny ${result.secDelta >= 0 ? "+" : ""}${result.secDelta}`]
        },
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          `${client.name} supervision note`,
          "Document the supervisory issue, the remediation decision, and how the account will be monitored going forward.",
          option.noteHint ?? `${result.feedback} Supervisory follow-up should track suitability, concentration, and documentation discipline.`
        )
      });
    },
    closeSupervisionRequest: () => commit({ activeSupervisionRequest: null }, { touchSave: false }),
    updateDocumentationNote: (value) => {
      const prompt = get().activeDocumentationPrompt;
      if (!prompt) {
        return;
      }
      commit({
        activeDocumentationPrompt: {
          ...prompt,
          noteText: value
        }
      }, { touchSave: false });
    },
    saveDocumentationNote: () => {
      const state = get();
      const prompt = state.activeDocumentationPrompt;
      if (!prompt) {
        return;
      }
      const note = prompt.noteText.trim() || prompt.suggestedNote;
      const nextClients = state.clients.map((client) => (
        client.id === prompt.clientId
          ? appendClientNote(client, note)
          : client
      ));
      commit({
        clients: nextClients,
        activeDocumentationPrompt: null,
        tradeFeedback: buildTradeFeedback("Client note saved", "The recommendation was documented in the client file.", "positive")
      });
    },
    dismissDocumentationPrompt: () => commit({ activeDocumentationPrompt: null }, { touchSave: false }),
    resolveBehaviorEvent: (optionId) => {
      const state = get();
      const event = state.activeBehaviorEvent;
      if (!event || event.resolved) {
        return;
      }
      const option = event.options.find((entry) => entry.id === optionId);
      if (!option) {
        return;
      }
      const affectedClient = state.clients.find((entry) => entry.id === event.clientId);
      const nextClients = state.clients.map((client) => (
        client.id === event.clientId
          ? appendClientNote(
              updateClientNarrative(client, state.tickers, option.trustDelta, option.outcome, option.trustDelta >= 0 ? "satisfied" : "pending"),
              option.outcome
            )
          : client
      ));
      commit({
        clients: nextClients,
        activeBehaviorEvent: {
          ...event,
          resolved: true,
          selectedOptionId: optionId,
          feedback: option.outcome
        },
        activeDocumentationPrompt: affectedClient
          ? buildDocumentationPrompt(
              affectedClient.id,
              `${affectedClient.name} behavior coaching note`,
              "Document the behavioral coaching moment, the advice you gave, and how it tied back to the client plan.",
              option.noteHint ?? `${option.outcome} Reinforced the client's IPS, behavioral risks, and any exception limits discussed.`
            )
          : null,
        tradeFeedback: {
          ...buildTradeFeedback("Behavior coaching logged", option.outcome, option.trustDelta >= 0 ? "positive" : "warning"),
          bullets: ["Client behavior coaching can be as important as asset selection in preserving mandate discipline."]
        }
      });
    },
    closeBehaviorEvent: () => commit({ activeBehaviorEvent: null }, { touchSave: false }),
    startInsuranceRecommendation: (clientId, insuranceId) => {
      const scenario = getInsuranceDialogue(clientId, insuranceId);

      if (!scenario) {
        return;
      }

      commit({
        activeInsuranceDialogue: {
          clientId: scenario.clientId,
          insuranceId: scenario.insuranceId,
          title: scenario.title,
          prompts: scenario.prompts,
          stepIndex: 0,
          selectedIndex: null,
          score: 0,
          answered: false,
          completed: false,
          accepted: null,
          feedback: null
        }
      });
    },
    answerInsuranceDialogue: (selectedIndex) => {
      const state = get();
      const dialogue = state.activeInsuranceDialogue;

      if (!dialogue || dialogue.completed || dialogue.answered) {
        return;
      }

      const prompt = dialogue.prompts[dialogue.stepIndex];
      const isCorrect = selectedIndex === prompt.correct;

      commit({
        activeInsuranceDialogue: {
          ...dialogue,
          selectedIndex,
          answered: true,
          score: dialogue.score + (isCorrect ? 1 : 0),
          feedback: prompt.explanation
        }
      }, { touchSave: false });
    },
    advanceInsuranceDialogue: () => {
      const state = get();
      const dialogue = state.activeInsuranceDialogue;

      if (!dialogue) {
        return;
      }

      if (!dialogue.answered) {
        commit({ activeInsuranceDialogue: null }, { touchSave: false });
        return;
      }

      const isLastPrompt = dialogue.stepIndex >= dialogue.prompts.length - 1;

      if (!isLastPrompt) {
        commit({
          activeInsuranceDialogue: {
            ...dialogue,
            stepIndex: dialogue.stepIndex + 1,
            selectedIndex: null,
            answered: false,
            feedback: null
          }
        }, { touchSave: false });
        return;
      }

      const client = state.clients.find((entry) => entry.id === dialogue.clientId);
      if (!client) {
        commit({ activeInsuranceDialogue: null }, { touchSave: false });
        return;
      }

      const accepted = dialogue.score >= Math.ceil(dialogue.prompts.length / 2);
      const updatedClient = accepted
        ? recommendInsuranceForClient(client, dialogue.insuranceId, state.tickers, state.activeDifficulty)
        : deferInsuranceForClient(client, dialogue.insuranceId, state.tickers);
      const outcomeNote = accepted
        ? `${client.name.split(" ")[0]} understood the recommendation and is open to moving forward.`
        : `${client.name.split(" ")[0]} still is not convinced, so the recommendation is on hold for now.`;

      commit({
        clients: state.clients.map((entry) => (entry.id === client.id ? updatedClient : entry)),
        activeInsuranceDialogue: {
          ...dialogue,
          completed: true,
          accepted,
          feedback: outcomeNote
        },
        activeDocumentationPrompt: buildDocumentationPrompt(
          client.id,
          `${client.name} insurance note`,
          "Document the recommendation, the client’s questions, and whether the coverage fit the household plan.",
          `${outcomeNote} Coverage discussed: ${dialogue.insuranceId}.`
        )
      });
    },
    closeInsuranceDialogue: () => {
      commit({ activeInsuranceDialogue: null }, { touchSave: false });
    },
    recommendInsurance: (clientId, insuranceId) => {
      const state = get();

      commit({
        clients: state.clients.map((client) =>
          client.id === clientId
            ? recommendInsuranceForClient(client, insuranceId, state.tickers, state.activeDifficulty)
            : client
        )
      });
    },
    deferInsurance: (clientId, insuranceId) => {
      const state = get();

      commit({
        clients: state.clients.map((client) =>
          client.id === clientId
            ? deferInsuranceForClient(client, insuranceId, state.tickers)
            : client
        )
      });
    },
    submitOrder: ({ ticker, direction, quantity, clientId, accountId, mode }) => {
      const state = get();
      const asset = state.tickers[ticker];
      const marginEnabled = isMarginDifficulty(state.activeDifficulty);
      const shortEnabled = allowsShortSelling(state.activeDifficulty);
      const canMarginAsset = asset ? isMarginableTicker(asset.category) : false;

      if (!asset || quantity <= 0) {
        return;
      }

      if (mode === "margin" && (!marginEnabled || !canMarginAsset)) {
        commit({
          tradeFeedback: buildTradeFeedback(
            "Margin not available",
            "This difficulty or instrument does not support margin trading.",
            "warning"
          )
        });
        return;
      }

      if (clientId === "player") {
        if (state.playerGameOver || state.playerTradeStatus === "incarcerated" || state.playerSuspensionRounds > 0) {
          return;
        }

        const totalCost = asset.price * quantity;
        const nextSleeveCashBalances = { ...state.personalSleeveCashBalances };
        const nextHoldings = { ...state.personalHoldings };
        const nextHoldingAccountMap = { ...state.personalHoldingAccountMap };
        const nextShortHoldings = { ...state.personalShortHoldings };
        const nextShortHoldingAccountMap = { ...state.personalShortHoldingAccountMap };
        let nextCash = state.personalPortfolioUsd;
        let nextSleeveCash = nextSleeveCashBalances[accountId] ?? 0;
        let nextDebt = state.personalMarginDebt;
        let detail = "";

        const currentLongKey = findPositionKeyForSleeve(nextHoldings, nextHoldingAccountMap, ticker, accountId);
        const currentShortKey = findPositionKeyForSleeve(nextShortHoldings, nextShortHoldingAccountMap, ticker, accountId);
        const currentLong = currentLongKey ? nextHoldings[currentLongKey] : undefined;
        const currentShort = currentShortKey ? nextShortHoldings[currentShortKey] : undefined;

        if (direction === "buy") {
          const coverShares = Math.min(quantity, currentShort?.shares ?? 0);
          if (coverShares > 0) {
            const coverCost = coverShares * asset.price;
            if (mode === "cash" && coverCost > nextSleeveCash) {
              commit({
                tradeFeedback: buildTradeFeedback("Not enough cash to cover short", `Covering ${coverShares} ${ticker} needs ${formatCurrency(coverCost)}.`, "warning")
              });
              return;
            }
            const sleeveCashUsed = Math.min(nextSleeveCash, coverCost);
            nextSleeveCash -= sleeveCashUsed;
            nextCash -= sleeveCashUsed;
            if (coverCost > sleeveCashUsed) {
              nextDebt += coverCost - sleeveCashUsed;
            } else {
              nextDebt = Number(nextDebt.toFixed(2));
            }
            const remainingShort = (currentShort?.shares ?? 0) - coverShares;
            if (remainingShort <= 0) {
              if (currentShortKey) {
                delete nextShortHoldings[currentShortKey];
                delete nextShortHoldingAccountMap[currentShortKey];
              }
            } else {
              if (currentShortKey) {
                nextShortHoldings[currentShortKey] = { ...currentShort!, shares: remainingShort };
              }
            }
            detail = `Covered ${coverShares} ${ticker}`;
          }

          const buyShares = quantity - coverShares;
          if (buyShares > 0) {
            const buyCost = buyShares * asset.price;
            if (mode === "cash" && buyCost > nextSleeveCash) {
              commit({
                tradeFeedback: buildTradeFeedback("Player order rejected", `The order needs ${formatCurrency(buyCost)}, but only ${formatCurrency(nextSleeveCash)} is available in that player sleeve.`, "warning")
              });
              return;
            }
            if (mode === "margin") {
              const availableExposure = computeAvailableMarginExposure(nextCash, nextHoldings, nextShortHoldings, nextDebt, state.tickers);
              if (buyCost > availableExposure) {
                commit({
                  tradeFeedback: buildTradeFeedback("Margin buying power exceeded", `Only ${formatCurrency(availableExposure)} of additional exposure is available right now.`, "warning")
                });
                return;
              }
            }
            const sleeveCashUsed = Math.min(nextSleeveCash, buyCost);
            nextSleeveCash -= sleeveCashUsed;
            nextCash -= sleeveCashUsed;
            if (buyCost > sleeveCashUsed) {
              nextDebt += buyCost - sleeveCashUsed;
            }
            const previousShares = currentLong?.shares ?? 0;
            const previousCost = currentLong?.averageCost ?? asset.price;
            const holdingKey = currentLongKey ?? createPositionKey(nextHoldings, ticker, accountId);
            nextHoldings[holdingKey] = {
              ticker,
              shares: previousShares + buyShares,
              averageCost: ((previousShares * previousCost) + buyCost) / Math.max(previousShares + buyShares, 1)
            };
            nextHoldingAccountMap[holdingKey] = accountId;
            detail = detail ? `${detail} and bought ${buyShares} long` : `Bought ${buyShares} ${ticker}`;
          }
        } else {
          const sellableLongShares = Math.min(quantity, currentLong?.shares ?? 0);
          if (sellableLongShares > 0) {
            const proceeds = sellableLongShares * asset.price;
            const debtReduction = Math.min(nextDebt, proceeds);
            nextDebt -= debtReduction;
            const netCashCredit = proceeds - debtReduction;
            nextCash += netCashCredit;
            nextSleeveCash += netCashCredit;
            const remainingLong = (currentLong?.shares ?? 0) - sellableLongShares;
            if (remainingLong <= 0) {
              if (currentLongKey) {
                delete nextHoldings[currentLongKey];
                delete nextHoldingAccountMap[currentLongKey];
              }
            } else {
              if (currentLongKey) {
                nextHoldings[currentLongKey] = { ...currentLong!, shares: remainingLong };
              }
            }
            detail = `Sold ${sellableLongShares} ${ticker}`;
          }

          const shortShares = quantity - sellableLongShares;
          if (shortShares > 0) {
            if (!(shortEnabled && mode === "margin")) {
              commit({
                tradeFeedback: buildTradeFeedback("Short sale not available", "Short selling is only enabled in Pro difficulty through the margin ticket.", "warning")
              });
              return;
            }
            const shortValue = shortShares * asset.price;
            const availableExposure = computeAvailableMarginExposure(nextCash, nextHoldings, nextShortHoldings, nextDebt, state.tickers);
            if (shortValue > availableExposure) {
              commit({
                tradeFeedback: buildTradeFeedback("Margin short limit exceeded", `Only ${formatCurrency(availableExposure)} of additional short exposure is available right now.`, "warning")
              });
              return;
            }
            const previousShares = currentShort?.shares ?? 0;
            const previousCost = currentShort?.averageCost ?? asset.price;
            const shortHoldingKey = currentShortKey ?? createPositionKey(nextShortHoldings, ticker, accountId);
            nextShortHoldings[shortHoldingKey] = {
              ticker,
              shares: previousShares + shortShares,
              averageCost: ((previousShares * previousCost) + shortValue) / Math.max(previousShares + shortShares, 1)
            };
            nextShortHoldingAccountMap[shortHoldingKey] = accountId;
            nextCash += shortValue;
            nextSleeveCash += shortValue;
            detail = detail ? `${detail} and sold short ${shortShares}` : `Sold short ${shortShares} ${ticker}`;
          }
        }

        nextSleeveCashBalances[accountId] = Number(nextSleeveCash.toFixed(2));
        const playerMargin = accountMarginRatio(nextCash, nextHoldings, nextShortHoldings, nextDebt, state.tickers);
        commit({
          personalPortfolioUsd: nextCash,
          personalSleeveCashBalances: normalizePersonalSleeveCashBalances(
            state.personalAccountSleeves,
            nextSleeveCashBalances,
            nextCash
          ),
          personalHoldings: nextHoldings,
          personalHoldingAccountMap: nextHoldingAccountMap,
          personalShortHoldings: nextShortHoldings,
          personalShortHoldingAccountMap: nextShortHoldingAccountMap,
          personalMarginDebt: nextDebt,
          personalMarginCall: playerMargin.exposure > 0 && playerMargin.ratio < getMaintenanceRequirement(state.activeDifficulty),
          tradeFeedback: buildTradeFeedback(
            mode === "margin" ? "Margin order filled" : "Player order filled",
            `${detail} at ${formatCurrency(totalCost)} notional in ${state.personalAccountSleeves.find((sleeve) => sleeve.id === accountId)?.label ?? "the personal book"}.`,
            "neutral"
          )
        });
        return;
      }

      const client = state.clients.find((entry) => entry.id === clientId);

      if (!client) {
        return;
      }

      const totalCost = asset.price * quantity;
      const nextClients = state.clients.map((entry) => {
        if (entry.id !== clientId) {
          return entry;
        }

        let nextClient: ClientAccount = {
          ...entry,
          holdings: { ...entry.holdings },
          shortHoldings: { ...(entry.shortHoldings ?? {}) },
          sleeveCashBalances: { ...entry.sleeveCashBalances },
          holdingAccountMap: { ...(entry.holdingAccountMap ?? {}) },
          shortHoldingAccountMap: { ...(entry.shortHoldingAccountMap ?? {}) }
        };

        let nextCash = nextClient.cash;
        let nextSleeveCash = getSleeveCashBalance(nextClient, accountId);
        let nextDebt = nextClient.marginDebt ?? 0;
        const currentLongKey = findPositionKeyForSleeve(nextClient.holdings, nextClient.holdingAccountMap, ticker, accountId);
        const currentShortKey = findPositionKeyForSleeve(nextClient.shortHoldings, nextClient.shortHoldingAccountMap, ticker, accountId);
        const currentLong = currentLongKey ? nextClient.holdings[currentLongKey] : undefined;
        const currentShort = currentShortKey ? nextClient.shortHoldings[currentShortKey] : undefined;
        let shortSale = false;

        if (direction === "buy") {
          const coverShares = Math.min(quantity, currentShort?.shares ?? 0);
          if (coverShares > 0) {
            const coverCost = coverShares * asset.price;
            if (mode === "cash" && coverCost > nextSleeveCash) {
              return entry;
            }
            const sleeveCashUsed = Math.min(nextSleeveCash, coverCost);
            nextSleeveCash -= sleeveCashUsed;
            nextCash -= sleeveCashUsed;
            if (coverCost > sleeveCashUsed) {
              nextDebt += coverCost - sleeveCashUsed;
            }
            const remainingShort = (currentShort?.shares ?? 0) - coverShares;
            if (remainingShort <= 0) {
              if (currentShortKey) {
                delete nextClient.shortHoldings[currentShortKey];
                delete nextClient.shortHoldingAccountMap[currentShortKey];
              }
            } else {
              if (currentShortKey) {
                nextClient.shortHoldings[currentShortKey] = { ...currentShort!, shares: remainingShort };
              }
            }
          }

          const buyShares = quantity - coverShares;
          if (buyShares > 0) {
            const buyCost = buyShares * asset.price;
            if (mode === "cash" && buyCost > nextSleeveCash) {
              return entry;
            }
            if (mode === "margin") {
              const availableExposure = computeAvailableMarginExposure(nextCash, nextClient.holdings, nextClient.shortHoldings, nextDebt, state.tickers);
              if (buyCost > availableExposure) {
                return entry;
              }
            }
            const sleeveCashUsed = Math.min(nextSleeveCash, buyCost);
            nextSleeveCash -= sleeveCashUsed;
            nextCash -= sleeveCashUsed;
            if (buyCost > sleeveCashUsed) {
              nextDebt += buyCost - sleeveCashUsed;
            }
            const previousShares = currentLong?.shares ?? 0;
            const previousCost = currentLong?.averageCost ?? asset.price;
            const holdingKey = currentLongKey ?? createPositionKey(nextClient.holdings, ticker, accountId);
            nextClient.holdings[holdingKey] = {
              ticker,
              shares: previousShares + buyShares,
              averageCost: ((previousShares * previousCost) + buyCost) / Math.max(previousShares + buyShares, 1)
            };
            nextClient.holdingAccountMap[holdingKey] = accountId;
          }
        } else {
          const sellableLongShares = Math.min(quantity, currentLong?.shares ?? 0);
          if (sellableLongShares > 0) {
            const proceeds = sellableLongShares * asset.price;
            const debtReduction = Math.min(nextDebt, proceeds);
            nextDebt -= debtReduction;
            const netCashCredit = proceeds - debtReduction;
            nextCash += netCashCredit;
            nextSleeveCash += netCashCredit;
            const remainingLong = (currentLong?.shares ?? 0) - sellableLongShares;
            if (remainingLong <= 0) {
              if (currentLongKey) {
                delete nextClient.holdings[currentLongKey];
                delete nextClient.holdingAccountMap[currentLongKey];
              }
            } else {
              if (currentLongKey) {
                nextClient.holdings[currentLongKey] = { ...currentLong!, shares: remainingLong };
              }
            }
          }

          const shortShares = quantity - sellableLongShares;
          if (shortShares > 0) {
            if (!(shortEnabled && mode === "margin")) {
              return entry;
            }
            const shortValue = shortShares * asset.price;
            const availableExposure = computeAvailableMarginExposure(nextCash, nextClient.holdings, nextClient.shortHoldings, nextDebt, state.tickers);
            if (shortValue > availableExposure) {
              return entry;
            }
            const previousShares = currentShort?.shares ?? 0;
            const previousCost = currentShort?.averageCost ?? asset.price;
            const shortHoldingKey = currentShortKey ?? createPositionKey(nextClient.shortHoldings, ticker, accountId);
            nextClient.shortHoldings[shortHoldingKey] = {
              ticker,
              shares: previousShares + shortShares,
              averageCost: ((previousShares * previousCost) + shortValue) / Math.max(previousShares + shortShares, 1)
            };
            nextClient.shortHoldingAccountMap[shortHoldingKey] = accountId;
            nextCash += shortValue;
            nextSleeveCash += shortValue;
            shortSale = true;
          }
        }

        nextClient = setSleeveCashBalance(nextClient, accountId, nextSleeveCash);
        nextClient.cash = nextCash;
        nextClient.marginDebt = nextDebt;
        const marginStatus = accountMarginRatio(nextCash, nextClient.holdings, nextClient.shortHoldings, nextDebt, state.tickers);
        nextClient.marginCall = marginStatus.exposure > 0 && marginStatus.ratio < getMaintenanceRequirement(state.activeDifficulty);

        const baseDecision = evaluateTradeSuitability(entry, asset, quantity, direction, state.tickers);
        const decision = withMarginDecisionAdjustment(baseDecision, entry, asset, mode, state.activeDifficulty, shortSale);
        const mandateSnapshot = buildMandateSnapshot(nextClient, state.tickers);
        const nextStatus: ClientStatus = decision.suitable ? (mandateSnapshot.score >= 65 ? "satisfied" : "pending") : "at-risk";
        const note = decision.suitable
          ? `${entry.name.split(" ")[0]} sees this ${mode === "margin" ? "leveraged " : ""}trade as aligned with the ${entry.goal.toLowerCase()} plan.`
          : decision.reasons[0] ?? `${entry.name.split(" ")[0]} is questioning whether this trade fits the mandate.`;

        return {
          ...nextClient,
          trustScore: clamp(entry.trustScore + (decision.suitable ? 5 : -10), 0, 100),
          mandateScore: mandateSnapshot.score,
          advisorNote: note,
          status: nextStatus
        };
      });

      const updatedClient = nextClients.find((entry) => entry.id === clientId) ?? client;
      const existingLongKeyInSelectedSleeve = findPositionKeyForSleeve(client.holdings, client.holdingAccountMap ?? {}, ticker, accountId);
      const effectiveDecision = withMarginDecisionAdjustment(
        evaluateTradeSuitability(client, asset, quantity, direction, state.tickers),
        client,
        asset,
        mode,
        state.activeDifficulty,
        direction === "sell" && !((existingLongKeyInSelectedSleeve ? client.holdings[existingLongKeyInSelectedSleeve]?.shares : 0) >= quantity)
      );
      const nextSecLevel = applyScrutinyLevel(state.secMeterLevel, effectiveDecision);
      const shouldTriggerAudit = nextSecLevel >= 100;
      const complianceStats = {
        suitabilityViolations: state.complianceStats.suitabilityViolations + (effectiveDecision.flags.includes("suitability") ? 1 : 0),
        riskOverrides: state.complianceStats.riskOverrides + (effectiveDecision.flags.includes("risk-override") ? 1 : 0),
        unsuitableProductPlacements:
          state.complianceStats.unsuitableProductPlacements + (effectiveDecision.flags.includes("unsuitable-product") ? 1 : 0),
        concentrationFlags: state.complianceStats.concentrationFlags + (effectiveDecision.flags.includes("concentration") ? 1 : 0)
      };

        commit({
          clients: nextClients,
          secMeterLevel: shouldTriggerAudit ? 100 : nextSecLevel,
          complianceStats,
          totalAum: computeTotalAum(nextClients, state.tickers),
          tradeFeedback: {
            ...buildTradeFeedback(
              effectiveDecision.suitable ? `${client.name} trade accepted` : `${client.name} trade flagged`,
              effectiveDecision.suitable
                ? `${ticker} ${mode === "margin" ? "margin " : ""}${direction} ${quantity} is live in ${client.accountSleeves.find((sleeve) => sleeve.id === accountId)?.label ?? "the selected account"}. ${updatedClient.marginCall ? "Margin stress is elevated." : "Trust is improving."}`
                : "The trade executed, but it triggered suitability scrutiny for this client profile.",
              effectiveDecision.suitable ? "positive" : "warning"
            ),
            bullets: effectiveDecision.suitable
              ? [
                  `Account sleeve: ${client.accountSleeves.find((sleeve) => sleeve.id === accountId)?.label ?? "Selected sleeve"}`,
                  `Memo: ${direction === "buy" ? "Build" : "Trim"} ${asset.name} inside the ${client.goal.toLowerCase()} plan with ${mode === "margin" ? "leveraged" : "cash"} funding.`
                ]
              : [...effectiveDecision.reasons.slice(0, 3), ...buildSuitabilityCoachingBullets(client, asset)]
          },
          activeDocumentationPrompt: buildDocumentationPrompt(
            client.id,
            effectiveDecision.suitable ? `${client.name} trade memo` : `${client.name} suitability note`,
            effectiveDecision.suitable
              ? "Document the recommendation, the selected sleeve, and why this trade fit the client objective, tax location, and IPS."
              : "This trade triggered suitability scrutiny. Document the rationale, the client's profile, and any corrective action.",
            effectiveDecision.suitable
              ? buildClientTradeMemo(client, ticker, direction, quantity, accountId, mode, true, asset.name)
              : `${ticker} was flagged for ${client.name} because ${effectiveDecision.reasons[0] ?? "the trade did not fit the client profile"}. Next step: revisit risk profile, beta exposure, and mandate fit.`
          )
        });

        if (shouldTriggerAudit) {
          const auditQuestion = pickAuditQuestion(state.questionTracker);
          const shuffled = shuffleQuestion(auditQuestion);
          commit({
            auditTriggered: true,
            auditQuestion: {
              question: auditQuestion,
              shuffledOptions: shuffled.shuffledOptions,
              displayCorrectIndex: shuffled.displayCorrectIndex,
              selectedIndex: null,
              answered: false
            }
          });
        }
    },
    tickMarket: () => {
      if (
        get().isPaused ||
        get().activeCycleRecap ||
        get().activeClientMeeting ||
        get().activeAccountTransferRequest ||
        get().activeOperationsRequest ||
        get().activeRecommendationDialogue ||
        get().activeSupervisionRequest ||
        get().activeBehaviorEvent ||
        get().activeDocumentationPrompt
      ) {
        return;
      }

      const state = marketEngine.simulateTick(1, 0.06, parseMarketDate(get().gameDateIso));
      const profiles = buildFinancialProfiles(state.tickers);

      commit((current) => ({
        tickers: state.tickers,
        histories: state.histories,
        currentEvent: state.currentEvent?.title ?? null,
        financialProfiles: profiles,
        totalAum: computeTotalAum(current.clients, state.tickers),
        revenueSnapshot: buildRevenueSnapshot(current.clients, state.tickers, current.revenueSnapshot.trailingCycleRevenue)
      }), { touchSave: false });
    },
    tickTimer: () => {
      const state = get();
      if (
        state.isPaused ||
        state.activeCycleRecap ||
        state.activeClientMeeting ||
        state.activeAccountTransferRequest ||
        state.activeOperationsRequest ||
        state.activeRecommendationDialogue ||
        state.activeSupervisionRequest ||
        state.activeBehaviorEvent ||
        state.activeDocumentationPrompt
      ) {
        return;
      }

      if (state.timerSeconds <= 1) {
        const previousClientTotal = computeTotalAum(state.clients, state.tickers);
        const previousPersonalTotal = computePersonalNetWorth(
          state.personalPortfolioUsd,
          state.personalHoldings,
          state.personalShortHoldings,
          state.personalMarginDebt,
          state.tickers
        );
        const nextGameDateIso = advanceTradingDate(state.gameDateIso);
        marketEngine.refreshStructuralTerms(state.cycleNumber + 1);
        const nextMarket = marketEngine.simulateTick(1, 0.06, parseMarketDate(nextGameDateIso));
        const nextSuspensionRounds = Math.max(0, state.playerSuspensionRounds - 1);
        const nextPlayerStatus =
          state.playerTradeStatus === "suspended" && nextSuspensionRounds === 0 ? "clear" : state.playerTradeStatus;
        const nextInsiderEvent =
          state.activeInsiderEvent ?? (!state.playerGameOver && Math.random() < 0.35 ? createInsiderInfoEvent(nextMarket.tickers) : null);
        const nextCycleNumber = state.cycleNumber + 1;
        const nextRates = buildInterestRateSnapshot(nextCycleNumber, state.selectedChartPeriod);
        const profiles = buildFinancialProfiles(nextMarket.tickers);
        const dividendState = applyDividendPayouts(
          state.clients,
          state.personalPortfolioUsd,
          state.personalAccountSleeves,
          state.personalSleeveCashBalances,
          state.personalHoldings,
          state.personalHoldingAccountMap,
          nextMarket.tickers,
          nextCycleNumber
        );
        const currentEventTitle = nextMarket.currentEvent?.title ?? null;
        const marginClientState = resolveMarginPressureForClients(dividendState.clients, nextMarket.tickers, state.activeDifficulty);
        const clientCycleState = evaluateClientCycleState(marginClientState.clients, nextMarket.tickers);
        const nextClientTotal = computeTotalAum(clientCycleState.updatedClients, nextMarket.tickers);
        const playerMarginState = resolvePlayerMarginPressure(
          dividendState.personalPortfolioUsd,
          dividendState.personalHoldings,
          state.personalShortHoldings,
          state.personalMarginDebt,
          state.personalMarginCall,
          nextMarket.tickers,
          state.activeDifficulty
        );
        const nextPersonalTotal = computePersonalNetWorth(
          playerMarginState.personalPortfolioUsd,
          playerMarginState.personalHoldings,
          playerMarginState.personalShortHoldings,
          playerMarginState.personalMarginDebt,
          nextMarket.tickers
        );
        const nextCycleSummary = buildCycleSummary(
          nextMarket.tickers,
          nextCycleNumber,
          currentEventTitle,
          nextPersonalTotal - previousPersonalTotal,
          nextClientTotal - previousClientTotal,
          [
            ...marginClientState.alerts,
            ...(playerMarginState.alert ? [playerMarginState.alert] : []),
            ...clientCycleState.alerts,
            ...(dividendState.personalCashDividends > 0 || dividendState.personalStockDividends > 0
              ? [
                  `Player portfolio dividends: +${formatCurrency(dividendState.personalCashDividends)} cash${
                    dividendState.personalStockDividends > 0 ? ` and +${dividendState.personalStockDividends.toFixed(4)} shares` : ""
                  }.`
                ]
              : []),
            ...(dividendState.clientCashDividends > 0 ? [`Client portfolios dividends: +${formatCurrency(dividendState.clientCashDividends)} cash across managed accounts.`] : [])
          ],
          clientCycleState.lostClientNames
        );
        const nextRevenueSnapshot = buildRevenueSnapshot(
          clientCycleState.updatedClients,
          nextMarket.tickers,
          state.revenueSnapshot.trailingCycleRevenue
        );
        const workflowOpen = nextCycleNumber >= state.workflowCooldownUntilCycle;
        const nextActiveClientId = clientCycleState.updatedClients.some((client) => client.id === state.activeClientId)
          ? state.activeClientId
          : clientCycleState.updatedClients[0]?.id ?? null;
        const meetingCandidate =
          workflowOpen &&
          !state.auditTriggered &&
          !state.activeInsuranceDialogue &&
          !state.activeInsiderEvent &&
          nextActiveClientId &&
          Math.random() < 0.14
            ? clientCycleState.updatedClients.find((client) => client.id === nextActiveClientId) ?? null
            : null;
        const behaviorCandidate =
          workflowOpen &&
          !meetingCandidate &&
          !state.auditTriggered &&
          !state.activeInsuranceDialogue &&
          !state.activeInsiderEvent &&
          nextActiveClientId &&
          Math.random() < 0.12
            ? clientCycleState.updatedClients.find((client) => client.id === nextActiveClientId) ?? null
            : null;
        const transferCandidate =
          workflowOpen &&
          !meetingCandidate &&
          !behaviorCandidate &&
          !state.auditTriggered &&
          !state.activeInsuranceDialogue &&
          !state.activeInsiderEvent &&
          nextActiveClientId &&
          Math.random() < 0.1
            ? clientCycleState.updatedClients.find((client) => client.id === nextActiveClientId) ?? null
            : null;
        const transferRequest = transferCandidate
          ? getAccountTransferRequest(transferCandidate, state.activeDifficulty, nextCycleNumber)
          : null;
        const operationsCandidate =
          workflowOpen &&
          !meetingCandidate &&
          !behaviorCandidate &&
          !transferRequest &&
          !state.auditTriggered &&
          !state.activeInsuranceDialogue &&
          !state.activeInsiderEvent &&
          nextActiveClientId &&
          Math.random() < 0.1
            ? clientCycleState.updatedClients.find((client) => client.id === nextActiveClientId) ?? null
            : null;
        const operationsRequest = operationsCandidate
          ? getOperationsRequest(operationsCandidate, state.activeDifficulty, nextCycleNumber)
          : null;
        const supervisionCandidate =
          workflowOpen &&
          !meetingCandidate &&
          !behaviorCandidate &&
          !transferRequest &&
          !operationsRequest &&
          !state.auditTriggered &&
          !state.activeInsuranceDialogue &&
          !state.activeInsiderEvent &&
          !state.activeRecommendationDialogue &&
          nextActiveClientId &&
          (
            state.secMeterLevel >= 40 ||
            clientCycleState.updatedClients.some((client) => client.status === "at-risk" && client.id === nextActiveClientId)
          ) &&
          Math.random() < 0.16
            ? clientCycleState.updatedClients.find((client) => client.id === nextActiveClientId) ?? null
            : null;
        const supervisionRequest = supervisionCandidate
          ? buildSupervisionRequest(supervisionCandidate, nextCycleNumber)
          : null;
        const triggeredWorkflowKind =
          meetingCandidate ? "meeting" :
          behaviorCandidate ? "behavior" :
          transferRequest ? "transfer" :
          operationsRequest ? "operations" :
          supervisionRequest ? "supervision" :
          null;
        const nextWorkflowCooldownUntilCycle =
          triggeredWorkflowKind
            ? nextCycleNumber + workflowCooldownIncrement(triggeredWorkflowKind, state.activeDifficulty)
            : state.workflowCooldownUntilCycle;

        commit((current) => ({
          timerSeconds: 15 * 60,
          gameDateIso: nextGameDateIso,
          tickers: nextMarket.tickers,
          histories: nextMarket.histories,
          currentEvent: currentEventTitle,
          cycleNumber: nextCycleNumber,
          workflowCooldownUntilCycle: nextWorkflowCooldownUntilCycle,
          lastMarketRefreshAt: Date.now(),
          lastCycleSummary: nextCycleSummary,
          activeCycleRecap: nextCycleSummary,
          interestRates: nextRates,
          revenueSnapshot: nextRevenueSnapshot,
          financialProfiles: profiles,
          totalAum: nextClientTotal,
          clients: clientCycleState.updatedClients,
          personalPortfolioUsd: playerMarginState.personalPortfolioUsd,
          personalSleeveCashBalances: dividendState.personalSleeveCashBalances,
          personalHoldings: playerMarginState.personalHoldings,
          personalShortHoldings: playerMarginState.personalShortHoldings,
          personalMarginDebt: playerMarginState.personalMarginDebt,
          personalMarginCall: playerMarginState.personalMarginCall,
          activeClientId: nextActiveClientId,
          removedClientIds: [
            ...current.removedClientIds,
            ...clientCycleState.lostClientNames
              .map((name) => current.clients.find((client) => client.name === name)?.id)
              .filter((id): id is string => Boolean(id))
          ],
          playerSuspensionRounds: nextSuspensionRounds,
          playerTradeStatus: nextPlayerStatus,
          activeInsiderEvent: nextInsiderEvent,
          activeClientMeeting: meetingCandidate ? getClientMeetingScenario(meetingCandidate, state.activeDifficulty, nextCycleNumber) : current.activeClientMeeting,
          activeAccountTransferRequest: transferRequest ?? current.activeAccountTransferRequest,
          activeOperationsRequest: operationsRequest ?? current.activeOperationsRequest,
          activeSupervisionRequest: supervisionRequest ?? current.activeSupervisionRequest,
          activeBehaviorEvent: behaviorCandidate ? getBehaviorScenario(behaviorCandidate, state.activeDifficulty, nextCycleNumber) : current.activeBehaviorEvent
        }));
        return;
      }

      const nextTimerSeconds = state.timerSeconds - 1;

      if (hasAdvancedMarketStep(state.timerSeconds, nextTimerSeconds, 15 * 60)) {
        const marketDateTime = deriveMarketDateTime(state.gameDateIso, nextTimerSeconds, 15 * 60);
        const nextMarket = marketEngine.simulateTick(1, 0.025, marketDateTime);
        const profiles = buildFinancialProfiles(nextMarket.tickers);

        commit((current) => ({
          timerSeconds: nextTimerSeconds,
          tickers: nextMarket.tickers,
          histories: nextMarket.histories,
          currentEvent: nextMarket.currentEvent?.title ?? null,
          financialProfiles: profiles,
          totalAum: computeTotalAum(current.clients, nextMarket.tickers),
          revenueSnapshot: buildRevenueSnapshot(current.clients, nextMarket.tickers, current.revenueSnapshot.trailingCycleRevenue)
        }), { touchSave: false });
        return;
      }

      commit({ timerSeconds: nextTimerSeconds }, { touchSave: false });
    },
    unlockResearch: (symbol) => {
      const state = get();
      if (
        state.activeDifficulty === "learner" ||
        state.activeDifficulty === "trainee" ||
        state.activeDifficulty === "associate" ||
        state.researchUnlocks[symbol]
      ) {
        return;
      }

      commit({
        score: state.score - 5,
        researchUnlocks: {
          ...state.researchUnlocks,
          [symbol]: true
        }
      });
    },
    resolveAudit: (selectedIndex) => {
      const state = get();
      const active = state.auditQuestion;

      if (!active.question || active.answered) {
        return;
      }

      const passed = selectedIndex === active.displayCorrectIndex;
      const now = Date.now();
      const secondAuditWithinWindow = state.auditHistory.some((entry) => now - entry.askedAt < 5 * 60 * 1000);
      const removedClientId = secondAuditWithinWindow
        ? state.clients.find((client) => !state.removedClientIds.includes(client.id))?.id ?? null
        : null;
      const nextClients = removedClientId ? state.clients.filter((client) => client.id !== removedClientId) : state.clients;
      const nextActiveClientId =
        removedClientId && state.activeClientId === removedClientId ? nextClients[0]?.id ?? null : state.activeClientId;

      commit({
        score: state.score + (passed ? 50 : -active.question.points),
        secMeterLevel: resolveAuditScrutiny(state.secMeterLevel, passed),
        auditTriggered: false,
        questionOutcomes: [
          ...state.questionOutcomes,
          {
            exam: active.question.exam,
            domain: active.question.domain,
            topicTag: active.question.topicTag,
            correct: passed
          }
        ],
        auditQuestion: {
          ...active,
          selectedIndex,
          answered: true
        },
        auditHistory: [...state.auditHistory, { askedAt: now, passed }],
        removedClientIds: removedClientId ? [...state.removedClientIds, removedClientId] : state.removedClientIds,
        clients: nextClients,
        activeClientId: nextActiveClientId
      });
    },
    resolveInsiderEvent: (decision) => {
      const state = get();

      if (!state.activeInsiderEvent || state.playerGameOver) {
        return;
      }

      const resolution = evaluateInsiderDecision(state.activeInsiderEvent, decision, state.playerViolationCount);

      commit({
        activeInsiderEvent: null,
        playerComplianceFeedback: {
          title: state.activeInsiderEvent.title,
          detail: resolution.feedback,
          severity: state.activeInsiderEvent.severity,
          legalToTrade: state.activeInsiderEvent.legalToTrade
        },
        personalPortfolioUsd: Math.max(0, state.personalPortfolioUsd - resolution.fineUsd),
        playerComplianceLevel: Math.min(100, Math.max(0, state.playerComplianceLevel + resolution.complianceDelta)),
        playerViolationCount: resolution.nextViolationCount,
        playerTradeStatus: resolution.nextStatus,
        playerSuspensionRounds: resolution.suspensionRounds,
        playerGameOver: resolution.gameOver,
        playerGameOverReason: resolution.gameOverReason,
        score: state.score + (decision === "avoid" && !state.activeInsiderEvent.legalToTrade ? 20 : 0)
      });
    },
    dismissPlayerComplianceFeedback: () => {
      commit({ playerComplianceFeedback: null }, { touchSave: false });
    },
    dismissCycleRecap: () => {
      commit({ activeCycleRecap: null }, { touchSave: false });
    },
    dismissOnboarding: () => {
      commit({ onboardingDismissed: true });
    }
  };
}, {
  name: "fiduciary-duty-game-store",
  storage: createJSONStorage(() => localStorage),
  onRehydrateStorage: () => (state) => {
    if (!state) {
      return;
    }

    const marketState = mergeMarketState(
      state.tickers,
      state.histories,
      state.currentEvent,
      state.selectedTicker
    );

    state.questionBankStatus = "idle";
    state.questionBankWarmStatus = "idle";
    state.loadedQuestionBankKeys = [];
    state.questionBankError = null;
    state.timerSeconds = state.timerSeconds <= 0 ? 15 * 60 : state.timerSeconds;
    state.selectedChartPeriod = state.selectedChartPeriod ?? "current";
    state.gameDateIso = state.gameDateIso ?? createInitialMarketDate();
    state.activeInsiderEvent = null;
    state.playerComplianceFeedback = null;
    state.playerGameOver = false;
    state.playerGameOverReason = null;
    state.activeInsuranceDialogue = null;
    state.activeClientMeeting = null;
    state.activeAccountTransferRequest = null;
    state.activeOperationsRequest = null;
    state.activeRecommendationDialogue = null;
    state.activeSupervisionRequest = null;
    state.activeDocumentationPrompt = null;
    state.activeBehaviorEvent = null;
    state.personalAccountSleeves =
      Array.isArray(state.personalAccountSleeves) && state.personalAccountSleeves.length > 0
        ? state.personalAccountSleeves
        : createDefaultPersonalAccountSleeves();
    state.personalHoldingAccountMap = normalizePositionAccountMap(
      state.personalHoldings ?? {},
      state.personalHoldingAccountMap,
      state.personalAccountSleeves[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id
    );
    state.personalShortHoldings = state.personalShortHoldings ?? {};
    state.personalShortHoldingAccountMap = normalizePositionAccountMap(
      state.personalShortHoldings ?? {},
      state.personalShortHoldingAccountMap,
      state.personalAccountSleeves[0]?.id ?? PLAYER_TAXABLE_SLEEVE.id
    );
    state.personalSleeveCashBalances = normalizePersonalSleeveCashBalances(
      state.personalAccountSleeves,
      state.personalSleeveCashBalances,
      state.personalPortfolioUsd
    );
    state.personalMarginDebt = state.personalMarginDebt ?? 0;
    state.personalMarginCall = false;
    state.tickers = refreshCallableBondTerms(marketState.tickers, Math.max(1, state.cycleNumber ?? 1));
    state.histories = marketState.histories;
    state.currentEvent = marketState.currentEvent;
    state.selectedTicker = marketState.selectedTicker;
    state.clients = sanitizeClients(state.clients, state.tickers);
    if (state.activeClientId !== PLAYER_BOOK_ID && !state.clients.some((client) => client.id === state.activeClientId)) {
      state.activeClientId = state.clients[0]?.id ?? null;
    }
    state.financialProfiles = buildFinancialProfiles(state.tickers);
    state.interestRates = buildInterestRateSnapshot(Math.max(1, state.cycleNumber ?? 1), state.selectedChartPeriod);
    state.totalAum = computeTotalAum(state.clients, state.tickers);
    state.revenueSnapshot = buildRevenueSnapshot(state.clients, state.tickers, state.revenueSnapshot?.trailingCycleRevenue ?? 0);
    state.answerStreak = state.answerStreak ?? 0;
    state.bestAnswerStreak = state.bestAnswerStreak ?? 0;
    state.tradeFeedback = null;
    state.cycleNumber = Math.max(1, state.cycleNumber ?? 1);
    state.lastMarketRefreshAt = state.lastMarketRefreshAt ?? Date.now();
    state.lastCycleSummary = buildCycleSummary(state.tickers, state.cycleNumber, state.currentEvent);
    state.activeCycleRecap = null;
    state.workflowCooldownUntilCycle = Math.max(1, state.workflowCooldownUntilCycle ?? 1);
    state.trainees = Array.isArray(state.trainees) && state.trainees.length > 0 ? state.trainees : createDefaultTrainees();
    state.activeTraineeId = state.trainees.some((entry) => entry.id === state.activeTraineeId) ? state.activeTraineeId : state.trainees[0].id;
    state.trainingAssignments = Array.isArray(state.trainingAssignments)
      ? state.trainingAssignments.map((assignment) => ({
          ...assignment,
          moduleId: assignment.moduleId === "full-access" ? "stock-game" : assignment.moduleId,
          assignedMortgageRate: typeof assignment.assignedMortgageRate === "number" ? assignment.assignedMortgageRate : null,
          assignedMortgageScenarioId: typeof assignment.assignedMortgageScenarioId === "string" ? assignment.assignedMortgageScenarioId : null
        }))
      : createDefaultTrainingAssignments();
    state.trainingReports = Array.isArray(state.trainingReports)
      ? state.trainingReports.map((report) => ({
          ...report,
          moduleId: typeof report.moduleId === "string" ? report.moduleId : null,
          moduleTitle: typeof report.moduleTitle === "string" ? report.moduleTitle : null,
          moduleScore: typeof report.moduleScore === "number" ? report.moduleScore : null,
          moduleSummary: typeof report.moduleSummary === "string" ? report.moduleSummary : null,
          moduleScoreCards: Array.isArray(report.moduleScoreCards) ? report.moduleScoreCards : []
        }))
      : [];
    state.lastRecordedSessionKey = state.lastRecordedSessionKey ?? null;
    state.difficultySessions = state.difficultySessions ?? {};
    state.questionTracker = {
      recentlyAsked: state.questionTracker?.recentlyAsked ?? [],
      questionsAsked: state.questionTracker?.questionsAsked ?? 0,
      lastClientAsked: state.questionTracker?.lastClientAsked ?? null,
      domainPerformance: state.questionTracker?.domainPerformance ?? {}
    };
    state.onboardingDismissed = state.onboardingDismissed ?? false;
    state.difficultySessions = Object.fromEntries(
      Object.entries(state.difficultySessions ?? {}).flatMap(([difficulty, snapshot]) => {
        const resolved = resolveDifficultySessionSnapshot(snapshot);
        return resolved ? [[difficulty, resolved]] : [];
      })
    );
    state.lastRestoredAt = Date.now();
    state.sessionRestored = true;
    state.saveSlots = buildSaveSlotSummaries();
  },
  partialize: (state) => ({
    trainees: state.trainees,
    activeTraineeId: state.activeTraineeId,
    trainingAssignments: state.trainingAssignments,
    trainingReports: state.trainingReports,
    lastRecordedSessionKey: state.lastRecordedSessionKey,
    score: state.score,
    personalPortfolioUsd: state.personalPortfolioUsd,
    personalAccountSleeves: state.personalAccountSleeves,
    personalSleeveCashBalances: state.personalSleeveCashBalances,
    personalHoldings: state.personalHoldings,
    personalHoldingAccountMap: state.personalHoldingAccountMap,
    personalShortHoldings: state.personalShortHoldings,
    personalShortHoldingAccountMap: state.personalShortHoldingAccountMap,
    personalMarginDebt: state.personalMarginDebt,
    personalMarginCall: state.personalMarginCall,
    playerComplianceLevel: state.playerComplianceLevel,
    playerViolationCount: state.playerViolationCount,
    playerTradeStatus: state.playerTradeStatus,
    playerSuspensionRounds: state.playerSuspensionRounds,
    activeInsiderEvent: state.activeInsiderEvent,
    playerComplianceFeedback: state.playerComplianceFeedback,
    playerGameOver: state.playerGameOver,
    playerGameOverReason: state.playerGameOverReason,
    secMeterLevel: state.secMeterLevel,
    timerSeconds: state.timerSeconds,
    isPaused: state.isPaused,
    activeDifficulty: state.activeDifficulty,
    selectedChartPeriod: state.selectedChartPeriod,
    gameDateIso: state.gameDateIso,
    activeClientId: state.activeClientId,
    selectedTicker: state.selectedTicker,
    activeTab: state.activeTab,
    clients: state.clients,
    tickers: state.tickers,
    histories: state.histories,
    currentEvent: state.currentEvent,
    cycleNumber: state.cycleNumber,
    workflowCooldownUntilCycle: state.workflowCooldownUntilCycle,
    lastMarketRefreshAt: state.lastMarketRefreshAt,
    lastCycleSummary: state.lastCycleSummary,
    activeCycleRecap: state.activeCycleRecap,
    interestRates: state.interestRates,
    activeQuestion: state.activeQuestion,
    auditQuestion: state.auditQuestion,
    auditTriggered: state.auditTriggered,
    auditHistory: state.auditHistory,
    removedClientIds: state.removedClientIds,
    questionOutcomes: state.questionOutcomes,
    complianceStats: state.complianceStats,
    researchUnlocks: state.researchUnlocks,
    questionTracker: state.questionTracker,
    financialProfiles: state.financialProfiles,
    answerStreak: state.answerStreak,
    bestAnswerStreak: state.bestAnswerStreak,
    tradeFeedback: state.tradeFeedback,
    totalAum: state.totalAum,
    onboardingDismissed: state.onboardingDismissed,
    lastSavedAt: state.lastSavedAt,
    difficultySessions: state.difficultySessions
  })
}));

export function useSelectedClient() {
  return useGameStore((state) => state.clients.find((client) => client.id === state.activeClientId) ?? null);
}

export function getClientHoldings(client: ClientAccount) {
  return Object.values(client.holdings).sort((left, right) => left.ticker.localeCompare(right.ticker));
}

export function buildHolding(
  ticker: string,
  shares: number,
  averageCost: number
): ClientHolding {
  return { ticker, shares, averageCost };
}
