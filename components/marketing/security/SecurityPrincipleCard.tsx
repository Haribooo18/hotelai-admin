import type { SecurityPrinciple } from "@/lib/marketing/security-page";

type Props = {
  principle: SecurityPrinciple;
};

export function SecurityPrincipleCard({ principle }: Props) {
  const Icon = principle.icon;

  return (
    <li className="mkt-features-workspace-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{principle.title}</h3>
      <p className="mkt-features-card-description">{principle.description}</p>
    </li>
  );
}
