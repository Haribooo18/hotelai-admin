import { SecurityAccessControlSection } from "@/components/marketing/security/SecurityAccessControlSection";
import { SecurityFaqSection } from "@/components/marketing/security/SecurityFaqSection";
import { SecurityInfrastructureSection } from "@/components/marketing/security/SecurityInfrastructureSection";
import { SecurityPageHero } from "@/components/marketing/security/SecurityPageHero";
import { SecurityPrinciplesSection } from "@/components/marketing/security/SecurityPrinciplesSection";

export function SecurityPage() {
  return (
    <>
      <SecurityPageHero />
      <SecurityPrinciplesSection />
      <SecurityAccessControlSection />
      <SecurityInfrastructureSection />
      <SecurityFaqSection />
    </>
  );
}