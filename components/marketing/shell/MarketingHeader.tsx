"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import { MARKETING_CTA } from "@/lib/marketing/routes";
import { MARKETING_NAV, SITE_NAME } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

function MarketingLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent-ring)]"
    >
      <span
        aria-hidden
        className="flex size-8 items-center justify-center rounded-[var(--mkt-radius-md)] bg-[var(--mkt-accent)] text-sm font-semibold text-[var(--mkt-accent-foreground)]"
      >
        M
      </span>
      <span className="text-base font-semibold tracking-tight text-[var(--mkt-text)]">
        {SITE_NAME}
      </span>
    </Link>
  );
}

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[var(--mkt-nav-height)] transition-[background-color,border-color,box-shadow] duration-200 ease-out",
        scrolled
          ? "mkt-nav-scrolled"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mkt-container-wide flex h-full items-center justify-between gap-4">
        <MarketingLogo />

        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-6 lg:flex"
        >
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--mkt-text-muted)] transition-colors duration-150 hover:text-[var(--mkt-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent-ring)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <MarketingButton href={MARKETING_CTA.signIn} variant="ghost" size="sm">
            Войти
          </MarketingButton>
          <MarketingButton
            href={MARKETING_CTA.trial}
            variant="primary"
            size="sm"
          >
            Начать пробный период
          </MarketingButton>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[var(--mkt-radius-md)] text-[var(--mkt-text)] hover:bg-[var(--mkt-surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent-ring)] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="marketing-mobile-menu"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="marketing-mobile-menu"
          className="fixed inset-0 top-[var(--mkt-nav-height)] z-40 flex flex-col bg-[var(--mkt-surface-3)] px-6 py-6 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <nav className="flex flex-col gap-4" aria-label="Мобильная навигация">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg text-[var(--mkt-text)]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <MarketingButton
              href={MARKETING_CTA.trial}
              variant="primary"
              mobileFull
              onClick={() => setMenuOpen(false)}
            >
              Начать пробный период
            </MarketingButton>
            <MarketingButton
              href={MARKETING_CTA.signIn}
              variant="ghost"
              mobileFull
              onClick={() => setMenuOpen(false)}
            >
              Войти
            </MarketingButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
