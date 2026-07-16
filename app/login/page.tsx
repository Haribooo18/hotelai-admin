import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/tenant/context";

import { LoginPageContent } from "@/components/auth/LoginPageContent";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = (await searchParams) ?? {};
  const redirectedFromParam = params.redirectedFrom;
  const redirectedFrom = Array.isArray(redirectedFromParam)
    ? redirectedFromParam[0]
    : redirectedFromParam;

  return <LoginPageContent redirectedFrom={redirectedFrom} />;
}
