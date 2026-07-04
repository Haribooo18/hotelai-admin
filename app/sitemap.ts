import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/marketing/site";

const PUBLIC_ROUTES = [
  "",
  "/features",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
