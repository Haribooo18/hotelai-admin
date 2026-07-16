import type { SecurityInfrastructureItem } from "@/lib/marketing/security-page";

type Props = {
  item: SecurityInfrastructureItem;
};

export function SecurityInfrastructureCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <li className="mkt-features-benefit-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{item.title}</h3>
      <p className="mkt-features-card-description">{item.description}</p>
    </li>
  );
}
