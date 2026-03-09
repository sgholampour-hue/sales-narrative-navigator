import type { Call } from "./callData";

export function exportCallCSV(call: Call) {
  const rows = [
    ["Field", "Value"],
    ["Prospect", call.prospect],
    ["Company", call.company],
    ["Rep", call.rep],
    ["Date", call.callDate],
    ["Total Score", String(call.totalScore)],
    ["Average Score", String(call.averageScore)],
    ["Performance Level", call.performanceLevel],
    ["Call Control", String(call.callControlScore)],
    ["Discovery Depth", String(call.discoveryDepthScore)],
    ["Belief Shifting", String(call.beliefShiftingScore)],
    ["Objection Handling", String(call.objectionHandlingScore)],
    ["Pitch Effectiveness", String(call.pitchEffectivenessScore)],
    ["Closing Strength", String(call.closingStrengthScore)],
    ["Objections", String(call.numObjections)],
    ["Objection Rate", call.objectionHandlingRate],
    ["Deal Closed", call.dealClosed],
    ["Deal Value", String(call.dealValue)],
    ["What Worked", call.whatWorked],
    ["Areas to Improve", call.areasToImprove],
    ["Key Strength", call.keyStrength],
    ["Key Weakness", call.keyWeakness],
    ["Next Action", call.nextCallAction],
  ];
  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  download(csv, `call-report-${call.id}.csv`, "text/csv");
}

export function exportAllCallsCSV(calls: Call[]) {
  const headers = ["ID","Prospect","Company","Rep","Date","Total Score","Avg Score","Performance","Deal Closed","Deal Value","Call Control","Discovery","Belief Shifting","Objection Handling","Pitch","Closing"];
  const rows = calls.map(c => [
    c.id, c.prospect, c.company, c.rep, c.date, String(c.totalScore), String(c.averageScore),
    c.performanceLevel, c.dealClosed, String(c.dealValue), String(c.callControlScore),
    String(c.discoveryDepthScore), String(c.beliefShiftingScore), String(c.objectionHandlingScore),
    String(c.pitchEffectivenessScore), String(c.closingStrengthScore),
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  download(csv, "all-calls-report.csv", "text/csv");
}

export function exportCallPDF(call: Call) {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Call Report - ${call.prospect}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a2e}
h1{font-size:20px;margin-bottom:4px}h2{font-size:15px;color:#555;margin:24px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}
table{width:100%;border-collapse:collapse;margin:8px 0}td{padding:6px 12px;border:1px solid #e5e5e5;font-size:13px}
td:first-child{font-weight:600;width:40%;background:#f8f9fa}.score{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700}
.high{background:#dcfce7;color:#166534}.mid{background:#fef9c3;color:#92400e}.low{background:#fee2e2;color:#991b1b}
</style></head><body>
<h1>Call Analysis Report</h1>
<p style="color:#666;font-size:13px">${call.prospect} — ${call.company} | ${call.callDate}</p>
<h2>Scores</h2>
<table>
<tr><td>Total Score</td><td><span class="score ${call.totalScore >= 7.5 ? 'high' : call.totalScore >= 5 ? 'mid' : 'low'}">${call.totalScore}/10</span></td></tr>
<tr><td>Call Control</td><td>${call.callControlScore}/10</td></tr>
<tr><td>Discovery Depth</td><td>${call.discoveryDepthScore}/10</td></tr>
<tr><td>Belief Shifting</td><td>${call.beliefShiftingScore}/10</td></tr>
<tr><td>Objection Handling</td><td>${call.objectionHandlingScore}/10</td></tr>
<tr><td>Pitch Effectiveness</td><td>${call.pitchEffectivenessScore}/10</td></tr>
<tr><td>Closing Strength</td><td>${call.closingStrengthScore}/10</td></tr>
</table>
<h2>Analysis Summary</h2>
<table>
<tr><td>What Worked</td><td>${call.whatWorked}</td></tr>
<tr><td>Areas to Improve</td><td>${call.areasToImprove}</td></tr>
<tr><td>Key Strength</td><td>${call.keyStrength}</td></tr>
<tr><td>Key Weakness</td><td>${call.keyWeakness}</td></tr>
<tr><td>Next Action</td><td>${call.nextCallAction}</td></tr>
</table>
<h2>Deal Info</h2>
<table>
<tr><td>Deal Closed</td><td>${call.dealClosed}</td></tr>
<tr><td>Deal Value</td><td>€${call.dealValue.toLocaleString()}</td></tr>
<tr><td>Objections</td><td>${call.numObjections} (${call.objectionHandlingRate} handled)</td></tr>
</table>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
