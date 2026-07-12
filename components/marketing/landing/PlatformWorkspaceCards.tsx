import type { PlatformWorkspace, PlatformWorkspaceId } from "@/lib/marketing/platform";
import { cn } from "@/lib/utils";

type Props = {
  workspaces: PlatformWorkspace[];
  activeId: PlatformWorkspaceId;
  onSelect: (id: PlatformWorkspaceId) => void;
};

export function PlatformWorkspaceCards({
  workspaces,
  activeId,
  onSelect,
}: Props) {
  return (
    <div
      className="mkt-workspace-cards"
      role="list"
      aria-label="Monavel workspaces"
    >
      {workspaces.map((workspace) => {
        const isActive = workspace.id === activeId;
        return (
          <button
            key={workspace.id}
            type="button"
            role="listitem"
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "mkt-workspace-card",
              isActive && "mkt-workspace-card--active"
            )}
            onClick={() => onSelect(workspace.id)}
          >
            <span className="mkt-workspace-card-label">{workspace.label}</span>
          </button>
        );
      })}
    </div>
  );
}
