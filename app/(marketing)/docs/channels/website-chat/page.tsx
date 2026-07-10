import { DocsArticlePage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { DOCS_WEBSITE_CHAT } from "@/lib/marketing/docs";
import { buildDocsJsonLd } from "@/lib/marketing/jsonld";
import { generateDocsMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateDocsMetadata(DOCS_WEBSITE_CHAT);
}

export default function DocsWebsiteChatRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildDocsJsonLd({
          title: DOCS_WEBSITE_CHAT.title,
          description: DOCS_WEBSITE_CHAT.description,
          path: DOCS_WEBSITE_CHAT.path,
        })}
      />
      <DocsArticlePage article={DOCS_WEBSITE_CHAT} />
    </>
  );
}
