import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

import {
  MonavelHorizontal,
  MonavelLockup,
  MonavelMark,
} from "@/components/brand";
import { ShellWordmark } from "@/components/dashboard/shell/ShellWordmark";
import { MarketingHeader } from "@/components/marketing/shell/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/shell/MarketingFooter";
import { MarketingShell } from "@/components/marketing/shell/MarketingShell";
import { LoginPageContent } from "@/components/auth/LoginPageContent";
import { BRAND_ASSET_FILENAMES, BRAND_ASSETS } from "@/lib/brand";

const CHROME_SOURCES = [
  "components/marketing/shell/MarketingHeader.tsx",
  "components/marketing/shell/MarketingFooter.tsx",
  "components/marketing/shell/MarketingShell.tsx",
  "components/auth/LoginPageContent.tsx",
] as const;

function collectTsxFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsxFiles(fullPath));
      continue;
    }
    if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("logo migration", () => {
  it("ships official SVG files under public/brand", () => {
    const brandDir = path.join(process.cwd(), "public", "brand");

    for (const filename of BRAND_ASSET_FILENAMES) {
      expect(existsSync(path.join(brandDir, filename))).toBe(true);
    }
  });

  it("renders official horizontal, stacked lockup, and mark assets", () => {
    const horizontal = renderToStaticMarkup(
      React.createElement(MonavelHorizontal)
    );
    const lockup = renderToStaticMarkup(React.createElement(MonavelLockup));
    const mark = renderToStaticMarkup(React.createElement(MonavelMark));

    expect(horizontal).toContain(`src="${BRAND_ASSETS.horizontal}"`);
    expect(horizontal).toContain('alt="Monavel"');
    expect(lockup).toContain(`src="${BRAND_ASSETS.lockup}"`);
    expect(mark).toContain(`src="${BRAND_ASSETS.mark}"`);
  });

  it("uses horizontal lockup in marketing header, footer, and docs shell", () => {
    const header = renderToStaticMarkup(React.createElement(MarketingHeader));
    const footer = renderToStaticMarkup(React.createElement(MarketingFooter));
    const shell = renderToStaticMarkup(
      React.createElement(MarketingShell, null, "docs")
    );

    expect(header).toContain(BRAND_ASSETS.horizontal);
    expect(header).not.toContain(BRAND_ASSETS.lockup);
    expect(header).not.toContain("mkt-brand-mark-bg");
    expect(footer).toContain(BRAND_ASSETS.horizontal);
    expect(footer).not.toContain(BRAND_ASSETS.lockup);
    expect(shell).toContain(BRAND_ASSETS.horizontal);
    expect(shell).not.toContain(BRAND_ASSETS.lockup);
  });

  it("keeps stacked lockup out of navigation and application chrome sources", () => {
    for (const relativePath of CHROME_SOURCES) {
      const source = readFileSync(
        path.join(process.cwd(), relativePath),
        "utf8"
      );
      expect(source).not.toContain("MonavelLockup");
      expect(source).not.toContain("monavel-lockup.svg");
    }
  });

  it("reserves stacked lockup for Brand Book / identity surfaces only", () => {
    const componentRoots = [
      path.join(process.cwd(), "components"),
      path.join(process.cwd(), "app"),
    ];
    const stackedConsumers = componentRoots.flatMap((root) =>
      collectTsxFiles(root).filter((filePath) => {
        const relative = path.relative(process.cwd(), filePath);
        if (
          relative.startsWith(`components/brand${path.sep}`) ||
          relative === "components/marketing/index.ts"
        ) {
          return false;
        }
        const source = readFileSync(filePath, "utf8");
        return (
          source.includes("MonavelLockup") ||
          source.includes("monavel-lockup.svg")
        );
      })
    );

    expect(
      stackedConsumers.map((filePath) =>
        path.relative(process.cwd(), filePath)
      )
    ).toEqual(["components/marketing/brand/BrandBookPage.tsx"]);
  });

  it("uses mark in the shell wordmark", () => {
    const html = renderToStaticMarkup(React.createElement(ShellWordmark));
    expect(html).toContain(BRAND_ASSETS.mark);
    expect(html).not.toContain("ds-wordmark-badge");
  });

  it("uses horizontal lockup on the authentication screen", () => {
    const html = renderToStaticMarkup(React.createElement(LoginPageContent));
    expect(html).toContain(BRAND_ASSETS.horizontal);
    expect(html).not.toContain(BRAND_ASSETS.lockup);
    expect(html).not.toContain("lucide");
  });
});
