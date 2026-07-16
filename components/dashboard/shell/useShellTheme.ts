"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  DEFAULT_SHELL_THEME,
  persistShellTheme,
  readShellTheme,
  type ShellTheme,
} from "@/lib/dashboard/shell-theme";

const THEME_CHANGE_EVENT = "monavel-shell-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): ShellTheme {
  return readShellTheme();
}

function getServerSnapshot(): ShellTheme {
  return DEFAULT_SHELL_THEME;
}

export function useShellTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: ShellTheme) => {
    persistShellTheme(next);
    document.documentElement.dataset.shellTheme = next;
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return [theme, setTheme] as const;
}
