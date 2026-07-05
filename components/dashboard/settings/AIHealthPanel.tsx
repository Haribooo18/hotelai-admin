import type { AIHealthStatus } from "@/types/ai-settings";

import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
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
      label: "Запросы (24ч)",
      value: String(health.recent_requests),
      ok: true,
    },
    {
      label: "Ошибки (24ч)",
      value: String(health.recent_errors),
      ok: health.recent_errors === 0,
    },
    {
      label: "Средняя задержка",
      value:
        health.avg_duration_ms != null
          ? `${health.avg_duration_ms} мс`
          : "—",
      ok: (health.avg_duration_ms ?? 0) < 5000,
    },
    {
      label: "Стоимость (24ч)",
      value: `$${health.total_cost_usd_24h.toFixed(4)}`,
      ok: true,
    },
  ];

  return (
    <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Диагностика AI"
        subtitle="Статус интеграции за 24 часа"
        className="mb-4"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-3 transition-[box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-sm)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--shell-muted)]">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1.5 text-[15px] font-semibold",
                item.ok ? "text-[var(--shell-accent)]" : "text-amber-400"
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </DashboardGlassPanel>
  );
}
