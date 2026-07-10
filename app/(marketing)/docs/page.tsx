import { DocsLandingPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_LANDING } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("docs");
}

export default function DocsRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_LANDING.title,
          description: DOCS_LANDING.description,
          path: DOCS_LANDING.path,
        })}
      />
      <DocsLandingPage />
    </>
  );
}
