import { useState } from "react";
import type { Call } from "@/lib/callData";

const scoreColor = (s: number) =>
  s >= 7.5
    ? { bg: "hsl(var(--score-high-bg))", text: "hsl(var(--score-high-text))" }
    : s >= 5
    ? { bg: "hsl(var(--score-mid-bg))", text: "hsl(var(--score-mid-text))" }
    : { bg: "hsl(var(--score-low-bg))", text: "hsl(var(--score-low-text))" };

const CRIT_COLORS: Record<string, string> = {
  pass: "hsl(var(--criteria-pass))",
  fail: "hsl(var(--criteria-fail))",
  neutral: "hsl(var(--criteria-neutral))",
};

interface Props {
  call: Call;
}

export const AnalysisTab = ({ call }: Props) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  return (
    <div>
      {/* Score cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          { l: "Total Score", s: "Total points earned across all analyzed stages.", sc: call.totalScore },
          { l: "Average Score", s: "Average stage performance calculated across all stages.", sc: call.averageScore },
        ].map(x => {
          const c = scoreColor(x.sc);
          return (
            <div key={x.l} style={{
              background: "hsl(var(--secondary))", borderRadius: 12, padding: 20,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>{x.l}</p>
              <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>{x.s}</p>
              <p style={{
                fontSize: 28, fontWeight: 700, color: c.text,
                background: c.bg, display: "inline-block", borderRadius: 8, padding: "4px 14px",
              }}>{x.sc}<span style={{ fontSize: 14 }}>/10</span></p>
            </div>
          );
        })}
      </div>

      {/* Score Breakdown */}
      <div style={{
        background: "hsl(var(--secondary))", borderRadius: 12, padding: 20, marginBottom: 24,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 16 }}>
          Score Breakdown
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["🎯 Gesprekscontrole", call.callControlScore],
            ["🔍 Discovery Diepte", call.discoveryDepthScore],
            ["💡 Overtuiging", call.beliefShiftingScore],
            ["🛠 Bezwaarbehandeling", call.objectionHandlingScore],
            ["📊 Pitch Effectiviteit", call.pitchEffectivenessScore],
            ["💪 Afsluithracht", call.closingStrengthScore],
          ].map(([label, sc]) => {
            const c = scoreColor(sc as number);
            return (
              <div key={label as string} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <p style={{ fontSize: 12, color: "hsl(var(--foreground))" }}>{label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 80, height: 6, background: "hsl(var(--border))", borderRadius: 3,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${(sc as number) * 10}%`, height: "100%",
                      background: c.text, borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>
                    {sc as number}/10
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: "hsl(var(--secondary))", borderRadius: 12, padding: 20, marginBottom: 24,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 14 }}>
          Gespreksanalyse Samenvatting
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[
            ["✅", "Wat werkte", call.whatWorked, "hsl(var(--score-high-bg))"],
            ["❌", "Verbeterpunten", call.areasToImprove, "hsl(var(--score-low-bg))"],
            ["🔥", "Kernkracht", call.keyStrength, "hsl(var(--score-mid-bg))"],
            ["⚠️", "Kernzwakte", call.keyWeakness, "hsl(255 100% 97%)"],
          ].map(([icon, label, value, bg]) => (
            <div key={label} style={{
              background: bg, borderRadius: 10, padding: 14,
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 4 }}>
                {icon} {label}
              </p>
              <p style={{ fontSize: 12, color: "hsl(var(--foreground))" }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{
          background: "hsl(var(--card))", borderRadius: 10, padding: 14,
          border: "1px solid hsl(var(--border))",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 4 }}>
            🎯 Actie volgend gesprek
          </p>
          <p style={{ fontSize: 12, color: "hsl(var(--foreground))" }}>{call.nextCallAction}</p>
        </div>
      </div>

      {/* Stages */}
      <div style={{
        background: "hsl(var(--secondary))", borderRadius: 12, padding: 20,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>
            Call Stages Analysis
          </p>
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            ⓘ Click on stage to open analysis
          </span>
        </div>

        {call.stages.map(st => {
          const isOpen = expandedStage === st.name;
          const c = scoreColor(st.score);
          return (
            <div key={st.name} style={{
              background: "hsl(var(--card))", borderRadius: 10, marginBottom: 8,
              border: "1px solid hsl(var(--border))", overflow: "hidden",
            }}>
              <div
                onClick={() => setExpandedStage(isOpen ? null : st.name)}
                style={{
                  padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                  borderLeft: isOpen ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                  cursor: "pointer", transition: "border-color .2s",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))", flex: 1 }}>
                  {st.name}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: c.text,
                  background: c.bg, borderRadius: 6, padding: "2px 10px",
                }}>{st.score}/10</span>
              </div>

              {isOpen && (
                <div style={{ padding: "0 18px 18px", borderTop: "1px solid hsl(var(--border))" }}>
                  {st.criteria.length === 0 && (
                    <p style={{
                      fontSize: 12, color: "hsl(var(--muted-foreground))",
                      padding: "14px 0",
                    }}>Geen gedetailleerde criteria beschikbaar voor dit stage.</p>
                  )}
                  {st.criteria.map(cr => (
                    <div key={cr.name} style={{
                      padding: "14px 0",
                      borderBottom: "1px solid hsl(var(--border))",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: CRIT_COLORS[cr.status],
                          background: `${CRIT_COLORS[cr.status]}15`,
                          borderRadius: 6, padding: "2px 8px",
                        }}>
                          {cr.status === "pass" ? "✓" : cr.status === "fail" ? "✗" : "—"} Score: {cr.score}/10
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>
                          {cr.name}
                        </span>
                      </div>

                      <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 4 }}>
                        Feedback:
                      </p>
                      {cr.feedback.map((f, i) => (
                        <p key={i} style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 3 }}>
                          →{f}
                        </p>
                      ))}

                      {cr.transcriptExamples && (
                        <>
                          <p style={{
                            fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))",
                            marginTop: 10, marginBottom: 4,
                          }}>Transcript Examples:</p>
                          {cr.transcriptExamples.map((t, i) => (
                            <p key={i} style={{
                              fontSize: 11, color: "hsl(var(--muted-foreground))",
                              fontStyle: "italic", marginBottom: 3,
                            }}>{t}</p>
                          ))}
                        </>
                      )}

                      {cr.improvementExample && (
                        <>
                          <p style={{
                            fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))",
                            marginTop: 10, marginBottom: 4,
                          }}>Improvement Example:</p>
                          <p style={{
                            fontSize: 12, color: "hsl(var(--foreground))",
                            background: "hsl(var(--score-high-bg))", borderRadius: 8,
                            padding: 12, lineHeight: 1.5,
                          }}>{cr.improvementExample}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Submission details */}
        <div style={{
          background: "hsl(var(--card))", borderRadius: 10, padding: 18, marginTop: 12,
          border: "1px solid hsl(var(--border))",
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 10 }}>
            Submission Details
          </p>
          <div style={{ display: "flex", gap: 30, fontSize: 12 }}>
            <div>
              <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 3 }}>Input Type</p>
              <p style={{ color: "hsl(var(--foreground))" }}>📄 Transcript</p>
            </div>
            <div>
              <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 3 }}>Duration</p>
              <p style={{ color: "hsl(var(--foreground))" }}>{call.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
