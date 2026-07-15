/**
 * Canonical Monavel marketing motion language.
 * One timing scale, one easing curve — calm, fast, operational.
 */

/** Durations in milliseconds — Instant / Fast / Normal / Slow / Cycle. */
export const MKT_MOTION = {
  instant: 0,
  micro: 100,
  fast: 150,
  normal: 200,
  slow: 250,
  /** Long ambient loops (hero / story cycles). */
  cycle: 12_000,
  /** KPI count-up once on enter. */
  kpiCount: 600,
  /** Gentle stagger between sibling reveals. */
  stagger: 50,
  /** Reveal / card enter distance (px). */
  revealY: 6,
  /** Interactive card hover lift (px). */
  hoverY: 2,
  /** Button hover lift (px). */
  btnHoverY: 1,
} as const;

/** Premium ease-out — the only marketing curve. */
export const MKT_MOTION_EASE = "cubic-bezier(0.16, 1, 0.3, 1)" as const;

/** CSS custom property names for the motion language. */
export const MKT_MOTION_CSS = {
  instant: "--mkt-duration-instant",
  micro: "--mkt-duration-micro",
  fast: "--mkt-duration-fast",
  normal: "--mkt-duration",
  slow: "--mkt-duration-slow",
  cycle: "--mkt-duration-cycle",
  ease: "--mkt-ease",
  easeOut: "--mkt-ease-out",
  revealY: "--mkt-motion-reveal-y",
  hoverY: "--mkt-motion-hover-y",
  btnHoverY: "--mkt-motion-btn-hover-y",
  stagger: "--mkt-motion-stagger",
} as const;
