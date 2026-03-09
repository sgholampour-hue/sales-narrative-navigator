import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Call } from "@/lib/callData";
import { Search, PhoneCall, Briefcase, Podcast, Settings, Plus, Headphones, ArrowUpDown, CircleCheck, TrendingDown, MoreHorizontal, CirclePlus } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Completed: { bg: "hsl(var(--status-completed-bg))", text: "hsl(var(--status-completed-text))", border: "hsl(var(--status-completed-border))" },
  Active: { bg: "hsl(var(--status-active-bg))", text: "hsl(var(--status-active-text))", border: "hsl(var(--status-active-border))" },
  Failed: { bg: "hsl(var(--status-failed-bg))", text: "hsl(var(--status-failed-text))", border: "hsl(var(--status-failed-border))" },
  Pending: { bg: "hsl(var(--status-pending-bg))", text: "hsl(var(--status-pending-text))", border: "hsl(var(--status-pending-border))" },
  Processing: { bg: "hsl(var(--status-active-bg))", text: "hsl(var(--status-active-text))", border: "hsl(var(--status-active-border))" },
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
  const navigate = useNavigate();
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Sales Calls</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your AI-analyzed sales calls</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-border rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-card text-foreground cursor-pointer flex items-center gap-1.5 hover:bg-secondary transition-colors">
            <Settings size={14} /> <span className="hidden sm:inline">Settings</span>
          </button>
          <button onClick={() => navigate("/new-call")} className="rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-none bg-foreground text-card cursor-pointer flex items-center gap-1.5">
            <Plus size={14} /> New Call
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {scoreCards.map((c, idx) => (
          <div key={c.label} className="bg-card rounded-xl p-4 sm:p-5 border border-border">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">{c.label}</span>
              <span className="text-muted-foreground opacity-50">{CARD_ICONS[idx]}</span>
            </div>
            {c.score ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{c.score}</span>
                  <span className="text-sm text-muted-foreground">/10</span>
                  <span className="text-xs ml-2 flex items-center gap-1" style={{ color: "hsl(var(--trend-declining))" }}>
                    <TrendingDown size={13} /> {c.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on {c.count} calls</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-semibold text-foreground bg-secondary rounded-md px-2 sm:px-3 py-1">No Data Yet</span>
                <span className="text-xs text-muted-foreground">Need at least 2 calls</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div
        onClick={() => { setStatusDropdown(false); setTypeDropdown(false); }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 border-b border-border">
          <div className="flex gap-2">
            {filters.map(f => (
              <div key={f.label} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); f.setDd(!f.dd); }}
                  className="border border-border rounded-full px-3 py-1 text-xs bg-card text-foreground flex items-center gap-1.5 cursor-pointer hover:bg-secondary transition-colors"
                  style={{ background: f.filt.length ? "hsl(var(--status-active-bg))" : undefined }}
                >
                  <CirclePlus size={14} className="text-muted-foreground" />
                  {f.label}
                  {f.filt.length > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full px-1.5 text-[10px] font-semibold">{f.filt.length}</span>
                  )}
                </button>
                {f.dd && (
                  <div
                    onClick={e => e.stopPropagation()}
                    className="absolute top-9 left-0 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[180px] p-1.5"
                  >
                    {f.opts.map(s => (
                      <label key={s} className="flex items-center gap-2 px-2.5 py-1.5 text-xs cursor-pointer text-foreground rounded-md hover:bg-secondary">
                        <input
                          type="checkbox"
                          checked={f.filt.includes(s)}
                          onChange={e =>
                            f.setFilt(p => e.target.checked ? [...p, s] : p.filter(x => x !== s))
                          }
                          className="accent-foreground"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search sales calls..."
              className="border-none bg-transparent outline-none text-xs w-36 sm:w-44 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Table - desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {[
                  { label: "", sortable: false, width: 40 },
                  { label: "Type", sortable: true },
                  { label: "Meeting/Call", sortable: false },
                  { label: "Status", sortable: false },
                  { label: "Date", sortable: true },
                  { label: "Duration", sortable: true },
                  { label: "Insights", sortable: true },
                  { label: "Progress", sortable: true },
                  { label: "", sortable: false, width: 40 },
                ].map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap border-b border-border text-xs" style={{ width: h.width }}>
                    <span className="flex items-center gap-1">
                      {h.label}
                      {h.sortable && <ArrowUpDown size={12} className="opacity-40" />}
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
                  <tr key={c.id} onClick={() => onOpenCall(c)} className="cursor-pointer rh transition-colors">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" onClick={e => e.stopPropagation()} className="accent-foreground w-4 h-4" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 bg-secondary rounded-md px-2.5 py-1 text-xs font-medium text-foreground">
                        <Headphones size={12} /> {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground text-sm">{c.prospect}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{c.company} | {c.callType}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-1" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                        <CircleCheck size={12} /> {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-foreground text-sm">{c.displayDate}</td>
                    <td className="px-4 py-3.5 text-muted-foreground text-sm">-</td>
                    <td className="px-4 py-3.5 text-foreground text-sm">{c.insights}</td>
                    <td className="px-4 py-3.5">
                      {c.progress !== "-" ? (
                        <span className="flex items-center gap-1 text-sm" style={{ color: p.color }}>
                          <TrendingDown size={14} /> {p.label}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={e => e.stopPropagation()} className="border-none bg-transparent cursor-pointer text-muted-foreground p-1 rounded hover:bg-secondary">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-border">
          {filtered.map(c => {
            const s = STATUS_COLORS[c.status] || STATUS_COLORS.Completed;
            const p = PROGRESS_MAP[c.progress] || PROGRESS_MAP["-"];
            return (
              <div key={c.id} onClick={() => onOpenCall(c)} className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{c.prospect}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{c.company} | {c.callType}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                    <CircleCheck size={10} /> {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{c.displayDate}</span>
                  <span className="bg-secondary rounded px-2 py-0.5 text-foreground font-medium inline-flex items-center gap-1">
                    <Headphones size={10} /> {c.type}
                  </span>
                  {c.progress !== "-" && (
                    <span className="flex items-center gap-1" style={{ color: p.color }}>
                      <TrendingDown size={12} /> {p.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>Viewing <strong className="text-foreground">1-{filtered.length}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span>
          <div className="flex gap-1.5">
            <button className="border border-border rounded-md px-3 py-1 text-xs bg-card text-muted-foreground cursor-pointer hover:bg-secondary">Previous</button>
            <button className="border border-border rounded-md px-3 py-1 text-xs bg-card text-muted-foreground cursor-pointer hover:bg-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
