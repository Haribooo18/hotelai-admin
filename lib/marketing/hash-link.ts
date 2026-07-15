/**
 * Pure helpers for same-page hash anchors (e.g. `/#product`).
 *
 * These never read the current URL/hash — they only ever parse the static
 * `href` a link was authored with — so callers can never accidentally build
 * a destination on top of whatever hash is already in the address bar.
 */

export type ParsedHashHref = {
  path: string;
  id: string;
};

/** Detects a URL string that already contains more than one `#`. */
const DUPLICATE_HASH_PATTERN = /#.*#/;

export function parseHashHref(href: string): ParsedHashHref | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;

  return {
    path: href.slice(0, hashIndex) || "/",
    id: href.slice(hashIndex + 1),
  };
}

export function hasDuplicateHash(href: string): boolean {
  return DUPLICATE_HASH_PATTERN.test(href);
}
