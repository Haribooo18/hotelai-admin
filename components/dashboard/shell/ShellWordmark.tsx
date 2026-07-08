import Link from "next/link";

export function ShellWordmark() {
  return (
    <Link
      href="/dashboard"
      className="ds-wordmark group inline-flex items-center gap-4 transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-90"
    >
      <span
        aria-hidden
        className="ds-wordmark-badge flex h-7 w-7 items-center justify-center rounded-[9px] text-[11px] font-semibold transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.02]"
      >
        M
      </span>
      Monavel
    </Link>
  );
}
