import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FEATURE_SECTIONS } from "@/lib/marketing/content";

export function FeaturesOverview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Возможности Monavel</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Полный набор инструментов для AI-ресепшна и управления отелем — от
        каналов связи до аналитики и биллинга.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {FEATURE_SECTIONS.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{section.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex gap-4">
        <Button render={<Link href="/settings?tab=billing" />}>
          Начать пробный период
        </Button>
        <Button
          variant="outline"
          render={<a href="mailto:hello@monavel.app?subject=Monavel Demo" />}
        >
          Записаться на демо
        </Button>
      </div>
    </div>
  );
}
