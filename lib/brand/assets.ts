/**
 * Centralized Monavel brand asset paths.
 * Official SVG sources of truth under `public/brand/`.
 * Do not invent, edit, or recreate these files.
 */

export const BRAND_ASSET_DIR = "/brand" as const;

export const BRAND_ASSETS = {
  /** Symbol / mark only */
  mark: `${BRAND_ASSET_DIR}/monavel-mark.svg`,
  /** Horizontal lockup — navigation, footer, docs, auth, product chrome */
  horizontal: `${BRAND_ASSET_DIR}/monavel-horizontal.svg`,
  /** Stacked master lockup — large identity, presentations, brand surfaces */
  lockup: `${BRAND_ASSET_DIR}/monavel-lockup.svg`,
  /** Wordmark only — use only when the symbol already exists separately */
  wordmark: `${BRAND_ASSET_DIR}/monavel-wordmark.svg`,
} as const;

/** Filenames expected under `public/brand/`. */
export const BRAND_ASSET_FILENAMES = [
  "monavel-mark.svg",
  "monavel-horizontal.svg",
  "monavel-lockup.svg",
  "monavel-wordmark.svg",
] as const;

export type BrandAssetId = keyof typeof BRAND_ASSETS;
