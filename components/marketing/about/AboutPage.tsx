import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { AboutMissionSection } from "@/components/marketing/about/AboutMissionSection";
import { AboutPageHero } from "@/components/marketing/about/AboutPageHero";
import { AboutPhilosophySection } from "@/components/marketing/about/AboutPhilosophySection";
import { AboutPrinciplesSection } from "@/components/marketing/about/AboutPrinciplesSection";
import { AboutRoadmapSection } from "@/components/marketing/about/AboutRoadmapSection";
import { AboutVisionSection } from "@/components/marketing/about/AboutVisionSection";

export function AboutPage() {
  return (
    <>
      <AboutPageHero />
      <AboutMissionSection />
      <AboutVisionSection />
      <AboutPrinciplesSection />
      <AboutPhilosophySection />
      <AboutRoadmapSection />
      <FinalCtaSection variant="about" />
    </>
  );
}
