"use client";

import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function KnowledgeCategories({
  categories,
  selected,
  onSelect,
}: Props) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "rounded-full px-3 py-1 text-xs transition",
          selected === ""
            ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
            : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)]"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition",
            selected === cat
              ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
              : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)]"
          )}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
