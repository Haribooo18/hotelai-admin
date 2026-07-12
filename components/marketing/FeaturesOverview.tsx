import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { FEATURE_SECTIONS } from "@/lib/marketing/content";
import { cn } from "@/lib/utils";

export function FeaturesOverview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold">Monavel features</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        A complete toolkit for AI reception and hotel operations — from guest
        channels to analytics and billing.
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
        <Link
          href="/settings?tab=billing"
          className={cn(buttonVariants())}
        >
          Start free trial
        </Link>
        <a
          href="mailto:hello@monavel.app?subject=Monavel Demo"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Book a demo
        </a>
      </div>
    </div>
  );
}
