import * as React from "react";

import { textareaClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaClass, className)}
      {...props}
    />
  );
}
