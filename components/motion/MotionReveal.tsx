import type { ReactNode } from "react";

import {
  motionPresets,
  type MotionRevealOrder,
} from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type Props = {
  order?: MotionRevealOrder;
  children: ReactNode;
  className?: string;
};

export function MotionReveal({
  order = 0,
  children,
  className,
}: Props) {
  if (!children) {
    return null;
  }

  return (
    <div className={cn(motionPresets.reveal.order(order), className)}>
      {children}
    </div>
  );
}
