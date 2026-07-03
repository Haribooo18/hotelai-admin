import { AppShell } from "@/components/dashboard/AppShell";

export default function RoomsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          HOTELAI ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Управление номерами
        </h1>

        <p className="mt-2 text-zinc-500">
          Добавляйте и редактируйте номера гостиницы.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h2 className="text-2xl font-semibold">
          Пока здесь пусто
        </h2>

        <p className="mt-3 text-zinc-500">
          Следующим шагом подключим Supabase и загрузим номера.
        </p>
      </div>
    </AppShell>
  );
}