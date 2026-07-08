"use client";

import { useCallback, useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Booking } from "@/types/booking";
import type { Guest } from "@/types/guest";
import type { Room } from "@/types/room";

import { deleteBooking } from "@/lib/services/bookings.mutations";
import { workspaceSurfaceClass } from "@/lib/dashboard/design-system";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { useCreateQueryParam } from "@/components/dashboard/shared/useCreateQueryParam";
import { formatTranslation, useI18n } from "@/lib/i18n";

import { BookingCreateDialog } from "./BookingCreateDialog";
import { BookingDetailDrawer } from "./BookingDetailDrawer";
import { BookingEditDialog } from "./BookingEditDialog";
import { BookingsCards } from "./BookingsCards";
import { BookingsExecutiveKpis } from "./BookingsExecutiveKpis";
import { BookingsOperations } from "./BookingsOperations";
import { BookingsToolbar } from "./BookingsToolbar";
import {
  buildBookingCardModel,
  buildBookingCardModels,
  computeBookingOpsKpis,
  deriveBookingSource,
  derivePaymentStatus,
  type BookingCardModel,
} from "./booking-ops-metrics";
import type { BookingsToolbarFilters } from "./bookings-ui";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  guests: Guest[];
};

const DEFAULT_FILTERS: BookingsToolbarFilters = {
  search: "",
  chipFilter: "all",
  dateFilter: "",
  status: "",
  payment: "",
  source: "",
  roomId: "",
  sort: "check_in",
};

function isNewBooking(booking: Booking): boolean {
  const created = new Date(booking.created_at);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return created >= weekAgo;
}

function isStayingOnDate(booking: Booking, date: string): boolean {
  return booking.check_in <= date && booking.check_out > date;
}

function sortBookings(bookings: Booking[], sort: BookingsToolbarFilters["sort"]) {
  const sorted = [...bookings];

  sorted.sort((a, b) => {
    switch (sort) {
      case "guest":
        return a.guest_name.localeCompare(b.guest_name);
      case "total":
        return Number(b.total_price) - Number(a.total_price);
      case "status":
        return a.status.localeCompare(b.status);
      case "check_in":
      default:
        return a.check_in.localeCompare(b.check_in);
    }
  });

  return sorted;
}

export function BookingsPage({ bookings, rooms, guests }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [refreshing, startRefresh] = useTransition();

  const [optimisticBookings, removeOptimistic] = useOptimistic(
    bookings,
    (state, id: string) => state.filter((booking) => booking.id !== id)
  );

  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = useCallback(() => setCreateOpen(true), []);
  useCreateQueryParam(openCreate);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BookingCardModel | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<BookingCardModel | null>(
    null
  );
  const [filters, setFilters] = useState<BookingsToolbarFilters>(DEFAULT_FILTERS);

  const today = new Date().toISOString().slice(0, 10);

  const filteredBookings = useMemo(() => {
    const filtered = optimisticBookings.filter((booking) => {
      const query = filters.search.toLowerCase();

      const matchesSearch =
        booking.guest_name.toLowerCase().includes(query) ||
        booking.guest_email?.toLowerCase().includes(query) ||
        booking.guest_phone?.toLowerCase().includes(query);

      const matchesStatus =
        filters.status === "" || booking.status === filters.status;

      const matchesPayment =
        filters.payment === "" ||
        derivePaymentStatus(booking) === filters.payment;

      const matchesSource =
        filters.source === "" ||
        deriveBookingSource(booking) === filters.source;

      const matchesRoom =
        filters.roomId === "" || booking.room_id === filters.roomId;

      const matchesChip = (() => {
        switch (filters.chipFilter) {
          case "new":
            return isNewBooking(booking);
          case "confirmed":
            return booking.status === "confirmed";
          case "check_in_today":
            return booking.check_in === today;
          case "check_out_today":
            return booking.check_out === today;
          default:
            return true;
        }
      })();

      const matchesDate =
        filters.dateFilter === "" || isStayingOnDate(booking, filters.dateFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesSource &&
        matchesRoom &&
        matchesChip &&
        matchesDate
      );
    });

    return sortBookings(filtered, filters.sort);
  }, [optimisticBookings, filters, today]);

  const kpis = useMemo(
    () => computeBookingOpsKpis(optimisticBookings, rooms.length),
    [optimisticBookings, rooms.length]
  );

  const cardModels = useMemo(
    () => buildBookingCardModels(filteredBookings, rooms, guests),
    [filteredBookings, rooms, guests]
  );

  const loading = false;
  const selectedId = selectedModel?.booking.id ?? null;

  const openDrawer = useCallback((model: BookingCardModel) => {
    setSelectedModel(model);
    setDrawerOpen(true);
  }, []);

  const handleSelect = useCallback(
    (model: BookingCardModel) => {
      openDrawer(model);
    },
    [openDrawer]
  );

  const handleEdit = useCallback((model: BookingCardModel) => {
    setSelectedModel(model);
    setEditOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((model: BookingCardModel) => {
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

    const id = deleteTarget.booking.id;

    startTransition(async () => {
      removeOptimistic(id);

      try {
        await deleteBooking(id);
        toast.success(t("bookings.deleted"));
        setDeleteTarget(null);
        setSelectedModel(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(t("bookings.deleteFailed"));
      }
    });
  }

  return (
    <>
      <WorkspacePageLayout
        header={
          <PageHeader
            title={t("pages.reservations.title")}
            subtitle={t("pages.reservations.subtitle")}
          />
        }
        kpis={<BookingsExecutiveKpis kpis={kpis} loading={loading || refreshing} />}
        toolbar={
          <BookingsToolbar
            filters={filters}
            rooms={rooms}
            refreshing={refreshing}
            onFiltersChange={setFilters}
            onRefresh={handleRefresh}
          />
        }
      >
        <GlassSurface className={workspaceSurfaceClass}>
        <BookingsCards
          models={cardModels}
          loading={loading}
          selectedId={selectedId}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </GlassSurface>

      <BookingsOperations
        bookings={optimisticBookings}
        rooms={rooms}
        guests={guests}
        kpis={kpis}
        loading={loading}
        onSelect={handleSelect}
      />
      </WorkspacePageLayout>

      <BookingDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selectedModel}
        onEdit={(booking) => {
          handleEdit(
            selectedModel ?? buildBookingCardModel(booking, rooms, guests)
          );
        }}
        onDelete={(booking) => {
          handleDeleteRequest(
            selectedModel ?? buildBookingCardModel(booking, rooms, guests)
          );
        }}
      />

      <BookingCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        rooms={rooms}
      />

      <BookingEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        booking={selectedModel?.booking ?? null}
        rooms={rooms}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={t("bookings.deleteConfirm")}
        description={
          deleteTarget
            ? formatTranslation(t("bookings.deleteConfirmDesc"), {
                name: deleteTarget.booking.guest_name,
              })
            : undefined
        }
        confirmLabel={t("common.delete")}
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
