import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import {
  mktMotionRevealClass,
  mktOverlineClass,
  mktPageHeroHeadlineClass,
  mktPageHeroSubheadClass,
} from "@/lib/marketing/design";
import { MARKETING_PAGE_HERO_PREVIEWS } from "@/lib/marketing/page-heroes";
import { MARKETING_CTA } from "@/lib/marketing/routes";
import { cn } from "@/lib/utils";

type Props = {
  overline: string;
  title: string;
  description: string;
  previewPriority?: boolean;
};

export function MarketingDocsHero({
  overline,
  title,
  description,
  previewPriority = false,
}: Props) {
  return (
    <section className="mkt-page-hero" aria-labelledby="docs-landing-heading">
      <div className="mkt-container-wide">
        <div className="mkt-page-hero-grid">
          <div className="mkt-page-hero-copy">
            <p className={cn(mktOverlineClass, mktMotionRevealClass)} data-order="0">
              {overline}
            </p>
            <h1
              id="docs-landing-heading"
              className={cn(mktPageHeroHeadlineClass, mktMotionRevealClass)}
              data-order="1"
            >
              {title}
            </h1>
            <p
              className={cn(mktPageHeroSubheadClass, mktMotionRevealClass)}
              data-order="2"
            >
              {description}
            </p>
            <div
              className={cn("mkt-page-hero-actions", mktMotionRevealClass)}
              data-order="3"
            >
              <MarketingButton
                href="/docs/getting-started"
                variant="primary"
                size="hero"
                mobileFull
              >
                Getting started
              </MarketingButton>
              <MarketingButton
                href={MARKETING_CTA.trial}
                variant="secondary"
                size="hero"
                mobileFull
              >
                Start free trial
              </MarketingButton>
            </div>
          </div>

          <div className={cn("mkt-page-hero-visual", mktMotionRevealClass)} data-order="4">
            <WorkspacePreview
              workspaceId={MARKETING_PAGE_HERO_PREVIEWS.docs.workspace}
              presentation={MARKETING_PAGE_HERO_PREVIEWS.docs.presentation}
              priority={previewPriority}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
