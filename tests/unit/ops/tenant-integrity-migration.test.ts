import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/0022_tenant_reference_integrity.sql"),
  "utf8",
);

describe("tenant reference integrity migration", () => {
  it.each([
    "bookings_hotel_guest_fkey",
    "rooms_hotel_room_type_fkey",
    "payments_hotel_booking_fkey",
    "refunds_hotel_payment_fkey",
    "invoices_hotel_booking_fkey",
    "invoices_hotel_payment_fkey",
    "messages_hotel_conversation_fkey",
    "ai_actions_hotel_conversation_fkey",
    "ai_actions_hotel_message_fkey",
    "conversation_tags_hotel_conversation_fkey",
    "conversation_assignments_hotel_conversation_fkey",
  ])("defines %s", (constraintName) => {
    expect(migration).toContain(`constraint ${constraintName}`);
  });

  it("uses hotel_id in every new foreign key", () => {
    const foreignKeys = migration.match(/foreign key \([^)]*\)/g) ?? [];
    expect(foreignKeys.length).toBeGreaterThan(0);
    for (const foreignKey of foreignKeys) {
      expect(foreignKey).toContain("hotel_id");
    }
  });
});
