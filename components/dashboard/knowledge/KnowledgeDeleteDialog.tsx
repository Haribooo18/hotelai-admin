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
      title="Удалить статью?"
      description={
        article
          ? `«${article.title}» будет перемещена в корзину. AI-ресепшн перестанет использовать эту статью.`
          : undefined
      }
      confirmLabel="Удалить"
      onConfirm={onConfirm}
      loading={pending}
      destructive
    />
  );
}
