import { motion as motionTokens } from "./tokens";

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]";

export { motionTokens };

export type MotionRevealOrder = 0 | 1 | 2 | 3 | 4;

export const motionDurations = {
  fast: "var(--ds-duration-fast)",
  short: "var(--ds-duration-short)",
  base: "var(--ds-duration)",
  long: "var(--ds-duration-long)",
  modal: "var(--ds-duration-modal)",
  press: "var(--ds-duration-press)",
} as const;

export const motionEase = "var(--ds-ease)";

export const motionRevealClass = (order: MotionRevealOrder = 0) =>
  `ds-motion-reveal ds-motion-reveal-${order}`;

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
      "hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-md)]",
    subtleBg:
      "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]",
    scalePress:
      "active:scale-[0.98] active:duration-[var(--ds-duration-press)]",
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

  filterPanel: "ds-motion-filter-panel",
  inspector: "ds-motion-inspector",
  inspectorDrawer: "ds-inspector-drawer",
  calendarCrossfade: "ds-motion-calendar-crossfade",
  dropdownEnter: "ds-motion-dropdown",
  dropdownExit: "ds-motion-dropdown-exit",

  drawer: {
    backdrop: "ds-overlay-backdrop",
    content: "ds-drawer-content",
  },

  dialog: {
    backdrop: "ds-overlay-backdrop",
    content: "ds-modal-content",
  },

  tooltip: {
    enter:
      "animate-in fade-in-0 zoom-in-[0.98] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  },

  popover: {
    enter:
      "animate-in fade-in-0 zoom-in-[0.98] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  },

  skeleton: {
    base: "ds-skeleton",
    exit: "ds-skeleton-exit",
    shimmer: "animate-[ds-shimmer_1.4s_var(--ds-ease)_infinite]",
  },
} as const;

export const focusRingClassName = focusRingClass;
