import {
  mktMotionRevealClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { HOW_MONAVEL_WORKS_CONTENT } from "@/lib/marketing/how-monavel-works";
import { cn } from "@/lib/utils";

import { OperateScene } from "./HowMonavelOperatesCards";

export function HowMonavelWorksSection() {
  return (
    <section
      id={HOW_MONAVEL_WORKS_CONTENT.sectionId}
      className="mkt-how-works-section mkt-operate-section"
      aria-labelledby="how-monavel-works-heading"
    >
      <div className="mkt-container-wide">
        <header
          className={cn(
            mktSectionHeaderClass,
            "mkt-section-header--centered",
            "mkt-operate-header",
            mktMotionRevealClass
          )}
        >
          <h2
            id="how-monavel-works-heading"
            className={cn(mktSectionHeadlineClass, "mkt-operate-headline")}
          >
            {HOW_MONAVEL_WORKS_CONTENT.headlineLines.map((line) => (
              <span key={line} className="mkt-operate-headline-line">
                {line}
              </span>
            ))}
          </h2>
          <p className={mktSectionSubheadClass}>
            {HOW_MONAVEL_WORKS_CONTENT.subhead}
          </p>
        </header>

        <div
          className={cn(mktSectionBodyClass, "mkt-operate-body", mktMotionRevealClass)}
          data-order="1"
        >
          <OperateScene />
        </div>
      </div>
    </section>
  );
}
