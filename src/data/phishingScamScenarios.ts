export type PhishingMailAction = "flag-scam" | "flag-safe" | "advise-scam" | "advise-safe";
export type PhishingThreatCategory =
  | "Spear Phishing"
  | "Whaling"
  | "Clone Phishing"
  | "Smishing Follow-Up"
  | "CEO Fraud"
  | "Invoice Fraud"
  | "Prize / Lottery"
  | "IRS / Government"
  | "Tech Support"
  | "Romance / Outreach"
  | "Advance Fee Fraud"
  | "Credential Harvesting"
  | "Fake Delivery"
  | "Subscription Renewal"
  | "Account Verification"
  | "Client Support"
  | "Safe Internal";

export type MalwareRemovalDifficulty = "easy" | "medium" | "hard" | "extreme";

export interface MalwareCommandStep {
  label: string;
  patterns: string[];
}

export interface PhishingMalwareProfile {
  id: string;
  malwareType: string;
  family: string;
  processName: string;
  startupTask: string | null;
  serviceName: string | null;
  filePath: string;
  folderHint: string;
  difficulty: MalwareRemovalDifficulty;
  tools: string[];
  commandSequence: MalwareCommandStep[];
  recoveryNote: string;
}

export interface PhishingMailScenario {
  id: string;
  fromName: string;
  fromAddress: string;
  subject: string;
  preview: string;
  body: string;
  category: PhishingThreatCategory;
  correctAction: PhishingMailAction;
  tell: string;
  safeHandling: string;
  maliciousAction: "link" | "attachment" | null;
  clientName: string | null;
  malwareProfile: PhishingMalwareProfile | null;
}

const WINDOWS_RUN_KEY = "hkcu\\\\software\\\\microsoft\\\\windows\\\\currentversion\\\\run";
const WINDOWS_RUN_MACHINE_KEY = "hklm\\\\software\\\\microsoft\\\\windows\\\\currentversion\\\\run";

