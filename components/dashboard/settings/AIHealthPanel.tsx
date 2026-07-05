import type { AIHealthStatus } from "@/types/ai-settings";

import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { cn } from "@/lib/utils";
import { motionPresets } from "@/lib/design/motion";

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
      label: "Avg latency",
      value:
        health.avg_duration_ms != null
          ? `${health.avg_duration_ms} ms`
          : "—",
      ok: (health.avg_duration_ms ?? 0) < 5000,
    },
    {
      label: "Cost (24h)",
      value: `$${health.total_cost_usd_24h.toFixed(4)}`,
      ok: true,
    },
  ];

  return (
    <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
      <Section title="AI health" subtitle="Integration status for the last 24 hours" />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-3",
              motionPresets.transitionBase,
              motionPresets.hover.surfaceLift
            )}
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
              {item.label === "Requests (24h)" ? (
                <Metric value={health.recent_requests} />
              ) : (
                item.value
              )}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
