import { AboutMissionSection } from "./AboutMissionSection";
import { AboutPageHero } from "./AboutPageHero";
import { AboutPhilosophySection } from "./AboutPhilosophySection";
import { AboutPrinciplesSection } from "./AboutPrinciplesSection";
import { AboutRoadmapSection } from "./AboutRoadmapSection";
import { AboutVisionSection } from "./AboutVisionSection";

export function AboutPage() {
  return (
    <main className="mkt-about-page overflow-x-hidden">
      <AboutPageHero />
      <AboutMissionSection />
      <AboutVisionSection />
      <AboutPrinciplesSection />
      <AboutPhilosophySection />
      <AboutRoadmapSection />
    </main>
  );
}