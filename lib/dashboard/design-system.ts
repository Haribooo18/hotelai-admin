/**
 * Monavel admin design system class helpers.
 * Re-exports semantic primitives from `lib/design` — CSS variables live in `app/globals.css`.
 */

export {
  glassClass,
  surfaceClass,
  surfaceStaticClass,
  workspaceGlassClass,
} from "@/lib/design/elevation";
export {
  typographyScale,
  typographyClass,
  typographyRoles,
  sectionTitleClass,
} from "@/lib/design/typography";
export { motionPresets, focusRingClassName } from "@/lib/design/motion";
export { theme, themeVar } from "@/lib/design/theme";

import { focusRingClassName } from "@/lib/design/motion";

/** Unified input field */
export const formControlInvalidClass =
  "aria-invalid:border-red-500/50 aria-invalid:ring-red-500/20";

export const inputClass =
  "ds-body h-[var(--ds-input-height)] w-full rounded-[var(--ds-radius-input)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-3 shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)] placeholder:text-[var(--shell-muted)] placeholder:transition-opacity placeholder:duration-[var(--ds-duration-fast)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface)] focus-visible:border-[var(--shell-accent-border)] focus-visible:bg-[var(--shell-surface)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] ds-motion-search-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--shell-border)] disabled:bg-[var(--shell-surface-raised)]/60 disabled:opacity-50 aria-invalid:border-red-500/50 aria-invalid:ring-red-500/20";

export const selectClass = `${inputClass} appearance-none pr-8`;

export const textareaClass = `${inputClass} min-h-24 resize-y py-2.5`;

export const formRaisedControlClass =
  "rounded-[var(--ds-radius-input)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] shadow-[var(--shell-shadow-sm)]";

export const shellFormLabelClass = "ds-form-label block";
export const shellEmptyStateClass =
  "rounded-[var(--ds-radius-card)] border border-dashed border-[var(--shell-border)]/45 bg-[var(--shell-surface)]/80 py-12 text-center sm:py-14";

/** Standard vertical rhythm for admin pages */
export const pageStackClass = "space-y-6 md:space-y-7";

/** Shared toolbar row / cluster spacing */
export const toolbarRowGapClass = "gap-[var(--ds-toolbar-gap)]";

/** Toolbar search field container — grows to fill remaining row width */
export const toolbarSearchContainerClass =
  "min-w-[160px] flex-1 max-w-none";

/** Unified workspace toolbar shell */
export const workspaceToolbarShellClass =
  "rounded-[var(--ds-radius-workspace)] border border-[var(--shell-border)]/55 bg-[var(--shell-surface)]/95 p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";

/** Sticky primary toolbar row — sticks to workspace scroll top */
export const workspaceToolbarRow1StickyClass =
  "sticky top-0 z-20 mb-[var(--ds-toolbar-gap)] rounded-[var(--ds-radius-workspace)] border border-[var(--shell-border)]/55 bg-[var(--shell-surface)]/95 p-3 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";

/** Shrink-wrapped toolbar shell — content width only, no sticky overlay */
export const workspaceToolbarFitClass =
  "relative mb-[var(--ds-toolbar-gap)] inline-block w-max max-w-none rounded-[var(--ds-radius-workspace)] border border-[var(--shell-border)]/55 bg-[var(--shell-surface)]/95 p-3 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";

/** Scrollable toolbar rows shell — rows 2 and 3 (deprecated: merged into row 1 shell) */
export const workspaceToolbarScrollRowsShellClass =
  "contents";

/** Row 1 layout target — height follows content */
export const workspaceToolbarRow1Class = "items-center";

/** Extended filters row — scrolls with page content */
export const workspaceToolbarRow3Class =
  "pt-[var(--ds-toolbar-gap)]";

/** Toolbar filter cluster */
export const toolbarFiltersClass = toolbarRowGapClass;

/** Toolbar action cluster (secondary + primary) */
export const toolbarActionsClass = toolbarRowGapClass;

