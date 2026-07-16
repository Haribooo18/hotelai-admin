import {
  mktMotionRevealClass,
  mktSectionHeaderClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { WHY_HOTELS_NEED_CONTENT } from "@/lib/marketing/why-hotels-need";
import { cn } from "@/lib/utils";

import { WhyHotelsNeedStory } from "./WhyHotelsNeedStory";

export function WhyHotelsNeedSection() {
  return (
    <section
      id={WHY_HOTELS_NEED_CONTENT.sectionId}
      className="mkt-why-need-section"
      aria-labelledby="why-hotels-need-heading"
    >
      <div className="mkt-container-wide">
        <header
          className={cn(
            mktSectionHeaderClass,
            "mkt-section-header--centered",
            mktMotionRevealClass
          )}
        >
          <h2
            id="why-hotels-need-heading"
            className={cn(mktSectionHeadlineClass, "mkt-why-need-headline")}
          >
            {WHY_HOTELS_NEED_CONTENT.headlineLines.map((line) => (
              <span key={line} className="mkt-why-need-headline-line">
                {line}
              </span>
            ))}
          </h2>
          <p className={mktSectionSubheadClass}>
            {WHY_HOTELS_NEED_CONTENT.subhead}
          </p>
        </header>

        <WhyHotelsNeedStory />
      </div>
    </section>
  );
}
