"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function KnowledgeSearch({ value, onChange }: Props) {
  return (
    <div className="relative max-w-md flex-1">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shell-muted)]"
        size={16}
      />
      <Input
        className="pl-9"
        placeholder="Search by title, body, tags…"
        aria-label="Search articles"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
