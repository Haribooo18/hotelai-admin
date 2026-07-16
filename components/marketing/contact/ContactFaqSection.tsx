import {
  mktFaqAnswerClass,
  mktFaqListClass,
  mktFaqQuestionClass,
  mktFaqSectionClass,
  mktFaqShellClass,
  mktOverlineClass,
  mktSectionBodyClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_FAQ } from "@/lib/marketing/contact-page";

export function ContactFaqSection() {
  return (
    <section
      id={CONTACT_PAGE_FAQ.sectionId}
      className={mktFaqSectionClass}
      aria-labelledby="contact-faq-heading"
    >
      <div className="mkt-container-wide">
        <div className={mktFaqShellClass}>
          <p id="contact-faq-heading" className={mktOverlineClass}>
            {CONTACT_PAGE_FAQ.overline}
          </p>

          <dl
            className={`${mktSectionBodyClass} ${mktFaqListClass}`}
          >
            {CONTACT_PAGE_FAQ.items.map((item) => (
              <div key={item.question}>
                <dt className={mktFaqQuestionClass}>
                  {item.question}
                </dt>
                <dd className={mktFaqAnswerClass}>
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
