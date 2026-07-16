import { PaymentsRepository } from "./payments.repository";

import type { RepositoryContext } from "./context.types";

export function createPaymentsRepository(
  context: RepositoryContext
): PaymentsRepository {
  return new PaymentsRepository(context);
}
