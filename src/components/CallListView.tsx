import { useState } from "react";
import type { Call } from "@/lib/callData";
import { Search, PhoneCall, Briefcase, Podcast, Settings, Plus, Headphones, ArrowUpDown, CircleCheck, TrendingDown, MoreHorizontal, CirclePlus } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Completed: { bg: "hsl(var(--status-completed-bg))", text: "hsl(var(--status-completed-text))", border: "hsl(var(--status-completed-border))" },
  Active: { bg: "hsl(var(--status-active-bg))", text: "hsl(var(--status-active-text))", border: "hsl(var(--status-active-border))" },
  Failed: { bg: "hsl(var(--status-failed-bg))", text: "hsl(var(--status-failed-text))", border: "hsl(var(--status-failed-border))" },
  Pending: { bg: "hsl(var(--status-pending-bg))", text: "hsl(var(--status-pending-text))", border: "hsl(var(--status-pending-border))" },
};

const PROGRESS_MAP: Record<string, { color: string; label: string }> = {
  Declining: { color: "hsl(var(--trend-declining))", label: "Declining" },
  Improving: { color: "hsl(var(--trend-improving))", label: "Improving" },
  "-": { color: "hsl(var(--trend-neutral))", label: "-" },
};

interface Props {
  calls: Call[];
  onOpenCall: (call: Call) => void;
}

