import { AIExperienceCapabilityCard } from "@/components/marketing/landing/AIExperienceCapabilityCard";
import { AIExperiencePreview } from "@/components/marketing/landing/AIExperiencePreview";
import {
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  AI_EXPERIENCE_CAPABILITIES,
  AI_EXPERIENCE_CONTENT,
} from "@/lib/marketing/ai-experience";
import { cn } from "@/lib/utils";

export function AIExperienceSection() {
  return (
    <section
      id={AI_EXPERIENCE_CONTENT.sectionId}
      className="mkt-ai-experience-section mkt-section--visual-first"
      aria-labelledby="ai-experience-heading"
    >
      <div className="mkt-container-wide">
        <header className={cn(mktSectionHeaderClass, "mkt-section-header--split")}>
          <h2
            id="ai-experience-heading"
            className={mktSectionHeadlineClass}
          >
            {AI_EXPERIENCE_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {AI_EXPERIENCE_CONTENT.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-ai-experience-layout")}>
          <div className="mkt-ai-experience-preview">
            <AIExperiencePreview />
          </div>

          <div className="mkt-ai-capabilities-grid">
            {AI_EXPERIENCE_CAPABILITIES.map((capability) => (
              <AIExperienceCapabilityCard
                key={capability.id}
                capability={capability}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
