import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_PHILOSOPHY } from "@/lib/marketing/about-page";
import { cn } from "@/lib/utils";

export function AboutPhilosophySection() {
  return (
    <section
      id={ABOUT_PAGE_PHILOSOPHY.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="about-philosophy-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{ABOUT_PAGE_PHILOSOPHY.overline}</p>
          <h2 id="about-philosophy-heading" className={mktSectionHeadlineClass}>
            {ABOUT_PAGE_PHILOSOPHY.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {ABOUT_PAGE_PHILOSOPHY.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-security-access-grid")}>
          {ABOUT_PAGE_PHILOSOPHY.items.map((item) => (
            <li key={item.id} className="mkt-features-benefit-card">
              <h3 className="mkt-features-card-title">{item.title}</h3>
              <p className="mkt-features-card-description">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
