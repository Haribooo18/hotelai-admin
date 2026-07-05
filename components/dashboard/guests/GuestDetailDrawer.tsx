"use client";

import { useMemo } from "react";
import {
  FileText,
  Mail,
  Pencil,
  Phone,
  Star,
  Trash2,
} from "lucide-react";

import type { Guest } from "@/types/guest";

import { Button } from "@/components/ui/core/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlay/Drawer";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Scrollable } from "@/components/ui/primitives/Scrollable";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { GuestAvatar } from "./GuestAvatar";
import { GuestBookingHistory } from "./GuestBookingHistory";
import { GuestProfileActions } from "./GuestProfileActions";
import { GuestSatisfactionBadge } from "./GuestSatisfactionBadge";
import { GuestStats } from "./GuestStats";
import { GuestTags } from "./GuestTags";
import {
  buildGuestTimeline,
  deriveSatisfaction,
  formatGuestCurrency,
  formatGuestDateTime,
  type GuestCardModel,
} from "./guest-crm-metrics";
import { getGuestLanguageLabel, GuestDetailRow } from "./guests-ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: GuestCardModel | null;
  candidates: Guest[];
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
};

export function GuestDetailDrawer({
  open,
  onOpenChange,
  model,
  candidates,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const timeline = useMemo(
    () => (model ? buildGuestTimeline(model.guest, model.bookings) : []),
    [model]
  );

  if (!model) return null;

  const { guest, bookings, stats } = model;
  const fullName = `${guest.first_name} ${guest.last_name}`.trim();
  const satisfaction = deriveSatisfaction(model);
  const language = getGuestLanguageLabel(guest);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
      >
        <DrawerHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
          <div className="flex items-start gap-4">
            <GuestAvatar
              firstName={guest.first_name}
              lastName={guest.last_name}
              avatarUrl={guest.avatar_url}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <DrawerTitle className="text-left text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {fullName}
              </DrawerTitle>
              <p className="mt-1 text-left text-[13px] text-[var(--shell-muted)]">
                {[guest.city, guest.country].filter(Boolean).join(", ") ||
                  "Location not set"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <GuestTags
                  tags={guest.tags}
                  isVip={guest.is_vip}
                  isFavorite={guest.is_favorite}
                />
                <GuestSatisfactionBadge satisfaction={satisfaction} />
              </div>
            </div>
          </div>
        </DrawerHeader>

        <Scrollable className="flex-1 px-6 py-5">
          <Stack gap="md">
            <Panel variant="surface" className="p-4">
              <Section title="Profile" subtitle="Guest identity and location" />
              <dl className="mt-3 grid gap-2">
                <GuestDetailRow label="Name" value={fullName} />
                <GuestDetailRow label="Country" value={guest.country ?? "—"} />
                <GuestDetailRow label="City" value={guest.city ?? "—"} />
                <GuestDetailRow label="Language" value={language ?? "—"} />
                <GuestDetailRow
                  label="Total stays"
                  value={String(guest.total_bookings)}
                />
              </dl>
              <div className="mt-4">
                <GuestProfileActions guest={guest} candidates={candidates} />
              </div>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Contact" subtitle="Reach the guest directly" />
              <div className="mt-3 space-y-2.5 text-[13px]">
                {guest.email ? (
                  <div className="flex items-center gap-2 text-[var(--shell-text)]">
                    <Mail size={14} className="text-[var(--shell-muted)]" />
                    {guest.email}
                  </div>
                ) : null}
                {guest.phone ? (
                  <div className="flex items-center gap-2 text-[var(--shell-muted)]">
                    <Phone size={14} />
                    {guest.phone}
                  </div>
                ) : null}
                {!guest.email && !guest.phone ? (
                  <p className="text-[var(--shell-muted)]">No contact details</p>
                ) : null}
              </div>
            </Panel>

            <Panel variant="surface" className="overflow-hidden p-2">
              <Section
                title="Booking history"
                subtitle="Past and upcoming reservations"
                className="px-2 pt-2"
              />
              <GuestBookingHistory bookings={bookings} />
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Revenue" subtitle="Lifetime value from bookings" />
              <div className="mt-3 space-y-2">
                <GuestDetailRow
                  label="Lifetime revenue"
                  value={formatGuestCurrency(guest.total_spent)}
                />
                <GuestDetailRow
                  label="Booking revenue"
                  value={formatGuestCurrency(stats.totalRevenue)}
                />
                <GuestDetailRow
                  label="Total nights"
                  value={String(stats.totalNights)}
                />
              </div>
              <div className="mt-4">
                <GuestStats stats={stats} />
              </div>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Preferences" subtitle="VIP and favorite flags" />
              <dl className="mt-3 grid gap-2 text-[13px]">
                <GuestDetailRow label="VIP" value={guest.is_vip ? "Yes" : "No"} />
                <GuestDetailRow
                  label="Favorite"
                  value={guest.is_favorite ? "Yes" : "No"}
                />
              </dl>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Tags" subtitle="CRM segmentation labels" />
              <div className="mt-3">
                <GuestTags tags={guest.tags} isVip={guest.is_vip} />
              </div>
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Notes" subtitle="Team-only context" />
              {guest.notes ? (
                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--shell-text)]">
                  {guest.notes}
                </p>
              ) : (
                <EmptyState
                  title="No notes yet"
                  description="Add a note to the guest profile so the team can see important context."
                  icon={<FileText size={16} />}
                />
              )}
            </Panel>

            <Panel variant="surface" className="p-4">
              <Section title="Timeline" subtitle="Profile and booking activity" />
              {timeline.length === 0 ? (
                <EmptyState
                  title="Timeline is empty"
                  description="Events will appear after bookings and profile updates."
                  icon={<FileText size={16} />}
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {timeline.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
                        motionPresets.transitionBase
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[var(--shell-text)]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                        {formatGuestDateTime(item.at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </Stack>
        </Scrollable>

        <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
          <Section title="Actions" subtitle="Guest management shortcuts" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[var(--ds-input-height)] gap-2 bg-emerald-600 hover:bg-emerald-500"
              onClick={() => onEdit?.()}
            >
              <Pencil size={14} />
              Edit guest
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2"
              onClick={() => onToggleFavorite?.()}
            >
              <Star size={14} />
              {guest.is_favorite ? "Unfavorite" : "Favorite"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2 text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete?.()}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
