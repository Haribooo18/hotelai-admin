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
import { formatTranslation, localizeErrorWithT, useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
        } catch (error) {
          toast.error(
            error instanceof Error && error.message
              ? localizeErrorWithT(t, error.message)
              : t("knowledge.editorAutosaveFailed")
          );
        }
      });
    }, AUTOSAVE_MS);

    return () => clearTimeout(timer);
  }, [isDirty, snapshot, autosavePayload, startTransition, t]);

  function addTag() {
    const tagValue = tagInput.trim();
    if (!tagValue) return;
    const current = parseList(tags);
    if (!current.includes(tagValue)) {
      setTags([...current, tagValue].join(", "));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(parseList(tags).filter((item) => item !== tag).join(", "));
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
        toast.success(t("knowledge.editorSaved"));
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("knowledge.editorSaveFailed")
        );
      }
    });
  }

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishKnowledgeArticle(initial.id);
        toast.success(t("knowledge.publishSuccess"));
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.statusChangeFailed")
        );
      }
    });
  }

  function handleUnpublish() {
    startTransition(async () => {
      try {
        await unpublishKnowledgeArticle(initial.id);
        toast.success(t("knowledge.unpublishSuccess"));
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.statusChangeFailed")
        );
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      try {
        await archiveKnowledgeArticle(initial.id);
        toast.success(t("knowledge.editorArchiveSuccess"));
        router.push("/knowledge");
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.statusChangeFailed")
        );
      }
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      try {
        const id = await duplicateKnowledgeArticle(initial.id);
        toast.success(t("knowledge.duplicateSuccess"));
        router.push(`/knowledge/${id}`);
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("errors.duplicateFailed")
        );
      }
    });
  }

  const allCategories = Array.from(
    new Set([
      ...DEFAULT_KNOWLEDGE_CATEGORIES,
      ...(category ? [category] : []),
    ])
  );

  const saveStatusLabel = pending || isDirty
    ? t("common.saving")
    : t("knowledge.editorSavedStatus");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/knowledge"
            className="rounded-lg p-2 text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
            aria-label={t("knowledge.editorBackToList")}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{t("knowledge.editorTitle")}</h1>
              <KnowledgeStatusBadge status={initial.status} />
              <span className="text-xs text-[var(--shell-muted)]">v{initial.version}</span>
            </div>
            <p className="text-xs text-[var(--shell-muted)]">
              {saveStatusLabel} ·{" "}
              {formatTranslation(t("knowledge.editorWordCount"), { count: wordCount })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={pending}>
            <Copy size={14} className="mr-1" />
            {t("common.duplicate")}
          </Button>
          {initial.status === "published" ? (
            <Button variant="outline" size="sm" onClick={handleUnpublish} disabled={pending}>
              <X size={14} className="mr-1" />
              {t("knowledge.unpublish")}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePublish} disabled={pending}>
              <Upload size={14} className="mr-1" />
              {t("knowledge.publish")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleArchive} disabled={pending}>
            <Archive size={14} className="mr-1" />
            {t("knowledge.editorArchive")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={pending}>
            <Save size={14} className="mr-1" />
            {t("common.save")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-4">
          <div className="space-y-2">
            <label htmlFor="kb-edit-title" className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.title")}
            </label>
            <Input
              id="kb-edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-edit-category" className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.category")}
            </label>
            <Select
              id="kb-edit-category"
              value={category}
              onChange={setCategory}
              placeholder={t("common.noCategory")}
              options={allCategories.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-edit-language" className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.editorLanguage")}
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
            <label htmlFor="kb-edit-priority" className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.editorPriority")}
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
            <span className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.editorTags")}
            </span>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t("knowledge.editorAddTag")}
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
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--shell-surface-raised)] px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
                    aria-label={formatTranslation(t("knowledge.editorRemoveTag"), { tag })}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="kb-keywords" className="block text-sm text-[var(--shell-muted)]">
              {t("knowledge.editorKeywords")}
            </label>
            <Input
              id="kb-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={t("knowledge.editorKeywordsPlaceholder")}
            />
            <p className="text-xs text-[var(--shell-muted)]">
              {t("knowledge.editorKeywordsHint")}
            </p>
          </div>
        </aside>

        <div className="space-y-3">
          <div className="flex gap-2 border-b border-[var(--shell-border)]">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition",
                tab === "edit"
                  ? "border-[var(--shell-text)] text-[var(--shell-text)]"
                  : "border-transparent text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
              onClick={() => setTab("edit")}
            >
              <FileText size={14} />
              {t("knowledge.previewSubtitle")}
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition",
                tab === "preview"
                  ? "border-[var(--shell-text)] text-[var(--shell-text)]"
                  : "border-transparent text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
              )}
              onClick={() => setTab("preview")}
            >
              <Eye size={14} />
              {t("knowledge.preview")}
            </button>
          </div>

          {tab === "edit" ? (
            <Textarea
              className="min-h-[480px] font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("knowledge.editorContentPlaceholder")}
              aria-label={t("knowledge.editorContentAria")}
            />
          ) : (
            <KnowledgePreview content={content} title={title} />
          )}
        </div>
      </div>
    </div>
  );
}
