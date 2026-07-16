import { getOpenAIDefaultModel } from "@/lib/ai/config";
import { getTelegramBotToken } from "@/lib/channels/telegram/sender";
import {
  getStripeSecretKey,
  getStripeWebhookSecret,
} from "@/lib/billing/stripe";

export type ProductionEnvVarStatus = {
  name: string;
  configured: boolean;
  requiredInProduction: boolean;
  message: string;
};

function isSet(...names: string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}

export function collectProductionEnvStatus(
  nodeEnv = process.env.NODE_ENV ?? "development"
): ProductionEnvVarStatus[] {
  const isProduction = nodeEnv === "production";

  const supabaseUrl = isSet("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
  const supabaseAnon = isSet(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY"
  );
  const supabaseServiceRole = isSet("SUPABASE_SERVICE_ROLE_KEY");
  const openaiKey = isSet("OPENAI_API_KEY");
  const openaiModel = Boolean(
    process.env.OPENAI_MODEL?.trim() || getOpenAIDefaultModel()
  );
  const stripeSecret = Boolean(getStripeSecretKey());
  const stripeWebhook = Boolean(getStripeWebhookSecret());
  const telegramToken = Boolean(getTelegramBotToken());
  const websiteChatSecret = isSet("WEBSITE_CHAT_SECRET");

  return [
    {
      name: "NODE_ENV",
      configured: Boolean(nodeEnv),
      requiredInProduction: true,
      message: nodeEnv ? `NODE_ENV=${nodeEnv}` : "NODE_ENV is not set",
    },
    {
      name: "NEXTAUTH_SECRET",
      configured: isSet("NEXTAUTH_SECRET", "AUTH_SECRET"),
      requiredInProduction: false,
      message:
        "Optional for HotelAI (Supabase Auth). Set NEXTAUTH_SECRET if your host requires it.",
    },
    {
      name: "SUPABASE_URL",
      configured: supabaseUrl,
      requiredInProduction: true,
      message: supabaseUrl
        ? "Supabase URL configured"
        : "Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
    },
    {
      name: "SUPABASE_ANON_KEY",
      configured: supabaseAnon,
      requiredInProduction: true,
      message: supabaseAnon
        ? "Supabase anon key configured"
        : "Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY",
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      configured: supabaseServiceRole,
      requiredInProduction: true,
      message: supabaseServiceRole
        ? "Service role configured"
        : "Required for webhooks and channel ingress",
    },
    {
      name: "OPENAI_API_KEY",
      configured: openaiKey,
      requiredInProduction: false,
      message: openaiKey
        ? "OpenAI API key configured"
        : "Optional unless AI receptionist is enabled",
    },
    {
      name: "OPENAI_MODEL",
      configured: openaiModel,
      requiredInProduction: false,
      message: openaiModel
        ? `Model: ${process.env.OPENAI_MODEL?.trim() || getOpenAIDefaultModel()}`
        : "Set OPENAI_MODEL or rely on default model",
    },
    {
      name: "STRIPE_SECRET_KEY",
      configured: stripeSecret,
      requiredInProduction: false,
      message: stripeSecret
        ? "Stripe secret key configured"
        : "Optional unless billing is enabled",
    },
    {
      name: "STRIPE_WEBHOOK_SECRET",
      configured: stripeWebhook,
      requiredInProduction: false,
      message: stripeWebhook
        ? "Stripe webhook secret configured"
        : "Optional unless billing webhooks are enabled",
    },
    {
      name: "TELEGRAM_BOT_TOKEN",
      configured: telegramToken,
      requiredInProduction: false,
      message: telegramToken
        ? "Telegram bot token configured"
        : "Optional unless Telegram channel is enabled",
    },
    {
      name: "WEBSITE_CHAT_SECRET",
      configured: websiteChatSecret,
      requiredInProduction: false,
      message: websiteChatSecret
        ? "Website chat secret configured"
        : "Optional shared secret for hardened widget ingress",
    },
  ].map((entry) => ({
    ...entry,
    requiredInProduction: isProduction ? entry.requiredInProduction : false,
  }));
}

export function formatProductionEnvReport(
  statuses: ProductionEnvVarStatus[]
): string[] {
  return statuses.map((status) => {
    const tag = status.configured ? "ok" : status.requiredInProduction ? "missing" : "optional";
    return `[${tag}] ${status.name}: ${status.message}`;
  });
}
