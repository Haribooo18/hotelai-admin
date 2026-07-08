import type { ReactNode } from "react";

import {
  pageStackClass,
  shellWorkspaceFrameClass,
  shellWorkspaceScrollClass,
} from "@/lib/dashboard/design-system";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { cn } from "@/lib/utils";

type WorkspacePageLayoutProps = {
  header?: ReactNode;
  kpis?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function WorkspacePageLayout({
  header,
  kpis,
  toolbar,
  children,
  className,
}: WorkspacePageLayoutProps) {
  return (
    <div className={cn(shellWorkspaceFrameClass, className)}>
      <div className={shellWorkspaceScrollClass}>
        <div className={pageStackClass}>
          <MotionReveal order={0}>{toolbar}</MotionReveal>
          <MotionReveal order={1}>{header}</MotionReveal>
          <MotionReveal order={2}>{kpis}</MotionReveal>
          <MotionReveal order={3}>{children}</MotionReveal>
        </div>
      </div>
    </div>
  );
}
