import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  FINAL_CTA_SECTION_ID,
  getFinalCtaContent,
  type FinalCtaVariant,
} from "@/lib/marketing/final-cta";
import { cn } from "@/lib/utils";

type Props = {
  variant?: FinalCtaVariant;
};

export function FinalCtaSection({ variant = "default" }: Props) {
  const content = getFinalCtaContent(variant);

  return (
    <section
      id={FINAL_CTA_SECTION_ID}
      className="mkt-final-cta-section"
      aria-labelledby="final-cta-heading"
    >
      <div className="mkt-container-wide">
        <div className="mkt-final-cta-panel">
          <h2
            id="final-cta-heading"
            className={cn(mktSectionHeadlineClass, "mt-0 text-center")}
          >
            {content.headline}
          </h2>

          <p className={cn(mktSectionSubheadClass, "mx-auto text-center")}>
            {content.subhead}
          </p>

          <div className="mkt-final-cta-actions">
            <MarketingButton
              href={content.primaryCtaHref}
              variant="primary"
              size="section"
              mobileFull
            >
              {content.primaryCtaLabel}
            </MarketingButton>
            <MarketingButton
              href={content.secondaryCtaHref}
              variant="secondary"
              size="section"
              mobileFull
            >
              {content.secondaryCtaLabel}
            </MarketingButton>
          </div>

          <ul className="mkt-final-cta-trust" aria-label="Platform highlights">
            {content.trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
