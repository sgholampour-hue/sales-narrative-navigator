import { useState } from "react";
import type { Call } from "@/lib/callData";
import { Info, FileText, Target, Search, Lightbulb, Wrench, BarChart3, Flame, CheckCircle2, XCircle, Zap, AlertTriangle } from "lucide-react";
import { ScoreTrendChart } from "@/components/ScoreTrendChart";

const scoreColor = (s: number) =>
  s >= 7.5
    ? { bg: "hsl(var(--score-high-bg))", text: "hsl(var(--score-high-text))", border: "hsl(var(--status-completed-border))" }
    : s >= 5
    ? { bg: "hsl(var(--score-mid-bg))", text: "hsl(var(--score-mid-text))", border: "hsl(50 80% 70%)" }
    : { bg: "hsl(var(--score-low-bg))", text: "hsl(var(--score-low-text))", border: "hsl(var(--status-failed-border))" };

const CRIT_BG: Record<string, { bg: string; text: string }> = {
  pass: { bg: "hsl(142 76% 93%)", text: "hsl(var(--criteria-pass))" },
  fail: { bg: "hsl(0 93% 94%)", text: "hsl(var(--criteria-fail))" },
  neutral: { bg: "hsl(48 96% 89%)", text: "hsl(var(--criteria-neutral))" },
};

interface Props {
  call: Call;
  allCalls?: Call[];
}

const BREAKDOWN_ITEMS = [
  { key: "callControlScore" as const, label: "Gesprekscontrole", icon: <Target size={14} /> },
  { key: "discoveryDepthScore" as const, label: "Discovery Diepte", icon: <Search size={14} /> },
  { key: "beliefShiftingScore" as const, label: "Overtuiging", icon: <Lightbulb size={14} /> },
  { key: "objectionHandlingScore" as const, label: "Bezwaarbehandeling", icon: <Wrench size={14} /> },
  { key: "pitchEffectivenessScore" as const, label: "Pitch Effectiviteit", icon: <BarChart3 size={14} /> },
  { key: "closingStrengthScore" as const, label: "Afsluithracht", icon: <Flame size={14} /> },
];

const SUMMARY_ITEMS = [
  { key: "whatWorked" as const, label: "Wat werkte", icon: <CheckCircle2 size={15} />, bgClass: "bg-score-high" },
  { key: "areasToImprove" as const, label: "Verbeterpunten", icon: <XCircle size={15} />, bgClass: "bg-score-low" },
  { key: "keyStrength" as const, label: "Kernkracht", icon: <Zap size={15} />, bgClass: "bg-score-mid" },
  { key: "keyWeakness" as const, label: "Kernzwakte", icon: <AlertTriangle size={15} />, bgClass: "bg-amber-50 dark:bg-amber-950/30" },
];

