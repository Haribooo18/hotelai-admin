import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  return (
    <main className="flex-1 bg-[var(--shell-bg)]">
      <div
        className={cn(
          "mx-auto w-full max-w-[1440px] px-6 py-8 transition-opacity duration-200 ease-out lg:px-10 lg:py-10",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}
