import { isOpenAIConfigured } from "@/lib/ai/config";
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
        ? "Supabase client и service role настроены"
        : "Supabase client настроен; service role не задан (нужен для вебхуков)"
      : "Задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY",
    details: {
      url,
      anon_key: anon,
      service_role: serviceRole,
    },
  };
}

export function checkOpenAIEnv(): EnvCheckResult {
  const configured = isOpenAIConfigured();
  return {
    configured,
    message: configured
      ? "OPENAI_API_KEY задан"
      : "OPENAI_API_KEY не задан — AI-ресепшн отключён",
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
      ? "Stripe полностью настроен"
      : secret
        ? webhook
          ? "Задайте STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO и STRIPE_PRICE_ENTERPRISE"
          : "Задайте STRIPE_WEBHOOK_SECRET"
        : "Задайте STRIPE_SECRET_KEY",
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
      ? "Telegram канал настроен"
      : token || secret
        ? "Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET"
        : "Telegram не настроен (опционально)",
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
      ? `Website Chat настроен (hotel: ${hotelId})`
      : serviceRole
        ? "Задайте WEBSITE_CHAT_HOTEL_ID или DEFAULT_HOTEL_ID"
        : "Задайте SUPABASE_SERVICE_ROLE_KEY для Website Chat",
    details: {
      service_role: serviceRole,
      hotel_id: hotelId,
    },
  };
}
