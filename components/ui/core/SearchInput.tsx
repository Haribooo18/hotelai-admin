import * as React from "react";
import { Search } from "lucide-react";

import { toolbarInputClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { Input } from "./Input";

type SearchInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
  iconSize?: number;
  variant?: "default" | "toolbar";
};

export function SearchInput({
  className,
  containerClassName,
  iconSize = 17,
  variant = "toolbar",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative min-w-0", containerClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
        size={iconSize}
        aria-hidden
      />
      <Input
        className={cn(
          variant === "toolbar" ? toolbarInputClass : "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}
