import { describe, expect, it } from "vitest";

import { parseBookingTurn, type SavedBookingSession } from "@/lib/ai/booking-parser";

// Pinned "today" for every test in this file so date-resolution assertions
// are deterministic regardless of when the suite actually runs.
const TODAY = new Date("2026-07-22T12:00:00Z");

function emptySession(currentStep: string): SavedBookingSession {
  return {
    current_step: currentStep,
    room_type: "",
    check_in: "",
    check_out: "",
    guests: 0,
    guest_name: "",
    phone: "",
    email: "",
    comment: "",
  };
}

describe("parseBookingTurn — year resolution (production bug regression)", () => {
  // This whole describe block reproduces a real production bug found on
  // 2026-07-23: when the LLM's own JSON guess already filled check_in with
  // an unresolved year (defaulting to the current calendar year instead of
  // the nearest future year), the merge logic trusted that value blindly
  // and the deterministic regex-based date parser's correct answer landed
  // in the *wrong* field (check_out) instead of overwriting check_in.

  const savedAfterRoomType = emptySession("check_in");
  savedAfterRoomType.room_type = "Family";

  it("corrects a wrong year even when the LLM's own JSON guess already filled the field", () => {
    const result = parseBookingTurn({
      rawOutput: {
        reply: "",
        should_create_lead: false,
        current_step: "check_out",
        lead: { room_type: "Family", check_in: "2026-01-11" }, // LLM guessed current year — wrong, that date already passed
      },
      saved: savedAfterRoomType,
      userMessage: "11 января",
      now: TODAY,
    });

    expect(result.lead.check_in).toBe("2027-01-11");
  });

  it("resolves the year correctly from the regex parser when the LLM omits the date entirely", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "check_out", lead: { room_type: "Family" } },
      saved: savedAfterRoomType,
      userMessage: "11 января",
      now: TODAY,
    });

    expect(result.lead.check_in).toBe("2027-01-11");
  });

  it("leaves a correctly-guessed future year untouched", () => {
    const result = parseBookingTurn({
      rawOutput: {
        reply: "",
        should_create_lead: false,
        current_step: "check_out",
        lead: { room_type: "Family", check_in: "2027-01-11" },
      },
      saved: savedAfterRoomType,
      userMessage: "11 января",
      now: TODAY,
    });

    expect(result.lead.check_in).toBe("2027-01-11");
  });

  it("does not touch a near-future date within the current year", () => {
    const saved = emptySession("check_in");
    saved.room_type = "Standard";

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "check_out", lead: { room_type: "Standard" } },
      saved,
      userMessage: "25 июля", // today is 2026-07-22, so this is 3 days out — same year
      now: TODAY,
    });

    expect(result.lead.check_in).toBe("2026-07-25");
  });

  it("catches inconsistent years the LLM assigned across check_in vs check_out instead of silently inverting them", () => {
    // check_in guessed with a passed date this year (needs +1 year),
    // check_out guessed with an upcoming date this year (needs no change).
    // Naively bumping each field independently would leave check_out
    // BEFORE check_in without anyone noticing.
    const saved = emptySession("guests");
    saved.room_type = "Family";

    const result = parseBookingTurn({
      rawOutput: {
        reply: "",
        should_create_lead: false,
        current_step: "guests",
        lead: { room_type: "Family", check_in: "2026-01-05", check_out: "2026-12-25" },
      },
      saved,
      userMessage: "2",
      now: TODAY,
    });

    // Must be caught by the check_out-after-check_in guard and re-asked,
    // not silently produce check_out before check_in.
    expect(result.current_step).toBe("check_out");
    expect(result.lead.check_out).toBe("");
  });

  it("resolves a numeric date range crossing the New Year boundary", () => {
    const saved = emptySession("check_in");
    saved.room_type = "Family";

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "guests", lead: { room_type: "Family" } },
      saved,
      userMessage: "с 30.12 по 3.01",
      now: TODAY,
    });

    expect(result.lead.check_in).toBe("2026-12-30");
    expect(result.lead.check_out).toBe("2027-01-03");
  });
});

