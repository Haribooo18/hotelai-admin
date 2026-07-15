"use client";

import {
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MessageSquare,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  MockupBadge,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import {
  formatMockRevenue,
  useMockHotelRuntime,
} from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
  "Maria Thompson",
  "Daniel Cooper",
  "Sofia Alvarez",
  "Noah Williams",
] as const;

const AUTOMATION_STEPS = [
  {
    label: "Policy matched",
    detail: "Early check-in policy",
    icon: Sparkles,
  },
  {
    label: "Availability checked",
    detail: "Room readiness confirmed",
    icon: Clock3,
  },
  {
    label: "Reservation updated",
    detail: "PMS synchronized",
    icon: CheckCircle2,
  },
] as const;

function ConversationItem({
  name,
  time,
  preview,
  active,
}: {
  name: string;
  time: string;
  preview: string;
  active: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-[11px] border p-3 transition-[border-color,background-color,transform] duration-500",
        active
          ? "translate-y-[-1px] border-[#6fa58e]/18 bg-[#6fa58e]/[0.055]"
          : "border-white/[0.04] bg-black/[0.045]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-medium text-[#d0d4d7]">
          {name}
        </p>
        <span className="shrink-0 text-[8px] text-[#606872]">{time}</span>
      </div>

      <p className="mt-1 truncate text-[8.5px] text-[#707883]">{preview}</p>
    </article>
  );
}

function ContextRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[8px] uppercase tracking-[0.1em] text-[#626a73]">
        {label}
      </span>
      <span className="truncate text-right text-[9px] font-medium text-[#c9cdd1]">
        {value}
      </span>
    </div>
  );
}

