"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  CreditCard,
  FileText,
  NotebookPen,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { Guest } from "@/types/guest";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DashboardEmptyState,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";

import { GuestBookingHistory } from "./GuestBookingHistory";
import { GuestProfileActions } from "./GuestProfileActions";
import { GuestProfileCard } from "./GuestProfileCard";
import { GuestStats } from "./GuestStats";
import { GuestTags } from "./GuestTags";
import {
  buildGuestTimeline,
  formatGuestDateTime,
  type GuestCardModel,
} from "./guest-crm-metrics";

const TABS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "reservations", label: "Reservations", icon: NotebookPen },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "ai", label: "AI Summary", icon: Bot },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: GuestCardModel | null;
  candidates: Guest[];
};

export function GuestDetailDrawer({
  open,
  onOpenChange,
  model,
  candidates,
}: Props) {
  const [tab, setTab] = useState<TabId>("profile");

  const timeline = useMemo(
    () =>
      model
        ? buildGuestTimeline(model.guest, model.bookings)
        : [],
    [model]
  );

  if (!model) return null;

  const { guest, bookings, stats } = model;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden border-0 bg-[var(--shell-content)] p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-[var(--shell-border)] px-6 py-5">
          <SheetTitle className="text-left text-[20px] font-semibold text-[var(--shell-text)]">
            {guest.first_name} {guest.last_name}
          </SheetTitle>
          <div className="mt-2">
            <GuestTags
              tags={guest.tags}
              isVip={guest.is_vip}
              isFavorite={guest.is_favorite}
            />
          </div>
        </SheetHeader>

        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-[var(--shell-border)] px-4 py-3">
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
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-[var(--ds-duration-slow)] ease-out",
                      active
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-[var(--shell-nav-hover-bg)] text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
                    )}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {tab === "profile" ? (
              <div className="space-y-6">
                <GuestProfileCard
                  guest={guest}
                  actions={
                    <GuestProfileActions
                      guest={guest}
                      candidates={candidates}
                    />
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

            {tab === "payments" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="Payments unavailable"
                  description="Payment history will appear here once a payment integration is connected."
                  icon={<CreditCard size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "notes" ? (
              <DashboardSurface className="p-6">
                {guest.notes ? (
                  <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--shell-text)]">
                    {guest.notes}
                  </p>
                ) : (
                  <DashboardEmptyState
                    title="No notes yet"
                    description="Add a note to the guest profile so the team can see important context."
                    icon={<FileText size={20} />}
                  />
                )}
              </DashboardSurface>
            ) : null}

            {tab === "preferences" ? (
              <DashboardSurface className="p-6">
                {guest.tags.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[13px] text-[var(--shell-muted)]">
                      Guest tags and preferences
                    </p>
                    <GuestTags tags={guest.tags} />
                  </div>
                ) : (
                  <DashboardEmptyState
                    title="No preferences set"
                    description="Add tags to the guest record to track preferences."
                    icon={<Settings2 size={20} />}
                  />
                )}
              </DashboardSurface>
            ) : null}

            {tab === "ai" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="AI summary unavailable"
                  description="When the AI assistant analyzes the guest history, a brief summary will appear here."
                  icon={<Bot size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "documents" ? (
              <DashboardSurface>
                <DashboardEmptyState
                  title="No documents"
                  description="Uploaded guest documents will be displayed in this section."
                  icon={<FileText size={20} />}
                />
              </DashboardSurface>
            ) : null}

            {tab === "timeline" ? (
              <div className="space-y-3">
                {timeline.length === 0 ? (
                  <DashboardSurface>
                    <DashboardEmptyState
                      title="Timeline is empty"
                      description="Events will appear after bookings and profile updates."
                      icon={<Sparkles size={20} />}
                    />
                  </DashboardSurface>
                ) : (
                  timeline.map((item) => (
                    <DashboardSurface
                      key={item.id}
                      className="p-4 transition-all duration-[var(--ds-duration-slow)] ease-out hover:-translate-y-0.5 hover:shadow-[var(--shell-shadow-md)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[14px] font-medium text-[var(--shell-text)]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[13px] text-[var(--shell-muted)]">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] text-[var(--shell-muted)]">
                          {formatGuestDateTime(item.at)}
                        </span>
                      </div>
                    </DashboardSurface>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
