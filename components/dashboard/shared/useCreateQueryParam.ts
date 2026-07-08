"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  CREATE_QUERY_PARAM,
  CREATE_QUERY_VALUE,
} from "@/lib/dashboard/create-actions";

export function useCreateQueryParam(onOpen: () => void) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get(CREATE_QUERY_PARAM) !== CREATE_QUERY_VALUE) return;

    onOpen();

    const next = new URLSearchParams(searchParams.toString());
    next.delete(CREATE_QUERY_PARAM);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, onOpen]);
}
