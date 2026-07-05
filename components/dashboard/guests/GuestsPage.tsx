"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import { deleteGuest, setGuestFavorite } from "@/lib/services/guests.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { GuestCreateDialog } from "./GuestCreateDialog";
import { GuestDetailDrawer } from "./GuestDetailDrawer";
import { GuestEditDialog } from "./GuestEditDialog";
import { GuestToolbar } from "./GuestToolbar";
import { GuestsCardsView } from "./GuestsCardsView";
import { GuestsExecutiveKpis } from "./GuestsExecutiveKpis";
import { GuestsTable } from "./GuestsTable";
import {
  AdminPageStack,
  DashboardPageHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";
import {
  buildGuestCardModels,
  computeGuestCrmKpis,
  extractCountryOptions,
  sortGuestModels,
  type GuestCardModel,
  type GuestSortKey,
  type GuestStatusFilter,
  type GuestViewMode,
} from "./guest-crm-metrics";
import { useGuestsSupplement } from "./useGuestsSupplement";

type Props = {
  guests: Guest[];
};

export function GuestsPage({ guests }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [optimisticGuests, removeOptimistic] = useOptimistic(
    guests,
    (state, id: string) => state.filter((guest) => guest.id !== id)
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GuestCardModel | null>(null);

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [drawerModel, setDrawerModel] = useState<GuestCardModel | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GuestStatusFilter>("");
  const [tag, setTag] = useState("");
  const [country, setCountry] = useState("");
  const [sortKey, setSortKey] = useState<GuestSortKey>("newest");
  const [viewMode, setViewMode] = useState<GuestViewMode>("cards");

  const hotelId = optimisticGuests[0]?.hotel_id;
  const { bookings, rooms, loading } = useGuestsSupplement(hotelId);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const guest of optimisticGuests) {
      for (const value of guest.tags ?? []) set.add(value);
    }
    return Array.from(set).sort();
  }, [optimisticGuests]);

  const countryOptions = useMemo(
    () => extractCountryOptions(optimisticGuests),
    [optimisticGuests]
  );

  const cardModels = useMemo(
    () => buildGuestCardModels(optimisticGuests, bookings, rooms),
    [optimisticGuests, bookings, rooms]
  );

  const filteredModels = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = cardModels.filter((model) => {
      const { guest } = model;
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

      const matchesSearch = query === "" || haystack.includes(query);
      const matchesTag = tag === "" || (guest.tags ?? []).includes(tag);
      const matchesCountry = country === "" || guest.country === country;
      const matchesStatus = (() => {
        switch (status) {
          case "active":
            return model.activeBooking !== null;
          case "returning":
            return guest.total_bookings > 1;
          case "vip":
            return guest.is_vip;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesTag && matchesCountry && matchesStatus;
    });

    return sortGuestModels(filtered, sortKey);
  }, [cardModels, search, status, tag, country, sortKey]);

  const kpis = useMemo(
    () => computeGuestCrmKpis(cardModels),
    [cardModels]
  );

  const candidates = useMemo(
    () =>
      drawerModel
        ? optimisticGuests.filter((guest) => guest.id !== drawerModel.guest.id)
        : optimisticGuests,
    [optimisticGuests, drawerModel]
  );

  function handleEdit(model: GuestCardModel) {
    setSelectedGuest(model.guest);
    setEditOpen(true);
  }

  function handleOpenGuest(model: GuestCardModel) {
    setDrawerModel(model);
    setDrawerOpen(true);
  }

  function handleDeleteRequest(model: GuestCardModel) {
    setDrawerOpen(false);
    setDeleteTarget(model);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.guest.id;

    startTransition(async () => {
      removeOptimistic(id);

      try {
        await deleteGuest(id);
        toast.success("Guest deleted");
        setDeleteTarget(null);
        setDrawerModel(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete guest");
      }
    });
  }

  function toggleFavorite(model: GuestCardModel) {
    startTransition(async () => {
      try {
        await setGuestFavorite(model.guest.id, !model.guest.is_favorite);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
      }
    });
  }

  return (
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.guests.title")}
        subtitle={t("pages.guests.subtitle")}
      />

      <GuestsExecutiveKpis kpis={kpis} loading={loading} />

      <GuestToolbar
        search={search}
        status={status}
        tag={tag}
        country={country}
        tagOptions={tagOptions}
        countryOptions={countryOptions}
        sortKey={sortKey}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTagChange={setTag}
        onCountryChange={setCountry}
        onSortChange={setSortKey}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
      />

      {viewMode === "cards" ? (
        <GuestsCardsView
          models={filteredModels}
          loading={loading}
          onOpenGuest={handleOpenGuest}
          onEditGuest={handleEdit}
          onDeleteGuest={handleDeleteRequest}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <GuestsTable
          models={filteredModels}
          loading={loading}
          onOpenGuest={handleOpenGuest}
          onEditGuest={handleEdit}
          onDeleteGuest={handleDeleteRequest}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <GuestDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={drawerModel}
        candidates={candidates}
        onEdit={() => {
          if (drawerModel) handleEdit(drawerModel);
        }}
        onDelete={() => {
          if (drawerModel) handleDeleteRequest(drawerModel);
        }}
        onToggleFavorite={() => {
          if (drawerModel) toggleFavorite(drawerModel);
        }}
      />

      <GuestCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <GuestEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        guest={selectedGuest}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete guest?"
        description={
          deleteTarget
            ? `Guest "${deleteTarget.guest.first_name} ${deleteTarget.guest.last_name}" will be moved to the archive (soft delete).`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </AdminPageStack>
  );
}
