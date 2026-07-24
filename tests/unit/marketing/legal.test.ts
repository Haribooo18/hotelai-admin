import { describe, expect, it } from "vitest";

import {
  LEGAL_CONTACT_EMAIL,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
} from "@/lib/marketing/legal";

describe("legal content", () => {
  it("defines privacy policy sections", () => {
    expect(PRIVACY_POLICY.sections.map((section) => section.title)).toEqual([
      "Introduction",
      "Information we collect",
      "How information is used",
      "Data storage",
      "Third-party services",
      "Cookies",
      "User rights",
      "Contact",
    ]);
  });

  it("defines terms of service sections", () => {
    expect(TERMS_OF_SERVICE.sections.map((section) => section.title)).toEqual([
      "Acceptance",
      "Accounts",
      "Subscriptions",
      "Payments",
      "Acceptable use",
      "Intellectual property",
      "Termination",
      "Disclaimer",
      "Limitation of liability",
      "Governing law",
      "Changes to these terms",
      "Contact",
    ]);
  });

  it("uses hello@monavel.app for legal contact", () => {
    expect(LEGAL_CONTACT_EMAIL).toBe("hello@monavel.app");
    const contactSections = [
      PRIVACY_POLICY.sections.find((section) => section.id === "contact"),
      TERMS_OF_SERVICE.sections.find((section) => section.id === "contact"),
    ];
    for (const section of contactSections) {
      expect(section?.paragraphs.join(" ")).toContain(LEGAL_CONTACT_EMAIL);
    }
  });

  it("does not claim regulatory certifications", () => {
    const allCopy = [PRIVACY_POLICY, TERMS_OF_SERVICE]
      .flatMap((document) => [
        document.description,
        ...document.sections.flatMap((section) => section.paragraphs),
      ])
      .join(" ")
      .toLowerCase();

    expect(allCopy).not.toMatch(/gdpr compliant|soc\s*2|iso\s*27001|certified/);
    expect(allCopy).toMatch(/does not constitute a statement of regulatory certification/);
  });

  it("provides anchor ids for every section", () => {
    for (const document of [PRIVACY_POLICY, TERMS_OF_SERVICE]) {
      const ids = document.sections.map((section) => section.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.every((id) => id.length > 0)).toBe(true);
    }
  });
});
