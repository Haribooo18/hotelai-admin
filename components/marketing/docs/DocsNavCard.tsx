import Link from "next/link";

import type { DocsNavCard } from "@/lib/marketing/docs";
import { cn } from "@/lib/utils";

type Props = {
  card: DocsNavCard;
  showMeta?: boolean;
};

export function DocsNavCardLink({ card, showMeta = false }: Props) {
  const Icon = card.icon;

  return (
    <Link href={card.href} className="mkt-docs-nav-card">
      <span className="mkt-docs-nav-card-icon" aria-hidden>
        {Icon ? <Icon className="size-4" strokeWidth={1.5} /> : null}
      </span>
      <span className="mkt-docs-nav-card-body">
        <span className="mkt-docs-nav-card-title-row">
          <span className="mkt-docs-nav-card-title">{card.title}</span>
          {showMeta ? (
            <span className="mkt-docs-nav-card-meta">{card.meta ?? ""}</span>
          ) : null}
        </span>
        <span className="mkt-docs-nav-card-description">{card.description}</span>
      </span>
    </Link>
  );
}

type GridProps = {
  cards: readonly DocsNavCard[];
  columns?: 2 | 3 | 4;
  showMeta?: boolean;
  className?: string;
};

export function DocsNavCardGrid({
  cards,
  columns = 4,
  showMeta = false,
  className,
}: GridProps) {
  return (
    <ul
      className={cn(
        "mkt-docs-nav-grid",
        columns === 2 && "mkt-docs-nav-grid--2",
        columns === 3 && "mkt-docs-nav-grid--3",
        columns === 4 && "mkt-docs-nav-grid--4",
        className
      )}
      role="list"
    >
      {cards.map((card) => (
        <li key={card.id} role="listitem">
          <DocsNavCardLink card={card} showMeta={showMeta} />
        </li>
      ))}
    </ul>
  );
}