/** Toolbar secondary action button (Import, Export, Refresh) */
export const toolbarSecondaryButtonClass =
  "h-[var(--ds-input-height)] min-h-11 gap-2 border-[var(--shell-border)]/70 bg-[var(--shell-surface-raised)]/90 px-3 text-[13px] font-medium text-[var(--shell-nav-text)] shadow-none hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] [&_svg:not([class*='size-'])]:size-[15px]";

/** Toolbar primary action button (+ New …) */
export const toolbarPrimaryButtonClass =
  "h-[var(--ds-input-height)] min-h-11 shrink-0 gap-2 px-3.5 text-[13px] font-semibold shadow-[var(--shell-shadow-accent)] [&_svg:not([class*='size-'])]:size-[15px]";

/** Toolbar date / compact filter input */
export const toolbarDateInputClass =
  "ds-body box-border h-[var(--ds-input-height)] min-h-11 !w-[118px] !max-w-[118px] shrink-0 rounded-[var(--ds-radius-input)] border border-[var(--shell-border)]/70 bg-[var(--shell-surface-raised)]/90 px-3.5 text-[13px] shadow-[var(--shell-shadow-sm)] transition-[box-shadow,background-color,border-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface)] focus-visible:border-[var(--shell-accent-border)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] placeholder:text-[var(--shell-muted)]/80";

/** Filter dropdown icon size */
export const toolbarFilterIconSize = 15;

/** Toolbar visual shell — chrome only; fixed by shell layout, not sticky positioning */
export const toolbarShellClass =
  "space-y-[var(--ds-toolbar-gap)] rounded-[var(--ds-radius-workspace)] border border-[var(--shell-border)]/55 bg-[var(--shell-surface)]/95 p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";

/** Viewport-locked admin shell — workspace scroll is the only main-column scroll owner */
export const shellViewportClass =
  "flex h-svh overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]";

export const shellMainColumnClass =
  "flex min-h-0 flex-1 flex-col min-w-0 bg-[var(--shell-content)] lg:pl-[252px]";

export const shellMainClass =
  "flex min-h-0 flex-1 flex-col overflow-hidden ds-content-canvas";

export const shellContentRegionClass =
  "mx-auto flex min-h-0 w-full max-w-[1360px] flex-1 flex-col overflow-hidden px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] lg:px-5 lg:py-6";

/** Inset after the global header divider — mirrors shellContentRegionClass lg horizontal padding */
export const shellHeaderWorkspaceInsetClass = "lg:ml-5";

/** Short structural separator between branding and workspace zones in the global header */
export const shellHeaderDividerClass =
  "hidden h-5 w-px shrink-0 bg-[var(--shell-border)]/55 lg:block";

/** Top bar filter cluster spacing */
export const topBarFiltersClass = "gap-1";

/** Top bar action cluster spacing */
export const topBarActionsClass = "gap-2";

/** Sidebar section group label */
export const sidebarSectionLabelClass =
  "px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--shell-muted)]/65";

/** Sidebar navigation item */
export const sidebarNavItemClass =
  "group relative ds-body flex h-9 items-center gap-2.5 rounded-[var(--ds-radius-button)] px-2.5 pl-3 tracking-[-0.01em] transition-[color,background-color,transform] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]";

export const shellWorkspaceFrameClass =
  "flex min-h-0 flex-1 flex-col overflow-hidden";

export const shellToolbarChromeClass = "shrink-0";

export const shellWorkspaceScrollClass =
  "min-h-0 flex-1 overflow-y-auto overscroll-y-contain";

export const toolbarRowClass =
  "flex flex-wrap items-center gap-[var(--ds-toolbar-gap)]";
export const toolbarSearchSlotClass = "min-w-0 flex-1";
export const toolbarFiltersSlotClass =
  "flex flex-wrap items-center gap-[var(--ds-toolbar-gap)]";
export const toolbarFlexSpacerClass = "hidden";
export const toolbarActionsSlotClass =
  "flex flex-wrap items-center gap-[var(--ds-toolbar-gap)] sm:ml-auto";
