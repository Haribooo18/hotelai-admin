"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/services/auth.mutations";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
  showIcon?: boolean;
};

export function SignOutButton({
  className,
  label = "Sign out",
  showIcon = true,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] text-[var(--shell-muted)] transition-colors duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)] disabled:opacity-50",
        className
      )}
      aria-label="Sign out"
    >
      {showIcon ? <LogOut size={14} /> : null}
      <span>{pending ? "Signing out..." : label}</span>
    </button>
  );
}
