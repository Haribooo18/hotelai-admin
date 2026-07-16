import { SettingsTabs } from "@/components/dashboard/settings";
import { isOpenAIConfigured } from "@/lib/ai/config";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { computeAIHealthStatus } from "@/repositories/settings.repository";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

type SearchParams = Promise<{ tab?: string }>;

export default async function SettingsRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialTab = params.tab === "billing" ? "billing" : "ai";

  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const settingsRepo = createSettingsRepository(repositoryContext);

  const [settings, completionStats, subscription, logs] = await Promise.all([
    settingsRepo.getHotelAISettings(),
    settingsRepo.getCompletionStats24h(),
    settingsRepo.getHotelSubscription(),
    settingsRepo.getAIObservabilityLogs(6),
  ]);

  const health = await computeAIHealthStatus(settings, completionStats);

  return (
    <SettingsTabs
      settings={settings}
      health={health}
      logs={logs}
      configured={isOpenAIConfigured()}
      subscription={subscription}
      stripeConfigured={isStripeConfigured()}
      initialTab={initialTab}
    />
  );
}
