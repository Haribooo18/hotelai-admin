import { ContactMethodCard } from "@/components/marketing/contact/ContactMethodCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
  mktSectionTightClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_METHODS } from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

export function ContactMethodsSection() {
  return (
    <section
      id={CONTACT_PAGE_METHODS.sectionId}
      className={cn("mkt-features-section", mktSectionTightClass)}
      aria-labelledby="contact-methods-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{CONTACT_PAGE_METHODS.overline}</p>
          <h2 id="contact-methods-heading" className={mktSectionHeadlineClass}>
            {CONTACT_PAGE_METHODS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {CONTACT_PAGE_METHODS.subhead}
          </p>
        </header>

        <ul
          className={cn(
            mktSectionBodyClass,
            "grid items-stretch gap-4 md:grid-cols-3"
          )}
        >
          {CONTACT_PAGE_METHODS.methods.map((method) => (
            <ContactMethodCard key={method.id} method={method} />
          ))}
        </ul>
      </div>
    </section>
  );
}
