import { NextResponse } from "next/server";

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
    throw new Error(`${fieldName} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} is too long.`);
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
    throw new Error("One of the submitted fields is too long.");
  }

  return normalized;
}

function parseRooms(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized =
    typeof value === "number"
      ? value
      : Number.parseInt(String(value).trim(), 10);

  if (!Number.isInteger(normalized) || normalized <= 0 || normalized > 100000) {
    throw new Error("Rooms must be a positive whole number.");
  }

  return normalized;
}

function parseSource(value: unknown): LeadSource {
  if (value === "contact" || value === "demo") {
    return value;
  }

  throw new Error("Invalid lead source.");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    // Honeypot field. Real users should never fill this.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true });
    }

    const source = parseSource(body.source);
    const name = requiredText(body.name, "Name", 120);
    const email = requiredText(body.email, "Email", 254).toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const hotel = optionalText(body.hotel, 160);
    const country = optionalText(body.country, 120);
    const rooms = parseRooms(body.rooms);
    const preferredDate = optionalText(body.preferredDate, 80);
    const message = optionalText(body.message, 3000);

    const supabase = await createClient();

    const { error } = await supabase.from("marketing_leads").insert({
      source,
      name,
      email,
      hotel,
      country,
      rooms,
      preferred_date: preferredDate,
      message,
      status: "new",
    });

    if (error) {
      console.error("Failed to create marketing lead:", error);

      return NextResponse.json(
        { error: "We could not submit your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid request payload.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}