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
      toast.error("Select a guest to merge");
      return;
    }

    startTransition(async () => {
      try {
        await mergeGuests({ targetId: target.id, sourceId });
        toast.success("Guests merged");
        onOpenChange(false);
        setSourceId("");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Failed to merge"
        );
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Merge duplicates</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-6 pb-6">
          <p className="text-sm text-zinc-400">
            The selected guest&apos;s data will be merged into{" "}
            <span className="font-medium text-white">
              {target.first_name} {target.last_name}
            </span>
            , and the duplicate will be archived.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="merge-source" className="block text-sm text-zinc-400">
              Duplicate guest
            </label>

            <Select
              id="merge-source"
              value={sourceId}
              onChange={setSourceId}
              placeholder="Select a guest"
              aria-label="Duplicate guest"
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
            {pending ? "Merging..." : "Merge"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
