import type { Call } from "@/lib/callData";

interface Props {
  call: Call;
}

export const MarketingInsightsTab = ({ call }: Props) => {
  if (!call.painPoints.length) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-border rounded-xl bg-card">
        <p className="text-4xl mb-2.5">📊</p>
        <p className="text-sm">Geen marketing inzichten beschikbaar voor dit gesprek.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pijnpunten */}
      <div className="bg-secondary rounded-xl p-5 mb-5">
        <p className="text-sm font-semibold text-foreground mb-3.5">⏱ Pijnpunten & Uitdagingen</p>
        {call.painPoints.map((p, i) => (
          <div key={i} className="bg-card rounded-lg p-4 mb-2.5 border border-border last:mb-0">
            <p className="text-sm font-semibold text-foreground mb-1.5">{p.title}</p>
            <p className="text-xs text-muted-foreground italic border-l-[3px] border-border pl-3">{p.quote}</p>
          </div>
        ))}
      </div>

      {/* Doelen */}
      <div className="bg-secondary rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-3.5">🎯 Doelen & Doelstellingen</p>
        {call.goals.map((g, i) => (
          <div key={i} className="bg-card rounded-lg p-4 mb-2.5 border border-border last:mb-0">
            <p className="text-sm font-semibold text-foreground mb-1.5">{g.title}</p>
            {g.quotes.map((q, j) => (
              <p key={j} className="text-xs text-muted-foreground italic border-l-[3px] border-border pl-3">{q}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};