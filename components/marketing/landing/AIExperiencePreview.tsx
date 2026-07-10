import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import { getProductScreenshotPath } from "@/lib/marketing/product-assets";
import { AI_EXPERIENCE_CONTENT } from "@/lib/marketing/ai-experience";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";

export function AIExperiencePreview() {
  const { preview, previewProductUrl } = AI_EXPERIENCE_CONTENT;

  return (
    <figure className="mkt-ai-preview" aria-label={preview.label}>
      <BrowserFrame productUrl={previewProductUrl} contentClassName="overflow-hidden">
        <Image
          src={getProductScreenshotPath("reception-ai")}
          alt=""
          width={PRODUCT_SCREENSHOT_WIDTH}
          height={PRODUCT_SCREENSHOT_HEIGHT}
          unoptimized
          loading="lazy"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-left-top opacity-35"
        />

        <div className="relative z-10 flex h-full items-end p-4 sm:p-6 lg:p-8">
          <div
            className="mkt-ai-preview-panel"
            role="group"
            aria-labelledby="ai-preview-recommendation"
          >
            <p className="mkt-ai-preview-kicker">AI recommendation</p>
            <p id="ai-preview-recommendation" className="mkt-ai-preview-recommendation">
              {preview.recommendation}
            </p>

            <dl className="mkt-ai-preview-meta">
              <div className="mkt-ai-preview-meta-row">
                <dt>Why</dt>
                <dd>{preview.why}</dd>
              </div>
              <div className="mkt-ai-preview-meta-row">
                <dt>Expected impact</dt>
                <dd>{preview.impact}</dd>
              </div>
              <div className="mkt-ai-preview-meta-row">
                <dt>Confidence</dt>
                <dd>{preview.confidence}</dd>
              </div>
            </dl>
          </div>
        </div>
      </BrowserFrame>
      <figcaption className="sr-only">{preview.label}</figcaption>
    </figure>
  );
}
