import { DocsArticlePage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_GETTING_STARTED } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateDocsMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateDocsMetadata(DOCS_GETTING_STARTED);
}

export default function DocsGettingStartedRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_GETTING_STARTED.title,
          description: DOCS_GETTING_STARTED.description,
          path: DOCS_GETTING_STARTED.path,
        })}
      />
      <DocsArticlePage article={DOCS_GETTING_STARTED} />
    </>
  );
}
