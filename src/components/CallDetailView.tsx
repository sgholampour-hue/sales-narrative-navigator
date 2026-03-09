import { useState } from "react";
import type { Call } from "@/lib/callData";
import { AnalysisTab } from "@/components/AnalysisTab";
import { MarketingInsightsTab } from "@/components/MarketingInsightsTab";

interface Props {
  call: Call;
  onBack: () => void;
}

export const CallDetailView = ({ call, onBack }: Props) => {
  const [tab, setTab] = useState("Analysis");
  const tabs = ["Analysis", "Marketing Insights", "Transcript"];

  const statusStyle = {
    background: "hsl(var(--status-completed-bg))",
    color: "hsl(var(--status-completed-text))",
    border: "1px solid hsl(var(--status-completed-border))",
    borderRadius: 12, padding: "3px 10px", fontSize: 11,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 28px 60px" }}>
      {/* Breadcrumb */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 20,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "hsl(var(--muted-foreground))",
          fontSize: 12, cursor: "pointer", padding: 0,
        }}>📞 Sales Call Analyzer</button>
        <span>›</span>
        <span style={{ color: "hsl(var(--foreground))" }}>Call Details</span>
      </div>

      <div style={{
        background: "hsl(var(--card))", borderRadius: 14,
        border: "1px solid hsl(var(--border))",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          padding: "24px 28px", borderBottom: "1px solid hsl(var(--border))",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--foreground))" }}>
                AI Sales Call Recording Analysis
              </h1>
              <span style={statusStyle}>✓ {call.status}</span>
            </div>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
              Submission ID: {call.id} 📋
            </p>
          </div>
          <button style={{
            border: "1px solid hsl(var(--border))", borderRadius: 8,
            padding: "7px 14px", fontSize: 12, background: "hsl(var(--card))",
            color: "hsl(var(--foreground))", cursor: "pointer",
          }}>⋯ Actions</button>
        </div>

        {/* Submission info */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid hsl(var(--border))" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 10 }}>
            Submission Information
          </p>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
            <span>👤 {call.rep}</span>
            <span>✉️ {call.repEmail}</span>
            <span>📅 Created: {call.createdAt}</span>
          </div>
        </div>

        {/* Call context */}
        <div style={{ padding: "18px 28px", borderBottom: "1px solid hsl(var(--border))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>Call Context</p>
              <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                Prospect and company information
              </p>
            </div>
            <button style={{
              border: "none", background: "none", fontSize: 12,
              color: "hsl(var(--primary))", cursor: "pointer",
            }}>∨ View All Info</button>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 14 }}>
            <span>👤 {call.prospect}{call.prospectTitle ? `, ${call.prospectTitle}` : ""}</span>
            <span>✉️ {call.prospectEmail}</span>
            <span>📅 Call Date: {call.callDate}</span>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 20px",
            background: "hsl(var(--secondary))", borderRadius: 10, padding: 16, fontSize: 12,
          }}>
            {[
              { l: "Bedrijf", v: call.company }, { l: "Bron", v: call.source },
              { l: "Duur", v: call.duration }, { l: "Prestatieniveau", v: call.performanceLevel },
              { l: "Deal gesloten", v: call.dealClosed }, { l: "Dealwaarde", v: `€${call.dealValue.toLocaleString()}` },
              { l: "# Bezwaren", v: call.numObjections }, { l: "Bez.behandeling %", v: call.objectionHandlingRate },
              { l: "Volgende stappen", v: call.nextSteps, span: 2 },
              { l: "Call UUID", v: call.callUUID, span: 2 },
            ].map((x, i) => (
              <div key={i} style={{ gridColumn: x.span ? `span ${x.span}` : undefined }}>
                <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 3, fontSize: 11 }}>{x.l}</p>
                <p style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{x.v || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", borderBottom: "1px solid hsl(var(--border))",
          padding: "0 28px",
        }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px", border: "none", background: "none",
                fontSize: 13, fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                borderBottom: tab === t ? "2px solid hsl(var(--foreground))" : "2px solid transparent",
                marginBottom: -1, transition: "all .15s", cursor: "pointer",
              }}
            >{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: "24px 28px" }}>
          {tab === "Analysis" && <AnalysisTab call={call} />}
          {tab === "Marketing Insights" && <MarketingInsightsTab call={call} />}
          {tab === "Transcript" && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "hsl(var(--muted-foreground))" }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>📝</p>
              <p>Transcript niet beschikbaar voor dit gesprek.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
