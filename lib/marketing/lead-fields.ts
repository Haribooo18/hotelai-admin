export const MARKETING_LEAD_ROOM_RANGES = [
  "1-20",
  "21-50",
  "51-100",
  "101-250",
  "251+",
] as const;

export type MarketingLeadRoomRange =
  (typeof MARKETING_LEAD_ROOM_RANGES)[number];

const MARKETING_LEAD_ROOM_RANGE_SET = new Set<string>(
  MARKETING_LEAD_ROOM_RANGES
);

export function parseMarketingLeadRoomRange(
  value: unknown
): MarketingLeadRoomRange | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid hotel size.");
  }

  const normalized = value.trim();

  if (!MARKETING_LEAD_ROOM_RANGE_SET.has(normalized)) {
    throw new Error("Invalid hotel size.");
  }

  return normalized as MarketingLeadRoomRange;
}
