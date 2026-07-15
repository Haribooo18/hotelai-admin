"use client";

import { Check, Mail } from "lucide-react";

import type { AiWorkspaceState, SystemNodeStatus } from "@/lib/marketing/how-monavel-works";
import {
  AI_DETECTED,
  AI_OPERATION_PLAN,
  AI_WORKSPACE,
  AI_WORKSPACE_STATES,
  GUEST_REPLY,
  GUEST_REQUEST,
  HOTEL_SYSTEMS,
  HOW_MONAVEL_WORKS_CONTENT,
  OPERATION_SUMMARY,
  UNIFIED_GUEST_CONTEXT,
} from "@/lib/marketing/how-monavel-works";
import type { OperatePlaybackSnapshot } from "@/lib/marketing/how-monavel-operates-timeline";
import { cn } from "@/lib/utils";

import { useHowMonavelOperatesTimeline } from "./useHowMonavelOperatesTimeline";

function GuestRequestCard({ active }: { active: boolean }) {
  return (
    <article
      className="mkt-operate-guest-request"
      data-active={active ? "true" : undefined}
      aria-label={GUEST_REQUEST.summary}
    >
      <div className="mkt-operate-guest-request-head">
        <span className="mkt-operate-guest-avatar" aria-hidden="true">
          {GUEST_REQUEST.guestName[0]}
        </span>
        <div className="mkt-operate-guest-request-meta">
          <span className="mkt-operate-guest-name">{GUEST_REQUEST.guestName}</span>
          <span className="mkt-operate-guest-channel">
            <Mail size={10} aria-hidden="true" />
            {GUEST_REQUEST.channel}
          </span>
        </div>
        <span className="mkt-operate-guest-time">{GUEST_REQUEST.time}</span>
      </div>
      <p className="mkt-operate-guest-message">{GUEST_REQUEST.message}</p>
      <div className="mkt-operate-guest-notes">
        {GUEST_REQUEST.contextNotes.map((note) => (
          <span key={note} className="mkt-operate-chip">
            {note}
          </span>
        ))}
      </div>
      <span className="mkt-operate-active-dot" aria-hidden="true" />
    </article>
  );
}

function AiChecklist({
  items,
  revealCount,
  quiet = false,
}: {
  items: readonly string[];
  revealCount?: number;
  quiet?: boolean;
}) {
  return (
    <ul
      className={cn(
        "mkt-operate-ai-checklist",
        quiet && "mkt-operate-ai-checklist--quiet"
      )}
    >
      {items.map((item, index) => (
        <li
          key={item}
          data-reveal={
            revealCount === undefined || index < revealCount ? "true" : undefined
          }
        >
          {!quiet ? <Check size={9} aria-hidden="true" /> : null}
          {item}
        </li>
      ))}
    </ul>
  );
}

function AiGuestBlock() {
  return (
    <section className="mkt-operate-ai-block">
      <span className="mkt-operate-ai-block-label">{AI_WORKSPACE.guestLabel}</span>
      <div className="mkt-operate-ai-identity">
        <span className="mkt-operate-ai-identity-name">{AI_WORKSPACE.guestName}</span>
        <span className="mkt-operate-ai-identity-room">{AI_WORKSPACE.room}</span>
      </div>
    </section>
  );
}

function AiReadyBlock({
  title,
  line,
}: {
  title: string;
  line?: string;
}) {
  return (
    <section className="mkt-operate-ai-block mkt-operate-ai-block--status">
      <span className="mkt-operate-ai-block-label">{AI_WORKSPACE.readyLabel}</span>
      <p className="mkt-operate-ai-completed-title">{title}</p>
      {line ? <p className="mkt-operate-ai-completed-line">{line}</p> : null}
    </section>
  );
}

