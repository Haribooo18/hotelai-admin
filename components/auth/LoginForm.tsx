"use client";

import { useActionState } from "react";

import { signIn, type SignInState } from "@/lib/services/auth.mutations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError, FormField } from "@/components/ui/core/FormField";
import { formStackClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";

type Props = {
  redirectedFrom?: string;
};

const initialState: SignInState = {};

export function LoginForm({ redirectedFrom }: Props) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className={formStackClass}>
      <input type="hidden" name="redirectedFrom" value={redirectedFrom ?? ""} />

      <FormField label={t("login.email")} htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@hotel.com"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField label={t("login.password")} htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </FormField>

      {state.error ? <FormError>{state.error}</FormError> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t("login.signingIn") : t("login.signIn")}
      </Button>
    </form>
  );
}
