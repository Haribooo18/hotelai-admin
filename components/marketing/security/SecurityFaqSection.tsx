import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_FAQ } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityFaqSection() {
  return (
    <section
      id={SECURITY_PAGE_FAQ.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="security-faq-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{SECURITY_PAGE_FAQ.overline}</p>
          <h2 id="security-faq-heading" className={mktSectionHeadlineClass}>
            {SECURITY_PAGE_FAQ.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{SECURITY_PAGE_FAQ.subhead}</p>
        </header>

        <dl className={cn(mktSectionBodyClass, "mkt-pricing-page-faq-list")}>
          {SECURITY_PAGE_FAQ.items.map((item) => (
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
