import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MIGRATION_FILENAME = /^(\d{4})_[a-z0-9_]+\.sql$/i;

export type MigrationValidationIssue = {
  level: "error" | "warning";
  message: string;
  file?: string;
};

export type MigrationValidationResult = {
  ok: boolean;
  files: string[];
  issues: MigrationValidationIssue[];
};

function getMigrationFiles(migrationsDir: string): string[] {
  return readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

function validateSqlStructure(file: string, contents: string): MigrationValidationIssue[] {
  const issues: MigrationValidationIssue[] = [];

  if (contents.trim().length === 0) {
    issues.push({ level: "error", message: "Migration file is empty", file });
    return issues;
  }

  if (contents.includes("\0")) {
    issues.push({ level: "error", message: "Migration file contains invalid bytes", file });
  }

  const openParens = (contents.match(/\(/g) ?? []).length;
  const closeParens = (contents.match(/\)/g) ?? []).length;
  if (Math.abs(openParens - closeParens) > 2) {
    issues.push({
      level: "warning",
      message: "Parentheses may be unbalanced",
      file,
    });
  }

  const hasTransaction =
    /\bbegin\s*;/i.test(contents) && /\bcommit\s*;/i.test(contents);
  if (!hasTransaction) {
    issues.push({
      level: "warning",
      message: "Migration does not use explicit BEGIN/COMMIT transaction",
      file,
    });
  }

  return issues;
}

export function validateMigrations(
  migrationsDir = join(process.cwd(), "supabase", "migrations")
): MigrationValidationResult {
  const files = getMigrationFiles(migrationsDir);
  const issues: MigrationValidationIssue[] = [];

  if (files.length === 0) {
    return {
      ok: false,
      files,
      issues: [{ level: "error", message: "No migration files found" }],
    };
  }

  const versions = new Map<number, string>();

  for (const file of files) {
    const match = file.match(MIGRATION_FILENAME);
    if (!match) {
      issues.push({
        level: "error",
        message: "Migration filename must match NNNN_description.sql",
        file,
      });
      continue;
    }

    const version = Number.parseInt(match[1] ?? "", 10);
    if (Number.isNaN(version)) {
      issues.push({
        level: "error",
        message: "Migration version is not numeric",
        file,
      });
      continue;
    }

    const existing = versions.get(version);
    if (existing) {
      issues.push({
        level: "error",
        message: `Duplicate migration version ${String(version).padStart(4, "0")}`,
        file,
      });
    } else {
      versions.set(version, file);
    }

    const contents = readFileSync(join(migrationsDir, file), "utf8");
    issues.push(...validateSqlStructure(file, contents));
  }

  const sortedVersions = [...versions.keys()].sort((a, b) => a - b);
  const startVersion = sortedVersions[0] ?? 1;

  for (let index = 0; index < sortedVersions.length; index += 1) {
    const expected = startVersion + index;
    const actual = sortedVersions[index];
    if (actual !== expected) {
      issues.push({
        level: "error",
        message: `Migration sequence gap: expected ${String(expected).padStart(4, "0")}, found ${String(actual).padStart(4, "0")}`,
        file: versions.get(actual),
      });
      break;
    }
  }

  const errors = issues.filter((issue) => issue.level === "error");

  return {
    ok: errors.length === 0,
    files,
    issues,
  };
}
