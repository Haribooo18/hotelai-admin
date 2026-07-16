export type ShellTheme = "light" | "gray" | "dark";

export const SHELL_THEME_STORAGE_KEY = "monavel-shell-theme";

export const DEFAULT_SHELL_THEME: ShellTheme = "dark";

export function isShellTheme(value: string): value is ShellTheme {
  return value === "light" || value === "gray" || value === "dark";
}

export function readShellTheme(): ShellTheme {
  if (typeof window === "undefined") {
    return DEFAULT_SHELL_THEME;
  }

  const stored = window.localStorage.getItem(SHELL_THEME_STORAGE_KEY);
  return stored && isShellTheme(stored) ? stored : DEFAULT_SHELL_THEME;
}

export function persistShellTheme(theme: ShellTheme): void {
  window.localStorage.setItem(SHELL_THEME_STORAGE_KEY, theme);
}
