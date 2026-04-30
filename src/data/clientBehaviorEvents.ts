import type { ClientAccount } from "../types/client";
import type { BehavioralEventState, PlayDifficulty } from "../types/gameState";

function eventOptions(clientName: string) {
  return [
    {
      id: "coach-steady",
      label: "Re-center on the plan",
      outcome: `${clientName.split(" ")[0]} calmed down after you tied the conversation back to the long-term plan and risk budget.`,
      trustDelta: 6,
      noteHint: "Document that the client was coached back to the IPS and risk budget."
    },
    {
      id: "compromise",
      label: "Allow a small tactical sleeve",
      outcome: `${clientName.split(" ")[0]} accepted a small compromise, but still needs close supervision so the exception does not become the plan.`,
      trustDelta: 1,
      noteHint: "Document why the tactical exception was limited and how it still fits the broader plan."
    },
    {
      id: "chase",
      label: "Say yes to the impulse trade",
      outcome: `${clientName.split(" ")[0]} felt excited in the moment, but the recommendation drifted away from disciplined planning.`,
      trustDelta: -8,
      noteHint: "Document the behavioral risk and why the recommendation drifted away from policy discipline."
    }
  ];
}

export function getBehaviorScenario(client: ClientAccount, difficulty: PlayDifficulty, cycleNumber: number): BehavioralEventState {
  const title =
    client.id === "retiree" ? "Panic Call After Market Drop" :
    client.id === "young_pro" ? "Hot Stock Request" :
    client.id === "family" ? "Neighborhood FOMO Trade Idea" :
    client.id === "entrepreneur" ? "Concentrated Winner Temptation" :
    "Board Pressure for Performance";

  const prompt =
    client.id === "retiree" ? "How do you respond when the client wants to slash risk after a bad headline?" :
    client.id === "young_pro" ? "How do you answer when the client wants to pile into the hottest ticker on social media?" :
    client.id === "family" ? "How do you respond when the household wants to chase a big winner despite tuition and mortgage goals?" :
    client.id === "entrepreneur" ? "How do you answer when a wealthy client wants to concentrate harder in a recent winner?" :
    "How do you answer when the committee wants to chase returns at the cost of policy discipline?";

  const summary =
    difficulty === "senior"
      ? "The client is emotionally charged and wants a fast answer. This is a behavioral-coaching moment as much as an investment decision."
      : "The client is reacting to headlines and wants to abandon or stretch the plan. Coach the behavior, not just the ticker.";

  return {
    clientId: client.id,
    eventId: `${client.id}-behavior-${cycleNumber}`,
    title,
    summary,
    prompt,
    options: eventOptions(client.name),
    resolved: false,
    selectedOptionId: null,
    feedback: null
  };
}
