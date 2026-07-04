"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Crown, GitMerge, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import {
  deleteGuest,
  setGuestFavorite,
  setGuestVip,
} from "@/lib/services/guests.mutations";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { GuestEditDialog } from "./GuestEditDialog";
import { MergeGuestsDialog } from "./MergeGuestsDialog";

type Props = {
  guest: Guest;
  candidates: Guest[];
};

export function GuestProfileActions({ guest, candidates }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function toggleFlag(kind: "vip" | "favorite") {
    startTransition(async () => {
      try {
        if (kind === "vip") {
          await setGuestVip(guest.id, !guest.is_vip);
        } else {
          await setGuestFavorite(guest.id, !guest.is_favorite);
        }
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Не удалось обновить статус");
      }
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteGuest(guest.id);
        toast.success("Гость удалён");
        router.push("/guests");
      } catch (error) {
        console.error(error);
        toast.error("Не удалось удалить гостя");
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={guest.is_vip}
        disabled={pending}
        onClick={() => toggleFlag("vip")}
      >
        <Crown size={16} className="mr-1.5" />
        {guest.is_vip ? "Снять VIP" : "VIP"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        aria-pressed={guest.is_favorite}
        disabled={pending}
        onClick={() => toggleFlag("favorite")}
      >
        <Star size={16} className="mr-1.5" />
        {guest.is_favorite ? "Из избранного" : "В избранное"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={pending || candidates.length === 0}
        onClick={() => setMergeOpen(true)}
      >
        <GitMerge size={16} className="mr-1.5" />
        Объединить
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditOpen(true)}
      >
        <Pencil size={16} className="mr-1.5" />
        Редактировать
      </Button>

      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 size={16} className="mr-1.5" />
        Удалить
      </Button>

      <GuestEditDialog open={editOpen} onOpenChange={setEditOpen} guest={guest} />

      <MergeGuestsDialog
        open={mergeOpen}
        onOpenChange={setMergeOpen}
        target={guest}
        candidates={candidates}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Удалить гостя?"
        description={`Гость «${guest.first_name} ${guest.last_name}» будет перемещён в архив.`}
        confirmLabel="Удалить"
        destructive
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
