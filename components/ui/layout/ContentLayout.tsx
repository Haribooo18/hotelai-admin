import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContentLayoutProps = HTMLAttributes<HTMLElement> & {
  maxWidth?: string;
  padded?: boolean;
};

export function ContentLayout({
  maxWidth = "1360px",
  padded = true,
  className,
  children,
  ...props
}: ContentLayoutProps) {
  return (
    <main
      id="main-content"
      className={cn("ds-content-canvas min-h-0 flex-1 overflow-y-auto", className)}
      {...props}
    >
      <div
        className={cn(
          "ds-page-enter mx-auto w-full",
          padded &&
            "px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] lg:px-5 lg:py-6"
        )}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </main>
  );
}
