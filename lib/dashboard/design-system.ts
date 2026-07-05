/**
 * Monavel admin design system tokens.
 * CSS variables are defined in app/globals.css — keep class helpers in sync.
 */

export const DS = {
  radius: "14px",
  radiusSm: "10px",
  radiusLg: "18px",
  surfacePadding: "18px",
  inputHeight: "36px",
  buttonHeight: "36px",
  iconSize: 17,
  transition: "160ms cubic-bezier(0.16, 1, 0.3, 1)",
  transitionSlow: "180ms cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** Unified surface card — shadow-first, borderless */
export const surfaceClass =
  "rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)] transition-[transform,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:bg-[var(--shell-surface-raised)] hover:shadow-[var(--shell-shadow-md)]";

/** Flat surface without hover lift */
export const surfaceStaticClass =
  "rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]";

/** Glass secondary surface */
export const glassClass =
  "rounded-[var(--ds-radius-sm)] bg-[var(--shell-glass)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";

/** Unified input field */
export const inputClass =
  "h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-3 text-[13px] text-[var(--shell-text)] shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] placeholder:text-[var(--shell-muted)] focus-visible:border-[var(--shell-accent-border)] focus-visible:bg-[var(--shell-surface)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] disabled:pointer-events-none disabled:opacity-50";

/** Page-level display title (feature pages) */
export const pageTitleClass =
  "text-[var(--type-display-size)] font-[var(--type-display-weight)] leading-[var(--type-display-leading)] tracking-[var(--type-display-tracking)] text-[var(--shell-text)]";

/** Page subtitle */
export const pageSubtitleClass =
  "mt-1.5 text-[var(--type-body-size)] leading-[var(--type-body-leading)] text-[var(--shell-muted)]";

/** Section heading */
export const sectionTitleClass =
  "text-[var(--type-heading-size)] font-[var(--type-heading-weight)] leading-[var(--type-heading-leading)] tracking-[var(--type-heading-tracking)] text-[var(--shell-text)]";

/** Eyebrow label */
export const labelClass =
  "text-[var(--type-label-size)] font-[var(--type-label-weight)] uppercase leading-[var(--type-label-leading)] tracking-[var(--type-label-tracking)] text-[var(--shell-muted)]";
