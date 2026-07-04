/**
 * Minimal safe Markdown → HTML for in-app preview.
 * Not a full spec implementation; sufficient for knowledge article preview.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function markdownToPreviewHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.match(/^#{1,3}\s+/)) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const text = line.replace(/^#+\s+/, "");
      const tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      html.push(`<${tag}>${formatInline(text)}</${tag}>`);
      continue;
    }

    if (line.match(/^[-*]\s+/)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (line === "") {
      html.push("<br />");
      continue;
    }

    html.push(`<p>${formatInline(line)}</p>`);
  }

  if (inList) html.push("</ul>");

  return html.join("\n");
}

function formatInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(
    /`(.+?)`/g,
    '<code class="rounded bg-zinc-800 px-1 py-0.5 text-sm">$1</code>'
  );
  out = out.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return out;
}
