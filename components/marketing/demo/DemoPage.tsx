import { DemoBookingFormSection } from "@/components/marketing/demo/DemoBookingFormSection";
import { DemoFaqSection } from "@/components/marketing/demo/DemoFaqSection";
import { DemoPageHero } from "@/components/marketing/demo/DemoPageHero";
import { DemoPreviewSection } from "@/components/marketing/demo/DemoPreviewSection";

export function DemoPage() {
  return (
    <>
      <DemoPageHero />
      <DemoPreviewSection />
      <DemoBookingFormSection />
      <DemoFaqSection />
    </>
  );
}
