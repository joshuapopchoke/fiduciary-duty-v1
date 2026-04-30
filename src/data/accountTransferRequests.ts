import type { ClientAccount } from "../types/client";
import type { AccountTransferRequestState, PlayDifficulty } from "../types/gameState";

function findSleeve(client: ClientAccount, matcher: (registration: string) => boolean) {
  return client.accountSleeves.find((sleeve) => matcher(sleeve.registration.toLowerCase()));
}

function buildRolloverRequest(
  client: ClientAccount,
  cycleNumber: number,
  title: string,
  summary: string,
  prompt: string,
  fromSleeveId: string | null,
  toSleeveId: string | null
): AccountTransferRequestState {
  return {
    clientId: client.id,
    requestId: `${client.id}-transfer-${cycleNumber}`,
    title,
    summary,
    prompt,
    resolved: false,
    selectedOptionId: null,
    feedback: null,
    options: [
      {
        id: "approve",
        label: "Approve the request and move the account now",
        outcome: "The client authorized the rollover/transfer and the paperwork can move forward right away.",
        trustDelta: 6,
        fromSleeveId,
        toSleeveId,
        noteHint: "Document the rollover/transfer request, the account registrations involved, and why the destination sleeve fit the planning objective."
      },
      {
        id: "stage",
        label: "Stage the transfer after a final review call",
        outcome: "The client is open to the move, but wants one more review before assets change registration.",
        trustDelta: 2,
        fromSleeveId: null,
        toSleeveId: null,
        noteHint: "Document that the transfer was staged pending a final suitability, tax, and beneficiary review."
      },
      {
        id: "hold",
        label: "Leave the assets where they are for now",
        outcome: "The client decided to leave the account in place for now and expects a follow-up note explaining the tradeoffs.",
        trustDelta: -2,
        fromSleeveId: null,
        toSleeveId: null,
        noteHint: "Document why the rollover/transfer was deferred and what follow-up items remain open."
      }
    ]
  };
}

export function getAccountTransferRequest(
  client: ClientAccount,
  difficulty: PlayDifficulty,
  cycleNumber: number
): AccountTransferRequestState | null {
  const lowerDifficulty = difficulty === "learner" || difficulty === "trainee";
  const traditionalIra = findSleeve(client, (registration) => registration.includes("traditional ira"));
  const rothIra = findSleeve(client, (registration) => registration.includes("roth ira"));
  const fourOhOneK = findSleeve(client, (registration) => registration.includes("401(k)"));
  const taxable = findSleeve(client, (registration) => registration.includes("taxable"));
  const trust = findSleeve(client, (registration) => registration.includes("trust"));
  const education = findSleeve(client, (registration) => registration.includes("529"));
  const institutionalReserve = findSleeve(client, (registration) => registration.includes("reserve"));
  const longTermPool = findSleeve(client, (registration) => registration.includes("long-term"));

  if (fourOhOneK && traditionalIra) {
    return buildRolloverRequest(
      client,
      cycleNumber,
      "Former plan rollover request",
      `${client.name} wants help consolidating an older workplace plan into a cleaner retirement structure.`,
      lowerDifficulty
        ? "Should the legacy 401(k) stay in place, or should it be rolled into the IRA sleeve for easier planning and beneficiary review?"
        : "The client asked whether you recommend rolling the older 401(k) into the traditional IRA sleeve to simplify investment oversight, beneficiary review, and distribution planning.",
      fourOhOneK.id,
      traditionalIra.id
    );
  }

  if (taxable && trust) {
    return buildRolloverRequest(
      client,
      cycleNumber,
      "Trust transfer request",
      `${client.name} asked whether certain taxable assets should be retitled into the trust sleeve for cleaner estate administration.`,
      lowerDifficulty
        ? "The household wants to know whether the trust sleeve should hold the family assets directly instead of leaving everything in the taxable sleeve."
        : "The client wants to transfer appropriate holdings from the taxable sleeve into the trust sleeve so beneficiary, titling, and estate coordination are easier to manage.",
      taxable.id,
      trust.id
    );
  }

  if (taxable && education) {
    return buildRolloverRequest(
      client,
      cycleNumber,
      "Education funding transfer request",
      `${client.name} wants to move part of the family savings into the education sleeve so college funding is tracked separately.`,
      lowerDifficulty
        ? "Should part of the household taxable sleeve be shifted into the 529 sleeve so education assets are easier to track?"
        : "The family requested a transfer from the household taxable sleeve into the 529 sleeve so education assets are ring-fenced, easier to monitor, and aligned with the stated time horizon.",
      taxable.id,
      education.id
    );
  }

  if (traditionalIra && rothIra) {
    return buildRolloverRequest(
      client,
      cycleNumber,
      "IRA transfer request",
      `${client.name} wants to understand whether part of the retirement sleeve should move into the Roth sleeve for cleaner legacy and distribution planning.`,
      lowerDifficulty
        ? "The client asked about moving some IRA assets into the Roth sleeve and wants to hear the planning tradeoffs first."
        : "The client asked whether you recommend moving part of the traditional IRA sleeve into the Roth sleeve to improve long-term distribution flexibility and beneficiary outcomes.",
      traditionalIra.id,
      rothIra.id
    );
  }

  if (institutionalReserve && longTermPool) {
    return buildRolloverRequest(
      client,
      cycleNumber,
      "Operating reserve transfer request",
      `${client.name} is reviewing whether excess reserve assets belong in the long-term pool instead of sitting in the operating reserve sleeve.`,
      lowerDifficulty
        ? "The institution wants help deciding whether idle reserve assets should stay liquid or move into the long-term pool."
        : "The institution requested a transfer review so excess reserve assets can move into the long-term pool without disrupting spending-support needs or near-term liquidity.",
      institutionalReserve.id,
      longTermPool.id
    );
  }

  return null;
}
