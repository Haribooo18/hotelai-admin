"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Room } from "@/types/room";

import { AdminPageStack, DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";

import { RoomCreateDialog } from "./RoomCreateDialog";
import { RoomDetailDrawer } from "./RoomDetailDrawer";
import { RoomsExecutiveKpis } from "./RoomsExecutiveKpis";
import { RoomToolbar } from "./RoomToolbar";
import { RoomsCardsView } from "./RoomsCardsView";
import { RoomsOperations } from "./RoomsOperations";
import {
  buildRoomCardModels,
  buildRoomOperationsSnapshot,
  computeRoomOpsKpis,
  extractFloorOptions,
  extractRoomTypeOptions,
  sortRoomModels,
  type RoomCardModel,
  type RoomSortKey,
  type RoomViewMode,
} from "./room-ops-metrics";
import { useRoomsSupplement } from "./useRoomsSupplement";

type Props = {
  rooms: Room[];
};

export function RoomsPage({ rooms }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duplicateTemplate, setDuplicateTemplate] = useState<Room | null>(null);
  const [drawerModel, setDrawerModel] = useState<RoomCardModel | null>(null);

  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("");
  const [status, setStatus] = useState("");
  const [roomType, setRoomType] = useState("");
  const [housekeeping, setHousekeeping] = useState("");
  const [sortKey, setSortKey] = useState<RoomSortKey>("type_asc");
  const [viewMode, setViewMode] = useState<RoomViewMode>("cards");

  const hotelId = rooms[0]?.hotel_id;
  const { bookings, loading } = useRoomsSupplement(hotelId);

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
    const query = search.trim().toLowerCase();

    const filtered = cardModels.filter((model) => {
      const matchesSearch =
        query === "" ||
        model.room.room_type.toLowerCase().includes(query) ||
        model.roomCode.includes(query) ||
        (model.currentGuest?.toLowerCase().includes(query) ?? false);

      const matchesStatus = status === "" || model.status === status;
      const matchesRoomType =
        roomType === "" || model.room.room_type === roomType;
      const matchesFloor = floor === "" || model.floorLabel === floor;
      const matchesHousekeeping =
        housekeeping === "" || model.housekeepingStatus === housekeeping;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRoomType &&
        matchesFloor &&
        matchesHousekeeping
      );
    });

    return sortRoomModels(filtered, sortKey);
  }, [cardModels, search, status, roomType, floor, housekeeping, sortKey]);

  const kpis = useMemo(
    () => computeRoomOpsKpis(cardModels, bookings),
    [cardModels, bookings]
  );

  const operations = useMemo(
    () => buildRoomOperationsSnapshot(cardModels, bookings),
    [cardModels, bookings]
  );

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
    <AdminPageStack className="ds-page-enter">
      <DashboardPageHeader
        title={t("pages.rooms.title")}
        subtitle={t("pages.rooms.subtitle")}
      />

      <RoomsExecutiveKpis kpis={kpis} loading={loading || refreshing} />

      <RoomToolbar
        search={search}
        floor={floor}
        status={status}
        roomType={roomType}
        housekeeping={housekeeping}
        floorOptions={floorOptions}
        roomTypeOptions={roomTypeOptions}
        sortKey={sortKey}
        viewMode={viewMode}
        refreshing={refreshing}
        onSearchChange={setSearch}
        onFloorChange={setFloor}
        onStatusChange={setStatus}
        onRoomTypeChange={setRoomType}
        onHousekeepingChange={setHousekeeping}
        onSortChange={setSortKey}
        onViewModeChange={setViewMode}
        onCreateClick={() => {
          setDuplicateTemplate(null);
          setCreateOpen(true);
        }}
        onRefresh={handleRefresh}
      />

      <RoomsCardsView
        models={filteredModels}
        viewMode={viewMode}
        loading={loading}
        onOpenRoom={handleOpen}
        onEditRoom={handleEdit}
      />

      <RoomsOperations snapshot={operations} />

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
    </AdminPageStack>
  );
}
