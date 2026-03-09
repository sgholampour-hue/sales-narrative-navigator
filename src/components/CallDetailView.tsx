import { useState } from "react";
import type { Call } from "@/lib/callData";
import { AnalysisTab } from "@/components/AnalysisTab";
import { MarketingInsightsTab } from "@/components/MarketingInsightsTab";
import { Phone, CircleCheck, Copy, MoreHorizontal, User, Mail, Calendar, ChevronDown } from "lucide-react";

interface Props {
  call: Call;
  onBack: () => void;
}

export const CallDetailView = ({ call, onBack }: Props) => {
  const [tab, setTab] = useState("Analysis");
  const tabs = ["Analysis", "Marketing Insights", "Transcript"];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 60px" }}>
      {/* Breadcrumb */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 13, color: "hsl(var(--muted-foreground))", marginBottom: 24,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "hsl(var(--muted-foreground))",
          fontSize: 13, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Phone size={13} /> Sales Call Analyzer
        </button>
        <span style={{ opacity: 0.5 }}>›</span>
        <span style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>Call Details</span>
      </div>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 24,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.02em" }}>
              AI Sales Call Recording Analysis
            </h1>
            <span style={{
              background: "hsl(var(--status-completed-bg))", color: "hsl(var(--status-completed-text))",
              border: "1px solid hsl(var(--status-completed-border))",
              borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <CircleCheck size={12} /> {call.status}
            </span>
          </div>
          <p style={{
            fontSize: 13, color: "hsl(var(--muted-foreground))",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            Submission ID: {call.id}
            <Copy size={12} style={{ cursor: "pointer", opacity: 0.5 }} />
          </p>
        </div>
        <button style={{
          border: "1px solid hsl(var(--border))", borderRadius: 8,
          padding: "8px 16px", fontSize: 13, fontWeight: 500, background: "hsl(var(--card))",
          color: "hsl(var(--foreground))", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <MoreHorizontal size={14} /> Actions
        </button>
      </div>

      {/* Submission info card */}
      <div style={{
        border: "1px solid hsl(var(--border))", borderRadius: 12,
        padding: "20px 24px", marginBottom: 16, background: "hsl(var(--card))",
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 16 }}>
          Submission Information
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: <User size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, value: call.rep },
            { icon: <Mail size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, value: call.repEmail },
            { icon: <Calendar size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, label: "Created:", value: call.createdAt },
          ].map((x, i) => (
            <div key={i} style={{
              background: "hsl(var(--secondary))", borderRadius: 10, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10, fontSize: 13,
              color: "hsl(var(--foreground))",
            }}>
              {x.icon}
              {x.label && <span style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{x.label}</span>}
              <span style={{ fontWeight: 500 }}>{x.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call Context card */}
      <div style={{
        border: "1px solid hsl(var(--border))", borderRadius: 12,
        padding: "20px 24px", marginBottom: 24, background: "hsl(var(--card))",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>Call Context</p>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
              Prospect and company information
            </p>
          </div>
          <button style={{
            border: "1px solid hsl(var(--border))", borderRadius: 8,
            padding: "6px 14px", fontSize: 12, fontWeight: 500, background: "hsl(var(--card))",
            color: "hsl(var(--foreground))", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <ChevronDown size={13} /> View All Info
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: <User size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, value: `${call.prospect}${call.prospectTitle ? `, ${call.prospectTitle}` : ""}` },
            { icon: <Mail size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, value: call.prospectEmail },
            { icon: <Calendar size={15} style={{ color: "hsl(var(--muted-foreground))" }} />, label: "Call Date:", value: call.callDate },
          ].map((x, i) => (
            <div key={i} style={{
              background: "hsl(var(--secondary))", borderRadius: 10, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10, fontSize: 13,
              color: "hsl(var(--foreground))",
            }}>
              {x.icon}
              {x.label && <span style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{x.label}</span>}
              <span style={{ fontWeight: 500 }}>{x.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs - pill style */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        background: "hsl(var(--secondary))", borderRadius: 10, padding: 4,
        marginBottom: 24, border: "1px solid hsl(var(--border))",
      }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 0", border: "none",
              background: tab === t ? "hsl(var(--card))" : "transparent",
              fontSize: 13, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              borderRadius: 8, cursor: "pointer", transition: "all .15s",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.06)" : "none",
            }}
          >{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Analysis" && <AnalysisTab call={call} />}
      {tab === "Marketing Insights" && <MarketingInsightsTab call={call} />}
      {tab === "Transcript" && (
        <div style={{
          textAlign: "center", padding: "80px 0", color: "hsl(var(--muted-foreground))",
          border: "1px solid hsl(var(--border))", borderRadius: 12,
          background: "hsl(var(--card))",
        }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>📝</p>
          <p style={{ fontSize: 14 }}>Transcript niet beschikbaar voor dit gesprek.</p>
        </div>
      )}
    </div>
  );
};
