import type { AIHealthStatus } from "@/types/ai-settings";

import { cn } from "@/lib/utils";

type Props = {
  health: AIHealthStatus;
};

export function AIHealthPanel({ health }: Props) {
  const items = [
    {
      label: "Провайдер",
      value: health.configured ? health.provider : "не настроен",
      ok: health.configured,
    },
    {
      label: "AI включён",
      value: health.enabled ? "да" : "нет",
      ok: health.enabled && health.configured,
    },
    { label: "Модель", value: health.model, ok: true },
    {
      label: "Запросов (24ч)",
      value: String(health.recent_requests),
      ok: true,
    },
    {
      label: "Ошибок (24ч)",
      value: String(health.recent_errors),
      ok: health.recent_errors === 0,
    },
    {
      label: "Среднее время",
      value:
        health.avg_duration_ms != null
          ? `${health.avg_duration_ms} мс`
          : "—",
      ok: true,
    },
    {
      label: "Стоимость (24ч)",
      value: `$${health.total_cost_usd_24h.toFixed(4)}`,
      ok: true,
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="font-semibold">Диагностика AI</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Состояние интеграции за последние 24 часа
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2"
          >
            <dt className="text-sm text-zinc-400">{item.label}</dt>
            <dd
              className={cn(
                "text-sm font-medium",
                item.ok ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
