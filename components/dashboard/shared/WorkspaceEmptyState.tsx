"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  guidance?: string;
  className?: string;
};

export function WorkspaceEmptyState({
  title,
  description,
  icon,
  action,
  guidance,
  className,
}: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      <EmptyState
        title={title}
        description={description}
        icon={icon}
        action={action}
      />
      {guidance ? (
        <p className="text-center text-[12px] text-[var(--shell-muted)]">
          {guidance}
        </p>
      ) : null}
    </div>
  );
}
