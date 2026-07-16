"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { parseHashHref } from "@/lib/marketing/hash-link";

type Props = ComponentProps<typeof Link>;

/**
 * Wraps `next/link` for same-page hash anchors (e.g. `/#product`).
 *
 * The canonical destination always comes from the `href` prop as written —
 * never from the current URL or `location.hash` — so repeated clicks can
 * never produce a duplicated hash like `/#product#product`.
 *
 * - Already on the target page: prevents default navigation, replaces the
 *   URL with the exact canonical href (`history.replaceState`, which always
 *   overwrites rather than appends), and smoothly scrolls to the target id.
 * - On a different page: falls through to normal `next/link` navigation,
 *   which already resolves to the canonical href.
 */
export function HashAwareLink({ href, onClick, ...props }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (typeof href !== "string" || event.defaultPrevented) return;

    const parsed = parseHashHref(href);
    if (!parsed) return;

    if (window.location.pathname !== parsed.path) {
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", href);

    const target = document.getElementById(parsed.id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
