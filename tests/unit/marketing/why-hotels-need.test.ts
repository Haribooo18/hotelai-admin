import { describe, expect, it } from "vitest";

import {
  COMMUNICATION_CARD,
  HOTEL_DATA_CARD,
  OPERATIONS_CARD,
  REVENUE_CARD,
  WHY_HOTELS_NEED_CONTENT,
} from "@/lib/marketing/why-hotels-need";
import {
  deriveWhyNeedStory,
  getWhyNeedEventCount,
  getWhyNeedStaticSnapshot,
  WHY_NEED_EVENTS,
  WHY_NEED_PROPAGATION_ORDER,
  WHY_NEED_TIMING,
  WHY_NEED_CYCLE_MS,
} from "@/lib/marketing/why-hotels-need-story";

describe("why hotels need content", () => {
  it("defines a short problem statement without an overline", () => {
    expect(WHY_HOTELS_NEED_CONTENT.sectionId).toBe("why-hotels-need");
    expect(WHY_HOTELS_NEED_CONTENT).not.toHaveProperty("overline");
    expect(WHY_HOTELS_NEED_CONTENT.headlineLines.length).toBe(2);
    expect(WHY_HOTELS_NEED_CONTENT.subhead.split(".").filter(Boolean)).toHaveLength(1);
  });

  it("keeps the headline concise across both lines, with no trailing period", () => {
    expect([...WHY_HOTELS_NEED_CONTENT.headlineLines]).toEqual([
      "One Runtime",
      "Every hotel system",
    ]);
    expect(WHY_HOTELS_NEED_CONTENT.headlineLines.every((line) => !line.endsWith("."))).toBe(
      true
    );
    expect(WHY_HOTELS_NEED_CONTENT.subhead).toBe(
      "Every update becomes shared operational context."
    );
  });

  it("does not reintroduce the repeated operating-system marketing phrase", () => {
    const combined = [
      ...WHY_HOTELS_NEED_CONTENT.headlineLines,
      WHY_HOTELS_NEED_CONTENT.subhead,
    ]
      .join(" ")
      .toLowerCase();

    expect(combined).not.toMatch(/one (workspace|operating system|platform)/);
  });

  it("gives every card a short title (no long headlines)", () => {
    const titles = [
      COMMUNICATION_CARD.title,
      OPERATIONS_CARD.title,
      HOTEL_DATA_CARD.title,
      REVENUE_CARD.title,
    ];

    expect(titles).toEqual(["Communication", "Operations", "Hotel Data", "Revenue"]);

    for (const title of titles) {
      expect(title.length).toBeLessThan(20);
    }
  });

  it("keeps every accessible panel summary concise", () => {
    const summaries = [
      COMMUNICATION_CARD.summary,
      OPERATIONS_CARD.summary,
      HOTEL_DATA_CARD.summary,
      REVENUE_CARD.summary,
    ];

    for (const summary of summaries) {
      expect(summary.length).toBeGreaterThan(0);
      expect(summary.length).toBeLessThan(260);
    }
  });

  it("gives the communication card one shared guest identity across four channels", () => {
    expect(COMMUNICATION_CARD.guestName).toBe("Maria Thompson");
    expect(COMMUNICATION_CARD.guestStatus).toBe("VIP");
    expect(COMMUNICATION_CARD.hub).toBe("Monavel AI");
    expect(COMMUNICATION_CARD.hubStatus).toBe("Understanding guest intent…");
    expect(COMMUNICATION_CARD.channels.map((channel) => channel.label)).toEqual([
      "WhatsApp",
      "Telegram",
      "Booking.com",
      "Email",
    ]);
    expect(new Set(COMMUNICATION_CARD.channels.map((channel) => channel.id)).size).toBe(
      COMMUNICATION_CARD.channels.length
    );

    expect(COMMUNICATION_CARD.messages).toHaveLength(4);
    expect(COMMUNICATION_CARD.messages.map((message) => message.text)).toEqual([
      "Arriving after midnight",
      "Need parking",
      "Can I check in late?",
      "Request invoice",
    ]);

    expect(COMMUNICATION_CARD.contextChips).toEqual([
      "Late arrival",
      "Parking requested",
      "Invoice",
    ]);
  });

  it("visualizes operations as a six-stage sequence with completed/current/upcoming states", () => {
    expect(OPERATIONS_CARD.stages.map((stage) => stage.label)).toEqual([
      "Booking confirmed",
      "Housekeeping assigned",
      "Room cleaned",
      "Room inspected",
      "Ready for check-in",
      "Guest checked in",
    ]);

    const states = OPERATIONS_CARD.stages.map((stage) => stage.state);
    expect(states.filter((state) => state === "completed").length).toBeGreaterThan(0);
    expect(states).toContain("current");
    expect(states).toContain("upcoming");

    const withAssignee = OPERATIONS_CARD.stages.find((stage) => stage.assigneeName);
    expect(withAssignee?.assigneeName).toBe("Anna");
    expect(withAssignee?.assigneeInitial?.length).toBeGreaterThan(0);
    expect(withAssignee?.eta?.length).toBeGreaterThan(0);

    expect(OPERATIONS_CARD.roomLabel).toBe("Room 407");
    expect(OPERATIONS_CARD.roomStatus).toBe("Ready");
  });

  it("visualizes hotel data as source systems syncing into a live dashboard", () => {
    expect(HOTEL_DATA_CARD.sources.map((source) => source.label)).toEqual([
      "PMS",
      "CRM",
      "Calendar",
      "Revenue",
    ]);
    expect(
      new Set(HOTEL_DATA_CARD.sources.map((source) => source.label)).size
    ).toBe(HOTEL_DATA_CARD.sources.length);

    expect(HOTEL_DATA_CARD.hub).toBe("Live Hotel Database");
    expect(HOTEL_DATA_CARD.dashboardLabel).toBe("Dashboard");
    expect(HOTEL_DATA_CARD.metrics.map((metric) => metric.label)).toEqual([
      "Rooms",
      "Guests",
      "Reservations",
      "Revenue",
    ]);

    for (const metric of HOTEL_DATA_CARD.metrics) {
      expect(metric.value.length).toBeGreaterThan(0);
      expect(metric.percent).toBeGreaterThan(0);
    }

    expect(HOTEL_DATA_CARD.activityLabel).toBe("Recent Sync Activity");
    expect(HOTEL_DATA_CARD.activities.map((activity) => activity.label)).toEqual([
      "Guest profile updated",
      "Booking imported",
      "Revenue synced",
      "Room status changed",
    ]);
    expect(HOTEL_DATA_CARD.activities.every((activity) => activity.time.length > 0)).toBe(
      true
    );
  });

  it("visualizes revenue as an AI pricing flow: KPIs -> recommendation -> projected impact", () => {
    expect(REVENUE_CARD.kpis.map((kpi) => kpi.label)).toEqual([
      "Occupancy",
      "Current ADR",
      "RevPAR",
    ]);
    expect(REVENUE_CARD.adrCurrent).toBe("$118");
    expect(REVENUE_CARD.adrRecommended).toBe("$134");
    expect(REVENUE_CARD.demandLabel).toBe("Demand spike detected");
    expect(REVENUE_CARD.confidencePercent).toBe(98);
    expect(REVENUE_CARD.impactValue).toBe("+$2,180");
    expect(REVENUE_CARD.impactDelta).toContain("12%");
    expect(REVENUE_CARD.actionLabel).toBe("Next pricing cycle");
    expect(REVENUE_CARD.chartPoints.length).toBeGreaterThan(3);
    expect(REVENUE_CARD.kpis.find((kpi) => kpi.label === "Occupancy")?.sparkPoints?.length).toBeGreaterThan(
      2
    );
    expect(REVENUE_CARD.kpis.find((kpi) => kpi.label === "RevPAR")?.sparkPoints?.length).toBeGreaterThan(
      2
    );
  });
});

