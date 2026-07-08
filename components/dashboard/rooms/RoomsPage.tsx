"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";

import { workspaceSurfaceClass } from "@/lib/dashboard/design-system";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { WorkspacePageLayout } from "@/components/dashboard/shared/WorkspacePageLayout";
import { useCreateQueryParam } from "@/components/dashboard/shared/useCreateQueryParam";
import { useI18n } from "@/lib/i18n";

import { RoomCreateDialog } from "./RoomCreateDialog";
import { RoomDetailDrawer } from "./RoomDetailDrawer";
import { RoomsCardsView } from "./RoomsCardsView";
import { RoomsExecutiveKpis } from "./RoomsExecutiveKpis";
import { RoomsOperations } from "./RoomsOperations";
import { RoomToolbar } from "./RoomToolbar";
import {
  buildRoomCardModels,
  computeRoomOpsKpis,
  extractFloorOptions,
  extractRoomTypeOptions,
  sortRoomModels,
  type RoomCardModel,
} from "./room-ops-metrics";
import type { RoomsToolbarFilters } from "./rooms-ui";

type Props = {
  rooms: Room[];
  bookings: Booking[];
};

const DEFAULT_FILTERS: RoomsToolbarFilters = {
  search: "",
  status: "",
  housekeeping: "",
  maintenance: "",
  floor: "",
  roomType: "",
  sort: "type_asc",
};

export function RoomsPage({ rooms, bookings }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duplicateTemplate, setDuplicateTemplate] = useState<Room | null>(null);
  const [drawerModel, setDrawerModel] = useState<RoomCardModel | null>(null);

  const openCreate = useCallback(() => {
    setDuplicateTemplate(null);
    setCreateOpen(true);
  }, []);
  useCreateQueryParam(openCreate);

  const [filters, setFilters] = useState<RoomsToolbarFilters>(DEFAULT_FILTERS);

  const cardModels = useMemo(
    () => buildRoomCardModels(rooms, bookings),
    [rooms, bookings]
  );

  const roomTypeOptions = useMemo(
    () => extractRoomTypeOptions(rooms),
    [rooms]
  );

  const floorOptions = useMemo(() => extractFloorOptions(rooms), [rooms]);

  const filteredModels = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const filtered = cardModels.filter((model) => {
      const matchesSearch =
        query === "" ||
        model.room.room_type.toLowerCase().includes(query) ||
        model.roomCode.includes(query) ||
        (model.currentGuest?.toLowerCase().includes(query) ?? false);

      const matchesStatus = filters.status === "" || model.status === filters.status;
      const matchesRoomType =
        filters.roomType === "" || model.room.room_type === filters.roomType;
      const matchesFloor = filters.floor === "" || model.floorLabel === filters.floor;
      const matchesHousekeeping =
        filters.housekeeping === "" ||
        model.housekeepingStatus === filters.housekeeping;
      const matchesMaintenance =
        filters.maintenance === ""
          ? true
          : filters.maintenance === "open"
            ? model.status === "maintenance"
            : model.status !== "maintenance";

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRoomType &&
        matchesFloor &&
        matchesHousekeeping &&
        matchesMaintenance
      );
    });

    return sortRoomModels(filtered, filters.sort);
  }, [cardModels, filters]);

  const kpis = useMemo(
    () => computeRoomOpsKpis(cardModels, bookings),
    [cardModels, bookings]
  );

  const selectedId = drawerModel?.room.id ?? null;

  const handleEdit = useCallback((room: Room) => {
    setSelectedRoom(room);
    setDuplicateTemplate(null);
    setEditOpen(true);
    setDrawerOpen(false);
  }, []);

  const handleOpen = useCallback((model: RoomCardModel) => {
    setDrawerModel(model);
    setDrawerOpen(true);
  }, []);

  function handleRefresh() {
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <>
      <WorkspacePageLayout
        header={
          <PageHeader
            title={t("pages.rooms.title")}
            subtitle={t("pages.rooms.subtitle")}
          />
        }
        kpis={<RoomsExecutiveKpis kpis={kpis} loading={refreshing} />}
        toolbar={
          <RoomToolbar
            filters={filters}
            floorOptions={floorOptions}
            roomTypeOptions={roomTypeOptions}
            refreshing={refreshing}
            onFiltersChange={setFilters}
            onRefresh={handleRefresh}
          />
        }
        secondary={
          <RoomsOperations
            models={cardModels}
            bookings={bookings}
            kpis={kpis}
            loading={false}
            onSelect={handleOpen}
          />
        }
      >
        <GlassSurface className={workspaceSurfaceClass}>
          <RoomsCardsView
            models={filteredModels}
            loading={false}
            selectedId={selectedId}
            onOpenRoom={handleOpen}
            onEditRoom={handleEdit}
          />
        </GlassSurface>
      </WorkspacePageLayout>

      <RoomDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={drawerModel}
        bookings={bookings}
        onEdit={() => {
          if (drawerModel) handleEdit(drawerModel.room);
        }}
      />

      <RoomCreateDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setDuplicateTemplate(null);
        }}
        template={duplicateTemplate ?? undefined}
      />

      <RoomCreateDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        room={selectedRoom ?? undefined}
      />
    </>
  );
}
