"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const bookings = [
  { day: "Mon", leads: 6 },
  { day: "Tue", leads: 9 },
  { day: "Wed", leads: 12 },
  { day: "Thu", leads: 8 },
  { day: "Fri", leads: 15 },
  { day: "Sat", leads: 19 },
  { day: "Sun", leads: 14 },
];

const rooms = [
  { room: "Standard", value: 18 },
  { room: "Suite", value: 9 },
  { room: "Family", value: 5 },
  { room: "Villa", value: 2 },
];

export function DashboardCharts() {
  return (
    <div className="mb-8 grid gap-6 xl:grid-cols-2">
      <section className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Requests this week
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bookings}>
              <CartesianGrid stroke="#27272a" />
              <XAxis dataKey="day" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#10b981"
                fill="#10b98155"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Room popularity
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rooms}>
              <CartesianGrid stroke="#27272a" />
              <XAxis dataKey="room" />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}