import { useMemo } from "react";
import type { Call } from "@/lib/callData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  calls: Call[];
}

const LINES = [
  { key: "totalScore", label: "Totaal", color: "hsl(217, 91%, 60%)" },
  { key: "callControlScore", label: "Gesprekscontrole", color: "hsl(142, 71%, 45%)" },
  { key: "discoveryDepthScore", label: "Discovery", color: "hsl(45, 93%, 47%)" },
  { key: "objectionHandlingScore", label: "Bezwaren", color: "hsl(0, 84%, 60%)" },
  { key: "pitchEffectivenessScore", label: "Pitch", color: "hsl(280, 67%, 55%)" },
  { key: "closingStrengthScore", label: "Afsluiting", color: "hsl(190, 80%, 42%)" },
];

export const ScoreTrendChart = ({ calls }: Props) => {
  const data = useMemo(() => {
    return [...calls]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(c => ({
        name: c.displayDate.split(",")[0],
        totalScore: c.totalScore,
        callControlScore: c.callControlScore,
        discoveryDepthScore: c.discoveryDepthScore,
        objectionHandlingScore: c.objectionHandlingScore,
        pitchEffectivenessScore: c.pitchEffectivenessScore,
        closingStrengthScore: c.closingStrengthScore,
      }));
  }, [calls]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {LINES.map(l => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={l.color}
            strokeWidth={2}
            dot={{ r: 4, fill: l.color }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