export const toolbarChipsRowClass =
  "flex flex-wrap items-center gap-[var(--ds-toolbar-gap)]";

/** Calendar prev/next — green with white icon */
export const toolbarCalendarNavButtonClass = `inline-flex size-[var(--ds-input-height)] min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] border-0 bg-[var(--shell-accent)] text-white shadow-[var(--shell-shadow-accent)] transition-[opacity,transform,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-95 hover:shadow-[var(--shell-shadow-md)] active:scale-[0.98] ${focusRingClassName}`;

/** @deprecated Alias for toolbarShellClass */
export const stickyToolbarClass = toolbarShellClass;

/** Toolbar search input */
export const toolbarInputClass =
  "ds-body h-[var(--ds-input-height)] min-h-11 w-full rounded-[var(--ds-radius-input)] border border-[var(--shell-border)]/70 bg-[var(--shell-surface-raised)] pl-10 pr-3 shadow-[var(--shell-shadow-sm)] transition-[box-shadow,background-color,border-color] duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)] placeholder:text-[var(--shell-muted)]/80 placeholder:transition-opacity placeholder:duration-[var(--ds-duration-fast)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface)] focus-visible:border-[var(--shell-accent-border)] focus-visible:bg-[var(--shell-surface)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] ds-motion-search-focus";

/** Toolbar control button / filter trigger — secondary chrome */
export const toolbarControlClass = `ds-body inline-flex h-[var(--ds-input-height)] min-h-11 max-w-full items-center gap-2 rounded-[var(--ds-radius-button)] border border-[var(--shell-border)]/65 bg-[var(--shell-surface-raised)]/90 px-3 text-[13px] font-medium text-[var(--shell-nav-text)] transition-[background-color,box-shadow,border-color,transform,color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] ${focusRingClassName}`;

/** Toolbar icon-only control (calendar navigation, etc.) */
export const toolbarIconButtonClass = `inline-flex size-[var(--ds-input-height)] min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color,box-shadow,border-color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-nav-hover-bg)] ${focusRingClassName}`;

/** Inline cluster for calendar prev / today / next */
export const toolbarNavClusterClass = `flex items-center ${toolbarRowGapClass}`;

/** Period title shown inside calendar toolbar */
export const toolbarTitleClass =
  "min-w-0 truncate text-[14px] font-semibold capitalize text-[var(--shell-text)]";

/** Muted inline label between toolbar controls (e.g. date range “to”) */
export const toolbarInlineLabelClass = "ds-caption shrink-0 text-[var(--shell-muted)]";

/** Segmented control track */
export const toolbarSegmentTrackClass =
  "flex h-[var(--ds-input-height)] min-h-11 shrink-0 items-center rounded-[var(--ds-radius-button)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-1 shadow-[var(--shell-shadow-sm)]";

/** Segmented control segment button */
export const toolbarSegmentButtonClass = `inline-flex h-full min-h-0 min-w-11 items-center justify-center rounded-[var(--ds-radius-button)] px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] ${focusRingClassName}`;

/** Filter chip */
export const chipClass = `ds-body rounded-full px-3.5 py-1.5 font-medium transition-[background-color,color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] min-h-11 sm:min-h-0 sm:py-1.5 ${focusRingClassName}`;

export const chipActiveClass =
  "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)] shadow-[var(--shell-shadow-sm)]";

export const chipIdleClass =
  "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]";

/** Ghost icon action in tables */
export const iconActionClass = `inline-flex size-8 min-h-11 min-w-11 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-[background-color,color,transform,opacity] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] active:scale-[0.98] sm:min-h-0 sm:min-w-0 ${focusRingClassName}`;

/** Table shell, header, body, rows, cells */
export const tableShellClass =
  "overflow-hidden rounded-[var(--ds-radius-card)] border border-[var(--shell-border)] bg-[var(--shell-surface)]";
