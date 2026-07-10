import { DocsArticlePage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_TELEGRAM } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateDocsMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateDocsMetadata(DOCS_TELEGRAM);
}

export default function DocsTelegramRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_TELEGRAM.title,
          description: DOCS_TELEGRAM.description,
          path: DOCS_TELEGRAM.path,
        })}
      />
      <DocsArticlePage article={DOCS_TELEGRAM} />
    </>
  );
}
