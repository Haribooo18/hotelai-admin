import { ValidationError } from "@/lib/ops/errors";

export type ReadJsonBodyOptions = {
  maxBytes?: number;
  requireJsonContentType?: boolean;
};

const DEFAULT_MAX_BYTES = 32 * 1024;

export async function readJsonBody(
  request: Request,
  options: ReadJsonBodyOptions = {}
): Promise<unknown> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (
    options.requireJsonContentType !== false &&
    !contentType.startsWith("application/json")
  ) {
    throw new ValidationError("Content-Type должен быть application/json");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ValidationError("Тело запроса слишком большое");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new ValidationError("Тело запроса слишком большое");
  }

  if (!text.trim()) {
    throw new ValidationError("Пустое тело запроса");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ValidationError("Некорректный JSON");
  }
}
