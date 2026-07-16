import { ContactJourneyPreview } from "@/components/marketing/contact/ContactJourneyPreview";
import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktMotionRevealClass,
  mktOverlineClass,
  mktPageHeroHeadlineClass,
  mktPageHeroSubheadClass,
} from "@/lib/marketing/design";
import { CONTACT_PAGE_HERO } from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

export function ContactPageHero() {
  return (
    <section
      className="mkt-page-hero border-b border-white/[0.05]"
      aria-labelledby="contact-page-hero-heading"
    >
      <div className="mkt-container-wide py-12 md:py-16 lg:py-18">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <div
            className={cn("min-w-0", mktMotionRevealClass)}
            style={{ animationDelay: "0ms" }}
          >
            <p className={mktOverlineClass}>{CONTACT_PAGE_HERO.overline}</p>

            <h1
              id="contact-page-hero-heading"
              className={cn(mktPageHeroHeadlineClass, "max-w-[8.2em]")}
            >
              {CONTACT_PAGE_HERO.headline}
            </h1>

            <p className={cn(mktPageHeroSubheadClass, "max-w-[36rem]")}>
              {CONTACT_PAGE_HERO.subhead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MarketingButton
                href={CONTACT_PAGE_HERO.primaryCtaHref}
                variant="primary"
              >
                {CONTACT_PAGE_HERO.primaryCtaLabel}
              </MarketingButton>

              <MarketingButton
                href={CONTACT_PAGE_HERO.secondaryCtaHref}
                variant="secondary"
              >
                {CONTACT_PAGE_HERO.secondaryCtaLabel}
              </MarketingButton>
            </div>
          </div>

          <div
            className={cn(
              "min-w-0 lg:-translate-y-3 lg:scale-[1.08]",
              mktMotionRevealClass
            )}
            style={{
              animationDelay: "55ms",
              transformOrigin: "center center",
            }}
          >
            <ContactJourneyPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
