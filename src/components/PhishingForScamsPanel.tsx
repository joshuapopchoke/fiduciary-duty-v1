import { useEffect, useMemo, useState } from "react";
import {
  PHISHING_MALWARE_LIBRARY,
  PHISHING_SCAM_SCENARIOS,
  type PhishingMailAction,
  type MalwareCommandStep,
  type PhishingMailScenario,
  type PhishingMalwareProfile
} from "../data/phishingScamScenarios";
import type { ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { useGameStore } from "../store/gameStore";

interface PhishingForScamsPanelProps {
  variant: "trainee" | "it";
  initialView?: "desktop" | "email" | "terminal" | "recycle";
  onTelemetryChange: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

type DesktopAppView = "desktop" | "email" | "terminal" | "recycle";

interface MailDecisionState {
  action: PhishingMailAction;
  correct: boolean;
  feedback: string;
}

interface InfectionState {
  sourceEmailId: string;
  profile: PhishingMalwareProfile;
  commandStepIndex: number;
}

interface DesktopTile {
  id: DesktopAppView;
  title: string;
  subtitle: string;
  glyph: string;
  unreadCount?: number;
}

function antivirusSuccessChance(profile: PhishingMalwareProfile) {
  switch (profile.difficulty) {
    case "easy":
      return 1;
    case "extreme":
      return 0;
    case "hard":
      return 0.1;
    case "medium":
    default:
      return 0.5;
  }
}

function normalizeTerminalCommand(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function allInfectionStepsCleared(infection: InfectionState | null) {
  return Boolean(infection && infection.commandStepIndex >= infection.profile.commandSequence.length);
}

function matchesStep(command: string, step: MalwareCommandStep) {
  return step.patterns.some((pattern) => {
    try {
      return new RegExp(pattern).test(command);
    } catch {
      return false;
    }
  });
}

function normalizePathForMatch(value: string) {
  return value.toLowerCase().replace(/\//g, "\\").replace(/\\+/g, "\\").replace(/"/g, "");
}

function commandContainsPath(command: string, expectedPath: string) {
  return normalizePathForMatch(command).includes(normalizePathForMatch(expectedPath));
}

function commandContainsTaskName(command: string, taskName: string) {
  return command.replace(/"/g, "").toLowerCase().includes(taskName.toLowerCase());
}

function commandMatchesActiveStep(command: string, infection: InfectionState, step: MalwareCommandStep | null) {
  if (!step) {
    return false;
  }

  if (matchesStep(command, step)) {
    return true;
  }

  const profile = infection.profile;
  const normalized = command.replace(/"/g, "").toLowerCase();
  const label = step.label.toLowerCase();

  if (label === "find process") {
    return normalized === "tasklist" || normalized === "get-process" || (normalized.startsWith("tasklist") && normalized.includes(profile.processName.toLowerCase()));
  }

  if (label === "inspect network activity" || label === "inspect connections") {
    return normalized === "netstat -ano" || normalized === "netstat -anob";
  }

  if (label === "query scheduled tasks") {
    return normalized === "schtasks /query" || normalized === "get-scheduledtask";
  }

  if (label === "kill process" || label === "stop malicious process" || label === "stop process") {
    return normalized.includes("taskkill") && normalized.includes(profile.processName.toLowerCase()) && normalized.includes("/f");
  }

  if (label === "stop service") {
    return Boolean(profile.serviceName) && (normalized === `sc stop ${profile.serviceName!.toLowerCase()}` || normalized === `net stop ${profile.serviceName!.toLowerCase()}`);
  }

  if (label === "delete service") {
    return Boolean(profile.serviceName) && normalized === `sc delete ${profile.serviceName!.toLowerCase()}`;
  }

  if (label === "delete scheduled task" || label === "delete startup task" || label === "delete task" || label === "delete scheduled trigger") {
    return Boolean(profile.startupTask) && normalized.includes("schtasks /delete /tn") && normalized.includes("/f") && commandContainsTaskName(command, profile.startupTask!);
  }

  if (label === "remove startup key" || label === "delete startup key" || label === "delete machine startup key") {
    const runKey = label === "delete machine startup key"
      ? "hklm\\software\\microsoft\\windows\\currentversion\\run"
      : "hkcu\\software\\microsoft\\windows\\currentversion\\run";
    const valueByProfile: Record<string, string> = {
      keylogger: "winaudiohelper",
      stealer: "browsercachesync",
      rat: "teamshost",
      cryptominer: "gpumonitor",
      clipper: "clipboardsync"
    };
    const valueName = valueByProfile[profile.id];
    return Boolean(valueName) && normalized.includes("reg delete") && normalized.includes(runKey) && normalized.includes(`/v ${valueName}`) && normalized.includes("/f");
  }

  if (label === "delete browser hijack key") {
    return normalized.includes("reg delete") && normalized.includes("internet explorer\\main") && normalized.includes("/v start page") && normalized.includes("/f");
  }

  if (label === "delete browser key") {
    return normalized.includes("reg delete") && normalized.includes("internet explorer\\main") && normalized.includes("/v search page") && normalized.includes("/f");
  }

  if (label === "delete payload") {
    return (normalized.startsWith("del ") || normalized.startsWith("erase ") || normalized.startsWith("remove-item ")) && commandContainsPath(command, profile.filePath);
  }

  if (label === "remove folder") {
    return (normalized.startsWith("rmdir ") || normalized.startsWith("rd ") || normalized.startsWith("remove-item ")) && commandContainsPath(command, profile.folderHint);
  }

  if (label === "clear browser data") {
    return (normalized.startsWith("rmdir ") || normalized.startsWith("rd ") || normalized.startsWith("remove-item ")) && commandContainsPath(command, "C:\\Users\\Trainee\\AppData\\Local\\Google\\Chrome\\User Data");
  }

  if (label === "check shadow copies") {
    return normalized === "vssadmin list shadows";
  }

  if (label === "review backups") {
    return normalized === "wbadmin get versions";
  }

  if (label === "set safe mode") {
    return normalized === "bcdedit /set {default} safeboot minimal";
  }

  if (label === "restart into safe mode") {
    return normalized === "shutdown /r /t 0";
  }

  if (label === "repair mbr") {
    return normalized === "bootrec /fixmbr";
  }

  if (label === "repair boot sector") {
    return normalized === "bootrec /fixboot";
  }

  if (label === "rebuild bcd") {
    return normalized === "bootrec /rebuildbcd";
  }

  return false;
}

function stepHint(step: MalwareCommandStep | null, infection: InfectionState | null) {
  if (!step || !infection) {
    return null;
  }

  const profile = infection.profile;

  switch (step.label) {
    case "Find process":
      return `Hint: enumerate processes first with TASKLIST or GET-PROCESS, then target ${profile.processName}.`;
    case "Inspect network activity":
    case "Inspect connections":
      return `Hint: start by checking network activity with NETSTAT -ANO.`;
    case "Query scheduled tasks":
      return "Hint: list scheduled tasks first with SCHTASKS /QUERY.";
    case "Kill process":
    case "Stop malicious process":
    case "Stop process":
      return `Hint: kill the malware process with TASKKILL /IM ${profile.processName} /F.`;
    case "Stop service":
      return profile.serviceName ? `Hint: stop the service with SC STOP ${profile.serviceName}.` : null;
    case "Delete service":
      return profile.serviceName ? `Hint: remove the service entry with SC DELETE ${profile.serviceName}.` : null;
    case "Delete scheduled task":
    case "Delete startup task":
    case "Delete task":
    case "Delete scheduled trigger":
      return profile.startupTask ? `Hint: remove the task with SCHTASKS /DELETE /TN "${profile.startupTask}" /F.` : null;
    case "Remove startup key":
    case "Delete startup key":
    case "Delete machine startup key": {
      const registryHints: Record<string, string> = {
        keylogger: String.raw`REG DELETE HKCU\Software\Microsoft\Windows\CurrentVersion\Run /V WinAudioHelper /F`,
        stealer: String.raw`REG DELETE HKCU\Software\Microsoft\Windows\CurrentVersion\Run /V BrowserCacheSync /F`,
        rat: String.raw`REG DELETE HKLM\Software\Microsoft\Windows\CurrentVersion\Run /V TeamsHost /F`,
        cryptominer: String.raw`REG DELETE HKCU\Software\Microsoft\Windows\CurrentVersion\Run /V GpuMonitor /F`,
        clipper: String.raw`REG DELETE HKCU\Software\Microsoft\Windows\CurrentVersion\Run /V ClipboardSync /F`
      };
      return registryHints[profile.id] ? `Hint: remove the startup registry value with ${registryHints[profile.id]}.` : "Hint: remove the malware's startup registry value before deleting the file.";
    }
    case "Delete browser hijack key":
      return "Hint: delete the hijacked Start Page value from the browser key with REG DELETE ... /V Start Page /F.";
    case "Delete browser key":
      return "Hint: delete the hijacked Search Page value from the browser key with REG DELETE ... /V Search Page /F.";
    case "Delete payload":
      return `Hint: remove the payload file itself with DEL "${profile.filePath}".`;
    case "Remove folder":
      return `Hint: remove the malware folder with RMDIR /S /Q "${profile.folderHint}".`;
    case "Clear browser data":
      return "Hint: remove the affected Chrome user data folder after clearing the stealer executable.";
    case "Check shadow copies":
      return "Hint: inspect shadow copies with VSSADMIN LIST SHADOWS.";
    case "Review backups":
      return "Hint: review backup versions with WBADMIN GET VERSIONS.";
    case "Set safe mode":
      return "Hint: set Safe Mode first with BCDEDIT /SET {DEFAULT} SAFEBOOT MINIMAL.";
    case "Restart into safe mode":
      return "Hint: then restart immediately with SHUTDOWN /R /T 0.";
    case "Repair MBR":
      return "Hint: start with BOOTREC /FIXMBR.";
    case "Repair boot sector":
      return "Hint: then run BOOTREC /FIXBOOT.";
    case "Rebuild BCD":
      return "Hint: rebuild the boot configuration with BOOTREC /REBUILDBCD.";
    default:
      return null;
  }
}

export function PhishingForScamsPanel({ variant, initialView = "desktop", onTelemetryChange }: PhishingForScamsPanelProps) {
  const activeDifficulty = useGameStore((state) => state.activeDifficulty);
  const [visibleCount, setVisibleCount] = useState(1);
  const [activeApp, setActiveApp] = useState<DesktopAppView>(initialView);

  useEffect(() => {
    setActiveApp(initialView);
  }, [initialView]);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(PHISHING_SCAM_SCENARIOS[0]?.id ?? "");
  const [mailDecisions, setMailDecisions] = useState<Record<string, MailDecisionState>>({});
  const [deletedMailIds, setDeletedMailIds] = useState<string[]>([]);
  const [remediatedEmailIds, setRemediatedEmailIds] = useState<string[]>([]);
  const [activityLog, setActivityLog] = useState<string[]>(["Desktop ready. New messages will arrive in the inbox over time."]);
  const [infection, setInfection] = useState<InfectionState | null>(null);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Windows Command Prompt [Version 10.0.22631.1]",
    "Type HELP, TASKLIST, SCHTASKS /QUERY, TASKKILL /IM <name> /F, SCHTASKS /DELETE /TN \"name\" /F, DEL <path>, REMOVE-ITEM <path> -FORCE, or GET-PROCESS."
  ]);
  const [failedCommandCount, setFailedCommandCount] = useState(0);
  const [unsafeClicks, setUnsafeClicks] = useState(0);
  const [clientAdviceCorrect, setClientAdviceCorrect] = useState(0);
  const [clientAdviceTotal, setClientAdviceTotal] = useState(0);
  const [scamDetectionCorrect, setScamDetectionCorrect] = useState(0);
  const [scamDetectionTotal, setScamDetectionTotal] = useState(0);
  const [antivirusAttempts, setAntivirusAttempts] = useState(0);
  const [antivirusSuccesses, setAntivirusSuccesses] = useState(0);
  const [commandResolutions, setCommandResolutions] = useState(0);
  const [itEscalations, setItEscalations] = useState(0);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [showInfectionAlert, setShowInfectionAlert] = useState(true);
  const hideThreatHints = activeDifficulty === "advisor" || activeDifficulty === "senior";

  useEffect(() => {
    if (visibleCount >= PHISHING_SCAM_SCENARIOS.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= PHISHING_SCAM_SCENARIOS.length) {
          return current;
        }

        const nextCount = current + 1;
        const nextMail = PHISHING_SCAM_SCENARIOS[nextCount - 1];
        if (nextMail) {
          setActivityLog((previous) => [`New email received: ${nextMail.subject}`, ...previous].slice(0, 12));
        }
        return nextCount;
      });
    }, 60000);

    return () => window.clearInterval(timer);
  }, [visibleCount]);

  const deliveredEmails = useMemo(() => PHISHING_SCAM_SCENARIOS.slice(0, visibleCount), [visibleCount]);
  const visibleEmails = useMemo(
    () => deliveredEmails.filter((mail) => !deletedMailIds.includes(mail.id)),
    [deletedMailIds, deliveredEmails]
  );
  const selectedEmail = useMemo(
    () => visibleEmails.find((mail) => mail.id === selectedEmailId) ?? visibleEmails[0] ?? null,
    [selectedEmailId, visibleEmails]
  );
  const unreadCount = useMemo(
    () => visibleEmails.filter((mail) => !mailDecisions[mail.id] && !deletedMailIds.includes(mail.id)).length,
    [deletedMailIds, mailDecisions, visibleEmails]
  );
  const recycleItems = useMemo(
    () => deliveredEmails.filter((mail) => deletedMailIds.includes(mail.id)),
    [deletedMailIds, deliveredEmails]
  );
  useEffect(() => {
    if (!selectedEmailId || selectedEmail) {
      return;
    }

    setSelectedEmailId(visibleEmails[0]?.id ?? "");
  }, [selectedEmail, selectedEmailId, visibleEmails]);
  const activeCommandStep = infection ? infection.profile.commandSequence[infection.commandStepIndex] ?? null : null;
  const desktopTiles = useMemo<DesktopTile[]>(
    () => [
      {
        id: "email",
        title: "Email",
        subtitle: unreadCount > 0 ? `${unreadCount} new message${unreadCount === 1 ? "" : "s"}` : "Inbox ready",
        glyph: "MAIL",
        unreadCount
      },
      ...(variant === "it"
        ? [{
            id: "terminal" as const,
            title: "Command Prompt",
            subtitle: infection ? "Malware response" : "Diagnostics",
            glyph: "CMD"
          }]
        : []),
      {
        id: "recycle",
        title: "Recycle Bin",
        subtitle: recycleItems.length > 0 ? `${recycleItems.length} deleted item${recycleItems.length === 1 ? "" : "s"}` : "Empty",
        glyph: "BIN"
      }
    ],
    [infection, recycleItems.length, unreadCount, variant]
  );

  const threatDetectionScore = scamDetectionTotal > 0 ? Math.round((scamDetectionCorrect / scamDetectionTotal) * 100) : 100;
  const clientSafeguardingScore = clientAdviceTotal > 0 ? Math.round((clientAdviceCorrect / clientAdviceTotal) * 100) : 100;
  const endpointResponseScore = useMemo(() => {
    const unresolvedPenalty = infection ? 35 : 0;
    const clickPenalty = unsafeClicks * 20;
    const antivirusFailurePenalty = Math.max(0, antivirusAttempts - antivirusSuccesses) * 10;
    const commandBonus = commandResolutions * 12;
    const antivirusBonus = antivirusSuccesses * 6;
    const escalationBonus = variant === "trainee" ? itEscalations * 10 : 0;
    return Math.max(0, Math.min(100, 100 - unresolvedPenalty - clickPenalty - antivirusFailurePenalty + commandBonus + antivirusBonus + escalationBonus));
  }, [antivirusAttempts, antivirusSuccesses, commandResolutions, infection, itEscalations, unsafeClicks, variant]);
  const malwareCoverageCards = useMemo(
    () =>
      PHISHING_MALWARE_LIBRARY.map((profile) => ({
        label: profile.malwareType,
        detail: `${profile.family} | ${profile.difficulty.toUpperCase()} | ${profile.tools.join(", ")}`
      })),
    []
  );

  const moduleScore = Math.round(threatDetectionScore * 0.45 + clientSafeguardingScore * 0.25 + endpointResponseScore * 0.3);
  const scoreCards = useMemo<ModuleScoreCard[]>(
    () => [
      {
        label: "Threat detection",
        score: threatDetectionScore,
        summary: "Identifies phishing, spoofing, malware delivery, and other fraudulent email behavior correctly."
      },
      {
        label: "Client safeguarding",
        score: clientSafeguardingScore,
        summary: "Coaches clients correctly when they ask whether a message, wire request, or refund demand is a scam."
      },
      {
        label: "Endpoint response",
        score: endpointResponseScore,
        summary: variant === "it"
          ? "Measures how safely malware is handled after a bad click or malicious attachment."
          : "Measures how safely malware is handled through antivirus use and timely escalation to IT."
      }
    ],
    [clientSafeguardingScore, endpointResponseScore, threatDetectionScore, variant]
  );

  const answeredCount = Object.keys(mailDecisions).length;

  useEffect(() => {
    onTelemetryChange({
      score: moduleScore,
      scoreCards,
      answeredCount
    });
  }, [answeredCount, moduleScore, onTelemetryChange, scoreCards]);

  useEffect(() => {
    if (infection && allInfectionStepsCleared(infection)) {
      setRemediatedEmailIds((current) => (current.includes(infection.sourceEmailId) ? current : [...current, infection.sourceEmailId]));
      setInfection(null);
      setCommandResolutions((current) => current + 1);
      setFailedCommandCount(0);
      setActivityLog((previous) => ["Malware removed through command prompt workflow.", ...previous].slice(0, 12));
      setTerminalOutput((previous) => [...previous, "Threat removed. Startup task, process, and file path all cleared."]);
    }
  }, [infection]);

  const handleDecision = (mail: PhishingMailScenario, action: PhishingMailAction) => {
    if (mailDecisions[mail.id]) {
      return;
    }

    const correct = mail.correctAction === action;
    const isClientAdvice = action === "advise-scam" || action === "advise-safe";
    const isThreatClassification = action === "flag-scam" || action === "flag-safe";
    const feedback = correct
      ? mail.safeHandling
      : hideThreatHints
        ? "Incorrect handling. Review the sender, request path, urgency, and workflow mismatch more carefully."
        : `Incorrect handling. Tell: ${mail.tell}`;

    if (isClientAdvice) {
      setClientAdviceTotal((current) => current + 1);
      if (correct) {
        setClientAdviceCorrect((current) => current + 1);
      }
    }

    if (isThreatClassification) {
      setScamDetectionTotal((current) => current + 1);
      if (correct) {
        setScamDetectionCorrect((current) => current + 1);
      }
    }

    setMailDecisions((current) => ({
      ...current,
      [mail.id]: { action, correct, feedback }
    }));
    setActivityLog((previous) => [`${mail.subject}: ${correct ? "handled correctly" : "handled incorrectly"}`, ...previous].slice(0, 12));
  };

  const triggerMalware = (mail: PhishingMailScenario) => {
    if (remediatedEmailIds.includes(mail.id)) {
      return;
    }

    const profile = mail.malwareProfile;
    if (!profile) {
      return;
    }

    setUnsafeClicks((current) => current + 1);
    setShowInfectionAlert(true);
    setFailedCommandCount(0);
    setInfection({
      sourceEmailId: mail.id,
      profile,
      commandStepIndex: 0
    });
    setScanState("idle");
    setActiveApp(variant === "it" ? "terminal" : "desktop");
    setTerminalOutput((previous) => [
      ...previous,
      `Warning: ${profile.processName} was dropped after opening the ${mail.maliciousAction}.`,
      "Use the command prompt or antivirus to remove it."
    ]);
    setActivityLog((previous) => [`Malware installed from ${mail.subject}.`, ...previous].slice(0, 12));
  };

  const runAntivirus = () => {
    if (!infection) {
      setActivityLog((previous) => ["No active malware detected. Antivirus scan found nothing actionable.", ...previous].slice(0, 12));
      return;
    }

    if (infection.profile.difficulty === "extreme") {
      setActivityLog((previous) => [`Antivirus is not available for ${infection.profile.malwareType}. Manual remediation is required.`, ...previous].slice(0, 12));
      return;
    }

    if (scanState === "scanning") {
      return;
    }

    setAntivirusAttempts((current) => current + 1);
    setScanState("scanning");
    const profile = infection.profile;
    window.setTimeout(() => {
      const success = Math.random() <= antivirusSuccessChance(profile);
      if (success) {
        setAntivirusSuccesses((current) => current + 1);
        setRemediatedEmailIds((current) => (current.includes(infection.sourceEmailId) ? current : [...current, infection.sourceEmailId]));
        setInfection(null);
        setScanState("success");
        setActivityLog((previous) => [`Antivirus successfully removed ${profile.processName}.`, ...previous].slice(0, 12));
        setTerminalOutput((previous) => [...previous, "Antivirus removal succeeded. Infection cleared."]);
        return;
      }

      setScanState("failed");
      setActivityLog((previous) => [`Antivirus failed to remove ${profile.processName}.`, ...previous].slice(0, 12));
      setTerminalOutput((previous) => [...previous, "Antivirus removal failed. Manual cleanup is still required."]);
      if (variant === "it") {
        setActiveApp("terminal");
      }
    }, 1400);
  };

  const escalateToIT = () => {
    if (!infection) {
      setActivityLog((previous) => ["No active malware to escalate. IT queue remains clear.", ...previous].slice(0, 12));
      return;
    }

    setItEscalations((current) => current + 1);
    setInfection(null);
    setScanState("idle");
    setActivityLog((previous) => [`Incident escalated to IT for ${infection.profile.processName}.`, ...previous].slice(0, 12));
    setActiveApp("desktop");
  };

  const runTerminalCommand = () => {
    const rawCommand = terminalInput.trim();
    if (!rawCommand) {
      return;
    }

    const command = normalizeTerminalCommand(rawCommand);
    const nextOutput = [`> ${rawCommand}`];
    const acceptedStep = infection ? commandMatchesActiveStep(command, infection, activeCommandStep) : false;

    if (command === "help") {
      nextOutput.push("Commands: TASKLIST, GET-PROCESS, NETSTAT -ANO, SCHTASKS /QUERY, SC STOP, SC DELETE, DIR <folder>, TASKKILL /IM <process> /F, REG DELETE, DEL <path>, REMOVE-ITEM <path> -FORCE, BOOTREC /FIXMBR, BOOTREC /FIXBOOT, BOOTREC /REBUILDBCD, VSSADMIN LIST SHADOWS, WBADMIN GET VERSIONS, BCDEDIT /SET {DEFAULT} SAFEBOOT MINIMAL");
      const hint = stepHint(activeCommandStep, infection);
      if (hint) {
        nextOutput.push(hint);
      }
      setFailedCommandCount(0);
    } else if (!infection) {
      nextOutput.push("No active malware. Use the inbox to continue the exercise.");
    } else if (acceptedStep) {
      const currentStep = activeCommandStep;
      const nextIndex = infection.commandStepIndex + 1;
      setInfection((current) => (current ? { ...current, commandStepIndex: nextIndex } : current));
      setFailedCommandCount(0);
      nextOutput.push(`Step accepted: ${currentStep?.label}`);
      if (nextIndex >= infection.profile.commandSequence.length) {
        nextOutput.push(`Manual removal complete for ${infection.profile.malwareType}.`);
      } else {
        const hint = stepHint(infection.profile.commandSequence[nextIndex] ?? null, infection);
        if (hint) {
          nextOutput.push(hint);
        }
      }
    } else if (command === "tasklist" || command === "get-process") {
      nextOutput.push(`Active suspicious process: ${infection.profile.processName}`);
      setFailedCommandCount((current) => current + 1);
    } else if (command === "schtasks /query" || command === "get-scheduledtask") {
      if (infection.profile.startupTask) {
        nextOutput.push(`Scheduled task found: ${infection.profile.startupTask}`);
      } else {
        nextOutput.push("No suspicious scheduled task found.");
      }
      setFailedCommandCount((current) => current + 1);
    } else if (command.startsWith("dir ") || command.startsWith("get-childitem ")) {
      nextOutput.push(`Directory listing: ${infection.profile.folderHint}`);
      nextOutput.push(`  ${infection.profile.filePath}`);
      setFailedCommandCount((current) => current + 1);
    } else if (command.startsWith("taskkill") || command.startsWith("sc stop") || command.startsWith("sc delete") || command.startsWith("schtasks /delete") || command.startsWith("reg delete") || command.startsWith("del ") || command.startsWith("erase ") || command.startsWith("remove-item ") || command.startsWith("rmdir ") || command.startsWith("rd ")) {
      nextOutput.push(`That command was recognized, but it is not the next required removal step for ${infection.profile.malwareType}.`);
      setFailedCommandCount((current) => current + 1);
    } else {
      nextOutput.push(activeCommandStep ? `That is not the next required removal step for ${infection.profile.malwareType}.` : "Command not recognized by this training console.");
      setFailedCommandCount((current) => current + 1);
    }

    const nextFailedCount = command === "help" || acceptedStep || !infection ? 0 : failedCommandCount + 1;
    if (infection && nextFailedCount >= 2) {
      const hint = stepHint(activeCommandStep, infection);
      if (hint) {
        nextOutput.push(hint);
      }
    }

    setTerminalOutput((previous) => [...previous, ...nextOutput].slice(-26));
    setTerminalInput("");
  };

  return (
    <section className="panel phishing-workspace-panel">
      <div className="panel-header phishing-workspace-header">
        <div className="side-panel-heading">
          <h2>{variant === "it" ? "Phishing for Scams - IT Edition" : "Phishing for Scams - Trainee Edition"}</h2>
          <span className="panel-meta">
            {variant === "it"
              ? "Identify scam tells, protect clients, and perform direct malware removal when a malicious message lands."
              : "Identify scam tells, protect clients, and respond safely using antivirus or escalation when malware lands."}
          </span>
        </div>
        <div className="phishing-status-strip">
          <span className="phishing-status-chip">{visibleEmails.length}/{PHISHING_SCAM_SCENARIOS.length} emails delivered</span>
          <span className={infection ? "phishing-status-chip phishing-status-chip--danger" : "phishing-status-chip"}>
            {infection ? `Malware active: ${infection.profile.processName}` : "System clean"}
          </span>
          <span className="phishing-status-chip">{unreadCount} unread email{unreadCount === 1 ? "" : "s"}</span>
          <button type="button" className="control-btn" onClick={runAntivirus}>
            Run Antivirus
          </button>
          {variant === "trainee" ? (
            <button type="button" className="control-btn" onClick={escalateToIT}>
              Escalate to IT
            </button>
          ) : null}
        </div>
      </div>
      <div className="phishing-desktop">
        <aside className="phishing-desktop-icons">
          {desktopTiles.map((tile) => (
            <button key={tile.id} type="button" className={`phishing-desktop-icon${activeApp === tile.id ? " active" : ""}`} onClick={() => setActiveApp(tile.id)}>
              <span className="phishing-desktop-icon-glyph">{tile.glyph}</span>
              {typeof tile.unreadCount === "number" && tile.unreadCount > 0 ? (
                <span className="phishing-desktop-icon-badge">{tile.unreadCount}</span>
              ) : null}
              <strong>{tile.title}</strong>
              <small>{tile.subtitle}</small>
            </button>
          ))}
        </aside>

        <div className="phishing-workspace-window">
          {infection && showInfectionAlert ? (
            <div className="phishing-infection-overlay">
              <div className="phishing-infection-card">
                <span className="eyebrow">Workstation Infected</span>
                <h3>{infection.profile.malwareType}</h3>
                <p>
                  The workstation is now infected with {infection.profile.malwareType.toLowerCase()} after opening a malicious {PHISHING_SCAM_SCENARIOS.find((mail) => mail.id === infection.sourceEmailId)?.maliciousAction ?? "file"}.
                  This payload sits in the <strong>{infection.profile.family}</strong> family and is rated <strong>{infection.profile.difficulty.toUpperCase()}</strong> for removal.
                </p>
                <p>{infection.profile.recoveryNote}</p>
                <div className="comparison-grid phishing-overlay-grid">
                  <div className="comparison-card">
                    <span>Tools</span>
                    <strong>{infection.profile.tools.join(", ")}</strong>
                    <small>These are the primary cleanup tools represented in this module.</small>
                  </div>
                  <div className="comparison-card">
                    <span>Payload</span>
                    <strong>{infection.profile.processName}</strong>
                    <small>{infection.profile.filePath}</small>
                  </div>
                </div>
                <div className="slot-actions">
                  {variant === "it" ? (
                    <button type="button" className="primary-btn manager-inline-btn" onClick={() => { setShowInfectionAlert(false); setActiveApp("terminal"); }}>
                      Open Command Prompt
                    </button>
                  ) : null}
                  {infection.profile.difficulty !== "extreme" && scanState !== "failed" ? (
                    <button type="button" className="control-btn" onClick={runAntivirus}>
                      Run Antivirus
                    </button>
                  ) : null}
                  {variant === "trainee" ? (
                    <button type="button" className="control-btn" onClick={escalateToIT}>
                      Escalate to IT
                    </button>
                  ) : null}
                </div>
                {scanState === "scanning" ? (
                  <div className="trade-feedback warning">
                    <strong>Antivirus scanning...</strong>
                    <span>Running probability-based cleanup against this {infection.profile.difficulty} threat.</span>
                  </div>
                ) : null}
                {scanState === "failed" ? (
                  <div className="trade-feedback warning">
                    <strong>Antivirus failed</strong>
                    <span>{variant === "it" ? "Manual command-line removal is now required." : "This incident must be escalated to IT."}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="trade-feedback">
            <strong>Training objective</strong>
            <span>Work the inbox like a real workstation: identify scam tells, protect clients when they ask for help, and if you trigger malware, clean the machine before the infection persists.</span>
          </div>

          <div className="comparison-grid phishing-score-grid">
            {scoreCards.map((card) => (
              <div key={card.label} className="comparison-card">
                <span>{card.label}</span>
                <strong>{card.score}/100</strong>
                <small>{card.summary}</small>
              </div>
            ))}
          </div>

          {activeApp === "email" ? (
            <div className="phishing-mail-shell">
              <div className="phishing-mail-list">
                {visibleEmails.map((mail) => {
                  const decision = mailDecisions[mail.id];
                  return (
                    <button
                      key={mail.id}
                      type="button"
                      className={`phishing-mail-item${selectedEmail?.id === mail.id ? " active" : ""}${decision ? " phishing-mail-item--resolved" : ""}`}
                      onClick={() => setSelectedEmailId(mail.id)}
                    >
                      <strong>{mail.subject}</strong>
                      <span>{mail.fromName}</span>
                      <small>{mail.preview}</small>
                    </button>
                  );
                })}
              </div>
              <div className="phishing-mail-view">
                {selectedEmail ? (
                  <>
                    <div className="portfolio-summary-card">
                      <span>From</span>
                      <strong>{selectedEmail.fromName}</strong>
                      <small>{selectedEmail.fromAddress}</small>
                      <small>
                        {selectedEmail.clientName
                          ? `Client Support Email | Client: ${selectedEmail.clientName}`
                          : hideThreatHints
                            ? "Email under review"
                            : selectedEmail.category}
                      </small>
                    </div>
                    <div className="phishing-mail-body">
                      <h3>{selectedEmail.subject}</h3>
                      <p>{selectedEmail.body}</p>
                      <div className="slot-actions">
                        <button type="button" className="control-btn" onClick={() => handleDecision(selectedEmail, selectedEmail.correctAction.startsWith("advise") ? "advise-scam" : "flag-scam")}>
                          {selectedEmail.correctAction.startsWith("advise") ? "Advise Scam" : "Mark Scam"}
                        </button>
                        <button type="button" className="control-btn" onClick={() => handleDecision(selectedEmail, selectedEmail.correctAction.startsWith("advise") ? "advise-safe" : "flag-safe")}>
                          {selectedEmail.correctAction.startsWith("advise") ? "Advise Safe" : "Mark Safe"}
                        </button>
                        {selectedEmail.maliciousAction && selectedEmail.malwareProfile ? (
                          remediatedEmailIds.includes(selectedEmail.id) ? (
                            <button type="button" className="control-btn" disabled>
                              Threat Removed
                            </button>
                          ) : (
                            <button type="button" className="control-btn" onClick={() => triggerMalware(selectedEmail)}>
                              Open {selectedEmail.maliciousAction === "link" ? "Link" : "Attachment"}
                            </button>
                          )
                        ) : null}
                        <button
                          type="button"
                          className="control-btn"
                          onClick={() => {
                            setDeletedMailIds((current) => (current.includes(selectedEmail.id) ? current : [...current, selectedEmail.id]));
                            const nextVisibleEmail = visibleEmails.find((mail) => mail.id !== selectedEmail.id);
                            setSelectedEmailId(nextVisibleEmail?.id ?? "");
                            setActiveApp("recycle");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      {mailDecisions[selectedEmail.id] ? (
                        <div className={`trade-feedback ${mailDecisions[selectedEmail.id].correct ? "positive" : "warning"}`}>
                          <strong>{mailDecisions[selectedEmail.id].correct ? "Handled correctly" : "Handled incorrectly"}</strong>
                          <span>{mailDecisions[selectedEmail.id].feedback}</span>
                        </div>
                      ) : (
                        <div className="trade-feedback">
                          <strong>{selectedEmail.clientName ? "Client request type" : hideThreatHints ? "Review carefully" : "Tell to investigate"}</strong>
                          <span>
                            {selectedEmail.clientName
                              ? `This is a legitimate client asking for guidance about a suspicious message or situation.`
                              : hideThreatHints
                                ? "No built-in tell is shown at this difficulty. Read the sender, request, domain, and workflow carefully before deciding."
                                : selectedEmail.tell}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">No email selected.</div>
                )}
              </div>
            </div>
          ) : null}

          {variant === "it" && activeApp === "terminal" ? (
            <div className="phishing-terminal-shell">
              <div className="trade-feedback">
                <strong>{infection ? "Malware removal required" : "No active malware detected"}</strong>
                <span>
                  {infection
                    ? `Remove ${infection.profile.malwareType} from the workstation. Freeform input only. The system will validate your commands against the live incident sequence.`
                    : "You can still run HELP, TASKLIST, GET-PROCESS, and SCHTASKS /QUERY to practice the workflow."}
                </span>
              </div>
              {infection && activeCommandStep ? (
                <div className="trade-feedback">
                  <strong>Incident context</strong>
                  <span>Current malware family: {infection.profile.family}. Difficulty: {infection.profile.difficulty.toUpperCase()}. Use real commands only.</span>
                </div>
              ) : null}
              {infection && activeCommandStep && failedCommandCount >= 2 && stepHint(activeCommandStep, infection) ? (
                <div className="trade-feedback warning">
                  <strong>Hint</strong>
                  <span>{stepHint(activeCommandStep, infection)}</span>
                </div>
              ) : null}
              <div className="phishing-terminal-output">
                {terminalOutput.map((line, index) => (
                  <div key={`${line}-${index}`}>{line}</div>
                ))}
              </div>
              <div className="phishing-terminal-entry">
                <input
                  value={terminalInput}
                  onChange={(event) => setTerminalInput(event.target.value)}
                  placeholder="Enter command"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      runTerminalCommand();
                    }
                  }}
                />
                <button type="button" className="primary-btn manager-inline-btn" onClick={runTerminalCommand}>
                  Run
                </button>
              </div>
            </div>
          ) : null}

          {activeApp === "recycle" ? (
            <div className="phishing-recycle-shell">
              {recycleItems.length === 0 ? (
                <div className="empty-state">Recycle Bin is empty.</div>
              ) : (
                recycleItems.map((mail) => (
                  <div key={mail.id} className="portfolio-summary-card">
                    <span>{mail.subject}</span>
                    <strong>{mail.fromName}</strong>
                    <small>{mail.preview}</small>
                  </div>
                ))
              )}
            </div>
          ) : null}

          {activeApp === "desktop" ? (
            <div className="phishing-desktop-home">
              <div className="comparison-grid phishing-desktop-summary">
                <div className="comparison-card">
                  <span>Inbox pressure</span>
                  <strong>{unreadCount}</strong>
                  <small>Unread messages still waiting for review.</small>
                </div>
                <div className="comparison-card">
                  <span>Threat calls</span>
                  <strong>{scamDetectionCorrect}/{scamDetectionTotal || 0}</strong>
                  <small>Correct scam versus safe classifications so far.</small>
                </div>
                <div className="comparison-card">
                  <span>Client coaching</span>
                  <strong>{clientAdviceCorrect}/{clientAdviceTotal || 0}</strong>
                  <small>Correct advice when clients ask if something is a scam.</small>
                </div>
              </div>
              <div className="comparison-grid phishing-desktop-summary">
                {PHISHING_MALWARE_LIBRARY.map((profile) => (
                  <div key={profile.id} className="comparison-card">
                    <span>{profile.malwareType}</span>
                    <strong>{profile.family}</strong>
                    <small>{profile.difficulty.toUpperCase()} | {profile.tools.join(", ")}</small>
                  </div>
                ))}
              </div>
              <div className="trade-feedback">
                <strong>Desktop task flow</strong>
                <span>
                  {variant === "it"
                    ? "Watch the email icon for new mail, classify scam versus safe correctly, and use the command prompt or antivirus if a bad click drops malware on the machine."
                    : "Watch the email icon for new mail, classify scam versus safe correctly, and use antivirus or escalate to IT if a bad click drops malware on the machine."}
                </span>
              </div>
              <div className="portfolio-summary-card">
                <span>Recent desktop activity</span>
                <strong>{activityLog[0] ?? "System idle."}</strong>
                <small>{activityLog.slice(1).join(" | ") || "No additional events yet."}</small>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
