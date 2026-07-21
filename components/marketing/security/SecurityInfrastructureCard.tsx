import type { SecurityInfrastructureItem } from "@/lib/marketing/security-page";

type Props = {
  item: SecurityInfrastructureItem;
};

export function SecurityInfrastructureCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <li className="group relative flex h-full min-h-[220px] overflow-hidden rounded-[1.5rem] border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-1)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--mkt-border-strong)] hover:shadow-md">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-50"
        aria-hidden
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
            <Icon className="size-5" strokeWidth={1.6} aria-hidden />
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-[var(--mkt-text)]">
            {item.title}
          </h3>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--mkt-text-muted)]">
          {item.description}
        </p>
      </div>
    </li>
  );
}