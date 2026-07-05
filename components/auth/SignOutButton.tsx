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
        "flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50",
        className
      )}
      aria-label="Sign out"
    >
      {showIcon ? <LogOut size={16} /> : null}
      <span>{pending ? "Signing out..." : label}</span>
    </button>
  );
}
