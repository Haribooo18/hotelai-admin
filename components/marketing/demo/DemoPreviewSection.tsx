import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_PREVIEW } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

import { DemoPreviewCard } from "./DemoPreviewCard";

export function DemoPreviewSection() {
  return (
    <section
      id={DEMO_PAGE_PREVIEW.sectionId}
      className="mkt-features-section"
      aria-labelledby="demo-preview-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{DEMO_PAGE_PREVIEW.overline}</p>
          <h2 id="demo-preview-heading" className={mktSectionHeadlineClass}>
            {DEMO_PAGE_PREVIEW.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{DEMO_PAGE_PREVIEW.subhead}</p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-workspace-grid")}
        >
          {DEMO_PAGE_PREVIEW.areas.map((area) => (
            <DemoPreviewCard key={area.id} area={area} />
          ))}
        </ul>
      </div>
    </section>
  );
}
