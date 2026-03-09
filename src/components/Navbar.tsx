import { Phone, Bell, Sparkles } from "lucide-react";

export const Navbar = () => (
  <nav style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 32px", borderBottom: "1px solid hsl(var(--border))",
    background: "hsl(var(--card))", position: "sticky", top: 0, zIndex: 40,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Phone size={18} style={{ color: "hsl(var(--foreground))" }} />
      <span style={{ fontWeight: 600, fontSize: 14, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>
        Sales Call Analyzer
      </span>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <button style={{
        border: "1px solid hsl(var(--border))", borderRadius: 8,
        padding: "6px 14px", fontSize: 12, fontWeight: 500, background: "hsl(var(--card))",
        color: "hsl(var(--foreground))", display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
      }}>
        <Bell size={13} /> Notifications
      </button>
      <button style={{
        borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 500,
        border: "none", background: "hsl(var(--foreground))", color: "hsl(var(--card))",
        display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
      }}>
        <Sparkles size={13} /> Ask AI
      </button>
    </div>
  </nav>
);