export const AnalysisTab = ({ call, allCalls }: Props) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  return (
    <div>
      {/* Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        {[
          { l: "Totaal Score", s: "Totaal behaalde punten over alle geanalyseerde fases.", sc: call.totalScore },
          { l: "Gemiddelde Score", s: "Gemiddelde prestatie berekend over alle fases.", sc: call.averageScore },
        ].map(x => {
          const c = scoreColor(x.sc);
          return (
            <div key={x.l} className="border border-border/30 rounded-xl p-5 bg-card flex justify-between items-center glass-card glow-card">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{x.l}</p>
                <p className="text-xs text-muted-foreground">{x.s}</p>
              </div>
              <span className="text-2xl font-bold whitespace-nowrap rounded-lg px-4 py-2" style={{
                color: c.text, border: `2px solid ${c.border}`, background: c.bg,
              }}>{x.sc}/10</span>
            </div>
          );
        })}
      </div>

      {/* Score Breakdown */}
       <div className="border border-border/30 rounded-xl p-5 bg-card mb-7 glass-card glow-card">
        <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Score Overzicht</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BREAKDOWN_ITEMS.map(item => {
            const sc = call[item.key];
            const c = scoreColor(sc);
            return (
              <div key={item.key} className="bg-secondary rounded-lg p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${sc * 10}%`, background: c.text,
                    }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground min-w-[36px] text-right">{sc}/10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gespreksanalyse Samenvatting */}
       <div className="border border-border/30 rounded-xl p-5 bg-card mb-7 glass-card glow-card">
        <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Gespreksanalyse Samenvatting</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {SUMMARY_ITEMS.map(item => (
            <div key={item.key} className="rounded-lg p-4 border border-border bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-muted-foreground">{item.icon}</span>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</p>
              </div>
              <p className="text-sm font-medium text-foreground">{call[item.key]}</p>
            </div>
          ))}
        </div>
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target size={15} className="text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actie volgend gesprek</p>
          </div>
          <p className="text-sm font-medium text-foreground">{call.nextCallAction}</p>
        </div>
      </div>

      {/* Score Trend Chart */}
      {allCalls && allCalls.length > 1 && (
        <div className="border border-border/30 rounded-xl p-5 bg-card mb-7 glass-card glow-card">
          <p className="text-sm font-bold text-foreground mb-4 tracking-tight">Score Trends</p>
          <ScoreTrendChart calls={allCalls} />
        </div>
      )}

      {/* Call Stages Analysis */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold text-foreground tracking-tight">Gespreksfasen Analyse</p>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info size={13} /> Klik op een fase om de analyse te openen
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {call.stages.map(st => {
            const isOpen = expandedStage === st.name;
            return (
              <div key={st.name} className="border border-border/30 rounded-xl bg-card overflow-hidden glass-card glow-card" style={{
                borderLeft: isOpen ? "3px solid hsl(var(--primary))" : undefined,
              }}>
                <div
                  onClick={() => setExpandedStage(isOpen ? null : st.name)}
                  className="px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-5 cursor-pointer"
                >
                  <span className="text-sm font-medium text-foreground min-w-[100px] sm:min-w-[180px]">{st.name}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${st.score * 10}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground min-w-[50px] text-right">
                    {st.score}<span className="font-normal text-muted-foreground">/10</span>
                  </span>
                </div>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-border">
                    {st.criteria.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">Geen gedetailleerde criteria beschikbaar voor deze fase.</p>
                    )}
                    {st.criteria.map(cr => {
                      const critStyle = CRIT_BG[cr.status];
                      return (
                        <div key={cr.name} className="py-4 border-b border-border last:border-b-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold rounded-md px-2.5 py-1 inline-flex items-center gap-1" style={{
                              color: critStyle.text, background: critStyle.bg,
                            }}>
                              {cr.status === "pass" ? "✓" : cr.status === "fail" ? "✗" : "—"} Score: {cr.score}/10
                            </span>
                            <span className="text-sm font-semibold text-foreground">{cr.name}</span>
                          </div>

                          <p className="text-xs font-semibold text-foreground mb-1.5">Feedback:</p>
                          {cr.feedback.map((f, i) => (
                            <p key={i} className="text-sm text-muted-foreground mb-1 pl-4 relative">
                              <span className="absolute left-0">→</span>
                              {f}
                            </p>
                          ))}

                          {cr.transcriptExamples && (
                            <div className="mt-3.5">
                              <p className="text-xs font-semibold text-foreground mb-1.5">Transcriptie Voorbeelden:</p>
                              {cr.transcriptExamples.map((t, i) => (
                                <p key={i} className="text-xs text-muted-foreground italic mb-1">{t}</p>
                              ))}
                            </div>
                          )}

                          {cr.improvementExample && (
                            <div className="mt-3.5">
                              <p className="text-xs font-semibold text-foreground mb-1.5">Verbetervoorbeeld:</p>
                              <div className="text-sm text-foreground bg-secondary rounded-lg p-4 leading-relaxed border-l-[3px]" style={{
                                borderLeftColor: "hsl(var(--criteria-pass))",
                              }}>{cr.improvementExample}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Details */}
      <div className="border border-border rounded-xl p-5 bg-card">
        <p className="text-sm font-semibold text-foreground mb-3.5">Indiening Details</p>
        <div className="flex gap-10 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Invoertype</p>
            <p className="text-foreground font-medium flex items-center gap-1.5">
              <FileText size={14} /> Transcriptie
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Duur</p>
            <p className="text-foreground font-medium">{call.duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};