import type { LucideIcon } from "lucide-react";

export type ExecutiveKpiGridItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  value: number;
  format: (value: number) => string;
};
