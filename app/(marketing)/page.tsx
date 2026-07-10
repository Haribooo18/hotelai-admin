import {
  AIExperienceSection,
  HeroSection,
  PlatformPillarsSection,
  PlatformShowcaseSection,
  PricingPreviewSection,
  TrustSection,
  FinalCtaSection,
} from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildHomeJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("home");
}

export default function LandingPage() {
  return (
    <>
      <MarketingJsonLd data={buildHomeJsonLd()} />
      <HeroSection />
      <PlatformShowcaseSection />
      <PlatformPillarsSection />
      <AIExperienceSection />
      <PricingPreviewSection />
      <TrustSection />
      <FinalCtaSection />
    </>
  );
}
