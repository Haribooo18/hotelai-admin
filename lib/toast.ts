import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

import { motionToastDurationMs } from "@/lib/motion/toast";

type ToastMessage = ReactNode;

function stableToastId(
  message: ToastMessage,
  type: string,
  options?: ExternalToast
): string | number | undefined {
  if (options?.id !== undefined) {
    return options.id;
  }

  if (typeof message === "string" || typeof message === "number") {
    return `${type}:${String(message)}`;
  }

  return undefined;
}

function withToastDefaults(
  message: ToastMessage,
  type: string,
  options?: ExternalToast
): ExternalToast {
  const id = stableToastId(message, type, options);

  return {
    duration: motionToastDurationMs,
    ...options,
    ...(id !== undefined ? { id } : {}),
  };
}

export const toast = Object.assign(
  (message: ToastMessage, options?: ExternalToast) =>
    sonnerToast(message, withToastDefaults(message, "default", options)),
  {
    success: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.success(
        message,
        withToastDefaults(message, "success", options)
      ),
    info: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.info(message, withToastDefaults(message, "info", options)),
    warning: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.warning(
        message,
        withToastDefaults(message, "warning", options)
      ),
    error: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.error(message, withToastDefaults(message, "error", options)),
    message: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.message(
        message,
        withToastDefaults(message, "message", options)
      ),
    loading: (message: ToastMessage, options?: ExternalToast) =>
      sonnerToast.loading(
        message,
        withToastDefaults(message, "loading", options)
      ),
    custom: sonnerToast.custom,
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
    getHistory: sonnerToast.getHistory,
    getToasts: sonnerToast.getToasts,
  }
);

export type { ExternalToast };
