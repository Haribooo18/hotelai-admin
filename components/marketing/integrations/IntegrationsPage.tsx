import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { IntegrationsArchitectureSection } from "@/components/marketing/integrations/IntegrationsArchitectureSection";
import { IntegrationsAvailableSection } from "@/components/marketing/integrations/IntegrationsAvailableSection";
import { IntegrationsBenefitsSection } from "@/components/marketing/integrations/IntegrationsBenefitsSection";
import { IntegrationsFutureSection } from "@/components/marketing/integrations/IntegrationsFutureSection";
import { IntegrationsGuestCommunicationSection } from "@/components/marketing/integrations/IntegrationsGuestCommunicationSection";
import { IntegrationsPageHero } from "@/components/marketing/integrations/IntegrationsPageHero";

export function IntegrationsPage() {
  return (
    <>
      <IntegrationsPageHero />
      <IntegrationsAvailableSection />
      <IntegrationsGuestCommunicationSection />
      <IntegrationsFutureSection />
      <IntegrationsArchitectureSection />
      <IntegrationsBenefitsSection />
      <FinalCtaSection variant="integrations" />
    </>
  );
}
