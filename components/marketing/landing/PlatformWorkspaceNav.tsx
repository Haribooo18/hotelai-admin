import type { PlatformWorkspace, PlatformWorkspaceId } from "@/lib/marketing/platform";
import { cn } from "@/lib/utils";

type Props = {
  workspaces: PlatformWorkspace[];
  activeId: PlatformWorkspaceId;
  onSelect: (id: PlatformWorkspaceId) => void;
};

export function PlatformWorkspaceNav({ workspaces, activeId, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Monavel workspaces"
      className="mkt-workspace-nav"
    >
      {workspaces.map((workspace) => {
        const isActive = workspace.id === activeId;
        return (
          <button
            key={workspace.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "mkt-workspace-tab",
              isActive && "mkt-workspace-tab-active"
            )}
            onClick={() => onSelect(workspace.id)}
          >
            {workspace.label}
          </button>
        );
      })}
    </div>
  );
}
