import { Badge } from "@/components/ui/display/Badge";
import { cn } from "@/lib/utils";

type Props = {
  ready: boolean;
  className?: string;
};

export function AiReadyBadge({ ready, className }: Props) {
  return (
    <Badge
      variant={ready ? "success" : "outline"}
      className={cn("text-[10px] uppercase tracking-wide", className)}
    >
      {ready ? "AI ready" : "Not indexed"}
    </Badge>
  );
}
