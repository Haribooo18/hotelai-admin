import type { ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type Props = {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  tabs?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
};

/** Inline inspector shell with panel motion and progressive content reveal. */
export function MotionInspectorShell({
  children,
  className,
  header,
  tabs,
  content,
  actions,
}: Props) {
  if (header || tabs || content || actions) {
    return (
      <div
        className={cn(
          motionPresets.inspectorPanel,
          motionPresets.inspectorRevealRoot,
          "flex min-h-0 flex-col overflow-hidden",
          className
        )}
      >
        {header ? <MotionReveal order={0}>{header}</MotionReveal> : null}
        {tabs ? <MotionReveal order={1}>{tabs}</MotionReveal> : null}
        {content ? (
          <MotionReveal order={tabs ? 2 : header ? 1 : 0}>{content}</MotionReveal>
        ) : null}
        {actions ? (
          <MotionReveal order={tabs ? 3 : header ? 2 : 1}>{actions}</MotionReveal>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        motionPresets.inspectorPanel,
        motionPresets.inspectorRevealRoot,
        className
      )}
    >
      {children}
    </div>
  );
}
