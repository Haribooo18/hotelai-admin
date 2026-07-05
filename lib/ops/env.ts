import { isOpenAIConfigured, getOpenAIDefaultModel } from "@/lib/ai/config";
import { getTelegramBotToken } from "@/lib/channels/telegram/sender";
import { getTelegramWebhookSecret } from "@/lib/channels/telegram/webhook";
import { getWebsiteHotelId } from "@/lib/channels/website/stream";
import { BILLING_PLAN_IDS, getPriceIdForPlan } from "@/lib/billing/plans";
import {
  getStripeSecretKey,
  getStripeWebhookSecret,
} from "@/lib/billing/stripe";

export type EnvCheckResult = {
  configured: boolean;
  message: string;
  details?: Record<string, boolean | string>;
};

export type EnvironmentChecks = {
  supabase: EnvCheckResult;
  openai: EnvCheckResult;
  stripe: EnvCheckResult;
  telegram: EnvCheckResult;
  websiteChat: EnvCheckResult;
};

export function collectEnvironmentChecks(): EnvironmentChecks {
  return {
    supabase: checkSupabaseEnv(),
    openai: checkOpenAIEnv(),
    stripe: checkStripeEnv(),
    telegram: checkTelegramEnv(),
    websiteChat: checkWebsiteChatEnv(),
  };
}

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function checkSupabaseEnv(): EnvCheckResult {
  const url = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const anon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const serviceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  const configured = url && anon;

  return {
    configured,
    message: configured
      ? serviceRole
        ? "Supabase client and service role configured"
        : "Supabase client configured; service role not set (required for webhooks)"
      : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    details: {
      url,
      anon_key: anon,
      service_role: serviceRole,
    },
  };
}

export function checkOpenAIEnv(): EnvCheckResult {
  const configured = isOpenAIConfigured();
  const model = getOpenAIDefaultModel();

  return {
    configured,
    message: configured
      ? `OPENAI_API_KEY is set (default model: ${model})`
      : "OPENAI_API_KEY is not set — AI receptionist disabled",
    details: configured
      ? {
          api_key: true,
          default_model: model,
        }
      : undefined,
  };
}

export function checkStripeEnv(): EnvCheckResult {
  const secret = Boolean(getStripeSecretKey());
  const webhook = Boolean(getStripeWebhookSecret());
  const prices = Object.fromEntries(
    BILLING_PLAN_IDS.map((plan) => [plan, Boolean(getPriceIdForPlan(plan))])
  ) as Record<string, boolean>;
  const allPrices = BILLING_PLAN_IDS.every((plan) => prices[plan]);

  const configured = secret && webhook && allPrices;

  return {
    configured,
    message: configured
      ? "Stripe fully configured"
      : secret
        ? webhook
          ? "Set STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO, and STRIPE_PRICE_ENTERPRISE"
          : "Set STRIPE_WEBHOOK_SECRET"
        : "Set STRIPE_SECRET_KEY",
    details: {
      secret_key: secret,
      webhook_secret: webhook,
      ...prices,
    },
  };
}

export function isTelegramConfigured(): boolean {
  return Boolean(getTelegramBotToken() && getTelegramWebhookSecret());
}

export function checkTelegramEnv(): EnvCheckResult {
  const token = Boolean(getTelegramBotToken());
  const secret = Boolean(getTelegramWebhookSecret());
  const hotelId = Boolean(
    process.env.TELEGRAM_HOTEL_ID?.trim() || process.env.DEFAULT_HOTEL_ID?.trim()
  );
  const configured = token && secret;

  return {
    configured,
    message: configured
      ? "Telegram channel configured"
      : token || secret
        ? "Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET"
        : "Telegram not configured (optional)",
    details: {
      bot_token: token,
      webhook_secret: secret,
      hotel_id: hotelId,
    },
  };
}

export function checkWebsiteChatEnv(): EnvCheckResult {
  const serviceRole = isSupabaseServiceRoleConfigured();
  const hotelId = getWebsiteHotelId();

  const configured = serviceRole && Boolean(hotelId);

  return {
    configured,
    message: configured
      ? `Website Chat configured (hotel: ${hotelId})`
      : serviceRole
        ? "Set WEBSITE_CHAT_HOTEL_ID or DEFAULT_HOTEL_ID"
        : "Set SUPABASE_SERVICE_ROLE_KEY for Website Chat",
    details: {
      service_role: serviceRole,
      hotel_id: hotelId,
    },
  };
}
