import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  PRICING_PREVIEW_CONTENT,
  PRICING_PREVIEW_FAQ,
} from "@/lib/marketing/pricing-preview";

export function PricingPreviewFaq() {
  return (
    <div className="mkt-pricing-faq">
      <dl className="mkt-pricing-faq-list">
        {PRICING_PREVIEW_FAQ.map((item) => (
          <div key={item.question} className="mkt-pricing-faq-item">
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>

      <Link
        href={PRICING_PREVIEW_CONTENT.faqLinkHref}
        className="mkt-pricing-faq-link group"
      >
        {PRICING_PREVIEW_CONTENT.faqLinkLabel}
        <ArrowRight
          className="size-4 transition-transform duration-[var(--mkt-duration)] ease-[var(--mkt-ease)] group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}
