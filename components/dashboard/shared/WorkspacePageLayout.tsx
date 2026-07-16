import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import {
  pageStackClass,
  shellWorkspaceFrameClass,
  shellWorkspaceScrollClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type WorkspacePageLayoutProps = {
  header?: ReactNode;
  kpis?: ReactNode;
  recommendations?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  secondary?: ReactNode;
  className?: string;
};

export function WorkspacePageLayout({
  header,
  kpis,
  recommendations,
  toolbar,
  children,
  secondary,
  className,
}: WorkspacePageLayoutProps) {
  return (
    <div className={cn(shellWorkspaceFrameClass, className)}>
      <div className={shellWorkspaceScrollClass}>
        <div className={pageStackClass}>
          <MotionReveal order={0}>{header}</MotionReveal>
          <MotionReveal order={1}>{kpis}</MotionReveal>
          <MotionReveal order={2}>{recommendations}</MotionReveal>
          <MotionReveal order={3}>{toolbar}</MotionReveal>
          <MotionReveal order={4}>{children}</MotionReveal>
          <MotionReveal order={5}>{secondary}</MotionReveal>
        </div>
      </div>
    </div>
  );
}