describe("why hotels need story timeline", () => {
  it("defines eight deterministic guest events in fixed order", () => {
    expect(getWhyNeedEventCount()).toBe(8);
    expect(WHY_NEED_EVENTS.map((event) => event.id)).toEqual([
      "invoice",
      "late-check-in",
      "parking",
      "upgrade",
      "transfer",
      "breakfast",
      "cancellation",
      "early-check-in",
    ]);
  });

  it("uses the approved act timing constants", () => {
    expect(WHY_NEED_TIMING.idle).toBe(2200);
    expect(WHY_NEED_TIMING.propagation).toBe(1800);
    expect(WHY_NEED_TIMING.runtimeMoment).toBe(280);
    expect(WHY_NEED_TIMING.still).toBe(2000);
    expect(WHY_NEED_TIMING.crossfade).toBe(720);
    expect(WHY_NEED_CYCLE_MS).toBe(7000);
  });

  it("shares one guest identity object across every synced card", () => {
    const snapshot = getWhyNeedStaticSnapshot(0);
    expect(snapshot.identity).toEqual({
      guestName: "Maria Thompson",
      reservationId: "48291",
      room: "407",
      status: "Late check-in",
      timestamp: "23:18",
    });
    expect(snapshot.communication.guestName).toBe(snapshot.identity.guestName);
    expect(snapshot.communication.footerTime).toBe(snapshot.identity.timestamp);
    expect(snapshot.operations.roomLabel).toBe(`Room ${snapshot.identity.room}`);
    expect(snapshot.hotelData.footerTime).toBe(snapshot.identity.timestamp);
    expect(snapshot.revenue.actionTimer).toBe(`Room ${snapshot.identity.room}`);
    expect(
      snapshot.hotelData.activities.some((row) => row.label.includes("#48291"))
    ).toBe(true);
  });

  it("propagates Communication → Hotel Data → Operations → Revenue one card at a time", () => {
    expect([...WHY_NEED_PROPAGATION_ORDER]).toEqual([
      "communication",
      "hotel-data",
      "operations",
      "revenue",
    ]);

    const step0 = deriveWhyNeedStory(WHY_NEED_TIMING.idle + 10);
    expect(step0.phase).toBe("propagating");
    expect(step0.activeCard).toBe("communication");
    expect(step0.cardRoles.communication).toBe("active");
    expect(step0.cardRoles.revenue).toBe("inactive");

    const step1 = deriveWhyNeedStory(WHY_NEED_TIMING.idle + 500);
    expect(step1.activeCard).toBe("hotel-data");
    expect(step1.cardRoles.communication).toBe("related");
    expect(step1.cardRoles["hotel-data"]).toBe("active");

    const step2 = deriveWhyNeedStory(WHY_NEED_TIMING.idle + 1000);
    expect(step2.activeCard).toBe("operations");

    const step3 = deriveWhyNeedStory(WHY_NEED_TIMING.idle + 1500);
    expect(step3.activeCard).toBe("revenue");
    expect(step3.cardRoles.operations).toBe("related");
  });

  it("creates a Runtime Moment near 4s, then a still synchronized ending", () => {
    const momentAt = WHY_NEED_TIMING.idle + WHY_NEED_TIMING.propagation + 10;
    expect(momentAt).toBe(4010);
    const moment = deriveWhyNeedStory(momentAt);
    expect(moment.phase).toBe("runtimeMoment");
    expect(moment.runtimeMoment).toBe(true);
    expect(moment.cardRoles.communication).toBe("aligned");
    expect(moment.identityVisible).toBe(true);
    expect(moment.identityOpacity).toBe(1);

    const stillAt =
      WHY_NEED_TIMING.idle +
      WHY_NEED_TIMING.propagation +
      WHY_NEED_TIMING.runtimeMoment +
      20;
    const still = deriveWhyNeedStory(stillAt);
    expect(still.phase).toBe("synchronized");
    expect(still.still).toBe(true);
    expect(still.activeCard).toBeNull();
    expect(still.cardRoles.communication).toBe("synced");
  });

  it("starts fragmented and soft-fades the reservation before the next cycle", () => {
    const idle = deriveWhyNeedStory(0);
    expect(idle.phase).toBe("fragmented");
    expect(idle.activeCard).toBeNull();
    expect(idle.identityVisible).toBe(false);
    expect(idle.communication.hubStatus).toBe("Channels disconnected");

    const fadeAt = WHY_NEED_CYCLE_MS - 100;
    const fading = deriveWhyNeedStory(fadeAt);
    expect(fading.phase).toBe("crossfade");
    expect(fading.identityOpacity).toBeLessThan(1);
    expect(fading.cardRoles.communication).toBe("fading");
  });

  it("rotates events deterministically across cycles", () => {
    const first = deriveWhyNeedStory(100);
    const second = deriveWhyNeedStory(WHY_NEED_CYCLE_MS + 100);
    expect(first.eventId).toBe("invoice");
    expect(first.identity.reservationId).toBe("48291");
    expect(second.eventId).toBe("late-check-in");
    expect(second.identity.reservationId).toBe("48302");
  });

  it("keeps the static reduced-motion snapshot on the quiet synchronized invoice state", () => {
    const snapshot = getWhyNeedStaticSnapshot(0);
    expect(snapshot.phase).toBe("synchronized");
    expect(snapshot.eventId).toBe("invoice");
    expect(snapshot.communication.messages.at(-1)?.text).toBe("Request invoice");
    expect(snapshot.communication.messages).toHaveLength(2);
    expect(snapshot.communication.hubStatus).toBe("Understanding guest context");
    expect(snapshot.communication.contextChips).toContain("Invoice");
    expect(snapshot.identity.reservationId).toBe("48291");
    expect(snapshot.operations.stages.map((stage) => stage.label)).not.toContain(
      "Room inspected"
    );
    expect(snapshot.hotelData.activities).toHaveLength(3);
    expect(snapshot.hotelData.activities.map((row) => row.label)).toEqual([
      "Reservation #48291 synced",
      "Guest profile updated",
      "Room 407 synced",
    ]);
    expect(snapshot.revenue.kpis).toHaveLength(1);
    expect(snapshot.revenue.confidencePercent).toBe(0);
    expect(snapshot.revenue.impactDelta).toContain("#48291");
  });
});
