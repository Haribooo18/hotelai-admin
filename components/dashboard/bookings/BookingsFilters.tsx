"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  search: string;
  status: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function BookingsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />

        <Input
          className="pl-10"
          placeholder="Поиск гостя..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <Select
        value={status}
        onChange={onStatusChange}
        placeholder="Все статусы"
        options={[
          {
            value: "confirmed",
            label: "Подтверждено",
          },
          {
            value: "checked_in",
            label: "Заселен",
          },
          {
            value: "checked_out",
            label: "Выселен",
          },
          {
            value: "cancelled",
            label: "Отменено",
          },
        ]}
      />
    </div>
  );
}