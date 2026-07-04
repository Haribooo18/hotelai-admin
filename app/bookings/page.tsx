import { AppShell } from "@/components/dashboard/AppShell";

import { DashboardStats } from "@/components/dashboard/dashboard/DashboardStats";

import { getDashboardStats } from "@/lib/services/dashboard.service";
import { getBookings } from "@/lib/services/bookings.service";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const bookings = await getBookings();

  const recentBookings = bookings.slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            HOTELAI ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-3 text-zinc-400">
            Обзор текущего состояния отеля.
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">
              Последние бронирования
            </h2>

            <div className="mt-6 space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-zinc-500">
                  Пока нет бронирований
                </p>
              ) : (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 p-4"
                  >
                    <div>
                      <div className="font-medium">
                        {booking.guest_name}
                      </div>

                      <div className="mt-1 text-sm text-zinc-500">
                        {booking.check_in} → {booking.check_out}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">
                        ${booking.total_price}
                      </div>

                      <div className="mt-1 text-sm text-zinc-500">
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">
              Быстрые действия
            </h2>

            <div className="mt-6 space-y-3">
              <a
                href="/bookings"
                className="block rounded-xl border border-zinc-800 p-4 transition hover:border-emerald-600"
              >
                ➕ Новое бронирование
              </a>

              <a
                href="/rooms"
                className="block rounded-xl border border-zinc-800 p-4 transition hover:border-emerald-600"
              >
                🛏 Управление номерами
              </a>

              <a
                href="/calendar"
                className="block rounded-xl border border-zinc-800 p-4 transition hover:border-emerald-600"
              >
                📅 Календарь
              </a>

              <a
                href="/settings"
                className="block rounded-xl border border-zinc-800 p-4 transition hover:border-emerald-600"
              >
                ⚙ Настройки
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}