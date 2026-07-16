"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

import type { Guest } from "@/types/guest";

import { mergeGuests } from "@/lib/services/guests.mutations";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sourceId, setSourceId] = useState("");

  function handleMerge() {
    if (!sourceId) {
      toast.error(t("guests.mergeSelectError"));
      return;
    }

    startTransition(async () => {
      try {
        await mergeGuests({ targetId: target.id, sourceId });
        toast.success(t("guests.mergeSuccess"));
        onOpenChange(false);
        setSourceId("");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error ? error.message : t("guests.mergeFailed")
          )
        );
      }
    });
  }

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("guests.mergeTitle")}
    >
      <div className="space-y-5">
        <p className="text-sm text-[var(--shell-muted)]">
          {target.first_name} {target.last_name}
        </p>

        <div className="space-y-1.5">
          <label htmlFor="merge-source" className="block text-sm text-[var(--shell-muted)]">
            {t("guests.mergeSelect")}
          </label>

          <Select
            id="merge-source"
            value={sourceId}
            onChange={setSourceId}
            placeholder={t("guests.mergeSelect")}
            aria-label={t("guests.mergeSelect")}
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
          {pending ? t("common.saving") : t("guests.mergeTitle")}
        </Button>
      </div>
    </WorkspaceFormDrawer>
  );
}
