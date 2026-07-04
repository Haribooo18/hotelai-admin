import type { WidgetEventMap, WidgetMessage } from "./types";

type WidgetEventName = keyof WidgetEventMap;

type WidgetEventHandler<T extends WidgetEventName> = (
  payload: WidgetEventMap[T]
) => void;

export type WidgetEventBus = {
  on<T extends WidgetEventName>(
    event: T,
    handler: WidgetEventHandler<T>
  ): () => void;
  emit<T extends WidgetEventName>(
    event: T,
    payload: WidgetEventMap[T]
  ): void;
  clear(): void;
};

export function createWidgetEventBus(): WidgetEventBus {
  const handlers = new Map<WidgetEventName, Set<WidgetEventHandler<WidgetEventName>>>();

  return {
    on(event, handler) {
      const bucket = handlers.get(event) ?? new Set();
      bucket.add(handler as WidgetEventHandler<WidgetEventName>);
      handlers.set(event, bucket);

      return () => {
        bucket.delete(handler as WidgetEventHandler<WidgetEventName>);
      };
    },

    emit(event, payload) {
      const bucket = handlers.get(event);
      if (!bucket) return;

      for (const handler of bucket) {
        handler(payload);
      }
    },

    clear() {
      handlers.clear();
    },
  };
}

export function bindWidgetCallbacks(
  bus: WidgetEventBus,
  callbacks: {
    onOpen?: () => void;
    onClose?: () => void;
    onMessage?: (message: WidgetMessage) => void;
    onError?: (error: string) => void;
  }
): () => void {
  const unsubs: Array<() => void> = [];

  if (callbacks.onOpen) {
    unsubs.push(bus.on("open", callbacks.onOpen));
  }
  if (callbacks.onClose) {
    unsubs.push(bus.on("close", callbacks.onClose));
  }
  if (callbacks.onMessage) {
    unsubs.push(bus.on("message", callbacks.onMessage));
  }
  if (callbacks.onError) {
    unsubs.push(bus.on("error", callbacks.onError));
  }

  return () => {
    for (const unsub of unsubs) {
      unsub();
    }
  };
}
