import type { HTMLAttributes } from "react";

import { elevationPresets } from "@/lib/design/elevation";
import { cn } from "@/lib/utils";

import { GlassSurface } from "./GlassSurface";
import { Surface } from "./Surface";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "surface" | "glass" | "raised";
  interactive?: boolean;
};

export function Panel({
  variant = "surface",
  interactive = false,
  className,
  children,
  ...props
}: PanelProps) {
  if (variant === "glass") {
    return (
      <GlassSurface interactive={interactive} className={className} {...props}>
        {children}
      </GlassSurface>
    );
  }

  if (variant === "raised") {
    return (
      <div className={cn(elevationPresets.raised.className, className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Surface interactive={interactive} className={className} {...props}>
      {children}
    </Surface>
  );
}
