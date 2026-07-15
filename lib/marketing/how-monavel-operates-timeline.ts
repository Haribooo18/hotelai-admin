import type { AiWorkspaceState, SystemNodeStatus } from "@/lib/marketing/how-monavel-works";
import { HOTEL_SYSTEMS } from "@/lib/marketing/how-monavel-works";

/**
 * Cinematic playback phase for the operate-the-hotel demonstration.
 * Narrative acts map onto these engine phases without changing the loop architecture.
 *
 * Act 1 Guest Intent        → request
 * Act 2 Runtime Understanding → understanding (+ brief decision)
 * Act 3 Hotel Synchronization → execution
 * Act 4 Hotel Ready           → context → reply → summary → idle
 */
export type OperatePhase =
  | "dormant"
  | "request"
  | "understanding"
  | "decision"
  | "execution"
  | "context"
  | "reply"
  | "summary"
  | "idle";

export type ReplyDeliveryStatus = "idle" | "sending" | "sent";

export type OperatePlaybackSnapshot = {
  phase: OperatePhase;
  aiState: AiWorkspaceState;
  guestRequestActive: boolean;
  requestConnector: "idle" | "active" | "done";
  systemsConnector: "idle" | "active" | "done";
  contextConnector: "idle" | "active" | "done";
  replyConnector: "idle" | "active" | "done";
  /** How many Runtime understanding lines are revealed (0–3). */
  understandingCount: number;
  /** Kept for engine compatibility; mirrors understanding in Act 2. */
  decisionCount: number;
  systemStatuses: readonly SystemNodeStatus[];
  /** Index of the system currently aligning (−1 if none). */
  processingSystemIndex: number;
  /** How many context elements are revealed (0–5). */
  contextCount: number;
  contextVisible: boolean;
  replyVisible: boolean;
  replyStatus: ReplyDeliveryStatus;
  summaryVisible: boolean;
  idle: boolean;
  executionProgress: string;
  executionTarget: string;
};

/** Story duration in ms before idle. */
export const OPERATE_STORY_MS = 8000;
/** Calm hold after completion before loop restart. */
export const OPERATE_IDLE_MS = 5000;
/** Full loop length. */
export const OPERATE_CYCLE_MS = OPERATE_STORY_MS + OPERATE_IDLE_MS;

/** Small stagger so systems feel coordinated, not pipelined. */
export const OPERATE_SYSTEM_STAGGER_MS = 130;

const SYSTEM_COUNT = HOTEL_SYSTEMS.length;
const RUNTIME_STEPS = 3;

function pendingSystems(): SystemNodeStatus[] {
  return Array.from({ length: SYSTEM_COUNT }, () => "pending" as const);
}

function completedSystems(): SystemNodeStatus[] {
  return Array.from({ length: SYSTEM_COUNT }, () => "completed" as const);
}

function clampCount(value: number, max: number): number {
  if (value <= 0) return 0;
  if (value >= max) return max;
  return value;
}

function baseSnapshot(
  overrides: Partial<OperatePlaybackSnapshot> &
    Pick<OperatePlaybackSnapshot, "phase" | "aiState">
): OperatePlaybackSnapshot {
  return {
    guestRequestActive: true,
    requestConnector: "idle",
    systemsConnector: "idle",
    contextConnector: "idle",
    replyConnector: "idle",
    understandingCount: 0,
    decisionCount: 0,
    systemStatuses: pendingSystems(),
    processingSystemIndex: -1,
    contextCount: 0,
    contextVisible: false,
    replyVisible: false,
    replyStatus: "idle",
    summaryVisible: false,
    idle: false,
      executionProgress: "Hotel systems syncing",
    executionTarget: "Hotel",
    ...overrides,
  };
}

/**
 * Pure timeline: maps elapsed ms within one cycle to a playback snapshot.
 * Four narrative acts × ~2s; last 2s progressively still.
 */
