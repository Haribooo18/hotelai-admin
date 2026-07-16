import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import {
  mktProductShowcaseClass,
  mktProductShowcaseLandingClass,
} from "@/lib/marketing/design";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import { getProductPresentation } from "@/lib/marketing/product-presentation";
import { cn } from "@/lib/utils";

export function ProductBrowserFrame() {
  const presentation = getProductPresentation("landingHero");

  return (
    <figure
      className={cn(
        mktProductShowcaseClass,
        "mkt-product-showcase--hero",
        "mkt-product-showcase--unified",
        mktProductShowcaseLandingClass
      )}
      aria-hidden
    >
      <BrowserFrame
        productUrl="monavel.app/dashboard"
        tabTitle="Monavel"
        size={presentation.size}
        contentClassName="mkt-browser-content--media"
      >
        <Image
          src="/marketing/hero-live-workspace.svg"
          alt=""
          width={PRODUCT_SCREENSHOT_WIDTH}
          height={PRODUCT_SCREENSHOT_HEIGHT}
          unoptimized
          priority
          className="mkt-browser-screenshot"
          style={{ objectPosition: presentation.crop.objectPosition }}
        />
      </BrowserFrame>
    </figure>
  );
}
