"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/services/auth.mutations";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
      aria-label="Выйти"
    >
      <LogOut size={16} />
      <span>{pending ? "Выход..." : "Выйти"}</span>
    </button>
  );
}
