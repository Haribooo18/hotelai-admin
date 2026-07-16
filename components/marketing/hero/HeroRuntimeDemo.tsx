"use client";

import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import { useMockHotelRuntime } from "@/lib/marketing/mock-hotel-runtime";

function getHeroWorkspace(
  eventType: ReturnType<typeof useMockHotelRuntime>["event"]["type"]
) {
  if (eventType === "knowledge") return "knowledge" as const;

  if (eventType === "message" || eventType === "upsell") {
    return "reception-ai" as const;
  }

  if (eventType === "booking" || eventType === "payment") {
    return "bookings" as const;
  }

  if (eventType === "room" || eventType === "housekeeping") {
    return "rooms" as const;
  }

  return "dashboard" as const;
}

export function HeroRuntimeDemo() {
  const runtime = useMockHotelRuntime();

  return (
    <div
      className="mku-hero-runtime-demo mku-hero-runtime-demo--preview-only"
      aria-label="Live Monavel product demonstration"
    >
      <div
        key={`${runtime.event.id}-${runtime.tick}`}
        className="mku-hero-runtime-preview mku-workspace-enter"
      >
        <WorkspacePreview
          workspaceId={getHeroWorkspace(runtime.event.type)}
          priority
          presentation="platformShowcase"
        />
      </div>
    </div>
  );
}
