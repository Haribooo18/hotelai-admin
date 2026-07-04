import { AppShell } from "@/components/dashboard/AppShell";
import { SettingsPage } from "@/components/dashboard/settings";
import { isOpenAIConfigured } from "@/lib/ai/bootstrap";
import {
  getAIHealthStatus,
  getAIObservabilityLogs,
  getHotelAISettings,
} from "@/lib/services/ai-settings.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function SettingsRoute() {
  const [hotel, settings, health, logs] = await Promise.all([
    getCurrentHotel(),
    getHotelAISettings(),
    getAIHealthStatus(),
    getAIObservabilityLogs(20),
  ]);

  return (
    <AppShell hotel={hotel}>
      <SettingsPage
        settings={settings}
        health={health}
        logs={logs}
        configured={isOpenAIConfigured()}
      />
    </AppShell>
  );
}
