import { MARKETING_PRODUCT_SECTION_ID } from "@/lib/marketing/routes";

/**
 * `next/script` id for the homepage reload-reset script (see
 * `buildProductReloadResetScript`). Rendered once from the root layout.
 */
export const PRODUCT_RELOAD_RESET_SCRIPT_ID = "marketing-product-reload-reset";

export const MARKETING_PRODUCT_HASH = `#${MARKETING_PRODUCT_SECTION_ID}`;

export type NavigationEntryLike = {
  type?: string;
};

export type PerformanceLike = {
  getEntriesByType?: (type: string) => readonly unknown[];
};

/**
 * Reads the current navigation's type (`"navigate"`, `"reload"`,
 * `"back_forward"`, `"prerender"`) from the Navigation Timing API. Accepts
 * the `performance` object as a parameter (rather than reading a global)
 * so this stays a pure, unit-testable function.
 */
export function getNavigationType(
  performanceLike: PerformanceLike | undefined
): string | undefined {
  try {
    const entries = performanceLike?.getEntriesByType?.("navigation") ?? [];
    const [firstEntry] = entries as readonly NavigationEntryLike[];
    return firstEntry?.type;
  } catch {
    return undefined;
  }
}

/**
 * True only for a genuine full-page reload — never for the initial visit,
 * client-side navigation, or browser back/forward.
 */
export function isReloadNavigation(
  performanceLike: PerformanceLike | undefined
): boolean {
  return getNavigationType(performanceLike) === "reload";
}

type ReloadResetInput = {
  pathname: string;
  hash: string;
  navigationType: string | undefined;
};

/**
 * Pure predicate mirroring the inline `beforeInteractive` script produced by
 * `buildProductReloadResetScript`. Kept as a standalone, browser-free
 * function so the reload-detection rule is unit-testable.
 *
 * A hard reload of `/#product` should land at the top of the homepage
 * instead of jumping straight to the Product Showcase. Every other
 * navigation (Link clicks, cross-page navigation, browser back/forward)
 * must leave the hash untouched.
 */
export function shouldResetProductHashOnReload({
  pathname,
  hash,
  navigationType,
}: ReloadResetInput): boolean {
  return (
    pathname === "/" &&
    hash === MARKETING_PRODUCT_HASH &&
    navigationType === "reload"
  );
}

export type ScrollResetWindowLike = {
  performance: PerformanceLike | undefined;
  location: { hash: string };
  history: {
    scrollRestoration: "auto" | "manual";
    replaceState: (data: unknown, unused: string, url?: string | null) => void;
  };
  scrollTo: (options: {
    top?: number;
    left?: number;
    behavior?: "auto" | "instant" | "smooth";
  }) => void;
  requestAnimationFrame: (callback: (time: number) => void) => number;
  cancelAnimationFrame: (handle: number) => void;
  setTimeout: (callback: () => void, delay?: number) => number;
  clearTimeout: (handle: number) => void;
};

/**
 * Corrects the browser's native scroll-restoration on a genuine homepage
 * reload. `history.scrollRestoration` remembers and reapplies the previous
 * session-history scroll position independently of the URL hash, so a
 * reload can still land near the Product Showcase even after the hash
 * itself has been normalized.
 *
 * Takes the `window`-shaped dependencies as a parameter (rather than
 * reading globals) so the whole reset can be unit-tested without a DOM.
 * Returns a cleanup function when it acted, or `undefined` when it was a
 * no-op (i.e. not a reload) — mirrors a `useEffect`/`useLayoutEffect`
 * return value.
 */
export function resetHomepageScrollOnReload(
  windowLike: ScrollResetWindowLike
): (() => void) | undefined {
  if (!isReloadNavigation(windowLike.performance)) return undefined;

  const previousScrollRestoration = windowLike.history.scrollRestoration;
  windowLike.history.scrollRestoration = "manual";

  if (windowLike.location.hash === MARKETING_PRODUCT_HASH) {
    windowLike.history.replaceState(null, "", "/");
  }

  const reset = () => {
    windowLike.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  reset();
  const frame = windowLike.requestAnimationFrame(reset);
  const timeout = windowLike.setTimeout(reset, 0);

  return () => {
    windowLike.cancelAnimationFrame(frame);
    windowLike.clearTimeout(timeout);
    windowLike.history.scrollRestoration = previousScrollRestoration;
  };
}

/**
 * Builds the inline script that runs before hydration and before the
 * browser's native scroll-to-fragment step, so the visible "jump to Product
 * then back to top" never happens.
 *
 * Only acts on a genuine full-page reload (detected via the Navigation
 * Timing API) of the homepage while the hash is exactly `#product`. Every
 * other navigation type (`navigate`, `back_forward`, `prerender`) is a
 * no-op, so normal Product link clicks and browser back/forward keep the
 * hash working.
 */
export function buildProductReloadResetScript(): string {
  const homePath = JSON.stringify("/");
  const productHash = JSON.stringify(MARKETING_PRODUCT_HASH);

  return `(function(){try{if(window.location.pathname!==${homePath}||window.location.hash!==${productHash}){return;}var entries=window.performance&&window.performance.getEntriesByType?window.performance.getEntriesByType("navigation"):[];var navType=entries&&entries[0]?entries[0].type:undefined;if(navType!=="reload"){return;}window.history.replaceState(null,"","/");window.scrollTo({top:0,left:0,behavior:"auto"});}catch(e){}})();`;
}
