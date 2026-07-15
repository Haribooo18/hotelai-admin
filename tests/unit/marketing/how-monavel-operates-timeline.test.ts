import { describe, expect, it } from "vitest";

import {
  deriveOperatePlayback,
  getOperateFinalSnapshot,
  OPERATE_CYCLE_MS,
  OPERATE_IDLE_MS,
  OPERATE_STORY_MS,
  OPERATE_SYSTEM_STAGGER_MS,
} from "@/lib/marketing/how-monavel-operates-timeline";

describe("how monavel operates timeline", () => {
  it("keeps story and idle within the approved loop window", () => {
    expect(OPERATE_STORY_MS).toBe(8000);
    expect(OPERATE_IDLE_MS).toBe(5000);
    expect(OPERATE_CYCLE_MS).toBe(13000);
    expect(OPERATE_SYSTEM_STAGGER_MS).toBe(130);
  });

  it("Act 1: guest intent only — no Runtime action yet", () => {
    const snap = deriveOperatePlayback(800);
    expect(snap.phase).toBe("request");
    expect(snap.guestRequestActive).toBe(true);
    expect(snap.understandingCount).toBe(0);
    expect(snap.systemStatuses.every((status) => status === "pending")).toBe(true);
    expect(snap.summaryVisible).toBe(false);
    expect(snap.contextVisible).toBe(false);
  });

  it("Act 2: Runtime understanding reveals intelligent context lines", () => {
    const early = deriveOperatePlayback(2200);
    expect(early.phase).toBe("understanding");
    expect(early.aiState).toBe("understanding");
    expect(early.understandingCount).toBeGreaterThan(0);
    expect(early.systemStatuses.every((status) => status === "pending")).toBe(true);

    const late = deriveOperatePlayback(3600);
    expect(late.phase).toBe("decision");
    expect(late.aiState).toBe("understanding");
    expect(late.understandingCount).toBe(3);
  });

  it("Act 3: hotel systems synchronize with a short coordinated stagger", () => {
    const early = deriveOperatePlayback(4050);
    expect(early.phase).toBe("execution");
    expect(early.aiState).toBe("execution");
    expect(early.systemStatuses[0]).toBe("processing");

    const mid = deriveOperatePlayback(4400);
    expect(mid.systemStatuses[0]).toBe("completed");
    expect(mid.processingSystemIndex).toBeGreaterThan(0);

    const settled = deriveOperatePlayback(5200);
    expect(settled.systemStatuses.every((status) => status === "completed")).toBe(
      true
    );
    expect(settled.processingSystemIndex).toBe(-1);
  });

  it("Act 4: hotel ready — context, reply, then calm summary", () => {
    const context = deriveOperatePlayback(6200);
    expect(context.phase).toBe("context");
    expect(context.aiState).toBe("completed");
    expect(context.contextVisible).toBe(true);
    expect(context.replyVisible).toBe(false);

    const reply = deriveOperatePlayback(6900);
    expect(reply.phase).toBe("reply");
    expect(reply.replyVisible).toBe(true);
    expect(reply.summaryVisible).toBe(false);

    const summary = deriveOperatePlayback(7500);
    expect(summary.phase).toBe("summary");
    expect(summary.summaryVisible).toBe(true);
    expect(summary.replyStatus).toBe("sent");
  });

  it("holds a calm idle Live state after the story", () => {
    const idle = deriveOperatePlayback(OPERATE_STORY_MS + 1000);
    expect(idle.phase).toBe("idle");
    expect(idle.idle).toBe(true);
    expect(idle.aiState).toBe("completed");
    expect(idle.systemStatuses.every((status) => status === "completed")).toBe(true);
  });

  it("exposes a final snapshot for reduced-motion and SSR", () => {
    const finalState = getOperateFinalSnapshot();
    expect(finalState.aiState).toBe("completed");
    expect(finalState.summaryVisible).toBe(true);
    expect(finalState.replyStatus).toBe("sent");
  });
});
