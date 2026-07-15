import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktContainerWideClass,
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
  const isQuietCta = variant === "default" || variant === "ai";
  const trustItems = content.trustItems ?? [];

  if (isQuietCta) {
    return (
      <section
        id={FINAL_CTA_SECTION_ID}
        className="mkt-final-cta-section mkt-final-cta-section--closing"
        aria-labelledby="final-cta-heading"
      >
        <div className={mktContainerWideClass}>
          <div className="mkt-final-cta-closing">
            <h2
              id="final-cta-heading"
              className={cn(mktSectionHeadlineClass, "mkt-final-cta-closing-headline")}
            >
              {content.headline}
              {content.headlineAccent ? (
                <span className="mkt-final-cta-closing-accent">
                  {content.headlineAccent}
                </span>
              ) : null}
            </h2>

            {content.body ? (
              <div className="mkt-final-cta-closing-support">
                {content.body.map((line) => (
                  <p key={line} className="mkt-final-cta-closing-line">
                    {line}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mkt-final-cta-actions mkt-final-cta-actions--equal">
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={FINAL_CTA_SECTION_ID}
      className="mkt-final-cta-section"
      aria-labelledby="final-cta-heading"
    >
      <div className="mkt-container-focus">
        <div className="mkt-final-cta-panel mkt-final-cta-panel--executive">
          <h2
            id="final-cta-heading"
            className={cn(mktSectionHeadlineClass, "mt-0")}
          >
            {content.headline}
          </h2>

          {content.subhead ? (
            <p className={mktSectionSubheadClass}>{content.subhead}</p>
          ) : null}

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

          {trustItems.length > 0 ? (
            <ul className="mkt-final-cta-trust" aria-label="Platform highlights">
              {trustItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
