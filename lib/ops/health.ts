import type { AIHealthStatus } from "@/types/ai-settings";

import { isOpenAIConfigured, getOpenAIDefaultModel } from "@/lib/ai/config";
import { getAIServices } from "@/lib/ai/container";

import { collectEnvironmentChecks, type EnvCheckResult } from "./env";
import { opsMetrics } from "./metrics";
import {
  collectStartupDiagnostics,
  type StartupDiagnostics,
} from "./startup";

export type ServiceHealthStatus = "ok" | "degraded" | "unconfigured";

export type ServiceHealth = {
  configured: boolean;
  status: ServiceHealthStatus;
  message: string;
  details?: Record<string, boolean | string>;
};

export type PlatformHealthResponse = {
  status: ServiceHealthStatus;
  timestamp: string;
  environment: string;
  uptimeMs: number;
  startup: StartupDiagnostics;
  dependencies: {
    supabase: ServiceHealth;
    openai: ServiceHealth;
    stripe: ServiceHealth;
    telegram: ServiceHealth;
    website_chat: ServiceHealth;
  };
  metrics: ReturnType<typeof opsMetrics.getSnapshot>;
  requests: {
    total: number;
    errors: number;
  };
  latency: ReturnType<typeof opsMetrics.getSnapshot>["latency"];
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

function resolveOverallStatus(
  dependencies: PlatformHealthResponse["dependencies"]
): ServiceHealthStatus {
  if (dependencies.supabase.status === "degraded") return "degraded";

  const optionalDown = [
    dependencies.openai,
    dependencies.stripe,
    dependencies.website_chat,
  ].some((service) => service.status === "degraded");

  return optionalDown ? "degraded" : "ok";
}

export function getPlatformHealth(ai: AIHealthStatus | null = null): PlatformHealthResponse {
  const env = collectEnvironmentChecks();
  const metrics = opsMetrics.getSnapshot();

  const supabaseHealth = toServiceHealth(env.supabase, false);
  if (
    env.supabase.configured &&
    env.supabase.details &&
    !env.supabase.details.service_role
  ) {
    supabaseHealth.status = "degraded";
  }

  const openaiHealth = toServiceHealth(env.openai, false);
  if (openaiHealth.configured) {
    openaiHealth.details = {
      ...(openaiHealth.details ?? {}),
      default_model: getOpenAIDefaultModel(),
    };
  }

  const dependencies = {
    supabase: supabaseHealth,
    openai: openaiHealth,
    stripe: toServiceHealth(env.stripe, false),
    telegram: toServiceHealth(env.telegram, true),
    website_chat: toServiceHealth(env.websiteChat, false),
  };

  return {
    status: resolveOverallStatus(dependencies),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    uptimeMs: metrics.uptimeMs,
    startup: collectStartupDiagnostics(),
    dependencies,
    metrics,
    requests: metrics.requests,
    latency: metrics.latency,
    ai,
  };
}

export function getAIProviderHealth(): ServiceHealth {
  if (!isOpenAIConfigured()) {
    return {
      configured: false,
      status: "unconfigured",
      message: "OpenAI provider not configured",
    };
  }

  try {
    const provider = getAIServices().provider;
    return {
      configured: provider.name !== "unconfigured",
      status: provider.name === "unconfigured" ? "degraded" : "ok",
      message:
        provider.name === "unconfigured"
          ? "AI provider container not initialized"
          : `AI provider ready (${provider.name})`,
      details: {
        provider: provider.name,
        default_model: getOpenAIDefaultModel(),
      },
    };
  } catch {
    return {
      configured: false,
      status: "degraded",
      message: "AI provider initialization failed",
    };
  }
}
