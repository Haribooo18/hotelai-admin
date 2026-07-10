import { describe, expect, it } from "vitest";

import {
  TRUST_CARDS,
  TRUST_METRICS,
  TRUST_SECTION_CONTENT,
} from "@/lib/marketing/trust";

describe("trust section content", () => {
  it("defines four trust cards", () => {
    expect(TRUST_CARDS).toHaveLength(4);
    expect(TRUST_CARDS.map((card) => card.title)).toEqual([
      "Built for modern hotels",
      "AI-first architecture",
      "Secure by design",
      "Fast onboarding",
    ]);
  });

  it("uses product metrics without customer counts", () => {
    expect(TRUST_METRICS).toHaveLength(4);
    expect(TRUST_METRICS.map((metric) => metric.label)).toEqual([
      "24/7 AI Reception",
      "Unified Workspace",
      "One Platform",
      "Cloud Native",
    ]);

    const labels = TRUST_METRICS.map((metric) => metric.label).join(" ");
    expect(labels).not.toMatch(/\d+\+?\s*(hotels|customers|users)/i);
  });

  it("links to security page", () => {
    expect(TRUST_SECTION_CONTENT.securityLinkHref).toBe("/security");
    expect(TRUST_SECTION_CONTENT.headline).toBe("Why trust Monavel?");
  });

  it("describes tenant isolation and rbac in secure card", () => {
    const secure = TRUST_CARDS.find((card) => card.id === "secure");
    expect(secure?.description).toContain("Tenant isolation");
    expect(secure?.description).toContain("Role-based access");
  });
});
