import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import {
  pageStackClass,
  shellWorkspaceFrameClass,
  shellWorkspaceScrollClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  toolbar?: ReactNode;
  header?: ReactNode;
  kpis?: ReactNode;
  charts?: ReactNode;
  tables?: ReactNode;
  secondary?: ReactNode;
  className?: string;
};

export function DashboardPageLayout({
  toolbar,
  header,
  kpis,
  charts,
  tables,
  secondary,
  className,
}: Props) {
  return (
    <div className={cn(shellWorkspaceFrameClass, className)}>
      <div className={shellWorkspaceScrollClass}>
        <div className={pageStackClass}>
          <MotionReveal order={0}>{toolbar}</MotionReveal>
          <MotionReveal order={1}>{header}</MotionReveal>
          <MotionReveal order={2}>{kpis}</MotionReveal>
          <MotionReveal order={3}>{charts}</MotionReveal>
          <MotionReveal order={4}>{tables}</MotionReveal>
          <MotionReveal order={5}>{secondary}</MotionReveal>
        </div>
      </div>
    </div>
  );
}
