import { SecurityPrincipleCard } from "@/components/marketing/security/SecurityPrincipleCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_PRINCIPLES } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityPrinciplesSection() {
  return (
    <section
      id={SECURITY_PAGE_PRINCIPLES.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="security-principles-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{SECURITY_PAGE_PRINCIPLES.overline}</p>
          <h2 id="security-principles-heading" className={mktSectionHeadlineClass}>
            {SECURITY_PAGE_PRINCIPLES.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {SECURITY_PAGE_PRINCIPLES.subhead}
          </p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-workspace-grid")}
          aria-label="Security principles"
        >
          {SECURITY_PAGE_PRINCIPLES.items.map((principle) => (
            <SecurityPrincipleCard key={principle.id} principle={principle} />
          ))}
        </ul>
      </div>
    </section>
  );
}
