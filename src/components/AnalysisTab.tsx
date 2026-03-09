import { useState } from "react";
import type { Call } from "@/lib/callData";
import { Info, FileText } from "lucide-react";

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
}

export const AnalysisTab = ({ call }: Props) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  return (
    <div>
      {/* Score cards - horizontal with score on right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {[
          { l: "Total Score", s: "Total points earned across all analyzed stages.", sc: call.totalScore },
          { l: "Average Score", s: "Average stage performance calculated across all stages.", sc: call.averageScore },
        ].map(x => {
          const c = scoreColor(x.sc);
          return (
            <div key={x.l} style={{
              border: "1px solid hsl(var(--border))", borderRadius: 12, padding: "20px 24px",
              background: "hsl(var(--card))",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 4 }}>{x.l}</p>
                <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{x.s}</p>
              </div>
              <span style={{
                fontSize: 24, fontWeight: 700, color: c.text,
                border: `2px solid ${c.border}`, borderRadius: 10, padding: "8px 16px",
                background: c.bg, whiteSpace: "nowrap",
              }}>{x.sc}/10</span>
            </div>
          );
        })}
      </div>

      {/* Call Stages Analysis */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>
            Call Stages Analysis
          </p>
          <span style={{
            fontSize: 12, color: "hsl(var(--muted-foreground))",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Info size={13} /> Click on stage to open analysis
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {call.stages.map(st => {
            const isOpen = expandedStage === st.name;
            return (
              <div key={st.name} style={{
                border: "1px solid hsl(var(--border))", borderRadius: 12,
                background: "hsl(var(--card))", overflow: "hidden",
                borderLeft: isOpen ? "3px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
              }}>
                <div
                  onClick={() => setExpandedStage(isOpen ? null : st.name)}
                  style={{
                    padding: "16px 20px", display: "flex", alignItems: "center",
                    cursor: "pointer", gap: 20,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--foreground))", minWidth: 180 }}>
                    {st.name}
                  </span>
                  {/* Progress bar */}
                  <div style={{
                    flex: 1, height: 8, background: "hsl(var(--secondary))", borderRadius: 4,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${st.score * 10}%`, height: "100%",
                      background: "hsl(var(--foreground))", borderRadius: 4,
                      transition: "width .3s ease",
                    }} />
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))",
                    minWidth: 50, textAlign: "right",
                  }}>
                    {st.score}<span style={{ fontWeight: 400, color: "hsl(var(--muted-foreground))" }}>/10</span>
                  </span>
                </div>

                {isOpen && (
                  <div style={{
                    padding: "0 20px 20px", borderTop: "1px solid hsl(var(--border))",
                  }}>
                    {st.criteria.length === 0 && (
                      <p style={{
                        fontSize: 13, color: "hsl(var(--muted-foreground))", padding: "16px 0",
                      }}>Geen gedetailleerde criteria beschikbaar voor dit stage.</p>
                    )}
                    {st.criteria.map(cr => {
                      const critStyle = CRIT_BG[cr.status];
                      return (
                        <div key={cr.name} style={{
                          padding: "18px 0",
                          borderBottom: "1px solid hsl(var(--border))",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <span style={{
                              fontSize: 12, fontWeight: 600, color: critStyle.text,
                              background: critStyle.bg, borderRadius: 6, padding: "3px 10px",
                              display: "inline-flex", alignItems: "center", gap: 4,
                            }}>
                              {cr.status === "pass" ? "✓" : cr.status === "fail" ? "✗" : "—"} Score: {cr.score}/10
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>
                              {cr.name}
                            </span>
                          </div>

                          <p style={{
                            fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))",
                            marginBottom: 6,
                          }}>Feedback:</p>
                          {cr.feedback.map((f, i) => (
                            <p key={i} style={{
                              fontSize: 13, color: "hsl(var(--muted-foreground))",
                              marginBottom: 4, paddingLeft: 16, position: "relative",
                            }}>
                              <span style={{ position: "absolute", left: 0 }}>→</span>
                              {f}
                            </p>
                          ))}

                          {cr.transcriptExamples && (
                            <div style={{ marginTop: 14 }}>
                              <p style={{
                                fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))",
                                marginBottom: 6,
                              }}>Transcript Examples:</p>
                              {cr.transcriptExamples.map((t, i) => (
                                <p key={i} style={{
                                  fontSize: 12, color: "hsl(var(--muted-foreground))",
                                  fontStyle: "italic", marginBottom: 4,
                                }}>{t}</p>
                              ))}
                            </div>
                          )}

                          {cr.improvementExample && (
                            <div style={{ marginTop: 14 }}>
                              <p style={{
                                fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))",
                                marginBottom: 6,
                              }}>Improvement Example:</p>
                              <div style={{
                                fontSize: 13, color: "hsl(var(--foreground))",
                                background: "hsl(var(--secondary))", borderRadius: 10,
                                padding: 16, lineHeight: 1.6,
                                borderLeft: "3px solid hsl(var(--criteria-pass))",
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
      <div style={{
        border: "1px solid hsl(var(--border))", borderRadius: 12,
        padding: "20px 24px", background: "hsl(var(--card))",
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 14 }}>
          Submission Details
        </p>
        <div style={{ display: "flex", gap: 40, fontSize: 13 }}>
          <div>
            <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 4, fontSize: 12 }}>Input Type</p>
            <p style={{
              color: "hsl(var(--foreground))", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <FileText size={14} /> Transcript
            </p>
          </div>
          <div>
            <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 4, fontSize: 12 }}>Duration</p>
            <p style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{call.duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
