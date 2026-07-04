import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onCreate?: () => void;
};

export function KnowledgeEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 px-6 py-16 text-center">
      <BookOpen className="mb-4 text-zinc-600" size={40} />
      <h3 className="text-lg font-semibold">База знаний пуста</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        Создайте статьи с ответами на частые вопросы — AI-ресепшн будет
        использовать их при общении с гостями.
      </p>
      {onCreate && (
        <Button className="mt-6" onClick={onCreate}>
          Создать статью
        </Button>
      )}
    </div>
  );
}