export const tableContainerClass = "shadow-[var(--shell-shadow-sm)]";
export const tableElementClass = "w-full table-fixed border-collapse";
export const tableScrollClass = "overflow-x-auto overscroll-x-contain";
export const tableHeadClass =
  "sticky top-0 z-10 bg-[var(--shell-surface)] shadow-[inset_0_-1px_0_var(--shell-border)]/35";
export const tableHeadRowClass = "border-b border-[var(--shell-border)]/35";
export const tableHeaderCellClass =
  "h-11 whitespace-nowrap px-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--shell-muted)] last:text-right";
export const tableBodyCellClass =
  "overflow-hidden px-4 py-4 align-middle ds-table-cell";
export const tableActionsCellClass = "text-right";
export const tableBodyRowClass = `cursor-pointer border-b border-[var(--shell-border)]/20 transition-[background-color,box-shadow] duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)] last:border-b-0 hover:bg-[var(--shell-surface-raised)]/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--shell-accent-ring)] ${focusRingClassName}`;
export const tableBodyRowSelectedClass =
  "bg-[var(--shell-nav-active-bg)]/55 shadow-[inset_3px_0_0_0_var(--shell-accent)]";
export const tableAvatarCellClass = "flex items-center gap-3";
export const tableBadgeStackClass = "flex flex-wrap items-center gap-2";
export const tablePrimaryTextClass = "truncate ds-body font-medium";
export const tableMutedTextClass = "ds-caption";
export const tableMetricTextClass = "ds-body font-semibold";
export const tableActionIconSize = 16;
export const tableMenuItemIconSize = 14;
export const tableActionButtonClass = "max-md:opacity-100";
export const tableMenuItemClass = "gap-2";
export const tableMenuItemDestructiveClass = "gap-2 text-red-400 focus:text-red-400";
export const tableSkeletonRowClass = "h-12";
export const tableSkeletonGapClass = "space-y-2";
export const tableDefaultSkeletonRows = 8;
export const tablePaginationClass = "flex items-center justify-between gap-3";
export const tablePaginationLabelClass = "ds-caption";
export const statusBadgeClass = "uppercase";

/** Legacy row aliases — prefer tableBodyRowClass */
export const tableRowClickableClass = tableBodyRowClass;
export const tableRowClickableAltClass = tableBodyRowClass;

/** Hover-only menus stay visible on touch devices */
export const hoverRevealClass =
  "opacity-0 transition-opacity duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)] group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100";

/** View mode toggle button (legacy alias — prefer toolbarSegmentButtonClass) */
export const viewToggleButtonClass = toolbarSegmentButtonClass;

/** Standard workspace glass shell */
export const workspaceSurfaceClass =
  "ds-workspace-surface overflow-hidden rounded-[var(--ds-radius-workspace)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)]";

/** Inspector sidebar width used across workspaces */
export const inspectorGridClass =
  "ds-motion-layout-adapt grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]";

/** Inspector / ops detail rows */
export const detailRowClass = "flex items-center justify-between gap-3 ds-caption";

export const detailRowValueClass =
  "text-right font-medium text-[var(--shell-text)]";

/** Card shell — padding and radius tokens */
export const cardRadiusClass = "rounded-[var(--ds-radius-card)]";
export const cardPaddingClass = "p-[var(--ds-surface-padding)]";

/** Card header (title, subtitle, action) */
export const cardHeaderClass = "flex items-start justify-between gap-4";
export const cardSubtitleClass = "mt-1.5 ds-caption";
export const cardContentGapClass = "mt-5";
export const cardFooterGapClass = "mt-5";
export const cardBadgeRowClass = "mt-3 flex flex-wrap gap-2";
export const cardDescriptionClass = "mt-3 ds-caption leading-relaxed";
export const cardMetricGridClass = "mt-4 grid grid-cols-2 gap-2";
export const cardListGapClass = "space-y-2";
export const cardListItemClass =
  "rounded-[var(--ds-radius-input)] border border-[var(--shell-border)]/50 bg-[var(--shell-surface-raised)]/60 p-3.5";

