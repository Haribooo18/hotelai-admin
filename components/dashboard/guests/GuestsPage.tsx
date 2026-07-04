"use client";

import { useMemo, useState } from "react";
import { Crown, Star, Users } from "lucide-react";

import type { Guest } from "@/types/guest";

import { GuestCreateButton, GuestCreateDialog } from "./GuestCreateDialog";
import { GuestEditDialog } from "./GuestEditDialog";
import { GuestFilters } from "./GuestFilters";
import { GuestsTable } from "./GuestsTable";

type Props = {
  guests: Guest[];
};

export function GuestsPage({ guests }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Guest | null>(null);

  const [search, setSearch] = useState("");
  const [flag, setFlag] = useState("");
  const [tag, setTag] = useState("");

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const guest of guests) {
      for (const t of guest.tags ?? []) set.add(t);
    }
    return Array.from(set).sort();
  }, [guests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const haystack = [
        guest.first_name,
        guest.last_name,
        guest.email ?? "",
        guest.phone ?? "",
        guest.city ?? "",
        guest.country ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = q === "" || haystack.includes(q);
      const matchesFlag =
        flag === "" ||
        (flag === "vip" && guest.is_vip) ||
        (flag === "favorite" && guest.is_favorite);
      const matchesTag = tag === "" || (guest.tags ?? []).includes(tag);

      return matchesSearch && matchesFlag && matchesTag;
    });
  }, [guests, search, flag, tag]);

  function handleEdit(guest: Guest) {
    setSelected(guest);
    setEditOpen(true);
  }

  const vipCount = guests.filter((g) => g.is_vip).length;
  const favoriteCount = guests.filter((g) => g.is_favorite).length;

  const stats = [
    { title: "Всего гостей", value: guests.length, icon: Users },
    { title: "VIP", value: vipCount, icon: Crown },
    { title: "Избранные", value: favoriteCount, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            HOTELAI ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-bold">Гости</h1>

          <p className="mt-3 text-zinc-400">
            База гостей, история проживания и заметки.
          </p>
        </div>

        <GuestCreateButton onClick={() => setCreateOpen(true)} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{stat.title}</p>
                <Icon size={20} className="text-emerald-500" />
              </div>
              <div className="mt-5 text-3xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-5">
        <GuestFilters
          search={search}
          flag={flag}
          tag={tag}
          tagOptions={tagOptions}
          onSearchChange={setSearch}
          onFlagChange={setFlag}
          onTagChange={setTag}
        />

        <GuestsTable guests={filtered} onEdit={handleEdit} />
      </div>

      <GuestCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <GuestEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        guest={selected}
      />
    </div>
  );
}
