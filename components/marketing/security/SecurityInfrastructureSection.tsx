import { SecurityInfrastructureCard } from "@/components/marketing/security/SecurityInfrastructureCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_INFRASTRUCTURE } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityInfrastructureSection() {
  return (
    <section
      id={SECURITY_PAGE_INFRASTRUCTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="security-infrastructure-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {SECURITY_PAGE_INFRASTRUCTURE.overline}
          </p>

          <h2
            id="security-infrastructure-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {SECURITY_PAGE_INFRASTRUCTURE.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {SECURITY_PAGE_INFRASTRUCTURE.subhead}
          </p>
        </header>

        <ul
          className={cn(
            mktSectionBodyClass,
            "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          )}
          aria-label="Infrastructure practices"
        >
          {SECURITY_PAGE_INFRASTRUCTURE.items.map((item) => (
            <SecurityInfrastructureCard
              key={item.id}
              item={item}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}