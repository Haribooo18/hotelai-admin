import { IntegrationsAvailableSection } from "./IntegrationsAvailableSection";
import { IntegrationsBenefitsSection } from "./IntegrationsBenefitsSection";
import { IntegrationsFutureSection } from "./IntegrationsFutureSection";
import { IntegrationsGuestCommunicationSection } from "./IntegrationsGuestCommunicationSection";
import { IntegrationsPageHero } from "./IntegrationsPageHero";

export function IntegrationsPage() {
  return (
    <main className="overflow-x-hidden">
      <IntegrationsPageHero />

      <IntegrationsAvailableSection />

      <IntegrationsGuestCommunicationSection />

      <IntegrationsBenefitsSection />

      <IntegrationsFutureSection />
    </main>
  );
}