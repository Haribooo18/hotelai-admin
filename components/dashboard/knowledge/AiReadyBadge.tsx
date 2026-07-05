import { cn } from "@/lib/utils";

type Props = {
  ready: boolean;
  className?: string;
};

export function AiReadyBadge({ ready, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        ready
          ? "bg-emerald-500/12 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
        className
      )}
    >
      {ready ? "AI ready" : "Not indexed"}
    </span>
  );
}
