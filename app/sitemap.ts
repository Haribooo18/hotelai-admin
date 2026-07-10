import type { MetadataRoute } from "next";

import { MARKETING_SITEMAP_PATHS } from "@/lib/marketing/routes";
import { getSiteUrl } from "@/lib/marketing/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return MARKETING_SITEMAP_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
