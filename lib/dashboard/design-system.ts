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

/** Shell semantic helpers */
export const shellTextClass = "text-[var(--shell-text)]";
export const shellMutedClass = "text-[var(--shell-muted)]";
export const shellSurfaceClass = "bg-[var(--shell-surface)]";
export const shellSurfaceRaisedClass = "bg-[var(--shell-surface-raised)]";
export const shellBorderClass = "border-[var(--shell-border)]";
export const shellFormLabelClass = "block text-sm text-[var(--shell-muted)]";
export const shellEmptyStateClass =
  "rounded-[var(--ds-radius)] border border-dashed border-[var(--shell-border)] bg-[var(--shell-surface)] py-16 text-center text-[var(--shell-muted)]";
export const shellPanelClass =
  "rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]";
export const shellPanelRaisedClass =
  "rounded-[var(--ds-radius)] bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]";

/** Standard vertical rhythm for admin pages */
export const pageStackClass = "space-y-5";

/** Grid gap between cards/sections */
export const sectionGapClass = "gap-4";

/** Sticky offset below the 52px top bar */
export const stickyBelowTopbarClass = "top-[52px]";

/** Unified toolbar shell */
export const toolbarShellClass =
  "space-y-3 rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] transition-[box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]";

/** Sticky filter/toolbar bar */
export const stickyToolbarClass =
  "sticky top-[52px] z-20 space-y-3 rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/92 p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl transition-[box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]";

/** Toolbar search input */
export const toolbarInputClass =
  "h-[var(--ds-input-height)] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] pl-10 text-[13px] shadow-[var(--shell-shadow-sm)] transition-[box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] focus-visible:ring-[var(--shell-accent-ring)]";

/** Toolbar control button / trigger */
export const toolbarControlClass =
  "inline-flex h-[var(--ds-input-height)] items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]";

/** Filter chip */
export const chipClass =
  "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]";

export const chipActiveClass =
  "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)] shadow-[var(--shell-shadow-sm)]";

export const chipIdleClass =
  "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]";

/** Ghost icon action in tables */
export const iconActionClass =
  "inline-flex size-8 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-[background-color,color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] active:scale-[0.98]";
