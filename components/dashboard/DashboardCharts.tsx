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
  { day: "Пн", leads: 6 },
  { day: "Вт", leads: 9 },
  { day: "Ср", leads: 12 },
  { day: "Чт", leads: 8 },
  { day: "Пт", leads: 15 },
  { day: "Сб", leads: 19 },
  { day: "Вс", leads: 14 },
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
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Заявки за неделю
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

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Популярность номеров
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