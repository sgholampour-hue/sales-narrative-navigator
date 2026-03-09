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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={onBack} className="bg-transparent border-none text-muted-foreground text-sm cursor-pointer p-0 flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Phone size={13} /> Sales Call Analyzer
        </button>
        <span className="opacity-50">›</span>
        <span className="text-foreground font-medium">Call Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              AI Sales Call Recording Analysis
            </h1>
            <span className="rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-1" style={{
              background: "hsl(var(--status-completed-bg))", color: "hsl(var(--status-completed-text))",
              border: "1px solid hsl(var(--status-completed-border))",
            }}>
              <CircleCheck size={12} /> {call.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Submission ID: {call.id}
            <Copy size={12} className="cursor-pointer opacity-50 hover:opacity-100" />
          </p>
        </div>
        <button className="border border-border rounded-lg px-4 py-2 text-sm font-medium bg-card text-foreground cursor-pointer flex items-center gap-1.5 hover:bg-secondary transition-colors self-start">
          <MoreHorizontal size={14} /> Actions
        </button>
      </div>

      {/* Submission info card */}
      <div className="border border-border rounded-xl p-4 sm:p-5 mb-4 bg-card">
        <p className="text-sm font-semibold text-foreground mb-4">Submission Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <User size={15} className="text-muted-foreground" />, value: call.rep },
            { icon: <Mail size={15} className="text-muted-foreground" />, value: call.repEmail },
            { icon: <Calendar size={15} className="text-muted-foreground" />, label: "Created:", value: call.createdAt },
          ].map((x, i) => (
            <div key={i} className="bg-secondary rounded-lg p-3 flex items-center gap-2.5 text-sm text-foreground">
              {x.icon}
              {x.label && <span className="text-muted-foreground font-medium">{x.label}</span>}
              <span className="font-medium truncate">{x.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call Context card */}
      <div className="border border-border rounded-xl p-4 sm:p-5 mb-6 bg-card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Call Context</p>
            <p className="text-xs text-muted-foreground mt-0.5">Prospect and company information</p>
          </div>
          <button className="border border-border rounded-lg px-3 py-1.5 text-xs font-medium bg-card text-foreground cursor-pointer flex items-center gap-1 hover:bg-secondary transition-colors">
            <ChevronDown size={13} /> View All Info
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <User size={15} className="text-muted-foreground" />, value: `${call.prospect}${call.prospectTitle ? `, ${call.prospectTitle}` : ""}` },
            { icon: <Mail size={15} className="text-muted-foreground" />, value: call.prospectEmail },
            { icon: <Calendar size={15} className="text-muted-foreground" />, label: "Call Date:", value: call.callDate },
          ].map((x, i) => (
            <div key={i} className="bg-secondary rounded-lg p-3 flex items-center gap-2.5 text-sm text-foreground">
              {x.icon}
              {x.label && <span className="text-muted-foreground font-medium">{x.label}</span>}
              <span className="font-medium truncate">{x.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs - pill style */}
      <div className="grid grid-cols-3 bg-secondary rounded-lg p-1 mb-6 border border-border">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 border-none rounded-md text-xs sm:text-sm cursor-pointer transition-all ${
              tab === t
                ? "bg-card text-foreground font-semibold shadow-sm"
                : "bg-transparent text-muted-foreground font-normal"
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Analysis" && <AnalysisTab call={call} />}
      {tab === "Marketing Insights" && <MarketingInsightsTab call={call} />}
      {tab === "Transcript" && (
        <div className="text-center py-20 text-muted-foreground border border-border rounded-xl bg-card">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">Transcript niet beschikbaar voor dit gesprek.</p>
        </div>
      )}
    </div>
  );
};
