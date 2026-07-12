import Image from "next/image";

import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";
import { getProductScreenshotPath } from "@/lib/marketing/product-assets";
import { AI_EXPERIENCE_CONTENT } from "@/lib/marketing/ai-experience";
import {
  PRODUCT_SCREENSHOT_HEIGHT,
  PRODUCT_SCREENSHOT_WIDTH,
} from "@/lib/marketing/product-media";
import { getProductPresentation } from "@/lib/marketing/product-presentation";

export function AIExperiencePreview() {
  const { preview, previewProductUrl } = AI_EXPERIENCE_CONTENT;
  const presentation = getProductPresentation("aiExperience");

  return (
    <figure
      className="mkt-ai-preview mkt-product-showcase mkt-product-showcase--section mkt-product-showcase--unified"
      aria-label={preview.label}
    >
      <BrowserFrame
        productUrl={previewProductUrl}
        size={presentation.size}
        contentClassName="mkt-browser-content--media"
      >
        <Image
          src={getProductScreenshotPath("reception-ai")}
          alt=""
          width={PRODUCT_SCREENSHOT_WIDTH}
          height={PRODUCT_SCREENSHOT_HEIGHT}
          unoptimized
          loading="lazy"
          aria-hidden
          className="mkt-browser-screenshot mkt-browser-screenshot--dimmed"
          style={{ objectPosition: presentation.crop.objectPosition }}
        />

        <div className="mkt-ai-preview-overlay">
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
