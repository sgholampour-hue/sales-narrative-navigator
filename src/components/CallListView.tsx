import { useState } from "react";
import type { Call } from "@/lib/callData";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Completed: { bg: "hsl(var(--status-completed-bg))", text: "hsl(var(--status-completed-text))", border: "hsl(var(--status-completed-border))" },
  Active: { bg: "hsl(var(--status-active-bg))", text: "hsl(var(--status-active-text))", border: "hsl(var(--status-active-border))" },
  Failed: { bg: "hsl(var(--status-failed-bg))", text: "hsl(var(--status-failed-text))", border: "hsl(var(--status-failed-border))" },
  Pending: { bg: "hsl(var(--status-pending-bg))", text: "hsl(var(--status-pending-text))", border: "hsl(var(--status-pending-border))" },
};

const PROGRESS_MAP: Record<string, { color: string; icon: string }> = {
  Declining: { color: "hsl(var(--trend-declining))", icon: "↘" },
  Improving: { color: "hsl(var(--trend-improving))", icon: "↗" },
  "-": { color: "hsl(var(--trend-neutral))", icon: "—" },
};

interface Props {
  calls: Call[];
  onOpenCall: (call: Call) => void;
}

export const CallListView = ({ calls, onOpenCall }: Props) => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [typeDropdown, setTypeDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = calls.filter(c =>
    (!statusFilter.length || statusFilter.includes(c.status)) &&
    (!typeFilter.length || typeFilter.includes(c.type)) &&
    (!query || c.prospect.toLowerCase().includes(query.toLowerCase()) || c.company.toLowerCase().includes(query.toLowerCase()))
  );

  const avg = calls.length > 0
    ? (calls.reduce((a, b) => a + b.totalScore, 0) / calls.length).toFixed(1)
    : "0";

  const scoreCards = [
    { label: "Discovery Calls", icon: "🔍" },
    { label: "Interview Calls", icon: "📋" },
    { label: "Sales Calls", icon: "💼", score: avg, count: calls.length, change: "-0.3" },
    { label: "Podcast Calls", icon: "🎙️" },
  ];

  const filters = [
    {
      label: "Status", dd: statusDropdown,
      setDd: (v: boolean) => { setStatusDropdown(v); setTypeDropdown(false); },
      opts: ["Active", "Completed", "Failed", "Joining", "Pending", "Processing"],
      filt: statusFilter, setFilt: setStatusFilter,
    },
    {
      label: "Type", dd: typeDropdown,
      setDd: (v: boolean) => { setTypeDropdown(v); setStatusDropdown(false); },
      opts: ["Live", "Recording"],
      filt: typeFilter, setFilt: setTypeFilter,
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 28px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--foreground))" }}>Sales Calls</h1>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>
            View and manage your AI-analyzed sales calls
          </p>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <button style={{
            border: "1px solid hsl(var(--border))", borderRadius: 8,
            padding: "8px 16px", fontSize: 12, background: "hsl(var(--card))",
            color: "hsl(var(--foreground))", cursor: "pointer",
          }}>⚙️ Settings</button>
          <button style={{
            borderRadius: 8, padding: "8px 16px", fontSize: 12, border: "none",
            background: "hsl(var(--foreground))", color: "hsl(var(--card))", cursor: "pointer",
          }}>+ New Call</button>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {scoreCards.map(c => (
          <div key={c.label} style={{
            background: "hsl(var(--card))", borderRadius: 14, padding: 20,
            border: "1px solid hsl(var(--border))",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "hsl(var(--muted-foreground))" }}>{c.label}</span>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
            </div>
            {c.score ? (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "hsl(var(--foreground))" }}>{c.score}</span>
                  <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>/10</span>
                  <span style={{ fontSize: 11, color: "hsl(var(--trend-declining))", marginLeft: 6 }}>↘ {c.change}</span>
                </div>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>
                  Based on {c.count} calls
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))" }}>No Data Yet</p>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Need at least 2 calls</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div
        onClick={() => { setStatusDropdown(false); setTypeDropdown(false); }}
        style={{
          background: "hsl(var(--card))", borderRadius: 14,
          border: "1px solid hsl(var(--border))", overflow: "hidden",
        }}
      >
        {/* Filters */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px", borderBottom: "1px solid hsl(var(--border))",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {filters.map(f => (
              <div key={f.label} style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); f.setDd(!f.dd); }}
                  style={{
                    border: "1px solid hsl(var(--border))", borderRadius: 16,
                    padding: "5px 11px", fontSize: 12,
                    background: f.filt.length ? "hsl(var(--status-active-bg))" : "hsl(var(--card))",
                    color: "hsl(var(--foreground))", display: "flex", alignItems: "center", gap: 5,
                    cursor: "pointer",
                  }}
                >
                  ⊕ {f.label}
                  {f.filt.length > 0 && (
                    <span style={{
                      background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
                      borderRadius: 9, padding: "1px 6px", fontSize: 10,
                    }}>{f.filt.length}</span>
                  )}
                </button>
                {f.dd && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      position: "absolute", top: 32, left: 0,
                      background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                      borderRadius: 9, boxShadow: "0 8px 20px rgba(0,0,0,.1)",
                      zIndex: 50, minWidth: 175, padding: 7,
                    }}
                  >
                    {f.opts.map(s => (
                      <label key={s} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "5px 8px", fontSize: 12, cursor: "pointer",
                        color: "hsl(var(--foreground))",
                      }}>
                        <input
                          type="checkbox"
                          checked={f.filt.includes(s)}
                          onChange={e =>
                            f.setFilt(p => e.target.checked ? [...p, s] : p.filter(x => x !== s))
                          }
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "5px 10px",
          }}>
            <span style={{ fontSize: 13 }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search sales calls..."
              style={{
                border: "none", background: "none", outline: "none",
                fontSize: 12, width: 170, color: "hsl(var(--foreground))",
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "hsl(var(--secondary))" }}>
                {["", "Type ↕", "Meeting/Call ↕", "Status", "Date ↕", "Duration ↕", "Insights ↕", "Progress ↕", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", textAlign: "left", fontWeight: 500,
                    color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const s = STATUS_COLORS[c.status] || STATUS_COLORS.Completed;
                const p = PROGRESS_MAP[c.progress] || PROGRESS_MAP["-"];
                return (
                  <tr
                    key={c.id}
                    onClick={() => onOpenCall(c)}
                    style={{ borderBottom: "1px solid hsl(var(--secondary))", cursor: "pointer" }}
                    className="rh"
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <input type="checkbox" onClick={e => e.stopPropagation()} />
                    </td>
                    <td style={{ padding: "12px 14px", color: "hsl(var(--foreground))" }}>🎙 {c.type}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <p style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{c.prospect}</p>
                      <p style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>
                        {c.company} | {c.callType}
                      </p>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        background: s.bg, color: s.text, border: `1px solid ${s.border}`,
                        borderRadius: 12, padding: "3px 10px", fontSize: 11,
                      }}>✓ {c.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "hsl(var(--foreground))" }}>{c.displayDate}</td>
                    <td style={{ padding: "12px 14px", color: "hsl(var(--muted-foreground))" }}>{c.duration}</td>
                    <td style={{ padding: "12px 14px", color: "hsl(var(--foreground))" }}>{c.insights}</td>
                    <td style={{ padding: "12px 14px" }}>
                      {c.progress !== "-" ? (
                        <span style={{ color: p.color }}>{p.icon} {c.progress}</span>
                      ) : (
                        <span style={{ color: p.color }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{
                          border: "none", background: "none", fontSize: 16,
                          cursor: "pointer", color: "hsl(var(--muted-foreground))",
                        }}
                      >⋯</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderTop: "1px solid hsl(var(--border))",
          fontSize: 12, color: "hsl(var(--muted-foreground))",
        }}>
          <span>Viewing 1-{filtered.length} of {filtered.length} results</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{
              border: "1px solid hsl(var(--border))", borderRadius: 6,
              padding: "4px 12px", fontSize: 11, background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))", cursor: "pointer",
            }}>Previous</button>
            <button style={{
              border: "1px solid hsl(var(--border))", borderRadius: 6,
              padding: "4px 12px", fontSize: 11, background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))", cursor: "pointer",
            }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
