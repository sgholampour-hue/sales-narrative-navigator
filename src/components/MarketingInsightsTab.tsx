import type { Call } from "@/lib/callData";

interface Props {
  call: Call;
}

export const MarketingInsightsTab = ({ call }: Props) => {
  if (!call.painPoints.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "hsl(var(--muted-foreground))" }}>
        <p style={{ fontSize: 36, marginBottom: 10 }}>📊</p>
        <p>Geen marketing insights beschikbaar voor dit gesprek.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pain Points */}
      <div style={{
        background: "hsl(var(--secondary))", borderRadius: 12, padding: 20, marginBottom: 20,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 14 }}>
          ⏱ Pain Points & Challenges
        </p>
        {call.painPoints.map((p, i) => (
          <div key={i} style={{
            background: "hsl(var(--card))", borderRadius: 10, padding: 16, marginBottom: 10,
            border: "1px solid hsl(var(--border))",
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 6 }}>
              {p.title}
            </p>
            <p style={{
              fontSize: 12, color: "hsl(var(--muted-foreground))", fontStyle: "italic",
              borderLeft: "3px solid hsl(var(--border))", paddingLeft: 12,
            }}>{p.quote}</p>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div style={{
        background: "hsl(var(--secondary))", borderRadius: 12, padding: 20,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 14 }}>
          🎯 Goals & Objectives
        </p>
        {call.goals.map((g, i) => (
          <div key={i} style={{
            background: "hsl(var(--card))", borderRadius: 10, padding: 16, marginBottom: 10,
            border: "1px solid hsl(var(--border))",
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 6 }}>
              {g.title}
            </p>
            {g.quotes.map((q, j) => (
              <p key={j} style={{
                fontSize: 12, color: "hsl(var(--muted-foreground))", fontStyle: "italic",
                borderLeft: "3px solid hsl(var(--border))", paddingLeft: 12,
              }}>{q}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