/** KPI grid cells */
export const kpiGridClass = "grid gap-1";
export const kpiCellClass = "group px-3 py-3";
export const kpiCellBorderClass = "xl:border-l xl:border-[var(--shell-border)]/45";
export const kpiIconContainerClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.04]";
export const kpiIconSize = 15;
export const kpiMetricGapClass = "mt-2.5";
export const kpiTrendGapClass = "mt-1.5";
export const kpiSparklineGapClass = "mt-2";
export const kpiSkeletonCellClass = "space-y-2 px-2 py-1";

/** Workspace list cards */
export const workspaceCardClass =
  "group rounded-[var(--ds-radius-card)] border border-[var(--shell-border)] bg-[var(--shell-glass)] p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)] backdrop-blur-xl";
export const workspaceCardInteractiveClass =
  "cursor-pointer transition-[border-color,box-shadow,background-color,transform] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)] hover:border-[var(--shell-border-strong)] hover:shadow-[var(--shell-shadow-md)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]";
export const workspaceCardSelectedClass =
  "border-[var(--shell-accent-border)] ring-1 ring-[var(--shell-accent)]/25 shadow-[var(--shell-shadow-md)]";
export const workspaceCardTitleClass = "ds-section-title";
export const workspaceCardCategoryClass =
  "mt-1 ds-overline text-[var(--shell-accent)]";

/** Nested metric cells inside workspace cards */
export const cardMetricCellClass =
  "rounded-[var(--ds-radius-input)] border border-[var(--shell-border)]/45 bg-[var(--shell-surface-raised)]/70 px-3 py-2.5";
export const cardMetricCellLabelClass = "ds-overline";
export const cardMetricCellValueClass =
  "mt-0.5 truncate text-[12px] font-medium text-[var(--shell-text)]";

/** Inspector / settings panels */
export const inspectorPanelClass = cardPaddingClass;
export const inspectorHeaderClass =
  "border-b border-[var(--shell-border)]/25 px-[var(--ds-surface-padding)] py-4";
export const inspectorBodyClass = "p-[var(--ds-surface-padding)]";
export const inspectorFooterClass =
  "border-t border-[var(--shell-border)]/25 p-[var(--ds-surface-padding)]";

/** Empty state inner layout */
export const emptyStateInnerClass =
  "mx-auto flex max-w-md flex-col items-center gap-3 px-6";
export const emptyStateIconClass =
  "flex h-12 w-12 items-center justify-center rounded-[var(--ds-radius-card)] border border-[var(--shell-border)]/40 bg-[var(--shell-surface-raised)]/70 text-[var(--shell-muted)]";
export const emptyStateDescriptionClass =
  "mt-2 max-w-sm ds-caption leading-relaxed";
export const emptyStateCtaGapClass = "mt-5";

/** Form layout and validation */
export const formFieldClass = "space-y-1.5";
export const formStackClass = "space-y-5";
export const formSectionClass = "space-y-4";
export const formLabelClass = shellFormLabelClass;
export const formHelperClass = "ds-caption";
export const formErrorClass = "ds-caption text-red-400";
export const formRequiredMarkClass = "ml-0.5 text-red-400";

/** Checkbox / switch / radio field rows */
export const formCheckboxRowClass = "inline-flex items-center gap-2";
export const formCheckboxLabelClass = "ds-body text-[var(--shell-text)]";
export const formSwitchRowClass = "inline-flex items-center gap-3";
export const formSwitchLabelClass = "ds-body text-[var(--shell-text)]";
export const checkboxRootClass = `peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[var(--shell-border-strong)] bg-[var(--shell-surface-raised)] transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)] data-indeterminate:border-[var(--shell-accent-border)] data-indeterminate:bg-[var(--shell-accent-muted)] disabled:cursor-not-allowed disabled:opacity-50 ${focusRingClassName}`;
export const checkboxIconSize = 12;
export const switchTrackClass = `peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)] disabled:cursor-not-allowed disabled:opacity-50 ${focusRingClassName}`;
export const switchThumbClass =
  "pointer-events-none block size-4 translate-x-0.5 rounded-full bg-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:translate-x-[18px] data-checked:bg-[var(--shell-accent)]";
