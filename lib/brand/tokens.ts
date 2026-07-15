/**
 * Official Monavel brand identity tokens.
 *
 * Brand layer ≠ product UI layer.
 * Do not map these onto `--shell-accent`, buttons, charts, KPI, links, or status colors.
 * Gold is brand/premium identity. Product interactive green stays on shell/marketing accents.
 */

/** Raw palette — hex literals mirrored in `app/globals.css`. */
export const BRAND_PALETTE = {
  black: "#0B0D10",
  charcoal: "#121418",
  green: "#0B1F1B",
  gold: "#C8A25A",
  white: "#F2F2F2",
  gray: "#686F76",
} as const;

/** CSS custom property names for the raw palette. */
export const BRAND_PALETTE_CSS = {
  black: "--brand-black",
  charcoal: "--brand-charcoal",
  green: "--brand-green",
  gold: "--brand-gold",
  white: "--brand-white",
  gray: "--brand-gray",
} as const;

/** Semantic brand aliases (CSS var references). */
export const BRAND_SEMANTIC_CSS = {
  logo: "--brand-logo",
  premium: "--brand-premium",
  surface: "--brand-surface",
  surfaceRaised: "--brand-surface-raised",
  identityGreen: "--brand-identity-green",
} as const;

/** Semantic aliases as `var(...)` for component/tooling use. */
export const brand = {
  black: "var(--brand-black)",
  charcoal: "var(--brand-charcoal)",
  green: "var(--brand-green)",
  gold: "var(--brand-gold)",
  white: "var(--brand-white)",
  gray: "var(--brand-gray)",
  logo: "var(--brand-logo)",
  premium: "var(--brand-premium)",
  surface: "var(--brand-surface)",
  surfaceRaised: "var(--brand-surface-raised)",
  identityGreen: "var(--brand-identity-green)",
} as const;

export const BRAND_TOKEN_NAMES = [
  ...Object.values(BRAND_PALETTE_CSS),
  ...Object.values(BRAND_SEMANTIC_CSS),
] as const;
