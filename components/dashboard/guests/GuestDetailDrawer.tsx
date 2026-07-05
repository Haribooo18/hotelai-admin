"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  CreditCard,
  FileText,
  NotebookPen,
  Pencil,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";

import type { Guest } from "@/types/guest";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DashboardEmptyState,
  DashboardPanelHeader,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import { GuestAvatar } from "./GuestAvatar";
import { GuestBookingHistory } from "./GuestBookingHistory";
import { GuestProfileActions } from "./GuestProfileActions";
import { GuestProfileCard } from "./GuestProfileCard";
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

const TABS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "reservations", label: "Bookings", icon: NotebookPen },
  { id: "revenue", label: "Revenue", icon: CreditCard },
  { id: "timeline", label: "Timeline", icon: Sparkles },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "tags", label: "Tags", icon: Settings2 },
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "ai", label: "AI Summary", icon: Bot },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  const [tab, setTab] = useState<TabId>("profile");

  const timeline = useMemo(
    () =>
      model ? buildGuestTimeline(model.guest, model.bookings) : [],
    [model]
  );

  if (!model) return null;

  const { guest, bookings, stats } = model;
  const fullName = `${guest.first_name} ${guest.last_name}`.trim();
  const satisfaction = deriveSatisfaction(model);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-[var(--shell-border)]/70 px-6 py-5">
          <div className="flex items-start gap-4">
            <GuestAvatar
              firstName={guest.first_name}
              lastName={guest.last_name}
              avatarUrl={guest.avatar_url}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-left text-[18px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
                {fullName}
              </SheetTitle>
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
        </SheetHeader>

        <div className="border-b border-[var(--shell-border)]/70 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-[background-color,color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
                    active
                      ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-accent)]"
                      : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
                  )}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {tab === "profile" ? (
            <div className="space-y-4">
              <GuestProfileCard
                guest={guest}
                actions={
                  <GuestProfileActions guest={guest} candidates={candidates} />
                }
              />
              <GuestStats stats={stats} />
            </div>
          ) : null}

          {tab === "reservations" ? (
            <DashboardSurface className="overflow-hidden p-2">
              <GuestBookingHistory bookings={bookings} />
            </DashboardSurface>
          ) : null}

          {tab === "revenue" ? (
            <DashboardSurface className="p-4">
              <DashboardPanelHeader
                title="Revenue"
                subtitle="Lifetime value from bookings"
                className="mb-3"
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[var(--shell-muted)]">
                    Lifetime revenue
                  </span>
                  <span className="text-[18px] font-semibold text-[var(--shell-text)]">
                    {formatGuestCurrency(guest.total_spent)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[var(--shell-muted)]">
                    Booking revenue
                  </span>
                  <span className="text-[14px] font-medium text-[var(--shell-text)]">
                    {formatGuestCurrency(stats.totalRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[var(--shell-muted)]">
                    Total nights
                  </span>
                  <span className="text-[14px] font-medium text-[var(--shell-text)]">
                    {stats.totalNights}
                  </span>
                </div>
              </div>
            </DashboardSurface>
          ) : null}

          {tab === "timeline" ? (
            <div className="space-y-2">
              {timeline.length === 0 ? (
                <DashboardEmptyState
                  title="Timeline is empty"
                  description="Events will appear after bookings and profile updates."
                  icon={<Sparkles size={16} />}
                />
              ) : (
                timeline.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-3 transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-sm)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
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
                  </div>
                ))
              )}
            </div>
          ) : null}

          {tab === "notes" ? (
            <DashboardSurface className="p-4">
              {guest.notes ? (
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--shell-text)]">
                  {guest.notes}
                </p>
              ) : (
                <DashboardEmptyState
                  title="No notes yet"
                  description="Add a note to the guest profile so the team can see important context."
                  icon={<FileText size={16} />}
                />
              )}
            </DashboardSurface>
          ) : null}

          {tab === "tags" ? (
            <DashboardSurface className="p-4">
              <GuestTags tags={guest.tags} isVip={guest.is_vip} />
            </DashboardSurface>
          ) : null}

          {tab === "preferences" ? (
            <DashboardSurface className="p-4">
              <DashboardPanelHeader
                title="Preferences"
                subtitle="Tags and profile flags"
                className="mb-3"
              />
              <div className="space-y-3 text-[13px] text-[var(--shell-text)]">
                <p>VIP: {guest.is_vip ? "Yes" : "No"}</p>
                <p>Favorite: {guest.is_favorite ? "Yes" : "No"}</p>
                <GuestTags tags={guest.tags} />
              </div>
            </DashboardSurface>
          ) : null}

          {tab === "ai" ? (
            <DashboardSurface className="p-4">
              <DashboardEmptyState
                title="AI summary unavailable"
                description="When the AI assistant analyzes guest history, a brief summary will appear here."
                icon={<Bot size={16} />}
              />
            </DashboardSurface>
          ) : null}
        </div>

        <div className="border-t border-[var(--shell-border)]/70 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 text-[13px] hover:bg-emerald-500"
              onClick={() => onEdit?.()}
            >
              <Pencil size={14} />
              Edit guest
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] px-4 text-[13px] shadow-[var(--shell-shadow-sm)]"
              onClick={() => onToggleFavorite?.()}
            >
              <Star size={14} />
              {guest.is_favorite ? "Unfavorite" : "Favorite"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-[var(--ds-input-height)] gap-2 rounded-[var(--ds-radius-sm)] border-0 bg-[var(--shell-surface-raised)] px-4 text-[13px] text-red-400 shadow-[var(--shell-shadow-sm)] hover:bg-red-500/10"
              onClick={() => onDelete?.()}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
