import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  return (
    <main
      id="main-content"
      className={cn("ds-content-canvas min-h-0 flex-1 overflow-y-auto", className)}
    >
      <div className="ds-page-enter mx-auto w-full max-w-[1360px] px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] lg:px-5 lg:py-6">
        {children}
      </div>
    </main>
  );
}
