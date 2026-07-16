import { describe, expect, it } from "vitest";

import { hasDuplicateHash, parseHashHref } from "@/lib/marketing/hash-link";
import { MARKETING_PRODUCT_HREF } from "@/lib/marketing/routes";

describe("hash link helpers", () => {
  it("parses a same-page hash href into path and id", () => {
    expect(parseHashHref("/#product")).toEqual({ path: "/", id: "product" });
    expect(parseHashHref("/pricing#faq")).toEqual({
      path: "/pricing",
      id: "faq",
    });
  });

  it("returns null for hrefs without a hash", () => {
    expect(parseHashHref("/ai")).toBeNull();
    expect(parseHashHref("/pricing")).toBeNull();
  });

  it("never derives the destination from any external/current state", () => {
    // The parser only ever looks at the literal string it receives — calling
    // it repeatedly (simulating repeated clicks) can never grow the result,
    // because there is no "current URL" input for it to accumulate onto.
    const results = Array.from({ length: 5 }, () =>
      parseHashHref(MARKETING_PRODUCT_HREF)
    );

    for (const result of results) {
      expect(result).toEqual({ path: "/", id: "product" });
    }
  });

  it("detects a duplicated hash such as /#product#product", () => {
    expect(hasDuplicateHash("/#product#product")).toBe(true);
    expect(hasDuplicateHash("/#product")).toBe(false);
    expect(hasDuplicateHash(MARKETING_PRODUCT_HREF)).toBe(false);
  });
});
