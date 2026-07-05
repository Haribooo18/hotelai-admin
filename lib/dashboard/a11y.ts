import type { KeyboardEvent } from "react";

export function activateOnKeyboard(
  event: KeyboardEvent,
  onActivate: () => void
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

export function tableRowA11yProps(label: string, onActivate: () => void) {
  return {
    tabIndex: 0,
    role: "button" as const,
    "aria-label": label,
    onKeyDown: (event: KeyboardEvent) => activateOnKeyboard(event, onActivate),
  };
}
