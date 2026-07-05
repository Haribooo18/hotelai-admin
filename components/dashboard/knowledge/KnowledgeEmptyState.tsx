import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onCreate?: () => void;
};

export function KnowledgeEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--shell-border)] bg-[var(--shell-surface)] px-6 py-16 text-center">
      <BookOpen className="mb-4 text-[var(--shell-muted)]" size={40} />
      <h3 className="text-lg font-semibold">Knowledge base is empty</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--shell-muted)]">
        Create articles with answers to common questions — the AI receptionist
        will use them when talking to guests.
      </p>
      {onCreate && (
        <Button className="mt-6" onClick={onCreate}>
          Create article
        </Button>
      )}
    </div>
  );
}
