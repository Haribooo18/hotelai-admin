import { PricingPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildPricingJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("pricing");
}

export default function PricingRoutePage() {
  return (
    <>
      <MarketingJsonLd data={buildPricingJsonLd()} />
      <PricingPage />
    </>
  );
}
