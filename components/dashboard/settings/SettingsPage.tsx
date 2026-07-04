import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { SettingsTabs } from "./SettingsTabs";

type Tab = "ai" | "billing";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  initialTab?: Tab;
};

export function SettingsPage(props: Props) {
  return <SettingsTabs {...props} />;
}
