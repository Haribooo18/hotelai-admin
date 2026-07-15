import {
  FinalCtaSection,
  HomepageFaqSection,
  HeroSection,
  HomepageScrollReset,
  HowMonavelWorksSection,
  PlatformShowcaseSection,
  PricingPreviewSection,
  TrustSection,
  WhyHotelsNeedSection,
} from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { buildHomeJsonLd } from "@/lib/marketing/jsonld";
import { MARKETING_HOMEPAGE_SECTIONS } from "@/lib/marketing/homepage";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

/** Static homepage — one composition, no conditional variants. */
export const dynamic = "force-static";

export function generateMetadata() {
  return generateMarketingMetadata("home");
}

const homepageSections = MARKETING_HOMEPAGE_SECTIONS;

export default function LandingPage() {
  return (
    <>
      <MarketingJsonLd data={buildHomeJsonLd()} />
      <HomepageScrollReset />
      <div data-homepage-sections={homepageSections.join(",")}>
        <HeroSection />
        <WhyHotelsNeedSection />
        <HowMonavelWorksSection />
        <PlatformShowcaseSection />
        <PricingPreviewSection />
        <TrustSection />
        <HomepageFaqSection />
        <FinalCtaSection />
      </div>
    </>
  );
}