function AiStatePanel({
  state,
  active,
  understandingCount,
}: {
  state: AiWorkspaceState;
  active: boolean;
  understandingCount: number;
}) {
  const showContext =
    understandingCount > 0 || state === "execution" || state === "completed";
  const showRuntime =
    understandingCount > 0 || state === "execution" || state === "completed";
  const statusTitle =
    state === "completed"
      ? AI_WORKSPACE.states.completed.title
      : AI_WORKSPACE.states.execution.statusLine;

  return (
    <div
      className="mkt-operate-ai-panel"
      data-ai-state={state}
      data-active={active ? "true" : undefined}
      hidden={!active}
    >
      <div
        className={cn(
          "mkt-operate-ai-console mkt-operate-ai-console--simple",
          state === "completed" && "mkt-operate-ai-console--ready"
        )}
      >
        <AiGuestBlock />
        <section className="mkt-operate-ai-block">
          <span className="mkt-operate-ai-block-label">
            {AI_WORKSPACE.contextLabel}
          </span>
          <AiChecklist
            items={AI_DETECTED}
            revealCount={showContext ? AI_DETECTED.length : 0}
          />
        </section>
        <section className="mkt-operate-ai-block">
          <span className="mkt-operate-ai-block-label">
            {AI_WORKSPACE.runtimeLabel}
          </span>
          <AiChecklist
            items={AI_OPERATION_PLAN}
            revealCount={showRuntime ? understandingCount : 0}
            quiet
          />
        </section>
        {state === "execution" || state === "completed" ? (
          <AiReadyBlock title={statusTitle} />
        ) : null}
      </div>
    </div>
  );
}

function MonavelAIWorkspace({
  activeState,
  understandingCount,
  processing,
}: {
  activeState: AiWorkspaceState;
  understandingCount: number;
  processing: boolean;
}) {
  const activeLabel = AI_WORKSPACE.states[activeState].label;
  const activeFooter = AI_WORKSPACE.states[activeState].footer;

  return (
    <article
      className="mkt-operate-ai"
      data-state={activeState}
      data-processing={processing ? "true" : undefined}
      aria-label={`Monavel AI workspace, ${activeLabel}`}
    >
      <header className="mkt-operate-ai-head">
        <div className="mkt-operate-ai-title-row">
          <h3 className="mkt-operate-ai-title">{AI_WORKSPACE.title}</h3>
          <span className="mkt-operate-live">
            <span className="mkt-operate-live-dot" aria-hidden="true" />
            Live
          </span>
        </div>
        <span className="mkt-operate-ai-state-label">{activeLabel}</span>
      </header>

      <div className="mkt-operate-ai-body">
        {AI_WORKSPACE_STATES.map((state) => (
          <AiStatePanel
            key={state}
            state={state}
            active={state === activeState}
            understandingCount={understandingCount}
          />
        ))}
      </div>

      <footer className="mkt-operate-ai-foot">{activeFooter}</footer>
    </article>
  );
}

function SystemNode({
  name,
  outcome,
  status,
}: {
  name: string;
  outcome: string;
  time: string;
  status: SystemNodeStatus;
}) {
  const statusLabel =
    status === "completed"
      ? "Synchronized"
      : status === "processing"
        ? "Aligning"
        : "Waiting";

  return (
    <li className="mkt-operate-system-node" data-status={status}>
      <div className="mkt-operate-system-top">
        <span className="mkt-operate-system-name">{name}</span>
        <span className="mkt-operate-system-status" aria-label={statusLabel}>
          {status === "completed" ? <Check size={9} aria-hidden="true" /> : null}
        </span>
      </div>
      <span className="mkt-operate-system-outcome">{outcome}</span>
    </li>
  );
}

function HotelSystemsRail({
  statuses,
  processingIndex,
  synchronized,
}: {
  statuses: readonly SystemNodeStatus[];
  processingIndex: number;
  synchronized: boolean;
}) {
  return (
    <div
      className="mkt-operate-systems"
      data-processing-index={processingIndex}
      data-mode="synchronized"
      data-sync-state={synchronized ? "synchronized" : "synchronizing"}
      role="group"
      aria-label="Connected hotel systems aligned by Monavel Runtime"
    >
      <span className="mkt-operate-systems-status-line" aria-hidden="true">
        {synchronized
          ? "Hotel systems synced"
          : "Hotel systems syncing"}
      </span>
      <ol className="mkt-operate-systems-rail">
        {HOTEL_SYSTEMS.map((node, index) => (
          <SystemNode
            key={node.id}
            name={node.name}
            outcome={node.outcome}
            time={node.time}
            status={statuses[index] ?? "pending"}
          />
        ))}
      </ol>
    </div>
  );
}

