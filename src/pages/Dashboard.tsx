import { CALLS } from "@/lib/callData";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, TrendingDown, Users, DollarSign, Phone, Target, BarChart3, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { exportAllCallsCSV } from "@/lib/exportUtils";
import { Download } from "lucide-react";

const Dashboard = () => {
  const calls = CALLS;
  const total = calls.length;
  const avgScore = +(calls.reduce((a, c) => a + c.totalScore, 0) / total).toFixed(1);
  const closedDeals = calls.filter(c => c.dealClosed === "Yes");
  const conversionRate = +((closedDeals.length / total) * 100).toFixed(0);
  const totalRevenue = closedDeals.reduce((a, c) => a + c.dealValue, 0);
  const avgDealValue = closedDeals.length > 0 ? Math.round(totalRevenue / closedDeals.length) : 0;

  const avgMetrics = {
    callControl: +(calls.reduce((a, c) => a + c.callControlScore, 0) / total).toFixed(1),
    discovery: +(calls.reduce((a, c) => a + c.discoveryDepthScore, 0) / total).toFixed(1),
    beliefShifting: +(calls.reduce((a, c) => a + c.beliefShiftingScore, 0) / total).toFixed(1),
    objectionHandling: +(calls.reduce((a, c) => a + c.objectionHandlingScore, 0) / total).toFixed(1),
    pitch: +(calls.reduce((a, c) => a + c.pitchEffectivenessScore, 0) / total).toFixed(1),
    closing: +(calls.reduce((a, c) => a + c.closingStrengthScore, 0) / total).toFixed(1),
  };

  const radarData = [
    { subject: "Call Control", score: avgMetrics.callControl },
    { subject: "Discovery", score: avgMetrics.discovery },
    { subject: "Overtuiging", score: avgMetrics.beliefShifting },
    { subject: "Bezwaren", score: avgMetrics.objectionHandling },
    { subject: "Pitch", score: avgMetrics.pitch },
    { subject: "Closing", score: avgMetrics.closing },
  ];

  // Rep performance
  const repMap = new Map<string, { total: number; count: number; deals: number }>();
  calls.forEach(c => {
    const r = repMap.get(c.rep) || { total: 0, count: 0, deals: 0 };
    r.total += c.totalScore;
    r.count += 1;
    if (c.dealClosed === "Yes") r.deals += 1;
    repMap.set(c.rep, r);
  });
  const repData = Array.from(repMap.entries()).map(([name, d]) => ({
    name: name.split(" ")[0],
    avg: +(d.total / d.count).toFixed(1),
    calls: d.count,
    deals: d.deals,
  }));

  const kpis = [
    { label: "Totaal Calls", value: total, icon: <Phone size={18} />, color: "hsl(var(--primary))" },
    { label: "Gem. Score", value: `${avgScore}/10`, icon: <Target size={18} />, color: "hsl(var(--criteria-pass))", sub: avgScore >= 6 ? "Goed" : "Verbeterbaar" },
    { label: "Conversie", value: `${conversionRate}%`, icon: <Percent size={18} />, color: "hsl(var(--criteria-neutral))", sub: `${closedDeals.length} van ${total}` },
    { label: "Totale Omzet", value: `€${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: "hsl(var(--criteria-pass))" },
    { label: "Gem. Deal Waarde", value: `€${avgDealValue.toLocaleString()}`, icon: <TrendingUp size={18} />, color: "hsl(var(--primary))" },
    { label: "Reps", value: repMap.size, icon: <Users size={18} />, color: "hsl(var(--criteria-neutral))" },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overzicht van alle sales prestaties</p>
          </div>
          <button
            onClick={() => exportAllCallsCSV(calls)}
            className="border border-border rounded-lg px-4 py-2 text-xs sm:text-sm font-medium bg-card text-foreground cursor-pointer flex items-center gap-1.5 hover:bg-secondary transition-colors self-start"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
                <span style={{ color: k.color }}>{k.icon}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{k.value}</p>
              {k.sub && <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>}
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Radar */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Gemiddelde Scores per Categorie</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Rep performance bar chart */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Score per Rep</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={repData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number) => [`${value}/10`, "Gem. Score"]}
                />
                <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-sm font-bold text-foreground tracking-tight">Rep Overzicht</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Rep", "Calls", "Gem. Score", "Deals Gesloten", "Conversie"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repData.map(r => (
                  <tr key={r.name} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.calls}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold" style={{ color: r.avg >= 7 ? "hsl(var(--criteria-pass))" : r.avg >= 5 ? "hsl(var(--criteria-neutral))" : "hsl(var(--criteria-fail))" }}>
                        {r.avg}/10
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.deals}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.calls > 0 ? Math.round((r.deals / r.calls) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
