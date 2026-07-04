import { describe, expect, it } from "vitest";

import {
  evaluateWebsiteWidgetOrigin,
  isLocalDevelopmentOrigin,
  matchAllowedOrigin,
  parseWebsiteWidgetAllowedOrigins,
} from "@/lib/channels/website/cors";

describe("website widget CORS", () => {
  it("parses multiline allowed origins", () => {
    const origins = parseWebsiteWidgetAllowedOrigins(
      "https://hotel-one.com\nhttps://hotel-two.com\n"
    );

    expect(origins).toEqual([
      "https://hotel-one.com",
      "https://hotel-two.com",
    ]);
  });

  it("allows configured origins", () => {
    const decision = evaluateWebsiteWidgetOrigin("https://hotel-one.com", {
      allowedOrigins: ["https://hotel-one.com"],
      nodeEnv: "production",
    });

    expect(decision).toEqual({
      allowed: true,
      origin: "https://hotel-one.com",
    });
  });

  it("rejects unknown origins", () => {
    const decision = evaluateWebsiteWidgetOrigin("https://evil.example", {
      allowedOrigins: ["https://hotel-one.com"],
      nodeEnv: "production",
    });

    expect(decision).toEqual({
      allowed: false,
      origin: "https://evil.example",
    });
  });

  it("supports wildcard subdomains", () => {
    expect(matchAllowedOrigin("https://foo.hotelai.app", "https://*.hotelai.app")).toBe(
      true
    );
    expect(matchAllowedOrigin("https://hotelai.app", "https://*.hotelai.app")).toBe(
      false
    );
  });

  it("allows localhost during development", () => {
    expect(isLocalDevelopmentOrigin("http://localhost:3000")).toBe(true);
    expect(
      evaluateWebsiteWidgetOrigin("http://localhost:3000", {
        allowedOrigins: [],
        nodeEnv: "development",
      }).allowed
    ).toBe(true);
  });

  it("allows missing origin for non-browser clients", () => {
    const decision = evaluateWebsiteWidgetOrigin(null, {
      allowedOrigins: ["https://hotel-one.com"],
      nodeEnv: "production",
    });

    expect(decision).toEqual({ allowed: true, origin: null });
  });
});
