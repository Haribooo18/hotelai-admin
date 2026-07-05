"use client";

import { useState } from "react";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { AIHealthPanel } from "./AIHealthPanel";
import { AIPromptTest } from "./AIPromptTest";
import { AISettingsForm } from "./AISettingsForm";
import { BillingPanel } from "./BillingPanel";

type Tab = "ai" | "billing";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  initialTab?: Tab;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "ai", label: "AI Receptionist" },
  { id: "billing", label: "Billing" },
];

export function SettingsTabs({
  settings,
  health,
  logs,
  configured,
  subscription,
  stripeConfigured,
  initialTab = "ai",
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-zinc-500">
          AI receptionist configuration, billing, and diagnostics
        </p>
      </div>

      <div className="flex gap-2 border-b border-zinc-800 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "ai" ? (
        <>
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-lg font-semibold">AI Receptionist</h2>
              <div className="mt-4">
                <AISettingsForm settings={settings} configured={configured} />
              </div>
            </div>

            <div className="space-y-6">
              <AIHealthPanel health={health} />
              <AIPromptTest />
            </div>
          </section>

          {logs.length > 0 && (
            <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-lg font-semibold">Observability log</h2>
              <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
                {logs.map((log) => (
                  <li
                    key={log.id}
                    className="flex justify-between gap-4 rounded-lg bg-zinc-900 px-3 py-2"
                  >
                    <span className="text-zinc-300">
                      <span className="text-zinc-500">[{log.level}]</span>{" "}
                      {log.event}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {new Date(log.created_at).toLocaleString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold">Subscription</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Plan, status, and payment management via Stripe
          </p>
          <div className="mt-4">
            <BillingPanel
              subscription={subscription}
              stripeConfigured={stripeConfigured}
            />
          </div>
        </section>
      )}
    </div>
  );
}
