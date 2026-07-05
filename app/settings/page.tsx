import { AppShell } from "@/components/dashboard/AppShell";
import { SettingsPage } from "@/components/dashboard/settings";
import { isOpenAIConfigured } from "@/lib/ai/config";
import { isStripeConfigured } from "@/lib/billing/stripe";
import {
  getAIHealthStatus,
  getAIObservabilityLogs,
  getHotelAISettings,
} from "@/lib/services/ai-settings.service";
import { getHotelSubscription } from "@/lib/services/billing.service";
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

  const [hotel, settings, health, logs, subscription] = await Promise.all([
    getCurrentHotel(),
    getHotelAISettings(),
    getAIHealthStatus(),
    getAIObservabilityLogs(20),
    getHotelSubscription(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <SettingsPage
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
