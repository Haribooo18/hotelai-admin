import type { HTMLAttributes } from "react";

import {
  elevationPresets,
  surfaceClass,
  surfaceStaticClass,
} from "@/lib/design/elevation";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  raised?: boolean;
};

export function Surface({
  interactive = true,
  raised = false,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        raised
          ? elevationPresets.raised.className
          : interactive
            ? surfaceClass
            : surfaceStaticClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
