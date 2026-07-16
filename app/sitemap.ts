import type { MetadataRoute } from "next";

import { MARKETING_SITEMAP_PATHS } from "@/lib/marketing/routes";
import { getCanonicalUrl } from "@/lib/marketing/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return MARKETING_SITEMAP_PATHS.map((path) => ({
    url: getCanonicalUrl(path),
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/docs/") ? 0.6 : 0.8,
  }));
}
