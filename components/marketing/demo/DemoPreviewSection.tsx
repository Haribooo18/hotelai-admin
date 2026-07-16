import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
  mktSplitSectionCopyCompactClass,
  mktSplitSectionVisualEmphasisClass,
  mktSectionTightClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_PREVIEW } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoPreviewSection() {
  return (
    <section
      id={DEMO_PAGE_PREVIEW.sectionId}
      className={cn("mkt-features-section", mktSectionTightClass)}
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
          <div
            className={cn(
              "mkt-split-section-copy",
              mktSplitSectionCopyCompactClass
            )}
          >
            <p className={mktOverlineClass}>{DEMO_PAGE_PREVIEW.overline}</p>
            <h2 id="demo-preview-heading" className={mktSectionHeadlineClass}>
              {DEMO_PAGE_PREVIEW.headline}
            </h2>
            <p className={mktSectionSubheadClass}>{DEMO_PAGE_PREVIEW.subhead}</p>

            <ul className="mkt-feature-rows" role="list">
              {DEMO_PAGE_PREVIEW.areas.map((area) => {
                const Icon = area.icon;

                return (
                  <li
                    key={area.id}
                    className="mkt-feature-row flex items-start gap-3"
                    role="listitem"
                  >
                    <span
                      className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[color-mix(in_oklch,var(--mkt-accent)_14%,transparent)] bg-[color-mix(in_oklch,var(--mkt-accent)_9%,transparent)] text-[var(--mkt-accent)]"
                      aria-hidden="true"
                    >
                      <Icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="mkt-feature-row-title">{area.title}</h3>
                      <p className="mkt-feature-row-description">
                        {area.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mkt-split-section-visual">
            <WorkspacePreview
              workspaceId="reception-ai"
              presentation="demoPreview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
