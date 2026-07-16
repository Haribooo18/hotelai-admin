"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

import {
  DEFAULT_KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_LANGUAGES,
} from "@/lib/knowledge";
import { createKnowledgeArticle } from "@/lib/services/knowledge.mutations";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { WorkspaceFormDrawer } from "@/components/dashboard/shared/WorkspaceOverlay";
import { overlayFormActionsClass } from "@/lib/dashboard/design-system";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KnowledgeCreateDialog({ open, onOpenChange }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("ru");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t("knowledge.enterTitle"));
      return;
    }

    startTransition(async () => {
      try {
        const id = await createKnowledgeArticle({
          title: title.trim(),
          slug: "",
          content: "",
          category,
          language,
          priority: "normal",
          status: "draft",
          is_pinned: false,
          tags: [],
          search_keywords: [],
        });
        toast.success(t("knowledge.createSuccess"));
        onOpenChange(false);
        setTitle("");
        setCategory("");
        router.push(`/knowledge/${id}`);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error && error.message
            ? localizeErrorWithT(t, error.message)
            : t("knowledge.createFailed")
        );
      }
    });
  }

  return (
    <WorkspaceFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("knowledge.createDialogTitle")}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="kb-title" className="block text-sm text-[var(--shell-muted)]">
            {t("knowledge.title")}
          </label>
          <Input
            id="kb-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("knowledge.createTitlePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="kb-category"
            className="block text-sm text-[var(--shell-muted)]"
          >
            {t("knowledge.category")}
          </label>
          <Select
            id="kb-category"
            value={category}
            onChange={setCategory}
            placeholder={t("common.noCategory")}
            options={DEFAULT_KNOWLEDGE_CATEGORIES.map((c) => ({
              value: c,
              label: c,
            }))}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="kb-language"
            className="block text-sm text-[var(--shell-muted)]"
          >
            {t("knowledge.editorLanguage")}
          </label>
          <Select
            id="kb-language"
            value={language}
            onChange={setLanguage}
            options={KNOWLEDGE_LANGUAGES.map((l) => ({
              value: l.code,
              label: l.label,
            }))}
          />
        </div>

        <div className={overlayFormActionsClass}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={pending}>
            {t("common.create")}
          </Button>
        </div>
      </form>
    </WorkspaceFormDrawer>
  );
}
