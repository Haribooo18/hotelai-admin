import { describe, expect, it } from "vitest";

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

describe("how monavel works content", () => {
  it("defines section metadata for the operate-the-hotel demonstration", () => {
    expect(HOW_MONAVEL_WORKS_CONTENT.sectionId).toBe("how-monavel-works");
    expect([...HOW_MONAVEL_WORKS_CONTENT.headlineLines]).toEqual([
      "One request",
      "Entire hotel ready",
    ]);
    expect(HOW_MONAVEL_WORKS_CONTENT.subhead).toContain(
      "Runtime builds one operational understanding"
    );
    expect(HOW_MONAVEL_WORKS_CONTENT.runtimeSupport).toBe(
      "Built from live reservations, hotel operations, business rules, and connected systems."
    );
    expect(HOW_MONAVEL_WORKS_CONTENT.defaultAiState).toBe("completed");
  });

  it("defines guest request, AI states, systems, context, reply, and summary", () => {
    expect(GUEST_REQUEST.guestName).toBe("Maria Thompson");
    expect(GUEST_REQUEST.message).toBe("Request invoice");
    expect([...GUEST_REQUEST.contextNotes]).toEqual([
      "Late arrival",
      "Parking requested",
      "Invoice requested",
    ]);
    expect(AI_WORKSPACE.title).toBe("Monavel AI");
    expect(AI_WORKSPACE_STATES).toEqual([
      "understanding",
      "decision",
      "execution",
      "completed",
    ]);
    expect(AI_DETECTED).toEqual([
      "Late arrival",
      "Parking requested",
      "Invoice requested",
    ]);
    expect(AI_OPERATION_PLAN).toEqual([
      "Understanding guest context",
      "Building one operational understanding",
      "One operational understanding established",
    ]);
    expect(AI_WORKSPACE.runtimeLine).toBe("Understanding guest context");
    expect(AI_WORKSPACE.states.decision.footer).toBe(
      "One operational understanding established"
    );
    expect(AI_WORKSPACE.states.execution.footer).toBe(
      "Hotel systems syncing"
    );
    expect(AI_WORKSPACE.states.completed.label).toBe("Live");
    expect(AI_WORKSPACE.states.completed.title).toBe(
      "Everything ready for arrival"
    );
    expect(AI_WORKSPACE.guestLabel).toBe("Guest");
    expect(AI_WORKSPACE.contextLabel).toBe("Guest Context");
    expect(AI_WORKSPACE.runtimeLabel).toBe("Runtime");
    expect(AI_WORKSPACE.readyLabel).toBe("Status");
    expect(HOTEL_SYSTEMS.map((system) => system.name)).toEqual([
      "PMS",
      "Housekeeping",
      "Parking",
      "Front Desk",
      "CRM",
      "Revenue",
    ]);
    expect(HOTEL_SYSTEMS[0]?.outcome).toBe("Updated");
    expect(HOTEL_SYSTEMS[5]?.outcome).toBe("Aware");
    expect(UNIFIED_GUEST_CONTEXT.guestName).toBe("Maria Thompson");
    expect(UNIFIED_GUEST_CONTEXT.support).toBe("Everything ready for arrival");
    expect(GUEST_REPLY.subject).toBe("Arrival confirmed");
    expect([...GUEST_REPLY.bodyLines]).toEqual([
      "Late arrival noted.",
      "Parking booked.",
      "Invoice ready at check-in.",
    ]);
    expect(GUEST_REPLY.status).toBe("Delivered");
    expect(OPERATION_SUMMARY.title).toBe("Everything ready for arrival");
    expect(OPERATION_SUMMARY.line).toContain("Every system aligned");
  });
});
