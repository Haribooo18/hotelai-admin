import { describe, expect, it } from "vitest";

import { markdownToPreviewHtml } from "@/lib/markdown-preview";

describe("markdownToPreviewHtml", () => {
  it("renders allowed links", () => {
    const html = markdownToPreviewHtml(
      "[Website](https://example.com) [Email](mailto:hello@example.com) [Section](#details)"
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('href="mailto:hello@example.com"');
    expect(html).toContain('href="#details"');
  });

  it.each([
    "javascript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
  ])("does not render unsafe link target %s", (href) => {
    const html = markdownToPreviewHtml(`[Unsafe](${href})`);

    expect(html).not.toContain("<a ");
    expect(html).not.toContain("href=");
    expect(html).toContain("Unsafe");
  });

  it("escapes raw HTML", () => {
    const html = markdownToPreviewHtml('<img src=x onerror="alert(1)">');

    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});
