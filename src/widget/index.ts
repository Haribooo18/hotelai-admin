import type { WidgetConfig } from "./types";
import { WidgetUI } from "./ui";

const WIDGET_ROOT_SELECTOR = ".hotelai-widget";

let activeWidget: WidgetUI | null = null;

function removeOrphanedWidgets(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelectorAll(WIDGET_ROOT_SELECTOR).forEach((node) => {
    node.remove();
  });
}

export function normalizeWidgetConfig(config: WidgetConfig): WidgetConfig {
  const hotelId = config.hotelId?.trim();
  const apiUrl = config.apiUrl?.trim();

  if (!hotelId) {
    throw new Error("hotelId is required");
  }

  if (!apiUrl) {
    throw new Error("apiUrl is required");
  }

  return {
    ...config,
    hotelId,
    apiUrl,
    theme: config.theme ?? "light",
    position: config.position ?? "right",
    primaryColor: config.primaryColor ?? "#10b981",
    guestName: config.guestName?.trim() || "Website Guest",
  };
}

export function init(config: WidgetConfig): void {
  if (typeof document === "undefined") {
    throw new Error("HotelAI widget requires a browser environment");
  }

  const normalized = normalizeWidgetConfig(config);

  removeOrphanedWidgets();

  if (activeWidget) {
    activeWidget.destroy();
    activeWidget = null;
  }

  activeWidget = new WidgetUI(normalized);
  activeWidget.mount();
}

export function destroyWidget(): void {
  activeWidget?.destroy();
  activeWidget = null;
}

// Test-only reset for unit tests.
export function __resetWidgetForTests(): void {
  destroyWidget();
}
