import { cn } from "@/lib/utils";
import { getConversationStatusMeta } from "@/lib/ai/metadata";

import { Badge } from "@/components/ui/display/Badge";

type Props = {
  status: string;
  className?: string;
};

export function AIStatusBadge({ status, className }: Props) {
  const meta = getConversationStatusMeta(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        meta?.badgeClassName ?? "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]",
        className
      )}
    >
      {meta?.label ?? status}
    </Badge>
  );
}
