import { cn } from "@/lib/utils";
import { getConversationPriorityMeta } from "@/lib/ai/metadata";

type Props = {
  priority: string;
  className?: string;
};

export function PriorityBadge({ priority, className }: Props) {
  const meta = getConversationPriorityMeta(priority);

  if (priority === "normal") return null;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
        meta?.badgeClassName ?? "bg-zinc-800 text-zinc-400",
        className
      )}
    >
      {meta?.label ?? priority}
    </span>
  );
}
