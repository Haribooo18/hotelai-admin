import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkOpenAIEnv,
  checkStripeEnv,
  checkSupabaseEnv,
  checkTelegramEnv,
  checkWebsiteChatEnv,
  isTelegramConfigured,
} from "@/lib/ops/env";
import { collectStartupDiagnostics, runStartupValidation, __resetStartupValidationForTests } from "@/lib/ops/startup";
import { getPlatformHealth } from "@/lib/ops/health";

describe("checkSupabaseEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports configured when url and anon key are set", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");

    const result = checkSupabaseEnv();
    expect(result.configured).toBe(true);
    expect(result.details?.service_role).toBe(true);
  });

  it("reports missing client env vars", () => {
    const result = checkSupabaseEnv();
    expect(result.configured).toBe(false);
  });
});

describe("checkStripeEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires secret, webhook, and all price ids", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("STRIPE_PRICE_STARTER", "price_s");
    vi.stubEnv("STRIPE_PRICE_PRO", "price_p");
    vi.stubEnv("STRIPE_PRICE_ENTERPRISE", "price_e");

    expect(checkStripeEnv().configured).toBe(true);
  });
});

describe("checkTelegramEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("is optional when unset", () => {
    expect(isTelegramConfigured()).toBe(false);
    expect(checkTelegramEnv().message).toContain("optional");
  });

  it("is configured with token and webhook secret", () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "token");
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", "secret");
    expect(isTelegramConfigured()).toBe(true);
  });
});

describe("checkWebsiteChatEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires service role and hotel id", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");
    vi.stubEnv("DEFAULT_HOTEL_ID", "hotel_aurora");

    expect(checkWebsiteChatEnv().configured).toBe(true);
  });
});

describe("collectStartupDiagnostics", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  });

  it("marks startup ok when required supabase vars exist", () => {
    const diagnostics = collectStartupDiagnostics();
    expect(diagnostics.ok).toBe(true);
    expect(diagnostics.checks.length).toBeGreaterThanOrEqual(7);
    expect(diagnostics.runtime.nodeVersion).toMatch(/^v\d+/);
  });

  it("lists warnings for missing optional integrations", () => {
    const diagnostics = collectStartupDiagnostics();
    expect(diagnostics.warnings.length).toBeGreaterThan(0);
  });
});

describe("getPlatformHealth", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
  });

  it("returns JSON health sections", () => {
    const health = getPlatformHealth(null);
    expect(health.timestamp).toBeTruthy();
    expect(health.status).toBeTruthy();
    expect(health.dependencies.supabase.configured).toBe(true);
    expect(health.dependencies.openai.configured).toBe(true);
    expect(health.dependencies.telegram.status).toBe("unconfigured");
    expect(health.requests.total).toBeGreaterThanOrEqual(0);
    expect(health.ai).toBeNull();
  });
});

describe("runStartupValidation", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    __resetStartupValidationForTests();
  });

  it("logs diagnostics only once per process", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    runStartupValidation();
    const logsAfterFirstRun = infoSpy.mock.calls.filter(([message]) =>
      String(message).includes("[HotelAI startup] environment=")
    ).length;

    runStartupValidation();
    const logsAfterSecondRun = infoSpy.mock.calls.filter(([message]) =>
      String(message).includes("[HotelAI startup] environment=")
    ).length;

    expect(logsAfterFirstRun).toBe(1);
    expect(logsAfterSecondRun).toBe(1);

    infoSpy.mockRestore();
  });
});

describe("checkOpenAIEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("detects configured OpenAI key", () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    expect(checkOpenAIEnv().configured).toBe(true);
  });
});
