import {
  AIExperienceSection,
  HeroSection,
  PlatformPillarsSection,
  PlatformShowcaseSection,
  PricingPreviewSection,
  TrustSection,
  FinalCtaSection,
} from "@/components/marketing";

export default function LandingPage() {
  return (
    <>
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
