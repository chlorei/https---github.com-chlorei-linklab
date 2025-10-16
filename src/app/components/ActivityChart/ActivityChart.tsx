"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", clicks: 120 },
  { day: "Tue", clicks: 200 },
  { day: "Wed", clicks: 150 },
  { day: "Thu", clicks: 320 },
  { day: "Fri", clicks: 210 },
  { day: "Sat", clicks: 390 },
  { day: "Sun", clicks: 280 },
];

export default function ActivityChart() {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-background">
      <h2 className="mb-2 text-sm text-muted-foreground">Activity (Last 7 Days)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}