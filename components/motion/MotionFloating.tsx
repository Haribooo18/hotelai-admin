import {
  motionFloatingPopupClass,
  motionFilterPanelClass,
  motionInspectorPopoverClass,
} from "@/lib/motion/dropdown";
import { cn } from "@/lib/utils";

export const motionFloatingPopupClasses = {
  dropdown: motionFloatingPopupClass,
  filterPanel: motionFilterPanelClass,
  inspectorPopover: motionInspectorPopoverClass,
} as const;

export function motionFloatingClass(
  variant: keyof typeof motionFloatingPopupClasses = "dropdown",
  className?: string
) {
  return cn(motionFloatingPopupClasses[variant], className);
}
