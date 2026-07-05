"use client";

import { useCallback, useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

import { deleteGuest, setGuestFavorite } from "@/lib/services/guests.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { useI18n } from "@/lib/i18n";

import { GuestCreateDialog } from "./GuestCreateDialog";
import { GuestDetailDrawer } from "./GuestDetailDrawer";
import { GuestEditDialog } from "./GuestEditDialog";
import { GuestToolbar } from "./GuestToolbar";
import { GuestsCardsView } from "./GuestsCardsView";
import { GuestsCrmInsights } from "./GuestsCrmInsights";
import { GuestsExecutiveKpis } from "./GuestsExecutiveKpis";
import {
  buildGuestCardModels,
  computeGuestCrmKpis,
  extractCountryOptions,
  sortGuestModels,
  type GuestCardModel,
  type GuestViewMode,
} from "./guest-crm-metrics";
import {
  extractLanguageOptions,
  matchesGuestLanguageFilter,
  type GuestsToolbarFilters,
} from "./guests-ui";

type Props = {
  guests: Guest[];
  bookings: Booking[];
  rooms: Room[];
};

const DEFAULT_FILTERS: GuestsToolbarFilters = {
  search: "",
  tag: "",
  vip: "",
  country: "",
  language: "",
  status: "",
  sort: "newest",
};

export function GuestsPage({ guests, bookings, rooms }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [refreshing, startRefresh] = useTransition();

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

  const [filters, setFilters] = useState<GuestsToolbarFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<GuestViewMode>("cards");

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

  const languageOptions = useMemo(
    () => extractLanguageOptions(optimisticGuests),
    [optimisticGuests]
  );

  const cardModels = useMemo(
    () => buildGuestCardModels(optimisticGuests, bookings, rooms),
    [optimisticGuests, bookings, rooms]
  );

  const filteredModels = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

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
      const matchesTag = filters.tag === "" || (guest.tags ?? []).includes(filters.tag);
      const matchesCountry =
        filters.country === "" || guest.country === filters.country;
      const matchesLanguage = matchesGuestLanguageFilter(guest, filters.language);
      const matchesVip =
        filters.vip === ""
          ? true
          : filters.vip === "yes"
            ? guest.is_vip
            : !guest.is_vip;
      const matchesStatus = (() => {
        switch (filters.status) {
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

      return (
        matchesSearch &&
        matchesTag &&
        matchesCountry &&
        matchesLanguage &&
        matchesVip &&
        matchesStatus
      );
    });

    return sortGuestModels(filtered, filters.sort);
  }, [cardModels, filters]);

  const kpis = useMemo(() => computeGuestCrmKpis(cardModels), [cardModels]);

  const selectedId = drawerModel?.guest.id ?? null;

  const candidates = useMemo(
    () =>
      drawerModel
        ? optimisticGuests.filter((guest) => guest.id !== drawerModel.guest.id)
        : optimisticGuests,
    [optimisticGuests, drawerModel]
  );

  const handleEdit = useCallback((model: GuestCardModel) => {
    setSelectedGuest(model.guest);
    setEditOpen(true);
  }, []);

  const handleOpenGuest = useCallback((model: GuestCardModel) => {
    setDrawerModel(model);
    setDrawerOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((model: GuestCardModel) => {
    setDrawerOpen(false);
    setDeleteTarget(model);
  }, []);

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
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

  const toggleFavorite = useCallback(
    (model: GuestCardModel) => {
      startTransition(async () => {
        try {
          await setGuestFavorite(model.guest.id, !model.guest.is_favorite);
          router.refresh();
        } catch (error) {
          console.error(error);
          toast.error("Failed to update status");
        }
      });
    },
    [router, startTransition]
  );

  return (
    <Stack gap="md" className="ds-page-enter">
      <PageHeader
        title={t("pages.guests.title")}
        subtitle={t("pages.guests.subtitle")}
      />

      <GuestsExecutiveKpis kpis={kpis} loading={refreshing} />

      <GuestToolbar
        filters={filters}
        viewMode={viewMode}
        tagOptions={tagOptions}
        countryOptions={countryOptions}
        languageOptions={languageOptions}
        refreshing={refreshing}
        onFiltersChange={setFilters}
        onViewModeChange={setViewMode}
        onCreateClick={() => setCreateOpen(true)}
        onRefresh={handleRefresh}
      />

      <GlassSurface className="overflow-hidden p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)]">
        <GuestsCardsView
          models={filteredModels}
          viewMode={viewMode}
          loading={false}
          selectedId={selectedId}
          onOpenGuest={handleOpenGuest}
          onEditGuest={handleEdit}
          onDeleteGuest={handleDeleteRequest}
          onToggleFavorite={toggleFavorite}
        />
      </GlassSurface>

      <GuestsCrmInsights
        models={cardModels}
        loading={false}
        onSelect={handleOpenGuest}
      />

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
    </Stack>
  );
}
