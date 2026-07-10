import { SITE_NAME } from "@/lib/marketing/site";

export const MARKETING_CANONICAL_ORIGIN = "https://monavel.app" as const;

export type MarketingSeoPageId =
  | "home"
  | "features"
  | "ai"
  | "pricing"
  | "contact"
  | "demo"
  | "security"
  | "integrations"
  | "about"
  | "docs"
  | "privacy"
  | "terms";

export type MarketingSeoPage = {
  id: MarketingSeoPageId;
  path: string;
  title: string;
  description: string;
};

export const MARKETING_SEO_PAGES: Record<MarketingSeoPageId, MarketingSeoPage> = {
  home: {
    id: "home",
    path: "/",
    title: `${SITE_NAME} — AI Operating System for Hotels`,
    description:
      "Monavel combines PMS, AI reception, guest channels, and hotel operations in one connected workspace for modern hotels.",
  },
  features: {
    id: "features",
    path: "/features",
    title: "Features",
    description:
      "Monavel platform overview: PMS, AI reception, guest channels, revenue, knowledge, and connected hotel workspaces.",
  },
  ai: {
    id: "ai",
    path: "/ai",
    title: "AI",
    description:
      "How Monavel AI works: contextual guest communication, knowledge-backed replies, and human escalation for hotel teams.",
  },
  pricing: {
    id: "pricing",
    path: "/pricing",
    title: "Pricing",
    description:
      "Monavel pricing for independent hotels, growing properties, and hotel groups. Starter, Pro, and Enterprise plans with free trial options.",
  },
  contact: {
    id: "contact",
    path: "/contact",
    title: "Contact",
    description:
      "Contact Monavel about demos, sales, partnerships, and general inquiries.",
  },
  demo: {
    id: "demo",
    path: "/demo",
    title: "Demo",
    description:
      "Book a personalized Monavel demo — see hotel operations, AI reception, revenue, and administration in action.",
  },
  security: {
    id: "security",
    path: "/security",
    title: "Security",
    description:
      "How Monavel approaches security, tenant isolation, access control, and platform infrastructure for hotel workspaces.",
  },
  integrations: {
    id: "integrations",
    path: "/integrations",
    title: "Integrations",
    description:
      "Connect guest channels with Monavel — Website Chat, Telegram, Knowledge Base, and planned integrations for hotels.",
  },
  about: {
    id: "about",
    path: "/about",
    title: "About",
    description:
      "Learn about Monavel — the mission, vision, and principles behind the hotel operating system.",
  },
  docs: {
    id: "docs",
    path: "/docs",
    title: "Documentation",
    description:
      "Essential Monavel guides for trial users — setup, guest channels, knowledge base, and billing.",
  },
  privacy: {
    id: "privacy",
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "How Monavel collects, uses, and stores information when hotels use the platform.",
  },
  terms: {
    id: "terms",
    path: "/terms",
    title: "Terms of Service",
    description:
      "Terms governing access to and use of the Monavel hotel operations platform.",
  },
};

export const MARKETING_SEO_SITEMAP_PATHS = [
  "",
  "/features",
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

export const ROBOTS_DISALLOW_PATHS = [
  "/dashboard",
  "/bookings",
  "/rooms",
  "/guests",
  "/calendar",
  "/knowledge",
  "/settings",
  "/rates",
  "/reception-ai",
  "/login",
  "/auth",
  "/api/",
] as const;

export function getCanonicalUrl(path: string): string {
  if (path === "/" || path === "") {
    return MARKETING_CANONICAL_ORIGIN;
  }

  return `${MARKETING_CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getMarketingSeoPage(path: string): MarketingSeoPage | undefined {
  return Object.values(MARKETING_SEO_PAGES).find((page) => page.path === path);
}
