"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Room } from "@/types/room";

import { deleteRoom } from "@/lib/services/rooms.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { RoomCreateDialog } from "./RoomCreateDialog";
import { RoomDetailDrawer } from "./RoomDetailDrawer";
import { RoomKpiGrid } from "./RoomKpiGrid";
import { RoomToolbar } from "./RoomToolbar";
import { RoomsCardsView } from "./RoomsCardsView";
import { DashboardPageHeader } from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";
import {
  buildRoomCardModels,
  computeRoomOpsKpis,
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
  const [pending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duplicateTemplate, setDuplicateTemplate] = useState<Room | null>(null);
  const [drawerModel, setDrawerModel] = useState<RoomCardModel | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("");
  const [status, setStatus] = useState("");
  const [roomType, setRoomType] = useState("");
  const [sortKey, setSortKey] = useState<RoomSortKey>("type_asc");
  const [viewMode, setViewMode] = useState<RoomViewMode>("grid");

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

  const floorOptions = useMemo(() => {
    const floors = new Set<string>();

    for (const room of rooms) {
      const match = room.room_type.match(/^(\d+)\s*этаж/i);
      if (match?.[1]) floors.add(`Floor ${match[1]}`);
    }

    return Array.from(floors).sort();
  }, [rooms]);

  const filteredModels = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = cardModels.filter((model) => {
      const matchesSearch =
        query === "" ||
        model.room.room_type.toLowerCase().includes(query) ||
        model.roomCode.includes(query);

      const matchesStatus = status === "" || model.status === status;
      const matchesRoomType =
        roomType === "" || model.room.room_type === roomType;

      const matchesFloor =
        floor === "" ||
        (floor.startsWith("Floor") &&
          model.room.room_type
            .toLowerCase()
            .includes(floor.replace("Floor ", "").toLowerCase()));

      return (
        matchesSearch && matchesStatus && matchesRoomType && matchesFloor
      );
    });

    return sortRoomModels(filtered, sortKey);
  }, [cardModels, search, status, roomType, floor, sortKey]);

  const kpis = useMemo(
    () => computeRoomOpsKpis(cardModels),
    [cardModels]
  );

  function handleEdit(room: Room) {
    setSelectedRoom(room);
    setDuplicateTemplate(null);
    setEditOpen(true);
  }

  function handleDuplicate(room: Room) {
    setDuplicateTemplate(room);
    setSelectedRoom(null);
    setCreateOpen(true);
  }

  function handleOpen(model: RoomCardModel) {
    setDrawerModel(model);
    setDrawerOpen(true);
  }

  function confirmBulkDelete() {
    const ids = Array.from(selectedIds);

    startTransition(async () => {
      try {
        await Promise.all(ids.map((id) => deleteRoom(id)));
        toast.success("Selected rooms deleted");
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete selected rooms");
      }
    });
  }

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        title={t("pages.rooms.title")}
        subtitle={t("pages.rooms.subtitle")}
      />

      <RoomKpiGrid kpis={kpis} loading={loading} />

      <RoomToolbar
        search={search}
        floor={floor}
        status={status}
        roomType={roomType}
        floorOptions={floorOptions}
        roomTypeOptions={roomTypeOptions}
        sortKey={sortKey}
        viewMode={viewMode}
        selectedCount={selectedIds.size}
        onSearchChange={setSearch}
        onFloorChange={setFloor}
        onStatusChange={setStatus}
        onRoomTypeChange={setRoomType}
        onSortChange={setSortKey}
        onViewModeChange={setViewMode}
        onCreateClick={() => {
          setDuplicateTemplate(null);
          setCreateOpen(true);
        }}
        onBulkDelete={() => setBulkDeleteOpen(true)}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <RoomsCardsView
        models={filteredModels}
        viewMode={viewMode}
        loading={loading}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onOpenRoom={handleOpen}
        onEditRoom={handleEdit}
        onDuplicateRoom={handleDuplicate}
      />

      <RoomDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={drawerModel}
        bookings={bookings}
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

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected rooms?"
        description={`${selectedIds.size} room(s) will be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}
