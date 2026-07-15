import { AiClosingSection } from "@/components/marketing/ai/AiClosingSection";
import { AiCompareSection } from "@/components/marketing/ai/AiCompareSection";
import { AiConversationsSection } from "@/components/marketing/ai/AiConversationsSection";
import { AiNightSection } from "@/components/marketing/ai/AiNightSection";
import { AiPageHero } from "@/components/marketing/ai/AiPageHero";
import { AiStatusSection } from "@/components/marketing/ai/AiStatusSection";

export function AiPage() {
  return (
    <>
      <AiPageHero />
      <AiNightSection />
      <AiCompareSection />
      <AiConversationsSection />
      <AiStatusSection />
      <AiClosingSection />
    </>
  );
}
