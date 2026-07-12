import { mktMotionRevealClass, mktOverlineClass } from "@/lib/marketing/design";
import { PHILOSOPHY_CONTENT } from "@/lib/marketing/landing-story";
import { cn } from "@/lib/utils";

export function PhilosophySection() {
  return (
    <section
      id={PHILOSOPHY_CONTENT.sectionId}
      className="mkt-philosophy-section"
      aria-labelledby="philosophy-heading"
    >
      <div className="mkt-container mkt-philosophy-inner">
        <p
          className={cn(
            mktOverlineClass,
            "mkt-philosophy-overline",
            mktMotionRevealClass
          )}
        >
          {PHILOSOPHY_CONTENT.overline}
        </p>
        <h2
          id="philosophy-heading"
          className={cn("mkt-philosophy-headline", mktMotionRevealClass)}
          data-order="1"
        >
          {PHILOSOPHY_CONTENT.headline}
        </h2>
        <div className="mkt-philosophy-lines">
          {PHILOSOPHY_CONTENT.lines.map((line, index) => (
            <p
              key={line}
              className={cn("mkt-philosophy-line", mktMotionRevealClass)}
              data-order={index + 2}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
