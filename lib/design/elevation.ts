import { motionPresets } from "./motion";

/** Shadow-first surface presets — borderless Monavel cards */

export const elevationPresets = {
  surface: {
    className: `rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)] ${motionPresets.transitionBase}`,
    staticClassName:
      "rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]",
    interactiveClassName: `rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)] ${motionPresets.transitionBase} ${motionPresets.hover.surfaceLift}`,
  },

  raised: {
    className:
      "rounded-[var(--ds-radius)] bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-md)]",
  },

  floating: {
    className:
      "rounded-[var(--ds-radius)] bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-lg)]",
  },

  overlay: {
    className: "bg-[var(--shell-bg)]/40 backdrop-blur-sm",
  },

  glass: {
    className:
      "rounded-[var(--ds-radius)] bg-[var(--shell-glass)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl",
  },
} as const;

export type ElevationLevel = keyof typeof elevationPresets;

/** Legacy export names used across dashboard features */
export const surfaceClass = elevationPresets.surface.interactiveClassName;
export const surfaceStaticClass = elevationPresets.surface.staticClassName;
export const glassClass = elevationPresets.glass.className;
