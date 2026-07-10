import { describe, expect, it } from "vitest";

import {
  DEMO_PAGE_AUDIENCE,
  DEMO_PAGE_FAQ,
  DEMO_PAGE_FORM,
  DEMO_PAGE_HERO,
  DEMO_PAGE_PREVIEW,
  DEMO_PAGE_PROCESS,
} from "@/lib/marketing/demo-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("demo page content", () => {
  it("defines hero copy and ctas", () => {
    expect(DEMO_PAGE_HERO.headline).toBe("See Monavel in action.");
    expect(DEMO_PAGE_HERO.primaryCtaHref).toBe("#demo-booking");
    expect(DEMO_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.trial);
  });

  it("defines four preview areas with topics", () => {
    expect(DEMO_PAGE_PREVIEW.areas).toHaveLength(4);
    expect(DEMO_PAGE_PREVIEW.areas.map((area) => area.title)).toEqual([
      "Hotel Operations",
      "AI Reception",
      "Revenue",
      "Administration",
    ]);
    expect(DEMO_PAGE_PREVIEW.areas[0]?.topics).toEqual([
      "Bookings",
      "Calendar",
      "Guests",
      "Rooms",
    ]);
    expect(DEMO_PAGE_PREVIEW.areas[1]?.topics).toEqual([
      "Website Chat",
      "Telegram",
      "Knowledge",
    ]);
  });

  it("defines four demo process steps", () => {
    expect(DEMO_PAGE_PROCESS.steps.map((step) => step.label)).toEqual([
      "Book a time",
      "Meet with Monavel",
      "See your workflows",
      "Discuss onboarding",
    ]);
  });

  it("defines three audience cards", () => {
    expect(DEMO_PAGE_AUDIENCE.cards).toHaveLength(3);
    expect(DEMO_PAGE_AUDIENCE.cards.map((card) => card.title)).toEqual([
      "Independent hotels",
      "Hotel groups",
      "Growing properties",
    ]);
  });

  it("defines booking form fields without backend", () => {
    expect(DEMO_PAGE_FORM.submitLabel).toBe("Book demo");
    expect(DEMO_PAGE_FORM.fields.name.label).toBe("Name");
    expect(DEMO_PAGE_FORM.fields.country.label).toBe("Country");
    expect(DEMO_PAGE_FORM.fields.date.label).toBe("Preferred date");
    expect(DEMO_PAGE_FORM.successTitle).toBe("Demo request received.");
  });

  it("limits faq to six questions", () => {
    expect(DEMO_PAGE_FAQ.items).toHaveLength(6);
    expect(DEMO_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "How long is the demo?"
    );
    expect(DEMO_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "What happens after the demo?"
    );
  });

  it("does not imply instant scheduling", () => {
    const copy = [
      DEMO_PAGE_PROCESS.subhead,
      DEMO_PAGE_FORM.subhead,
      DEMO_PAGE_FORM.successMessage,
    ].join(" ");
    expect(copy.toLowerCase()).toMatch(/email|confirm/);
    expect(copy.toLowerCase()).not.toMatch(/calendly/);
    expect(copy.toLowerCase()).toMatch(/no instant booking|no scheduling widget/);
  });
});
