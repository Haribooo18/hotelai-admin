"use client";

import { useRef } from "react";

import type {
  PlatformWorkspace,
  PlatformWorkspaceId,
} from "@/lib/marketing/platform";
import { cn } from "@/lib/utils";

type Props = {
  workspaces: PlatformWorkspace[];
  activeId: PlatformWorkspaceId;
  onSelect: (id: PlatformWorkspaceId) => void;
};

export function PlatformWorkspaceNav({
  workspaces,
  activeId,
  onSelect,
}: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);

  function scrollTabIntoView(button: HTMLButtonElement | null) {
    if (!button) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    button.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  function selectWorkspace(
    workspaceId: PlatformWorkspaceId,
    button: HTMLButtonElement
  ) {
    onSelect(workspaceId);
    scrollTabIntoView(button);
  }

  return (
    <div
      ref={listRef}
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
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "mkt-workspace-tab",
              isActive && "mkt-workspace-tab-active"
            )}
            onClick={(event) =>
              selectWorkspace(workspace.id, event.currentTarget)
            }
          >
            {workspace.label}
          </button>
        );
      })}
    </div>
  );
}