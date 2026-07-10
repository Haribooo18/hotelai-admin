import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { ContactFaqSection } from "@/components/marketing/contact/ContactFaqSection";
import { ContactMethodsSection } from "@/components/marketing/contact/ContactMethodsSection";
import { ContactPageHero } from "@/components/marketing/contact/ContactPageHero";
import { ContactSalesFormSection } from "@/components/marketing/contact/ContactSalesFormSection";

export function ContactPage() {
  return (
    <>
      <ContactPageHero />
      <ContactMethodsSection />
      <ContactSalesFormSection />
      <ContactFaqSection />
      <FinalCtaSection variant="contact" />
    </>
  );
}
