import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import { HERO_CONTENT } from "@/lib/marketing/hero";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import { getProductPresentation } from "@/lib/marketing/product-presentation";

type Props = {
  className?: string;
};

export function ProductBrowserFrame({ className }: Props) {
  const presentation = getProductPresentation("landingHero");

  return (
    <figure className={className} aria-hidden>
      <BrowserFrame
        productUrl={HERO_CONTENT.productUrl}
        size={presentation.size}
        contentClassName="mkt-browser-content--media"
      >
        <Image
          src="/marketing/hero-ai-inbox.svg"
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
