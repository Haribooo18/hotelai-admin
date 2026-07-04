import { collectEnvironmentChecks } from "./env";

export type StartupCheck = {
  id: "supabase" | "openai" | "stripe" | "telegram" | "website_chat";
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

  const warnings = checks
    .filter((check) => !check.configured)
    .map((check) => `${check.name}: ${check.message}`);

  const ok = checks.filter((check) => check.required).every((check) => check.configured);

  return {
    ok,
    environment: process.env.NODE_ENV ?? "development",
    checks,
    warnings,
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

  return diagnostics;
}

export function __resetStartupValidationForTests(): void {
  startupValidationCompleted = false;
  lastStartupDiagnostics = null;
}
