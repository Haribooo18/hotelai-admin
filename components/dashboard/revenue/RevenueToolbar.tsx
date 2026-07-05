"use client";

import {
  ArrowLeftRight,
  Download,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  defaultRevenueRange,
  type RevenueDateRange,
} from "./revenue-metrics";

type Props = {
  range: RevenueDateRange;
  compareEnabled: boolean;
  exporting: boolean;
  canExport: boolean;
  onRangeChange: (range: RevenueDateRange) => void;
  onCompareChange: (enabled: boolean) => void;
  onExport: () => void;
};

export function RevenueToolbar({
  range,
  compareEnabled,
  exporting,
  canExport,
  onRangeChange,
  onCompareChange,
  onExport,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="date"
        value={range.from}
        onChange={(e) => onRangeChange({ ...range, from: e.target.value })}
        aria-label="Start date"
        className="h-11 w-[156px] rounded-[12px] border-0 bg-[var(--shell-surface)] text-[13px] shadow-[var(--shell-shadow-sm)]"
      />
      <Input
        type="date"
        value={range.to}
        onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
        aria-label="End date"
        className="h-11 w-[156px] rounded-[12px] border-0 bg-[var(--shell-surface)] text-[13px] shadow-[var(--shell-shadow-sm)]"
      />

      <button
        type="button"
        onClick={onExport}
        disabled={exporting || !canExport}
        className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[var(--shell-surface)] px-4 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:bg-[var(--shell-nav-hover-bg)] disabled:opacity-50"
      >
        <Download size={16} />
        Export
      </button>

      <button
        type="button"
        onClick={() => onCompareChange(!compareEnabled)}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-[12px] px-4 text-[13px] font-medium shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out",
          compareEnabled
            ? "bg-emerald-500/15 text-emerald-500"
            : "bg-[var(--shell-surface)] text-[var(--shell-text)] hover:bg-[var(--shell-nav-hover-bg)]"
        )}
      >
        <ArrowLeftRight size={16} />
        Compare
      </button>

      <button
        type="button"
        onClick={() => onRangeChange(defaultRevenueRange())}
        className="inline-flex h-11 items-center rounded-[12px] bg-[var(--shell-surface)] px-4 text-[13px] font-medium text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:text-[var(--shell-text)]"
      >
        30 days
      </button>
    </div>
  );
}
