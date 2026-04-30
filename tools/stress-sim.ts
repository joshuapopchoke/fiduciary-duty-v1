import assert from "node:assert/strict";
import { CLIENTS } from "../src/data/clients";
import { evaluateTradeSuitability } from "../src/engine/complianceEngine";
import { createMarketEngine } from "../src/engine/marketEngine";
import { createInsiderInfoEvent, evaluateInsiderDecision } from "../src/engine/playerComplianceEngine";
import { createQuestionTracker, markQuestionAsked, pickQuestion, recordQuestionOutcome } from "../src/engine/questionEngine";
import type { PlayDifficulty } from "../src/types/gameState";

interface StressSummary {
  marketTicks: number;
  questionDraws: number;
  suitabilityChecks: number;
  insiderEvents: number;
  warnings: string[];
}

async function runQuestionStress(summary: StressSummary) {
  const difficulties: PlayDifficulty[] = ["learner", "trainee", "associate", "advisor", "senior"];

  for (const difficulty of difficulties) {
    const tracker = createQuestionTracker();

    for (let index = 0; index < 180; index += 1) {
      const question = await pickQuestion(difficulty, tracker);
      const correct = index % 3 !== 0;
      markQuestionAsked(tracker, difficulty, question, CLIENTS[index % CLIENTS.length].id);
      recordQuestionOutcome(tracker, question, correct);
      summary.questionDraws += 1;
    }

    assert.ok(tracker.questionsAsked === 180, `${difficulty} tracker should count all simulated questions.`);
    assert.ok(Object.keys(tracker.domainPerformance).length > 0, `${difficulty} should record domain performance.`);
  }
}

function runMarketStress(summary: StressSummary) {
  const engine = createMarketEngine();

  for (let index = 0; index < 1200; index += 1) {
    const state = engine.simulateTick(1, 0.14);
    summary.marketTicks += 1;

    for (const ticker of Object.values(state.tickers)) {
      assert.ok(Number.isFinite(ticker.price), `${ticker.symbol} price should remain finite.`);
      assert.ok(ticker.price > 0, `${ticker.symbol} price should remain positive.`);
      assert.ok(Number.isFinite(ticker.change), `${ticker.symbol} change should remain finite.`);
    }

    assert.ok(
      Object.values(state.histories).every((history) => history.length >= 1 && history.length <= 60),
      "Histories should stay bounded during stress."
    );
  }
}

function runSuitabilityStress(summary: StressSummary) {
  const engine = createMarketEngine();
  const market = engine.getState();
  const tickers = Object.values(market.tickers);

  for (const client of CLIENTS) {
    const hydratedClient = {
      ...client,
      cash: client.startingAum,
      holdings: {},
      status: "pending" as const
    };

    for (const ticker of tickers) {
      const quantity = Math.max(1, Math.round((client.startingAum * 0.08) / Math.max(ticker.price, 1)));
      const decision = evaluateTradeSuitability(hydratedClient, ticker, quantity, "buy", market.tickers);
      summary.suitabilityChecks += 1;

      assert.ok(Number.isFinite(decision.scrutinyDelta), "Scrutiny deltas should stay finite.");
      assert.ok(decision.scrutinyDelta >= 0, "Scrutiny deltas should not go negative.");

      if (!decision.suitable && decision.reasons.length === 0) {
        summary.warnings.push(`Unsuitable decision without reasons for ${client.id}/${ticker.symbol}`);
      }
    }
  }
}

function runInsiderStress(summary: StressSummary) {
  const engine = createMarketEngine();
  const market = engine.getState();
  let violations = 0;

  for (let index = 0; index < 250; index += 1) {
    const event = createInsiderInfoEvent(market.tickers);
    assert.ok(event, "Stress sim should be able to create insider events.");
    summary.insiderEvents += 1;

    const tradeDecision = index % 4 === 0 ? "trade" : "avoid";
    const resolution = evaluateInsiderDecision(event!, tradeDecision, violations);

    assert.ok(Number.isFinite(resolution.fineUsd), "Fines should remain finite.");
    assert.ok(Number.isFinite(resolution.complianceDelta), "Compliance deltas should remain finite.");

    violations = resolution.nextViolationCount;
    if (resolution.gameOver) {
      violations = 0;
    }
  }
}

async function main() {
  const summary: StressSummary = {
    marketTicks: 0,
    questionDraws: 0,
    suitabilityChecks: 0,
    insiderEvents: 0,
    warnings: []
  };

  runMarketStress(summary);
  await runQuestionStress(summary);
  runSuitabilityStress(summary);
  runInsiderStress(summary);

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
