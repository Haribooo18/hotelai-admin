import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_BENEFITS } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesBenefitsSection() {
  return (
    <section
      id={FEATURES_BENEFITS.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="features-benefits-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{FEATURES_BENEFITS.overline}</p>
          <h2 id="features-benefits-heading" className={mktSectionHeadlineClass}>
            {FEATURES_BENEFITS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{FEATURES_BENEFITS.subhead}</p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-features-benefits-grid")}>
          {FEATURES_BENEFITS.items.map((benefit) => (
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
