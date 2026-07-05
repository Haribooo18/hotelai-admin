"use client";

import { useActionState } from "react";

import { signIn, type SignInState } from "@/lib/services/auth.mutations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  redirectedFrom?: string;
};

const initialState: SignInState = {};

export function LoginForm({ redirectedFrom }: Props) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectedFrom" value={redirectedFrom ?? ""} />

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-[var(--shell-muted)]">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@hotel.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-[var(--shell-muted)]">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
