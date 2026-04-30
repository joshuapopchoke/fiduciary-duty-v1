import type { ClientAccount } from "../types/client";
import type { OperationsRequestState, OperationsWorkflowKind, PlayDifficulty } from "../types/gameState";

function buildRequest(
  client: ClientAccount,
  cycleNumber: number,
  requestId: string,
  requestKind: OperationsWorkflowKind,
  title: string,
  summary: string,
  prompt: string,
  options: OperationsRequestState["options"]
): OperationsRequestState {
  return {
    clientId: client.id,
    requestId: `${client.id}-${requestId}-${cycleNumber}`,
    requestKind,
    title,
    summary,
    prompt,
    options,
    resolved: false,
    selectedOptionId: null,
    feedback: null
  };
}

export function getOperationsRequest(
  client: ClientAccount,
  difficulty: PlayDifficulty,
  cycleNumber: number
): OperationsRequestState | null {
  return getOperationsRequestByKind(client, difficulty, cycleNumber, "default");
}

export function getOperationsRequestByKind(
  client: ClientAccount,
  difficulty: PlayDifficulty,
  cycleNumber: number,
  kind: OperationsWorkflowKind
): OperationsRequestState | null {
  const simplerPrompt = difficulty === "learner" || difficulty === "trainee";

  switch (client.id) {
    case "retiree":
      if (kind === "rmd") {
        return buildRequest(
          client,
          cycleNumber,
          "rmd-review",
          "rmd",
          "Required distribution workflow",
          `${client.name} wants the required distribution handled cleanly so the Traditional IRA, taxable reserve, and spending plan all stay coordinated.`,
          simplerPrompt
            ? "Do you process the IRA distribution now, stage it after a review, or leave it for later?"
            : "The client needs an IRA distribution coordinated from the Traditional IRA into the taxable reserve sleeve. Choose whether to process it now, stage it after a quick tax review, or defer it and explain the next step.",
          [
            {
              id: "process-now",
              label: "Move the required distribution into the taxable reserve now",
              outcome: "The required distribution was moved out of the Traditional IRA and into the taxable reserve with the withdrawal plan updated.",
              trustDelta: 6,
              fromSleeveId: "retiree-trad-ira",
              toSleeveId: "retiree-taxable",
              transferAmount: 6500,
              noteHint: "Document the RMD amount, source sleeve, taxable landing sleeve, and how the reserve bucket supports upcoming spending."
            },
            {
              id: "stage-review",
              label: "Stage the distribution after a quick withdrawal and tax review",
              outcome: "The client accepted a short review window so the distribution can be coordinated with the spending plan and tax picture.",
              trustDelta: 2,
              noteHint: "Document that the RMD was staged pending a withdrawal-order and tax review."
            },
            {
              id: "defer",
              label: "Defer the distribution for now",
              outcome: "The client left uneasy because the retirement withdrawal still feels unresolved and time-sensitive.",
              trustDelta: -6,
              noteHint: "Document why the RMD was deferred, what deadline risk remains, and what follow-up is required."
            }
          ]
        );
      }

      return buildRequest(
        client,
        cycleNumber,
        "rmd",
        "default",
        "RMD processing request",
        `${client.name} asked for help handling an IRA distribution so the retirement plan stays on track without creating unnecessary confusion.`,
        simplerPrompt
          ? "The client needs an IRA withdrawal handled correctly. Do you process it now, stage it after a review, or defer it?"
          : "The client needs the required IRA distribution coordinated with the taxable reserve sleeve. Choose whether to process it now, stage it pending review, or defer it and explain the follow-up.",
        [
          {
            id: "process-now",
            label: "Process the retirement distribution now",
            outcome: "The required IRA distribution was processed and documented with the reserve and tax planning notes updated.",
            trustDelta: 5,
            cashDelta: -6500,
            noteHint: "Document the IRA distribution amount, why it was timely, and how the reserve sleeve will absorb spending needs."
          },
          {
            id: "stage-review",
            label: "Stage it after a reserve and tax review",
            outcome: "The client agreed to a short delay so the distribution can be coordinated with cash needs and tax planning.",
            trustDelta: 2,
            noteHint: "Document that the RMD was staged pending a reserve and tax review."
          },
          {
            id: "defer",
            label: "Defer the request for now",
            outcome: "The client left uneasy because the retirement withdrawal question still feels unresolved.",
            trustDelta: -5,
            noteHint: "Document why the distribution was deferred and what corrective follow-up is required."
          }
        ]
      );
    case "young_pro":
      return buildRequest(
        client,
        cycleNumber,
        "trusted-contact",
        "default",
        "Trusted contact and beneficiary review",
        `${client.name} wants to clean up the account file after a job change and asked whether anything important is missing from the registration records.`,
        simplerPrompt
          ? "Would you update the trusted contact and beneficiary details now, stage it, or leave it alone?"
          : "The client wants a trusted contact and beneficiary review added to the file now that the household situation changed. Choose how to handle the account-maintenance request.",
        [
          {
            id: "update-now",
            label: "Update the trusted contact and beneficiary file now",
            outcome: "The account file was updated cleanly and the client appreciated the operational follow-through.",
            trustDelta: 5,
            noteHint: "Document the trusted-contact update, beneficiary review, and any remaining account-maintenance items."
          },
          {
            id: "schedule",
            label: "Schedule the maintenance for the next review",
            outcome: "The client is fine waiting for the next service window, but expects it to be handled then.",
            trustDelta: 1,
            noteHint: "Document the scheduled service follow-up and the next review date."
          },
          {
            id: "ignore",
            label: "Leave the file as-is for now",
            outcome: "The client noticed the operational issue was brushed aside and trust slipped.",
            trustDelta: -4,
            noteHint: "Document that the maintenance request was deferred and explain the risk of leaving the file incomplete."
          }
        ]
      );
    case "family":
      return buildRequest(
        client,
        cycleNumber,
        "beneficiary-529",
        "default",
        "529 and beneficiary maintenance request",
        `${client.name} wants the family education and beneficiary records cleaned up so the planning picture is easier to understand.`,
        simplerPrompt
          ? "Would you update the 529 and beneficiary paperwork now, stage it, or defer it?"
          : "The household asked for a beneficiary and 529 maintenance review so the education plan and family recordkeeping are current. Choose how to handle it.",
        [
          {
            id: "complete-now",
            label: "Complete the 529 and beneficiary maintenance now",
            outcome: "The family recordkeeping now matches the education and estate plan, which made the client feel much more organized.",
            trustDelta: 6,
            noteHint: "Document the 529 maintenance updates, beneficiary confirmations, and any remaining family planning follow-up."
          },
          {
            id: "partial",
            label: "Handle the beneficiary review first and finish 529 items later",
            outcome: "The family accepted a staged service approach, but still expects the education paperwork to be finished soon.",
            trustDelta: 2,
            noteHint: "Document the staged beneficiary and 529 maintenance plan."
          },
          {
            id: "later",
            label: "Defer the service request",
            outcome: "The family felt the service issue was not given enough attention.",
            trustDelta: -4,
            noteHint: "Document why the 529 and beneficiary maintenance request was deferred."
          }
        ]
      );
    case "entrepreneur":
      return buildRequest(
        client,
        cycleNumber,
        "registration-change",
        "default",
        "Registration change request",
        `${client.name} wants help deciding whether ownership and beneficiary records should be updated after recent business planning changes.`,
        simplerPrompt
          ? "Would you start the registration update now, stage it, or hold it?"
          : "The client requested a registration and beneficiary review tied to business and estate planning changes. Choose how to handle the account-maintenance request.",
        [
          {
            id: "start-now",
            label: "Start the registration and beneficiary update now",
            outcome: "The client appreciated that the legal and advisory paperwork were coordinated promptly.",
            trustDelta: 5,
            noteHint: "Document the registration change, beneficiary updates, and trust/estate coordination items."
          },
          {
            id: "stage-legal",
            label: "Stage it pending outside legal confirmation",
            outcome: "The client agreed the registration change should wait for final outside legal confirmation.",
            trustDelta: 2,
            noteHint: "Document the staged registration update and pending legal follow-up."
          },
          {
            id: "hold",
            label: "Leave the existing registration in place",
            outcome: "The client felt the registration issue was not pushed forward enough.",
            trustDelta: -4,
            noteHint: "Document why the registration change was not advanced and what follow-up remains."
          }
        ]
      );
    case "institutional":
      return buildRequest(
        client,
        cycleNumber,
        "authorized-contact",
        "default",
        "Authorized contact maintenance request",
        `${client.name} needs the operating file updated so the right people can approve future instructions and reserve transfers.`,
        simplerPrompt
          ? "Would you update the authorized contacts now, stage it, or defer it?"
          : "The institution requested an authorized-contact and service-file review so future instructions, reserve movements, and oversight approvals are cleanly documented.",
        [
          {
            id: "update",
            label: "Update the authorized contacts now",
            outcome: "The institutional service file is cleaner and future operational approvals should move much more smoothly.",
            trustDelta: 5,
            noteHint: "Document the authorized-contact update and the institutional operations follow-up."
          },
          {
            id: "queue",
            label: "Queue it for the next operations review",
            outcome: "The institution accepted a staged service process but expects the update to be completed soon.",
            trustDelta: 1,
            noteHint: "Document the queued authorized-contact review and who owns the follow-up."
          },
          {
            id: "defer",
            label: "Defer the request for now",
            outcome: "The institution flagged the service delay as a concern.",
            trustDelta: -5,
            noteHint: "Document why the operations maintenance request was deferred and what service risk remains."
          }
        ]
      );
    default:
      return null;
  }
}
