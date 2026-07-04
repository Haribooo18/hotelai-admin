"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { Conversation } from "@/types/conversation";
import { cn } from "@/lib/utils";
import {
  CONVERSATION_CHANNEL_OPTIONS,
  CONVERSATION_PRIORITY_OPTIONS,
  CONVERSATION_STATUS_OPTIONS,
} from "@/lib/ai/metadata";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { AIStatusBadge } from "./AIStatusBadge";
import { ChannelIcon } from "./ChannelIcon";
import { PriorityBadge } from "./PriorityBadge";

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function formatRelative(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Вчера";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [priority, setPriority] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return conversations.filter((c) => {
      const haystack = [
        c.guest_name,
        c.guest_email ?? "",
        c.last_message_preview ?? "",
        c.subject ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = q === "" || haystack.includes(q);
      const matchesStatus = status === "" || c.status === status;
      const matchesChannel = channel === "" || c.channel === channel;
      const matchesPriority = priority === "" || c.priority === priority;

      return (
        matchesSearch && matchesStatus && matchesChannel && matchesPriority
      );
    });
  }, [conversations, search, status, channel, priority]);

  return (
    <aside className="flex h-full w-full flex-col border-r border-zinc-800 bg-zinc-950 md:w-80 md:shrink-0">
      <div className="space-y-3 border-b border-zinc-800 p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Поиск диалогов…"
            aria-label="Поиск диалогов"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Select
            value={status}
            onChange={setStatus}
            placeholder="Все статусы"
            aria-label="Фильтр по статусу"
            options={CONVERSATION_STATUS_OPTIONS}
          />
          <Select
            value={channel}
            onChange={setChannel}
            placeholder="Все каналы"
            aria-label="Фильтр по каналу"
            options={CONVERSATION_CHANNEL_OPTIONS}
          />
          <Select
            value={priority}
            onChange={setPriority}
            placeholder="Все приоритеты"
            aria-label="Фильтр по приоритету"
            options={CONVERSATION_PRIORITY_OPTIONS}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        role="listbox"
        aria-label="Список диалогов"
      >
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            Диалоги не найдены
          </div>
        ) : (
          filtered.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              role="option"
              aria-selected={selectedId === conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "flex w-full flex-col gap-1.5 border-b border-zinc-900 px-4 py-3 text-left transition hover:bg-zinc-900/60",
                selectedId === conversation.id && "bg-zinc-900"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <ChannelIcon channel={conversation.channel} />
                  <span className="truncate font-medium">
                    {conversation.guest_name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {conversation.unread_count > 0 && (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white"
                      aria-label={`${conversation.unread_count} непрочитанных`}
                    >
                      {conversation.unread_count}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500">
                    {formatRelative(conversation.last_message_at)}
                  </span>
                </div>
              </div>

              <p className="truncate text-sm text-zinc-500">
                {conversation.last_message_preview ?? "Нет сообщений"}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <AIStatusBadge status={conversation.status} />
                <PriorityBadge priority={conversation.priority} />
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
