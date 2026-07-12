export const STORYTELLING_CONTENT = {
  sectionId: "connected-intelligence",
  overline: "How it flows",
  headline: "One journey. Every channel connected.",
  subhead:
    "A guest message becomes context for your team, your knowledge base, and your operations — automatically.",
} as const;

export const CHANNEL_FLOW = [
  { id: "guest", label: "Guest" },
  { id: "ai", label: "AI" },
  { id: "knowledge", label: "Knowledge" },
  { id: "workspace", label: "Workspace" },
  { id: "team", label: "Team" },
  { id: "guest-return", label: "Guest", terminal: true as const },
] as const;

/** @deprecated Use CHANNEL_FLOW — kept for tests migrating from STORYTELLING_FLOW */
export const STORYTELLING_FLOW = CHANNEL_FLOW;

export const PHILOSOPHY_CONTENT = {
  sectionId: "philosophy",
  overline: "Philosophy",
  headline: "Hotels no longer need dozens of disconnected systems.",
  lines: [
    "They need one intelligent operating environment.",
    "Everything connected.",
    "Everything synchronized.",
    "Everything understood.",
  ],
} as const;
