// ─── Report Export Engine ─────────────────────────────────────────────────────
// Builds HTML report content for PDF export via Electron's printToPDF.
// Called from the renderer, HTML string is passed to main process for printing.

export interface TraineeReportData {
  traineeName: string;
  traineeUsername: string;
  exportedAt: number;
  sessions: number;
  averageScore: number;
  assignments: Array<{
    moduleTitle: string;
    moduleFocus: string;
    difficulty: string;
    status: string;
    completionPercent: number;
    bestScore: number | null;
    dueAt: number | null;
    scoreCards: Array<{ label: string; score: number; summary?: string | null }>;
    overdueZeroScore?: boolean;
  }>;
  liveScore: {
    moduleTitle: string;
    pct: number;
    total: number;
    updatedAt: number;
  } | null;
  latestSessionGrade: string | null;
  latestSessionDate: number | null;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return "#2ecc71";
  if (pct >= 40) return "#f39c12";
  if (pct === 0) return "#888";
  return "#e74c3c";
}

function fmt(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit"
  });
}

function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    learner: "Learner", trainee: "Trainee", associate: "Associate",
    advisor: "Advisor", senior: "Senior"
  };
  return map[d] ?? d;
}

export function buildReportHtml(data: TraineeReportData): string {
  const assignmentRows = data.assignments.map((a) => {
    const scoreDisplay = a.overdueZeroScore
      ? `<span style="color:#e74c3c;font-weight:700">0/100 (overdue penalty)</span>`
      : a.bestScore !== null
        ? `<span style="color:${scoreColor(a.bestScore)};font-weight:700">${a.bestScore}/100</span>`
        : `<span style="color:#888">—</span>`;

    const scorecardRows = a.scoreCards.length > 0
      ? `<table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:11px">
          <tr style="background:#1a2a3a;color:#8ab4d4">
            <th style="padding:4px 8px;text-align:left">Assessment Area</th>
            <th style="padding:4px 8px;text-align:right">Score</th>
            ${a.scoreCards[0]?.summary !== undefined ? '<th style="padding:4px 8px;text-align:left">Note</th>' : ""}
          </tr>
          ${a.scoreCards.map((sc) => `
            <tr style="border-top:1px solid #1e3048">
              <td style="padding:4px 8px;color:#c8d8e8">${sc.label}</td>
              <td style="padding:4px 8px;text-align:right;color:${scoreColor(sc.score)};font-weight:600">${sc.score}/100</td>
              ${sc.summary !== undefined ? `<td style="padding:4px 8px;color:#8ab4d4;font-size:10px">${sc.summary ?? ""}</td>` : ""}
            </tr>
          `).join("")}
        </table>`
      : "";

    return `
      <div style="background:#0e1e2e;border:1px solid #1e3a5a;border-radius:6px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <div>
            <div style="font-weight:700;font-size:14px;color:#e8f0f8">${a.moduleTitle}</div>
            <div style="font-size:11px;color:#8ab4d4;margin-top:2px">${a.moduleFocus} &nbsp;|&nbsp; ${difficultyLabel(a.difficulty)} &nbsp;|&nbsp; ${a.status.replace("-", " ")} &nbsp;|&nbsp; ${a.completionPercent}% ready</div>
          </div>
          <div style="text-align:right;font-size:13px">${scoreDisplay}</div>
        </div>
        ${a.dueAt ? `<div style="font-size:11px;color:#8ab4d4">Due: ${fmt(a.dueAt)}</div>` : ""}
        ${scorecardRows}
      </div>
    `;
  }).join("");

  const liveBlock = data.liveScore
    ? `<div style="background:#0a2a1a;border:1px solid #1a5a2a;border-radius:6px;padding:12px;margin-bottom:16px">
        <div style="font-size:11px;color:#2ecc71;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">● Live Session Score (at time of export)</div>
        <div style="font-size:22px;font-weight:700;color:${scoreColor(data.liveScore.pct)}">${data.liveScore.pct}/100</div>
        <div style="font-size:11px;color:#8ab4d4">${data.liveScore.moduleTitle} &nbsp;|&nbsp; ${data.liveScore.total} scored interactions &nbsp;|&nbsp; ${fmt(data.liveScore.updatedAt)}</div>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Fiduciary Duty — Training Report: ${data.traineeName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #07111f; color: #c8d8e8; font-family: "Segoe UI", Arial, sans-serif; font-size: 13px; padding: 32px; }
  @media print { body { background: #07111f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div style="border-bottom:2px solid #1e3a5a;padding-bottom:16px;margin-bottom:24px">
    <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">Sterling Fiduciary Group</div>
    <div style="font-size:22px;font-weight:700;color:#e8f0f8">Training Performance Report</div>
    <div style="font-size:12px;color:#8ab4d4;margin-top:4px">Exported: ${fmt(data.exportedAt)}</div>
  </div>

  <div style="background:#0e1e2e;border:1px solid #1e3a5a;border-radius:6px;padding:16px;margin-bottom:20px;display:flex;gap:32px">
    <div>
      <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:1px">Trainee</div>
      <div style="font-size:18px;font-weight:700;color:#e8f0f8;margin-top:2px">${data.traineeName}</div>
      <div style="font-size:11px;color:#8ab4d4">@${data.traineeUsername}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:1px">Sessions Logged</div>
      <div style="font-size:18px;font-weight:700;color:#e8f0f8;margin-top:2px">${data.sessions}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:1px">Average Readiness</div>
      <div style="font-size:18px;font-weight:700;color:${scoreColor(data.averageScore)};margin-top:2px">${data.averageScore.toFixed(0)}/100</div>
    </div>
    ${data.latestSessionGrade ? `
    <div>
      <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:1px">Latest Session Grade</div>
      <div style="font-size:18px;font-weight:700;color:#e8f0f8;margin-top:2px">${data.latestSessionGrade}</div>
      ${data.latestSessionDate ? `<div style="font-size:11px;color:#8ab4d4">${fmt(data.latestSessionDate)}</div>` : ""}
    </div>` : ""}
  </div>

  ${liveBlock}

  <div style="font-size:10px;color:#4873ab;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
    Assigned Modules (${data.assignments.length})
  </div>
  ${data.assignments.length === 0
    ? `<div style="color:#8ab4d4;font-size:12px;padding:12px">No modules assigned yet.</div>`
    : assignmentRows
  }

  <div style="margin-top:24px;padding-top:12px;border-top:1px solid #1e3a5a;font-size:10px;color:#4873ab;text-align:center">
    Fiduciary Duty Training Platform &nbsp;|&nbsp; Confidential — Internal Use Only &nbsp;|&nbsp; ${fmt(data.exportedAt)}
  </div>
</body>
</html>`;
}
