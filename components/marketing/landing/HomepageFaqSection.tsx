import { HomepageFaqAccordion } from "@/components/marketing/landing/HomepageFaqAccordion";
import {
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
} from "@/lib/marketing/design";
import {
  HOMEPAGE_FAQ_CONTENT,
  HOMEPAGE_FAQ_ITEMS,
} from "@/lib/marketing/homepage-faq";
import { cn } from "@/lib/utils";

export function HomepageFaqSection() {
  return (
    <section
      id={HOMEPAGE_FAQ_CONTENT.sectionId}
      className="mkt-homepage-faq-section"
      aria-labelledby="homepage-faq-heading"
    >
      <div className="mkt-container-focus">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <h2 id="homepage-faq-heading" className={mktSectionHeadlineClass}>
            {HOMEPAGE_FAQ_CONTENT.headline}
          </h2>
        </header>

        <div className={mktSectionBodyClass}>
          <HomepageFaqAccordion items={HOMEPAGE_FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
