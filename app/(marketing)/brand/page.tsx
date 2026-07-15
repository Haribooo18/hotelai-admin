import type { Metadata } from "next";

import { BrandBookPage } from "@/components/marketing/brand/BrandBookPage";
import { BRAND_BOOK } from "@/lib/marketing/brand-book";
import { getCanonicalUrl } from "@/lib/marketing/seo";
import { SITE_NAME } from "@/lib/marketing/site";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const canonical = getCanonicalUrl(BRAND_BOOK.path);
  const title = `${BRAND_BOOK.title} — ${BRAND_BOOK.subtitle}`;

  return {
    title,
    description: BRAND_BOOK.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description: BRAND_BOOK.description,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function BrandBookRoutePage() {
  return <BrandBookPage />;
}
