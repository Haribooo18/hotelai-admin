import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_PLATFORM_OVERVIEW } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesPlatformOverviewSection() {
  return (
    <section
      id={FEATURES_PLATFORM_OVERVIEW.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="features-platform-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{FEATURES_PLATFORM_OVERVIEW.overline}</p>
          <h2 id="features-platform-heading" className={mktSectionHeadlineClass}>
            {FEATURES_PLATFORM_OVERVIEW.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {FEATURES_PLATFORM_OVERVIEW.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-features-overview-grid")}>
          {FEATURES_PLATFORM_OVERVIEW.areas.map((area) => (
            <li key={area.id} className="mkt-features-overview-card">
              <h3 className="mkt-features-card-title">{area.title}</h3>
              <p className="mkt-features-card-description">{area.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
