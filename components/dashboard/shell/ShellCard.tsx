import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ShellCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-6 shadow-[var(--shell-shadow-sm)] transition-all duration-200 ease-out hover:shadow-[var(--shell-shadow-md)]",
        className
      )}
    >
      {children}
    </div>
  );
}
