import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

type AvatarGroupItem = {
  key: string;
  src?: string | null;
  alt?: string;
  fallback: ReactNode;
};

type AvatarGroupProps = {
  items: AvatarGroupItem[];
  max?: number;
  className?: string;
  sizeClassName?: string;
};

export function AvatarGroup({
  items,
  max = 4,
  className,
  sizeClassName = "size-9",
}: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((item, index) => (
        <Avatar
          key={item.key}
          className={cn(
            sizeClassName,
            index > 0 && "-ml-2 ring-2 ring-[var(--shell-surface)]"
          )}
        >
          {item.src ? <AvatarImage src={item.src} alt={item.alt ?? ""} /> : null}
          <AvatarFallback>{item.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 ? (
        <Avatar className={cn(sizeClassName, "-ml-2 ring-2 ring-[var(--shell-surface)]")}>
          <AvatarFallback>+{overflow}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
