"use client";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Props = {
  article: KnowledgeArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  pending?: boolean;
};

export function KnowledgeDeleteDialog({
  article,
  open,
  onOpenChange,
  onConfirm,
  pending,
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete article?"
      description={
        article
          ? `"${article.title}" will be moved to trash. The AI receptionist will stop using this article.`
          : undefined
      }
      confirmLabel="Delete"
      onConfirm={onConfirm}
      loading={pending}
      destructive
    />
  );
}
