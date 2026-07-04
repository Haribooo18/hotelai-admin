"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
};

export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectedFrom = String(formData.get("redirectedFrom") ?? "");

  if (!email || !password) {
    return { error: "Введите email и пароль" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in failed:", error.message);
    return { error: "Неверный email или пароль" };
  }

  const destination =
    redirectedFrom && redirectedFrom.startsWith("/") ? redirectedFrom : "/";

  redirect(destination);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
