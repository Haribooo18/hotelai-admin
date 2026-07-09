import type { MotionRevealOrder } from "@/lib/motion/reveal";
import { motionRevealDelayClass } from "@/lib/motion/reveal";
import {
  motionCalendarCrossfadeClass,
  motionDropdownPopupClass,
  motionFilterPanelClass,
  motionInspectorPopoverClass,
} from "@/lib/motion/dropdown";
import {
  motionSkeletonClass,
  motionSkeletonContentEnterClass,
  motionSkeletonCrossfadeRootClass,
  motionSkeletonExitClass,
} from "@/lib/motion/skeleton";
import {
  motionToastActionButtonClass,
  motionToastClass,
  motionToastToasterClass,
} from "@/lib/motion/toast";
import {
  motionChartEmptyClass,
  motionChartLegendItemClass,
  motionChartSurfaceClass,
  motionChartTooltipClass,
} from "@/lib/motion/chart";
import {
  motionKpiDeltaClass,
  motionKpiValueClass,
} from "@/lib/motion/kpi";
import {
  motionFormDrawerClass,
  motionInspectorPanelClass,
  motionInspectorRevealRootClass,
  motionLayoutAdaptClass,
  motionModalBackdropClass,
  motionModalContentClass,
} from "@/lib/motion/modal";
import { motion as motionTokens } from "./tokens";

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]";

export { motionTokens };
export type { MotionRevealOrder };

export const motionDurations = {
  fast: "var(--ds-duration-fast)",
  short: "var(--ds-duration-short)",
  base: "var(--ds-duration)",
  long: "var(--ds-duration-long)",
  modal: "var(--ds-duration-modal)",
  inspector: "var(--ds-duration-inspector)",
  press: "var(--ds-duration-press)",
} as const;

export const motionEase = "var(--ds-ease)";

export const motionRevealClass = (order: MotionRevealOrder = 0) =>
  `ds-motion-reveal ${motionRevealDelayClass(order)}`;

export const motionPresets = {
  transitionBase:
    "transition-[transform,box-shadow,background-color] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
  transitionColors:
    "transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
  transitionOpacity:
    "transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  transitionAll:
    "transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  transitionFast:
    "transition-[border-color,box-shadow,background-color,opacity,transform] duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)]",

  hover: {
    surfaceLift:
      "ds-motion-surface-lift hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-md)]",
    subtleBg:
      "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]",
    scalePress:
      "ds-motion-scale-press active:scale-[0.98] active:duration-[var(--ds-duration-press)]",
  },

  focus: {
    ring: focusRingClass,
    search: "ds-motion-search-focus",
  },

  page: {
    root: "ds-page-transition-root",
    transition: "ds-page-transition",
    leaving: "ds-page-transition-leaving",
    entering: "ds-page-transition-entering",
    enter: "ds-page-enter",
  },

  reveal: {
    base: "ds-motion-reveal",
    order: motionRevealClass,
  },

  filterPanel: motionFilterPanelClass,
  inspectorPopover: motionInspectorPopoverClass,
  inspector: motionInspectorPanelClass,
  inspectorPanel: motionInspectorPanelClass,
  inspectorRevealRoot: motionInspectorRevealRootClass,
  layoutAdapt: motionLayoutAdaptClass,
  inspectorDrawer: "ds-inspector-drawer",
  calendarCrossfade: motionCalendarCrossfadeClass,

  floating: {
    popup: motionDropdownPopupClass,
  },

  dropdown: {
    popup: motionDropdownPopupClass,
    enter: motionDropdownPopupClass,
    exit: motionDropdownPopupClass,
  },

  popover: {
    popup: motionDropdownPopupClass,
    enter: motionDropdownPopupClass,
  },

  tooltip: {
    popup: motionDropdownPopupClass,
    enter: motionDropdownPopupClass,
  },

  contextMenu: {
    popup: motionDropdownPopupClass,
  },

  drawer: {
    backdrop: motionModalBackdropClass,
    content: motionFormDrawerClass,
  },

  dialog: {
    backdrop: motionModalBackdropClass,
    content: motionModalContentClass,
  },

  modal: {
    backdrop: motionModalBackdropClass,
    content: motionModalContentClass,
    formDrawer: motionFormDrawerClass,
  },

  skeleton: {
    base: motionSkeletonClass,
    exit: motionSkeletonExitClass,
    contentEnter: motionSkeletonContentEnterClass,
    crossfade: motionSkeletonCrossfadeRootClass,
    shimmer: "animate-[ds-shimmer_1.4s_var(--ds-ease)_infinite]",
  },

  toast: {
    toaster: motionToastToasterClass,
    toast: motionToastClass,
    actionButton: motionToastActionButtonClass,
  },

  kpi: {
    value: motionKpiValueClass,
    delta: motionKpiDeltaClass,
  },

  chart: {
    surface: motionChartSurfaceClass,
    empty: motionChartEmptyClass,
    tooltip: motionChartTooltipClass,
    legendItem: motionChartLegendItemClass,
  },
} as const;

export const focusRingClassName = focusRingClass;