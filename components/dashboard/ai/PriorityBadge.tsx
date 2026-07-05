import { cn } from "@/lib/utils";
import { getConversationPriorityMeta } from "@/lib/ai/metadata";

import { Badge } from "@/components/ui/display/Badge";

type Props = {
  priority: string;
  className?: string;
};

export function PriorityBadge({ priority, className }: Props) {
  const meta = getConversationPriorityMeta(priority);

  if (priority === "normal") return null;

  return (
    <Badge
      variant={priority === "urgent" ? "destructive" : "warning"}
      className={cn(
        "uppercase",
        meta?.badgeClassName,
        className
      )}
    >
      {meta?.label ?? priority}
    </Badge>
  );
}
