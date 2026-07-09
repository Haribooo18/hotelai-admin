import type { HTMLAttributes, ReactNode } from "react";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type InspectorProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  header?: ReactNode;
  footer?: ReactNode;
};

export function Inspector({
  title,
  header,
  footer,
  className,
  children,
  ...props
}: InspectorProps) {
  const resolvedHeader =
    header ??
    (title ? (
      <div className="border-b border-[var(--shell-border)] px-[var(--ds-surface-padding)] py-3">
        <h2 className="ds-section-title">{title}</h2>
      </div>
    ) : null);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]",
        motionPresets.inspectorPanel,
        className
      )}
      {...props}
    >
      <div className={cn("flex min-h-0 flex-1 flex-col", motionPresets.inspectorRevealRoot)}>
        {resolvedHeader ? <MotionReveal order={0}>{resolvedHeader}</MotionReveal> : null}
        <MotionReveal order={resolvedHeader ? 1 : 0} className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-[var(--ds-surface-padding)]">{children}</div>
        </MotionReveal>
        {footer ? (
          <MotionReveal order={resolvedHeader ? 2 : 1}>
            <div className="border-t border-[var(--shell-border)] p-[var(--ds-surface-padding)]">
              {footer}
            </div>
          </MotionReveal>
        ) : null}
      </div>
    </aside>
  );
}
