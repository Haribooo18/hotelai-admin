import { ArrowDown } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_HUMAN_WORKFLOW } from "@/lib/marketing/ai-page";

export function AiHumanWorkflowSection() {
  return (
    <section
      id={AI_PAGE_HUMAN_WORKFLOW.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="ai-human-workflow-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_HUMAN_WORKFLOW.overline}</p>
          <h2 id="ai-human-workflow-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_HUMAN_WORKFLOW.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {AI_PAGE_HUMAN_WORKFLOW.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <div className="mkt-ai-page-human-grid">
            <article className="mkt-ai-page-human-card">
              <h3 className="mkt-features-card-title">AI handles</h3>
              <ul className="mkt-ai-page-human-list">
                {AI_PAGE_HUMAN_WORKFLOW.aiHandles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <div className="mkt-ai-page-escalation" aria-hidden>
              <ArrowDown className="size-5" />
              <span>{AI_PAGE_HUMAN_WORKFLOW.escalationLabel}</span>
            </div>

            <article className="mkt-ai-page-human-card">
              <h3 className="mkt-features-card-title">Staff handles</h3>
              <ul className="mkt-ai-page-human-list">
                {AI_PAGE_HUMAN_WORKFLOW.staffHandles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
