import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { inputClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputClass, "md:text-[13px]", className)}
      {...props}
    />
  );
}
