"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GuestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-red-400" />

      <h2 className="text-xl font-semibold">Не удалось загрузить гостей</h2>

      <p className="max-w-md text-sm text-zinc-500">
        Произошла ошибка при загрузке данных. Попробуйте обновить страницу.
      </p>

      <Button onClick={reset}>Повторить</Button>
    </div>
  );
}
