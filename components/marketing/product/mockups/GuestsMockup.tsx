"use client";

import {
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import {
  MockupBadge,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import { useMockHotelRuntime } from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const GUESTS = [
  {
    name: "Maria Thompson",
    email: "maria@example.com",
    value: "$3,280",
    stays: 4,
    vip: true,
  },
  {
    name: "Daniel Cooper",
    email: "daniel@example.com",
    value: "$2,110",
    stays: 2,
    vip: false,
  },
  {
    name: "Sofia Alvarez",
    email: "sofia@example.com",
    value: "$840",
    stays: 1,
    vip: false,
  },
  {
    name: "Noah Williams",
    email: "noah@example.com",
    value: "$5,460",
    stays: 6,
    vip: true,
  },
] as const;

export function GuestsMockup() {
  const runtime = useMockHotelRuntime();

  const activeGuest = GUESTS.find(
    (guest) => guest.name === runtime.guest.name
  );

  return (
    <div
      data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.05),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Guest intelligence</p>

            <p className="mt-0.5 text-[8px] text-[#69717a]">
              Unified profiles, preferences, and lifetime value
            </p>
          </div>

          <div className="flex h-7 w-44 items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 text-[8px] text-[#626a73]">
            <Search size={11} aria-hidden />
            Search guests
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[0.85fr_1.15fr] gap-4 p-4.5">
          <MockupPanel className="p-4">
            <MockupSectionHeader
              eyebrow="Directory"
              title="High-value guests"
              trailing={
                <MockupBadge tone="gold">1,284 profiles</MockupBadge>
              }
            />

            <div className="mt-3.5 space-y-2">
              {GUESTS.map((guest) => {
                const active = guest.name === runtime.guest.name;

                return (
                  <article
                    key={guest.name}
                    className={cn(
                      "flex items-center gap-3 rounded-[12px] border p-3",
                      active
                        ? "border-[#6fa58e]/18 bg-[#6fa58e]/[0.055]"
                        : "border-white/[0.045] bg-black/[0.055]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                        active
                          ? "border-[#6fa58e]/18 bg-[#6fa58e]/10 text-[#7eae99]"
                          : "border-white/[0.06] bg-white/[0.025] text-[#737b84]"
                      )}
                    >
                      <UserRound size={12} aria-hidden />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[9.5px] font-medium text-[#cfd3d7]">
                          {guest.name}
                        </p>

                        {guest.vip ? (
                          <Star
                            size={9}
                            fill="currentColor"
                            className="text-[#d8b66f]"
                            aria-hidden
                          />
                        ) : null}
                      </div>

                      <p className="mt-0.5 truncate text-[8px] text-[#68717a]">
                        {guest.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-medium text-[#d8b66f]">
                        {guest.value}
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#68717a]">
                        {guest.stays} stays
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </MockupPanel>

          <div className="space-y-4">
            <MockupPanel className="p-4">
              <MockupSectionHeader
                eyebrow="Live profile"
                title={runtime.guest.name}
                trailing={
                  <MockupBadge
                    tone={
                      runtime.booking.status === "Checked in"
                        ? "green"
                        : "gold"
                    }
                  >
                    {runtime.booking.status}
                  </MockupBadge>
                }
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Reservation", `#${runtime.guest.reservation}`],
                  ["Room", runtime.guest.room],
                  ["Channel", runtime.guest.channel],
                  ["Preference", "Quiet upper floor"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[11px] border border-white/[0.045] bg-black/[0.055] p-3"
                  >
                    <p className="text-[8px] uppercase tracking-[0.1em] text-[#626a73]">
                      {label}
                    </p>

                    <p className="mt-1.5 text-[9.5px] font-medium text-[#c7cbd0]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </MockupPanel>

            <MockupPanel
              key={runtime.event.id}
              className="mku-runtime-swap p-4"
              active
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-medium text-[#d7bc7d]">
                    <Sparkles size={11} aria-hidden />
                    AI guest summary
                  </div>

                  <p className="mt-2 text-[9px] leading-relaxed text-[#858d96]">
                    Prefers WhatsApp, upper floors, and late checkout. High
                    likelihood to accept breakfast and transfer upgrades.
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[8px] uppercase tracking-[0.1em] text-[#626a73]">
                    Value
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[#d8b66f]">
                    {activeGuest?.value ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex h-7 items-center gap-1.5 rounded-[9px] border border-[#d8b66f]/16 bg-[#d8b66f]/10 px-3 text-[8px] text-[#dec27f]"
                >
                  <Mail size={10} aria-hidden />
                  Contact
                </button>

                <button
                  type="button"
                  className="flex h-7 items-center gap-1.5 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-3 text-[8px] text-[#8b939c]"
                >
                  <MessageSquare size={10} aria-hidden />
                  Conversation
                </button>
              </div>
            </MockupPanel>
          </div>
        </div>
      </div>
    </div>
  );
}