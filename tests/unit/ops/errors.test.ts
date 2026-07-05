import { describe, expect, it } from "vitest";

import {
  AuthenticationError,
  ProviderError,
  ValidationError,
  normalizeError,
} from "@/lib/ops/errors";

describe("normalizeError", () => {
  it("classifies validation failures", () => {
    const error = normalizeError(new ValidationError("bad input"));
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.status).toBe(400);
  });

  it("classifies provider failures", () => {
    const error = normalizeError(new ProviderError("OpenAI down"));
    expect(error.code).toBe("PROVIDER_ERROR");
    expect(error.status).toBe(503);
  });

  it("classifies auth failures from message", () => {
    const error = normalizeError(new Error("Не авторизован"));
    expect(error).toBeInstanceOf(AuthenticationError);
  });
});
