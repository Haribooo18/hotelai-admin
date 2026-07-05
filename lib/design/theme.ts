/**
 * Monavel semantic theme tokens.
 * Components should reference these — not raw palette values or Tailwind color utilities.
 */

export const theme = {
  surface: "var(--shell-surface)",
  surfaceRaised: "var(--shell-surface-raised)",
  surfaceGlass: "var(--shell-glass)",

  primary: "var(--shell-accent)",
  primaryHover: "var(--shell-accent-hover)",
  primaryMuted: "var(--shell-accent-muted)",

  success: "var(--shell-accent)",
  warning: "oklch(0.72 0.14 75)",
  danger: "var(--destructive)",

  textPrimary: "var(--shell-text)",
  textSecondary: "var(--shell-nav-text)",
  textMuted: "var(--shell-muted)",

  border: "var(--shell-border)",
  borderStrong: "var(--shell-border-strong)",

  focusRing: "var(--shell-accent-ring)",

  overlay: "oklch(0 0 0 / 40%)",

  sidebar: "var(--shell-sidebar)",
  topbar: "var(--shell-topbar)",
  toolbar: "var(--shell-surface-raised)",

  content: "var(--shell-content)",
  background: "var(--shell-bg)",
} as const;

export type ThemeToken = keyof typeof theme;

export function themeVar(token: ThemeToken): string {
  return theme[token];
}
