import assert from "node:assert/strict";
import { createMarketEngine } from "../src/engine/marketEngine";
import { applyScrutinyLevel, evaluateTradeSuitability, resolveAuditScrutiny } from "../src/engine/complianceEngine";
import { createQuestionTracker, pickQuestion, recordQuestionOutcome } from "../src/engine/questionEngine";
import { loadAuthoredQuestionBank } from "../src/engine/questionBank";
import { CLIENTS } from "../src/data/clients";

async function main() {
  const bank = await loadAuthoredQuestionBank();

  assert.equal(bank.sie.length, 300, "SIE authored bank should contain 300 questions.");
  assert.equal(bank.series7.length, 500, "Series 7 authored bank should contain 500 questions.");
  assert.equal(bank.series65.length, 400, "Series 65 authored bank should contain 400 questions.");
  assert.equal(bank.series66.length, 400, "Series 66 authored bank should contain 400 questions.");
  assert.ok(
    Object.values(bank).flat().every((question) => question.explanation.trim().split(/\s+/).length >= 8),
    "Each authored question should retain a substantive explanation."
  );

  const tracker = createQuestionTracker();
  const learnerQuestion = await pickQuestion("learner", tracker);
  assert.equal(learnerQuestion.exam, "SIE", "Learner difficulty should only draw from SIE.");
  recordQuestionOutcome(tracker, learnerQuestion, true);
  assert.equal(
    tracker.domainPerformance[`${learnerQuestion.exam}::${learnerQuestion.domain}`]?.correct,
    1,
    "Question tracker should record domain outcomes."
  );

  const traineeQuestion = await pickQuestion("trainee", tracker);
  assert.ok(
    traineeQuestion.exam === "SIE" || traineeQuestion.exam === "Series 65",
    "Easy difficulty should draw from SIE or Series 65."
  );

  const associateQuestion = await pickQuestion("associate", tracker);
  assert.ok(
    associateQuestion.exam === "SIE" || associateQuestion.exam === "Series 65",
    "Medium difficulty should draw from SIE or Series 65."
  );

  const engine = createMarketEngine();
  const before = engine.getState();
  const next = engine.simulateTick();
  assert.equal(Object.keys(before.tickers).length, Object.keys(next.tickers).length, "Ticker count should remain stable.");
  assert.ok(
    Object.values(next.histories).every((history) => history.length >= 1 && history.length <= 60),
    "Price histories should remain bounded."
  );

  const conservativeClient = {
    ...CLIENTS[0],
    cash: CLIENTS[0].startingAum,
    holdings: {},
    status: "pending" as const
  };
  const futuresTicker = next.tickers.ES;
  const decision = evaluateTradeSuitability(conservativeClient, futuresTicker, 2, "buy", next.tickers);
  assert.equal(decision.suitable, false, "Conservative clients should fail leveraged futures suitability.");
  assert.ok(decision.flags.includes("unsuitable-product"), "Unsuitable product flag should be raised.");
  assert.ok(applyScrutinyLevel(20, decision) > 20, "Unsuitable trades should raise scrutiny.");
  assert.equal(resolveAuditScrutiny(100, true), 40, "Passing an audit should reset scrutiny to 40% or lower.");
  assert.equal(resolveAuditScrutiny(100, false), 60, "Failing an audit should reset scrutiny to 60%.");
  assert.ok(
    CLIENTS.every((client) => client.trustScore >= 0 && client.trustScore <= 100 && client.mandateTargets.length > 0),
    "Client seeds should include valid trust and mandate metadata."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