export function deriveOperatePlayback(elapsedMs: number): OperatePlaybackSnapshot {
  const t = ((elapsedMs % OPERATE_CYCLE_MS) + OPERATE_CYCLE_MS) % OPERATE_CYCLE_MS;

  if (t >= OPERATE_STORY_MS) {
    return baseSnapshot({
      phase: "idle",
      aiState: "completed",
      requestConnector: "done",
      systemsConnector: "done",
      contextConnector: "done",
      replyConnector: "done",
      understandingCount: RUNTIME_STEPS,
      decisionCount: RUNTIME_STEPS,
      systemStatuses: completedSystems(),
      contextCount: 5,
      contextVisible: true,
      replyVisible: true,
      replyStatus: "sent",
      summaryVisible: true,
      idle: true,
      executionProgress: "Hotel systems synced",
    });
  }

  // Act 1 — 0–2s: Guest Intent only. Runtime has not acted.
  if (t < 2000) {
    return baseSnapshot({
      phase: "request",
      aiState: "understanding",
      requestConnector: t >= 1600 ? "active" : "idle",
    });
  }

  // Act 2 — 2–4s: Runtime Understanding (intelligent, not procedural).
  if (t < 4000) {
    const local = t - 2000;
    const understandingCount = clampCount(
      Math.floor(local / 500) + 1,
      RUNTIME_STEPS
    );
    const phase: OperatePhase = local < 1400 ? "understanding" : "decision";
    return baseSnapshot({
      phase,
      aiState: "understanding",
      requestConnector: "done",
      understandingCount,
      decisionCount: understandingCount,
      executionProgress: "Building one operational understanding",
    });
  }

  // Act 3 — 4–6s: Hotel Synchronization — quiet stagger, coordinated not pipelined.
  if (t < 6000) {
    const local = t - 4000;
    const step = Math.min(
      SYSTEM_COUNT,
      Math.floor(local / OPERATE_SYSTEM_STAGGER_MS)
    );
    const statuses = pendingSystems();
    for (let i = 0; i < Math.min(step, SYSTEM_COUNT); i += 1) {
      statuses[i] = "completed";
    }
    const processingIndex =
      step < SYSTEM_COUNT && local < SYSTEM_COUNT * OPERATE_SYSTEM_STAGGER_MS
        ? step
        : -1;
    if (processingIndex >= 0) {
      statuses[processingIndex] = "processing";
    }
    const allDone = step >= SYSTEM_COUNT;
    return baseSnapshot({
      phase: "execution",
      aiState: "execution",
      requestConnector: "done",
      systemsConnector: allDone ? "done" : "active",
      understandingCount: RUNTIME_STEPS,
      decisionCount: RUNTIME_STEPS,
      systemStatuses: allDone ? completedSystems() : statuses,
      processingSystemIndex: processingIndex,
      executionProgress: allDone
        ? "Hotel systems synced"
        : "Hotel systems syncing",
      executionTarget: "Hotel",
    });
  }

  // Act 4 — 6–8s: Hotel Ready — progressively calmer, ending almost still.
  if (t < 6600) {
    const contextCount = clampCount(Math.floor((t - 6000) / 100) + 1, 5);
    return baseSnapshot({
      phase: "context",
      aiState: "completed",
      requestConnector: "done",
      systemsConnector: "done",
      contextConnector: "active",
      understandingCount: RUNTIME_STEPS,
      decisionCount: RUNTIME_STEPS,
      systemStatuses: completedSystems(),
      contextCount,
      contextVisible: true,
      executionProgress: "Hotel systems synced",
    });
  }

  if (t < 7200) {
    const replyStatus: ReplyDeliveryStatus = t < 6800 ? "sending" : "sent";
    return baseSnapshot({
      phase: "reply",
      aiState: "completed",
      requestConnector: "done",
      systemsConnector: "done",
      contextConnector: "done",
      replyConnector: "active",
      understandingCount: RUNTIME_STEPS,
      decisionCount: RUNTIME_STEPS,
      systemStatuses: completedSystems(),
      contextCount: 5,
      contextVisible: true,
      replyVisible: true,
      replyStatus,
      executionProgress: "Hotel systems synced",
    });
  }

  // Final calm beat — almost motionless confidence.
  return baseSnapshot({
    phase: "summary",
    aiState: "completed",
    requestConnector: "done",
    systemsConnector: "done",
    contextConnector: "done",
    replyConnector: "done",
    understandingCount: RUNTIME_STEPS,
    decisionCount: RUNTIME_STEPS,
    systemStatuses: completedSystems(),
    contextCount: 5,
    contextVisible: true,
    replyVisible: true,
    replyStatus: "sent",
    summaryVisible: true,
    executionProgress: "Hotel systems synced",
  });
}

/** Final completed snapshot for reduced-motion and SSR fallback. */
export function getOperateFinalSnapshot(): OperatePlaybackSnapshot {
  return deriveOperatePlayback(OPERATE_STORY_MS);
}

export function snapshotsEqual(
  a: OperatePlaybackSnapshot,
  b: OperatePlaybackSnapshot
): boolean {
  if (a.phase !== b.phase) return false;
  if (a.aiState !== b.aiState) return false;
  if (a.guestRequestActive !== b.guestRequestActive) return false;
  if (a.requestConnector !== b.requestConnector) return false;
  if (a.systemsConnector !== b.systemsConnector) return false;
  if (a.contextConnector !== b.contextConnector) return false;
  if (a.replyConnector !== b.replyConnector) return false;
  if (a.understandingCount !== b.understandingCount) return false;
  if (a.decisionCount !== b.decisionCount) return false;
  if (a.processingSystemIndex !== b.processingSystemIndex) return false;
  if (a.contextCount !== b.contextCount) return false;
  if (a.contextVisible !== b.contextVisible) return false;
  if (a.replyVisible !== b.replyVisible) return false;
  if (a.replyStatus !== b.replyStatus) return false;
  if (a.summaryVisible !== b.summaryVisible) return false;
  if (a.idle !== b.idle) return false;
  if (a.executionProgress !== b.executionProgress) return false;
  if (a.executionTarget !== b.executionTarget) return false;
  if (a.systemStatuses.length !== b.systemStatuses.length) return false;
  for (let i = 0; i < a.systemStatuses.length; i += 1) {
    if (a.systemStatuses[i] !== b.systemStatuses[i]) return false;
  }
  return true;
}
