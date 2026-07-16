"use client";

import { Toaster } from "sonner";

import {
  motionToastActionButtonClass,
  motionToastClass,
  motionToastDurationMs,
  motionToastToasterClass,
} from "@/lib/motion/toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={motionToastDurationMs}
      visibleToasts={4}
      className={motionToastToasterClass}
      toastOptions={{
        className: motionToastClass,
        classNames: {
          actionButton: motionToastActionButtonClass,
          cancelButton: motionToastActionButtonClass,
        },
      }}
    />
  );
}
