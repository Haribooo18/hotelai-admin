import { motionPresets } from "./motion";

/** Premium surface presets — subtle border, inner highlight, ambient shadow */

const cardSurfaceBase =
  "ds-card-surface rounded-[var(--ds-radius-card)] bg-[var(--shell-surface)]";

const workspaceSurfaceBase =
  "ds-workspace-surface rounded-[var(--ds-radius-workspace)] bg-[var(--shell-glass)] backdrop-blur-xl";

export const elevationPresets = {
  surface: {
    className: `${cardSurfaceBase} ${motionPresets.transitionBase}`,
    staticClassName: cardSurfaceBase,
    interactiveClassName: `ds-card-surface-interactive ${cardSurfaceBase} ${motionPresets.transitionBase} ${motionPresets.hover.surfaceLift}`,
  },

  raised: {
    className: `${cardSurfaceBase} bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-md)]`,
  },

  floating: {
    className: `${cardSurfaceBase} bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-lg)]`,
  },

  overlay: {
    className: "bg-[var(--shell-bg)]/40 backdrop-blur-sm",
  },

  glass: {
    className: `${cardSurfaceBase} bg-[var(--shell-glass)] backdrop-blur-xl`,
  },

  workspace: {
    className: workspaceSurfaceBase,
    interactiveClassName: `${workspaceSurfaceBase} ${motionPresets.transitionBase}`,
  },
} as const;

export type ElevationLevel = keyof typeof elevationPresets;

/** Legacy export names used across dashboard features */
export const surfaceClass = elevationPresets.surface.interactiveClassName;
export const surfaceStaticClass = elevationPresets.surface.staticClassName;
export const glassClass = elevationPresets.glass.className;
export const workspaceGlassClass = elevationPresets.workspace.className;
