import type { LucideIcon } from "lucide-react";
import { Handshake, Mail, MessageSquare } from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type ContactMethod = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  email: string;
};

export const CONTACT_PAGE_HERO = {
  overline: "Contact",
  headline: "Let's talk about your hotel.",
  subhead:
    "Evaluating Monavel, planning a demo, or exploring a partnership — we will help you find the right next step.",
  primaryCtaLabel: "Book a demo",
  primaryCtaHref: MARKETING_CTA.demo,
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const CONTACT_PAGE_METHODS = {
  sectionId: "contact-methods",
  overline: "Contact methods",
  headline: "Reach the right team.",
  subhead:
    "Choose the channel that fits your request. We respond to sales and general inquiries by email.",
  methods: [
    {
      id: "sales",
      icon: MessageSquare,
      title: "Sales",
      description:
        "Questions about plans, trials, Enterprise pricing, or getting started with Monavel.",
      email: "sales@monavel.app",
    },
    {
      id: "partnerships",
      icon: Handshake,
      title: "Partnerships",
      description:
        "Technology partners, integrations, and collaboration opportunities with Monavel.",
      email: "hello@monavel.app",
    },
    {
      id: "general",
      icon: Mail,
      title: "General inquiries",
      description:
        "Product questions, press, or anything that does not fit sales or partnerships.",
      email: "hello@monavel.app",
    },
  ] satisfies ContactMethod[],
} as const;

export const CONTACT_PAGE_FORM = {
  sectionId: "contact-form",
  overline: "Sales inquiry",
  headline: "Tell us about your hotel.",
  subhead:
    "Share a few details and our team will follow up about demos, trials, or Enterprise options.",
  submitLabel: "Contact sales",
  successTitle: "Thanks for reaching out.",
  successMessage:
    "We received your inquiry. Our team will respond by email as soon as possible.",
  fields: {
    name: { id: "contact-name", label: "Name", required: true },
    hotel: { id: "contact-hotel", label: "Hotel", required: true },
    email: { id: "contact-email", label: "Email", required: true },
    rooms: { id: "contact-rooms", label: "Number of rooms", required: false },
    message: { id: "contact-message", label: "Message", required: true },
  },
} as const;

export const CONTACT_PAGE_FAQ = {
  sectionId: "contact-faq",
  overline: "FAQ",
  headline: "Before you write.",
  subhead: "Quick answers to common questions about contacting Monavel.",
  items: [
    {
      question: "How quickly will you reply?",
      answer:
        "We aim to respond to sales and general inquiries within one to two business days.",
    },
    {
      question: "Do you work internationally?",
      answer:
        "Yes. Monavel works with hotels internationally. Tell us where you operate and we will confirm availability.",
    },
    {
      question: "Can I schedule a demo?",
      answer:
        "Yes. Use Book a demo above or mention your preferred time in the sales inquiry form.",
    },
    {
      question: "Can I migrate from another PMS?",
      answer:
        "We can discuss migration during onboarding. Share your current system in the form and we will outline next steps.",
    },
  ],
} as const;
