import { PlatformPillarCard } from "@/components/marketing/landing/PlatformPillarCard";
import {
  mktOverlineClass,
  mktPlatformHeadlineClass,
  mktSubheadClass,
} from "@/lib/marketing/design";
import {
  PLATFORM_PILLARS,
  PLATFORM_PILLARS_CONTENT,
} from "@/lib/marketing/pillars";
import { cn } from "@/lib/utils";

export function PlatformPillarsSection() {
  return (
    <section
      id={PLATFORM_PILLARS_CONTENT.sectionId}
      className="mkt-pillars-section"
      aria-labelledby="platform-pillars-heading"
    >
      <div className="mkt-container-wide">
        <header className="max-w-3xl">
          <p className={mktOverlineClass}>{PLATFORM_PILLARS_CONTENT.overline}</p>
          <h2
            id="platform-pillars-heading"
            className={cn(mktPlatformHeadlineClass, "mt-4")}
          >
            {PLATFORM_PILLARS_CONTENT.headline}
          </h2>
          <p className={cn(mktSubheadClass, "mt-6 max-w-2xl")}>
            {PLATFORM_PILLARS_CONTENT.subhead}
          </p>
        </header>

        <div className="mkt-pillars-grid">
          {PLATFORM_PILLARS.map((pillar) => (
            <PlatformPillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
