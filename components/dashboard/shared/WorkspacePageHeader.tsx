"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { WorkspaceAiHint } from "./WorkspaceAiHint";

type Props = {
  title: string;
  subtitle?: string;
  contextSummary?: string;
  aiHint?: string;
  actions?: ReactNode;
  className?: string;
};

export function WorkspacePageHeader({
  title,
  subtitle,
  contextSummary,
  aiHint,
  actions,
  className,
}: Props) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="ds-display">{title}</h1>
          {subtitle ? (
            <p className="ds-caption text-[var(--shell-muted)]">{subtitle}</p>
          ) : null}
          {contextSummary ? (
            <p className="text-[13px] font-medium text-[var(--shell-text)]">
              {contextSummary}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {aiHint ? <WorkspaceAiHint message={aiHint} /> : null}
    </div>
  );
}
