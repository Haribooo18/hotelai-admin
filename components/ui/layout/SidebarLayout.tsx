import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SidebarLayoutProps = HTMLAttributes<HTMLDivElement> & {
  sidebar: ReactNode;
  sidebarWidth?: string;
};

export function SidebarLayout({
  sidebar,
  sidebarWidth = "var(--shell-sidebar-width)",
  className,
  children,
  ...props
}: SidebarLayoutProps) {
  return (
    <div className={cn("relative min-h-0", className)} {...props}>
      <div
        className="fixed inset-y-0 left-0 z-30 hidden lg:block"
        style={{ width: sidebarWidth }}
      >
        {sidebar}
      </div>
      <div
        className="min-w-0"
        style={{ paddingLeft: `max(0px, calc(${sidebarWidth} * 0))` }}
      >
        <div className="lg:pl-[var(--shell-sidebar-width)]">{children}</div>
      </div>
    </div>
  );
}
