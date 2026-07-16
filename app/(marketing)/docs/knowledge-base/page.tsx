import { DocsArticlePage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_KNOWLEDGE_BASE } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateDocsMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateDocsMetadata(DOCS_KNOWLEDGE_BASE);
}

export default function DocsKnowledgeBaseRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_KNOWLEDGE_BASE.title,
          description: DOCS_KNOWLEDGE_BASE.description,
          path: DOCS_KNOWLEDGE_BASE.path,
        })}
      />
      <DocsArticlePage article={DOCS_KNOWLEDGE_BASE} />
    </>
  );
}
