import { describe, expect, it } from "vitest";

import {
  WHO_IS_MONAVEL_FOR_CONTENT,
  WHO_IS_MONAVEL_FOR_SEGMENTS,
} from "@/lib/marketing/who-is-monavel-for";

describe("who is monavel for content", () => {
  it("defines section metadata", () => {
    expect(WHO_IS_MONAVEL_FOR_CONTENT.sectionId).toBe("who-is-monavel-for");
  });

  it("defines six hotel segments", () => {
    expect(WHO_IS_MONAVEL_FOR_SEGMENTS).toHaveLength(6);
    expect(WHO_IS_MONAVEL_FOR_SEGMENTS.map((s) => s.title)).toContain(
      "Boutique Hotels"
    );
    expect(WHO_IS_MONAVEL_FOR_SEGMENTS.map((s) => s.title)).toContain("Hostels");
  });
});
