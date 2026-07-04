export const SITE_NAME = "Monavel";
export const SITE_DESCRIPTION =
  "AI-ресепшн для отелей: автоматизация гостевых диалогов через Telegram, Website Chat и единую панель администратора.";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const MARKETING_NAV = [
  { href: "/features", label: "Возможности" },
  { href: "/pricing", label: "Тарифы" },
  { href: "/contact", label: "Контакты" },
] as const;
