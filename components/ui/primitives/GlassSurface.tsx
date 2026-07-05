import type { HTMLAttributes } from "react";

import { glassClass, surfaceClass } from "@/lib/design/elevation";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

type GlassSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function GlassSurface({
  interactive = false,
  className,
  children,
  ...props
}: GlassSurfaceProps) {
  return (
    <div
      className={cn(
        glassClass,
        interactive && surfaceClass,
        !interactive && motionPresets.transitionBase,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
