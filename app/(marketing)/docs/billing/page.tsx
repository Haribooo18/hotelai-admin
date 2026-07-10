import { DocsArticlePage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_BILLING } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateDocsMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateDocsMetadata(DOCS_BILLING);
}

export default function DocsBillingRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_BILLING.title,
          description: DOCS_BILLING.description,
          path: DOCS_BILLING.path,
        })}
      />
      <DocsArticlePage article={DOCS_BILLING} />
    </>
  );
}
