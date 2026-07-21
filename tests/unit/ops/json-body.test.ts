import { describe, expect, it } from "vitest";

import { readJsonBody } from "@/lib/http/json-body";

function request(body: string, contentType = "application/json") {
  return new Request("http://localhost/test", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
}

describe("readJsonBody", () => {
  it("parses a JSON body", async () => {
    await expect(readJsonBody(request('{"ok":true}'))).resolves.toEqual({
      ok: true,
    });
  });

  it("rejects a non-JSON content type", async () => {
    await expect(readJsonBody(request("{}", "text/plain"))).rejects.toThrow(
      "Content-Type"
    );
  });

  it("rejects invalid JSON", async () => {
    await expect(readJsonBody(request("{"))).rejects.toThrow(
      "Некорректный JSON"
    );
  });

  it("rejects a body over the configured limit", async () => {
    await expect(
      readJsonBody(request(JSON.stringify({ value: "abcdef" })), {
        maxBytes: 4,
      })
    ).rejects.toThrow("слишком большое");
  });
});
