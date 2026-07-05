import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  return (
    <main className={cn("min-h-0 flex-1 overflow-y-auto", className)}>
      <div className="ds-page-enter mx-auto w-full max-w-[1440px] px-5 py-5 lg:px-6 lg:py-6">
        {children}
      </div>
    </main>
  );
}
