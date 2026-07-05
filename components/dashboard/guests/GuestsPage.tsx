"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import {
  deleteGuest,
  setGuestFavorite,
  setGuestVip,
} from "@/lib/services/guests.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { GuestCreateDialog } from "./GuestCreateDialog";
import { GuestDetailDrawer } from "./GuestDetailDrawer";
import { GuestEditDialog } from "./GuestEditDialog";
import { GuestKpiGrid } from "./GuestKpiGrid";
import { GuestToolbar } from "./GuestToolbar";
import { GuestsCardsView } from "./GuestsCardsView";
import { DashboardPageHeader, AdminPageStack } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";
import {
  buildGuestCardModels,
  computeGuestCrmKpis,
  sortGuestModels,
  type GuestCardModel,
  type GuestSortKey,
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

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [drawerModel, setDrawerModel] = useState<GuestCardModel | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [flag, setFlag] = useState("");
  const [tag, setTag] = useState("");
  const [sortKey, setSortKey] = useState<GuestSortKey>("newest");
  const [viewMode, setViewMode] = useState<GuestViewMode>("grid");

  const hotelId = guests[0]?.hotel_id;
  const { bookings, rooms, loading } = useGuestsSupplement(hotelId);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const guest of guests) {
      for (const value of guest.tags ?? []) set.add(value);
    }
    return Array.from(set).sort();
  }, [guests]);

  const cardModels = useMemo(
    () => buildGuestCardModels(guests, bookings, rooms),
    [guests, bookings, rooms]
  );

  const filteredModels = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = cardModels.filter(({ guest }) => {
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
      const matchesFlag =
        flag === "" ||
        (flag === "vip" && guest.is_vip) ||
        (flag === "favorite" && guest.is_favorite);
      const matchesTag = tag === "" || (guest.tags ?? []).includes(tag);

      return matchesSearch && matchesFlag && matchesTag;
    });

    return sortGuestModels(filtered, sortKey);
  }, [cardModels, search, flag, tag, sortKey]);

  const kpis = useMemo(
    () => computeGuestCrmKpis(cardModels),
    [cardModels]
  );

  const candidates = useMemo(
    () =>
      drawerModel
        ? guests.filter((guest) => guest.id !== drawerModel.guest.id)
        : guests,
    [guests, drawerModel]
  );

  function handleEdit(guest: Guest) {
    setSelectedGuest(guest);
    setEditOpen(true);
  }

  function handleOpenGuest(model: GuestCardModel) {
    setDrawerModel(model);
    setDrawerOpen(true);
  }

  function runBulkAction(
    action: (id: string) => Promise<void>,
    successMessage: string
  ) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    startTransition(async () => {
      try {
        await Promise.all(ids.map((id) => action(id)));
        toast.success(successMessage);
        setSelectedIds(new Set());
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to perform bulk action");
      }
    });
  }

  function confirmBulkDelete() {
    const ids = Array.from(selectedIds);

    startTransition(async () => {
      try {
        await Promise.all(ids.map((id) => deleteGuest(id)));
        toast.success("Selected guests deleted");
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete selected guests");
      }
    });
  }

  return (
    <AdminPageStack>
      <DashboardPageHeader
        title={t("pages.guests.title")}
        subtitle={t("pages.guests.subtitle")}
      />

      <GuestKpiGrid kpis={kpis} loading={loading} />

      <GuestToolbar
        search={search}
        flag={flag}
        tag={tag}
        tagOptions={tagOptions}
        sortKey={sortKey}
        viewMode={viewMode}
        selectedCount={selectedIds.size}
        onSearchChange={setSearch}
        onFlagChange={setFlag}
        onTagChange={setTag}
        onSortChange={setSortKey}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
        onBulkDelete={() => setBulkDeleteOpen(true)}
        onBulkVip={() =>
          runBulkAction((id) => setGuestVip(id, true), "VIP status assigned")
        }
        onBulkFavorite={() =>
          runBulkAction(
            (id) => setGuestFavorite(id, true),
            "Guests added to favorites"
          )
        }
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <GuestsCardsView
        models={filteredModels}
        viewMode={viewMode}
        loading={loading}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onOpenGuest={handleOpenGuest}
        onEditGuest={handleEdit}
      />

      <GuestDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={drawerModel}
        candidates={candidates}
      />

      <GuestCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <GuestEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        guest={selectedGuest}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected guests?"
        description={`${selectedIds.size} guest(s) will be deleted. This performs a soft delete.`}
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmBulkDelete}
      />
    </AdminPageStack>
  );
}
