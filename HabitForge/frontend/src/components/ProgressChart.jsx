import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      padding: "8px 14px",
      fontSize: "12px",
      color: "var(--text-primary)"
    }}>
      <p style={{ color: "var(--text-secondary)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 600 }}>{payload[0].value} check-ins</p>
    </div>
  );
};

export default function ProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>
        No data available yet.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={24} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.count === max ? "url(#barGrad)" : "rgba(108,99,255,0.35)"}
            />
          ))}
        </Bar>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b83ff" />
            <stop offset="100%" stopColor="#6c63ff" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
