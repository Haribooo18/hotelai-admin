import { AboutMissionSection } from "./AboutMissionSection";
import { AboutPageHero } from "./AboutPageHero";
import { AboutPhilosophySection } from "./AboutPhilosophySection";
import { AboutPrinciplesSection } from "./AboutPrinciplesSection";
import { AboutRoadmapSection } from "./AboutRoadmapSection";
import { AboutVisionSection } from "./AboutVisionSection";

export function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <AboutPageHero />
      <AboutMissionSection />
      <AboutVisionSection />
      <AboutPrinciplesSection />
      <AboutPhilosophySection />
      <AboutRoadmapSection />
    </main>
  );
}