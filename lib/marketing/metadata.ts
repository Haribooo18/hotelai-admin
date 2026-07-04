import type { Metadata } from "next";

import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/marketing/site";

const siteUrl = getSiteUrl();

export const marketingMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — AI-ресепшн для отелей`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI-ресепшн для отелей`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI-ресепшн для отелей`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};
