"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Pin, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import {
  duplicateKnowledgeArticle,
  pinKnowledgeArticle,
} from "@/lib/services/knowledge.mutations";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";

import { KnowledgeDeleteDialog } from "./KnowledgeDeleteDialog";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";

type Props = {
  articles: KnowledgeArticle[];
};

export function KnowledgeTable({ articles }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticle | null>(
    null
  );
  const [optimisticArticles, removeOptimistic] = useOptimistic(
    articles,
    (state, id: string) => state.filter((a) => a.id !== id)
  );

  function togglePin(article: KnowledgeArticle) {
    startTransition(async () => {
      try {
        await pinKnowledgeArticle(article.id, !article.is_pinned);
        toast.success(
          article.is_pinned ? "Статья откреплена" : "Статья закреплена"
        );
        router.refresh();
      } catch {
        toast.error("Не удалось изменить закрепление");
      }
    });
  }

  function handleDuplicate(article: KnowledgeArticle) {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(article.id);
        toast.success("Копия создана");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Не удалось дублировать статью");
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startTransition(async () => {
      removeOptimistic(id);
      try {
        const { deleteKnowledgeArticle } = await import(
          "@/lib/services/knowledge.mutations"
        );
        await deleteKnowledgeArticle(id);
        toast.success("Статья удалена");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить статью");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  const columns: DataTableColumn<KnowledgeArticle>[] = [
    {
      header: "Заголовок",
      cell: (a) => (
        <div className="min-w-0">
          <Link
            href={`/knowledge/${a.id}`}
            className="font-medium text-zinc-100 hover:underline"
          >
            {a.title}
          </Link>
          {a.category && (
            <p className="mt-0.5 text-xs text-zinc-500">{a.category}</p>
          )}
        </div>
      ),
    },
    {
      header: "Статус",
      cell: (a) => <KnowledgeStatusBadge status={a.status} />,
    },
    {
      header: "Язык",
      cell: (a) => (
        <span className="text-xs uppercase text-zinc-400">{a.language}</span>
      ),
    },
    {
      header: "Версия",
      cell: (a) => <span className="text-zinc-400">v{a.version}</span>,
    },
    {
      header: "Обновлено",
      cell: (a) => (
        <span className="text-xs text-zinc-500">
          {new Date(a.updated_at).toLocaleDateString("ru-RU")}
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      cell: (a) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400"
            aria-label={a.is_pinned ? "Открепить" : "Закрепить"}
            onClick={() => togglePin(a)}
            disabled={pending}
          >
            <Pin size={14} className={a.is_pinned ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <Link
            href={`/knowledge/${a.id}`}
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Редактировать"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Дублировать"
            onClick={() => handleDuplicate(a)}
            disabled={pending}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
            aria-label="Удалить"
            onClick={() => setDeleteTarget(a)}
            disabled={pending}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={optimisticArticles}
        getRowId={(a) => a.id}
        caption="Статьи базы знаний"
        empty={<p className="text-center text-sm text-zinc-500">Статьи не найдены</p>}
      />

      <KnowledgeDeleteDialog
        article={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
