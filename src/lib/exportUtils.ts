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

export function exportDashboardPDF(calls: Call[]) {
  const total = calls.length;
  const avgScore = total > 0 ? (calls.reduce((a, c) => a + c.totalScore, 0) / total).toFixed(1) : "0";
  const closed = calls.filter(c => c.dealClosed === "Yes");
  const convRate = total > 0 ? Math.round((closed.length / total) * 100) : 0;
  const totalRev = closed.reduce((a, c) => a + c.dealValue, 0);

  const repMap = new Map<string, { total: number; count: number; deals: number }>();
  calls.forEach(c => {
    const r = repMap.get(c.rep) || { total: 0, count: 0, deals: 0 };
    r.total += c.totalScore; r.count += 1;
    if (c.dealClosed === "Yes") r.deals += 1;
    repMap.set(c.rep, r);
  });
  const repRows = Array.from(repMap.entries())
    .map(([name, d]) => `<tr><td>${name}</td><td>${d.count}</td><td>${(d.total / d.count).toFixed(1)}/10</td><td>${d.deals}</td><td>${d.count > 0 ? Math.round((d.deals / d.count) * 100) : 0}%</td></tr>`)
    .join("");

  const categories = [
    { label: "Call Control", key: "callControlScore" as const },
    { label: "Discovery Depth", key: "discoveryDepthScore" as const },
    { label: "Belief Shifting", key: "beliefShiftingScore" as const },
    { label: "Objection Handling", key: "objectionHandlingScore" as const },
    { label: "Pitch Effectiveness", key: "pitchEffectivenessScore" as const },
    { label: "Closing Strength", key: "closingStrengthScore" as const },
  ];
  const leaderRows = categories.map(cat => {
    const best = calls.reduce((a, c) => c[cat.key] > (a?.[cat.key] ?? 0) ? c : a, calls[0]);
    return `<tr><td>${cat.label}</td><td>${best?.rep ?? "-"}</td><td>${best?.[cat.key] ?? 0}/10</td></tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Dashboard Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:20px;color:#1a1a2e}
h1{font-size:22px;margin-bottom:4px}h2{font-size:15px;color:#555;margin:24px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}
.kpi{background:#f8f9fa;border:1px solid #e5e5e5;border-radius:8px;padding:16px}
.kpi-label{font-size:11px;color:#666;text-transform:uppercase}.kpi-value{font-size:22px;font-weight:700;margin-top:4px}
table{width:100%;border-collapse:collapse;margin:8px 0}th,td{padding:6px 12px;border:1px solid #e5e5e5;font-size:13px;text-align:left}
th{background:#f1f5f9;font-weight:600;font-size:11px;text-transform:uppercase}
</style></head><body>
<h1>Sales Dashboard Report</h1>
<p style="color:#666;font-size:13px">Gegenereerd op ${new Date().toLocaleDateString("nl-NL")}</p>
<div class="kpi-grid">
<div class="kpi"><div class="kpi-label">Totaal Calls</div><div class="kpi-value">${total}</div></div>
<div class="kpi"><div class="kpi-label">Gem. Score</div><div class="kpi-value">${avgScore}/10</div></div>
<div class="kpi"><div class="kpi-label">Conversie</div><div class="kpi-value">${convRate}%</div></div>
<div class="kpi"><div class="kpi-label">Totale Omzet</div><div class="kpi-value">€${totalRev.toLocaleString()}</div></div>
<div class="kpi"><div class="kpi-label">Gem. Deal Waarde</div><div class="kpi-value">€${closed.length > 0 ? Math.round(totalRev / closed.length).toLocaleString() : 0}</div></div>
<div class="kpi"><div class="kpi-label">Reps</div><div class="kpi-value">${repMap.size}</div></div>
</div>
<h2>Rep Overzicht</h2>
<table><thead><tr><th>Rep</th><th>Calls</th><th>Gem. Score</th><th>Deals</th><th>Conversie</th></tr></thead><tbody>${repRows}</tbody></table>
<h2>Leaderboard - Top per Categorie</h2>
<table><thead><tr><th>Categorie</th><th>Top Performer</th><th>Score</th></tr></thead><tbody>${leaderRows}</tbody></table>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 300); }
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
