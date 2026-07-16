import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  variant?: "info" | "tip";
};

export function DocsCallout({ children, variant = "info" }: Props) {
  return (
    <aside
      className={cn(
        "mkt-docs-callout",
        variant === "tip" && "mkt-docs-callout-tip"
      )}
      role="note"
    >
      {children}
    </aside>
  );
}
