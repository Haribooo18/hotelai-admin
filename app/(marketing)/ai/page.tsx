import { AiPage } from "@/components/marketing";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { AI_PAGE_HERO } from "@/lib/marketing/ai-page";
import { buildWebPageJsonLd } from "@/lib/marketing/jsonld";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("ai");
}

export default function AiMarketingRoutePage() {
  return (
    <>
      <MarketingJsonLd
        data={buildWebPageJsonLd({
          title: `${AI_PAGE_HERO.headline} ${AI_PAGE_HERO.headlineAccent}`,
          description: AI_PAGE_HERO.lines.join(" "),
          path: "/ai",
        })}
      />
      <AiPage />
    </>
  );
}
