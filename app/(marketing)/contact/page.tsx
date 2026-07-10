import { ContactPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildContactJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("contact");
}

export default function ContactRoutePage() {
  return (
    <>
      <MarketingJsonLd data={buildContactJsonLd()} />
      <ContactPage />
    </>
  );
}
