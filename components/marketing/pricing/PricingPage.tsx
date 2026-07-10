import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { PricingAudienceSection } from "@/components/marketing/pricing/PricingAudienceSection";
import { PricingComparisonSection } from "@/components/marketing/pricing/PricingComparisonSection";
import { PricingFaqSection } from "@/components/marketing/pricing/PricingFaqSection";
import { PricingPageHero } from "@/components/marketing/pricing/PricingPageHero";
import { PricingPlansSection } from "@/components/marketing/pricing/PricingPlansSection";

export function PricingPage() {
  return (
    <>
      <PricingPageHero />
      <PricingPlansSection />
      <PricingComparisonSection />
      <PricingAudienceSection />
      <PricingFaqSection />
      <FinalCtaSection />
    </>
  );
}
