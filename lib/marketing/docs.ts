import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Building2,
  Calendar,
  Cable,
  ChartColumn,
  CircleHelp,
  CreditCard,
  Globe,
  KeyRound,
  Mail,
  MessageCircle,
  MessageSquare,
  Radio,
  ScrollText,
  Settings2,
  Shield,
  Sparkles,
  Users,
  Webhook,
  Workflow,
} from "lucide-react";

export type DocsSidebarLink = {
  type: "link";
  href: string;
  label: string;
};

export type DocsSidebarGroup = {
  type: "group";
  label: string;
  items: readonly { href: string; label: string }[];
};

export type DocsSidebarEntry = DocsSidebarLink | DocsSidebarGroup;

export type DocsSection = {
  id: string;
  title: string;
  body: string;
};

export type DocsNextStep = {
  href: string;
  label: string;
  description: string;
};

export type DocsArticle = {
  path: string;
  title: string;
  description: string;
  sections: readonly DocsSection[];
  nextSteps: readonly DocsNextStep[];
};

export type DocsNavCard = {
  id: string;
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  meta?: string;
};

export type DocsSearchEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  group: string;
};

/** @deprecated Prefer DocsNavCard */
export type DocsLandingCard = DocsNavCard;

export const DOCS_SIDEBAR_NAV: readonly DocsSidebarEntry[] = [
  {
    type: "link",
    href: "/docs/getting-started",
    label: "Getting Started",
  },
  {
    type: "group",
    label: "Channels",
    items: [
      { href: "/docs/channels/telegram", label: "Telegram" },
      { href: "/docs/channels/website-chat", label: "Website Chat" },
    ],
  },
  {
    type: "link",
    href: "/docs/knowledge-base",
    label: "Knowledge Base",
  },
  {
    type: "link",
    href: "/docs/billing",
    label: "Billing",
  },
  {
    type: "group",
    label: "Design",
    items: [{ href: "/brand", label: "Brand Book" }],
  },
] as const;