export const PHISHING_MALWARE_LIBRARY: PhishingMalwareProfile[] = [
  {
    id: "keylogger",
    malwareType: "Keylogger",
    family: "Credential / Data Theft",
    processName: "winaudiohelper.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Roaming\\WinAudioHelper\\winaudiohelper.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Roaming\\WinAudioHelper",
    difficulty: "easy",
    tools: ["Malwarebytes", "Autoruns", "Process Explorer"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im winaudiohelper\\.exe /f$"] },
      { label: "Remove startup key", patterns: [`^reg delete ${WINDOWS_RUN_KEY} /v winaudiohelper /f$`] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\roaming\\\\winaudiohelper\\\\winaudiohelper\\.exe$"] }
    ],
    recoveryNote: "Usually removable from user space once the process, autorun key, and payload are all cleared."
  },
  {
    id: "stealer",
    malwareType: "Stealer",
    family: "Credential / Data Theft",
    processName: "browsercache-sync.exe",
    startupTask: "Browser Cache Sync",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\BrowserCacheSync\\browsercache-sync.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\BrowserCacheSync",
    difficulty: "medium",
    tools: ["Malwarebytes", "KVRT", "HitmanPro"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im browsercache-sync\\.exe /f$"] },
      { label: "Delete scheduled task", patterns: ["^schtasks /delete /tn \"browser cache sync\" /f$"] },
      { label: "Delete startup key", patterns: [`^reg delete ${WINDOWS_RUN_KEY} /v browsercachesync /f$`] },
      { label: "Remove folder", patterns: ["^rmdir /s /q c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\browsercachesync$"] }
    ],
    recoveryNote: "Stealers often stage browser and wallet theft first, so cleanup should be followed by session invalidation and password resets."
  },
  {
    id: "rat",
    malwareType: "Remote Access Trojan (RAT)",
    family: "Credential / Data Theft",
    processName: "teamshost.exe",
    startupTask: null,
    serviceName: "TeamsHostSvc",
    filePath: "C:\\ProgramData\\TeamsHost\\teamshost.exe",
    folderHint: "C:\\ProgramData\\TeamsHost",
    difficulty: "hard",
    tools: ["Malwarebytes", "Norton Power Eraser", "Autoruns"],
    commandSequence: [
      { label: "Inspect network activity", patterns: ["^netstat -ano$", "^netstat -anob$"] },
      { label: "Kill process", patterns: ["^taskkill /im teamshost\\.exe /f$"] },
      { label: "Stop service", patterns: ["^sc stop teamshostsvc$"] },
      { label: "Delete service", patterns: ["^sc delete teamshostsvc$"] },
      { label: "Delete machine startup key", patterns: [`^reg delete ${WINDOWS_RUN_MACHINE_KEY} /v teamshost /f$`] },
      { label: "Delete payload", patterns: ["^del c:\\\\programdata\\\\teamshost\\\\teamshost\\.exe$"] }
    ],
    recoveryNote: "RATs often persist across services and startup locations at once, so partial removal is not enough."
  },
  {
    id: "spyware",
    malwareType: "Spyware",
    family: "Credential / Data Theft",
    processName: "meetinghelper.exe",
    startupTask: "Meeting Helper",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Roaming\\MeetingHelper\\meetinghelper.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Roaming\\MeetingHelper",
    difficulty: "medium",
    tools: ["Malwarebytes", "Autoruns"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im meetinghelper\\.exe /f$"] },
      { label: "Delete task", patterns: ["^schtasks /delete /tn \"meeting helper\" /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\roaming\\\\meetinghelper\\\\meetinghelper\\.exe$"] }
    ],
    recoveryNote: "Spyware tends to be user-land but can quietly exfiltrate screenshots, keystrokes, and browser data before detection."
  },
  {
    id: "ransomware",
    malwareType: "Ransomware",
    family: "Destructive / Extortion",
    processName: "docrestore.exe",
    startupTask: null,
    serviceName: "DocRestoreSvc",
    filePath: "C:\\ProgramData\\DocRestore\\docrestore.exe",
    folderHint: "C:\\ProgramData\\DocRestore",
    difficulty: "hard",
    tools: ["No More Ransom decryptors", "Malwarebytes", "Offline boot scan"],
    commandSequence: [
      { label: "Check shadow copies", patterns: ["^vssadmin list shadows$"] },
      { label: "Review backups", patterns: ["^wbadmin get versions$"] },
      { label: "Stop malicious process", patterns: ["^taskkill /im docrestore\\.exe /f$"] },
      { label: "Stop service", patterns: ["^sc stop docrestoresvc$"] },
      { label: "Delete service", patterns: ["^sc delete docrestoresvc$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\programdata\\\\docrestore\\\\docrestore\\.exe$"] }
    ],
    recoveryNote: "Removal may stop further encryption, but file recovery still depends on backups, decryptors, or shadow copies."
  },
  {
    id: "wiper",
    malwareType: "Wiper",
    family: "Destructive / Extortion",
    processName: "systemhealth.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Recovery\\systemhealth.exe",
    folderHint: "Windows Recovery Environment",
    difficulty: "extreme",
    tools: ["OS reinstall", "Recovery media"],
    commandSequence: [
      { label: "Repair MBR", patterns: ["^bootrec /fixmbr$"] },
      { label: "Repair boot sector", patterns: ["^bootrec /fixboot$"] }
    ],
    recoveryNote: "A wiper destroys data; removal is secondary because recovery is often impossible without clean backups."
  },
  {
    id: "logic-bomb",
    malwareType: "Logic Bomb",
    family: "Destructive / Extortion",
    processName: "quarterend-helper.exe",
    startupTask: "QuarterEnd Helper",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\QuarterEndHelper\\quarterend-helper.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\QuarterEndHelper",
    difficulty: "hard",
    tools: ["Autoruns", "Malwarebytes"],
    commandSequence: [
      { label: "Query scheduled tasks", patterns: ["^schtasks /query$"] },
      { label: "Delete scheduled trigger", patterns: ["^schtasks /delete /tn \"quarterend helper\" /f$"] },
      { label: "Kill process", patterns: ["^taskkill /im quarterend-helper\\.exe /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\quarterendhelper\\\\quarterend-helper\\.exe$"] }
    ],
    recoveryNote: "Logic bombs are dormant until triggered, which makes scheduled tasks and delayed execution the real tell."
  },
  {
    id: "rootkit",
    malwareType: "Rootkit",
    family: "Persistence / Hijacking",
    processName: "syscore64.exe",
    startupTask: null,
    serviceName: "SysCore64",
    filePath: "C:\\Windows\\System32\\drivers\\syscore64.sys",
    folderHint: "Recovery / Safe Mode required",
    difficulty: "extreme",
    tools: ["GMER", "TDSSKiller", "Offline boot scanner"],
    commandSequence: [
      { label: "Set safe mode", patterns: ["^bcdedit /set \\{default\\} safeboot minimal$"] },
      { label: "Restart into safe mode", patterns: ["^shutdown /r /t 0$"] }
    ],
    recoveryNote: "Rootkits hide below normal user-land visibility and often require offline scanning or a rebuild."
  },
  {
    id: "bootkit",
    malwareType: "Bootkit",
    family: "Persistence / Hijacking",
    processName: "bootloader-hook.bin",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Boot\\BCD",
    folderHint: "Windows Recovery Environment",
    difficulty: "extreme",
    tools: ["Kaspersky Rescue Disk", "ESET SysRescue"],
    commandSequence: [
      { label: "Repair MBR", patterns: ["^bootrec /fixmbr$"] },
      { label: "Repair boot sector", patterns: ["^bootrec /fixboot$"] },
      { label: "Rebuild BCD", patterns: ["^bootrec /rebuildbcd$"] }
    ],
    recoveryNote: "Bootkits survive into the boot chain, so recovery environment commands are the right first move."
  },
  {
    id: "trojan",
    malwareType: "Trojan",
    family: "Persistence / Hijacking",
    processName: "invoice-viewer.exe",
    startupTask: "Invoice Viewer Sync",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\InvoiceViewer\\invoice-viewer.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\InvoiceViewer",
    difficulty: "medium",
    tools: ["Malwarebytes", "Windows Defender Offline", "HitmanPro"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im invoice-viewer\\.exe /f$"] },
      { label: "Delete scheduled task", patterns: ["^schtasks /delete /tn \"invoice viewer sync\" /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\invoiceviewer\\\\invoice-viewer\\.exe$"] }
    ],
    recoveryNote: "The hardest part with trojans is not killing the main file, but finding whatever secondary payloads it dropped."
  },
  {
    id: "backdoor",
    malwareType: "Backdoor",
    family: "Persistence / Hijacking",
    processName: "certsync.exe",
    startupTask: null,
    serviceName: "CertSyncSvc",
    filePath: "C:\\ProgramData\\CertSync\\certsync.exe",
    folderHint: "C:\\ProgramData\\CertSync",
    difficulty: "hard",
    tools: ["Malwarebytes", "Wireshark", "TCPView"],
    commandSequence: [
      { label: "Inspect connections", patterns: ["^netstat -ano$", "^netstat -anob$"] },
      { label: "Stop process", patterns: ["^taskkill /im certsync\\.exe /f$"] },
      { label: "Stop service", patterns: ["^sc stop certsyncsvc$"] },
      { label: "Delete service", patterns: ["^sc delete certsyncsvc$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\programdata\\\\certsync\\\\certsync\\.exe$"] }
    ],
    recoveryNote: "Backdoors are persistent footholds, so you have to remove both the process and the persistence mechanism."
  },
  {
    id: "cryptominer",
    malwareType: "Cryptominer",
    family: "Resource Abuse",
    processName: "gpumonitor.exe",
    startupTask: "GPU Monitor Cache",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\GpuMonitor\\gpumonitor.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\GpuMonitor",
    difficulty: "easy",
    tools: ["Malwarebytes", "Process Explorer", "Autoruns"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im gpumonitor\\.exe /f$"] },
      { label: "Delete task", patterns: ["^schtasks /delete /tn \"gpu monitor cache\" /f$"] },
      { label: "Delete startup key", patterns: [`^reg delete ${WINDOWS_RUN_KEY} /v gpumonitor /f$`] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\gpumonitor\\\\gpumonitor\\.exe$"] }
    ],
    recoveryNote: "Cryptominers are noisy on CPU and GPU, which makes them easier to catch than many stealthy payloads."
  },
  {
    id: "botnet",
    malwareType: "Botnet Loader",
    family: "Resource Abuse",
    processName: "winsync32.exe",
    startupTask: "Win Sync 32",
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Roaming\\WinSync32\\winsync32.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Roaming\\WinSync32",
    difficulty: "medium",
    tools: ["Malwarebytes", "ESET Online Scanner", "Microsoft Safety Scanner"],
    commandSequence: [
      { label: "Inspect connections", patterns: ["^netstat -ano$", "^netstat -anob$"] },
      { label: "Kill process", patterns: ["^taskkill /im winsync32\\.exe /f$"] },
      { label: "Delete startup task", patterns: ["^schtasks /delete /tn \"win sync 32\" /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\roaming\\\\winsync32\\\\winsync32\\.exe$"] }
    ],
    recoveryNote: "Botnet loaders often reveal themselves through outbound command-and-control traffic."
  },
  {
    id: "adware",
    malwareType: "Adware",
    family: "Browser-Specific",
    processName: "adpush.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\AdPush\\adpush.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\AdPush",
    difficulty: "easy",
    tools: ["AdwCleaner", "Malwarebytes"],
    commandSequence: [
      { label: "Kill process", patterns: ["^taskkill /im adpush\\.exe /f$"] },
      { label: "Delete browser hijack key", patterns: ["^reg delete hkcu\\\\software\\\\microsoft\\\\internet explorer\\\\main /v start page /f$"] },
      { label: "Remove folder", patterns: ["^rmdir /s /q c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\adpush$"] }
    ],
    recoveryNote: "Adware is shallow compared with deeper infections, but users often underestimate how persistent the browser changes can be."
  },
  {
    id: "browser-hijacker",
    malwareType: "Browser Hijacker",
    family: "Browser-Specific",
    processName: "searchassist.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\SearchAssist\\searchassist.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\SearchAssist",
    difficulty: "easy",
    tools: ["AdwCleaner", "Malwarebytes"],
    commandSequence: [
      { label: "Kill process", patterns: ["^taskkill /im searchassist\\.exe /f$"] },
      { label: "Delete browser key", patterns: ["^reg delete hkcu\\\\software\\\\microsoft\\\\internet explorer\\\\main /v search page /f$"] },
      { label: "Remove folder", patterns: ["^rmdir /s /q c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\searchassist$"] }
    ],
    recoveryNote: "Browser hijackers are easy to notice but still disruptive because they redirect traffic and train users to trust fake search results."
  },
  {
    id: "cookie-stealer",
    malwareType: "Cookie Stealer",
    family: "Browser-Specific",
    processName: "sessionvault.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Local\\SessionVault\\sessionvault.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Local\\SessionVault",
    difficulty: "easy",
    tools: ["Malwarebytes", "Browser session invalidation"],
    commandSequence: [
      { label: "Kill process", patterns: ["^taskkill /im sessionvault\\.exe /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\sessionvault\\\\sessionvault\\.exe$"] },
      { label: "Clear browser data", patterns: ["^rmdir /s /q c:\\\\users\\\\trainee\\\\appdata\\\\local\\\\google\\\\chrome\\\\user data$"] }
    ],
    recoveryNote: "Removing the stealer is only half the response; all active sessions and tokens should be invalidated afterward."
  },
  {
    id: "banking-trojan",
    malwareType: "Banking Trojan",
    family: "Financial-Specific",
    processName: "ledgerguard.exe",
    startupTask: "Ledger Guard",
    serviceName: "LedgerGuardSvc",
    filePath: "C:\\ProgramData\\LedgerGuard\\ledgerguard.exe",
    folderHint: "C:\\ProgramData\\LedgerGuard",
    difficulty: "hard",
    tools: ["TDSSKiller", "Malwarebytes", "Offline boot scan"],
    commandSequence: [
      { label: "Inspect connections", patterns: ["^netstat -ano$", "^netstat -anob$"] },
      { label: "Kill process", patterns: ["^taskkill /im ledgerguard\\.exe /f$"] },
      { label: "Stop service", patterns: ["^sc stop ledgerguardsvc$"] },
      { label: "Delete service", patterns: ["^sc delete ledgerguardsvc$"] },
      { label: "Delete task", patterns: ["^schtasks /delete /tn \"ledger guard\" /f$"] },
      { label: "Delete payload", patterns: ["^del c:\\\\programdata\\\\ledgerguard\\\\ledgerguard\\.exe$"] }
    ],
    recoveryNote: "Banking trojans are modular and often re-seed themselves if any service or task survives."
  },
  {
    id: "clipper",
    malwareType: "Clipper",
    family: "Financial-Specific",
    processName: "clipboardsync.exe",
    startupTask: null,
    serviceName: null,
    filePath: "C:\\Users\\Trainee\\AppData\\Roaming\\ClipboardSync\\clipboardsync.exe",
    folderHint: "C:\\Users\\Trainee\\AppData\\Roaming\\ClipboardSync",
    difficulty: "medium",
    tools: ["Malwarebytes", "Process Explorer", "Autoruns"],
    commandSequence: [
      { label: "Find process", patterns: ["^tasklist$", "^get-process$"] },
      { label: "Kill process", patterns: ["^taskkill /im clipboardsync\\.exe /f$"] },
      { label: "Delete startup key", patterns: [`^reg delete ${WINDOWS_RUN_KEY} /v clipboardsync /f$`] },
      { label: "Delete payload", patterns: ["^del c:\\\\users\\\\trainee\\\\appdata\\\\roaming\\\\clipboardsync\\\\clipboardsync\\.exe$"] }
    ],
    recoveryNote: "Clippers are simple, but the real danger is that users often do not notice wallet-address swaps in time."
  }
];

function malwareProfile(id: PhishingMalwareProfile["id"]) {
  const profile = PHISHING_MALWARE_LIBRARY.find((entry) => entry.id === id);
  if (!profile) {
    throw new Error(`Unknown phishing malware profile: ${id}`);
  }

  return profile;
}

export const PHISHING_SCAM_SCENARIOS: PhishingMailScenario[] = [
  {
    id: "spear-client-retainer",
    fromName: "Meridian Endowment Fund",
    fromAddress: "ops@meridianendowment-board.com",
    subject: "Updated IPS packet before tomorrow's board call",
    preview: "Please open the revised packet and confirm the trustee changes before 7 AM.",
    body: "We updated the IPS packet with the trustee edits you discussed last week. Open the secure document below and confirm the changes before the board call starts at 7 AM.",
    category: "Spear Phishing",
    correctAction: "flag-scam",
    tell: "The message is highly targeted, but the domain is not the actual client domain and the rushed sign-in request is out of process.",
    safeHandling: "Treat it as spear phishing. Verify through the known client contact and the real document portal instead of the emailed link.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("stealer")
  },
  {
    id: "whaling-board-chair",
    fromName: "Board Chair",
    fromAddress: "chair.office@sterlingfg-board.com",
    subject: "Need you to review the compensation file quietly",
    preview: "Do not forward this to anyone else. Open the board archive immediately.",
    body: "I need you to review the compensation file quietly before the executive session begins. Use the private board archive link below and keep this off the normal distribution.",
    category: "Whaling",
    correctAction: "flag-scam",
    tell: "It uses executive authority plus secrecy and a fake private archive domain to bypass normal verification.",
    safeHandling: "Flag it and verify through the real board contact path. Never trust authority plus secrecy as a shortcut around policy.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("rat")
  },
  {
    id: "clone-docusign",
    fromName: "DocuSign",
    fromAddress: "dse@docusign-contract.com",
    subject: "Completed: Signature copy from yesterday",
    preview: "A copy of yesterday's signed packet is ready for download.",
    body: "This is a copy of the signed packet from yesterday. Download the attached viewer to open the protected signature archive and verify the final pages.",
    category: "Clone Phishing",
    correctAction: "flag-scam",
    tell: "It impersonates a legitimate prior transaction but shifts to a fake domain and pushes an executable viewer instead of a normal PDF.",
    safeHandling: "Treat it as clone phishing. Validate against the real sender and expected file type before opening anything.",
    maliciousAction: "attachment",
    clientName: null,
    malwareProfile: malwareProfile("trojan")
  },
  {
    id: "smishing-follow-up",
    fromName: "Package Resolution Center",
    fromAddress: "resolution@delivery-alerts-mail.com",
    subject: "Follow-up to the text you received about your package hold",
    preview: "Click here to resolve the delivery issue we texted you about this morning.",
    body: "This is a follow-up to the text message you received about your package delivery hold. Confirm your address and payment details through the secure portal below so we can release the package.",
    category: "Smishing Follow-Up",
    correctAction: "flag-scam",
    tell: "It turns a fake smishing text into an email funnel and tries to collect address and payment data through a bogus portal.",
    safeHandling: "Do not click or provide payment details. Use the real carrier website or app to verify package status.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("browser-hijacker")
  },
  {
    id: "ceo-wire-fraud",
    fromName: "Sterling Managing Partner",
    fromAddress: "managing.partner@sterlingfg-support.com",
    subject: "Need this client wire done quietly",
    preview: "Do not call me. I need this moved before lunch.",
    body: "I need you to process this client wire before lunch and keep it off the normal chatter because the client is sensitive. I am in meetings. Reply here once it is complete.",
    category: "CEO Fraud",
    correctAction: "flag-scam",
    tell: "The domain is wrong and the message uses urgency, secrecy, and authority to override normal wire controls.",
    safeHandling: "Flag it and follow the wire-verification workflow. Email alone is never enough for transfer instructions.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  },
  {
    id: "vendor-ach-change",
    fromName: "Blue Oak Office Supply",
    fromAddress: "billing@blueoakofffice.com",
    subject: "Updated ACH instructions for next payment",
    preview: "Please reroute next invoice payment to the attached banking details immediately.",
    body: "We changed our banking partner. Please update our ACH instructions before the next payment cycle. Use the attached PDF and confirm once the new account is active.",
    category: "Invoice Fraud",
    correctAction: "flag-scam",
    tell: "The sender domain contains an extra letter and the request tries to bypass callback verification for payment changes.",
    safeHandling: "Do not update payment details by email alone. Verify through the known vendor contact record first.",
    maliciousAction: "attachment",
    clientName: null,
    malwareProfile: malwareProfile("trojan")
  },
  {
    id: "lottery-award",
    fromName: "Global Promotions Office",
    fromAddress: "awards@global-promotions-office.net",
    subject: "You have been selected for a $2,500,000 award",
    preview: "Complete the release form and submit the processing fee to claim funds.",
    body: "Congratulations. Your email address was selected for a promotional award. Submit the attached release form and a $950 processing fee to unlock the transfer instructions.",
    category: "Prize / Lottery",
    correctAction: "flag-scam",
    tell: "The message promises a windfall and asks for an upfront fee before any payout exists.",
    safeHandling: "Flag it. Legitimate prizes do not require advance fees or secrecy.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  },
  {
    id: "irs-tax-lien",
    fromName: "IRS Collections Division",
    fromAddress: "collections@irs-payment-alerts.org",
    subject: "Final notice: pending levy action",
    preview: "Download the levy worksheet and pay today to avoid seizure.",
    body: "This is your final notice before levy action begins. Download the worksheet, confirm your SSN, and submit payment today to avoid account seizure.",
    category: "IRS / Government",
    correctAction: "flag-scam",
    tell: "The domain is fake and the message pressures immediate payment plus SSN disclosure through an emailed link.",
    safeHandling: "Do not click or pay. Verify through the real IRS site or mailed correspondence channels.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("spyware")
  },
  {
    id: "fake-tech-support",
    fromName: "Microsoft Defender Support",
    fromAddress: "support@micr0soft-defenderhelp.com",
    subject: "Threat detected on your workstation - call now",
    preview: "Your workstation is infected. Use the link to install the urgent cleanup package.",
    body: "Microsoft Defender found a critical Trojan on your workstation. Use the secure support portal below to install the cleanup package and then call our Level 2 engineer.",
    category: "Tech Support",
    correctAction: "flag-scam",
    tell: "The sender uses a typo-squatted domain and pushes both a download and a support callback.",
    safeHandling: "Never install remote-support tools from unsolicited emails. Escalate through internal IT or the real vendor portal.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("adware")
  },
  {
    id: "romance-professional-outreach",
    fromName: "Elena Carter, Family Office Strategist",
    fromAddress: "elena.carter.private@mailhaven.cc",
    subject: "Confidential capital opportunity for one trusted advisor",
    preview: "I trust your discretion. Please keep this off email compliance review.",
    body: "I manage a private family office and prefer to work with one advisor I can trust. If you can quietly introduce qualified clients to this private allocation, I can reserve you a personal economics share. Please do not mention it to your compliance team.",
    category: "Romance / Outreach",
    correctAction: "flag-scam",
    tell: "It mixes flattery, secrecy, and personal trust-building with an off-channel investment solicitation.",
    safeHandling: "Flag it. Legitimate professional outreach does not require secrecy from compliance or private personal compensation.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  },
  {
    id: "advance-fee-estate",
    fromName: "West Africa Probate Counsel",
    fromAddress: "probate.office@settlement-funds.org",
    subject: "Assistance needed to release dormant estate funds",
    preview: "A modest legal fee will unlock a multimillion-dollar estate recovery.",
    body: "I represent a dormant estate with no surviving next of kin. If you can assist with a banking destination and modest legal processing fee, we can release the funds and share the proceeds.",
    category: "Advance Fee Fraud",
    correctAction: "flag-scam",
    tell: "It is a classic 419 setup: huge funds promised in exchange for upfront fees and account use.",
    safeHandling: "Flag it. Never use client or firm accounts to receive third-party funds from unverifiable estate stories.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  },
  {
    id: "sharepoint-credential-harvest",
    fromName: "Sterling Operations",
    fromAddress: "operations@sterlingfiduciarygroup.sharepoint-mail.com",
    subject: "Review updated custodial exception log",
    preview: "A shared document is waiting for your approval before 4 PM.",
    body: "A shared document named Custodial Exception Log Q2 has been posted for your review. Use the secure SharePoint link below and sign in with your Microsoft credentials to unlock the worksheet before 4 PM.",
    category: "Credential Harvesting",
    correctAction: "flag-scam",
    tell: "The sender domain is not the firm's actual Microsoft tenant and the message pushes a sign-in harvest flow through a lookalike host.",
    safeHandling: "Do not enter credentials. Open the real company SharePoint tenant from a bookmark and confirm whether the file exists there.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("stealer")
  },
  {
    id: "fake-package-delivery",
    fromName: "UPS Delivery Exceptions",
    fromAddress: "notice@ups-delivery-exception.net",
    subject: "Package held at regional hub",
    preview: "Open the invoice to pay the re-delivery fee and release the package.",
    body: "Your package is being held at the regional hub. Open the attached invoice and pay the delivery adjustment fee today to avoid return to sender.",
    category: "Fake Delivery",
    correctAction: "flag-scam",
    tell: "The domain is not the real carrier domain and the message invents a payment demand to release a package.",
    safeHandling: "Do not pay or open attachments. Verify the shipment through the real carrier site or app.",
    maliciousAction: "attachment",
    clientName: null,
    malwareProfile: malwareProfile("cookie-stealer")
  },
  {
    id: "subscription-renewal",
    fromName: "Norton Subscription Desk",
    fromAddress: "renewals@norton-billingcenter.co",
    subject: "Your security subscription renews today for $499.99",
    preview: "Cancel the renewal by opening the secure invoice below.",
    body: "Your annual security subscription renews today for $499.99. If this charge is not authorized, open the secure invoice below and follow the cancellation instructions immediately.",
    category: "Subscription Renewal",
    correctAction: "flag-scam",
    tell: "The message is designed to create panic over a fake charge and drive the user into a malicious link or callback flow.",
    safeHandling: "Do not click or call the emailed number. Check the real vendor account directly if needed.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("keylogger")
  },
  {
    id: "bank-account-verify",
    fromName: "Chase Security Center",
    fromAddress: "security@chase-accountverify.com",
    subject: "Urgent: Verify your business treasury account now",
    preview: "Your account access will be suspended if you do not confirm your identity within 30 minutes.",
    body: "We detected an unusual login. Click the secure verification link below to keep your treasury access active. Failure to act within 30 minutes will freeze outgoing transfers.",
    category: "Account Verification",
    correctAction: "flag-scam",
    tell: "The domain is a spoofed lookalike and the message uses urgency plus a fake freeze threat.",
    safeHandling: "Do not click. Contact the bank through the official app or known number and report the spoof.",
    maliciousAction: "link",
    clientName: null,
    malwareProfile: malwareProfile("banking-trojan")
  },
  {
    id: "margaret-medicare-text",
    fromName: "Margaret Chen",
    fromAddress: "margaret.chen.client@example.com",
    subject: "Did I just get hit with a Medicare scam?",
    preview: "I got a message asking me to confirm Medicare info through a short link.",
    body: "I received a text that says my Medicare coverage will lapse unless I verify today using a shortened website link. I have not clicked it yet. Is this a scam and what should I do?",
    category: "Client Support",
    correctAction: "advise-scam",
    tell: "It is a real client asking for help, but the underlying message she received uses classic government-benefit scam language.",
    safeHandling: "Tell the client not to click, verify directly with Medicare or the insurer, and preserve the message for reporting.",
    maliciousAction: null,
    clientName: "Margaret Chen",
    malwareProfile: null
  },
  {
    id: "derek-docusign-lender",
    fromName: "Derek Washington",
    fromAddress: "derek.washington.client@example.com",
    subject: "Does this DocuSign from my lender look real?",
    preview: "It references my actual loan officer and property address.",
    body: "I got a DocuSign email from my lender that references my actual loan officer, property address, and the disclosures we discussed yesterday. The sender is dse@docusign.net and the link previews to docusign.com. Is this one safe to open?",
    category: "Client Support",
    correctAction: "advise-safe",
    tell: "It is a legitimate client inquiry with matching sender, domain, and transaction context.",
    safeHandling: "Advise that it appears legitimate based on the matching transaction context and official sender details, while still confirming the link preview before clicking.",
    maliciousAction: null,
    clientName: "Derek Washington",
    malwareProfile: null
  },
  {
    id: "sofia-safe-account-wire",
    fromName: "Sofia Reyes",
    fromAddress: "sofia.reyes.client@example.com",
    subject: "Can you look at this wire request before I reply?",
    preview: "Someone says they are from my private bank and want me to move cash to a safe account.",
    body: "A banker who says he is from my private bank emailed asking me to wire funds to a safe holding account because of a fraud event. He wants me to move it today. This feels wrong. Is it a scam?",
    category: "Client Support",
    correctAction: "advise-scam",
    tell: "It is a legitimate client request, but the underlying instructions are a classic safe-account wire scam.",
    safeHandling: "Tell the client not to send funds, contact the bank through a known number, and preserve the message.",
    maliciousAction: null,
    clientName: "Sofia Reyes",
    malwareProfile: null
  },
  {
    id: "lopez-overpayment-refund",
    fromName: "The Lopez Family",
    fromAddress: "lopez.family.client@example.com",
    subject: "Is this cashier's check refund request a scam?",
    preview: "A buyer says he overpaid and wants me to refund the difference after deposit.",
    body: "We are selling a used vehicle and someone mailed a cashier's check for more than the price, then asked us to deposit it and send the difference back immediately. They keep saying the funds are guaranteed. Is this a scam?",
    category: "Client Support",
    correctAction: "advise-scam",
    tell: "The underlying transaction is a classic overpayment/refund scam that relies on fake or reversible funds.",
    safeHandling: "Advise the client not to refund anything, not to rely on early funds availability, and to contact their bank's fraud team.",
    maliciousAction: null,
    clientName: "The Lopez Family",
    malwareProfile: null
  },
  {
    id: "legit-it-reset",
    fromName: "Sterling IT",
    fromAddress: "it@sterlingfiduciarygroup.com",
    subject: "Scheduled VPN certificate replacement",
    preview: "Use the internal portal after 5 PM if your VPN certificate prompts for renewal.",
    body: "This is the scheduled VPN certificate replacement notice for the firm. Use the internal IT portal bookmark after 5 PM if your machine prompts you. Do not use any other email link - the notice is informational only.",
    category: "Safe Internal",
    correctAction: "flag-safe",
    tell: "The sender domain and instruction path are correct, and the message explicitly tells you to use the bookmarked internal portal instead of the email.",
    safeHandling: "Treat it as legitimate internal guidance and follow the bookmarked portal process if prompted.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  },
  {
    id: "legit-vendor-invoice",
    fromName: "Blue Oak Office Supply",
    fromAddress: "billing@blueoakoffice.com",
    subject: "April office supply invoice",
    preview: "Attached is the regular April invoice. Payment terms unchanged.",
    body: "Attached is the April office supply invoice. Payment terms and ACH details remain unchanged from the current vendor record already on file. Let me know if you need a duplicate W-9 for the file.",
    category: "Safe Internal",
    correctAction: "flag-safe",
    tell: "The domain is correct, there is no banking change request, and the message matches a normal invoice workflow.",
    safeHandling: "Treat it as a routine vendor invoice while still following normal payable controls before sending funds.",
    maliciousAction: null,
    clientName: null,
    malwareProfile: null
  }
];
