import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

type Props = {
  message: Message;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const roleLabels: Record<string, string> = {
  guest: "Guest",
  staff: "Staff",
  ai: "AI",
  system: "System",
};

export function MessageBubble({ message }: Props) {
  const isOwn = message.role === "staff" || message.role === "ai";
  const isInternal = message.is_internal;

  return (
    <div
      className={cn(
        "flex w-full",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
          isInternal && "border border-dashed border-amber-600/40 bg-amber-950/30",
          !isInternal && message.role === "guest" && "bg-[var(--shell-surface-raised)] text-[var(--shell-text)]",
          !isInternal && message.role === "staff" && "bg-emerald-700 text-white",
          !isInternal && message.role === "ai" && "bg-blue-700 text-white",
          !isInternal && message.role === "system" && "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] text-xs"
        )}
      >
        <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider opacity-70">
          <span>{roleLabels[message.role] ?? message.role}</span>
          {isInternal && <span>· internal</span>}
        </div>

        <p className="whitespace-pre-wrap break-words">{message.body}</p>

        <time
          dateTime={message.created_at}
          className="mt-1.5 block text-[10px] opacity-60"
        >
          {formatTime(message.created_at)}
        </time>
      </div>
    </div>
  );
}
