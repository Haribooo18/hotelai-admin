import { NextResponse } from "next/server";

import { readJsonBody } from "@/lib/http/json-body";
import { parseMarketingLeadRoomRange } from "@/lib/marketing/lead-fields";
import {
  checkMarketingLeadRateLimit,
  getMarketingClientKey,
} from "@/lib/marketing/rate-limit";
import { ValidationError } from "@/lib/ops/errors";
import { createClient } from "@/lib/supabase/server";

type LeadSource = "contact" | "demo";

type LeadPayload = {
  source?: unknown;
  name?: unknown;
  email?: unknown;
  hotel?: unknown;
  country?: unknown;
  rooms?: unknown;
  preferredDate?: unknown;
  message?: unknown;
  website?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredText(
  value: unknown,
  fieldName: string,
  maxLength: number
): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new ValidationError(`${fieldName} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new ValidationError(`${fieldName} is too long.`);
  }

  return normalized;
}

function optionalText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    throw new ValidationError("One of the submitted fields is too long.");
  }

  return normalized;
}

function parseSource(value: unknown): LeadSource {
  if (value === "contact" || value === "demo") {
    return value;
  }

  throw new ValidationError("Invalid lead source.");
}

function noStoreJson(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkMarketingLeadRateLimit(
      getMarketingClientKey(request)
    );

    if (!rateLimit.allowed) {
      return noStoreJson(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
          },
        }
      );
    }

    const body = (await readJsonBody(request, {
      maxBytes: 16 * 1024,
    })) as LeadPayload;

    // Honeypot field. Real users should never fill this.
    if (typeof body.website === "string" && body.website.trim()) {
      return noStoreJson({ success: true });
    }

    const source = parseSource(body.source);
    const name = requiredText(body.name, "Name", 120);
    const email = requiredText(body.email, "Email", 254).toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return noStoreJson(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const hotel = optionalText(body.hotel, 160);
    const country = optionalText(body.country, 120);
    const roomsRange = parseMarketingLeadRoomRange(body.rooms);
    const preferredDate = optionalText(body.preferredDate, 80);
    const message = optionalText(body.message, 3000);

    const supabase = await createClient();

    const { error } = await supabase.from("marketing_leads").insert({
      source,
      name,
      email,
      hotel,
      country,
      rooms_range: roomsRange,
      preferred_date: preferredDate,
      message,
      status: "new",
    });

    if (error) {
      console.error("Failed to create marketing lead:", {
        code: error.code,
        message: error.message,
      });

      return noStoreJson(
        { error: "We could not submit your request. Please try again." },
        { status: 500 }
      );
    }

    return noStoreJson({ success: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof ValidationError
        ? error.message
        : "Invalid request payload.";

    return noStoreJson({ error: message }, { status: 400 });
  }
}
