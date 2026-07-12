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
  tagline: "The AI Operating System for Modern Hotels.",
} as const;

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "product",
    title: "Product",
    links: [
      { href: "/#product", label: "Product" },
      { href: "/ai", label: "AI" },
      { href: "/pricing", label: "Pricing" },
      { href: "/integrations", label: "Integrations" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/demo", label: "Demo" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/login", label: "Login" },
    ],
  },
];

export const FOOTER_BOTTOM = {
  copyright: "© Monavel",
  tagline: "Built for modern hotels.",
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;
