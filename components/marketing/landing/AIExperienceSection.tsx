import { AIExperienceCapabilityCard } from "@/components/marketing/landing/AIExperienceCapabilityCard";
import { AIExperiencePreview } from "@/components/marketing/landing/AIExperiencePreview";
import {
  mktOverlineClass,
  mktPlatformHeadlineClass,
  mktSubheadClass,
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
        <header className="max-w-3xl">
          <p className={mktOverlineClass}>{AI_EXPERIENCE_CONTENT.overline}</p>
          <h2
            id="ai-experience-heading"
            className={cn(mktPlatformHeadlineClass, "mt-4")}
          >
            {AI_EXPERIENCE_CONTENT.headline}
          </h2>
          <p className={cn(mktSubheadClass, "mt-6 max-w-2xl")}>
            {AI_EXPERIENCE_CONTENT.subhead}
          </p>
        </header>

        <div className="mkt-ai-capabilities-grid">
          {AI_EXPERIENCE_CAPABILITIES.map((capability) => (
            <AIExperienceCapabilityCard
              key={capability.id}
              capability={capability}
            />
          ))}
        </div>

        <div className="mt-10 lg:mt-12">
          <AIExperiencePreview />
        </div>
      </div>
    </section>
  );
}
