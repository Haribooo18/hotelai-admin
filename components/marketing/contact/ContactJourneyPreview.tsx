import {
  ArrowDown,
  Building2,
  CheckCircle2,
  Compass,
  Presentation,
  Rocket,
} from "lucide-react";

import { CONTACT_PAGE_JOURNEY } from "@/lib/marketing/contact-page";

const ICONS = [Building2, Compass, Presentation, Rocket] as const;

export function ContactJourneyPreview() {
  return (
    <div
      className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0b0f13] shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
      role="img"
      aria-label="From hotel discovery to Monavel launch"
    >
      <div className="flex h-11 items-center border-b border-white/[0.06] bg-white/[0.016] px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#9e5b55]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b89354]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#5d8276]" />
        </div>
        <div className="mx-auto rounded-full border border-white/[0.055] bg-black/20 px-5 py-1.5 text-[10px] text-white/38">
          monavel.app/contact
        </div>
        <div className="w-[42px]" aria-hidden="true" />
      </div>

      <div className="relative overflow-hidden p-5 md:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-75"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 72% 12%, rgba(210,173,96,0.09), transparent 36%), radial-gradient(circle at 12% 92%, rgba(63,116,96,0.1), transparent 42%)",
          }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7b86c]">
                Your path to Monavel
              </p>
              <h2 className="mt-2.5 max-w-[16em] text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#eeeae2]">
                One clear next step for your hotel.
              </h2>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#6fa58e]/20 bg-[#6fa58e]/10 px-3 py-1.5 text-[10px] text-[#93c1ad]">
              <CheckCircle2 className="size-3.5" />
              Guided
            </span>
          </div>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {CONTACT_PAGE_JOURNEY.steps.map((step, index) => {
              const Icon = ICONS[index];

              return (
                <li
                  key={step.title}
                  className="relative rounded-[18px] border border-white/[0.06] bg-white/[0.022] p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#d8b66f]/15 bg-[#d8b66f]/10 text-[#d8b66f]">
                      <Icon className="size-4" strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-white/32">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#e7e3dc]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-[1.55] text-white/42">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index < CONTACT_PAGE_JOURNEY.steps.length - 1 ? (
                    <ArrowDown
                      className="absolute -bottom-3 left-1/2 z-10 hidden size-4 -translate-x-1/2 text-[#d8b66f]/40 sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.05] pt-4 text-[10px] text-white/38">
            {CONTACT_PAGE_JOURNEY.meta.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#d8b66f]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
