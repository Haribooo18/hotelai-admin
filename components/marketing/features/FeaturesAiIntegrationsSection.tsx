import { FeaturesIntegrationCard } from "@/components/marketing/features/FeaturesIntegrationCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_AI_INTEGRATIONS } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesAiIntegrationsSection() {
  return (
    <section
      id={FEATURES_AI_INTEGRATIONS.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="features-integrations-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{FEATURES_AI_INTEGRATIONS.overline}</p>
          <h2
            id="features-integrations-heading"
            className={mktSectionHeadlineClass}
          >
            {FEATURES_AI_INTEGRATIONS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {FEATURES_AI_INTEGRATIONS.subhead}
          </p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-integration-grid")}
          aria-label="AI integrations"
        >
          {FEATURES_AI_INTEGRATIONS.integrations.map((integration) => (
            <FeaturesIntegrationCard
              key={integration.id}
              integration={integration}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
