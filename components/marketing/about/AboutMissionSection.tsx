import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_MISSION } from "@/lib/marketing/about-page";
import { cn } from "@/lib/utils";

export function AboutMissionSection() {
  return (
    <section
      id={ABOUT_PAGE_MISSION.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-mission-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{ABOUT_PAGE_MISSION.overline}</p>
          <h2 id="about-mission-heading" className={mktSectionHeadlineClass}>
            {ABOUT_PAGE_MISSION.headline}
          </h2>
        </header>

        <p className={cn(mktSectionBodyClass, "mkt-about-narrative max-w-3xl")}>
          {ABOUT_PAGE_MISSION.body}
        </p>
      </div>
    </section>
  );
}
