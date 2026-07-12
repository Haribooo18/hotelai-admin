import { PlatformShowcaseInteractive } from "@/components/marketing/landing/PlatformShowcaseInteractive";
import {
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  PLATFORM_SHOWCASE_CONTENT,
} from "@/lib/marketing/platform";

import { cn } from "@/lib/utils";

export function PlatformShowcaseSection() {
  return (
    <section
      id={PLATFORM_SHOWCASE_CONTENT.sectionId}
      className="mkt-platform-section"
      aria-labelledby="platform-showcase-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <h2
            id="platform-showcase-heading"
            className={mktSectionHeadlineClass}
          >
            {PLATFORM_SHOWCASE_CONTENT.headline}
            <span className="block text-[var(--mkt-accent)]">
              {PLATFORM_SHOWCASE_CONTENT.headlineAccent}
            </span>
          </h2>
          <p className={mktSectionSubheadClass}>
            {PLATFORM_SHOWCASE_CONTENT.supporting}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <PlatformShowcaseInteractive />
        </div>
      </div>
    </section>
  );
}
