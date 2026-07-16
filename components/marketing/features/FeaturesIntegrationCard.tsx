import type { FeaturesIntegration } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

type Props = {
  integration: FeaturesIntegration;
};

export function FeaturesIntegrationCard({ integration }: Props) {
  const Icon = integration.icon;

  return (
    <li className="mkt-features-integration-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="mkt-features-integration-header">
        <h3 className="mkt-features-card-title">{integration.title}</h3>
        {integration.status === "planned" ? (
          <span className="mkt-features-integration-badge">Planned</span>
        ) : null}
      </div>
      <p className={cn("mkt-features-card-description", "mt-2")}>
        {integration.description}
      </p>
    </li>
  );
}
