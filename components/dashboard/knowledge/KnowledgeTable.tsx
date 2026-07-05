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
          article.is_pinned ? "Article unpinned" : "Article pinned"
        );
        router.refresh();
      } catch {
        toast.error("Failed to change pin status");
      }
    });
  }

  function handleDuplicate(article: KnowledgeArticle) {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(article.id);
        toast.success("Copy created");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Failed to duplicate article");
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
        toast.success("Article deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete article");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  const columns: DataTableColumn<KnowledgeArticle>[] = [
    {
      header: "Title",
      cell: (a) => (
        <div className="min-w-0">
          <Link
            href={`/knowledge/${a.id}`}
            className="font-medium text-[var(--shell-text)] hover:underline"
          >
            {a.title}
          </Link>
          {a.category && (
            <p className="mt-0.5 text-xs text-[var(--shell-muted)]">{a.category}</p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (a) => <KnowledgeStatusBadge status={a.status} />,
    },
    {
      header: "Language",
      cell: (a) => (
        <span className="text-xs uppercase text-[var(--shell-muted)]">{a.language}</span>
      ),
    },
    {
      header: "Version",
      cell: (a) => <span className="text-[var(--shell-muted)]">v{a.version}</span>,
    },
    {
      header: "Updated",
      cell: (a) => (
        <span className="text-xs text-[var(--shell-muted)]">
          {new Date(a.updated_at).toLocaleDateString("en-US")}
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
            className="rounded p-1.5 text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-amber-400"
            aria-label={a.is_pinned ? "Unpin" : "Pin"}
            onClick={() => togglePin(a)}
            disabled={pending}
          >
            <Pin size={14} className={a.is_pinned ? "fill-amber-400 text-amber-400" : ""} />
          </button>
          <Link
            href={`/knowledge/${a.id}`}
            className="rounded p-1.5 text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
            aria-label="Edit"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            className="rounded p-1.5 text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
            aria-label="Duplicate"
            onClick={() => handleDuplicate(a)}
            disabled={pending}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-red-400"
            aria-label="Delete"
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
        caption="Knowledge base articles"
        empty={<p className="text-center text-sm text-[var(--shell-muted)]">No articles found</p>}
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
