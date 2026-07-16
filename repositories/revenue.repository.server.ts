import { RevenueRepository } from "./revenue.repository";

import type { RepositoryContext } from "./context.types";

export function createRevenueRepository(
  context: RepositoryContext
): RevenueRepository {
  return new RevenueRepository(context);
}
