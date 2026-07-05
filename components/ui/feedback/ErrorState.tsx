import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--ds-radius)] border border-red-500/20 bg-red-500/5 px-6 py-8 text-center",
        className
      )}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-red-500/10 text-red-400">
        <AlertCircle size={20} aria-hidden />
      </div>
      <p className="text-[14px] font-medium text-[var(--shell-text)]">{title}</p>
      {description ? (
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--shell-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
