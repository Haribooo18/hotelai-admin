"use client";

import { Pause, Play, Sparkles } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import type {
  PlatformPerspectiveId,
  PlatformWorkspaceId,
} from "@/lib/marketing/platform";
import {
  PLATFORM_AUTOMATION_READINESS,
  PLATFORM_DEFAULT_PERSPECTIVE_ID,
  PLATFORM_PERSPECTIVES,
  PLATFORM_SHOWCASE_CONTENT,
  getPlatformPerspective,
} from "@/lib/marketing/platform";
import {
  setMockHotelRuntimePaused,
  useMockHotelRuntime,
} from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

function getRuntimeWorkspace(
  runtimeType: ReturnType<typeof useMockHotelRuntime>["event"]["type"]
): PlatformWorkspaceId {
  switch (runtimeType) {
    case "message":
    case "upsell":
      return "reception-ai";

    case "knowledge":
      return "knowledge";

    case "booking":
    case "payment":
      return "bookings";

    case "room":
    case "housekeeping":
      return "rooms";

    case "sync":
      return "dashboard";

    default:
      return "dashboard";
  }
}

function getPerspectiveForWorkspace(
  workspaceId: PlatformWorkspaceId
): PlatformPerspectiveId {
  if (workspaceId === "revenue") return "revenue";
  if (workspaceId === "knowledge") return "knowledge";
  if (workspaceId === "reception-ai") return "automation";

  return "operations";
}

