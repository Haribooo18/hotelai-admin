import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/marketing/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/bookings", "/rooms", "/guests", "/calendar", "/ai", "/knowledge", "/settings", "/login", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
