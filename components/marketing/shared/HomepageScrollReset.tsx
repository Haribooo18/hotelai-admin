"use client";

import { useLayoutEffect } from "react";

import { resetHomepageScrollOnReload } from "@/lib/marketing/product-reload-reset";

/**
 * Renders nothing — exists purely to correct a full-page reload of the
 * homepage.
 *
 * The browser's own scroll-restoration feature (`history.scrollRestoration`)
 * remembers and reapplies the scroll position from the previous session
 * history entry on reload, independently of the URL hash. That happens
 * outside of Next.js's hash-scroll handling, so a reload can still land the
 * page near the Product Showcase even after the hash itself is corrected.
 *
 * Only ever acts on a genuine reload (never the initial visit, a Product
 * link click, cross-page navigation, or browser back/forward) — see
 * `resetHomepageScrollOnReload` in `lib/marketing/product-reload-reset.ts`
 * for the actual (unit-tested) logic.
 */
export function HomepageScrollReset() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    return resetHomepageScrollOnReload(window);
  }, []);

  return null;
}
