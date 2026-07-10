import { AIExperienceCapabilityCard } from "@/components/marketing/landing/AIExperienceCapabilityCard";
import { AIExperiencePreview } from "@/components/marketing/landing/AIExperiencePreview";
import {
  mktOverlineClass,
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
      className="mkt-ai-experience-section"
      aria-labelledby="ai-experience-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_EXPERIENCE_CONTENT.overline}</p>
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

        <div className={cn(mktSectionBodyClass, "mkt-ai-capabilities-grid")}>
          {AI_EXPERIENCE_CAPABILITIES.map((capability) => (
            <AIExperienceCapabilityCard
              key={capability.id}
              capability={capability}
            />
          ))}
        </div>

        <div className="mt-8 lg:mt-9">
          <AIExperiencePreview />
        </div>
      </div>
    </section>
  );
}
