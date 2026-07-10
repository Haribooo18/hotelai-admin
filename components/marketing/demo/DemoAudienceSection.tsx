import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_AUDIENCE } from "@/lib/marketing/demo-page";
import { cn } from "@/lib/utils";

export function DemoAudienceSection() {
  return (
    <section
      id={DEMO_PAGE_AUDIENCE.sectionId}
      className="mkt-features-section"
      aria-labelledby="demo-audience-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{DEMO_PAGE_AUDIENCE.overline}</p>
          <h2 id="demo-audience-heading" className={mktSectionHeadlineClass}>
            {DEMO_PAGE_AUDIENCE.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {DEMO_PAGE_AUDIENCE.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-security-access-grid")}>
          {DEMO_PAGE_AUDIENCE.cards.map((card) => (
            <li key={card.id} className="mkt-features-benefit-card">
              <h3 className="mkt-features-card-title">{card.title}</h3>
              <p className="mkt-features-card-description">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
