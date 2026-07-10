import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_FAQ } from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

export function ContactFaqSection() {
  return (
    <section
      id={CONTACT_PAGE_FAQ.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="contact-faq-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{CONTACT_PAGE_FAQ.overline}</p>
          <h2 id="contact-faq-heading" className={mktSectionHeadlineClass}>
            {CONTACT_PAGE_FAQ.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{CONTACT_PAGE_FAQ.subhead}</p>
        </header>

        <dl className={cn(mktSectionBodyClass, "mkt-contact-faq-list")}>
          {CONTACT_PAGE_FAQ.items.map((item) => (
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
