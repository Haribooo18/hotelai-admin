import type { FeaturesWorkspace } from "@/lib/marketing/features-page";

type Props = {
  workspace: FeaturesWorkspace;
};

export function FeaturesWorkspaceCard({ workspace }: Props) {
  const Icon = workspace.icon;

  return (
    <li className="mkt-features-workspace-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{workspace.title}</h3>
      <p className="mkt-features-card-description">{workspace.description}</p>
    </li>
  );
}
