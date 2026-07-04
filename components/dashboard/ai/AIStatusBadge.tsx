import { cn } from "@/lib/utils";
import { getConversationStatusMeta } from "@/lib/ai/metadata";

type Props = {
  status: string;
  className?: string;
};

export function AIStatusBadge({ status, className }: Props) {
  const meta = getConversationStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        meta?.badgeClassName ?? "bg-zinc-800 text-zinc-400",
        className
      )}
    >
      {meta?.label ?? status}
    </span>
  );
}
