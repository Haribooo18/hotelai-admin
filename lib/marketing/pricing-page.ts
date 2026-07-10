import type { BillingPlan } from "@/types/subscription";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type PricingComparisonStatus = "included" | "available" | "contact-sales";

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
};

export type PricingComparisonRow = {
  id: string;
  label: string;
  starter: PricingComparisonStatus;
  pro: PricingComparisonStatus;
  enterprise: PricingComparisonStatus;
};

export const PRICING_PAGE_HERO = {
  overline: "Pricing",
  headline: "Simple pricing for every hotel.",
  subhead:
    "Choose a plan that matches your hotel size and growth stage. Start with a free trial on Starter or Pro, or talk to us about Enterprise.",
  primaryCtaLabel: "Start free trial",
  primaryCtaHref: MARKETING_CTA.trial,
  secondaryCtaLabel: "Book a demo",
  secondaryCtaHref: MARKETING_CTA.demo,
} as const;

export const PRICING_PAGE_PLANS_SECTION = {
  sectionId: "pricing-plans",
  overline: "Plans",
  headline: "Three plans. One platform.",
  subhead:
    "Every plan includes the core Monavel workspace. Upgrade when you need priority support, multi-property management, or dedicated onboarding.",
} as const;

export const PRICING_PAGE_PLANS: PricingPagePlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For independent hotels getting started with AI reception.",
    priceLabel: "€49",
    priceNote: "per month",
    features: [
      "One hotel workspace",
      "All core workspaces",
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
    description: "For growing hotels that need deeper AI and support.",
    priceLabel: "€149",
    priceNote: "per month",
    features: [
      "Everything in Starter",
      "Advanced AI analytics",
      "Priority support",
      "Revenue recommendations",
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
      "Custom onboarding",
      "Dedicated success manager",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "/contact",
    featured: false,
  },
];

export const PRICING_PAGE_COMPARISON = {
  sectionId: "pricing-comparison",
  overline: "Compare plans",
  headline: "Feature comparison.",
  subhead:
    "A clear view of what is included in each plan — based on real Monavel capabilities.",
  statusLabels: {
    included: "Included",
    available: "Available",
    "contact-sales": "Contact sales",
  } satisfies Record<PricingComparisonStatus, string>,
  rows: [
    {
      id: "dashboard",
      label: "Dashboard",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "bookings",
      label: "Bookings",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "guests",
      label: "Guests",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "rooms",
      label: "Rooms",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "calendar",
      label: "Calendar",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "revenue",
      label: "Revenue",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "ai-reception",
      label: "AI Reception",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "website-chat",
      label: "Website Chat",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "telegram",
      label: "Telegram",
      starter: "included",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "priority-support",
      label: "Priority Support",
      starter: "available",
      pro: "included",
      enterprise: "included",
    },
    {
      id: "custom-onboarding",
      label: "Custom onboarding",
      starter: "contact-sales",
      pro: "available",
      enterprise: "included",
    },
    {
      id: "enterprise-support",
      label: "Enterprise support",
      starter: "contact-sales",
      pro: "contact-sales",
      enterprise: "included",
    },
  ] satisfies PricingComparisonRow[],
} as const;

export const PRICING_PAGE_AUDIENCE = {
  sectionId: "pricing-audience",
  overline: "Who is this plan for?",
  headline: "Find the right fit.",
  subhead:
    "Monavel scales from a single independent hotel to multi-property groups — choose the plan that matches how you operate today.",
  cards: [
    {
      id: "starter",
      planName: "Starter",
      audience: "Small hotels",
      description:
        "Independent properties starting with AI reception and a unified workspace.",
    },
    {
      id: "pro",
      planName: "Pro",
      audience: "Growing hotels",
      description:
        "Hotels with higher guest volume that need priority support and deeper AI analytics.",
    },
    {
      id: "enterprise",
      planName: "Enterprise",
      audience: "Hotel groups and chains",
      description:
        "Multi-property operators that need custom onboarding, SLAs, and dedicated support.",
    },
  ],
} as const;

export const PRICING_PAGE_FAQ = {
  sectionId: "pricing-faq",
  overline: "FAQ",
  headline: "Common pricing questions.",
  subhead:
    "Answers to the questions hotels ask most before starting a trial or conversation with our team.",
  contactLinkLabel: "Contact us",
  contactLinkHref: "/contact",
  items: [
    {
      question: "Can I change plans later?",
      answer:
        "Yes. You can upgrade or downgrade from billing settings. Changes take effect on your next billing cycle.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Starter and Pro include a free trial so you can connect channels and evaluate AI reception before subscribing.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "You can cancel your subscription from billing settings. Access continues through the end of your current billing period.",
    },
    {
      question: "Do you offer onboarding?",
      answer:
        "Pro includes standard onboarding resources. Enterprise includes custom onboarding tailored to your properties and workflows.",
    },
    {
      question: "Do you support multiple hotels?",
      answer:
        "Enterprise supports multi-property management. Starter and Pro are designed for a single hotel workspace.",
    },
    {
      question: "How does AI billing work?",
      answer:
        "AI reception is included in your plan subscription. Billing is per hotel — not per room or per guest message.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Monavel uses tenant isolation, role-based access, and secure cloud infrastructure. Each hotel's data stays separate.",
    },
    {
      question: "Can I migrate from another PMS?",
      answer:
        "We can help you plan a migration during onboarding. Contact us to discuss your current systems and timeline.",
    },
  ],
} as const;
