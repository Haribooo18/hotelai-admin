import { describe, expect, it } from "vitest";

import {
  AI_PAGE_COMPARE,
  AI_PAGE_CONVERSATIONS,
  AI_PAGE_CTA,
  AI_PAGE_HERO,
  AI_PAGE_NIGHT,
  AI_PAGE_STATUS,
} from "@/lib/marketing/ai-page";

const STATUS_VOCAB = new Set([
  "Online",
  "Synced",
  "Connected",
  "Approved",
  "Confirmed",
  "Scheduled",
  "Delivered",
  "Booked",
]);

describe("ai page content", () => {
  it("defines a concise living AI hero story", () => {
    expect(AI_PAGE_HERO.headline).toBe("Your hotel never sleeps.");
    expect(AI_PAGE_HERO.conversations[0]).toMatchObject({
      guest: "Any chance of a room upgrade?",
      reply: "Upgrade confirmed.",
      replyMeta: "8 sec",
      outcome: "Reservation confirmed",
      revenue: "+$42",
    });
    expect(AI_PAGE_HERO.conversations[1]).toMatchObject({
      reply: "Transfer booked.",
      outcome: "Transfer booked",
    });
    expect(AI_PAGE_HERO.conversations[2]).toMatchObject({
      guest: "Can I check in around midnight?",
      reply: "Late check-in approved.",
      outcome: "Late check-in approved",
      revenue: "+$186",
    });
    expect(
      AI_PAGE_HERO.conversations.every(
        (item) =>
          item.reply.split(" ").length <= 4 &&
          !("action" in item) &&
          !("notify" in item)
      )
    ).toBe(true);
  });

  it("presents overnight outcomes with a simple stats card", () => {
    expect(AI_PAGE_NIGHT.headline).toBe("Overnight, nothing is missed.");
    expect(AI_PAGE_NIGHT.events).toHaveLength(9);
    expect(AI_PAGE_NIGHT.summary.stats.map((stat) => stat.label)).toEqual([
      "Guests",
      "Response Time",
      "Revenue",
      "Uptime",
      "Missed",
    ]);
    expect(AI_PAGE_NIGHT.summary.stats.find((stat) => stat.label === "Revenue")?.value).toBe(
      "$1,428"
    );
    expect(AI_PAGE_NIGHT.events.map((event) => event.request)).toEqual([
      "Reservation",
      "Airport transfer",
      "Breakfast",
      "Late check-in",
      "Spa",
      "Wake-up call",
      "Taxi",
      "Invoice",
      "Review",
    ]);
  });

  it("makes response speed emotional and obvious", () => {
    expect(AI_PAGE_COMPARE.subtitle).toContain("Slow replies lose bookings.");
    expect(AI_PAGE_COMPARE.without.steps.map((step) => step.text)).toEqual([
      "Can I check in late?",
      "No reply",
      "Still waiting",
      "Opens another channel",
      "Reservation lost",
    ]);
    expect(AI_PAGE_COMPARE.without.summary).toMatchObject({
      responseValue: "45 min",
      outcomeValue: "Guest lost",
      revenueValue: "−$186",
    });
    expect(AI_PAGE_COMPARE.withMonavel.steps.map((step) => step.text)).toEqual([
      "Can I check in late?",
      "AI replies",
      "Late check-in approved",
      "Guest retained",
    ]);
    expect(AI_PAGE_COMPARE.withMonavel.summary).toMatchObject({
      responseValue: "8 sec",
      outcomeValue: "Guest retained",
      revenueValue: "+$186",
    });
  });

  it("shows conversations as completed business outcomes", () => {
    expect(AI_PAGE_CONVERSATIONS.headline).toBe("Every request handled.");
    expect(AI_PAGE_CONVERSATIONS.items[0]).toEqual({
      id: "breakfast",
      request: "Breakfast",
      detail: "Booked",
    });
    expect(
      AI_PAGE_CONVERSATIONS.items.find((item) => item.id === "airport")
    ).toMatchObject({ detail: "+$58", emphasis: "money" });
    expect(AI_PAGE_CONVERSATIONS.items.every((item) => !("outcome" in item))).toBe(
      true
    );
  });

  it("keeps system status as platform plus state only", () => {
    expect(AI_PAGE_STATUS.headline).toBe("Everything stays connected.");
    expect(AI_PAGE_STATUS.metrics.map((metric) => metric.label)).toEqual([
      "AI Reception",
      "Response Time",
      "Uptime",
      "Revenue",
    ]);
    expect(AI_PAGE_STATUS.metrics.find((metric) => metric.id === "revenue")).toMatchObject({
      value: "$1,428",
      numeric: 1428,
    });
    expect(AI_PAGE_STATUS.systems[0]).toEqual({
      id: "reception",
      label: "Reception",
      state: "Online",
    });
    expect(AI_PAGE_STATUS.systems.every((system) => !("detail" in system))).toBe(
      true
    );
  });

  it("uses one consistent product status vocabulary", () => {
    const detailStates = [
      ...AI_PAGE_HERO.liveEvents.map((event) => event.detail),
      ...AI_PAGE_NIGHT.events.map((event) => event.result),
      ...AI_PAGE_CONVERSATIONS.items.map((item) => item.detail),
      ...AI_PAGE_STATUS.systems.map((system) => system.state),
    ].filter((value) => !value.startsWith("+") && !value.startsWith("$") && value !== "8 sec" && value !== "24/7" && value !== "99.8%" && value !== "63" && value !== "0");

    for (const state of detailStates) {
      expect(STATUS_VOCAB.has(state)).toBe(true);
    }

    expect(AI_PAGE_CTA.actions).toContain("Upgrade confirmed");
    expect(AI_PAGE_CTA.actions).not.toContain("Upgrade accepted");
  });

  it("closes with a single primary CTA", () => {
    expect(AI_PAGE_CTA.primaryCtaLabel).toBe("Start free trial");
    expect(AI_PAGE_CTA.headline).toBe("Start today.");
    expect(AI_PAGE_CTA.body).toBe("Protect every booking from the first message.");
  });

  it("gives each section a distinct job", () => {
    const headlines = [
      AI_PAGE_HERO.headline,
      AI_PAGE_NIGHT.headline,
      AI_PAGE_COMPARE.headline,
      AI_PAGE_CONVERSATIONS.headline,
      AI_PAGE_STATUS.headline,
      AI_PAGE_CTA.headline,
    ];
    expect(new Set(headlines).size).toBe(headlines.length);
  });
});
