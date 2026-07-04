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
    <nav aria-label="Категории" className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "rounded-full px-3 py-1 text-xs transition",
          selected === ""
            ? "bg-zinc-100 text-zinc-900"
            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
        )}
      >
        Все
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition",
            selected === cat
              ? "bg-zinc-100 text-zinc-900"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          )}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
