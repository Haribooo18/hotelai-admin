"use client";

import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { useI18n } from "@/lib/i18n";

import type { Guest } from "@/types/guest";

import { GuestForm } from "./GuestForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
};

export function GuestEditDialog({ open, onOpenChange, guest }: Props) {
  const { t } = useI18n();

  if (!guest) return null;

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("common.edit")}
    >
      <GuestForm guest={guest} onSuccess={() => onOpenChange(false)} />
    </WorkspaceFormDrawer>
  );
}
