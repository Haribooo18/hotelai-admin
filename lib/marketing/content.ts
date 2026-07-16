export const LANDING_FEATURES = [
  {
    title: "24/7 AI reception",
    description:
      "Instant guest answers with hotel policies and knowledge base context.",
  },
  {
    title: "Unified inbox",
    description:
      "Telegram, Website Chat, and other channels in one panel for your front desk team.",
  },
  {
    title: "Knowledge base",
    description:
      "Publish articles for AI — answers stay aligned with current hotel information.",
  },
  {
    title: "Analytics",
    description:
      "Conversation status, AI action logs, and diagnostics in hotel settings.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Connect channels",
    description: "Set up Telegram bot and Website Chat widget in minutes.",
  },
  {
    step: 2,
    title: "Build knowledge base",
    description: "Add FAQ, policies, and hotel services for accurate AI answers.",
  },
  {
    step: 3,
    title: "AI responds to guests",
    description:
      "Guests get real-time answers while your team sees everything in the inbox.",
  },
] as const;

export const AI_CHANNELS = [
  {
    title: "Telegram",
    description: "Guest messages via Bot API with AI auto-replies.",
  },
  {
    title: "Website Chat",
    description: "On-site widget with streaming SSE conversation.",
  },
  {
    title: "Knowledge Base",
    description: "AI context from published knowledge articles.",
  },
  {
    title: "Analytics",
    description: "Conversation metrics, AI action logs, and platform diagnostics.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Do I need a separate server?",
    answer:
      "No. Monavel runs on Vercel with data stored in Supabase, isolated per hotel.",
  },
  {
    question: "Which channels are supported?",
    answer:
      "Telegram and Website Chat today. Architecture is ready for WhatsApp and email.",
  },
  {
    question: "How do I start a free trial?",
    answer:
      "Click Start free trial, sign in to the panel, and subscribe in Billing.",
  },
  {
    question: "Can AI be disabled?",
    answer:
      "Yes. AI reception can be enabled and configured per hotel in the admin panel.",
  },
] as const;

export const FEATURE_SECTIONS = [
  {
    title: "Booking management",
    description: "Bookings, rooms, calendar, and guests in one PMS panel.",
  },
  {
    title: "AI reception",
    description: "Conversation inbox, streaming responses, tools, and observability.",
  },
  {
    title: "Multi-tenancy",
    description: "Each hotel isolated via hotel_id and Row Level Security.",
  },
  {
    title: "Stripe billing",
    description: "Starter, Pro, and Enterprise plans with Checkout and Billing Portal.",
  },
] as const;
