import type { BillingPlan } from "@/types/subscription";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type PricingPreviewPlan = {
  id: BillingPlan;
  name: string;
  description: string;
  priceLabel: string;
  priceNote?: string;
  features: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
};

export const PRICING_PREVIEW_CONTENT = {
  sectionId: "pricing-preview",
  overline: "Pricing",
  headline: "Simple pricing.",
  headlineAccent: "Built to grow with your hotel.",
  subhead:
    "Start with a free trial on Starter or Pro. Scale to Enterprise when you need multi-property support and dedicated onboarding.",
  faqLinkLabel: "View all pricing details",
  faqLinkHref: "/pricing",
} as const;

export const PRICING_PREVIEW_PLANS: PricingPreviewPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For independent hotels getting started with AI reception.",
    priceLabel: "€49",
    priceNote: "per month",
    features: [
      "AI reception for one hotel",
      "Website Chat and Telegram",
      "Knowledge base",
      "Up to 500 AI replies per month",
    ],
    ctaLabel: "Start free trial",
    ctaHref: MARKETING_CTA.trial,
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing hotels that need deeper AI and analytics.",
    priceLabel: "€149",
    priceNote: "per month",
    features: [
      "Everything in Starter",
      "Advanced AI analytics",
      "Priority support",
      "Up to 5,000 AI replies per month",
    ],
    ctaLabel: "Start free trial",
    ctaHref: MARKETING_CTA.trial,
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For hotel groups with custom workflows and SLAs.",
    priceLabel: "Custom",
    features: [
      "Everything in Pro",
      "Multi-property management",
      "Dedicated success manager",
      "Unlimited AI replies",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "/contact",
    featured: false,
  },
];

export const PRICING_PREVIEW_FAQ = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Starter and Pro include a free trial so you can connect channels and test AI reception before subscribing.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "You can upgrade or downgrade at any time from billing settings. Changes apply on your next billing cycle.",
  },
  {
    question: "What is included in Enterprise?",
    answer:
      "Enterprise adds multi-property support, custom onboarding, SLA options, and unlimited AI reply volume.",
  },
  {
    question: "Do you charge per room?",
    answer:
      "No. Monavel pricing is per hotel. Choose the plan that matches your channel volume and team size.",
  },
] as const;
