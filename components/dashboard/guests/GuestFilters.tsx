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
          placeholder="Search by name, email, phone..."
          aria-label="Search guests"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={flag}
        onChange={onFlagChange}
        placeholder="All guests"
        aria-label="Filter by flag"
        options={[
          { value: "vip", label: "VIP only" },
          { value: "favorite", label: "Favorites only" },
        ]}
      />

      <Select
        value={tag}
        onChange={onTagChange}
        placeholder="All tags"
        aria-label="Filter by tag"
        options={tagOptions.map((t) => ({ value: t, label: t }))}
      />
    </div>
  );
}
