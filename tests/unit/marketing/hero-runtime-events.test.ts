import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ARCHITECTURE_DIAGRAM_V2_BASE_HEIGHT,
  ARCHITECTURE_DIAGRAM_V2_PATH_IDS,
  ARCHITECTURE_DIAGRAM_V2_PREVIOUS_BASE_HEIGHT,
} from "@/lib/marketing/architecture-diagram-v2-geometry";
import {
  assertHeroRuntimeEventsValid,
  deriveHeroRuntimePlayback,
  entranceFromElapsed,
  getHeroRuntimeIdleSnapshot,
  HERO_RUNTIME_CONNECTOR_PATH_IDS,
  HERO_RUNTIME_CYCLE_MS,
  HERO_RUNTIME_ENTRANCE,
  HERO_RUNTIME_ENTRANCE_MS,
  HERO_RUNTIME_EVENT_MS,
  HERO_RUNTIME_EVENTS,
  HERO_RUNTIME_TIMING,
  isRuntimeHighlighted,
} from "@/lib/marketing/hero-runtime-events";

describe("hero runtime events", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("references only valid source and destination nodes", () => {
    expect(assertHeroRuntimeEventsValid()).toBe(true);
    expect(HERO_RUNTIME_EVENTS.length).toBe(14);

    for (const event of HERO_RUNTIME_EVENTS) {
      expect(event.inboundPathId).toBe(`path-${event.sourceId}`);
      expect(event.outboundPathId).toBe(`path-${event.destinationId}`);
      expect(event.outcome.length).toBeGreaterThan(0);
      expect(event.sourceStatus.length).toBeGreaterThan(0);
      expect(event.outcome.length).toBeLessThan(40);
    }
  });

  it("keeps secondary acknowledgements on a minority of events", () => {
    const secondary = HERO_RUNTIME_EVENTS.filter((event) => event.secondaryId);
    expect(secondary.length).toBeGreaterThanOrEqual(4);
    expect(secondary.length / HERO_RUNTIME_EVENTS.length).toBeLessThanOrEqual(
      0.35
    );
    expect(secondary.length / HERO_RUNTIME_EVENTS.length).toBeGreaterThanOrEqual(
      0.25
    );
  });

  it("keeps idle longer than the event and within the target cadence", () => {
    expect(HERO_RUNTIME_TIMING.idle).toBe(3500);
    expect(HERO_RUNTIME_EVENT_MS).toBe(2100);
    expect(HERO_RUNTIME_CYCLE_MS).toBe(5600);
  });

  it("exposes a one-shot entrance before the first event", () => {
    expect(entranceFromElapsed(0)).toBe("pending");
    expect(entranceFromElapsed(HERO_RUNTIME_ENTRANCE.runtimeAt)).toBe(
      "runtime"
    );
    expect(entranceFromElapsed(HERO_RUNTIME_ENTRANCE.sourcesAt)).toBe(
      "sources"
    );
    expect(entranceFromElapsed(HERO_RUNTIME_ENTRANCE.destinationsAt)).toBe(
      "destinations"
    );
    expect(entranceFromElapsed(HERO_RUNTIME_ENTRANCE.connectorsAt)).toBe(
      "connectors"
    );
    expect(entranceFromElapsed(HERO_RUNTIME_ENTRANCE_MS)).toBe("complete");

    const beforeEvent = deriveHeroRuntimePlayback(
      HERO_RUNTIME_ENTRANCE.connectorsAt + 10
    );
    expect(beforeEvent.entrance).toBe("connectors");
    expect(beforeEvent.phase).toBe("idle");

    const firstEvent = deriveHeroRuntimePlayback(HERO_RUNTIME_ENTRANCE_MS + 10);
    expect(firstEvent.entrance).toBe("complete");
    expect(firstEvent.phase).toBe("sourceActive");
    expect(firstEvent.eventIndex).toBe(0);
    expect(firstEvent.sourceStatus).toBe(firstEvent.event.sourceStatus);
  });

  it("starts in idle with no active event emphasis", () => {
    const idle = getHeroRuntimeIdleSnapshot(0);
    expect(idle.phase).toBe("idle");
    expect(idle.sourceId).toBeNull();
    expect(idle.destinationId).toBeNull();
    expect(idle.inboundPathId).toBeNull();
    expect(idle.outboundPathId).toBeNull();
    expect(idle.outcome).toBeNull();
    expect(idle.sourceStatus).toBeNull();
    expect(idle.secondaryId).toBeNull();
    expect(idle.metadataId).toBeNull();
    expect(isRuntimeHighlighted(idle.phase)).toBe(false);
  });

  it("rotates events deterministically after entrance", () => {
    const first = deriveHeroRuntimePlayback(HERO_RUNTIME_ENTRANCE_MS + 10);
    const afterFirstEvent =
      HERO_RUNTIME_ENTRANCE_MS +
      HERO_RUNTIME_EVENT_MS +
      HERO_RUNTIME_TIMING.idle +
      10;
    const second = deriveHeroRuntimePlayback(afterFirstEvent);
    const wrapAt =
      HERO_RUNTIME_ENTRANCE_MS +
      HERO_RUNTIME_EVENT_MS +
      HERO_RUNTIME_CYCLE_MS * (HERO_RUNTIME_EVENTS.length - 1) +
      HERO_RUNTIME_TIMING.idle +
      10;
    const wrapped = deriveHeroRuntimePlayback(wrapAt);

    expect(first.eventIndex).toBe(0);
    expect(first.event.id).toBe(HERO_RUNTIME_EVENTS[0]!.id);
    expect(second.eventIndex).toBe(1);
    expect(second.event.id).toBe(HERO_RUNTIME_EVENTS[1]!.id);
    expect(wrapped.eventIndex).toBe(0);
    expect(wrapped.event.id).toBe(HERO_RUNTIME_EVENTS[0]!.id);
  });

  it("advances one causal phase at a time", () => {
    const t = HERO_RUNTIME_TIMING;
    const base = HERO_RUNTIME_ENTRANCE_MS;
    const phases = [
      { at: base + 1, phase: "sourceActive" as const },
      { at: base + t.sourceActive + 1, phase: "inbound" as const },
      {
        at: base + t.sourceActive + t.inbound + 1,
        phase: "runtimeActive" as const,
      },
      {
        at: base + t.sourceActive + t.inbound + t.runtimeActive + 1,
        phase: "outbound" as const,
      },
      {
        at:
          base +
          t.sourceActive +
          t.inbound +
          t.runtimeActive +
          t.outbound +
          1,
        phase: "destinationActive" as const,
      },
      {
        at:
          base +
          t.sourceActive +
          t.inbound +
          t.runtimeActive +
          t.outbound +
          t.destinationActive +
          1,
        phase: "secondarySync" as const,
      },
      {
        at:
          base +
          t.sourceActive +
          t.inbound +
          t.runtimeActive +
          t.outbound +
          t.destinationActive +
          t.secondarySync +
          1,
        phase: "settling" as const,
      },
    ];

    for (const step of phases) {
      const snap = deriveHeroRuntimePlayback(step.at);
      expect(snap.phase).toBe(step.phase);
      expect(snap.entrance).toBe("complete");

      const activePaths = [snap.inboundPathId, snap.outboundPathId].filter(
        Boolean
      );
      expect(activePaths.length).toBeLessThanOrEqual(1);

      if (snap.phase === "inbound") {
        expect(snap.inboundPathId).toBe(snap.event.inboundPathId);
        expect(snap.outboundPathId).toBeNull();
      }
      if (snap.phase === "outbound") {
        expect(snap.outboundPathId).toBe(snap.event.outboundPathId);
        expect(snap.inboundPathId).toBeNull();
      }
      if (snap.phase === "destinationActive") {
        expect(snap.destinationId).toBe(snap.event.destinationId);
        expect(snap.outcome).toBe(snap.event.outcome);
        expect(snap.secondaryId).toBeNull();
      }
      if (snap.phase === "secondarySync") {
        expect(snap.destinationId).toBeNull();
        expect(snap.outcome).toBeNull();
        if (snap.event.secondaryId) {
          expect(snap.secondaryId).toBe(snap.event.secondaryId);
        } else {
          expect(snap.secondaryId).toBeNull();
        }
      }
      if (snap.phase === "settling") {
        expect(snap.sourceId).toBeNull();
        expect(snap.destinationId).toBeNull();
        expect(snap.outcome).toBeNull();
        expect(snap.secondaryId).toBeNull();
      }
    }
  });

  it("highlights runtime only during acknowledgement through destination", () => {
    expect(isRuntimeHighlighted("idle")).toBe(false);
    expect(isRuntimeHighlighted("sourceActive")).toBe(false);
    expect(isRuntimeHighlighted("inbound")).toBe(false);
    expect(isRuntimeHighlighted("runtimeActive")).toBe(true);
    expect(isRuntimeHighlighted("outbound")).toBe(true);
    expect(isRuntimeHighlighted("destinationActive")).toBe(true);
    expect(isRuntimeHighlighted("secondarySync")).toBe(false);
    expect(isRuntimeHighlighted("settling")).toBe(false);
  });

  it("returns a stable idle snapshot under reduced motion", () => {
    const snap = deriveHeroRuntimePlayback(HERO_RUNTIME_ENTRANCE_MS + 500, true);
    expect(snap.phase).toBe("idle");
    expect(snap.entrance).toBe("complete");
    expect(snap.reducedMotion).toBe(true);
    expect(snap.sourceId).toBeNull();
    expect(snap.sourceStatus).toBeNull();
    expect(snap.secondaryId).toBeNull();
    expect(snap.metadataId).toBeNull();
    expect(snap.inboundPathId).toBeNull();
    expect(snap.outcome).toBeNull();
  });

  it("keeps connector path ids aligned with diagram geometry", () => {
    expect([...ARCHITECTURE_DIAGRAM_V2_PATH_IDS]).toEqual([
      ...HERO_RUNTIME_CONNECTOR_PATH_IDS,
    ]);
    expect(ARCHITECTURE_DIAGRAM_V2_BASE_HEIGHT).toBeLessThan(
      ARCHITECTURE_DIAGRAM_V2_PREVIOUS_BASE_HEIGHT
    );
    const ratio =
      ARCHITECTURE_DIAGRAM_V2_BASE_HEIGHT /
      ARCHITECTURE_DIAGRAM_V2_PREVIOUS_BASE_HEIGHT;
    expect(ratio).toBeGreaterThanOrEqual(0.82);
    expect(ratio).toBeLessThanOrEqual(0.88);
  });
});
