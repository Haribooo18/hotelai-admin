"use client";

import { Button } from "@/components/ui/core/Button";
import { ErrorState } from "@/components/ui/feedback/ErrorState";

type Props = {
  message?: string;
  reset?: () => void;
};

export function KnowledgeError({
  message = "Не удалось загрузить базу знаний",
  reset,
}: Props) {
  return (
    <ErrorState
      title={message}
      description="Проверьте подключение и попробуйте снова."
      action={
        reset ? (
          <Button variant="outline" size="sm" onClick={reset}>
            Повторить
          </Button>
        ) : undefined
      }
    />
  );
}
