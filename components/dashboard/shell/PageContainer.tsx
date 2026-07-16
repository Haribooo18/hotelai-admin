"use client";

import type { ReactNode } from "react";

import { PageTransition } from "@/components/motion/PageTransition";
import { PageTransitionProvider } from "@/components/motion/PageTransitionProvider";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  return (
    <main
      id="main-content"
      className={cn(
        "ds-content-canvas flex min-h-0 flex-1 flex-col overflow-hidden",
        className
      )}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[1360px] flex-1 flex-col overflow-hidden px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] lg:px-5 lg:py-6">
        <PageTransitionProvider>
          <PageTransition>{children}</PageTransition>
        </PageTransitionProvider>
      </div>
    </main>
  );
}
