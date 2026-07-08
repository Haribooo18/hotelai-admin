"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import { GuestForm } from "./GuestForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GuestCreateDialog({ open, onOpenChange }: Props) {
  const { t } = useI18n();

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("guests.newGuest")}
    >
      <GuestForm onSuccess={() => onOpenChange(false)} />
    </WorkspaceFormDrawer>
  );
}

type ButtonProps = {
  onClick: () => void;
  className?: string;
};

export function GuestCreateButton({ onClick, className }: ButtonProps) {
  const { t } = useI18n();

  return (
    <Button type="button" onClick={onClick} className={cn(className)}>
      <Plus className="h-4 w-4" />
      {t("guests.newGuest")}
    </Button>
  );
}
