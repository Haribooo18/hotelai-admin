import { redirect } from "next/navigation";
import { Hotel } from "lucide-react";

import { getCurrentUser } from "@/lib/tenant";

import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = (await searchParams) ?? {};
  const redirectedFromParam = params.redirectedFrom;
  const redirectedFrom = Array.isArray(redirectedFromParam)
    ? redirectedFromParam[0]
    : redirectedFromParam;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
            <Hotel className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold">HotelAI</h1>

          <p className="mt-2 text-sm text-zinc-500">
            Войдите в панель управления отелем
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <LoginForm redirectedFrom={redirectedFrom} />
        </div>
      </div>
    </div>
  );
}
