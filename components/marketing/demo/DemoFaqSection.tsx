import {
  mktFaqAnswerClass,
  mktFaqListClass,
  mktFaqQuestionClass,
  mktFaqSectionClass,
  mktFaqShellClass,
  mktOverlineClass,
  mktSectionBodyClass,
} from "@/lib/marketing/design";
import { DEMO_PAGE_FAQ } from "@/lib/marketing/demo-page";

export function DemoFaqSection() {
  return (
    <section
      id={DEMO_PAGE_FAQ.sectionId}
      className={mktFaqSectionClass}
      aria-labelledby="demo-faq-heading"
    >
      <div className="mkt-container-wide">
        <div className={mktFaqShellClass}>
          <p id="demo-faq-heading" className={mktOverlineClass}>
            {DEMO_PAGE_FAQ.overline}
          </p>

          <dl
            className={`${mktSectionBodyClass} ${mktFaqListClass}`}
          >
            {DEMO_PAGE_FAQ.items.map((item) => (
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
