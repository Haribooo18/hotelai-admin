"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";

import type { ExecutiveKpiGridItem } from "./ExecutiveKpisGrid";

type KpiConfig<T extends Record<string, number>> = Array<{
  key: keyof T;
  label: string;
  icon: LucideIcon;
  format: (value: number) => string;
}>;

export function useExecutiveKpiItems<T extends Record<string, number>>(
  kpis: T,
  config: KpiConfig<T>
): ExecutiveKpiGridItem[] {
  return useMemo(
    () =>
      config.map((item) => ({
        key: String(item.key),
        label: item.label,
        icon: item.icon,
        value: kpis[item.key],
        format: item.format,
      })),
    [kpis, config]
  );
}
