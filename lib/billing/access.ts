import { AuthenticationError, AuthorizationError } from "@/lib/ops/errors";
import {
  canManageBilling,
  getAuthenticatedUser,
  getTenantContext,
  type TenantContext,
} from "@/lib/tenant/context";

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
