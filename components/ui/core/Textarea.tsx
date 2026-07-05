import * as React from "react";

import { inputClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        inputClass,
        "min-h-24 resize-y py-2.5 md:text-[13px]",
        className
      )}
      {...props}
    />
  );
}
