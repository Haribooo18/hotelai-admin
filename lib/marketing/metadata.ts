import type { Metadata } from "next";

import type { DocsArticle } from "@/lib/marketing/docs";
import {
  getCanonicalUrl,
  MARKETING_CANONICAL_ORIGIN,
  MARKETING_SEO_PAGES,
  type MarketingSeoPage,
  type MarketingSeoPageId,
} from "@/lib/marketing/seo";
import { SITE_NAME } from "@/lib/marketing/site";

export type MarketingMetadataInput = {
  path: string;
  title: string;
  description: string;
};

function buildMarketingMetadata({
  path,
  title,
  description,
}: MarketingMetadataInput): Metadata {
  const canonical = getCanonicalUrl(path);
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateMarketingMetadata(pageId: MarketingSeoPageId): Metadata {
  return buildMarketingMetadata(MARKETING_SEO_PAGES[pageId]);
}

export function generateDocsMetadata(article: Pick<DocsArticle, "path" | "title" | "description">): Metadata {
  return buildMarketingMetadata({
    path: article.path,
    title: article.title,
    description: article.description,
  });
}

export function generateCustomMarketingMetadata(page: MarketingSeoPage): Metadata {
  return buildMarketingMetadata(page);
}

export const marketingMetadata: Metadata = {
  metadataBase: new URL(MARKETING_CANONICAL_ORIGIN),
  title: {
    default: MARKETING_SEO_PAGES.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: MARKETING_SEO_PAGES.home.description,
  alternates: {
    canonical: getCanonicalUrl("/"),
    languages: {
      "en-US": getCanonicalUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getCanonicalUrl("/"),
    siteName: SITE_NAME,
    title: MARKETING_SEO_PAGES.home.title,
    description: MARKETING_SEO_PAGES.home.description,
  },
  twitter: {
    card: "summary_large_image",
    title: MARKETING_SEO_PAGES.home.title,
    description: MARKETING_SEO_PAGES.home.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};
