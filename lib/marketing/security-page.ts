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
  headline: "Security by design.",
  subhead:
    "Monavel is built with tenant isolation, secure authentication, role-based access, and modern cloud infrastructure to protect every hotel workspace.",
  primaryCtaLabel: "Contact sales",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Start free trial",
  secondaryCtaHref: MARKETING_CTA.trial,
} as const;

export const SECURITY_PAGE_PRINCIPLES = {
  sectionId: "security-principles",
  overline: "Security principles",
  headline: "Security principles that guide the platform.",
  subhead:
    "Security is designed into every layer of Monavel, from authentication and tenant isolation to infrastructure and daily operations.",
  items: [
    {
      id: "tenant-isolation",
      icon: Shield,
      title: "Tenant isolation",
      description:
        "Every hotel operates inside its own isolated tenant. Data, permissions, and operations remain scoped to your workspace.",
    },
    {
      id: "authentication",
      icon: KeyRound,
      title: "Secure authentication",
      description:
        "Authenticated sessions protect access to the platform and ensure only verified users can reach hotel workspaces.",
    },
    {
      id: "rbac",
      icon: Users,
      title: "Role-based access",
      description:
        "Granular permissions allow staff members to access only the areas and actions required for their responsibilities.",
    },
    {
      id: "data-protection",
      icon: Lock,
      title: "Data protection",
      description:
        "Operational safeguards, isolated storage, and encrypted connections help protect hotel and guest information.",
    },
  ] satisfies SecurityPrinciple[],
} as const;

export const SECURITY_PAGE_ARCHITECTURE = {
  sectionId: "security-architecture",
  overline: "Platform architecture",
  headline: "Security at every layer.",
  subhead:
    "Every request passes through authenticated access, isolated workspaces, and secure cloud infrastructure before reaching your hotel data.",
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
  headline: "Access only where it's needed.",
  subhead:
    "Authentication, permissions, and tenant isolation work together so every user only accesses the data they're authorized to use.",
  topics: [
    {
      id: "authentication",
      title: "Authentication",
      description:
        "Verified user authentication is required before accessing the platform, APIs, or hotel workspaces.",
    },
    {
      id: "permissions",
      title: "Permissions",
      description:
        "Role-based permissions define which records, features, and operational actions each team member can access.",
    },
    {
      id: "isolation",
      title: "Workspace isolation",
      description:
        "Every hotel workspace is isolated at the data layer to prevent cross-tenant access or data exposure.",
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
  headline: "Cloud infrastructure designed for reliability.",
  subhead:
    "Modern managed infrastructure provides secure connectivity, scalable services, and dependable platform availability.",
  items: [
    {
      id: "cloud",
      icon: Cloud,
      title: "Cloud hosted",
      description:
        "Monavel runs on modern managed cloud infrastructure with dedicated services for application hosting, authentication, and databases.",
    },
    {
      id: "encrypted",
      icon: Lock,
      title: "Encrypted connections",
      description:
        "Traffic between clients and the platform is protected using encrypted transport to safeguard data in transit.",
    },
    {
      id: "updates",
      icon: RefreshCw,
      title: "Continuous updates",
      description:
        "Platform and infrastructure components are continuously maintained with security patches and reliability improvements.",
    },
    {
      id: "scalable",
      icon: Database,
      title: "Scalable architecture",
      description:
        "The platform scales with hotel operations while maintaining strict tenant separation across all workspaces.",
    },
  ] satisfies SecurityInfrastructureItem[],
} as const;

export const SECURITY_PAGE_FAQ = {
  sectionId: "security-faq",
  overline: "FAQ",
  headline: "Common security questions.",
  subhead:
    "Answers to the questions hotels ask most often before deploying Monavel.",
  items: [
    {
      question: "Where is hotel data stored?",
      answer:
        "Hotel data is stored within managed cloud database services using isolated tenant architecture so every workspace remains separated.",
    },
    {
      question: "Can multiple hotels use the same platform?",
      answer:
        "Yes. Monavel is a multi-tenant platform where every hotel operates in its own isolated workspace with separate data boundaries.",
    },
    {
      question: "Who can access our hotel data?",
      answer:
        "Only authenticated users with the appropriate permissions for your workspace can access hotel information.",
    },
    {
      question: "How are permissions managed?",
      answer:
        "Administrators assign role-based permissions that determine which features, records, and operational actions each team member can perform.",
    },
    {
      question: "How is customer data separated?",
      answer:
        "Every hotel runs inside its own tenant. Application logic, database access, and workspace permissions are scoped to that tenant to prevent cross-hotel access.",
    },
    {
      question: "How is guest information protected?",
      answer:
        "Guest conversations and operational data remain inside your isolated workspace and are protected through authentication, authorization, encrypted connections, and platform-level security controls.",
    },
  ],
} as const;