function UnifiedGuestContext({
  visible,
  revealCount,
}: {
  visible: boolean;
  revealCount: number;
}) {
  return (
    <article
      className="mkt-operate-context"
      data-visible={visible ? "true" : undefined}
      data-reveal-count={revealCount}
      aria-label={UNIFIED_GUEST_CONTEXT.summary}
    >
      <div className="mkt-operate-context-head">
        <span className="mkt-operate-guest-avatar" aria-hidden="true">
          {UNIFIED_GUEST_CONTEXT.guestName[0]}
        </span>
        <div className="mkt-operate-context-identity">
          <span className="mkt-operate-guest-name">
            {UNIFIED_GUEST_CONTEXT.guestName}
          </span>
          <span className="mkt-operate-context-badges">
            <span
              className="mkt-operate-badge"
              data-reveal={revealCount >= 1 ? "true" : undefined}
            >
              {UNIFIED_GUEST_CONTEXT.status}
            </span>
            <span
              className="mkt-operate-context-room"
              data-reveal={revealCount >= 2 ? "true" : undefined}
            >
              {UNIFIED_GUEST_CONTEXT.room}
            </span>
            <span
              className="mkt-operate-context-ready"
              data-reveal={revealCount >= 2 ? "true" : undefined}
            >
              {UNIFIED_GUEST_CONTEXT.roomState}
            </span>
          </span>
        </div>
      </div>
      <div className="mkt-operate-context-chips">
        {UNIFIED_GUEST_CONTEXT.chips.map((chip, index) => (
          <span
            key={chip}
            className="mkt-operate-chip"
            data-reveal={revealCount >= index + 3 ? "true" : undefined}
          >
            {chip}
          </span>
        ))}
      </div>
      <div
        className="mkt-operate-context-foot"
        data-reveal={revealCount >= 5 ? "true" : undefined}
      >
        <span className="mkt-operate-context-sync">
          <Check size={10} aria-hidden="true" />
          {UNIFIED_GUEST_CONTEXT.syncLabel}
        </span>
        <span className="mkt-operate-context-support">
          {UNIFIED_GUEST_CONTEXT.support}
        </span>
      </div>
    </article>
  );
}

