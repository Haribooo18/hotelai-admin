import type { AIHealthStatus } from "@/types/ai-settings";

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="font-semibold">AI diagnostics</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Integration status over the last 24 hours
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
