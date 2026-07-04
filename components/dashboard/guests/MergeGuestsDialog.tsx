"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import { mergeGuests } from "@/lib/services/guests.mutations";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: Guest;
  candidates: Guest[];
};

export function MergeGuestsDialog({
  open,
  onOpenChange,
  target,
  candidates,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sourceId, setSourceId] = useState("");

  function handleMerge() {
    if (!sourceId) {
      toast.error("Выберите гостя для объединения");
      return;
    }

    startTransition(async () => {
      try {
        await mergeGuests({ targetId: target.id, sourceId });
        toast.success("Гости объединены");
        onOpenChange(false);
        setSourceId("");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Не удалось объединить"
        );
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Объединить дубликаты</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-6 pb-6">
          <p className="text-sm text-zinc-400">
            Данные выбранного гостя будут перенесены в{" "}
            <span className="font-medium text-white">
              {target.first_name} {target.last_name}
            </span>
            , а дубликат отправлен в архив.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="merge-source" className="block text-sm text-zinc-400">
              Гость-дубликат
            </label>

            <Select
              id="merge-source"
              value={sourceId}
              onChange={setSourceId}
              placeholder="Выберите гостя"
              aria-label="Гость-дубликат"
              options={candidates.map((g) => ({
                value: g.id,
                label: `${g.first_name} ${g.last_name}${
                  g.email ? ` — ${g.email}` : ""
                }`,
              }))}
            />
          </div>

          <Button
            className="w-full"
            variant="destructive"
            disabled={pending || candidates.length === 0}
            onClick={handleMerge}
          >
            {pending ? "Объединение..." : "Объединить"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
