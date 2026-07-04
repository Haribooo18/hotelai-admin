import { Crown, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  tags?: string[];
  isVip?: boolean;
  isFavorite?: boolean;
  className?: string;
};

export function GuestTags({ tags = [], isVip, isFavorite, className }: Props) {
  if (!isVip && !isFavorite && tags.length === 0) {
    return <span className="text-sm text-zinc-600">—</span>;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {isVip && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400">
          <Crown size={12} />
          VIP
        </span>
      )}

      {isFavorite && (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          <Star size={12} />
          Избранный
        </span>
      )}

      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
