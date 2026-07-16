import * as React from "react";
import { Search, X } from "lucide-react";

import {
  searchFieldClearClass,
  searchFieldIconClass,
  toolbarFilterIconSize,
  toolbarInputClass,
  toolbarSearchContainerClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { Input } from "./Input";

type SearchInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
  iconSize?: number;
  variant?: "default" | "toolbar";
  onClear?: () => void;
};

export function SearchInput({
  className,
  containerClassName,
  iconSize = toolbarFilterIconSize,
  variant = "toolbar",
  value,
  onClear,
  ...props
}: SearchInputProps) {
  const hasValue = typeof value === "string" ? value.length > 0 : Boolean(value);

  return (
    <div
      className={cn(
        "group relative min-w-0",
        variant === "toolbar" ? toolbarSearchContainerClass : "w-full",
        containerClassName
      )}
    >
      <Search className={searchFieldIconClass} size={iconSize} aria-hidden />
      <Input
        type="search"
        value={value}
        className={cn(
          variant === "toolbar" ? toolbarInputClass : "pl-10",
          hasValue && onClear && "pr-10",
          className
        )}
        {...props}
      />
      {hasValue && onClear ? (
        <button
          type="button"
          aria-label={props["aria-label"] ? `Clear ${props["aria-label"]}` : "Clear search"}
          onClick={onClear}
          className={searchFieldClearClass}
        >
          <X size={14} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

/** Canonical search field alias */
export { SearchInput as SearchField };