export const DOCS_LANDING = {
  path: "/docs",
  title: "Documentation",
  description:
    "Everything you need to deploy, configure and operate Monavel.",
  searchPlaceholder: "Search documentation...",
  gettingStarted: {
    id: "getting-started",
    title: "Getting Started",
    cards: [
      {
        id: "install",
        href: "/docs/getting-started",
        title: "Install Monavel",
        description: "Deploy your first workspace.",
        meta: "2 min",
        icon: Sparkles,
      },
      {
        id: "workspace",
        href: "/docs/getting-started",
        title: "Create Workspace",
        description: "Configure your hotel.",
        meta: "3 min",
        icon: Building2,
      },
      {
        id: "channels",
        href: "/docs/channels/telegram",
        title: "Connect Channels",
        description: "Telegram, Website, WhatsApp.",
        meta: "4 min",
        icon: Radio,
      },
      {
        id: "invite",
        href: "/docs/getting-started",
        title: "Invite Team",
        description: "Invite hotel staff.",
        meta: "1 min",
        icon: Users,
      },
    ] satisfies DocsNavCard[],
  },
  platform: {
    id: "platform",
    title: "Platform",
    cards: [
      {
        id: "runtime",
        href: "/docs/getting-started",
        title: "Runtime",
        description: "Shared operating layer for every workspace.",
        icon: Settings2,
      },
      {
        id: "reception-ai",
        href: "/docs/getting-started",
        title: "Reception AI",
        description: "Guest conversations with hotel context.",
        icon: Bot,
      },
      {
        id: "knowledge",
        href: "/docs/knowledge-base",
        title: "Knowledge Base",
        description: "Policies and FAQs for consistent answers.",
        icon: BookOpen,
      },
      {
        id: "guests",
        href: "/docs/getting-started",
        title: "Guests",
        description: "Profiles connected to live operations.",
        icon: Users,
      },
      {
        id: "reservations",
        href: "/docs/getting-started",
        title: "Reservations",
        description: "Bookings synced with hotel systems.",
        icon: Calendar,
      },
      {
        id: "operations",
        href: "/docs/getting-started",
        title: "Operations",
        description: "Day-to-day hotel workflows.",
        icon: Workflow,
      },
      {
        id: "analytics",
        href: "/docs/getting-started",
        title: "Analytics",
        description: "Signals for operational decisions.",
        icon: ChartColumn,
      },
      {
        id: "automation",
        href: "/docs/getting-started",
        title: "Automation",
        description: "Repeatable Runtime workflows.",
        icon: Sparkles,
      },
    ] satisfies DocsNavCard[],
  },
  integrations: {
    id: "integrations",
    title: "Integrations",
    cards: [
      {
        id: "telegram",
        href: "/docs/channels/telegram",
        title: "Telegram",
        description: "Route guest messages into Reception AI.",
        icon: Radio,
      },
      {
        id: "whatsapp",
        href: "/docs/getting-started",
        title: "WhatsApp",
        description: "Connect WhatsApp guest conversations.",
        icon: MessageCircle,
      },
      {
        id: "website-chat",
        href: "/docs/channels/website-chat",
        title: "Website Chat",
        description: "Embed chat on your hotel website.",
        icon: MessageSquare,
      },
      {
        id: "email",
        href: "/docs/getting-started",
        title: "Email",
        description: "Bring guest email into one inbox.",
        icon: Mail,
      },
      {
        id: "pms",
        href: "/docs/getting-started",
        title: "PMS",
        description: "Connect your property management system.",
        icon: Building2,
      },
      {
        id: "stripe",
        href: "/docs/billing",
        title: "Stripe",
        description: "Billing and subscription payments.",
        icon: CreditCard,
      },
      {
        id: "google-calendar",
        href: "/docs/getting-started",
        title: "Google Calendar",
        description: "Sync operational calendar events.",
        icon: Calendar,
      },
    ] satisfies DocsNavCard[],
  },
  administration: {
    id: "administration",
    title: "Administration",
    cards: [
      {
        id: "workspace",
        href: "/docs/getting-started",
        title: "Workspace",
        description: "Configure hotel workspace settings.",
        icon: Building2,
      },
      {
        id: "users",
        href: "/docs/getting-started",
        title: "Users",
        description: "Manage hotel staff accounts.",
        icon: Users,
      },
      {
        id: "roles",
        href: "/docs/getting-started",
        title: "Roles & Permissions",
        description: "Control access across the hotel.",
        icon: KeyRound,
      },
      {
        id: "billing",
        href: "/docs/billing",
        title: "Billing",
        description: "Plans, invoices, and payments.",
        icon: CreditCard,
      },
      {
        id: "security",
        href: "/docs/getting-started",
        title: "Security",
        description: "Protect hotel data and access.",
        icon: Shield,
      },
      {
        id: "audit-logs",
        href: "/docs/getting-started",
        title: "Audit Logs",
        description: "Review important account activity.",
        icon: ScrollText,
      },
    ] satisfies DocsNavCard[],
  },
  developer: {
    id: "developer",
    title: "Developer",
    cards: [
      {
        id: "api",
        href: "/docs/getting-started",
        title: "API",
        description: "Call Monavel from your own services.",
        icon: Cable,
      },
      {
        id: "authentication",
        href: "/docs/getting-started",
        title: "Authentication",
        description: "Secure access for apps and integrations.",
        icon: KeyRound,
      },
      {
        id: "webhooks",
        href: "/docs/getting-started",
        title: "Webhooks",
        description: "Receive events when hotel data changes.",
        icon: Webhook,
      },
      {
        id: "sdk",
        href: "/docs/getting-started",
        title: "SDK",
        description: "Build with Monavel client libraries.",
        icon: Globe,
      },
    ] satisfies DocsNavCard[],
  },
  popularArticles: {
    id: "popular",
    title: "Popular Articles",
    items: [
      { href: "/docs/channels/telegram", label: "Connect Telegram" },
      { href: "/docs/getting-started", label: "Train Reception AI" },
      { href: "/docs/knowledge-base", label: "Import Knowledge Base" },
      { href: "/docs/channels/website-chat", label: "Configure Website Chat" },
      { href: "/docs/getting-started", label: "Invite Hotel Staff" },
    ],
  },
  support: {
    id: "support",
    title: "Need help?",
    links: [
      { href: "/contact", label: "Community", icon: Users },
      { href: "/contact", label: "Support", icon: CircleHelp },
      { href: "/contact", label: "System Status", icon: Globe },
    ],
  },
} as const;

