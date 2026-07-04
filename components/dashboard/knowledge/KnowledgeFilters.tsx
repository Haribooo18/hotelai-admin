"use client";

import {
  KNOWLEDGE_LANGUAGES,
  KNOWLEDGE_PRIORITIES,
  KNOWLEDGE_PRIORITY_LABELS,
  KNOWLEDGE_STATUSES,
  KNOWLEDGE_STATUS_LABELS,
  DEFAULT_KNOWLEDGE_CATEGORIES,
} from "@/lib/knowledge";

import { Select } from "@/components/ui/select";

type Props = {
  status: string;
  category: string;
  language: string;
  priority: string;
  categories: string[];
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
};

export function KnowledgeFilters({
  status,
  category,
  language,
  priority,
  categories,
  onStatusChange,
  onCategoryChange,
  onLanguageChange,
  onPriorityChange,
}: Props) {
  const allCategories = Array.from(
    new Set([...DEFAULT_KNOWLEDGE_CATEGORIES, ...categories])
  ).sort();

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        className="w-[160px]"
        value={status}
        onChange={onStatusChange}
        placeholder="Все статусы"
        aria-label="Статус"
        options={KNOWLEDGE_STATUSES.map((s) => ({
          value: s,
          label: KNOWLEDGE_STATUS_LABELS[s],
        }))}
      />

      <Select
        className="w-[180px]"
        value={category}
        onChange={onCategoryChange}
        placeholder="Все категории"
        aria-label="Категория"
        options={allCategories.map((c) => ({ value: c, label: c }))}
      />

      <Select
        className="w-[140px]"
        value={language}
        onChange={onLanguageChange}
        placeholder="Все языки"
        aria-label="Язык"
        options={KNOWLEDGE_LANGUAGES.map((l) => ({
          value: l.code,
          label: l.label,
        }))}
      />

      <Select
        className="w-[150px]"
        value={priority}
        onChange={onPriorityChange}
        placeholder="Все приоритеты"
        aria-label="Приоритет"
        options={KNOWLEDGE_PRIORITIES.map((p) => ({
          value: p,
          label: KNOWLEDGE_PRIORITY_LABELS[p],
        }))}
      />
    </div>
  );
}
