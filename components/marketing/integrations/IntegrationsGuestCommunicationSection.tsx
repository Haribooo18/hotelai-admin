import {
  ArrowDown,
  ArrowRight,
  Bot,
  LayoutDashboard,
  MessagesSquare,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_GUEST_COMMUNICATION } from "@/lib/marketing/integrations-page";
import { cn } from "@/lib/utils";

const STEP_ICONS = [
  UserRound,
  MessagesSquare,
  Bot,
  LayoutDashboard,
  UsersRound,
] as const;

export function IntegrationsGuestCommunicationSection() {
  const steps = INTEGRATIONS_PAGE_GUEST_COMMUNICATION.steps;

  return (
    <section
      id={INTEGRATIONS_PAGE_GUEST_COMMUNICATION.sectionId}
      className="mkt-features-section"
      aria-labelledby="integrations-guest-communication-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.overline}
          </p>

          <h2
            id="integrations-guest-communication-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {INTEGRATIONS_PAGE_GUEST_COMMUNICATION.subhead}
          </p>
        </header>

        <div className={cn(mktSectionBodyClass, "mkt-integration-flow")}>
          <ol
            className="mkt-integration-flow-list"
            aria-label="Guest communication workflow"
          >
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? Bot;
              const hasNextStep = index < steps.length - 1;

              return (
                <li key={step.id} className="mkt-integration-flow-step">
                  <div className="mkt-integration-flow-card">
                    <div className="mkt-integration-flow-card-header">
                      <span
                        className="mkt-integration-flow-icon"
                        aria-hidden="true"
                      >
                        <Icon size={18} strokeWidth={1.6} />
                      </span>

                      <span
                        className="mkt-integration-flow-index"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mkt-integration-flow-label">{step.label}</p>
                  </div>

                  {hasNextStep ? (
                    <div
                      className="mkt-integration-flow-connector"
                      aria-hidden="true"
                    >
                      <ArrowRight
                        className="mkt-integration-flow-arrow mkt-integration-flow-arrow-horizontal"
                        strokeWidth={1.75}
                      />

                      <ArrowDown
                        className="mkt-integration-flow-arrow mkt-integration-flow-arrow-vertical"
                        strokeWidth={1.75}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}