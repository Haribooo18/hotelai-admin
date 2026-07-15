import { PricingDetailsSection } from "@/components/marketing/pricing/PricingDetailsSection";
import { PricingPageHero } from "@/components/marketing/pricing/PricingPageHero";
import { PricingPlansSection } from "@/components/marketing/pricing/PricingPlansSection";

export function PricingPage() {
  return (
    <>
      <PricingPageHero />
      <PricingPlansSection />
      <PricingDetailsSection />
    </>
  );
}
