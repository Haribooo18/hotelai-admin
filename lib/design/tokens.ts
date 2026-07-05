/**
 * Monavel design tokens — canonical values mirrored in `app/globals.css`.
 * Use semantic tokens from `theme.ts` in components; reference raw tokens for tooling/docs.
 */

export const colors = {
  shell: {
    bg: "var(--shell-bg)",
    content: "var(--shell-content)",
    sidebar: "var(--shell-sidebar)",
    sidebarElevated: "var(--shell-sidebar-elevated)",
    surface: "var(--shell-surface)",
    surfaceRaised: "var(--shell-surface-raised)",
    glass: "var(--shell-glass)",
    topbar: "var(--shell-topbar)",
    text: "var(--shell-text)",
    muted: "var(--shell-muted)",
    border: "var(--shell-border)",
    borderStrong: "var(--shell-border-strong)",
    navText: "var(--shell-nav-text)",
    navIcon: "var(--shell-nav-icon)",
    navHoverBg: "var(--shell-nav-hover-bg)",
    navActiveBg: "var(--shell-nav-active-bg)",
    navActiveText: "var(--shell-nav-active-text)",
    accent: "var(--shell-accent)",
    accentHover: "var(--shell-accent-hover)",
    accentMuted: "var(--shell-accent-muted)",
    accentBorder: "var(--shell-accent-border)",
    accentRing: "var(--shell-accent-ring)",
  },
  shadcn: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    destructive: "var(--destructive)",
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
  },
} as const;

export const spacing = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  surfacePadding: "var(--ds-surface-padding)",
  inputHeight: "var(--ds-input-height)",
  buttonHeight: "var(--ds-button-height)",
  shellHeaderHeight: "var(--shell-header-height)",
  shellSidebarWidth: "var(--shell-sidebar-width)",
} as const;

export const radius = {
  sm: "var(--ds-radius-sm)",
  md: "var(--ds-radius)",
  lg: "var(--ds-radius-lg)",
  shadcnSm: "var(--radius-sm)",
  shadcnMd: "var(--radius-md)",
  shadcnLg: "var(--radius-lg)",
  shadcnXl: "var(--radius-xl)",
  shadcn2xl: "var(--radius-2xl)",
  base: "var(--radius)",
} as const;

export const blur = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  glass: "16px",
} as const;

export const shadows = {
  sm: "var(--shell-shadow-sm)",
  md: "var(--shell-shadow-md)",
  lg: "var(--shell-shadow-lg)",
  accent: "var(--shell-shadow-accent)",
} as const;

export const opacity = {
  disabled: 0.5,
  muted: 0.72,
  overlay: 0.4,
  glass: 0.68,
  topbar: 0.72,
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  dropdown: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
} as const;

export const motion = {
  duration: {
    fast: "120ms",
    base: "160ms",
    slow: "180ms",
    slower: "640ms",
  },
  durationVar: {
    fast: "120ms",
    base: "var(--ds-duration)",
    slow: "var(--ds-duration-slow)",
    slower: "640ms",
  },
  easing: {
    default: "cubic-bezier(0.16, 1, 0.3, 1)",
    linear: "linear",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  easingVar: {
    default: "var(--ds-ease)",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const designTokens = {
  colors,
  spacing,
  radius,
  blur,
  shadows,
  opacity,
  zIndex,
  motion,
  breakpoints,
} as const;
