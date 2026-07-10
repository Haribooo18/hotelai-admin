import { FeaturesWorkspaceCard } from "@/components/marketing/features/FeaturesWorkspaceCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_WORKSPACE_GRID } from "@/lib/marketing/features-page";
import { cn } from "@/lib/utils";

export function FeaturesWorkspaceGridSection() {
  return (
    <section
      id={FEATURES_WORKSPACE_GRID.sectionId}
      className="mkt-features-section"
      aria-labelledby="features-workspaces-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{FEATURES_WORKSPACE_GRID.overline}</p>
          <h2 id="features-workspaces-heading" className={mktSectionHeadlineClass}>
            {FEATURES_WORKSPACE_GRID.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {FEATURES_WORKSPACE_GRID.subhead}
          </p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-features-workspace-grid")}
          aria-label="Monavel workspaces"
        >
          {FEATURES_WORKSPACE_GRID.workspaces.map((workspace) => (
            <FeaturesWorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </ul>
      </div>
    </section>
  );
}
