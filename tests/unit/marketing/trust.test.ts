import { describe, expect, it } from "vitest";

import {
  TRUST_CARDS,
  TRUST_GUARANTEES,
  TRUST_SECTION_CONTENT,
} from "@/lib/marketing/trust";

describe("trust section content", () => {
  it("defines six operational readiness pillars", () => {
    expect(TRUST_CARDS).toHaveLength(6);
    expect(TRUST_CARDS.map((card) => card.title)).toEqual([
      "Existing PMS compatibility",
      "Human approval and override",
      "Secure hotel data",
      "Fast deployment",
      "Workflow reliability",
      "Complete audit trail",
    ]);
  });

  it("defines Runtime Guarantees without customer counts", () => {
    expect(TRUST_GUARANTEES).toHaveLength(5);
    expect(TRUST_GUARANTEES.map((guarantee) => guarantee.label)).toEqual([
      "One Runtime",
      "Live sync",
      "Human oversight",
      "Encrypted communication",
      "Connected systems",
    ]);

    const labels = TRUST_GUARANTEES.map((guarantee) => guarantee.label).join(" ");
    expect(labels).not.toMatch(/\d+\+?\s*(hotels|customers|users)/i);
  });

  it("answers operational confidence and links to security", () => {
    expect(TRUST_SECTION_CONTENT.headline).toBe("Built to run a real hotel");
    expect(TRUST_SECTION_CONTENT.subhead).toContain("Staff stay in control");
    expect(TRUST_SECTION_CONTENT.guaranteesLabel).toBe("Runtime Guarantees");
    expect(TRUST_SECTION_CONTENT.securityLinkHref).toBe("/security");
  });

  it("describes tenant isolation and rbac in secure pillar", () => {
    const secure = TRUST_CARDS.find((card) => card.id === "security");
    expect(secure?.description).toContain("Tenant isolation");
    expect(secure?.description).toContain("role-based access");
  });
});
