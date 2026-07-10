import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_FAQ } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoFaqSection() {
  return (
    <section
      id={DEMO_PAGE_FAQ.sectionId}
      className="mkt-features-section"
      aria-labelledby="demo-faq-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{DEMO_PAGE_FAQ.overline}</p>
          <h2 id="demo-faq-heading" className={mktSectionHeadlineClass}>
            {DEMO_PAGE_FAQ.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{DEMO_PAGE_FAQ.subhead}</p>
        </header>

        <dl className={cn(mktSectionBodyClass, "mkt-pricing-page-faq-list")}>
          {DEMO_PAGE_FAQ.items.map((item) => (
            <div key={item.question} className="mkt-pricing-faq-item">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
