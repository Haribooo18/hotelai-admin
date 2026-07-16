import { describe, expect, it, vi } from "vitest";

import {
  bindWidgetCallbacks,
  createWidgetEventBus,
} from "@/src/widget/events";
import type { WidgetMessage } from "@/src/widget/types";

describe("widget event callbacks", () => {
  it("invokes registered callbacks", () => {
    const bus = createWidgetEventBus();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const onMessage = vi.fn();
    const onError = vi.fn();

    const unbind = bindWidgetCallbacks(bus, {
      onOpen,
      onClose,
      onMessage,
      onError,
    });

    const message: WidgetMessage = {
      id: "msg-1",
      role: "guest",
      content: "Привет",
      timestamp: Date.now(),
    };

    bus.emit("open", undefined);
    bus.emit("message", message);
    bus.emit("error", "Ошибка");
    bus.emit("close", undefined);

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onMessage).toHaveBeenCalledWith(message);
    expect(onError).toHaveBeenCalledWith("Ошибка");
    expect(onClose).toHaveBeenCalledOnce();

    unbind();
    bus.clear();
  });
});
