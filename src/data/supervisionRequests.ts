import type { ClientAccount } from "../types/client";
import type { SupervisionRequestState } from "../types/gameState";

export function buildSupervisionRequest(client: ClientAccount, cycleNumber: number): SupervisionRequestState {
  return {
    clientId: client.id,
    requestId: `${client.id}-supervision-${cycleNumber}`,
    title: "Supervisor review queue",
    summary: `${client.name} has activity that is drawing branch-level attention and needs a remediation decision before the session keeps moving.`,
    prompt: `Supervision focus: ${client.supervisionProfile.exceptionFocus}. Choose how you want to address the flagged activity for ${client.name}.`,
    resolved: false,
    selectedOptionId: null,
    feedback: null,
    options: [
      {
        id: "remediate",
        label: "Remediate the issue and tighten the plan immediately",
        outcome: "The supervisor accepted the remediation plan because it was tied back to the client mandate and documented clearly.",
        secDelta: -10,
        trustDelta: 4,
        noteHint: "Document the supervisory concern, the remediation action, and how the updated recommendation now fits policy and suitability."
      },
      {
        id: "review",
        label: "Escalate for review and pause new risk until cleared",
        outcome: "The supervisor accepted a formal review hold, but expects tighter discipline before more risk is added.",
        secDelta: -4,
        trustDelta: 1,
        noteHint: "Document the supervisory hold, the open review item, and what is blocked until clearance."
      },
      {
        id: "ignore",
        label: "Leave the issue as-is for now",
        outcome: "The supervisor viewed the inaction as a weak response and scrutiny remained elevated.",
        secDelta: 8,
        trustDelta: -4,
        noteHint: "Document why the issue was not remediated and what supervisory risk remains."
      }
    ]
  };
}
