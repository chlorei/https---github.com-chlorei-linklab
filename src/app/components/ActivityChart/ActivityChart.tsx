"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ActivityPoint = { day: string; clicks: number };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const n = payload[0].value;
  return (
    <div className="rounded-control border border-line bg-surface px-3 py-2 text-sm shadow-overlay">
      <span className="text-ink-soft">{label}</span>{" "}
      <span className="font-semibold tabular-nums text-ink">
        {n} {n === 1 ? "click" : "clicks"}
      </span>
    </div>
  );
}

/** Clicks per day as a filled area. Colors follow the theme via currentColor. */
export default function ActivityChart({ data, height = 240 }: { data: ActivityPoint[]; height?: number }) {
  const total = data.reduce((s, p) => s + p.clicks, 0);
  return (
    <div className="text-link" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -24 }} accessibilityLayer>
          <defs>
            <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--ink-faint)", fontSize: 12 }} dy={6} />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--ink-faint)", fontSize: 12 }}
            domain={[0, total === 0 ? 4 : "auto"]}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--line-strong)" }} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="currentColor"
            strokeWidth={2}
            fill="url(#clicksFill)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface)", fill: "currentColor" }}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
