export type OperationalScenarioStep = {
  id: string;
  label: string;
};

export const OPERATIONAL_SCENARIO_CONTENT = {
  sectionId: "operational-scenario",
  headline: "One request — the entire hotel responds",
  subhead:
    "Monavel connects guest communication to live operations — not isolated feature lists.",
  scenarioTitle: "Guest requests early check-in",
} as const;

export const OPERATIONAL_SCENARIO_STEPS: OperationalScenarioStep[] = [
  { id: "request", label: "Guest requests early check-in" },
  { id: "occupancy", label: "AI checks occupancy" },
  { id: "housekeeping", label: "AI checks housekeeping" },
  { id: "pms", label: "Updates PMS" },
  { id: "staff", label: "Notifies staff" },
  { id: "reply", label: "Replies automatically" },
];
