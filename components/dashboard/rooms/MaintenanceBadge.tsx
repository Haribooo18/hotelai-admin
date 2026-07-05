import { Wrench } from "lucide-react";

import { Badge } from "@/components/ui/display/Badge";
import { cn } from "@/lib/utils";

type Props = {
  active?: boolean;
  className?: string;
};

export function MaintenanceBadge({ active = false, className }: Props) {
  if (!active) return null;

  return (
    <Badge variant="destructive" className={cn("gap-1 uppercase", className)}>
      <Wrench size={10} aria-hidden />
      Maintenance
    </Badge>
  );
}
