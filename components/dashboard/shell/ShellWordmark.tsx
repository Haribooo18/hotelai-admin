import Link from "next/link";

import { MonavelMark } from "@/components/brand";

export function ShellWordmark() {
  return (
    <Link
      href="/dashboard"
      className="ds-wordmark group inline-flex items-center transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-90"
      aria-label="Monavel"
    >
      <MonavelMark decorative className="mkt-logo-mark--shell" />
    </Link>
  );
}
