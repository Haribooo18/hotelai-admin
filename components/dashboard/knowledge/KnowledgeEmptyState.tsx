import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";

type Props = {
  onCreate?: () => void;
};

export function KnowledgeEmptyState({ onCreate }: Props) {
  return (
    <div className="rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/80 p-6 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl">
      <DashboardEmptyState
        title="База знаний пуста"
        description="Создайте статьи с ответами на частые вопросы — AI-ресепшен будет использовать их при общении с гостями."
        icon={<BookOpen size={20} />}
        action={
          onCreate ? (
            <Button size="sm" onClick={onCreate}>
              Создать статью
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
