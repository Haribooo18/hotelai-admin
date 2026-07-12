import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktContainerWideClass,
  mktOverlineClass,
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
  const isHomepageCta = variant === "default";

  if (isHomepageCta) {
    return (
      <section
        id={FINAL_CTA_SECTION_ID}
        className="mkt-final-cta-section"
        aria-labelledby="final-cta-heading"
      >
        <div className={mktContainerWideClass}>
          <div className="mkt-final-cta-panel mkt-final-cta-panel--triad">
            <article className="mkt-final-cta-triad-card mkt-final-cta-triad-card--statement">
              {content.statement?.map((line, index) => (
                <p
                  key={line}
                  className={cn(
                    "mkt-final-cta-statement-line",
                    index === 1 && "mkt-final-cta-statement-line--accent"
                  )}
                >
                  {line}
                </p>
              ))}
            </article>

            <article className="mkt-final-cta-triad-card mkt-final-cta-triad-card--explanation">
              {content.overline ? (
                <p className={mktOverlineClass}>{content.overline}</p>
              ) : null}

              <h2
                id="final-cta-heading"
                className={cn(mktSectionHeadlineClass, "mt-0")}
              >
                {content.headline}
                {content.headlineAccent ? (
                  <span className="block text-[var(--mkt-accent)]">
                    {content.headlineAccent}
                  </span>
                ) : null}
              </h2>

              {content.body ? (
                <div className="mkt-final-cta-body">
                  {content.body.map((paragraph) => (
                    <p key={paragraph} className="mkt-final-cta-body-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="mkt-final-cta-triad-card mkt-final-cta-triad-card--action">
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
            </article>
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
