import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { FeaturesAiIntegrationsSection } from "@/components/marketing/features/FeaturesAiIntegrationsSection";
import { FeaturesBenefitsSection } from "@/components/marketing/features/FeaturesBenefitsSection";
import { FeaturesOperationsWorkflowSection } from "@/components/marketing/features/FeaturesOperationsWorkflowSection";
import { FeaturesPageHero } from "@/components/marketing/features/FeaturesPageHero";
import { FeaturesPlatformOverviewSection } from "@/components/marketing/features/FeaturesPlatformOverviewSection";
import { FeaturesWorkspaceGridSection } from "@/components/marketing/features/FeaturesWorkspaceGridSection";

export function FeaturesPage() {
  return (
    <>
      <FeaturesPageHero />
      <FeaturesPlatformOverviewSection />
      <FeaturesWorkspaceGridSection />
      <FeaturesAiIntegrationsSection />
      <FeaturesOperationsWorkflowSection />
      <FeaturesBenefitsSection />
      <FinalCtaSection />
    </>
  );
}
