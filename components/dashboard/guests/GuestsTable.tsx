"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import { deleteGuest, setGuestFavorite } from "@/lib/services/guests.mutations";
import { cn } from "@/lib/utils";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";

import { GuestAvatar } from "./GuestAvatar";
import { GuestTags } from "./GuestTags";

type Props = {
  guests: Guest[];
  onEdit?: (guest: Guest) => void;
};

export function GuestsTable({ guests, onEdit }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<Guest | null>(null);
  const [optimisticGuests, removeOptimistic] = useOptimistic(
    guests,
    (state, id: string) => state.filter((g) => g.id !== id)
  );

  function confirmDelete() {
    if (!target) return;
    const id = target.id;

    startTransition(async () => {
      removeOptimistic(id);
      try {
        await deleteGuest(id);
        toast.success("Guest deleted");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete guest");
      } finally {
        setTarget(null);
      }
    });
  }

  function toggleFavorite(guest: Guest) {
    startTransition(async () => {
      try {
        await setGuestFavorite(guest.id, !guest.is_favorite);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
      }
    });
  }

  const columns: DataTableColumn<Guest>[] = [
    {
      header: "Guest",
      cell: (guest) => (
        <div className="flex items-center gap-3">
          <GuestAvatar
            firstName={guest.first_name}
            lastName={guest.last_name}
            avatarUrl={guest.avatar_url}
            size="sm"
          />

          <div>
            <Link
              href={`/guests/${guest.id}`}
              className="font-medium transition hover:text-emerald-400"
            >
              {guest.first_name} {guest.last_name}
            </Link>

            <div className="text-sm text-[var(--shell-muted)]">{guest.email ?? "—"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Contacts",
      cell: (guest) => (
        <div className="text-sm">
          <div>{guest.phone ?? "—"}</div>
          <div className="text-[var(--shell-muted)]">
            {[guest.city, guest.country].filter(Boolean).join(", ") || "—"}
          </div>
        </div>
      ),
    },
    {
      header: "Flags",
      cell: (guest) => (
        <GuestTags
          tags={guest.tags}
          isVip={guest.is_vip}
          isFavorite={guest.is_favorite}
        />
      ),
    },
    {
      header: "Bookings",
      cell: (guest) => guest.total_bookings,
    },
    {
      header: "Actions",
      align: "right",
      cell: (guest) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label={
              guest.is_favorite
                ? `Remove ${guest.first_name} from favorites`
                : `Add ${guest.first_name} to favorites`
            }
            aria-pressed={guest.is_favorite}
            onClick={() => toggleFavorite(guest)}
            className={cn(
              "rounded-lg border p-2 transition",
              guest.is_favorite
                ? "border-emerald-700 text-emerald-400 hover:bg-emerald-950"
                : "border-[var(--shell-border)] text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)]"
            )}
          >
            <Star
              size={16}
              fill={guest.is_favorite ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            aria-label={`Edit ${guest.first_name} ${guest.last_name}`}
            onClick={() => onEdit?.(guest)}
            className="rounded-lg border border-[var(--shell-border)] p-2 transition hover:bg-[var(--shell-nav-hover-bg)]"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            aria-label={`Delete ${guest.first_name} ${guest.last_name}`}
            onClick={() => setTarget(guest)}
            className="rounded-lg border border-red-900 p-2 text-red-400 transition hover:bg-red-950"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={optimisticGuests}
        getRowId={(guest) => guest.id}
        caption="Guest list"
        empty={
          <div className="rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)] py-16 text-center text-[var(--shell-muted)]">
            No guests found
          </div>
        }
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Delete guest?"
        description={
          target
            ? `Guest "${target.first_name} ${target.last_name}" will be moved to the archive (soft delete).`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
