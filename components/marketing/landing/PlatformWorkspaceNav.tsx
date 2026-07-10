import type { PlatformWorkspace } from "@/lib/marketing/platform";
import { PLATFORM_DEFAULT_WORKSPACE_ID } from "@/lib/marketing/platform";
import { cn } from "@/lib/utils";

type Props = {
  workspaces: PlatformWorkspace[];
};

export function PlatformWorkspaceNav({ workspaces }: Props) {
  return (
    <div
      role="list"
      aria-label="Monavel workspaces"
      className="mkt-workspace-nav"
    >
      {workspaces.map((workspace) => {
        const isDefault = workspace.id === PLATFORM_DEFAULT_WORKSPACE_ID;
        return (
          <div
            key={workspace.id}
            role="listitem"
            aria-current={isDefault ? "true" : undefined}
            className={cn(
              "mkt-workspace-tab",
              isDefault && "mkt-workspace-tab-active"
            )}
          >
            {workspace.label}
          </div>
        );
      })}
    </div>
  );
}
