import { DashboardRepository } from "./dashboard.repository";

import type { RepositoryContext } from "./context.types";

export function createDashboardRepository(
  context: RepositoryContext
): DashboardRepository {
  return new DashboardRepository(context);
}