describe("parseBookingTurn — conversation guards", () => {
  const midBookingSession: SavedBookingSession = {
    current_step: "confirm",
    room_type: "Family",
    check_in: "2027-01-11",
    check_out: "2027-01-15",
    guests: 2,
    guest_name: "Иван",
    phone: "+79261234567",
    email: "",
    comment: "",
  };

  it("aborts an in-progress booking without creating a lead when the guest changes their mind", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "confirm", lead: {} },
      saved: midBookingSession,
      userMessage: "передумал",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(false);
    expect(result.current_step).toBe("done");
  });

  it("pauses without closing the session when the guest asks to come back later", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "confirm", lead: {} },
      saved: midBookingSession,
      userMessage: "давайте позже",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(false);
    expect(result.current_step).toBe("confirm"); // stays open, unlike an abort
  });

  it("resets all fields on an explicit cancel", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "confirm", lead: {} },
      saved: midBookingSession,
      userMessage: "начать сначала",
      now: TODAY,
    });

    expect(result.lead.room_type).toBe("");
    expect(result.lead.check_in).toBe("");
    expect(result.current_step).toBe("room_type");
  });

  it("locks a done session and requires an explicit reset phrase to reopen it", () => {
    const doneSession: SavedBookingSession = { ...midBookingSession, current_step: "done" };

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "done", lead: {} },
      saved: doneSession,
      userMessage: "а можно поменять дату?",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(false);
    expect(result.current_step).toBe("done");
    expect(result.reply).toContain("начать сначала");
  });

  it("creates the lead only when the guest confirms with a complete booking draft", () => {
    const result = parseBookingTurn({
      rawOutput: {
        reply: "",
        should_create_lead: true,
        current_step: "confirm",
        lead: {
          room_type: "Family",
          check_in: "2027-01-11",
          check_out: "2027-01-15",
          guests: 2,
          guest_name: "Иван Иванов",
          phone: "+79261234567",
        },
      },
      saved: {
        ...midBookingSession,
        guest_name: "Иван Иванов",
      },
      userMessage: "да",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(true);
    expect(result.current_step).toBe("done");
  });

  it("refuses to create a lead if should_create_lead is true but required fields are missing", () => {
    const incompleteSession: SavedBookingSession = {
      ...midBookingSession,
      phone: "",
      email: "", // no contact info at all
    };

    const result = parseBookingTurn({
      rawOutput: {
        reply: "",
        should_create_lead: true, // LLM claims ready, but data says otherwise
        current_step: "confirm",
        lead: { room_type: "Family", check_in: "2027-01-11", check_out: "2027-01-15", guests: 2, guest_name: "Иван" },
      },
      saved: incompleteSession,
      userMessage: "да",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(false);
  });
});

describe("parseBookingTurn — field extraction from free text", () => {
  it("normalizes Russian room type names to canonical values", () => {
    const saved = emptySession("room_type");
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "check_in", lead: {} },
      saved,
      userMessage: "семейный",
      now: TODAY,
    });
    expect(result.lead.room_type).toBe("Family");
  });

  it("normalizes a phone number to E.164-ish shape", () => {
    const saved = emptySession("contact");
    saved.room_type = "Family";
    saved.check_in = "2027-01-11";
    saved.check_out = "2027-01-15";
    saved.guests = 2;
    saved.guest_name = "Иван";

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "confirm", lead: {} },
      saved,
      userMessage: "+7 926 123-45-67",
      now: TODAY,
    });
    expect(result.lead.phone).toBe("+79261234567");
  });

  it("rejects a phone number that is too short", () => {
    const saved = emptySession("contact");
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "contact", lead: {} },
      saved,
      userMessage: "12345",
      now: TODAY,
    });
    expect(result.lead.phone).toBe("");
  });

  it("extracts and appends a guest preference into the comment without erasing prior ones", () => {
    const saved = emptySession("guests");
    saved.room_type = "Family";
    saved.check_in = "2027-01-11";
    saved.check_out = "2027-01-15";
    saved.comment = "Высокий этаж.";

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "guest_name", lead: {} },
      saved,
      userMessage: "2 гостя, приедем с собакой",
      now: TODAY,
    });

    expect(result.lead.comment).toContain("Высокий этаж.");
    expect(result.lead.comment).toContain("Гость будет с питомцем.");
    expect(result.lead.guests).toBe(2);
  });

  it("rejects a check-out date that is not after check-in and re-asks", () => {
    const saved = emptySession("check_out");
    saved.room_type = "Family";
    saved.check_in = "2027-01-15";

    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "guests", lead: {} },
      saved,
      userMessage: "12 января",
      now: TODAY,
    });

    expect(result.current_step).toBe("check_out");
    expect(result.lead.check_out).toBe("");
    expect(result.reply).toContain("позже даты заезда");
  });
});

describe("parseBookingTurn — off-topic and FAQ-adjacent messages", () => {
  it("does not start a booking flow for an unrelated question", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "Какой тип номера вас интересует?", should_create_lead: false, current_step: "", lead: {} },
      saved: {},
      userMessage: "какая сегодня погода?",
      now: TODAY,
    });

    // No booking intent and no saved session -> must not fall into the FSM
    expect(result.current_step).toBe("");
    expect(result.should_create_lead).toBe(false);
  });

  it("replies with a plain thank-you close when there is no active booking", () => {
    const result = parseBookingTurn({
      rawOutput: { reply: "", should_create_lead: false, current_step: "", lead: {} },
      saved: {},
      userMessage: "спасибо",
      now: TODAY,
    });

    expect(result.should_create_lead).toBe(false);
    expect(result.current_step).toBe("");
  });
});
