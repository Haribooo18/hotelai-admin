"use client";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatTranslation, useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("knowledge.deleteDialogTitle")}
      description={
        article
          ? formatTranslation(t("knowledge.deleteDialogDescWithTitle"), {
              title: article.title,
            })
          : undefined
      }
      confirmLabel={t("common.delete")}
      onConfirm={onConfirm}
      loading={pending}
      destructive
    />
  );
}
