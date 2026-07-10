import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Database,
  KeyRound,
  Lock,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";

import { MARKETING_CTA } from "@/lib/marketing/routes";

export type SecurityPrinciple = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SECURITY_PAGE_HERO = {
  overline: "Security",
  headline: "Security built into every workspace.",
  subhead:
    "Monavel is designed with security, tenant isolation, and operational reliability in mind — so each hotel runs on a platform built to protect its data.",
  primaryCtaLabel: "Contact sales",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const SECURITY_PAGE_PRINCIPLES = {
  sectionId: "security-principles",
  overline: "Security principles",
  headline: "How we approach protection.",
  subhead:
    "Security is part of the platform foundation — not an afterthought added around hotel operations.",
  items: [
    {
      id: "tenant-isolation",
      icon: Shield,
      title: "Tenant isolation",
      description:
        "Each hotel operates in a separate tenant context. Data and workspace access are scoped to your property.",
    },
    {
      id: "authentication",
      icon: KeyRound,
      title: "Secure authentication",
      description:
        "Team members sign in through authenticated sessions. Access requires a valid account tied to your hotel.",
    },
    {
      id: "rbac",
      icon: Users,
      title: "Role-based access",
      description:
        "Permissions control what each team member can view and manage inside the workspace.",
    },
    {
      id: "data-protection",
      icon: Lock,
      title: "Data protection",
      description:
        "Hotel data is protected through platform-level controls, isolated storage, and secure operational practices.",
    },
  ] satisfies SecurityPrinciple[],
} as const;

export const SECURITY_PAGE_ARCHITECTURE = {
  sectionId: "security-architecture",
  overline: "Platform architecture",
  headline: "A simple security model.",
  subhead:
    "Hotel data flows through a layered platform — from your workspace to secure infrastructure below.",
  steps: [
    { id: "hotel", label: "Hotel" },
    { id: "platform", label: "Monavel Platform" },
    { id: "workspace", label: "Workspace" },
    { id: "database", label: "Database" },
    { id: "infrastructure", label: "Secure infrastructure" },
  ],
} as const;

export const SECURITY_PAGE_ACCESS_CONTROL = {
  sectionId: "security-access-control",
  overline: "Access control",
  headline: "Who can see what.",
  subhead:
    "Monavel separates authentication, permissions, and workspace isolation so hotel data stays scoped to the right people.",
  topics: [
    {
      id: "authentication",
      title: "Authentication",
      description:
        "Users authenticate before accessing the platform. Sessions are required for workspace and API access.",
    },
    {
      id: "permissions",
      title: "Permissions",
      description:
        "Role-based permissions determine which workspaces, records, and actions a team member can use.",
    },
    {
      id: "isolation",
      title: "Workspace isolation",
      description:
        "Each hotel workspace is isolated at the data layer — queries and operations stay within your tenant boundary.",
    },
  ],
} as const;

export type SecurityInfrastructureItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SECURITY_PAGE_INFRASTRUCTURE = {
  sectionId: "security-infrastructure",
  overline: "Infrastructure",
  headline: "Built for reliable cloud operations.",
  subhead:
    "Monavel runs on modern cloud infrastructure designed for availability, secure connectivity, and ongoing maintenance.",
  items: [
    {
      id: "cloud",
      icon: Cloud,
      title: "Cloud hosted",
      description:
        "The platform runs on cloud infrastructure with managed services for database, auth, and application hosting.",
    },
    {
      id: "encrypted",
      icon: Lock,
      title: "Encrypted connections",
      description:
        "Connections to the platform use encrypted transport. Data in transit is protected between clients and services.",
    },
    {
      id: "updates",
      icon: RefreshCw,
      title: "Regular updates",
      description:
        "Application and infrastructure components receive ongoing updates to address security and reliability improvements.",
    },
    {
      id: "scalable",
      icon: Database,
      title: "Scalable architecture",
      description:
        "The platform architecture scales with hotel operations without mixing data across tenants.",
    },
  ] satisfies SecurityInfrastructureItem[],
} as const;

export const SECURITY_PAGE_FAQ = {
  sectionId: "security-faq",
  overline: "FAQ",
  headline: "Security questions.",
  subhead:
    "Answers to common questions about how Monavel handles hotel data and platform access.",
  items: [
    {
      question: "Where is data stored?",
      answer:
        "Hotel data is stored in cloud database services scoped to your tenant. Data stays within the platform's isolated storage model.",
    },
    {
      question: "Can multiple hotels share the platform?",
      answer:
        "Yes. Monavel is a multi-tenant platform. Each hotel has its own isolated workspace and data boundary.",
    },
    {
      question: "Who can access hotel data?",
      answer:
        "Only authenticated users with permissions for your hotel workspace. Access is limited by role-based controls.",
    },
    {
      question: "How are permissions managed?",
      answer:
        "Permissions are assigned through role-based access inside your hotel workspace. Administrators control who can view and manage data.",
    },
    {
      question: "Is guest channel data isolated?",
      answer:
        "Guest conversations and channel messages are stored within your hotel tenant context alongside other workspace data.",
    },
    {
      question: "Do you publish compliance certifications?",
      answer:
        "We do not claim certifications we have not completed. Contact us if you need details about security practices for your evaluation.",
    },
  ],
} as const;
