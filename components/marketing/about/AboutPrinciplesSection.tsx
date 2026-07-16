import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_PRINCIPLES } from "@/lib/marketing/about-page";
import { cn } from "@/lib/utils";

import { AboutPrincipleCard } from "./AboutPrincipleCard";

export function AboutPrinciplesSection() {
  return (
    <section
      id={ABOUT_PAGE_PRINCIPLES.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-principles-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{ABOUT_PAGE_PRINCIPLES.overline}</p>
          <h2 id="about-principles-heading" className={mktSectionHeadlineClass}>
            {ABOUT_PAGE_PRINCIPLES.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {ABOUT_PAGE_PRINCIPLES.subhead}
          </p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-workspace-grid")}
          aria-label="Monavel core principles"
        >
          {ABOUT_PAGE_PRINCIPLES.items.map((principle) => (
            <AboutPrincipleCard key={principle.id} principle={principle} />
          ))}
        </ul>
      </div>
    </section>
  );
}
