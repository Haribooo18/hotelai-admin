import { describe, expect, it } from "vitest";

import { parseMarketingLeadRoomRange } from "@/lib/marketing/lead-fields";

describe("parseMarketingLeadRoomRange", () => {
  it.each(["1-20", "21-50", "51-100", "101-250", "251+"])(
    "preserves the selected range %s",
    (range) => {
      expect(parseMarketingLeadRoomRange(range)).toBe(range);
    }
  );

  it("returns null for an omitted selection", () => {
    expect(parseMarketingLeadRoomRange("")).toBeNull();
    expect(parseMarketingLeadRoomRange(null)).toBeNull();
  });

  it.each(["21", "21-500", "all", 21])(
    "rejects unsupported value %j",
    (value) => {
      expect(() => parseMarketingLeadRoomRange(value)).toThrow(
        "Invalid hotel size."
      );
    }
  );
});
