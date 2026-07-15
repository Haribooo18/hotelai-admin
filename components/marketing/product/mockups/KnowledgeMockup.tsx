"use client";

import { BookOpen, CheckCircle2, FileText, Search, Sparkles } from "lucide-react";

import {
  MockupBadge,
  MockupMetric,
  MockupPanel,
  MockupSectionHeader,
} from "@/components/marketing/product/mockups/MockupPrimitives";
import { useMockHotelRuntime } from "@/lib/marketing/mock-hotel-runtime";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { title: "Early check-in policy", category: "Front desk", status: "Synced" },
  { title: "Late checkout pricing", category: "Revenue", status: "Synced" },
  { title: "Breakfast and dining hours", category: "Guest services", status: "Synced" },
  { title: "Airport transfer instructions", category: "Concierge", status: "Review" },
  { title: "Pet policy", category: "Hotel policy", status: "Synced" },
] as const;

export function KnowledgeMockup() {
  const runtime = useMockHotelRuntime();
  const activeTitle = runtime.knowledge.activeArticle;
  const articles = ARTICLES.some((article) => article.title === activeTitle)
    ? ARTICLES
    : [
        {
          title: activeTitle,
          category: "Live operational knowledge",
          status: "Synced",
        },
        ...ARTICLES,
      ];

  return (
    <div data-runtime-tick={runtime.tick}
      data-runtime-phase={runtime.phase}
      className="mku-runtime-root relative h-full min-h-[420px] w-full overflow-hidden bg-[#090c10] text-[#eae7df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(200,162,90,0.05),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(11,31,27,0.18),transparent_42%)]" />

      <div className="relative flex h-full flex-col">
        <header className="flex h-11 items-center justify-between border-b border-white/[0.04] bg-[#0d1116]/76 px-5">
          <div>
            <p className="text-[12.5px] font-semibold">Knowledge hub</p>
            <p className="mt-0.5 text-[8px] text-[#69717a]">{runtime.hotel.name} · AI-ready operational knowledge</p>
          </div>
          <div className="flex h-7 w-44 items-center gap-2 rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 text-[8px] text-[#626a73]">
            <Search size={11} aria-hidden />
            Search knowledge
          </div>
        </header>

        <div className="min-h-0 flex-1 p-4.5">
          <div className="grid grid-cols-3 gap-3">
            <MockupMetric motionKey={runtime.tick} label="Sources" value="98" delta="All connected" icon={BookOpen} tone="gold" />
            <MockupMetric motionKey={runtime.tick} label="Indexed" value="96" delta="2 reviewing" icon={CheckCircle2} tone="green" />
            <MockupMetric motionKey={runtime.tick} label="Used today" value="34" delta="AI answers" icon={Sparkles} tone="gold" />
          </div>

          <div className="mt-3.5 grid grid-cols-[0.85fr_1.15fr] gap-4">
            <MockupPanel className="p-4">
              <MockupSectionHeader eyebrow="Library" title="Operational knowledge" trailing={<MockupBadge tone="green">Synced</MockupBadge>} />
              <div className="mt-3 space-y-2">
                {articles.map((article) => {
                  const active = article.title === activeTitle;
                  return (
                    <article key={article.title} className={cn("rounded-[11px] border p-3", active ? "border-[#6fa58e]/18 bg-[#6fa58e]/[0.055]" : "border-white/[0.045] bg-black/[0.055]")}>
                      <div className="flex items-start gap-2.5">
                        <FileText size={11} className={active ? "text-[#7eae99]" : "text-[#747d87]"} aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[9.5px] font-medium text-[#cfd3d7]">{article.title}</p>
                          <p className="mt-1 text-[8px] text-[#68717a]">{article.category}</p>
                        </div>
                        <span className={cn("text-[8px]", article.status === "Synced" ? "text-[#7eae99]" : "text-[#d8b66f]")}>{article.status}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </MockupPanel>

            <div className="space-y-4">
              <MockupPanel className="p-4">
                <MockupSectionHeader eyebrow="Live article" title={activeTitle} trailing={<MockupBadge tone={runtime.knowledge.matched ? "green" : "neutral"}>
                  {runtime.knowledge.usedJustNow ? "Used just now" : runtime.knowledge.matched ? "AI used" : "Indexed"}
                </MockupBadge>} />
                <div className="mt-4 space-y-3 text-[9px] leading-relaxed text-[#949ba3]">
                  <p>Guests may request early check-in from 11:00. Approval depends on room readiness and current occupancy.</p>
                  <p>Monavel AI may offer a paid guaranteed early arrival when availability is limited.</p>
                </div>
              </MockupPanel>

              <MockupPanel key={runtime.event.id} className="mku-runtime-swap p-4" active>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-medium text-[#8fc0aa]">
                      <Sparkles size={11} aria-hidden />
                      Applied by AI
                    </div>
                    <p className="mt-2 text-[8.5px] leading-relaxed text-[#7f8790]">
                      Used for {runtime.guest.name} via {runtime.guest.channel}. Reservation #{runtime.guest.reservation} updated automatically.
                    </p>
                  </div>
                  <MockupBadge tone="gold">2 min ago</MockupBadge>
                </div>
              </MockupPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
