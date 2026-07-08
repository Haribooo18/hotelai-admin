"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { switchThumbClass, switchTrackClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(switchTrackClass, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={switchThumbClass} />
    </SwitchPrimitive.Root>
  );
}
