import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktMotionRevealClass,
  mktOverlineClass,
  mktPageHeroHeadlineClass,
  mktPageHeroSubheadClass,
} from "@/lib/marketing/design";
import type { MarketingPageHeroPreview } from "@/lib/marketing/page-heroes";
import { cn } from "@/lib/utils";

type Cta = {
  label: string;
  href: string;
};

type Props = {
  headingId: string;
  overline: string;
  headline: string;
  headlineAccent?: string;
  subhead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  preview: MarketingPageHeroPreview;
  previewPriority?: boolean;
};

export function MarketingPageHero({
  headingId,
  overline,
  headline,
  headlineAccent,
  subhead,
  primaryCta,
  secondaryCta,
  preview,
  previewPriority = false,
}: Props) {
  return (
    <section className="mkt-page-hero" aria-labelledby={headingId}>
      <div className="mkt-container-wide">
        <div className="mkt-page-hero-grid">
          <div className="mkt-page-hero-copy">
            <p className={cn(mktOverlineClass, mktMotionRevealClass)} data-order="0">
              {overline}
            </p>

            <h1
              id={headingId}
              className={cn(mktPageHeroHeadlineClass, mktMotionRevealClass)}
              data-order="1"
            >
              {headline}
              {headlineAccent ? (
                <span className="mkt-page-hero-accent">{headlineAccent}</span>
              ) : null}
            </h1>

            <p
              className={cn(mktPageHeroSubheadClass, mktMotionRevealClass)}
              data-order="2"
            >
              {subhead}
            </p>

            <div
              className={cn("mkt-page-hero-actions", mktMotionRevealClass)}
              data-order="3"
            >
              <MarketingButton
                href={primaryCta.href}
                variant="primary"
                size="hero"
                mobileFull
              >
                {primaryCta.label}
              </MarketingButton>
              <MarketingButton
                href={secondaryCta.href}
                variant="secondary"
                size="hero"
                mobileFull
              >
                {secondaryCta.label}
              </MarketingButton>
            </div>
          </div>

          <div className={cn("mkt-page-hero-visual", mktMotionRevealClass)} data-order="4">
            <WorkspacePreview
              workspaceId={preview.workspace}
              presentation={preview.presentation}
              priority={previewPriority}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
