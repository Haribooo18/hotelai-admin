import { LEGAL_CONTACT_EMAIL } from "@/lib/marketing/legal";
import {
  getCanonicalUrl,
  MARKETING_CANONICAL_ORIGIN,
  MARKETING_SEO_PAGES,
} from "@/lib/marketing/seo";
import { SITE_NAME } from "@/lib/marketing/site";

const JSON_LD_CONTEXT = "https://schema.org";

export type JsonLdNode = Record<string, unknown>;

function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: MARKETING_CANONICAL_ORIGIN,
    email: LEGAL_CONTACT_EMAIL,
  };
}

export function buildHomeJsonLd(): JsonLdNode[] {
  const home = MARKETING_SEO_PAGES.home;

  return [
    {
      "@context": JSON_LD_CONTEXT,
      ...organizationNode(),
    },
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: getCanonicalUrl(home.path),
      description: home.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Free trial available on select plans",
        url: getCanonicalUrl("/pricing"),
      },
    },
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "WebSite",
      name: SITE_NAME,
      url: MARKETING_CANONICAL_ORIGIN,
      description: home.description,
    },
  ];
}

export function buildPricingJsonLd(): JsonLdNode[] {
  const pricing = MARKETING_SEO_PAGES.pricing;

  return [
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "WebPage",
      name: pricing.title,
      description: pricing.description,
      url: getCanonicalUrl(pricing.path),
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: MARKETING_CANONICAL_ORIGIN,
      },
    },
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "Product",
      name: SITE_NAME,
      description: pricing.description,
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "49",
          priceCurrency: "EUR",
          url: getCanonicalUrl(pricing.path),
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "149",
          priceCurrency: "EUR",
          url: getCanonicalUrl(pricing.path),
        },
      ],
    },
  ];
}

export function buildAboutJsonLd(): JsonLdNode[] {
  return [
    {
      "@context": JSON_LD_CONTEXT,
      ...organizationNode(),
      description: MARKETING_SEO_PAGES.about.description,
    },
  ];
}

export function buildContactJsonLd(): JsonLdNode[] {
  const contact = MARKETING_SEO_PAGES.contact;

  return [
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "ContactPage",
      name: contact.title,
      description: contact.description,
      url: getCanonicalUrl(contact.path),
      mainEntity: organizationNode(),
    },
  ];
}

export function buildDocsJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLdNode[] {
  return [
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "TechArticle",
      headline: title,
      description,
      url: getCanonicalUrl(path),
      author: organizationNode(),
      publisher: organizationNode(),
    },
  ];
}

export function buildWebPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLdNode[] {
  return [
    {
      "@context": JSON_LD_CONTEXT,
      "@type": "WebPage",
      name: title,
      description,
      url: getCanonicalUrl(path),
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: MARKETING_CANONICAL_ORIGIN,
      },
    },
  ];
}
