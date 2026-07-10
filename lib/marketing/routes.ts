/**
 * Public marketing routes — single source for auth guards, sitemap, and nav.
 */

export const MARKETING_PUBLIC_PATHS = [
  "/login",
  "/auth",
  "/ai",
  "/features",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
  "/demo",
  "/api/channels/telegram/webhook",
  "/api/channels/website/stream",
  "/api/billing/webhook",
] as const;

export const MARKETING_SITEMAP_PATHS = [
  "",
  "/features",
  "/ai",
  "/pricing",
  "/contact",
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
