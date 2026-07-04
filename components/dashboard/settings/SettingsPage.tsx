import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";

import { AIHealthPanel } from "./AIHealthPanel";
import { AIPromptTest } from "./AIPromptTest";
import { AISettingsForm } from "./AISettingsForm";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
  configured: boolean;
};

export function SettingsPage({ settings, health, logs, configured }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          HOTELAI ADMIN
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Настройки</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Конфигурация AI-ресепшна и диагностика
        </p>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold">AI-ресепшн</h2>
          <div className="mt-4">
            <AISettingsForm settings={settings} configured={configured} />
          </div>
        </div>

        <div className="space-y-6">
          <AIHealthPanel health={health} />
          <AIPromptTest />
        </div>
      </section>

      {logs.length > 0 && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold">Журнал наблюдаемости</h2>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex justify-between gap-4 rounded-lg bg-zinc-900 px-3 py-2"
              >
                <span className="text-zinc-300">
                  <span className="text-zinc-500">[{log.level}]</span>{" "}
                  {log.event}
                </span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {new Date(log.created_at).toLocaleString("ru-RU")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
