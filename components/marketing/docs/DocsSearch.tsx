"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  getDocsSearchEntries,
  type DocsSearchEntry,
} from "@/lib/marketing/docs";
import { cn } from "@/lib/utils";

type Props = {
  placeholder: string;
  size?: "hero" | "compact";
};

function filterEntries(query: string, entries: DocsSearchEntry[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return entries
    .filter((entry) => {
      const haystack =
        `${entry.title} ${entry.description} ${entry.group}`.toLowerCase();

      return haystack.includes(normalized);
    })
    .slice(0, 8);
}

function navigateTo(href: string) {
  if (typeof window === "undefined") return;
  window.location.assign(href);
}

function isApplePlatform() {
  if (typeof navigator === "undefined") return false;

  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

export function DocsSearch({ placeholder, size = "hero" }: Props) {
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMac] = useState(isApplePlatform);

  const entries = useMemo(() => getDocsSearchEntries(), []);
  const results = useMemo(
    () => filterEntries(query, entries),
    [entries, query]
  );

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const isShortcut =
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey);

      if (!isShortcut) return;

      event.preventDefault();

      inputRef.current?.focus({
        preventScroll: true,
      });

      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function goTo(href: string) {
    setOpen(false);
    setQuery("");
    navigateTo(href);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = results[activeIndex] ?? results[0];

    if (target) {
      goTo(target.href);
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      return;
    }

    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current === 0 ? results.length - 1 : current - 1
      );
    }
  }

  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  return (
    <div
      className={cn(
        "mkt-docs-search",
        size === "compact" && "mkt-docs-search--compact"
      )}
    >
      <form
        className="mkt-docs-search-form"
        role="search"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <label className="sr-only" htmlFor={inputId}>
          Search documentation
        </label>

        <input
          ref={inputRef}
          id={inputId}
          type="search"
          className="mkt-docs-search-input"
          placeholder={placeholder}
          value={query}
          aria-controls={listId}
          aria-expanded={open && results.length > 0}
          aria-autocomplete="list"
          role="combobox"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
        />

        <kbd className="mkt-docs-search-kbd" aria-hidden>
          {shortcutLabel}
        </kbd>
      </form>

      {open && results.length > 0 ? (
        <ul
          id={listId}
          className="mkt-docs-search-results"
          role="listbox"
        >
          {results.map((result, index) => (
            <li
              key={result.id}
              role="option"
              aria-selected={index === activeIndex}
            >
              <Link
                href={result.href}
                className={cn(
                  "mkt-docs-search-result",
                  index === activeIndex &&
                    "mkt-docs-search-result--active"
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="mkt-docs-search-result-title">
                  {result.title}
                </span>

                <span className="mkt-docs-search-result-group">
                  {result.group}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}