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
  WorkspaceInspectorDrawer,
  WorkspaceOverlayActions,
} from "@/components/dashboard/shared/WorkspaceOverlay";
import { DrawerTitle } from "@/components/ui/overlay/Drawer";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Stack } from "@/components/ui/primitives/Stack";
import { motionPresets } from "@/lib/design/motion";
import {
  cardPaddingClass,
  drawerBadgeRowClass,
  drawerSubtitleClass,
  overlayDangerButtonClass,
} from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
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
  translateGuestTimelineItem,
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
  const { t } = useI18n();
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
    <WorkspaceInspectorDrawer
      open={open}
      onOpenChange={onOpenChange}
      header={
        <div className="flex items-start gap-4">
          <GuestAvatar
            firstName={guest.first_name}
            lastName={guest.last_name}
            avatarUrl={guest.avatar_url}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <DrawerTitle>{fullName}</DrawerTitle>
            <p className={drawerSubtitleClass}>
              {[guest.city, guest.country].filter(Boolean).join(", ") ||
                t("guests.locationNotSet")}
            </p>
            <div className={drawerBadgeRowClass}>
              <GuestTags
                tags={guest.tags}
                isVip={guest.is_vip}
                isFavorite={guest.is_favorite}
              />
              <GuestSatisfactionBadge satisfaction={satisfaction} />
            </div>
          </div>
        </div>
      }
      footer={
        <>
          <Section
            title={t("guests.drawerActions")}
            subtitle={t("guests.drawerActionsSubtitle")}
          />
          <WorkspaceOverlayActions className="mt-3">
            <Button type="button" className="gap-2" onClick={() => onEdit?.()}>
              <Pencil size={14} />
              {t("common.edit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2"
              onClick={() => onToggleFavorite?.()}
            >
              <Star size={14} />
              {guest.is_favorite
                ? t("guests.removeFavorite")
                : t("guests.addFavorite")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={overlayDangerButtonClass}
              onClick={() => onDelete?.()}
            >
              <Trash2 size={14} />
              {t("common.delete")}
            </Button>
          </WorkspaceOverlayActions>
        </>
      }
    >
          <Stack gap="md">
            <Panel variant="surface" className={cardPaddingClass}>
              <Section
                title={t("guests.drawerProfile")}
                subtitle={t("guests.drawerProfileSubtitle")}
              />
              <dl className="mt-3 grid gap-2">
                <GuestDetailRow label={t("bookings.guest")} value={fullName} />
                <GuestDetailRow
                  label={t("guests.crmCountriesTitle")}
                  value={guest.country ?? "—"}
                />
                <GuestDetailRow label={t("guests.location")} value={guest.city ?? "—"} />
                <GuestDetailRow
                  label={t("guests.crmLanguagesTitle")}
                  value={language ?? "—"}
                />
                <GuestDetailRow
                  label={t("guests.totalStays")}
                  value={String(guest.total_bookings)}
                />
              </dl>
              <div className="mt-4">
                <GuestProfileActions guest={guest} candidates={candidates} />
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section
                title={t("guests.drawerContact")}
                subtitle={t("guests.drawerContactSubtitle")}
              />
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
                  <p className="text-[var(--shell-muted)]">—</p>
                ) : null}
              </div>
            </Panel>

            <Panel variant="surface" className="overflow-hidden p-2">
              <Section
                title={t("guests.drawerBookingHistory")}
                subtitle={t("guests.drawerBookingHistorySubtitle")}
                className="px-2 pt-2"
              />
              <GuestBookingHistory bookings={bookings} />
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section
                title={t("guests.drawerRevenue")}
                subtitle={t("guests.drawerRevenueSubtitle")}
              />
              <div className="mt-3 space-y-2">
                <GuestDetailRow
                  label={t("guests.lifetimeRevenue")}
                  value={formatGuestCurrency(guest.total_spent)}
                />
                <GuestDetailRow
                  label={t("guests.bookingRevenue")}
                  value={formatGuestCurrency(stats.totalRevenue)}
                />
                <GuestDetailRow
                  label={t("guests.statsTotalNights")}
                  value={String(stats.totalNights)}
                />
              </div>
              <div className="mt-4">
                <GuestStats stats={stats} />
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section title={t("guests.vipLabel")} subtitle={t("guests.vipOnly")} />
              <dl className="mt-3 grid gap-2 text-[13px]">
                <GuestDetailRow
                  label={t("guests.vipLabel")}
                  value={guest.is_vip ? t("common.yes") : t("common.no")}
                />
                <GuestDetailRow
                  label={t("guests.addFavorite")}
                  value={guest.is_favorite ? t("common.yes") : t("common.no")}
                />
              </dl>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section title={t("guests.tagsLabel")} subtitle={t("guests.tagFilter")} />
              <div className="mt-3">
                <GuestTags tags={guest.tags} isVip={guest.is_vip} />
              </div>
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section title={t("guests.noNotes")} subtitle={t("guests.noNotesDesc")} />
              {guest.notes ? (
                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--shell-text)]">
                  {guest.notes}
                </p>
              ) : (
                <EmptyState
                  title={t("guests.noNotes")}
                  description={t("guests.noNotesDesc")}
                  icon={<FileText size={16} />}
                />
              )}
            </Panel>

            <Panel variant="surface" className={cardPaddingClass}>
              <Section
                title={t("guests.drawerTimeline")}
                subtitle={t("guests.drawerTimelineSubtitle")}
              />
              {timeline.length === 0 ? (
                <EmptyState
                  title={t("guests.timelineEmpty")}
                  description={t("guests.timelineEmptyDesc")}
                  icon={<FileText size={16} />}
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {timeline.slice(0, 8).map((item) => {
                    const translated = translateGuestTimelineItem(item, t);

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-start justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3",
                          motionPresets.transitionBase
                        )}
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[var(--shell-text)]">
                            {translated.title}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                            {translated.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                          {formatGuestDateTime(item.at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          </Stack>
    </WorkspaceInspectorDrawer>
  );
}
