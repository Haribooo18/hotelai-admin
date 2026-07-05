"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Copy,
  Eye,
  FileText,
  Save,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { KnowledgeArticle } from "@/types/knowledge-article";

import {
  countWords,
  DEFAULT_KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_LANGUAGES,
  KNOWLEDGE_PRIORITIES,
  KNOWLEDGE_PRIORITY_LABELS,
} from "@/lib/knowledge";
import {
  archiveKnowledgeArticle,
  autosaveKnowledgeArticle,
  duplicateKnowledgeArticle,
  publishKnowledgeArticle,
  unpublishKnowledgeArticle,
  updateKnowledgeArticle,
} from "@/lib/services/knowledge.mutations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { KnowledgePreview } from "./KnowledgePreview";
import { KnowledgeStatusBadge } from "./KnowledgeStatusBadge";

type Props = {
  article: KnowledgeArticle;
};

type EditorTab = "edit" | "preview";

const AUTOSAVE_MS = 2000;

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildAutosaveSnapshot(input: {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  priority: KnowledgeArticle["priority"];
  tags: string;
  keywords: string;
}) {
  return JSON.stringify({
    id: input.id,
    title: input.title,
    content: input.content,
    category: input.category,
    language: input.language,
    priority: input.priority,
    tags: parseList(input.tags),
    search_keywords: parseList(input.keywords),
  });
}

export function KnowledgeEditor({ article: initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<EditorTab>("edit");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    buildAutosaveSnapshot({
      id: initial.id,
      title: initial.title,
      content: initial.content,
      category: initial.category ?? "",
      language: initial.language,
      priority: initial.priority,
      tags: initial.tags.join(", "),
      keywords: initial.search_keywords.join(", "),
    })
  );

  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [category, setCategory] = useState(initial.category ?? "");
  const [language, setLanguage] = useState(initial.language);
  const [priority, setPriority] = useState(initial.priority);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [keywords, setKeywords] = useState(
    initial.search_keywords.join(", ")
  );
  const [tagInput, setTagInput] = useState("");

  const wordCount = countWords(content);

  const autosavePayload = useMemo(
    () => ({
      id: initial.id,
      title,
      content,
      category,
      language,
      priority,
      tags: parseList(tags),
      search_keywords: parseList(keywords),
    }),
    [initial.id, title, content, category, language, priority, tags, keywords]
  );

  const snapshot = useMemo(
    () => JSON.stringify(autosavePayload),
    [autosavePayload]
  );

  const isDirty = snapshot !== lastSavedSnapshot;

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          await autosaveKnowledgeArticle(autosavePayload);
          setLastSavedSnapshot(snapshot);
        } catch {
          toast.error("Autosave failed");
        }
      });
    }, AUTOSAVE_MS);

    return () => clearTimeout(timer);
  }, [isDirty, snapshot, autosavePayload, startTransition]);

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    const current = parseList(tags);
    if (!current.includes(t)) {
      setTags([...current, t].join(", "));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(parseList(tags).filter((t) => t !== tag).join(", "));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateKnowledgeArticle({
          id: initial.id,
          title,
          slug: initial.slug ?? "",
          content,
          category,
          language,
          priority,
          status: initial.status,
          is_pinned: initial.is_pinned,
          tags: parseList(tags),
          search_keywords: parseList(keywords),
        });
        toast.success("Article saved");
        router.refresh();
      } catch {
        toast.error("Failed to save");
      }
    });
  }

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishKnowledgeArticle(initial.id);
        toast.success("Article published");
        router.refresh();
      } catch {
        toast.error("Failed to publish");
      }
    });
  }

  function handleUnpublish() {
    startTransition(async () => {
      try {
        await unpublishKnowledgeArticle(initial.id);
        toast.success("Article unpublished");
        router.refresh();
      } catch {
        toast.error("Failed to unpublish");
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      try {
        await archiveKnowledgeArticle(initial.id);
        toast.success("Article archived");
        router.push("/knowledge");
      } catch {
        toast.error("Failed to archive");
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(initial.id);
        toast.success("Copy created");
        router.push(`/knowledge/${id}`);
      } catch {
        toast.error("Failed to duplicate");
      }
    });
  }

  const allCategories = Array.from(
    new Set([
      ...DEFAULT_KNOWLEDGE_CATEGORIES,
      ...(category ? [category] : []),
    ])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/knowledge"
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Back to list"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Article editor</h1>
              <KnowledgeStatusBadge status={initial.status} />
              <span className="text-xs text-zinc-500">v{initial.version}</span>
            </div>
            <p className="text-xs text-zinc-500">
              {pending || isDirty ? "Saving…" : "Saved"} · {wordCount} words
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={pending}>
            <Copy size={14} className="mr-1" />
            Duplicate
          </Button>
          {initial.status === "published" ? (
            <Button variant="outline" size="sm" onClick={handleUnpublish} disabled={pending}>
              <X size={14} className="mr-1" />
              Unpublish
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePublish} disabled={pending}>
              <Upload size={14} className="mr-1" />
              Publish
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleArchive} disabled={pending}>
            <Archive size={14} className="mr-1" />
            Archive
          </Button>
          <Button size="sm" onClick={handleSave} disabled={pending}>
            <Save size={14} className="mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="space-y-2">
            <label htmlFor="kb-edit-title" className="block text-sm text-zinc-400">
              Title
            </label>
            <Input
              id="kb-edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-edit-category" className="block text-sm text-zinc-400">
              Category
            </label>
            <Select
              id="kb-edit-category"
              value={category}
              onChange={setCategory}
              placeholder="No category"
              options={allCategories.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-edit-language" className="block text-sm text-zinc-400">
              Language
            </label>
            <Select
              id="kb-edit-language"
              value={language}
              onChange={setLanguage}
              options={KNOWLEDGE_LANGUAGES.map((l) => ({
                value: l.code,
                label: l.label,
              }))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-edit-priority" className="block text-sm text-zinc-400">
              Priority
            </label>
            <Select
              id="kb-edit-priority"
              value={priority}
              onChange={(v) => setPriority(v as typeof priority)}
              options={KNOWLEDGE_PRIORITIES.map((p) => ({
                value: p,
                label: KNOWLEDGE_PRIORITY_LABELS[p],
              }))}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-sm text-zinc-400">Tags</span>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                +
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {parseList(tags).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-zinc-500 hover:text-zinc-200"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-keywords" className="block text-sm text-zinc-400">
              Keywords (search)
            </label>
            <Input
              id="kb-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="check-in, checkout, wifi"
            />
            <p className="text-xs text-zinc-500">Comma-separated</p>
          </div>
        </aside>

        <div className="space-y-3">
          <div className="flex gap-2 border-b border-zinc-800">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition",
                tab === "edit"
                  ? "border-zinc-100 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
              onClick={() => setTab("edit")}
            >
              <FileText size={14} />
              Markdown
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition",
                tab === "preview"
                  ? "border-zinc-100 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
              onClick={() => setTab("preview")}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>

          {tab === "edit" ? (
            <Textarea
              className="min-h-[480px] font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the article in Markdown…"
              aria-label="Article content"
            />
          ) : (
            <KnowledgePreview content={content} title={title} />
          )}
        </div>
      </div>
    </div>
  );
}
