"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/core/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import {
  CREATE_ACTION_ROUTES,
  type CreateActionKey,
} from "@/lib/dashboard/create-actions";
import { useI18n, type TranslationPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CREATE_MENU_ITEMS: Array<{
  id: CreateActionKey;
  labelKey: TranslationPath;
}> = [
  { id: "reservation", labelKey: "create.reservation" },
  { id: "guest", labelKey: "create.guest" },
  { id: "room", labelKey: "create.room" },
  { id: "conversation", labelKey: "create.conversation" },
  { id: "article", labelKey: "create.article" },
];

export function ToolbarCreateDropdown() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-[var(--ds-button-height)] gap-1.5 rounded-[var(--ds-radius-sm)] px-3.5 text-[12px] font-semibold shadow-[var(--shell-shadow-accent)]"
        )}
        aria-label={t("create.menuAria")}
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden />
        {t("create.new")}
        <ChevronDown size={14} aria-hidden className="text-white/80" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[168px]">
        {CREATE_MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => router.push(CREATE_ACTION_ROUTES[item.id])}
          >
            {t(item.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
