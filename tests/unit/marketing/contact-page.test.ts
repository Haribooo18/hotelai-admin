import { describe, expect, it } from "vitest";

import {
  CONTACT_PAGE_FAQ,
  CONTACT_PAGE_FORM,
  CONTACT_PAGE_HERO,
  CONTACT_PAGE_METHODS,
} from "@/lib/marketing/contact-page";
import { MARKETING_CTA } from "@/lib/marketing/routes";

describe("contact page content", () => {
  it("defines hero copy with demo primary cta", () => {
    expect(CONTACT_PAGE_HERO.headline).toBe("Let's talk about your hotel.");
    expect(CONTACT_PAGE_HERO.primaryCtaLabel).toBe("Book a demo");
    expect(CONTACT_PAGE_HERO.primaryCtaHref).toBe(MARKETING_CTA.demo);
    expect(CONTACT_PAGE_HERO.secondaryCtaHref).toBe(MARKETING_CTA.trial);
  });

  it("defines three contact methods with placeholder emails", () => {
    expect(CONTACT_PAGE_METHODS.methods).toHaveLength(3);
    expect(CONTACT_PAGE_METHODS.methods.map((m) => m.title)).toEqual([
      "Sales",
      "Partnerships",
      "General inquiries",
    ]);
    expect(CONTACT_PAGE_METHODS.methods.map((m) => m.email)).toContain(
      "sales@monavel.app"
    );
    expect(CONTACT_PAGE_METHODS.methods.map((m) => m.email)).toContain(
      "hello@monavel.app"
    );
  });

  it("does not include phone numbers or addresses", () => {
    const joined = JSON.stringify(CONTACT_PAGE_METHODS.methods);
    expect(joined).not.toMatch(/\+?\d[\d\s\-()]{7,}/);
    expect(joined).not.toMatch(/street|avenue|office/i);
  });

  it("defines sales inquiry form fields", () => {
    expect(CONTACT_PAGE_FORM.submitLabel).toBe("Contact sales");
    expect(CONTACT_PAGE_FORM.fields.name.label).toBe("Name");
    expect(CONTACT_PAGE_FORM.fields.hotel.label).toBe("Hotel");
    expect(CONTACT_PAGE_FORM.fields.rooms.label).toBe("Number of rooms");
    expect(CONTACT_PAGE_FORM.fields.message.label).toBe("Message");
  });

  it("includes up to four faq items", () => {
    expect(CONTACT_PAGE_FAQ.items.length).toBeLessThanOrEqual(4);
    expect(CONTACT_PAGE_FAQ.items.map((item) => item.question)).toContain(
      "Can I schedule a demo?"
    );
  });
});
