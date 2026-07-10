import { describe, expect, it } from "vitest";

import {
  AI_PAGE_BENEFITS,
  AI_PAGE_CAPABILITIES,
  AI_PAGE_GUEST_CHANNELS,
  AI_PAGE_HERO,
  AI_PAGE_HOW_IT_WORKS,
  AI_PAGE_HUMAN_WORKFLOW,
  AI_PAGE_KNOWLEDGE_CONTEXT,
} from "@/lib/marketing/ai-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("ai page content", () => {
  it("defines hero copy and ctas", () => {
    expect(AI_PAGE_HERO.headline).toBe("AI that understands your hotel.");
    expect(AI_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.trial);
    expect(AI_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.demo);
  });

  it("defines how ai works flow", () => {
    expect(AI_PAGE_HOW_IT_WORKS.steps.map((step) => step.label)).toEqual([
      "Guest",
      "Channel",
      "Monavel AI",
      "Knowledge + Reservation Context",
      "Response",
    ]);
  });

  it("defines four capability cards with examples", () => {
    expect(AI_PAGE_CAPABILITIES.items).toHaveLength(4);
    expect(AI_PAGE_CAPABILITIES.items.map((item) => item.title)).toEqual([
      "Guest Communication",
      "Reservation Assistance",
      "Operational Guidance",
      "Revenue Recommendations",
    ]);
    expect(AI_PAGE_CAPABILITIES.items[0]?.examples.length).toBeGreaterThan(0);
  });

  it("explains knowledge and context sources", () => {
    expect(AI_PAGE_KNOWLEDGE_CONTEXT.sources).toHaveLength(4);
    expect(AI_PAGE_KNOWLEDGE_CONTEXT.headline).toContain("Contextual");
  });

  it("labels future channels as planned", () => {
    const planned = AI_PAGE_GUEST_CHANNELS.channels.filter(
      (channel) => channel.status === "planned"
    );
    expect(planned.length).toBeGreaterThan(0);
    expect(AI_PAGE_GUEST_CHANNELS.channels.map((c) => c.title)).toContain(
      "Website Chat"
    );
    expect(AI_PAGE_GUEST_CHANNELS.channels.map((c) => c.title)).toContain(
      "Telegram"
    );
  });

  it("describes human escalation workflow", () => {
    expect(AI_PAGE_HUMAN_WORKFLOW.aiHandles.length).toBeGreaterThan(0);
    expect(AI_PAGE_HUMAN_WORKFLOW.staffHandles.length).toBeGreaterThan(0);
    expect(AI_PAGE_HUMAN_WORKFLOW.escalationLabel).toBe("Escalation to staff");
  });

  it("defines four benefits without fake metrics", () => {
    expect(AI_PAGE_BENEFITS.items).toHaveLength(4);
    const joined = AI_PAGE_BENEFITS.items.map((item) => item.title).join(" ");
    expect(joined).not.toMatch(/\d+%|\d+\+/);
  });
});
