import type { MetadataRoute } from "next";

import {
  MARKETING_CANONICAL_ORIGIN,
  ROBOTS_DISALLOW_PATHS,
} from "@/lib/marketing/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...ROBOTS_DISALLOW_PATHS],
    },
    sitemap: `${MARKETING_CANONICAL_ORIGIN}/sitemap.xml`,
    host: MARKETING_CANONICAL_ORIGIN,
  };
}
