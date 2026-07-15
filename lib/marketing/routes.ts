/**
 * Public marketing routes — single source for auth guards, sitemap, and nav.
 */

export const MARKETING_PUBLIC_PATHS = [
  "/login",
  "/auth",
  "/ai",
  "/pricing",
  "/contact",
  "/security",
  "/integrations",
  "/privacy",
  "/terms",
  "/demo",
  "/about",
  "/docs",
  "/brand",
  "/api/channels/telegram/webhook",
  "/api/channels/website/stream",
  "/api/billing/webhook",
] as const;

export const MARKETING_SITEMAP_PATHS = [
  "",
  "/ai",
  "/pricing",
  "/contact",
  "/security",
  "/integrations",
  "/demo",
  "/about",
  "/docs",
  "/docs/getting-started",
  "/docs/channels/telegram",
  "/docs/channels/website-chat",
  "/docs/knowledge-base",
  "/docs/billing",
  "/privacy",
  "/terms",
] as const;

export const MARKETING_CTA = {
  trial: "/login?intent=trial",
  demo: "/demo",
  signIn: "/login",
} as const;

/**
 * Canonical Product section anchor. Single source of truth so every nav
 * entry (desktop, mobile, footer) points at the exact same destination —
 * never built from the current URL/hash at click time.
 */
export const MARKETING_PRODUCT_SECTION_ID = "product";
export const MARKETING_PRODUCT_HREF = `/#${MARKETING_PRODUCT_SECTION_ID}`;

export function isMarketingPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;

  return MARKETING_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
