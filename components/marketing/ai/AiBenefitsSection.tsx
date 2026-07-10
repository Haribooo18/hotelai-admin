import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_BENEFITS } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiBenefitsSection() {
  return (
    <section
      id={AI_PAGE_BENEFITS.sectionId}
      className="mkt-features-section"
      aria-labelledby="ai-benefits-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_BENEFITS.overline}</p>
          <h2 id="ai-benefits-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_BENEFITS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{AI_PAGE_BENEFITS.subhead}</p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-features-benefits-grid")}>
          {AI_PAGE_BENEFITS.items.map((benefit) => (
            <li key={benefit.id} className="mkt-features-benefit-card">
              <h3 className="mkt-features-card-title">{benefit.title}</h3>
              <p className="mkt-features-card-description">{benefit.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
