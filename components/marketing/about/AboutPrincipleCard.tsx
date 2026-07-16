import type { AboutPrinciple } from "@/lib/marketing/about-page";

type Props = {
  principle: AboutPrinciple;
};

export function AboutPrincipleCard({ principle }: Props) {
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
