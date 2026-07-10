import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { SecurityAccessControlSection } from "@/components/marketing/security/SecurityAccessControlSection";
import { SecurityArchitectureSection } from "@/components/marketing/security/SecurityArchitectureSection";
import { SecurityFaqSection } from "@/components/marketing/security/SecurityFaqSection";
import { SecurityInfrastructureSection } from "@/components/marketing/security/SecurityInfrastructureSection";
import { SecurityPageHero } from "@/components/marketing/security/SecurityPageHero";
import { SecurityPrinciplesSection } from "@/components/marketing/security/SecurityPrinciplesSection";

export function SecurityPage() {
  return (
    <>
      <SecurityPageHero />
      <SecurityPrinciplesSection />
      <SecurityArchitectureSection />
      <SecurityAccessControlSection />
      <SecurityInfrastructureSection />
      <SecurityFaqSection />
      <FinalCtaSection />
    </>
  );
}
