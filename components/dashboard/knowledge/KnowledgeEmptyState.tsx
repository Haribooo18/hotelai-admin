import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/core/Button";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";

type Props = {
  onCreate?: () => void;
};

export function KnowledgeEmptyState({ onCreate }: Props) {
  return (
    <GlassSurface className="p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)]">
      <EmptyState
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
    </GlassSurface>
  );
}
