import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type WorkspaceProps = HTMLAttributes<HTMLDivElement> & {
  sidebar?: ReactNode;
  topbar?: ReactNode;
};

export function Workspace({
  sidebar,
  topbar,
  className,
  children,
  ...props
}: WorkspaceProps) {
  return (
    <div
      className={cn(
        "h-svh overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]",
        className
      )}
      {...props}
    >
      {sidebar}
      <div
        className={cn(
          "flex h-svh min-w-0 flex-col overflow-hidden bg-[var(--shell-content)]",
          sidebar && "lg:pl-[var(--shell-sidebar-width)]"
        )}
      >
        {topbar}
        {children}
      </div>
    </div>
  );
}
