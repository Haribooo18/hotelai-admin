"use client";

import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n";

type Props = {
  children: ReactNode;
};

/** Wraps route loading/error UI rendered outside AppShell. */
export function RouteI18nShell({ children }: Props) {
  return <I18nProvider>{children}</I18nProvider>;
}
