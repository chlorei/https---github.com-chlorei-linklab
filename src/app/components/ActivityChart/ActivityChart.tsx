"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

type ActivityPoint = { day: string; clicks: number };

export default function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm bg-white dark:bg-neutral-900 transition">
      <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        Activity (Last 7 Days)
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 25, bottom: 5, left: 0 }}
          >
            {/* мягкая сетка */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* оси */}
            <XAxis
              dataKey="day"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* тултип с кастомным стилем */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                color: "black",
                fontSize: "12px",
                padding: "8px 10px",
              }}
              cursor={{ stroke: "#ffffff", strokeDasharray: "3 3" }}
            />

            {/* сама линия */}
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#000000" // <- ЧЁРНАЯ ЛИНИЯ
              strokeWidth={2.2}
              dot={false} // точки не показываем
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#000000", fill: "#ffffff" }} // при ховере подсветка
              animationDuration={600}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}