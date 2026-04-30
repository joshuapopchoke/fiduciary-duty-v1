export interface ClientReadinessScenario {
  id: string;
  title: string;
  clientName: string;
  prompt: string;
  goals: string[];
  complianceWatchouts: string[];
}

export const CLIENT_READINESS_SCENARIOS: ClientReadinessScenario[] = [
  {
    id: "retiree-speculation",
    title: "Retiree Pushback",
    clientName: "Margaret Chen",
    prompt: "Margaret says: “My neighbor doubled money in a hot oil driller. Why can’t we move a big piece of my account there too?” Respond as her advisor.",
    goals: [
      "Acknowledge the client's concern calmly",
      "Explain suitability and risk in plain English",
      "Offer a safer alternative or framework"
    ],
    complianceWatchouts: [
      "Do not guarantee returns",
      "Do not recommend speculative concentration for a conservative retiree"
    ]
  },
  {
    id: "family-refi",
    title: "Mortgage Refinance Stress",
    clientName: "The Kowalski Family",
    prompt: "The Kowalskis ask whether they should refinance, pay extra toward the mortgage, or keep investing for college and retirement. Give your answer.",
    goals: [
      "Balance debt, liquidity, and long-term goals",
      "Mention reserve needs and time horizon",
      "Avoid one-size-fits-all language"
    ],
    complianceWatchouts: [
      "Do not promise a refinance is always superior",
      "Do not ignore liquidity and education planning tradeoffs"
    ]
  },
  {
    id: "lending-decline",
    title: "Borderline Lending File",
    clientName: "Derek Washington",
    prompt: "Derek wants a larger loan than his current debt profile comfortably supports. Explain your recommendation and next steps without sounding dismissive.",
    goals: [
      "Show empathy and explain the decision path",
      "Reference debt load, reserves, or credit profile",
      "Provide constructive next steps"
    ],
    complianceWatchouts: [
      "Do not approve recklessly",
      "Do not shame the client for credit or debt issues"
    ]
  }
];
