export type WhatIsMonavelCard = {
  id: string;
  title: string;
  description: string;
};

export const WHAT_IS_MONAVEL_CONTENT = {
  sectionId: "what-is-monavel",
  overline: "What is Monavel?",
  headline: "Hotels run on too many systems.",
} as const;

export const WHAT_IS_MONAVEL_CARDS: WhatIsMonavelCard[] = [
  {
    id: "one-workspace",
    title: "One Workspace",
    description: "Everything happens in one place.",
  },
  {
    id: "ai-reception",
    title: "AI Reception",
    description: "AI understands your hotel's operational knowledge.",
  },
  {
    id: "connected-data",
    title: "Connected Data",
    description: "Every department shares one source of truth.",
  },
  {
    id: "automation",
    title: "Automation",
    description: "Routine work happens automatically.",
  },
  {
    id: "revenue-intelligence",
    title: "Revenue Intelligence",
    description: "Live hotel performance.",
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security",
    description: "Role permissions. Audit logs. Cloud infrastructure.",
  },
];
