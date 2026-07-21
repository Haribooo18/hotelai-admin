import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  id: string;
  title: string;
  links: readonly FooterLink[];
};

export const FOOTER_BRAND = {
  name: "Monavel",
} as const;

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "platform",
    title: "Platform",
    links: [
      { href: MARKETING_PRODUCT_HREF, label: "Runtime" },
      { href: "/ai", label: "AI Reception" },
      { href: MARKETING_PRODUCT_HREF, label: "Operations" },
      { href: "/integrations", label: "Integrations" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export const FOOTER_BOTTOM = {
  signature: "© Monavel — AI Operating System for Hotels",
} as const;