const CARD_ICONS = [
  <Search size={18} strokeWidth={1.5} />,
  <PhoneCall size={18} strokeWidth={1.5} />,
  <Briefcase size={18} strokeWidth={1.5} />,
  <Podcast size={18} strokeWidth={1.5} />,
];

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
    { label: "Discovery Calls" },
    { label: "Interview Calls" },
    { label: "Sales Calls", score: avg, count: calls.length, change: "-0.3" },
    { label: "Podcast Calls" },
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

  const headers = [
    { label: "", sortable: false, width: 40 },
    { label: "Type", sortable: true },
    { label: "Meeting/Call", sortable: false },
    { label: "Status", sortable: false },
    { label: "Date", sortable: true },
    { label: "Duration", sortable: true },
    { label: "Insights", sortable: true },
    { label: "Progress", sortable: true },
    { label: "", sortable: false, width: 40 },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.02em" }}>
            Sales Calls
          </h1>
          <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
            View and manage your AI-analyzed sales calls
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            border: "1px solid hsl(var(--border))", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, fontWeight: 500, background: "hsl(var(--card))",
            color: "hsl(var(--foreground))", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Settings size={14} /> Settings
          </button>
          <button style={{
            borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500,
            border: "none", background: "hsl(var(--foreground))", color: "hsl(var(--card))",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            <Plus size={14} /> New Call
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {scoreCards.map((c, idx) => (
          <div key={c.label} style={{
            background: "hsl(var(--card))", borderRadius: 12, padding: "20px 22px",
            border: "1px solid hsl(var(--border))",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--muted-foreground))" }}>{c.label}</span>
              <span style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>{CARD_ICONS[idx]}</span>
            </div>
            {c.score ? (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.02em" }}>{c.score}</span>
                  <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", fontWeight: 400 }}>/10</span>
                  <span style={{
                    fontSize: 12, color: "hsl(var(--trend-declining))", marginLeft: 8,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <TrendingDown size={13} /> {c.change}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                  Based on {c.count} calls
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))",
                  background: "hsl(var(--secondary))", borderRadius: 6, padding: "4px 12px",
                }}>No Data Yet</span>
                <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>Need at least 2 calls</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div
        onClick={() => { setStatusDropdown(false); setTypeDropdown(false); }}
        style={{
          background: "hsl(var(--card))", borderRadius: 12,
          border: "1px solid hsl(var(--border))", overflow: "hidden",
        }}
      >
        {/* Filters */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderBottom: "1px solid hsl(var(--border))",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {filters.map(f => (
              <div key={f.label} style={{ position: "relative" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); f.setDd(!f.dd); }}
                  style={{
                    border: "1px solid hsl(var(--border))", borderRadius: 20,
                    padding: "5px 14px", fontSize: 13,
                    background: f.filt.length ? "hsl(var(--status-active-bg))" : "hsl(var(--card))",
                    color: "hsl(var(--foreground))", display: "flex", alignItems: "center", gap: 6,
                    cursor: "pointer", fontWeight: 400,
                  }}
                >
                  <CirclePlus size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                  {f.label}
                  {f.filt.length > 0 && (
                    <span style={{
                      background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
                      borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 600,
                    }}>{f.filt.length}</span>
                  )}
                </button>
                {f.dd && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      position: "absolute", top: 36, left: 0,
                      background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                      borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.08)",
                      zIndex: 50, minWidth: 180, padding: 6,
                    }}
                  >
                    {f.opts.map(s => (
                      <label key={s} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 10px", fontSize: 13, cursor: "pointer",
                        color: "hsl(var(--foreground))", borderRadius: 6,
                      }}>
                        <input
                          type="checkbox"
                          checked={f.filt.includes(s)}
                          onChange={e =>
                            f.setFilt(p => e.target.checked ? [...p, s] : p.filter(x => x !== s))
                          }
                          style={{ accentColor: "hsl(var(--foreground))" }}
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
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 12px",
          }}>
            <Search size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search sales calls..."
              style={{
                border: "none", background: "none", outline: "none",
                fontSize: 13, width: 180, color: "hsl(var(--foreground))",
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{
                    padding: "11px 16px", textAlign: "left", fontWeight: 500,
                    color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap",
                    borderBottom: "1px solid hsl(var(--border))",
                    fontSize: 13, width: h.width,
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {h.label}
                      {h.sortable && <ArrowUpDown size={12} style={{ opacity: 0.4 }} />}
                    </span>
                  </th>
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
                    style={{ cursor: "pointer", transition: "background .1s" }}
                    className="rh"
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <input
                        type="checkbox"
                        onClick={e => e.stopPropagation()}
                        style={{ accentColor: "hsl(var(--foreground))", width: 15, height: 15 }}
                      />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "hsl(var(--secondary))", borderRadius: 6,
                        padding: "4px 10px", fontSize: 12, fontWeight: 500,
                        color: "hsl(var(--foreground))",
                      }}>
                        <Headphones size={12} /> {c.type}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontWeight: 600, color: "hsl(var(--foreground))", fontSize: 13 }}>{c.prospect}</p>
                      <p style={{ color: "hsl(var(--muted-foreground))", fontSize: 12, marginTop: 1 }}>
                        {c.company} | {c.callType}
                      </p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: s.bg, color: s.text, border: `1px solid ${s.border}`,
                        borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <CircleCheck size={12} /> {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "hsl(var(--foreground))", fontSize: 13 }}>
                      {c.displayDate}
                    </td>
                    <td style={{ padding: "14px 16px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>
                      -
                    </td>
                    <td style={{ padding: "14px 16px", color: "hsl(var(--foreground))", fontSize: 13 }}>
                      {c.insights}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {c.progress !== "-" ? (
                        <span style={{
                          color: p.color, display: "flex", alignItems: "center", gap: 4,
                          fontSize: 13,
                        }}>
                          <TrendingDown size={14} /> {p.label}
                        </span>
                      ) : (
                        <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 13 }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{
                          border: "none", background: "none",
                          cursor: "pointer", color: "hsl(var(--muted-foreground))",
                          padding: 4, borderRadius: 4,
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
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
          padding: "14px 20px", borderTop: "1px solid hsl(var(--border))",
          fontSize: 13, color: "hsl(var(--muted-foreground))",
        }}>
          <span>
            Viewing <strong style={{ color: "hsl(var(--foreground))" }}>1-{filtered.length}</strong> of <strong style={{ color: "hsl(var(--foreground))" }}>{filtered.length}</strong> results
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{
              border: "1px solid hsl(var(--border))", borderRadius: 6,
              padding: "5px 14px", fontSize: 13, background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))", cursor: "pointer",
            }}>Previous</button>
            <button style={{
              border: "1px solid hsl(var(--border))", borderRadius: 6,
              padding: "5px 14px", fontSize: 13, background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))", cursor: "pointer",
            }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
