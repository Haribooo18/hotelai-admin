import { describe, expect, it } from "vitest";

import {
  DEMO_PAGE_FAQ,
  DEMO_PAGE_FORM,
  DEMO_PAGE_HERO,
  DEMO_PAGE_PREVIEW,
} from "@/lib/marketing/demo-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("demo page content", () => {
  it("defines hero copy and ctas", () => {
    expect(DEMO_PAGE_HERO.headline).toBe(
      "See how Monavel would run your hotel."
    );
    expect(DEMO_PAGE_HERO.primaryCtaHref).toBe("#demo-booking");
    expect(DEMO_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.trial);
  });

  it("defines three preview areas with topics", () => {
    expect(DEMO_PAGE_PREVIEW.areas).toHaveLength(3);

    expect(DEMO_PAGE_PREVIEW.areas.map((area) => area.title)).toEqual([
      "Operations",
      "AI Reception",
      "Revenue",
    ]);

    expect(DEMO_PAGE_PREVIEW.areas[0]?.topics).toEqual([
      "Bookings",
      "Calendar",
      "Rooms",
    ]);

    expect(DEMO_PAGE_PREVIEW.areas[1]?.topics).toEqual([
      "Website Chat",
      "Telegram",
      "Knowledge",
    ]);

    expect(DEMO_PAGE_PREVIEW.areas[2]?.topics).toEqual([
      "Rates",
      "Reports",
      "Recommendations",
    ]);
  });

  it("defines the simplified booking form", () => {
    expect(DEMO_PAGE_FORM.submitLabel).toBe("Book a demo");
    expect(DEMO_PAGE_FORM.fields.name.label).toBe("Name");
    expect(DEMO_PAGE_FORM.fields.hotel.label).toBe("Hotel");
    expect(DEMO_PAGE_FORM.fields.email.label).toBe("Email");
    expect(DEMO_PAGE_FORM.fields.rooms.label).toBe("Hotel size");
    expect(DEMO_PAGE_FORM.fields.message.label).toBe(
      "What should we focus on?"
    );
    expect(DEMO_PAGE_FORM.successTitle).toBe("Demo request received.");

    expect(DEMO_PAGE_FORM.fields).not.toHaveProperty("country");
    expect(DEMO_PAGE_FORM.fields).not.toHaveProperty("date");
  });

  it("limits faq to four questions", () => {
    expect(DEMO_PAGE_FAQ.items).toHaveLength(4);

    expect(DEMO_PAGE_FAQ.items.map((item) => item.question)).toEqual([
      "How long is the demo?",
      "Is it personalized?",
      "Can my team join?",
      "What happens after the demo?",
    ]);
  });

  it("does not imply instant scheduling", () => {
    const copy = [
      DEMO_PAGE_FORM.subhead,
      DEMO_PAGE_FORM.successMessage,
    ].join(" ");

    expect(copy.toLowerCase()).toMatch(/email|confirm/);
    expect(copy.toLowerCase()).not.toMatch(/calendly/);
    expect(copy.toLowerCase()).not.toMatch(
      /instant booking|scheduling widget|availability calendar/
    );
  });
});