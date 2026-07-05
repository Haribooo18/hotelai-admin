"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { focusRingClassName } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/core/Button";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
};

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  previousLabel = "Previous",
  nextLabel = "Next",
}: PaginationProps) {
  const canPrevious = page > 1;
  const canNext = page < pageCount;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden />
        {previousLabel}
      </Button>

      <span className="text-[13px] text-[var(--shell-muted)]">
        {page} / {Math.max(pageCount, 1)}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
        <ChevronRight size={16} aria-hidden />
      </Button>
    </nav>
  );
}

export { focusRingClassName };
