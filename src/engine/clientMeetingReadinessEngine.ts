import type { ClientReadinessScenario } from "../data/clientMeetingReadiness";

export interface ClientReadinessEvaluation {
  overallScore: number;
  complianceScore: number;
  communicationScore: number;
  rationaleScore: number;
  suitabilityScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

function containsAny(text: string, needles: string[]) {
  return needles.some((needle) => text.toLowerCase().includes(needle.toLowerCase()));
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function evaluateClientReadinessResponse(
  scenario: ClientReadinessScenario,
  response: string
): ClientReadinessEvaluation {
  const norm = response.toLowerCase();
  const words = wordCount(response);
  const strengths: string[] = [];
  const improvements: string[] = [];

  // ── Hard compliance violations ─────────────────────────────────────────────
  const guaranteedReturn = containsAny(norm, ["guarantee", "can't lose", "can not lose", "sure thing", "will definitely", "100% safe", "no risk"]);
  const dismissedConcern = containsAny(norm, ["you're wrong", "youre wrong", "that's stupid", "thats stupid", "just trust me"]);
  const tooShort = words < 30;

  // ── Communication: Did the person address the client by name and speak directly? ─
  const usedClientName = containsAny(norm, ["margaret", "kowalski", "derek", "lopez", "sofia", "reyes"]);
  const addressedDirectly = containsAny(norm, [
    "i understand", "i can see", "that makes sense", "i hear", "of course",
    "completely understand", "i see where", "let me explain", "here is why", "the reason"
  ]);
  const gaveClearNext = containsAny(norm, [
    "let's", "lets", "we can", "i can", "we could", "schedule", "follow up",
    "next step", "review", "meet", "look at", "run the numbers", "show you"
  ]);

  // ── Rationale: Did they explain the WHY? ──────────────────────────────────
  const explainedRisk = containsAny(norm, [
    "risk", "could lose", "might lose", "downside", "volatile", "volatility",
    "concentration", "concentrated", "single stock", "one company", "speculative",
    "drawdown", "all your eggs"
  ]);
  const usedNumbers = /\$[\d,]+|\d+%|\d+ years?|\d+ months?/.test(response);
  const explainedAlternative = containsAny(norm, [
    "instead", "alternative", "option", "consider", "recommend", "suggest",
    "what we could do", "another approach", "better fit", "diversif"
  ]);
  const explainedConsequence = containsAny(norm, [
    "if that happens", "worst case", "in that scenario", "the problem is",
    "the concern is", "that would mean", "you'd be left", "impact your",
    "affect your", "jeopardize"
  ]);

  // ── Suitability: Did they tie back to THIS client's situation? ─────────────
  const referencedClientSituation = containsAny(norm, [
    "your age", "your situation", "your goals", "your income", "your timeline",
    "retirement income", "retirement", "income you need", "reserve", "liquidity",
    "time horizon", "years left", "stage of life", "conservative", "your plan",
    "your portfolio", "your account"
  ]);

  // ── Score each dimension ──────────────────────────────────────────────────
  // Communication: clear, direct, addressed the client
  let communicationScore = 50;
  if (addressedDirectly) communicationScore += 20;
  if (usedClientName) communicationScore += 10;
  if (gaveClearNext) communicationScore += 15;
  if (tooShort) communicationScore -= 20;
  if (dismissedConcern) communicationScore -= 30;
  communicationScore = Math.max(10, Math.min(100, communicationScore));

  // Rationale: explanation of reasoning, risk, consequences
  let rationaleScore = 45;
  if (explainedRisk) rationaleScore += 20;
  if (usedNumbers) rationaleScore += 15;
  if (explainedConsequence) rationaleScore += 12;
  if (explainedAlternative) rationaleScore += 8;
  if (tooShort) rationaleScore -= 20;
  rationaleScore = Math.max(10, Math.min(100, rationaleScore));

  // Suitability: tied to client's actual profile
  let suitabilityScore = 45;
  if (referencedClientSituation) suitabilityScore += 28;
  if (gaveClearNext) suitabilityScore += 12;
  if (tooShort) suitabilityScore -= 15;
  suitabilityScore = Math.max(10, Math.min(100, suitabilityScore));

  // Compliance: no prohibited language
  let complianceScore = 80;
  if (guaranteedReturn) { complianceScore -= 50; }
  if (dismissedConcern) { complianceScore -= 20; }
  if (tooShort) complianceScore -= 15;
  const addressedWatchouts = scenario.complianceWatchouts.every(w => {
    const keyTerms = w.toLowerCase().split(" ").filter(t => t.length > 4);
    return keyTerms.some(term => norm.includes(term));
  });
  if (addressedWatchouts) complianceScore = Math.min(100, complianceScore + 10);
  complianceScore = Math.max(10, Math.min(100, complianceScore));

  // ── Build feedback ────────────────────────────────────────────────────────
  if (guaranteedReturn) {
    improvements.push("Remove any language that implies a guaranteed outcome — that is a compliance violation regardless of intent.");
  } else {
    strengths.push("No prohibited language detected — response stays within compliance bounds.");
  }

  if (addressedDirectly) {
    strengths.push("Addressed the client directly and clearly — the response doesn't dance around the issue.");
  } else {
    improvements.push("Address the client's question head-on rather than leading with qualifications.");
  }

  if (explainedRisk && explainedConsequence) {
    strengths.push("Named the risk and explained what it means — specific enough to be useful.");
  } else if (explainedRisk) {
    strengths.push("Named the risk. Add what actually happens if that risk materializes.");
  } else {
    improvements.push("Name the specific risk and what it means in plain language — 'you could lose a significant portion' is more useful than abstract risk language.");
  }

  if (referencedClientSituation) {
    strengths.push("Connected the recommendation back to this client's specific profile — not generic advice.");
  } else {
    improvements.push("Tie your reasoning to their actual situation: age, income need, time horizon, or what they are trying to protect.");
  }

  if (gaveClearNext) {
    strengths.push("Gave a clear next step — the conversation has a direction.");
  } else {
    improvements.push("End with a specific next step or offer to review the numbers together.");
  }

  if (tooShort) {
    improvements.push("Response is too brief to constitute a real client conversation — expand on the reasoning.");
  }

  const overallScore = Math.round(
    (complianceScore * 0.30) +
    (communicationScore * 0.25) +
    (rationaleScore * 0.20) +
    (suitabilityScore * 0.25)
  );

  const clientName = scenario.clientName;
  const feedback =
    overallScore >= 85
      ? `${clientName} receives a clear, compliant, client-specific answer with a defined next step.`
      : overallScore >= 72
        ? `${clientName} gets the right general message but the response needs more specificity or a clearer next step.`
        : overallScore >= 55
          ? `${clientName} hears the right words but the response lacks sufficient rationale or suitability connection.`
          : `${clientName} would likely leave this conversation without a clear answer or plan.`;

  return {
    overallScore,
    complianceScore,
    communicationScore,
    rationaleScore,
    suitabilityScore,
    feedback,
    strengths,
    improvements
  };
}