/** Flat search index for the docs landing search field. */
export function getDocsSearchEntries(): DocsSearchEntry[] {
  const entries: DocsSearchEntry[] = [];

  for (const card of DOCS_LANDING.gettingStarted.cards) {
    entries.push({
      id: `gs-${card.id}`,
      title: card.title,
      description: card.description,
      href: card.href,
      group: DOCS_LANDING.gettingStarted.title,
    });
  }
  for (const card of DOCS_LANDING.platform.cards) {
    entries.push({
      id: `platform-${card.id}`,
      title: card.title,
      description: card.description,
      href: card.href,
      group: DOCS_LANDING.platform.title,
    });
  }
  for (const card of DOCS_LANDING.integrations.cards) {
    entries.push({
      id: `integrations-${card.id}`,
      title: card.title,
      description: card.description,
      href: card.href,
      group: DOCS_LANDING.integrations.title,
    });
  }
  for (const card of DOCS_LANDING.administration.cards) {
    entries.push({
      id: `administration-${card.id}`,
      title: card.title,
      description: card.description,
      href: card.href,
      group: DOCS_LANDING.administration.title,
    });
  }
  for (const card of DOCS_LANDING.developer.cards) {
    entries.push({
      id: `developer-${card.id}`,
      title: card.title,
      description: card.description,
      href: card.href,
      group: DOCS_LANDING.developer.title,
    });
  }
  for (const item of DOCS_LANDING.popularArticles.items) {
    entries.push({
      id: `popular-${item.label}`,
      title: item.label,
      description: DOCS_LANDING.popularArticles.title,
      href: item.href,
      group: DOCS_LANDING.popularArticles.title,
    });
  }

  return entries;
}

export const DOCS_GETTING_STARTED: DocsArticle = {
  path: "/docs/getting-started",
  title: "Getting Started",
  description:
    "Set up Monavel from account creation through your first guest conversation — the minimum path for trial users.",
  sections: [
    {
      id: "create-account",
      title: "Create account",
      body:
        "Sign up for Monavel and confirm your login. You need an authenticated account before creating a hotel workspace.",
    },
    {
      id: "create-hotel",
      title: "Create hotel",
      body:
        "During onboarding, create your hotel profile with basic property details. This establishes the tenant context for bookings, guests, and channels.",
    },
    {
      id: "configure-workspace",
      title: "Configure workspace",
      body:
        "Open Settings to review AI, team access, and hotel configuration. A configured workspace ensures reception and operations share the same context.",
    },
    {
      id: "connect-channel",
      title: "Connect first channel",
      body:
        "Choose Website Chat or Telegram under Settings → Channels. Connecting one channel is enough to start evaluating guest conversations during your trial.",
    },
    {
      id: "receive-conversations",
      title: "Start receiving conversations",
      body:
        "Once a channel is connected, guest messages appear in Reception AI. Your team can monitor conversations and step in when needed.",
    },
  ],
  nextSteps: [
    {
      href: "/docs/channels/telegram",
      label: "Telegram",
      description: "Connect a Telegram bot for guest messaging.",
    },
    {
      href: "/docs/channels/website-chat",
      label: "Website Chat",
      description: "Enable the website chat widget on your site.",
    },
  ],
};

export const DOCS_TELEGRAM: DocsArticle = {
  path: "/docs/channels/telegram",
  title: "Telegram",
  description:
    "Connect Telegram so guest messages route into Monavel Reception AI with shared knowledge context.",
  sections: [
    {
      id: "create-bot",
      title: "Create bot",
      body:
        "Create a Telegram bot through BotFather. You will receive a bot token used to link Telegram with your Monavel hotel.",
    },
    {
      id: "connect-token",
      title: "Connect token",
      body:
        "In Monavel, open Settings → Channels and enter your Telegram bot token. Monavel associates the bot with your hotel workspace.",
    },
    {
      id: "enable-channel",
      title: "Enable channel",
      body:
        "Enable the Telegram channel after the token is saved. The channel must be active before Monavel can receive guest messages.",
    },
    {
      id: "test-message",
      title: "Test message",
      body:
        "Send a test message to your bot from Telegram. Confirm the conversation appears in Reception AI and that replies use your hotel context.",
    },
  ],
  nextSteps: [
    {
      href: "/docs/knowledge-base",
      label: "Knowledge Base",
      description: "Add articles so AI replies stay accurate.",
    },
    {
      href: "/docs/channels/website-chat",
      label: "Website Chat",
      description: "Add website chat as a second guest channel.",
    },
  ],
};

