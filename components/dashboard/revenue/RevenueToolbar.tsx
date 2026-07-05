"use client";

import {
  ArrowLeftRight,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
        className="w-[148px]"
      />
      <Input
        type="date"
        value={range.to}
        onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
        aria-label="End date"
        className="w-[148px]"
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onExport}
        disabled={exporting || !canExport}
        loading={exporting}
      >
        <Download size={15} />
        Export
      </Button>

      <Button
        type="button"
        variant={compareEnabled ? "default" : "secondary"}
        size="sm"
        onClick={() => onCompareChange(!compareEnabled)}
      >
        <ArrowLeftRight size={15} />
        Compare
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRangeChange(defaultRevenueRange())}
        className={cn(compareEnabled ? "" : "")}
      >
        30 days
      </Button>
    </div>
  );
}
