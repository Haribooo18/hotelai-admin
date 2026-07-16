import type { LucideIcon } from "lucide-react";
import { Handshake, Mail, MessageSquare } from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type ContactMethod = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  email: string;
  highlights: readonly string[];
};

export const CONTACT_PAGE_HERO = {
  overline: "Contact",
  headline: "Let's talk about your hotel.",
  subhead:
    "Tell us about your property. We will tailor the conversation around your existing workflows.",
  primaryCtaLabel: "Book a demo",
  primaryCtaHref: MARKETING_CTA.demo,
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const CONTACT_PAGE_JOURNEY = {
  steps: [
    {
      title: "Your hotel",
      description: "Property, priorities, and operations.",
    },
    {
      title: "Discovery",
      description: "Workflows, systems, and friction.",
    },
    {
      title: "Personal demo",
      description: "Monavel around your hotel.",
    },
    {
      title: "Launch plan",
      description: "A practical path to value.",
    },
  ],
  meta: ["30-minute walkthrough", "Existing PMS supported", "No obligation"],
} as const;

export const CONTACT_PAGE_METHODS = {
  sectionId: "contact-methods",
  overline: "Contact methods",
  headline: "Reach the right team.",
  subhead: "Choose the channel that fits your request.",
  methods: [
    {
      id: "sales",
      icon: MessageSquare,
      title: "Sales",
      description: "Plans, pricing, demos, trials, and getting started.",
      email: "sales@monavel.app",
      highlights: ["Enterprise", "Pricing", "Demo"],
    },
    {
      id: "partnerships",
      icon: Handshake,
      title: "Partnerships",
      description: "Technology partners, integrations, and collaboration.",
      email: "hello@monavel.app",
      highlights: ["Integrations", "API", "Marketplace"],
    },
    {
      id: "general",
      icon: Mail,
      title: "General inquiries",
      description: "Product questions, press, and company inquiries.",
      email: "hello@monavel.app",
      highlights: ["Press", "Questions", "Company"],
    },
  ] satisfies ContactMethod[],
} as const;

export const CONTACT_ROOM_OPTIONS = [
  { value: "1-20", label: "1–20 rooms" },
  { value: "21-50", label: "21–50 rooms" },
  { value: "51-100", label: "51–100 rooms" },
  { value: "101-250", label: "101–250 rooms" },
  { value: "251+", label: "251+ rooms" },
] as const;

export const CONTACT_PAGE_FORM = {
  sectionId: "contact-form",
  overline: "Sales inquiry",
  headline: "Tell us about your hotel.",
  subhead:
    "Share the essentials. We will use them to make the first conversation relevant.",
  submitLabel: "Contact sales",
  successTitle: "Thanks for reaching out.",
  successMessage:
    "We received your inquiry. Our team will respond by email as soon as possible.",
  fields: {
    name: { id: "contact-name", label: "Name", required: true },
    hotel: { id: "contact-hotel", label: "Hotel", required: true },
    email: { id: "contact-email", label: "Email", required: true },
    rooms: {
      id: "contact-rooms",
      label: "Number of rooms",
      required: false,
    },
    message: {
      id: "contact-message",
      label: "What would you like to improve?",
      required: true,
    },
  },
} as const;

export const CONTACT_PAGE_FAQ = {
  sectionId: "contact-faq",
  overline: "FAQ",
  headline: "Before you write.",
  subhead: "Quick answers to common questions.",
  items: [
    {
      question: "How quickly will you reply?",
      answer: "Usually within one to two business days.",
    },
    {
      question: "Do you work internationally?",
      answer: "Yes. Tell us where your hotel operates.",
    },
    {
      question: "Can I schedule a demo?",
      answer: "Yes. Book directly or mention your preferred time.",
    },
    {
      question: "Can I migrate from another PMS?",
      answer:
        "Yes. We will evaluate your current PMS and outline the next step.",
    },
  ],
} as const;
