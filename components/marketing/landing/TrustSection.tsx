import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TrustCard } from "@/components/marketing/landing/TrustCard";
import { TrustMetricsStrip } from "@/components/marketing/landing/TrustMetricsStrip";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  TRUST_CARDS,
  TRUST_SECTION_CONTENT,
} from "@/lib/marketing/trust";
import { cn } from "@/lib/utils";

export function TrustSection() {
  return (
    <section
      id={TRUST_SECTION_CONTENT.sectionId}
      className="mkt-trust-section"
      aria-labelledby="trust-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{TRUST_SECTION_CONTENT.overline}</p>
          <h2
            id="trust-heading"
            className={mktSectionHeadlineClass}
          >
            {TRUST_SECTION_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {TRUST_SECTION_CONTENT.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-trust-grid")}>
          {TRUST_CARDS.map((card) => (
            <TrustCard key={card.id} card={card} />
          ))}
        </div>

        <TrustMetricsStrip />

        <Link
          href={TRUST_SECTION_CONTENT.securityLinkHref}
          className="mkt-trust-security-link group"
        >
          {TRUST_SECTION_CONTENT.securityLinkLabel}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