export function ReceptionAiMockup() {
  const runtime = useMockHotelRuntime();

  const revenueImpact =
    runtime.event.amount === undefined
      ? "+$38"
      : `+${formatMockRevenue(runtime.event.amount)}`;

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(23,59,50,0.24),transparent_38%),radial-gradient(circle_at_18%_100%,rgba(200,162,90,0.055),transparent_40%)]" />

      <div className="relative grid h-full grid-cols-[180px_minmax(0,1fr)_190px]">
        <aside className="border-r border-white/[0.035] bg-[#0b0f13]/92 p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-[#d8b66f]/16 bg-[#d8b66f]/10 text-[#d8b66f]">
              <Bot size={12} strokeWidth={1.6} aria-hidden />
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[-0.02em]">
                Reception AI
              </p>
              <p className="mt-0.5 text-[8px] text-[#68717a]">
                {runtime.hotel.name}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#646c75]">
              Conversations
            </p>
            <MockupBadge tone="green">4 active</MockupBadge>
          </div>

          <div className="mt-3 space-y-2">
            {CONVERSATIONS.map((name, index) => {
              const active = name === runtime.guest.name;

              return (
                <ConversationItem
                  key={name}
                  name={name}
                  time={active ? "Now" : `${index * 4 + 2}m`}
                  preview={
                    active ? runtime.event.title : "Reservation updated"
                  }
                  active={active}
                />
              );
            })}
          </div>
        </aside>

        <main className="flex min-w-0 flex-col border-r border-white/[0.035]">
          <header className="flex h-11 items-center justify-between border-b border-white/[0.035] px-4">
            <div>
              <p className="text-[11px] font-semibold">
                {runtime.guest.name}
              </p>
              <p className="mt-0.5 text-[8.5px] text-[#69717a]">
                {runtime.guest.channel} · {runtime.guest.room}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MockupBadge tone="green">
                {runtime.ai.statusLabel}
              </MockupBadge>
              <span className="text-[8px] text-[#626a73]">
                {runtime.ai.actionLabel}
              </span>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden p-4">
            <div className="mx-auto flex h-full max-w-[720px] flex-col">
              <div key={`chat-${runtime.event.id}`} className="mku-chat-swap space-y-3">
                <div className="ml-auto max-w-[68%] rounded-[14px_14px_4px_14px] border border-white/[0.05] bg-white/[0.03] p-3 text-[10px] leading-relaxed text-[#cdd1d5]">
                  Hi, can I check in early tomorrow?
                </div>

                <div className="max-w-[78%] rounded-[14px_14px_14px_4px] border border-[#6fa58e]/14 bg-[#6fa58e]/[0.05] p-3">
                  <div className="flex items-center gap-1.5 text-[8.5px] text-[#7eae99]">
                    <Bot size={10} strokeWidth={1.6} aria-hidden />
                    Monavel AI
                  </div>

                  <p className="mt-1.5 text-[10px] leading-relaxed text-[#cdd1d5]">
                    Your room is expected to be ready from 12:00. I can
                    guarantee early access for $38.
                  </p>
                </div>

                <div className="ml-auto max-w-[56%] rounded-[14px_14px_4px_14px] border border-white/[0.05] bg-white/[0.03] p-3 text-[10px] text-[#cdd1d5]">
                  Yes, please add it.
                </div>
              </div>

              <MockupPanel key={`automation-${runtime.event.id}`} className="mku-runtime-swap mt-3.5 p-3.5" active>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-medium text-[#d7bc7d]">
                      <WandSparkles
                        size={11}
                        strokeWidth={1.6}
                        aria-hidden
                      />
                      Completed automatically
                    </div>

                    <p className="mt-1.5 text-[8.5px] leading-relaxed text-[#818891]">
                      {runtime.ai.actionDetail}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-[#626a73]">
                      Revenue
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#d8b66f]">
                      {revenueImpact}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {AUTOMATION_STEPS.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className="rounded-[10px] border border-white/[0.04] bg-black/[0.045] p-2.5"
                      >
                        <Icon
                          size={10}
                          strokeWidth={1.6}
                          className="text-[#7eae99]"
                          aria-hidden
                        />
                        <p className="mt-1.5 text-[8.5px] font-medium text-[#c7cbd0]">
                          {step.label}
                        </p>
                        <p className="mt-1 text-[7.5px] leading-relaxed text-[#626a73]">
                          {step.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </MockupPanel>

              <div className="mt-auto flex h-10 items-center gap-2 rounded-[11px] border border-white/[0.05] bg-white/[0.02] px-3 text-[9px] text-[#626a73]">
                <MessageSquare size={11} strokeWidth={1.6} aria-hidden />
                Reply as hotel...
                <span className="ml-auto text-[8px] text-[#4f5660]">
                  AI draft ready
                </span>
                <Send size={11} className="text-[#d8b66f]" aria-hidden />
              </div>
            </div>
          </div>
        </main>

        <aside className="p-3.5">
          <MockupSectionHeader
            eyebrow="Live context"
            title="Guest intelligence"
            trailing={<Sparkles size={11} className="text-[#d8b66f]" />}
          />

          <div className="mt-3.5 divide-y divide-white/[0.035]">
            <ContextRow
              label="Reservation"
              value={`#${runtime.guest.reservation}`}
            />
            <ContextRow label="Room" value={runtime.guest.room} />
            <ContextRow label="Channel" value={runtime.guest.channel} />
            <ContextRow label="Preference" value="Late checkout" />
          </div>

          <MockupPanel className="mt-3.5 p-3">
            <div className="flex items-center gap-2 text-[8.5px] font-medium text-[#8fc0aa]">
              <CheckCircle2 size={10} strokeWidth={1.6} aria-hidden />
              Knowledge matched
            </div>

            <p className="mt-1.5 text-[8px] leading-relaxed text-[#737b84]">
              Early check-in policy · Revenue rules · Room readiness
            </p>
          </MockupPanel>

          <MockupPanel className="mt-3 p-3">
            <div className="flex items-center gap-2 text-[8.5px] font-medium text-[#d7bc7d]">
              <CircleDollarSign size={10} strokeWidth={1.6} aria-hidden />
              Upsell opportunity
            </div>

            <p className="mt-1.5 text-[8px] leading-relaxed text-[#737b84]">
              High likelihood to accept breakfast and late checkout offers.
            </p>
          </MockupPanel>
        </aside>
      </div>
    </div>
  );
}
