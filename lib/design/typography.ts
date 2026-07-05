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
    className:
      "text-[var(--type-body-size)] font-[var(--type-body-weight)] leading-[var(--type-body-leading)] tracking-[var(--type-body-tracking)] text-[var(--shell-text)]",
  },
  caption: {
    size: "var(--type-caption-size)",
    weight: "var(--type-caption-weight)",
    lineHeight: "var(--type-caption-leading)",
    letterSpacing: "var(--type-caption-tracking)",
    className:
      "text-[var(--type-caption-size)] font-[var(--type-caption-weight)] leading-[var(--type-caption-leading)] tracking-[var(--type-caption-tracking)] text-[var(--shell-muted)]",
  },
  overline: {
    size: "var(--type-label-size)",
    weight: "var(--type-label-weight)",
    lineHeight: "var(--type-label-leading)",
    letterSpacing: "var(--type-label-tracking)",
    className:
      "text-[var(--type-label-size)] font-[var(--type-label-weight)] uppercase leading-[var(--type-label-leading)] tracking-[var(--type-label-tracking)] text-[var(--shell-muted)]",
  },
  kpi: {
    size: "var(--type-kpi-size)",
    weight: "var(--type-kpi-weight)",
    lineHeight: "var(--type-kpi-leading)",
    letterSpacing: "var(--type-kpi-tracking)",
    className:
      "text-[var(--type-kpi-size)] font-[var(--type-kpi-weight)] leading-[var(--type-kpi-leading)] tracking-[var(--type-kpi-tracking)] text-[var(--shell-text)]",
  },
} as const;

export type TypographyVariant = keyof typeof typographyScale;

export function typographyClass(variant: TypographyVariant): string {
  return typographyScale[variant].className;
}

/** @deprecated Use typographyScale.heading — kept for dashboard compatibility */
export const sectionTitleClass = typographyScale.heading.className;
