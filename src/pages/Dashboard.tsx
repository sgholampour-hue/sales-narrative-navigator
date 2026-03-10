import { useState, useMemo } from "react";
import { CALLS, type Call } from "@/lib/callData";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, Users, DollarSign, Phone, Target, Percent, Download, FileText, Trophy, Medal, CalendarIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { exportAllCallsCSV, exportDashboardPDF } from "@/lib/exportUtils";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CATEGORIES = [
  { key: "callControlScore" as const, label: "Gesprekscontrole", icon: "🎯" },
  { key: "discoveryDepthScore" as const, label: "Discovery Diepte", icon: "🔍" },
  { key: "beliefShiftingScore" as const, label: "Overtuiging", icon: "💡" },
  { key: "objectionHandlingScore" as const, label: "Bezwaarbehandeling", icon: "🛠" },
  { key: "pitchEffectivenessScore" as const, label: "Pitch Effectiviteit", icon: "📊" },
  { key: "closingStrengthScore" as const, label: "Afsluithracht", icon: "🔥" },
];

const Dashboard = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const calls = useMemo(() => {
    return CALLS.filter(c => {
      const d = new Date(c.date);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  }, [dateFrom, dateTo]);

  const total = calls.length;
  const avgScore = total > 0 ? +(calls.reduce((a, c) => a + c.totalScore, 0) / total).toFixed(1) : 0;
  const closedDeals = calls.filter(c => c.dealClosed === "Yes");
  const conversionRate = total > 0 ? +((closedDeals.length / total) * 100).toFixed(0) : 0;
  const totalRevenue = closedDeals.reduce((a, c) => a + c.dealValue, 0);
  const avgDealValue = closedDeals.length > 0 ? Math.round(totalRevenue / closedDeals.length) : 0;

  const avgMetrics = useMemo(() => {
    if (total === 0) return { callControl: 0, discovery: 0, beliefShifting: 0, objectionHandling: 0, pitch: 0, closing: 0 };
    return {
      callControl: +(calls.reduce((a, c) => a + c.callControlScore, 0) / total).toFixed(1),
      discovery: +(calls.reduce((a, c) => a + c.discoveryDepthScore, 0) / total).toFixed(1),
      beliefShifting: +(calls.reduce((a, c) => a + c.beliefShiftingScore, 0) / total).toFixed(1),
      objectionHandling: +(calls.reduce((a, c) => a + c.objectionHandlingScore, 0) / total).toFixed(1),
      pitch: +(calls.reduce((a, c) => a + c.pitchEffectivenessScore, 0) / total).toFixed(1),
      closing: +(calls.reduce((a, c) => a + c.closingStrengthScore, 0) / total).toFixed(1),
    };
  }, [calls, total]);

  const radarData = [
    { subject: "Gesprekscontrole", score: avgMetrics.callControl },
    { subject: "Discovery", score: avgMetrics.discovery },
    { subject: "Overtuiging", score: avgMetrics.beliefShifting },
    { subject: "Bezwaren", score: avgMetrics.objectionHandling },
    { subject: "Pitch", score: avgMetrics.pitch },
    { subject: "Afsluiting", score: avgMetrics.closing },
  ];

  const repMap = new Map<string, { total: number; count: number; deals: number; scores: Record<string, number[]> }>();
  calls.forEach(c => {
    const r = repMap.get(c.rep) || { total: 0, count: 0, deals: 0, scores: {} };
    r.total += c.totalScore;
    r.count += 1;
    if (c.dealClosed === "Yes") r.deals += 1;
    CATEGORIES.forEach(cat => {
      if (!r.scores[cat.key]) r.scores[cat.key] = [];
      r.scores[cat.key].push(c[cat.key]);
    });
    repMap.set(c.rep, r);
  });

  const repData = Array.from(repMap.entries()).map(([name, d]) => ({
    name: name.split(" ")[0],
    fullName: name,
    avg: +(d.total / d.count).toFixed(1),
    calls: d.count,
    deals: d.deals,
    scores: d.scores,
  }));

  const leaderboard = CATEGORIES.map(cat => {
    const ranked = repData
      .map(r => ({ name: r.fullName, avg: +(r.scores[cat.key]?.reduce((a, b) => a + b, 0) / (r.scores[cat.key]?.length || 1)).toFixed(1) }))
      .sort((a, b) => b.avg - a.avg);
    return { ...cat, top: ranked.slice(0, 3) };
  });

  const kpis = [
    { label: "Totaal Gesprekken", value: total, icon: <Phone size={18} />, color: "hsl(var(--primary))" },
    { label: "Gem. Score", value: `${avgScore}/10`, icon: <Target size={18} />, color: "hsl(var(--criteria-pass))", sub: avgScore >= 6 ? "Goed" : "Verbeterbaar" },
    { label: "Conversie", value: `${conversionRate}%`, icon: <Percent size={18} />, color: "hsl(var(--criteria-neutral))", sub: `${closedDeals.length} van ${total}` },
    { label: "Totale Omzet", value: `€${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: "hsl(var(--criteria-pass))" },
    { label: "Gem. Deal Waarde", value: `€${avgDealValue.toLocaleString()}`, icon: <TrendingUp size={18} />, color: "hsl(var(--primary))" },
    { label: "Vertegenwoordigers", value: repMap.size, icon: <Users size={18} />, color: "hsl(var(--criteria-neutral))" },
  ];

  const medalColors = ["hsl(45 93% 47%)", "hsl(0 0% 66%)", "hsl(25 50% 45%)"];

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overzicht van alle sales prestaties</p>
          </div>
          <div className="flex gap-2 self-start">
            <button
              onClick={() => exportAllCallsCSV(calls)}
              className="border border-border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-card text-foreground cursor-pointer flex items-center gap-1.5 hover:bg-secondary transition-colors"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={() => exportDashboardPDF(calls)}
              className="border border-border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium bg-card text-foreground cursor-pointer flex items-center gap-1.5 hover:bg-secondary transition-colors"
            >
              <FileText size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-card rounded-xl border border-border p-3 sm:p-4">
          <span className="text-xs font-medium text-muted-foreground">Periode:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon size={13} />
                {dateFrom ? format(dateFrom, "d MMM yyyy", { locale: nl }) : "Van"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">→</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !dateTo && "text-muted-foreground")}>
                <CalendarIcon size={13} />
                {dateTo ? format(dateTo, "d MMM yyyy", { locale: nl }) : "Tot"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none underline"
            >
              Reset
            </button>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{total} gesprekken gevonden</span>
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

          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Score per Vertegenwoordiger</p>
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

        {/* Leaderboard */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-foreground" />
            <p className="text-sm font-bold text-foreground tracking-tight">Leaderboard — Top Presteerders per Categorie</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {leaderboard.map(cat => (
              <div key={cat.key} className="bg-secondary rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{cat.label}</span>
                </div>
                {cat.top.length === 0 && <p className="text-xs text-muted-foreground">Geen data</p>}
                {cat.top.map((r, i) => (
                  <div key={r.name} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <Medal size={14} style={{ color: medalColors[i] || "hsl(var(--muted-foreground))" }} />
                      <span className="text-sm text-foreground font-medium">{r.name}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{
                      color: r.avg >= 7 ? "hsl(var(--criteria-pass))" : r.avg >= 5 ? "hsl(var(--criteria-neutral))" : "hsl(var(--criteria-fail))"
                    }}>
                      {r.avg}/10
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Rep table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-sm font-bold text-foreground tracking-tight">Vertegenwoordiger Overzicht</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Vertegenwoordiger", "Gesprekken", "Gem. Score", "Deals Gesloten", "Conversie"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repData.map(r => (
                  <tr key={r.fullName} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium text-foreground">{r.fullName}</td>
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