export function PlatformShowcaseInteractive() {
  const runtime = useMockHotelRuntime();

  const [manualPerspectiveId, setManualPerspectiveId] =
    useState<PlatformPerspectiveId>(PLATFORM_DEFAULT_PERSPECTIVE_ID);

  const [manualViewId, setManualViewId] = useState<PlatformWorkspaceId>(
    getPlatformPerspective(PLATFORM_DEFAULT_PERSPECTIVE_ID).defaultViewId
  );

  const [storyMode, setStoryMode] = useState(true);
  const [paused, setPaused] = useState(false);

  const baseId = useId();

  const runtimeViewId = getRuntimeWorkspace(runtime.event.type);
  const runtimePerspectiveId = getPerspectiveForWorkspace(runtimeViewId);

  const activeViewId = storyMode ? runtimeViewId : manualViewId;
  const activePerspectiveId = storyMode
    ? runtimePerspectiveId
    : manualPerspectiveId;

  const activePerspective = getPlatformPerspective(activePerspectiveId);
  const showSecondaryNav = activePerspective.views.length > 1;
  const showAutomationReadiness = activePerspectiveId === "automation";

  function selectPerspective(perspectiveId: PlatformPerspectiveId) {
    const nextPerspective = getPlatformPerspective(perspectiveId);

    setStoryMode(false);
    setManualPerspectiveId(perspectiveId);
    setManualViewId(nextPerspective.defaultViewId);
  }

  function selectView(viewId: PlatformWorkspaceId) {
    setStoryMode(false);
    setManualPerspectiveId(getPerspectiveForWorkspace(viewId));
    setManualViewId(viewId);
  }

  function togglePaused() {
    setPaused((current) => {
      const next = !current;
      setMockHotelRuntimePaused(next);
      return next;
    });
  }

  return (
    <div className="mkt-platform-showcase-stage">
      <div
        className="mkt-platform-showcase-shell"
        aria-label="Monavel Runtime — one living hotel"
      >
        <header className="mkt-runtime-identity">
          <p className="mkt-runtime-status" role="status">
            <span className="mkt-runtime-status-dot" aria-hidden="true" />
            <span className="mkt-runtime-status-label">
              {PLATFORM_SHOWCASE_CONTENT.runtimeStatus}
            </span>
          </p>

          <div
            className="mkt-runtime-shared-context"
            aria-label={`${runtime.hotel.name}. ${runtime.guest.name}. Reservation ${runtime.guest.reservation}. ${runtime.guest.room}.`}
          >
            <span className="mkt-runtime-hotel-live" aria-hidden="true">
              {runtime.hotel.name} • Live
            </span>

            <span className="mkt-runtime-hotel-identity" aria-hidden="true">
              <span>{runtime.guest.name}</span>
              <span>Reservation #{runtime.guest.reservation}</span>
              <span>{runtime.guest.room}</span>
            </span>
          </div>
        </header>

        <div className="mku-story-rail">
          <div className="mku-story-copy">
            <div className="mku-story-kicker">
              <Sparkles size={12} aria-hidden />
              Live scenario
            </div>

            <p className="mku-story-title">{runtime.story.title}</p>
            <p className="mku-story-summary">{runtime.story.summary}</p>
          </div>

          <div className="mku-story-controls">
            <div
              className="mku-story-progress"
              aria-label={`Step ${runtime.story.step} of ${runtime.story.totalSteps}`}
            >
              {Array.from({ length: runtime.story.totalSteps }).map(
                (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "mku-story-progress-step",
                      index < runtime.story.step &&
                        "mku-story-progress-step-active"
                    )}
                  />
                )
              )}
            </div>

            <button
              type="button"
              className={cn(
                "mku-story-mode-button",
                storyMode && "mku-story-mode-button-active"
              )}
              aria-pressed={storyMode}
              onClick={() => setStoryMode((current) => !current)}
            >
              Story mode
            </button>

            <button
              type="button"
              className="mku-story-icon-button"
              aria-label={paused ? "Resume runtime" : "Pause runtime"}
              onClick={togglePaused}
            >
              {paused ? (
                <Play size={12} aria-hidden />
              ) : (
                <Pause size={12} aria-hidden />
              )}
            </button>
          </div>
        </div>

        <PerspectiveNav
          activeId={activePerspectiveId}
          onSelect={selectPerspective}
          tabIdPrefix={baseId}
        />

        {(showSecondaryNav || showAutomationReadiness) && (
          <div className="mkt-platform-showcase-chrome">
            {showSecondaryNav ? (
              <ViewNav
                views={activePerspective.views}
                activeId={activeViewId}
                onSelect={selectView}
                perspectiveLabel={activePerspective.label}
              />
            ) : null}

            {showAutomationReadiness ? (
              <p
                className="mkt-runtime-automation-readiness"
                aria-label="Automation readiness"
              >
                {PLATFORM_AUTOMATION_READINESS.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
            ) : null}
          </div>
        )}

        <div
          className="mkt-platform-showcase-visual mkt-platform-showcase-visual--wide"
          role="tabpanel"
          id={`${baseId}-panel-${activePerspectiveId}`}
          aria-labelledby={`${baseId}-tab-${activePerspectiveId}`}
        >
          <div className="mkt-workspace-preview-stage" aria-live="polite">
            <div
              key={`${activePerspectiveId}-${activeViewId}`}
              className="mkt-workspace-preview-transition mku-workspace-enter"
            >
              <WorkspacePreview
                workspaceId={activeViewId}
                presentation="platformShowcase"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mkt-runtime-closing">
        {PLATFORM_SHOWCASE_CONTENT.closingLines.map((line) => (
          <span key={line} className="mkt-runtime-closing-line">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

function PerspectiveNav({
  activeId,
  onSelect,
  tabIdPrefix,
}: {
  activeId: PlatformPerspectiveId;
  onSelect: (id: PlatformPerspectiveId) => void;
  tabIdPrefix: string;
}) {
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

  function selectTab(
    perspectiveId: PlatformPerspectiveId,
    button: HTMLButtonElement
  ) {
    onSelect(perspectiveId);
    scrollTabIntoView(button);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = PLATFORM_PERSPECTIVES.findIndex(
      (perspective) => perspective.id === activeId
    );

    if (currentIndex < 0) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % PLATFORM_PERSPECTIVES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + PLATFORM_PERSPECTIVES.length) %
        PLATFORM_PERSPECTIVES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = PLATFORM_PERSPECTIVES.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const nextPerspective = PLATFORM_PERSPECTIVES[nextIndex];
    if (!nextPerspective) return;

    const nextButton = listRef.current?.querySelector<HTMLButtonElement>(
      `#${CSS.escape(`${tabIdPrefix}-tab-${nextPerspective.id}`)}`
    );

    onSelect(nextPerspective.id);
    nextButton?.focus({ preventScroll: true });
    scrollTabIntoView(nextButton ?? null);
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Hotel viewing modes"
      className="mkt-perspective-nav"
      onKeyDown={onKeyDown}
    >
      {PLATFORM_PERSPECTIVES.map((perspective) => {
        const isActive = perspective.id === activeId;

        return (
          <button
            key={perspective.id}
            type="button"
            role="tab"
            id={`${tabIdPrefix}-tab-${perspective.id}`}
            aria-selected={isActive}
            aria-controls={`${tabIdPrefix}-panel-${perspective.id}`}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "mkt-perspective-tab",
              isActive && "mkt-perspective-tab-active"
            )}
            onClick={(event) =>
              selectTab(perspective.id, event.currentTarget)
            }
          >
            {perspective.label}
          </button>
        );
      })}
    </div>
  );
}

function ViewNav({
  views,
  activeId,
  onSelect,
  perspectiveLabel,
}: {
  views: readonly {
    id: PlatformWorkspaceId;
    label: string;
  }[];
  activeId: PlatformWorkspaceId;
  onSelect: (id: PlatformWorkspaceId) => void;
  perspectiveLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={`${perspectiveLabel} views`}
      className="mkt-perspective-view-nav"
    >
      {views.map((view) => {
        const isActive = view.id === activeId;

        return (
          <button
            key={view.id}
            type="button"
            aria-pressed={isActive}
            className={cn(
              "mkt-perspective-view-tab",
              isActive && "mkt-perspective-view-tab-active"
            )}
            onClick={() => onSelect(view.id)}
          >
            {view.label}
          </button>
        );
      })}
    </div>
  );
}
