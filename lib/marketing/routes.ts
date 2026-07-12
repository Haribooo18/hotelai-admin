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
  "/blog",
  "/docs",
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
  "/blog",
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

export function isMarketingPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;

  return MARKETING_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
