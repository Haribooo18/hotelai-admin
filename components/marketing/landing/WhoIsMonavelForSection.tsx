import {
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  WHO_IS_MONAVEL_FOR_CONTENT,
  WHO_IS_MONAVEL_FOR_SEGMENTS,
} from "@/lib/marketing/who-is-monavel-for";
import { cn } from "@/lib/utils";

export function WhoIsMonavelForSection() {
  return (
    <section
      id={WHO_IS_MONAVEL_FOR_CONTENT.sectionId}
      className="mkt-who-for-section"
      aria-labelledby="who-is-monavel-for-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <h2 id="who-is-monavel-for-heading" className={mktSectionHeadlineClass}>
            {WHO_IS_MONAVEL_FOR_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {WHO_IS_MONAVEL_FOR_CONTENT.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-who-for-grid")}>
          {WHO_IS_MONAVEL_FOR_SEGMENTS.map((segment) => (
            <article key={segment.id} className="mkt-who-for-card">
              <h3 className="mkt-who-for-card-title">{segment.title}</h3>
              <p className="mkt-who-for-card-description">{segment.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
