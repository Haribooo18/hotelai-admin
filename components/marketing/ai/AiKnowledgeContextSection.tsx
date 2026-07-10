import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  AI_PAGE_CONTEXT_ICONS,
  AI_PAGE_KNOWLEDGE_CONTEXT,
} from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiKnowledgeContextSection() {
  return (
    <section
      id={AI_PAGE_KNOWLEDGE_CONTEXT.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="ai-knowledge-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_KNOWLEDGE_CONTEXT.overline}</p>
          <h2 id="ai-knowledge-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_KNOWLEDGE_CONTEXT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {AI_PAGE_KNOWLEDGE_CONTEXT.subhead}
          </p>
        </header>

        <ul className={cn(mktSectionBodyClass, "mkt-ai-page-context-grid")}>
          {AI_PAGE_KNOWLEDGE_CONTEXT.sources.map((source) => {
            const Icon = AI_PAGE_CONTEXT_ICONS[source.id as keyof typeof AI_PAGE_CONTEXT_ICONS];

            return (
              <li key={source.id} className="mkt-features-overview-card">
                <div className="mkt-features-workspace-icon" aria-hidden>
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="mkt-features-card-title">{source.title}</h3>
                <p className="mkt-features-card-description">{source.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
