import type { CSSProperties } from "react";

import {
  mktMotionRevealClass,
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  CHANNEL_FLOW,
  STORYTELLING_CONTENT,
} from "@/lib/marketing/landing-story";
import { cn } from "@/lib/utils";

export function StorytellingSection() {
  return (
    <section
      id={STORYTELLING_CONTENT.sectionId}
      className="mkt-story-section"
      aria-labelledby="storytelling-heading"
    >
      <div className="mkt-container-wide">
        <header
          className={cn(
            mktSectionHeaderClass,
            "mkt-section-header--centered",
            mktMotionRevealClass
          )}
        >
          <p className={mktOverlineClass}>{STORYTELLING_CONTENT.overline}</p>
          <h2 id="storytelling-heading" className={mktSectionHeadlineClass}>
            {STORYTELLING_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {STORYTELLING_CONTENT.subhead}
          </p>
        </header>

        <div
          className={cn(
            mktSectionBodyClass,
            "mkt-channel-flow",
            mktMotionRevealClass
          )}
          data-order="1"
          role="list"
          aria-label="Guest journey through Monavel"
        >
          {CHANNEL_FLOW.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "mkt-channel-flow-step",
                step.id === "guest-return" && "mkt-channel-flow-step--terminal"
              )}
              role="listitem"
              style={{ "--mkt-flow-index": index } as CSSProperties}
            >
              <span className="mkt-channel-flow-node" aria-hidden />
              <span className="mkt-channel-flow-label">{step.label}</span>
              {index < CHANNEL_FLOW.length - 1 ? (
                <span className="mkt-channel-flow-connector" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
