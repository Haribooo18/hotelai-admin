import { describe, expect, it } from "vitest";

import {
  bumpPastDateToFuture,
  isValidIsoDate,
  sanitizeBookingDates,
} from "@/lib/ai/date-sanitizer";

// Pinned "today" so assertions are deterministic regardless of when this
// suite actually runs. Mirrors the equivalent n8n workflow fix and its
// tests in tests/unit/ai/booking-parser.test.ts.
const TODAY = new Date("2026-07-22T12:00:00Z");

describe("isValidIsoDate", () => {
  it("accepts a real calendar date in YYYY-MM-DD form", () => {
    expect(isValidIsoDate("2027-01-11")).toBe(true);
  });

  it("rejects a non-existent calendar date", () => {
    expect(isValidIsoDate("2026-02-30")).toBe(false);
  });

  it("rejects malformed strings", () => {
    expect(isValidIsoDate("11 января")).toBe(false);
    expect(isValidIsoDate("2026/01/11")).toBe(false);
    expect(isValidIsoDate("")).toBe(false);
  });
});

describe("bumpPastDateToFuture", () => {
  it("rolls a past date in the current year forward to the same day/month next year", () => {
    expect(bumpPastDateToFuture("2026-01-11", TODAY)).toBe("2027-01-11");
  });

  it("leaves an upcoming date within the current year untouched", () => {
    expect(bumpPastDateToFuture("2026-08-01", TODAY)).toBe("2026-08-01");
  });

  it("leaves today's own date untouched", () => {
    expect(bumpPastDateToFuture("2026-07-22", TODAY)).toBe("2026-07-22");
  });

  it("does not touch a value that isn't a valid ISO date — that's the schema's job", () => {
    expect(bumpPastDateToFuture("not-a-date", TODAY)).toBe("not-a-date");
  });

  it("leaves an already-future date in a later year untouched", () => {
    expect(bumpPastDateToFuture("2028-03-01", TODAY)).toBe("2028-03-01");
  });
});

describe("sanitizeBookingDates", () => {
  it("catches the production bug: LLM assigns inconsistent years across check_in/check_out", () => {
    // check_in guessed with a passed date this year (needs +1 year),
    // check_out guessed with an upcoming date this year (needs no change).
    // Bumping each field independently without a final ordering re-check
    // would silently leave check_out before check_in.
    const result = sanitizeBookingDates("2026-01-05", "2026-12-25", TODAY);
    expect(result.orderingValid).toBe(false);
  });

  it("leaves a correctly-ordered, already-future pair unchanged", () => {
    const result = sanitizeBookingDates("2027-01-11", "2027-01-15", TODAY);
    expect(result).toEqual({
      checkIn: "2027-01-11",
      checkOut: "2027-01-15",
      orderingValid: true,
    });
  });

  it("corrects both dates when both were guessed with the passed current year", () => {
    const result = sanitizeBookingDates("2026-01-11", "2026-01-15", TODAY);
    expect(result.checkIn).toBe("2027-01-11");
    expect(result.checkOut).toBe("2027-01-15");
    expect(result.orderingValid).toBe(true);
  });

  it("does not falsely flag ordering as invalid when a date is malformed — that's a separate validation concern", () => {
    const result = sanitizeBookingDates("garbage", "2027-01-15", TODAY);
    expect(result.orderingValid).toBe(true);
  });
});
