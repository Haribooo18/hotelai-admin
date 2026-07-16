import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_ACCESS_CONTROL } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityAccessControlSection() {
  return (
    <section
      id={SECURITY_PAGE_ACCESS_CONTROL.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="security-access-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {SECURITY_PAGE_ACCESS_CONTROL.overline}
          </p>
          <h2 id="security-access-heading" className={mktSectionHeadlineClass}>
            {SECURITY_PAGE_ACCESS_CONTROL.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {SECURITY_PAGE_ACCESS_CONTROL.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-security-access-grid")}>
          {SECURITY_PAGE_ACCESS_CONTROL.topics.map((topic) => (
            <li key={topic.id} className="mkt-features-benefit-card">
              <h3 className="mkt-features-card-title">{topic.title}</h3>
              <p className="mkt-features-card-description">{topic.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
