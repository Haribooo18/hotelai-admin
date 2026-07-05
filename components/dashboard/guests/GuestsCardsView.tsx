"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users } from "lucide-react";

import type { Guest } from "@/types/guest";

import { deleteGuest, setGuestFavorite } from "@/lib/services/guests.mutations";
import { cn } from "@/lib/utils";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DashboardEmptyState,
  DashboardSkeleton,
} from "@/components/dashboard/home/DashboardPrimitives";

import { GuestCard } from "./GuestCard";
import type { GuestCardModel, GuestViewMode } from "./guest-crm-metrics";

type Props = {
  models: GuestCardModel[];
  viewMode: GuestViewMode;
  loading?: boolean;
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onOpenGuest: (model: GuestCardModel) => void;
  onEditGuest: (guest: Guest) => void;
};

export function GuestsCardsView({
  models,
  viewMode,
  loading = false,
  selectedIds,
  onSelectedIdsChange,
  onOpenGuest,
  onEditGuest,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [optimisticModels, removeOptimistic] = useOptimistic(
    models,
    (state, id: string) => state.filter((model) => model.guest.id !== id)
  );

  function toggleSelected(id: string, checked: boolean) {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectedIdsChange(next);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    startTransition(async () => {
      removeOptimistic(id);
      const next = new Set(selectedIds);
      next.delete(id);
      onSelectedIdsChange(next);

      try {
        await deleteGuest(id);
        toast.success("Guest deleted");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete guest");
      } finally {
        setDeleteTarget(null);
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

  if (loading) {
    return (
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-sm)]"
          >
            <DashboardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (optimisticModels.length === 0) {
    return (
      <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-sm)]">
        <DashboardEmptyState
          title="No guests found"
          description="Adjust filters or add a new guest to the CRM."
          icon={<Users size={20} />}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
        )}
      >
        {optimisticModels.map((model) => (
          <GuestCard
            key={model.guest.id}
            model={model}
            viewMode={viewMode}
            selected={selectedIds.has(model.guest.id)}
            onSelect={(checked) => toggleSelected(model.guest.id, checked)}
            onOpen={() => onOpenGuest(model)}
            onEdit={() => onEditGuest(model.guest)}
            onDelete={() => setDeleteTarget(model.guest)}
            onToggleFavorite={() => toggleFavorite(model.guest)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete guest?"
        description={
          deleteTarget
            ? `Guest "${deleteTarget.first_name} ${deleteTarget.last_name}" will be moved to the archive (soft delete).`
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
