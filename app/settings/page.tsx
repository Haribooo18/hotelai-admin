import { AppShell } from "@/components/dashboard/AppShell";
import { SettingsTabs } from "@/components/dashboard/settings";
import { isOpenAIConfigured } from "@/lib/ai/config";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { computeAIHealthStatus } from "@/repositories/settings.repository";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

type SearchParams = Promise<{ tab?: string }>;

export default async function SettingsRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialTab =
    params.tab === "billing"
      ? "billing"
      : params.tab === "appearance"
        ? "appearance"
        : "ai";

  const [hotel, settingsRepo] = await Promise.all([
    getCurrentHotel(),
    createSettingsRepository(),
  ]);

  const [settings, completionStats, logs, subscription] = await Promise.all([
    settingsRepo.getHotelAISettings(),
    settingsRepo.getCompletionStats24h(),
    settingsRepo.getAIObservabilityLogs(20),
    settingsRepo.getHotelSubscription(),
  ]);

  const health = await computeAIHealthStatus(settings, completionStats);

  return (
    <AppShell hotel={hotel}>
      <SettingsTabs
        settings={settings}
        health={health}
        logs={logs}
        configured={isOpenAIConfigured()}
        subscription={subscription}
        stripeConfigured={isStripeConfigured()}
        initialTab={initialTab}
      />
    </AppShell>
  );
}
