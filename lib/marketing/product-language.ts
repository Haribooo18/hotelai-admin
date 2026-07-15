/**
 * Canonical Monavel product language for marketing surfaces.
 * Prefer these tokens over free-form synonyms for CTAs and status.
 */

/** Primary / secondary action labels — one verb style, sentence case. */
export const MKT_CTA = {
  startFreeTrial: "Start free trial",
  bookDemo: "Book a demo",
  exploreDocs: "Explore docs",
  viewPricing: "View pricing",
  contactSales: "Contact sales",
  continue: "Continue",
  signIn: "Sign in",
  learnMore: "Learn more",
} as const;

/**
 * Operational status vocabulary.
 * Use the same word for the same meaning — no casual synonyms.
 */
export const MKT_STATUS = {
  /** Integrations / channels / external systems */
  connected: "Connected",
  /** Knowledge, data, content */
  synced: "Synced",
  /** AI decisions / policy outcomes */
  approved: "Approved",
  /** Reservations / stay commitments */
  confirmed: "Confirmed",
  /** Hotel services (transfer, spa, taxi, parking, …) */
  booked: "Booked",
  /** Invoices, emails, documents, directions */
  delivered: "Delivered",
  /** Future actions */
  scheduled: "Scheduled",
  /** Availability / uptime presence */
  online: "Online",
} as const;

export const MKT_STATUS_VOCABULARY = new Set<string>(Object.values(MKT_STATUS));

/** Canonical KPI names (short, product-facing). */
export const MKT_KPI = {
  revenue: "Revenue",
  responseTime: "Response Time",
  guests: "Guests",
  bookings: "Bookings",
  messages: "Messages",
  uptime: "Uptime",
} as const;
