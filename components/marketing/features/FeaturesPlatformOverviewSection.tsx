import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
  mktSplitSectionCopyCompactClass,
  mktSplitSectionVisualEmphasisClass,
} from "@/lib/marketing/design";
import { FEATURES_PLATFORM_OVERVIEW } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesPlatformOverviewSection() {
  return (
    <section
      id={FEATURES_PLATFORM_OVERVIEW.sectionId}
      className="mkt-features-section"
      aria-labelledby="features-platform-heading"
    >
      <div className="mkt-container-wide">
        <div
          className={cn(
            "mkt-split-section",
            mktSplitSectionClass,
            mktSplitSectionVisualEmphasisClass
          )}
        >
          <div className={cn("mkt-split-section-copy", mktSplitSectionCopyCompactClass)}>
            <p className={mktOverlineClass}>{FEATURES_PLATFORM_OVERVIEW.overline}</p>
            <h2 id="features-platform-heading" className={mktSectionHeadlineClass}>
              {FEATURES_PLATFORM_OVERVIEW.headline}
            </h2>
            <p className={mktSectionSubheadClass}>
              {FEATURES_PLATFORM_OVERVIEW.subhead}
            </p>

            <ul className="mkt-feature-rows" role="list">
              {FEATURES_PLATFORM_OVERVIEW.areas.map((area) => (
                <li key={area.id} className="mkt-feature-row" role="listitem">
                  <h3 className="mkt-feature-row-title">{area.title}</h3>
                  <p className="mkt-feature-row-description">{area.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mkt-split-section-visual">
            <WorkspacePreview
              workspaceId="dashboard"
              presentation="featuresPlatform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