export const DOCS_WEBSITE_CHAT: DocsArticle = {
  path: "/docs/channels/website-chat",
  title: "Website Chat",
  description:
    "Enable the Monavel website chat widget so guests can message your hotel directly from your website.",
  sections: [
    {
      id: "enable-widget",
      title: "Enable widget",
      body:
        "Open Settings → Channels and enable Website Chat for your hotel. This prepares Monavel to accept conversations from your site.",
    },
    {
      id: "install-snippet",
      title: "Install snippet",
      body:
        "Copy the website chat installation details from Settings → Channels and add them to your hotel website. Installation is managed in your site — not through this documentation.",
    },
    {
      id: "receive-conversations",
      title: "Receive conversations",
      body:
        "After installation, open your website and send a test message. The conversation should appear in Reception AI alongside Telegram and other connected channels.",
    },
  ],
  nextSteps: [
    {
      href: "/docs/knowledge-base",
      label: "Knowledge Base",
      description: "Publish policies and FAQs for AI replies.",
    },
    {
      href: "/docs/channels/telegram",
      label: "Telegram",
      description: "Connect Telegram as an additional channel.",
    },
  ],
};

export const DOCS_KNOWLEDGE_BASE: DocsArticle = {
  path: "/docs/knowledge-base",
  title: "Knowledge Base",
  description:
    "Build hotel knowledge that powers consistent AI responses across guest channels and staff workflows.",
  sections: [
    {
      id: "create-articles",
      title: "Create articles",
      body:
        "Open the Knowledge workspace and create articles for topics guests ask about — check-in, amenities, local information, and services.",
    },
    {
      id: "hotel-policies",
      title: "Hotel policies",
      body:
        "Document cancellation rules, pet policies, parking, and other operational policies. Clear policy articles reduce inconsistent guest answers.",
    },
    {
      id: "faqs",
      title: "FAQs",
      body:
        "Add frequently asked questions your front desk receives daily. Short FAQ articles help AI handle repetitive inquiries accurately.",
    },
    {
      id: "ai-answers",
      title: "AI uses these answers",
      body:
        "Monavel AI draws from published knowledge when replying on Website Chat and Telegram. Update articles when policies change so guest-facing answers stay current.",
    },
  ],
  nextSteps: [
    {
      href: "/docs/channels/telegram",
      label: "Telegram",
      description: "Test AI replies on a connected Telegram bot.",
    },
    {
      href: "/docs/getting-started",
      label: "Getting Started",
      description: "Review the full trial setup path.",
    },
  ],
};

export const DOCS_BILLING: DocsArticle = {
  path: "/docs/billing",
  title: "Billing",
  description:
    "How trials, subscriptions, upgrades, and invoices work in Monavel billing settings.",
  sections: [
    {
      id: "trial",
      title: "Trial",
      body:
        "Starter and Pro plans include a trial period so you can connect channels and evaluate Monavel before subscribing. Trial access is managed from Settings → Billing.",
    },
    {
      id: "subscription",
      title: "Subscription",
      body:
        "When you subscribe, your hotel moves to an active plan with billing managed inside Monavel. Your plan determines available workspaces and channel limits.",
    },
    {
      id: "upgrade",
      title: "Upgrade",
      body:
        "Upgrade or change plans from Settings → Billing. Plan changes take effect on your next billing cycle unless noted otherwise during checkout.",
    },
    {
      id: "invoices",
      title: "Invoices",
      body:
        "Invoices and payment history are available through billing settings. Use the billing portal to review charges and manage payment details.",
    },
  ],
  nextSteps: [
    {
      href: "/docs/getting-started",
      label: "Getting Started",
      description: "Continue setting up your hotel workspace.",
    },
    {
      href: "/pricing",
      label: "Pricing",
      description: "Compare plans before upgrading.",
    },
  ],
};

export const DOCS_ARTICLES = {
  "getting-started": DOCS_GETTING_STARTED,
  telegram: DOCS_TELEGRAM,
  "website-chat": DOCS_WEBSITE_CHAT,
  "knowledge-base": DOCS_KNOWLEDGE_BASE,
  billing: DOCS_BILLING,
} as const;

export type DocsArticleId = keyof typeof DOCS_ARTICLES;
