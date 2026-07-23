import { AuthenticationError, AuthorizationError } from "@/lib/ops/errors";
import {
  canManageBilling,
  getAuthenticatedUser,
  getTenantContext,
  type TenantContext,
} from "@/lib/tenant/context";
import type { HotelSubscription, SubscriptionStatus } from "@/types/subscription";

/** Resolves billing access without allowing dashboard redirects to escape API routes. */
export async function requireBillingTenant(): Promise<TenantContext> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new AuthenticationError();
  }

  const tenant = await getTenantContext();
  if (!canManageBilling(tenant.role)) {
    throw new AuthorizationError(
      "Только владелец или менеджер может управлять подпиской"
    );
  }

  return tenant;
}

/**
 * Statuses that keep the product usable. Matches the definition already
 * used by BillingPanel.tsx for its own "do you have an active-ish
 * subscription" check — `past_due` is Stripe's built-in payment-retry
 * grace period, not an immediate cutoff, so it stays allowed here too
 * rather than introducing a second, inconsistent definition.
 *
 * Deliberately excludes `none` (no subscription row at all): a hotel that
 * has never subscribed gets the same blocked experience as one whose
 * subscription lapsed, since neither should have product access.
 */
const ACCESS_ALLOWED_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  "active",
  "trialing",
  "past_due",
]);

/**
 * Whether this subscription is in a state that should allow using the
 * product (as opposed to just being *displayed* in the billing panel).
 * A `null` subscription (no row exists yet for this hotel) is not access.
 */
export function hasProductAccess(
  subscription: HotelSubscription | null
): boolean {
  if (!subscription) return false;
  return ACCESS_ALLOWED_STATUSES.has(subscription.status);
}
