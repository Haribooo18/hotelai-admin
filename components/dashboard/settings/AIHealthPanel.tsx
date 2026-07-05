import type { AIHealthStatus } from "@/types/ai-settings";

import {
  DashboardSectionTitle,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

type Props = {
  health: AIHealthStatus;
};

export function AIHealthPanel({ health }: Props) {
  const items = [
    {
      label: "Provider",
      value: health.configured ? health.provider : "not configured",
      ok: health.configured,
    },
    {
      label: "AI enabled",
      value: health.enabled ? "yes" : "no",
      ok: health.enabled && health.configured,
    },
    { label: "Model", value: health.model, ok: true },
    {
      label: "Requests (24h)",
      value: String(health.recent_requests),
      ok: true,
    },
    {
      label: "Errors (24h)",
      value: String(health.recent_errors),
      ok: health.recent_errors === 0,
    },
    {
      label: "Average duration",
      value:
        health.avg_duration_ms != null
          ? `${health.avg_duration_ms} ms`
          : "—",
      ok: true,
    },
    {
      label: "Cost (24h)",
      value: `$${health.total_cost_usd_24h.toFixed(4)}`,
      ok: true,
    },
  ];

  return (
    <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
      <DashboardSectionTitle
        title="AI diagnostics"
        subtitle="Integration status over the last 24 hours"
        className="mb-4"
      />

      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 py-2"
          >
            <dt className="text-[13px] text-[var(--shell-muted)]">{item.label}</dt>
            <dd
              className={cn(
                "text-[13px] font-medium",
                item.ok ? "text-[var(--shell-accent)]" : "text-amber-400"
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </DashboardSurface>
  );
}
