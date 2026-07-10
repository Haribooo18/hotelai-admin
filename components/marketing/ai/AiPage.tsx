import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { AiBenefitsSection } from "@/components/marketing/ai/AiBenefitsSection";
import { AiCapabilitiesSection } from "@/components/marketing/ai/AiCapabilitiesSection";
import { AiGuestChannelsSection } from "@/components/marketing/ai/AiGuestChannelsSection";
import { AiHowItWorksSection } from "@/components/marketing/ai/AiHowItWorksSection";
import { AiHumanWorkflowSection } from "@/components/marketing/ai/AiHumanWorkflowSection";
import { AiKnowledgeContextSection } from "@/components/marketing/ai/AiKnowledgeContextSection";
import { AiPageHero } from "@/components/marketing/ai/AiPageHero";

export function AiPage() {
  return (
    <>
      <AiPageHero />
      <AiHowItWorksSection />
      <AiCapabilitiesSection />
      <AiKnowledgeContextSection />
      <AiGuestChannelsSection />
      <AiHumanWorkflowSection />
      <AiBenefitsSection />
      <FinalCtaSection variant="ai" />
    </>
  );
}
