import { PlatformPillarCard } from "@/components/marketing/landing/PlatformPillarCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
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
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PLATFORM_PILLARS_CONTENT.overline}</p>
          <h2
            id="platform-pillars-heading"
            className={mktSectionHeadlineClass}
          >
            {PLATFORM_PILLARS_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {PLATFORM_PILLARS_CONTENT.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-pillars-grid")}>
          {PLATFORM_PILLARS.map((pillar) => (
            <PlatformPillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
