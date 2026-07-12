export type HowMonavelWorksStep = {
  id: string;
  label: string;
  description: string;
};

export const HOW_MONAVEL_WORKS_CONTENT = {
  sectionId: "how-monavel-works",
  headline: "From setup to live operations",
  subhead:
    "A clear path from disconnected software to one intelligent operating environment.",
} as const;

export const HOW_MONAVEL_WORKS_STEPS: HowMonavelWorksStep[] = [
  {
    id: "connect-pms",
    label: "Connect PMS",
    description: "Link your property management and room inventory.",
  },
  {
    id: "import-data",
    label: "Import hotel data",
    description: "Bring bookings, guests, and policies into one workspace.",
  },
  {
    id: "connect-channels",
    label: "Connect communication channels",
    description: "Route Website Chat, Telegram, and OTA messages centrally.",
  },
  {
    id: "train-ai",
    label: "Train AI",
    description: "Publish knowledge so AI understands your hotel.",
  },
  {
    id: "go-live",
    label: "Go Live",
    description: "AI reception and operations run from day one.",
  },
  {
    id: "learn",
    label: "AI continuously improves",
    description: "Every interaction improves context across the platform.",
  },
];
