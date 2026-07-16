/**
 * Monavel typography scale — pairs with `.ds-*` utilities in `app/globals.css`.
 */

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typographyScale = {
  display: {
    size: "var(--type-display-size)",
    weight: "var(--type-display-weight)",
    lineHeight: "var(--type-display-leading)",
    letterSpacing: "var(--type-display-tracking)",
    className: "ds-display",
  },
  heading: {
    size: "var(--type-heading-size)",
    weight: "var(--type-heading-weight)",
    lineHeight: "var(--type-heading-leading)",
    letterSpacing: "var(--type-heading-tracking)",
    className: "ds-section-title",
  },
  title: {
    size: "var(--type-title-size)",
    weight: "var(--type-title-weight)",
    lineHeight: "var(--type-title-leading)",
    letterSpacing: "var(--type-title-tracking)",
    className: "ds-page-title",
  },
  body: {
    size: "var(--type-body-size)",
    weight: "var(--type-body-weight)",
    lineHeight: "var(--type-body-leading)",
    letterSpacing: "var(--type-body-tracking)",
    className: "ds-body",
  },
  caption: {
    size: "var(--type-caption-size)",
    weight: "var(--type-caption-weight)",
    lineHeight: "var(--type-caption-leading)",
    letterSpacing: "var(--type-caption-tracking)",
    className: "ds-caption",
  },
  overline: {
    size: "var(--type-label-size)",
    weight: "var(--type-label-weight)",
    lineHeight: "var(--type-label-leading)",
    letterSpacing: "var(--type-label-tracking)",
    className: "ds-overline",
  },
  kpi: {
    size: "var(--type-kpi-size)",
    weight: "var(--type-kpi-weight)",
    lineHeight: "var(--type-kpi-leading)",
    letterSpacing: "var(--type-kpi-tracking)",
    className: "ds-kpi",
  },
} as const;

export type TypographyVariant = keyof typeof typographyScale;

export function typographyClass(variant: TypographyVariant): string {
  return typographyScale[variant].className;
}

/** Semantic typography roles — map to the scale above (no new sizes). */
export const typographyRoles = {
  pageTitle: typographyScale.display.className,
  sectionTitle: typographyScale.heading.className,
  cardTitle: typographyScale.heading.className,
  cardDescription: typographyScale.caption.className,
  body: typographyScale.body.className,
  caption: typographyScale.caption.className,
  overline: typographyScale.overline.className,
  kpiLabel: typographyScale.overline.className,
  kpiValue: typographyScale.kpi.className,
  tableHeader: "ds-table-header",
  tableCell: typographyScale.body.className,
  badge: "ds-badge-text",
  button: "ds-button-text",
  formLabel: "ds-form-label",
  trend: "ds-caption font-medium",
} as const;

/** @deprecated Use typographyScale.heading — kept for dashboard compatibility */
export const sectionTitleClass = typographyScale.heading.className;
