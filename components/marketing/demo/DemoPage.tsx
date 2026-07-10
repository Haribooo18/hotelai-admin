import { FinalCtaSection } from "@/components/marketing/landing/FinalCtaSection";
import { DemoAudienceSection } from "@/components/marketing/demo/DemoAudienceSection";
import { DemoBookingFormSection } from "@/components/marketing/demo/DemoBookingFormSection";
import { DemoFaqSection } from "@/components/marketing/demo/DemoFaqSection";
import { DemoPageHero } from "@/components/marketing/demo/DemoPageHero";
import { DemoPreviewSection } from "@/components/marketing/demo/DemoPreviewSection";
import { DemoProcessSection } from "@/components/marketing/demo/DemoProcessSection";

export function DemoPage() {
  return (
    <>
      <DemoPageHero />
      <DemoPreviewSection />
      <DemoProcessSection />
      <DemoAudienceSection />
      <DemoBookingFormSection />
      <DemoFaqSection />
      <FinalCtaSection variant="demo" />
    </>
  );
}
