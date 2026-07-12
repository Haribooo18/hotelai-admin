export type WhoIsMonavelForSegment = {
  id: string;
  title: string;
  description: string;
};

export const WHO_IS_MONAVEL_FOR_CONTENT = {
  sectionId: "who-is-monavel-for",
  headline: "Built for every type of hotel",
  subhead:
    "From independent boutiques to multi-property groups — one operating system scales with your property.",
} as const;

export const WHO_IS_MONAVEL_FOR_SEGMENTS: WhoIsMonavelForSegment[] = [
  {
    id: "boutique",
    title: "Boutique Hotels",
    description:
      "Run reception, bookings, and guest communication without a fragmented software stack.",
  },
  {
    id: "chains",
    title: "Hotel Chains",
    description:
      "Standardize operations across properties with shared knowledge and centralized visibility.",
  },
  {
    id: "luxury",
    title: "Luxury Hotels",
    description:
      "Deliver personalized guest service with AI that understands preferences and live context.",
  },
  {
    id: "resorts",
    title: "Resorts",
    description:
      "Coordinate rooms, arrivals, and guest requests across a complex, high-volume operation.",
  },
  {
    id: "apartments",
    title: "Apartments",
    description:
      "Manage self-check-in, messaging, and availability from one connected workspace.",
  },
  {
    id: "hostels",
    title: "Hostels",
    description:
      "Handle high message volume and fast turnover with AI reception and unified bookings.",
  },
];
