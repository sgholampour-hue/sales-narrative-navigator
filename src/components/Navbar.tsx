export const Navbar = () => (
  <nav style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 28px", borderBottom: "1px solid hsl(var(--border))",
    background: "hsl(var(--card))", position: "sticky", top: 0, zIndex: 40,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 22 }}>📞</span>
      <span style={{ fontWeight: 700, fontSize: 16, color: "hsl(var(--foreground))" }}>
        Sales Call Analyzer
      </span>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <button style={{
        border: "1px solid hsl(var(--border))", borderRadius: 8,
        padding: "7px 14px", fontSize: 12, background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      }}>
        🔔 Notifications
      </button>
      <button style={{
        borderRadius: 8, padding: "7px 14px", fontSize: 12,
        border: "none", background: "hsl(var(--foreground))",
        color: "hsl(var(--card))",
      }}>
        ✦ Ask AI
      </button>
    </div>
  </nav>
);