export const radioRootClass = `flex size-4 items-center justify-center rounded-full border border-[var(--shell-border-strong)] bg-[var(--shell-surface-raised)] transition-[border-color,box-shadow,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] data-checked:border-[var(--shell-accent-border)] data-checked:bg-[var(--shell-accent-muted)] ${focusRingClassName}`;
export const radioLabelClass = "ds-body text-[var(--shell-text)]";

/** Search field */
export const searchFieldIconClass =
  "pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[var(--shell-muted)]/75 transition-colors duration-[var(--ds-duration-fast)] ease-[var(--ds-ease)] group-focus-within:text-[var(--shell-accent)]";
export const searchFieldClearClass = `absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-[var(--ds-radius-sm)] text-[var(--shell-muted)] transition-colors duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] ${focusRingClassName}`;

/** Filter / dropdown selects */
export const filterSelectTriggerClass = toolbarControlClass;
export const dropdownContentClass =
  "rounded-[var(--ds-radius-dropdown)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-1 text-[var(--shell-text)] shadow-[var(--shell-shadow-md)]";
export const dropdownItemClass = `relative flex min-h-[var(--ds-input-height)] cursor-default items-center gap-2 rounded-[var(--ds-radius-button)] px-2.5 text-[13px] outline-none select-none transition-[background-color,color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] focus-visible:bg-[var(--shell-nav-hover-bg)] focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] data-disabled:pointer-events-none data-disabled:opacity-50 sm:min-h-0`;

/** Overlay backdrop — shared by modal and drawer */
export const overlayBackdropClass =
  "ds-motion-modal-backdrop ds-overlay-backdrop fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]";

/** Centered modal shell */
export const modalContentClass =
  "ds-motion-modal-content ds-modal-content fixed left-1/2 top-1/2 z-50 mx-4 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--ds-radius-modal)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-6 shadow-[var(--shell-shadow-lg)] outline-none";
export const modalConfirmContentClass =
  "ds-motion-modal-content ds-modal-content fixed left-1/2 top-1/2 z-50 mx-4 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[var(--ds-radius-modal)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-6 shadow-[var(--shell-shadow-lg)] outline-none";
export const modalHeaderClass = "space-y-1.5";
export const modalFooterClass =
  "mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end";
export const modalTitleClass = "ds-section-title text-[15px]";
export const modalDescriptionClass =
  "mt-2 text-[13px] leading-relaxed text-[var(--shell-muted)]";

/** Drawer shells */
export const drawerContentBaseClass =
  "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-[var(--shell-border)] bg-[var(--shell-surface-raised)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shell-shadow-lg)] outline-none";
export const drawerFormContentClass = `${drawerContentBaseClass} ds-motion-form-drawer max-w-lg`;
export const drawerInspectorContentClass = `${drawerContentBaseClass} ds-motion-inspector-panel ds-inspector-drawer gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 max-w-xl`;

/** Drawer header, body, footer */
export const drawerHeaderClass =
  "border-b border-[var(--shell-border)]/50 px-6 py-5 pr-14";
export const drawerTitleClass =
  "text-left text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]";
export const drawerSubtitleClass =
  "mt-1 text-left text-[13px] text-[var(--shell-muted)]";
export const drawerBadgeRowClass = "mt-3 flex flex-wrap items-center gap-2";
export const drawerFormBodyClass = "flex-1 overflow-y-auto px-6 py-5";
export const drawerInspectorBodyClass = "flex-1 px-6 py-5";
export const drawerFooterClass =
  "border-t border-[var(--shell-border)]/50 px-6 py-4";
export const drawerFooterActionsClass = "flex flex-wrap gap-2";
export const drawerCloseButtonClass = `absolute right-3 top-3 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 ${focusRingClassName}`;
export const overlayDangerButtonClass =
  "h-[var(--ds-input-height)] gap-2 text-red-400 hover:bg-red-500/10";
export const overlayFormActionsClass =
  "flex justify-end gap-2 pt-2";
