import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktPlatformHeadlineClass,
  mktSubheadClass,
} from "@/lib/marketing/design";
import {
  FINAL_CTA_CONTENT,
  FINAL_CTA_TRUST_ITEMS,
} from "@/lib/marketing/final-cta";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
    <section
      id={FINAL_CTA_CONTENT.sectionId}
      className="mkt-final-cta-section"
      aria-labelledby="final-cta-heading"
    >
      <div className="mkt-container-wide">
        <div className="mkt-final-cta-panel">
          <h2
            id="final-cta-heading"
            className={cn(mktPlatformHeadlineClass, "text-center")}
          >
            {FINAL_CTA_CONTENT.headline}
          </h2>

          <p className={cn(mktSubheadClass, "mt-4 text-center max-w-2xl mx-auto")}>
            {FINAL_CTA_CONTENT.subhead}
          </p>

          <div className="mkt-final-cta-actions">
            <MarketingButton
              href={FINAL_CTA_CONTENT.primaryCtaHref}
              variant="primary"
              mobileFull
            >
              {FINAL_CTA_CONTENT.primaryCtaLabel}
            </MarketingButton>
            <MarketingButton
              href={FINAL_CTA_CONTENT.secondaryCtaHref}
              variant="secondary"
              mobileFull
            >
              {FINAL_CTA_CONTENT.secondaryCtaLabel}
            </MarketingButton>
          </div>

          <ul className="mkt-final-cta-trust" aria-label="Platform highlights">
            {FINAL_CTA_TRUST_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
