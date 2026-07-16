import { WhatIsMonavelIllustration } from "@/components/marketing/landing/WhatIsMonavelIllustration";
import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
} from "@/lib/marketing/design";
import {
  WHAT_IS_MONAVEL_CARDS,
  WHAT_IS_MONAVEL_CONTENT,
} from "@/lib/marketing/what-is-monavel";
import { cn } from "@/lib/utils";

export function WhatIsMonavelSection() {
  return (
    <section
      id={WHAT_IS_MONAVEL_CONTENT.sectionId}
      className="mkt-what-is-section"
      aria-labelledby="what-is-monavel-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <p className={mktOverlineClass}>{WHAT_IS_MONAVEL_CONTENT.overline}</p>
          <h2
            id="what-is-monavel-heading"
            className={mktSectionHeadlineClass}
          >
            {WHAT_IS_MONAVEL_CONTENT.headline}
          </h2>
        </header>

        <div className="mkt-what-is-grid">
          {WHAT_IS_MONAVEL_CARDS.map((card) => (
            <article key={card.id} className="mkt-what-is-card">
              <WhatIsMonavelIllustration cardId={card.id} />
              <h3 className="mkt-what-is-card-title">{card.title}</h3>
              <p className="mkt-what-is-card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
