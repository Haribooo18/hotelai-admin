"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MonavelMark } from "@/components/marketing/brand/MonavelMark";
import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import {
  mktBrandLockupClass,
  mktBrandNameClass,
  mktNavActionsClass,
  mktNavLinkClass,
  mktNavLinksClass,
  mktNavLogoClass,
} from "@/lib/marketing/design";
import { MARKETING_CTA } from "@/lib/marketing/routes";
import { MARKETING_NAV, SITE_NAME } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

function MarketingLogo() {
  return (
    <Link href="/" className={mktNavLogoClass}>
      <span className={mktBrandLockupClass}>
        <MonavelMark />
        <span className={mktBrandNameClass}>{SITE_NAME}</span>
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
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "mkt-nav sticky top-0 z-50 h-[var(--mkt-nav-height)] transition-[background-color,border-color] duration-200 ease-out",
        scrolled
          ? "mkt-nav-scrolled"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mkt-container-wide mkt-nav-inner">
        <MarketingLogo />

        <nav aria-label="Main navigation" className={mktNavLinksClass}>
          {MARKETING_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={mktNavLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={mktNavActionsClass}>
          <MarketingButton href={MARKETING_CTA.signIn} variant="ghost" size="sm">
            Sign in
          </MarketingButton>
          <MarketingButton href={MARKETING_CTA.trial} variant="primary" size="sm">
            Start free trial
          </MarketingButton>
        </div>

        <button
          type="button"
          className="mkt-nav-menu-toggle lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="marketing-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="mkt-nav-mobile-backdrop lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="marketing-mobile-menu"
            className="mkt-nav-mobile-panel lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <nav className="mkt-nav-mobile-links" aria-label="Mobile navigation">
              {MARKETING_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mkt-nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mkt-nav-mobile-actions">
              <MarketingButton
                href={MARKETING_CTA.trial}
                variant="primary"
                size="sm"
                mobileFull
                onClick={() => setMenuOpen(false)}
              >
                Start free trial
              </MarketingButton>
              <MarketingButton
                href={MARKETING_CTA.signIn}
                variant="ghost"
                size="sm"
                mobileFull
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </MarketingButton>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
