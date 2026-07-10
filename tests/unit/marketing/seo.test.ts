import { describe, expect, it } from "vitest";

import {
  buildAboutJsonLd,
  buildContactJsonLd,
  buildDocsJsonLd,
  buildHomeJsonLd,
  buildPricingJsonLd,
  buildWebPageJsonLd,
} from "@/lib/marketing/jsonld";
import {
  generateDocsMetadata,
  generateMarketingMetadata,
} from "@/lib/marketing/metadata";
import { DOCS_GETTING_STARTED } from "@/lib/marketing/docs";
import {
  getCanonicalUrl,
  MARKETING_CANONICAL_ORIGIN,
  MARKETING_SEO_PAGES,
  MARKETING_SEO_SITEMAP_PATHS,
  ROBOTS_DISALLOW_PATHS,
} from "@/lib/marketing/seo";

describe("marketing seo", () => {
  it("uses monavel.app as canonical origin", () => {
    expect(MARKETING_CANONICAL_ORIGIN).toBe("https://monavel.app");
    expect(getCanonicalUrl("/pricing")).toBe("https://monavel.app/pricing");
    expect(getCanonicalUrl("/")).toBe("https://monavel.app");
  });

  it("defines metadata for all marketing pages", () => {
    for (const page of Object.values(MARKETING_SEO_PAGES)) {
      const metadata = generateMarketingMetadata(page.id);
      expect(metadata.description).toBe(page.description);
      expect(metadata.alternates?.canonical).toBe(getCanonicalUrl(page.path));
      expect(metadata.openGraph?.title).toBeTruthy();
      expect(metadata.openGraph?.description).toBe(page.description);
      expect(metadata.openGraph?.url).toBe(getCanonicalUrl(page.path));
      expect(metadata.twitter?.title).toBeTruthy();
      expect(metadata.twitter?.description).toBe(page.description);
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.alternates?.languages?.["en-US"]).toBe(
        getCanonicalUrl(page.path)
      );
    }
  });

  it("uses absolute title for home metadata", () => {
    const metadata = generateMarketingMetadata("home");
    expect(metadata.title).toEqual({
      absolute: MARKETING_SEO_PAGES.home.title,
    });
  });

  it("generates docs article metadata", () => {
    const metadata = generateDocsMetadata(DOCS_GETTING_STARTED);
    expect(metadata.alternates?.canonical).toBe(
      "https://monavel.app/docs/getting-started"
    );
    expect(metadata.description).toBe(DOCS_GETTING_STARTED.description);
  });

  it("includes every public marketing page in sitemap paths", () => {
    expect(MARKETING_SEO_SITEMAP_PATHS).toContain("");
    expect(MARKETING_SEO_SITEMAP_PATHS).toContain("/ai");
    expect(MARKETING_SEO_SITEMAP_PATHS).toContain("/docs/getting-started");
    expect(MARKETING_SEO_SITEMAP_PATHS).toContain("/privacy");
    expect(MARKETING_SEO_SITEMAP_PATHS).not.toContain("/login");
    expect(MARKETING_SEO_SITEMAP_PATHS).not.toContain("/dashboard");
  });

  it("disallows authenticated routes in robots config", () => {
    expect(ROBOTS_DISALLOW_PATHS).toContain("/login");
    expect(ROBOTS_DISALLOW_PATHS).toContain("/dashboard");
    expect(ROBOTS_DISALLOW_PATHS).not.toContain("/ai");
    expect(ROBOTS_DISALLOW_PATHS).not.toContain("/features");
  });
});

describe("marketing jsonld", () => {
  it("builds home schemas without ratings", () => {
    const schemas = buildHomeJsonLd();
    expect(schemas).toHaveLength(3);
    expect(schemas.map((schema) => schema["@type"])).toEqual([
      "Organization",
      "SoftwareApplication",
      "WebSite",
    ]);
    expect(JSON.stringify(schemas)).not.toMatch(/aggregateRating|reviewCount/);
  });

  it("builds pricing product offers from published plans", () => {
    const schemas = buildPricingJsonLd();
    expect(schemas[0]?.["@type"]).toBe("Product");
    const offers = schemas[0]?.offers as Array<Record<string, unknown>>;
    expect(offers).toHaveLength(2);
    expect(offers.map((offer) => offer.name)).toEqual(["Starter", "Pro"]);
  });

  it("builds page-specific schemas", () => {
    expect(buildAboutJsonLd()[0]?.["@type"]).toBe("Organization");
    expect(buildContactJsonLd()[0]?.["@type"]).toBe("ContactPage");
    expect(
      buildDocsJsonLd({
        title: "Getting Started",
        description: "Trial setup path.",
        path: "/docs/getting-started",
      })[0]?.["@type"]
    ).toBe("TechArticle");
    expect(
      buildWebPageJsonLd({
        title: "Privacy Policy",
        description: "Privacy policy.",
        path: "/privacy",
      })[0]?.["@type"]
    ).toBe("WebPage");
  });
});
