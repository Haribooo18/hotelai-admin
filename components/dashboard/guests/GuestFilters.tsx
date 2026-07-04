"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  search: string;
  flag: string;
  tag: string;
  tagOptions: string[];
  onSearchChange: (value: string) => void;
  onFlagChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export function GuestFilters({
  search,
  flag,
  tag,
  tagOptions,
  onSearchChange,
  onFlagChange,
  onTagChange,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />

        <Input
          className="pl-10"
          placeholder="Поиск по имени, email, телефону..."
          aria-label="Поиск гостей"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={flag}
        onChange={onFlagChange}
        placeholder="Все гости"
        aria-label="Фильтр по признаку"
        options={[
          { value: "vip", label: "Только VIP" },
          { value: "favorite", label: "Только избранные" },
        ]}
      />

      <Select
        value={tag}
        onChange={onTagChange}
        placeholder="Все теги"
        aria-label="Фильтр по тегу"
        options={tagOptions.map((t) => ({ value: t, label: t }))}
      />
    </div>
  );
}
