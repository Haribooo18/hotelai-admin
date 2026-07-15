import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

export const SITE_NAME = "Monavel";
export const SITE_DESCRIPTION =
  "Monavel is the AI operating system for hotels — reservations, guest communication, operations, and AI reception in one connected workspace.";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const MARKETING_NAV = [
  { href: MARKETING_PRODUCT_HREF, label: "Product" },
  { href: "/ai", label: "AI" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
] as const;

export const SITE_TAGLINE = "The operating system for modern hotels";