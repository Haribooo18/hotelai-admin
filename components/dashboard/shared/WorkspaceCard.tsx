import type { ComponentProps, ReactNode } from "react";

import {
  workspaceCardClass,
  workspaceCardInteractiveClass,
  workspaceCardSelectedClass,
} from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"article"> & {
  selected?: boolean;
  interactive?: boolean;
  children: ReactNode;
};

export function WorkspaceCard({
  selected = false,
  interactive = true,
  className,
  children,
  ...props
}: Props) {
  return (
    <article
      className={cn(
        workspaceCardClass,
        motionPresets.transitionBase,
        motionPresets.hover.surfaceLift,
        interactive && workspaceCardInteractiveClass,
        selected && workspaceCardSelectedClass,
        className
      )}
      {...props}
    >
      {children}
    </article>
  );
}