function GuestReplyCard({
  visible,
  status,
}: {
  visible: boolean;
  status: OperatePlaybackSnapshot["replyStatus"];
}) {
  const statusLabel = status === "sending" ? "Sending…" : GUEST_REPLY.status;

  return (
    <article
      className="mkt-operate-reply"
      data-visible={visible ? "true" : undefined}
      data-status={status}
      aria-label={GUEST_REPLY.summary}
    >
      <div className="mkt-operate-reply-head">
        <div className="mkt-operate-reply-to-block">
          <span className="mkt-operate-reply-meta-label">To</span>
          <span className="mkt-operate-reply-to">{GUEST_REPLY.to}</span>
        </div>
        <span className="mkt-operate-guest-channel">
          <Mail size={10} aria-hidden="true" />
          {GUEST_REPLY.channel}
        </span>
      </div>
      <div className="mkt-operate-reply-subject-row">
        <span className="mkt-operate-reply-meta-label">Subject</span>
        <span className="mkt-operate-reply-subject">{GUEST_REPLY.subject}</span>
      </div>
      <div className="mkt-operate-reply-body">
        {GUEST_REPLY.bodyLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="mkt-operate-reply-foot">
        <span className="mkt-operate-reply-status">
          {status === "sent" ? <Check size={10} aria-hidden="true" /> : null}
          {statusLabel}
        </span>
        <span
          className="mkt-operate-guest-time"
          data-reveal={status === "sent" ? "true" : undefined}
        >
          {GUEST_REPLY.time}
        </span>
      </div>
    </article>
  );
}

function OperationSummary({ visible }: { visible: boolean }) {
  return (
    <p
      className="mkt-operate-summary"
      data-visible={visible ? "true" : undefined}
      role="status"
      aria-label={`${OPERATION_SUMMARY.title}. ${OPERATION_SUMMARY.line}. ${OPERATION_SUMMARY.duration}.`}
    >
      <span className="mkt-operate-summary-title">{OPERATION_SUMMARY.title}</span>
      <span className="mkt-operate-summary-line">{OPERATION_SUMMARY.line}</span>
      <span className="mkt-operate-summary-duration">{OPERATION_SUMMARY.duration}</span>
    </p>
  );
}

function OperateConnectors({
  requestConnector,
  systemsConnector,
  contextConnector,
  replyConnector,
}: {
  requestConnector: OperatePlaybackSnapshot["requestConnector"];
  systemsConnector: OperatePlaybackSnapshot["systemsConnector"];
  contextConnector: OperatePlaybackSnapshot["contextConnector"];
  replyConnector: OperatePlaybackSnapshot["replyConnector"];
}) {
  return (
    <svg
      className="mkt-operate-connectors"
      viewBox="0 0 1120 520"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="mkt-operate-connector mkt-operate-connector--request"
        data-state={requestConnector}
        d="M148 78 C220 78 280 118 368 158"
        fill="none"
        pathLength={100}
      />
      <path
        className="mkt-operate-connector mkt-operate-connector--systems"
        data-state={systemsConnector}
        d="M560 248 V292"
        fill="none"
        pathLength={100}
      />
      <path
        className="mkt-operate-connector mkt-operate-connector--context"
        data-state={contextConnector}
        d="M560 368 C560 390 470 412 390 420"
        fill="none"
        pathLength={100}
      />
      <path
        className="mkt-operate-connector mkt-operate-connector--reply"
        data-state={replyConnector}
        d="M390 448 C520 448 700 448 820 448"
        fill="none"
        pathLength={100}
      />
    </svg>
  );
}

function OperateSceneView({
  playback,
  className,
}: {
  playback: OperatePlaybackSnapshot;
  className?: string;
}) {
  const processing =
    playback.aiState === "understanding" || playback.aiState === "execution";

  return (
    <div
      className={cn("mkt-operate-scene", className)}
      data-phase={playback.phase}
      data-ai-state={playback.aiState}
      data-idle={playback.idle ? "true" : undefined}
    >
      <OperateConnectors
        requestConnector={playback.requestConnector}
        systemsConnector={playback.systemsConnector}
        contextConnector={playback.contextConnector}
        replyConnector={playback.replyConnector}
      />
      <div className="mkt-operate-scene-grid">
        <div className="mkt-operate-zone mkt-operate-zone--request">
          <GuestRequestCard active={playback.guestRequestActive} />
        </div>
        <div className="mkt-operate-zone mkt-operate-zone--ai">
          <MonavelAIWorkspace
            activeState={playback.aiState}
            understandingCount={playback.understandingCount}
            processing={processing}
          />
          <p className="mkt-operate-runtime-support">
            {HOW_MONAVEL_WORKS_CONTENT.runtimeSupport}
          </p>
        </div>
        <div className="mkt-operate-zone mkt-operate-zone--systems">
          <HotelSystemsRail
            statuses={playback.systemStatuses}
            processingIndex={playback.processingSystemIndex}
            synchronized={playback.aiState === "completed"}
          />
        </div>
        <div className="mkt-operate-zone mkt-operate-zone--result">
          <UnifiedGuestContext
            visible={playback.contextVisible}
            revealCount={playback.contextCount}
          />
          <GuestReplyCard
            visible={playback.replyVisible}
            status={playback.replyStatus}
          />
        </div>
        <div className="mkt-operate-zone mkt-operate-zone--summary">
          <OperationSummary visible={playback.summaryVisible} />
        </div>
      </div>
    </div>
  );
}

export function OperateScene({ className }: { className?: string }) {
  const playback = useHowMonavelOperatesTimeline(true);
  return <OperateSceneView playback={playback} className={className} />;
}
