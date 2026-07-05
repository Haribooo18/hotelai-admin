import Link from "next/link";
import type { ReactNode } from "react";
import { Hotel } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { MARKETING_NAV, SITE_NAME } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
};

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
            <Hotel className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Войти
          </Link>
          <Link
            href="/settings?tab=billing"
            className={cn(buttonVariants())}
          >
            Начать пробный период
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-zinc-500">
            AI-ресепшн и PMS для независимых отелей
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">Продукт</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="/features" className="hover:text-white">
                Возможности
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white">
                Тарифы
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Панель администратора
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">Правовая информация</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Условия использования
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Контакты
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {SITE_NAME}. Все права защищены.
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
