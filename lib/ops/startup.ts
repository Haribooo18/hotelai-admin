import { getOpenAIDefaultModel, isOpenAIConfigured } from "@/lib/ai/config";
import { getAIServices } from "@/lib/ai/container";

import { collectEnvironmentChecks } from "./env";

export type StartupCheck = {
  id:
    | "supabase"
    | "openai"
    | "stripe"
    | "telegram"
    | "website_chat"
    | "ai_provider"
    | "repositories";
  name: string;
  configured: boolean;
  required: boolean;
  message: string;
};

export type StartupDiagnostics = {
  ok: boolean;
  environment: string;
  checks: StartupCheck[];
  warnings: string[];
  runtime: {
    nodeVersion: string;
    openaiModel: string;
  };
};

let lastStartupDiagnostics: StartupDiagnostics | null = null;
let startupValidationCompleted = false;

const STARTUP_CHECK_DEFS = [
  { id: "supabase", name: "Supabase", key: "supabase", required: true },
  { id: "openai", name: "OpenAI", key: "openai", required: false },
  { id: "stripe", name: "Stripe", key: "stripe", required: false },
  { id: "telegram", name: "Telegram", key: "telegram", required: false },
  {
    id: "website_chat",
    name: "Website Chat",
    key: "websiteChat",
    required: false,
  },
] as const;

export function collectStartupDiagnostics(): StartupDiagnostics {
  const env = collectEnvironmentChecks();

  const checks: StartupCheck[] = STARTUP_CHECK_DEFS.map((def) => {
    const result = env[def.key];
    return {
      id: def.id,
      name: def.name,
      configured: result.configured,
      required: def.required,
      message: result.message,
    };
  });

  const aiProviderConfigured = (() => {
    if (!isOpenAIConfigured()) return false;
    try {
      return getAIServices().provider.name !== "unconfigured";
    } catch {
      return false;
    }
  })();

  checks.push({
    id: "ai_provider",
    name: "AI Provider",
    configured: aiProviderConfigured,
    required: false,
    message: aiProviderConfigured
      ? `AI provider ready (${getAIServices().provider.name})`
      : isOpenAIConfigured()
        ? "AI provider container not initialized"
        : "OpenAI API key not configured",
  });

  const repositoriesConfigured = env.supabase.configured;
  checks.push({
    id: "repositories",
    name: "Repositories",
    configured: repositoriesConfigured,
    required: true,
    message: repositoriesConfigured
      ? "Repository layer initialized"
      : "Supabase client required for repositories",
  });

  const warnings = checks
    .filter((check) => !check.configured)
    .map((check) => `${check.name}: ${check.message}`);

  const ok = checks.filter((check) => check.required).every((check) => check.configured);

  return {
    ok,
    environment: process.env.NODE_ENV ?? "development",
    checks,
    warnings,
    runtime: {
      nodeVersion: process.version,
      openaiModel: isOpenAIConfigured()
        ? getOpenAIDefaultModel()
        : "unconfigured",
    },
  };
}

export function runStartupValidation(): StartupDiagnostics {
  if (startupValidationCompleted) {
    return lastStartupDiagnostics ?? collectStartupDiagnostics();
  }

  startupValidationCompleted = true;
  const diagnostics = collectStartupDiagnostics();
  lastStartupDiagnostics = diagnostics;

  const prefix = "[HotelAI startup]";
  console.info(`${prefix} environment=${diagnostics.environment} ok=${diagnostics.ok}`);

  for (const check of diagnostics.checks) {
    const level = check.configured ? "info" : check.required ? "error" : "warn";
    const tag = check.configured ? "ok" : check.required ? "missing" : "optional";
    console[level](`${prefix} [${tag}] ${check.name}: ${check.message}`);
  }

  console.info(
    `${prefix} runtime node=${diagnostics.runtime.nodeVersion} openai_model=${diagnostics.runtime.openaiModel}`
  );

  return diagnostics;
}

export function __resetStartupValidationForTests(): void {
  startupValidationCompleted = false;
  lastStartupDiagnostics = null;
}
