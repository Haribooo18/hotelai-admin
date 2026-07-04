"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pin, Search } from "lucide-react";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import { Input } from "@/components/ui/input";

type Props = {
  articles: KnowledgeArticle[];
};

export function KnowledgePanel({ articles }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return articles;

    return articles.filter((a) => {
      const haystack = [a.title, a.content, a.category ?? "", ...a.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, search]);

  const pinned = filtered.filter((a) => a.is_pinned);
  const recent = filtered.filter((a) => !a.is_pinned).slice(0, 8);

  return (
    <aside
      className="hidden w-72 shrink-0 flex-col border-l border-zinc-800 bg-zinc-950 xl:flex"
      aria-label="База знаний"
    >
      <div className="border-b border-zinc-800 p-4">
        <h3 className="font-semibold">База знаний</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Статьи для AI-ресепшна
        </p>

        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Поиск статей…"
            aria-label="Поиск статей"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {articles.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Нет опубликованных статей.{" "}
            <Link href="/knowledge" className="text-blue-400 hover:underline">
              Добавить в базе знаний
            </Link>
          </p>
        ) : (
          <div className="space-y-6">
            {pinned.length > 0 && (
              <section>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500">
                  <Pin size={12} />
                  Закреплённые
                </h4>
                <ul className="space-y-2">
                  {pinned.map((article) => (
                    <ArticleItem key={article.id} article={article} pinned />
                  ))}
                </ul>
              </section>
            )}

            {recent.length > 0 && (
              <section>
                <h4 className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
                  Недавние
                </h4>
                <ul className="space-y-2">
                  {recent.map((article) => (
                    <ArticleItem key={article.id} article={article} />
                  ))}
                </ul>
              </section>
            )}

            {filtered.length === 0 && (
              <p className="text-center text-sm text-zinc-500">
                Статьи не найдены
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function ArticleItem({
  article,
  pinned,
}: {
  article: KnowledgeArticle;
  pinned?: boolean;
}) {
  return (
    <li>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition hover:border-zinc-700">
        <div className="flex items-start gap-2">
          {pinned && (
            <Pin size={12} className="mt-0.5 shrink-0 text-amber-500" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{article.title}</p>
            {article.category && (
              <p className="mt-0.5 text-xs text-zinc-500">{article.category}</p>
            )}
            <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
              {article.content}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
