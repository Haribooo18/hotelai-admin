import type { BillingPlan } from "@/types/subscription";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type PricingComparisonValue = "included" | "dash" | "custom";

export type PricingPagePlan = {
  id: BillingPlan;
  name: string;
  description: string;
  priceLabel: string;
  priceNote?: string;
  features: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  badge?: string;
};

export type PricingComparisonRow = {
  id: string;
  label: string;
  starter: PricingComparisonValue;
  pro: PricingComparisonValue;
  enterprise: PricingComparisonValue;
};

export type PricingComparisonGroup = {
  id: string;
  label: string;
  rows: readonly PricingComparisonRow[];
};

export type PricingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Hero — introduce pricing only. CTAs live on the plan cards. */
export const PRICING_PAGE_HERO = {
  headline: "Pricing",
  lead: "One Runtime. Three plans.",
} as const;

/** Plans — no section headline; cards carry the section. */
export const PRICING_PAGE_PLANS_SECTION = {
  sectionId: "pricing-plans",
  ariaLabel: "Plans",
} as const;

export const PRICING_PAGE_PLANS: PricingPagePlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "One hotel. Core workspace and AI reception.",
    priceLabel: "€49",
    priceNote: "/ month",
    features: [
      "Single hotel workspace",
      "AI reception",
      "Website Chat and Telegram",
      "Knowledge base",
    ],
    ctaLabel: "Start free trial",
    ctaHref: MARKETING_CTA.trial,
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Growing hotels that need deeper insight and support.",
    priceLabel: "€149",
    priceNote: "/ month",
    features: [
      "Everything in Starter",
      "Revenue recommendations",
      "Advanced AI analytics",
      "Priority support",
    ],
    ctaLabel: "Start free trial",
    ctaHref: MARKETING_CTA.trial,
    featured: true,
    badge: "Most popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Hotel groups with multi-property operations.",
    priceLabel: "Custom",
    features: [
      "Everything in Pro",
      "Multi-property management",
      "Custom onboarding",
      "Dedicated success manager",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "/contact",
    featured: false,
  },
];

/** Comparison — Platform / AI / Operations / Support. */
export const PRICING_PAGE_COMPARISON = {
  sectionId: "pricing-comparison",
  headline: "Compare plans",
  valueLabels: {
    included: "Included",
    dash: "—",
    custom: "Custom",
  } satisfies Record<PricingComparisonValue, string>,
  groups: [
    {
      id: "platform",
      label: "Platform",
      rows: [
        {
          id: "workspace",
          label: "Hotel workspace",
          starter: "included",
          pro: "included",
          enterprise: "included",
        },
        {
          id: "multi-property",
          label: "Multi-property",
          starter: "dash",
          pro: "dash",
          enterprise: "included",
        },
      ],
    },
    {
      id: "ai",
      label: "AI",
      rows: [
        {
          id: "ai-reception",
          label: "AI reception",
          starter: "included",
          pro: "included",
          enterprise: "included",
        },
        {
          id: "analytics",
          label: "Advanced analytics",
          starter: "dash",
          pro: "included",
          enterprise: "included",
        },
        {
          id: "revenue",
          label: "Revenue recommendations",
          starter: "dash",
          pro: "included",
          enterprise: "included",
        },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      rows: [
        {
          id: "channels",
          label: "Guest channels",
          starter: "included",
          pro: "included",
          enterprise: "included",
        },
        {
          id: "knowledge",
          label: "Knowledge base",
          starter: "included",
          pro: "included",
          enterprise: "included",
        },
      ],
    },
    {
      id: "support",
      label: "Support",
      rows: [
        {
          id: "priority",
          label: "Priority support",
          starter: "dash",
          pro: "included",
          enterprise: "included",
        },
        {
          id: "onboarding",
          label: "Custom onboarding",
          starter: "dash",
          pro: "dash",
          enterprise: "included",
        },
        {
          id: "success",
          label: "Dedicated success",
          starter: "dash",
          pro: "dash",
          enterprise: "custom",
        },
      ],
    },
  ] satisfies PricingComparisonGroup[],
} as const;

/** FAQ — purchase questions only. Short answers. */
export const PRICING_PAGE_FAQ = {
  sectionId: "pricing-faq",
  headline: "Pricing FAQ",
  items: [
    {
      id: "trial",
      question: "Is there a free trial?",
      answer:
        "Yes. Starter and Pro include a free trial so you can evaluate before subscribing.",
    },
    {
      id: "change-plans",
      question: "Can I change plans later?",
      answer:
        "Yes. Upgrade or downgrade from billing. Changes apply on the next billing cycle.",
    },
    {
      id: "cancel",
      question: "Can I cancel anytime?",
      answer:
        "Yes. Cancel from billing settings. Access continues through the current billing period.",
    },
    {
      id: "multi-hotel",
      question: "Do you support multiple hotels?",
      answer:
        "Enterprise includes multi-property management. Starter and Pro are for a single hotel workspace.",
    },
    {
      id: "pms",
      question: "Will this replace our PMS?",
      answer:
        "No. Monavel works with your existing PMS. Migration is included in onboarding.",
    },
  ] satisfies PricingFaqItem[],
} as const;
