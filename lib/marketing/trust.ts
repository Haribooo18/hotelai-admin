import type { LucideIcon } from "lucide-react";
import {
  Database,
  GitBranch,
  Rocket,
  ScrollText,
  Shield,
  UserCheck,
} from "lucide-react";

export type TrustCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type TrustGuarantee = {
  id: string;
  label: string;
};

export const TRUST_SECTION_CONTENT = {
  sectionId: "trust",
  headline: "Built to run a real hotel",
  subhead:
    "Staff stay in control. Systems stay aligned. Guest data stays protected.",
  guaranteesLabel: "Runtime Guarantees",
  securityLinkLabel: "Security details",
  securityLinkHref: "/security",
} as const;

export const TRUST_CARDS: TrustCard[] = [
  {
    id: "pms",
    icon: Database,
    title: "Existing PMS compatibility",
    description:
      "Connect Monavel alongside your current PMS — no rip-and-replace to start.",
  },
  {
    id: "override",
    icon: UserCheck,
    title: "Human approval and override",
    description:
      "Staff can approve, edit, or take over any AI action before it reaches the guest.",
  },
  {
    id: "security",
    icon: Shield,
    title: "Secure hotel data",
    description:
      "Tenant isolation and role-based access keep each property's data separate.",
  },
  {
    id: "deploy",
    icon: Rocket,
    title: "Fast deployment",
    description:
      "Connect channels and go live in days, not a months-long integration project.",
  },
  {
    id: "reliability",
    icon: GitBranch,
    title: "Workflow reliability",
    description:
      "One Runtime keeps guest requests, room state, and team actions in sync.",
  },
  {
    id: "audit",
    icon: ScrollText,
    title: "Complete audit trail",
    description:
      "Every AI decision and system update is logged for review.",
  },
];

export const TRUST_GUARANTEES: TrustGuarantee[] = [
  { id: "runtime", label: "One Runtime" },
  { id: "sync", label: "Live sync" },
  { id: "oversight", label: "Human oversight" },
  { id: "encrypted", label: "Encrypted communication" },
  { id: "connected", label: "Connected systems" },
];
