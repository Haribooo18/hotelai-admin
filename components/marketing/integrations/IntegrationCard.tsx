import type { IntegrationItem } from "@/lib/marketing/integrations-page";
import { INTEGRATION_STATUS_LABELS } from "@/lib/marketing/integrations-page";

type Props = {
  integration: IntegrationItem;
};

export function IntegrationCard({ integration }: Props) {
  const Icon = integration.icon;
  const statusLabel = INTEGRATION_STATUS_LABELS[integration.status];

  return (
    <li className="mkt-features-integration-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <div className="mkt-features-integration-header">
        <h3 className="mkt-features-card-title">{integration.title}</h3>

        {statusLabel ? (
          <span
            className={
              integration.status === "available"
                ? "mkt-integration-badge-available"
                : "mkt-features-integration-badge"
            }
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <p className="mkt-features-card-description">
        {integration.description}
      </p>
    </li>
  );
}