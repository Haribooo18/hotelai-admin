"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DEFAULT_KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_LANGUAGES,
} from "@/lib/knowledge";
import { createKnowledgeArticle } from "@/lib/services/knowledge.mutations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KnowledgeCreateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus size={16} className="mr-2" />
      New article
    </Button>
  );
}

export function KnowledgeCreateDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("ru");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Enter a title");
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
        toast.success("Article created");
        onOpenChange(false);
        setTitle("");
        setCategory("");
        router.push(`/knowledge/${id}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create article");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New article</SheetTitle>
        </SheetHeader>

        <form className="mt-6 space-y-4 px-6 pb-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="kb-title" className="block text-sm text-zinc-400">
              Title
            </label>
            <Input
              id="kb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Check-in and check-out times"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="kb-category"
              className="block text-sm text-zinc-400"
            >
              Category
            </label>
            <Select
              id="kb-category"
              value={category}
              onChange={setCategory}
              placeholder="No category"
              options={DEFAULT_KNOWLEDGE_CATEGORIES.map((c) => ({
                value: c,
                label: c,
              }))}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="kb-language"
              className="block text-sm text-zinc-400"
            >
              Language
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              Create
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
