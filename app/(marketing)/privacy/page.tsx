import { LegalPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildWebPageJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";
import { PRIVACY_POLICY } from "@/lib/marketing/legal";

export function generateMetadata() {
  return generateMarketingMetadata("privacy");
}

export default function PrivacyRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildWebPageJsonLd({
          title: PRIVACY_POLICY.title,
          description: PRIVACY_POLICY.description,
          path: PRIVACY_POLICY.path,
        })}
      />
      <LegalPage document={PRIVACY_POLICY} />
    </>
  );
}
