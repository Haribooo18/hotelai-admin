"use client";

import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import type { Room } from "@/types/room";

import { BookingForm } from "./BookingForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
};

export function BookingCreateDialog({
  open,
  onOpenChange,
  rooms,
}: Props) {
  const { t } = useI18n();

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("bookings.dialogNewReservation")}
    >
      <BookingForm rooms={rooms} onSuccess={() => onOpenChange(false)} />
    </WorkspaceFormDrawer>
  );
}

type ButtonProps = {
  onClick: () => void;
  className?: string;
  label?: string;
  icon?: LucideIcon;
};

export function BookingCreateButton({
  onClick,
  className,
  label,
  icon: Icon = Plus,
}: ButtonProps) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("bookings.createReservation");

  return (
    <Button type="button" size="sm" onClick={onClick} className={cn(className)}>
      <Icon size={15} aria-hidden />
      {resolvedLabel}
    </Button>
  );
}
