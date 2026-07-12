import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  WHY_HOTELS_CARDS,
  WHY_HOTELS_CONTENT,
} from "@/lib/marketing/why-hotels";
import { cn } from "@/lib/utils";

export function WhyHotelsChooseSection() {
  return (
    <section
      id={WHY_HOTELS_CONTENT.sectionId}
      className="mkt-why-hotels-section"
      aria-labelledby="why-hotels-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <p className={mktOverlineClass}>{WHY_HOTELS_CONTENT.overline}</p>
          <h2 id="why-hotels-heading" className={mktSectionHeadlineClass}>
            {WHY_HOTELS_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{WHY_HOTELS_CONTENT.subhead}</p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-why-hotels-grid")}>
          {WHY_HOTELS_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.id} className="mkt-why-hotels-card">
                <div className="mkt-why-hotels-icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <h3 className="mkt-why-hotels-card-title">{card.title}</h3>
                <p className="mkt-why-hotels-card-description">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
