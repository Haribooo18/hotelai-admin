import { motion as motionTokens } from "./tokens";

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]";

export { motionTokens };

export const motionPresets = {
  transitionBase:
    "transition-[transform,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  transitionColors:
    "transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  transitionOpacity:
    "transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  transitionAll:
    "transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)]",

  hover: {
    surfaceLift:
      "hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-md)]",
    subtleBg: "hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]",
    scalePress: "active:scale-[0.98]",
  },

  focus: {
    ring: focusRingClass,
  },

  drawer: {
    backdrop: "ds-dialog-backdrop",
    content: "ds-dialog-content",
  },

  dialog: {
    backdrop: "ds-dialog-backdrop",
    content: "ds-dialog-content",
  },

  tooltip: {
    enter:
      "animate-in fade-in-0 zoom-in-95 duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  },

  popover: {
    enter:
      "animate-in fade-in-0 zoom-in-95 duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
  },

  page: {
    enter: "ds-page-enter",
  },

  skeleton: {
    base: "ds-skeleton",
    shimmer: "animate-[ds-shimmer_1.4s_ease-in-out_infinite]",
  },
} as const;

export const focusRingClassName = focusRingClass;
