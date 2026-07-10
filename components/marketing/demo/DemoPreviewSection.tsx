import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
  mktSplitSectionCopyCompactClass,
  mktSplitSectionVisualEmphasisClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_PREVIEW } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoPreviewSection() {
  return (
    <section
      id={DEMO_PAGE_PREVIEW.sectionId}
      className="mkt-features-section"
      aria-labelledby="demo-preview-heading"
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
            <p className={mktOverlineClass}>{DEMO_PAGE_PREVIEW.overline}</p>
            <h2 id="demo-preview-heading" className={mktSectionHeadlineClass}>
              {DEMO_PAGE_PREVIEW.headline}
            </h2>
            <p className={mktSectionSubheadClass}>{DEMO_PAGE_PREVIEW.subhead}</p>

            <ul className="mkt-feature-rows" role="list">
              {DEMO_PAGE_PREVIEW.areas.map((area) => (
                <li key={area.id} className="mkt-feature-row" role="listitem">
                  <h3 className="mkt-feature-row-title">{area.title}</h3>
                  <p className="mkt-feature-row-description">{area.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mkt-split-section-visual">
            <WorkspacePreview workspaceId="dashboard" presentation="demoPreview" />
          </div>
        </div>
      </div>
    </section>
  );
}
