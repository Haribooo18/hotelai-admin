import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import {
  shellWorkspaceFrameClass,
  shellWorkspaceScrollClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Props = {
  toolbar?: ReactNode;
  hero?: ReactNode;
  kpis?: ReactNode;
  recommendations?: ReactNode;
  aiInsights?: ReactNode;
  todayOps?: ReactNode;
  revenue?: ReactNode;
  activity?: ReactNode;
  className?: string;
};

export function DashboardPageLayout({
  toolbar,
  hero,
  kpis,
  recommendations,
  aiInsights,
  todayOps,
  revenue,
  activity,
  className,
}: Props) {
  return (
    <div className={cn(shellWorkspaceFrameClass, className)}>
      <div className={shellWorkspaceScrollClass}>
        <div className="space-y-8 md:space-y-10">
          {toolbar ? <MotionReveal order={0}>{toolbar}</MotionReveal> : null}
          {hero}
          {kpis ? <MotionReveal order={2}>{kpis}</MotionReveal> : null}
          {recommendations ? <MotionReveal order={3}>{recommendations}</MotionReveal> : null}
          {aiInsights}
          {todayOps}
          {revenue ? <MotionReveal order={5}>{revenue}</MotionReveal> : null}
          {activity ? <MotionReveal order={6}>{activity}</MotionReveal> : null}
        </div>
      </div>
    </div>
  );
}
