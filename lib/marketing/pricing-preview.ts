import type { BillingPlan } from "@/types/subscription";

import { MKT_CTA } from "@/lib/marketing/product-language";
import { MARKETING_CTA } from "@/lib/marketing/routes";

export type PricingPreviewPlan = {
  id: BillingPlan;
  name: string;
  /** Answers “Who is this for?” — deployment model, not a tier. */
  audience: string;
  /** Deployment signals — not a feature checklist. */
  points: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
};

export const PRICING_PREVIEW_CONTENT = {
  sectionId: "pricing-preview",
  headline: "Start with one hotel.",
  headlineAccent: "Grow without changing platforms.",
  subhead:
    "Every deployment includes the same Monavel Runtime. The only difference is how many properties you operate.",
  /** Key message — sits above the deployment cards. */
  keyMessageLines: [
    "The Runtime never changes.",
    "Only your operational scale does.",
  ] as const,
  deploymentLabel: "Deployment",
  faqLinkLabel: "View full details",
  faqLinkHref: "/pricing",
} as const;

/** Deployment guarantees — how Monavel enters the business. */
export const PRICING_DEPLOYMENT_STRIP = [
  "Launch in days",
  "Works with your PMS",
  "Migration included",
  "Guided onboarding",
  "No rip-and-replace",
] as const;

/** @deprecated Use PRICING_DEPLOYMENT_STRIP */
export const PRICING_IMPLEMENTATION_STRIP = PRICING_DEPLOYMENT_STRIP;

export const PRICING_PREVIEW_PLANS: PricingPreviewPlan[] = [
  {
    id: "starter",
    name: "Independent Hotel",
    audience: "For one property.",
    points: ["One Runtime.", "Go live in days."],
    ctaLabel: MKT_CTA.startFreeTrial,
    ctaHref: MARKETING_CTA.trial,
    featured: false,
  },
  {
    id: "pro",
    name: "Growing Hotel",
    audience: "One hotel with deeper insight and support.",
    points: [
      "Deeper insight.",
      "Priority support.",
      "Same Runtime as you scale.",
    ],
    ctaLabel: MKT_CTA.bookDemo,
    ctaHref: MARKETING_CTA.demo,
    featured: true,
  },
  {
    id: "enterprise",
    name: "Hotel Groups",
    audience: "Enterprise deployment.",
    points: [
      "Centralized Runtime.",
      "Dedicated rollout.",
      "Priority support.",
    ],
    ctaLabel: MKT_CTA.contactSales,
    ctaHref: "/contact",
    featured: false,
  },
];

export const PRICING_PREVIEW_FAQ = [
  {
    question: "How do I know which deployment fits?",
    answer:
      "Independent Hotel is one property. Growing Hotel adds deeper insight and support for one property. Hotel Groups covers multi-property rollout.",
  },
  {
    question: "Does the Runtime change between deployments?",
    answer:
      "No. Every deployment includes the same Monavel Runtime. Only operational scale changes.",
  },
  {
    question: "Can I start with one hotel and grow later?",
    answer:
      "Yes. Start with a single property and expand when you are ready. You do not change platforms.",
  },
  {
    question: "Will this replace our PMS?",
    answer:
      "No. Monavel works with your existing PMS. Deployment is designed for migration without rip-and-replace.",
  },
] as const;
