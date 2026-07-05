/**
 * Monavel admin design system class helpers.
 * Re-exports semantic primitives from `lib/design` — CSS variables live in `app/globals.css`.
 */

export {
  glassClass,
  surfaceClass,
  surfaceStaticClass,
} from "@/lib/design/elevation";
export {
  typographyScale,
  typographyClass,
  sectionTitleClass,
} from "@/lib/design/typography";
export { motionPresets, focusRingClassName } from "@/lib/design/motion";
export { theme, themeVar } from "@/lib/design/theme";

import { focusRingClassName } from "@/lib/design/motion";

/** Unified input field */
export const inputClass =
  "h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-3 text-[13px] text-[var(--shell-text)] shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] placeholder:text-[var(--shell-muted)] focus-visible:border-[var(--shell-accent-border)] focus-visible:bg-[var(--shell-surface)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] disabled:pointer-events-none disabled:opacity-50";

export const shellFormLabelClass = "block text-sm text-[var(--shell-muted)]";
export const shellEmptyStateClass =
  "rounded-[var(--ds-radius)] border border-dashed border-[var(--shell-border)] bg-[var(--shell-surface)] py-10 text-center text-[var(--shell-muted)] sm:py-16";

/** Standard vertical rhythm for admin pages */
export const pageStackClass = "space-y-5";

/** Sticky filter/toolbar bar */
export const stickyToolbarClass =
  "sticky top-[var(--shell-header-height)] z-20 space-y-3 rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/92 p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl transition-[box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]";

/** Toolbar search input */
export const toolbarInputClass =
  "h-[var(--ds-input-height)] rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] pl-10 text-[13px] shadow-[var(--shell-shadow-sm)] transition-[box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] focus-visible:ring-[var(--shell-accent-ring)]";

/** Toolbar control button / trigger */
export const toolbarControlClass = `inline-flex h-[var(--ds-input-height)] min-h-11 items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[13px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] ${focusRingClassName}`;

/** Filter chip */
export const chipClass = `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] min-h-11 sm:min-h-0 sm:py-1.5 ${focusRingClassName}`;

export const chipActiveClass =
  "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)] shadow-[var(--shell-shadow-sm)]";

export const chipIdleClass =
  "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]";

/** Ghost icon action in tables */
export const iconActionClass = `inline-flex size-8 min-h-11 min-w-11 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-[background-color,color,transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] active:scale-[0.98] sm:min-h-0 sm:min-w-0 ${focusRingClassName}`;

/** Hover-only menus stay visible on touch devices */
export const hoverRevealClass =
  "opacity-0 transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100";

/** Clickable data table row — bookings/guests variant */
export const tableRowClickableClass = `cursor-pointer border-b border-[var(--shell-border)]/35 transition-[background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] last:border-0 hover:bg-[var(--shell-surface-raised)]/50 ${focusRingClassName}`;

/** Clickable data table row — rooms/knowledge variant */
export const tableRowClickableAltClass = `cursor-pointer border-b border-[var(--shell-border)]/40 transition-[background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]/50 ${focusRingClassName}`;

/** View mode toggle button */
export const viewToggleButtonClass = `flex h-8 w-8 min-h-11 min-w-11 items-center justify-center rounded-[10px] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)] sm:min-h-0 sm:min-w-0 ${focusRingClassName}`;
