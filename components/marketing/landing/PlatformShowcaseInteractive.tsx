"use client";

import { useState } from "react";

import { PlatformWorkspaceNav } from "@/components/marketing/landing/PlatformWorkspaceNav";
import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import {
  PLATFORM_DEFAULT_WORKSPACE_ID,
  PLATFORM_WORKSPACES,
} from "@/lib/marketing/platform";

export function PlatformShowcaseInteractive() {
  const [activeWorkspace, setActiveWorkspace] = useState<PlatformWorkspaceId>(
    PLATFORM_DEFAULT_WORKSPACE_ID
  );

  return (
    <div className="mkt-platform-showcase-stage">
      <div className="mkt-platform-showcase-shell">
        <div className="mkt-platform-showcase-nav">
          <PlatformWorkspaceNav
            workspaces={PLATFORM_WORKSPACES}
            activeId={activeWorkspace}
            onSelect={setActiveWorkspace}
          />
        </div>

        <div className="mkt-platform-showcase-visual mkt-platform-showcase-visual--wide">
          <div className="mkt-workspace-preview-stage" aria-live="polite">
            <WorkspacePreview
              key={activeWorkspace}
              workspaceId={activeWorkspace}
              presentation="platformShowcase"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
