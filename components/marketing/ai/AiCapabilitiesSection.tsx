import { AiCapabilityCard } from "@/components/marketing/ai/AiCapabilityCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_CAPABILITIES } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiCapabilitiesSection() {
  return (
    <section
      id={AI_PAGE_CAPABILITIES.sectionId}
      className="mkt-features-section"
      aria-labelledby="ai-capabilities-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_CAPABILITIES.overline}</p>
          <h2 id="ai-capabilities-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_CAPABILITIES.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{AI_PAGE_CAPABILITIES.subhead}</p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-workspace-grid")}
          aria-label="Monavel AI capabilities"
        >
          {AI_PAGE_CAPABILITIES.items.map((capability) => (
            <AiCapabilityCard key={capability.id} capability={capability} />
          ))}
        </ul>
      </div>
    </section>
  );
}
