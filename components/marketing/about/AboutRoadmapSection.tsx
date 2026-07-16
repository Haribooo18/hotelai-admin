import { ArrowDown, ArrowRight } from "lucide-react";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
  mktSplitSectionClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_ROADMAP } from "@/lib/marketing/about-page";
import { cn } from "@/lib/utils";

export function AboutRoadmapSection() {
  return (
    <section
      id={ABOUT_PAGE_ROADMAP.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-roadmap-heading"
    >
      <div className="mkt-container-wide">
        <div className={cn("mkt-split-section", mktSplitSectionClass)}>
          <div className="mkt-split-section-copy">
            <p className={mktOverlineClass}>{ABOUT_PAGE_ROADMAP.overline}</p>
            <h2 id="about-roadmap-heading" className={mktSectionHeadlineClass}>
              {ABOUT_PAGE_ROADMAP.headline}
            </h2>
            <p className={mktSectionSubheadClass}>{ABOUT_PAGE_ROADMAP.subhead}</p>

            <ol
              className="mkt-features-workflow mkt-about-roadmap-flow mkt-split-workflow"
              aria-label="Monavel product roadmap direction"
            >
              {ABOUT_PAGE_ROADMAP.steps.map((step, index) => (
                <li key={step.id} className="mkt-features-workflow-step">
                  <div className="mkt-about-roadmap-step">
                    <span className="mkt-features-workflow-node">{step.label}</span>
                    <p className="mkt-about-roadmap-description">
                      {step.description}
                    </p>
                  </div>
                  {index < ABOUT_PAGE_ROADMAP.steps.length - 1 ? (
                    <>
                      <ArrowRight
                        className="mkt-features-workflow-arrow mkt-features-workflow-arrow-horizontal"
                        aria-hidden
                      />
                      <ArrowDown
                        className="mkt-features-workflow-arrow mkt-features-workflow-arrow-vertical"
                        aria-hidden
                      />
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="mkt-split-section-visual">
            <WorkspacePreview workspaceId="calendar" presentation="aboutRoadmap" />
          </div>
        </div>
      </div>
    </section>
  );
}
