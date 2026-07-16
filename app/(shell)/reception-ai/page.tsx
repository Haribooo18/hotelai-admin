import { ReceptionAIPage } from "@/components/dashboard/reception-ai";
import { isOpenAIConfigured } from "@/lib/ai/config";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function ReceptionAIRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const settingsRepo = createSettingsRepository(repositoryContext);

  const [settings, logs] = await Promise.all([
    settingsRepo.getHotelAISettings(),
    settingsRepo.getAIObservabilityLogs(20),
  ]);

  return (
    <ReceptionAIPage
      settings={settings}
      logs={logs}
      configured={isOpenAIConfigured()}
    />
  );
}
