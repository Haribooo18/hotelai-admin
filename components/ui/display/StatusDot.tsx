import { cn } from "@/lib/utils";

type StatusDotProps = {
  tone?: "default" | "success" | "warning" | "danger" | "muted";
  pulse?: boolean;
  className?: string;
};

const toneClass = {
  default: "bg-[var(--shell-accent)]",
  success: "bg-emerald-500",
  warning: "bg-amber-400",
  danger: "bg-red-500",
  muted: "bg-[var(--shell-muted)]",
} as const;

export function StatusDot({
  tone = "default",
  pulse = false,
  className,
}: StatusDotProps) {
  return (
    <span className={cn("relative inline-flex size-2.5", className)}>
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-40",
            toneClass[tone]
          )}
        />
      ) : null}
      <span
        className={cn("relative inline-flex size-2.5 rounded-full", toneClass[tone])}
      />
    </span>
  );
}
