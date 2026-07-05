import { Bot, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  actor?: "guest" | "ai";
};

export function TypingIndicator({
  label,
  actor = "guest",
}: Props) {
  const defaultLabel =
    actor === "ai" ? "AI is composing" : "Guest is typing";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-1 py-1",
        actor === "ai" && "text-emerald-400"
      )}
      role="status"
      aria-live="polite"
      aria-label={label ?? defaultLabel}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full",
          actor === "ai"
            ? "bg-emerald-500/12 shadow-[0_0_14px_rgba(16,185,129,0.15)]"
            : "bg-[var(--shell-surface-raised)]"
        )}
      >
        {actor === "ai" ? (
          <Bot size={13} />
        ) : (
          <UserRound size={13} className="text-[var(--shell-muted)]" />
        )}
      </div>

      <span className="text-[12px] text-[var(--shell-muted)]">
        {label ?? defaultLabel}
      </span>

      <span className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 w-1.5 animate-bounce rounded-full",
              actor === "ai" ? "bg-emerald-400/80" : "bg-[var(--shell-muted)]"
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
