import { AboutPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildAboutJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("about");
}

export default function AboutRoutePage() {
  return (
    <>
      <MarketingJsonLd data={buildAboutJsonLd()} />
      <AboutPage />
    </>
  );
}
