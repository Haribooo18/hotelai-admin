/**
 * Guards against a specific, confirmed failure mode: an LLM resolving a
 * guest-provided date (e.g. "15 января" with no year) using the current
 * calendar year instead of the nearest future year, producing a date that
 * has already passed. Nothing upstream currently validates this — the tool
 * input schemas only check `.min(1)` on date strings, and the system
 * prompt's date guidance is advisory, not enforced.
 *
 * This mirrors the `bumpPastDateToFuture` safety net added to the n8n
 * HotelAI workflow's booking parser after the same bug was found there in
 * a guest-facing conversation. Unlike the n8n workflow (which only creates
 * a *lead* for staff to review), `create_booking`/`update_booking` here
 * write directly to the `bookings` table, so an uncorrected date is a
 * bigger problem — it becomes a real, wrong reservation, not a lead a
 * human would double-check.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** True only for a syntactically valid `YYYY-MM-DD` string with a real calendar date. */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * If `value` is a valid ISO date that falls strictly before `today` (in UTC
 * calendar terms), rolls the year forward until it no longer does — up to 5
 * years, which comfortably covers any reasonable "omitted year" ambiguity.
 * Leaves already-future dates, and anything that isn't a valid ISO date,
 * untouched (format validity is the schema's job; this only fixes years).
 */
export function bumpPastDateToFuture(value: string, today: Date = new Date()): string {
  if (!isValidIsoDate(value)) return value;

  const todayIso = today.toISOString().slice(0, 10);
  if (value >= todayIso) return value;

  const [year, month, day] = value.split("-").map(Number);
  let bumpedYear = year;
  let bumped = value;

  while (bumped < todayIso && bumpedYear < year + 5) {
    bumpedYear += 1;
    bumped = `${String(bumpedYear).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return bumped;
}

/**
 * Applies the past-date safety net to a `{ check_in, check_out }` pair.
 * Sanitizes each field independently (matching the n8n implementation),
 * then re-checks ordering — an LLM can assign inconsistent years across
 * the two fields (e.g. check_in already passed this year, check_out still
 * upcoming this year), which independent bumping alone would not catch.
 */
export function sanitizeBookingDates(
  checkIn: string,
  checkOut: string,
  today: Date = new Date()
): { checkIn: string; checkOut: string; orderingValid: boolean } {
  const sanitizedCheckIn = bumpPastDateToFuture(checkIn, today);
  const sanitizedCheckOut = bumpPastDateToFuture(checkOut, today);

  const orderingValid =
    !isValidIsoDate(sanitizedCheckIn) ||
    !isValidIsoDate(sanitizedCheckOut) ||
    sanitizedCheckOut > sanitizedCheckIn;

  return { checkIn: sanitizedCheckIn, checkOut: sanitizedCheckOut, orderingValid };
}
