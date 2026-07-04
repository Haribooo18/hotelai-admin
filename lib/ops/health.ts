import type { AIHealthStatus } from "@/types/ai-settings";

import { collectEnvironmentChecks, type EnvCheckResult } from "./env";

export type ServiceHealthStatus = "ok" | "degraded" | "unconfigured";

export type ServiceHealth = {
  configured: boolean;
  status: ServiceHealthStatus;
  message: string;
  details?: Record<string, boolean | string>;
};

export type PlatformHealthResponse = {
  timestamp: string;
  supabase: ServiceHealth;
  openai: ServiceHealth;
  stripe: ServiceHealth;
  telegram: ServiceHealth;
  website_chat: ServiceHealth;
  ai: AIHealthStatus | null;
};

function toServiceHealth(check: EnvCheckResult, optional = false): ServiceHealth {
  if (check.configured) {
    return {
      configured: true,
      status: "ok",
      message: check.message,
      details: check.details,
    };
  }

  return {
    configured: false,
    status: optional ? "unconfigured" : "degraded",
    message: check.message,
    details: check.details,
  };
}

export function getPlatformHealth(ai: AIHealthStatus | null = null): PlatformHealthResponse {
  const env = collectEnvironmentChecks();

  const supabaseHealth = toServiceHealth(env.supabase, false);
  if (
    env.supabase.configured &&
    env.supabase.details &&
    !env.supabase.details.service_role
  ) {
    supabaseHealth.status = "degraded";
  }

  return {
    timestamp: new Date().toISOString(),
    supabase: supabaseHealth,
    openai: toServiceHealth(env.openai, false),
    stripe: toServiceHealth(env.stripe, false),
    telegram: toServiceHealth(env.telegram, true),
    website_chat: toServiceHealth(env.websiteChat, false),
    ai,
  };
}
