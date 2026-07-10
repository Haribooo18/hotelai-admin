import { LegalPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildWebPageJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";
import { TERMS_OF_SERVICE } from "@/lib/marketing/legal";

export function generateMetadata() {
  return generateMarketingMetadata("terms");
}

export default function TermsRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildWebPageJsonLd({
          title: TERMS_OF_SERVICE.title,
          description: TERMS_OF_SERVICE.description,
          path: TERMS_OF_SERVICE.path,
        })}
      />
      <LegalPage document={TERMS_OF_SERVICE} />
    </>
  );
}
