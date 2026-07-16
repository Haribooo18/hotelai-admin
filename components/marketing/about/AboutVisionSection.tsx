import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_VISION } from "@/lib/marketing/about-page";
import { cn } from "@/lib/utils";

export function AboutVisionSection() {
  return (
    <section
      id={ABOUT_PAGE_VISION.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="about-vision-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{ABOUT_PAGE_VISION.overline}</p>
          <h2 id="about-vision-heading" className={mktSectionHeadlineClass}>
            {ABOUT_PAGE_VISION.headline}
          </h2>
        </header>

        <p className={cn(mktSectionBodyClass, "mkt-about-narrative max-w-3xl")}>
          {ABOUT_PAGE_VISION.body}
        </p>
      </div>
    </section>
  );
}
