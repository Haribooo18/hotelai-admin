"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
};

const APP_ORIGIN = "https://monavel.internal";

export function resolvePostSignInDestination(value: string): string {
  const candidate = value.trim();

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return "/dashboard";
  }

  try {
    const url = new URL(candidate, APP_ORIGIN);
    if (url.origin !== APP_ORIGIN) return "/dashboard";

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/dashboard";
  }
}

export async function signIn(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectedFrom = String(formData.get("redirectedFrom") ?? "");

  if (!email || !password) {
    return { error: "Enter email and password" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in failed:", error.message);
    return { error: "Invalid email or password" };
  }

  redirect(resolvePostSignInDestination(redirectedFrom));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
