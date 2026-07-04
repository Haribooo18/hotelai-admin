"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  id?: string;
};

export function GuestTagsInput({ value, onChange, id }: Props) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              {tag}
              <button
                type="button"
                aria-label={`Удалить тег ${tag}`}
                onClick={() => removeTag(tag)}
                className="text-zinc-500 transition hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        id={id}
        value={draft}
        placeholder="Добавьте тег и нажмите Enter"
        aria-label="Добавить тег"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            removeTag(value[value.length - 1]);
          }
        }}
        onBlur={() => addTag(draft)}
      />
    </div>
  );
}
