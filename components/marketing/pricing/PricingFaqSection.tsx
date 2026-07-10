import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { PRICING_PAGE_FAQ } from "@/lib/marketing/pricing-page";

export function PricingFaqSection() {
  return (
    <section
      id={PRICING_PAGE_FAQ.sectionId}
      className="mkt-features-section"
      aria-labelledby="pricing-faq-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PRICING_PAGE_FAQ.overline}</p>
          <h2 id="pricing-faq-heading" className={mktSectionHeadlineClass}>
            {PRICING_PAGE_FAQ.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{PRICING_PAGE_FAQ.subhead}</p>
        </header>

        <div className={mktSectionBodyClass}>
          <dl className="mkt-pricing-page-faq-list">
            {PRICING_PAGE_FAQ.items.map((item) => (
              <div key={item.question} className="mkt-pricing-faq-item">
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={PRICING_PAGE_FAQ.contactLinkHref}
            className="mkt-pricing-faq-link group"
          >
            {PRICING_PAGE_FAQ.contactLinkLabel}
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
