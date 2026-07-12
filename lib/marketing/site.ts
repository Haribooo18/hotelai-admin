export const SITE_NAME = "Monavel";
export const SITE_DESCRIPTION =
  "AI reception for hotels: automate guest conversations via Telegram, Website Chat, and a unified admin panel.";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const MARKETING_NAV = [
  { href: "/#product", label: "Product" },
  { href: "/ai", label: "AI" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
] as const;

export const SITE_TAGLINE = "The operating system for modern hotels";
