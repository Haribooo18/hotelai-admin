import {
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  BUSINESS_OUTCOMES,
  BUSINESS_OUTCOMES_CONTENT,
} from "@/lib/marketing/business-outcomes";
import { cn } from "@/lib/utils";

export function BusinessOutcomesSection() {
  return (
    <section
      id={BUSINESS_OUTCOMES_CONTENT.sectionId}
      className="mkt-outcomes-section"
      aria-labelledby="business-outcomes-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <h2 id="business-outcomes-heading" className={mktSectionHeadlineClass}>
            {BUSINESS_OUTCOMES_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {BUSINESS_OUTCOMES_CONTENT.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-outcomes-grid")}>
          {BUSINESS_OUTCOMES.map((outcome) => (
            <li key={outcome} className="mkt-outcomes-item">
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
