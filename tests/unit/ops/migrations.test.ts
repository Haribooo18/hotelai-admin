import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { validateMigrations } from "@/lib/ops/migrations";

describe("validateMigrations", () => {
  it("accepts the current migration set", () => {
    const result = validateMigrations();

    expect(result.files.length).toBeGreaterThan(0);
    expect(result.ok).toBe(true);
    expect(result.issues.filter((issue) => issue.level === "error")).toHaveLength(0);
  });

  it("rejects duplicate migration versions", () => {
    const dir = mkdtempSync(join(tmpdir(), "hotelai-migrations-"));
    writeFileSync(
      join(dir, "0001_first.sql"),
      "begin;\nselect 1;\ncommit;\n"
    );
    writeFileSync(
      join(dir, "0001_duplicate.sql"),
      "begin;\nselect 1;\ncommit;\n"
    );

    const result = validateMigrations(dir);

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.message.includes("Duplicate"))).toBe(
      true
    );
  });
});
