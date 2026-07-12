import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import {
  mktOverlineClass,
  mktProductShowcaseClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { PLATFORM_OVERVIEW_CONTENT } from "@/lib/marketing/platform-overview";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import { getProductPresentation } from "@/lib/marketing/product-presentation";
import { cn } from "@/lib/utils";

export function PlatformOverviewSection() {
  const presentation = getProductPresentation("platformShowcase");

  return (
    <section
      id={PLATFORM_OVERVIEW_CONTENT.sectionId}
      className="mkt-platform-overview-section"
      aria-labelledby="platform-overview-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--centered")}>
          <p className={mktOverlineClass}>{PLATFORM_OVERVIEW_CONTENT.overline}</p>
          <h2
            id="platform-overview-heading"
            className={mktSectionHeadlineClass}
          >
            {PLATFORM_OVERVIEW_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {PLATFORM_OVERVIEW_CONTENT.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <figure
            className={cn(
              mktProductShowcaseClass,
              "mkt-product-showcase--platform-overview",
              "mkt-platform-overview-visual"
            )}
          >
            <BrowserFrame
              productUrl={PLATFORM_OVERVIEW_CONTENT.productUrl}
              size={presentation.size}
              contentClassName="mkt-browser-content--media"
            >
              <Image
                src={PLATFORM_OVERVIEW_CONTENT.screenshotPath}
                alt={PLATFORM_OVERVIEW_CONTENT.screenshotAlt}
                width={PRODUCT_SCREENSHOT_WIDTH}
                height={PRODUCT_SCREENSHOT_HEIGHT}
                unoptimized
                className="mkt-browser-screenshot"
                style={{ objectPosition: presentation.crop.objectPosition }}
              />
            </BrowserFrame>
          </figure>
        </div>
      </div>
    </section>
  );
}
