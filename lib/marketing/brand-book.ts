/**
 * Monavel Brand Guidelines v1 — internal design specification content.
 * Visual source of truth rendered at `/brand`. Not a marketing surface.
 */

import { BRAND_ASSETS, BRAND_PALETTE } from "@/lib/brand";
import { MKT_MOTION, MKT_MOTION_EASE } from "@/lib/marketing/motion";
import { MKT_CTA, MKT_KPI, MKT_STATUS } from "@/lib/marketing/product-language";

export const BRAND_BOOK = {
  path: "/brand",
  title: "Brand Book",
  subtitle: "Monavel Brand Guidelines v1",
  description:
    "Internal design specification for Monavel identity, product language, and system tokens.",
  version: "1.0",
  status: "Internal — source of truth",
} as const;

export type BrandBookNavItem = {
  id: string;
  label: string;
};

export const BRAND_BOOK_NAV: readonly BrandBookNavItem[] = [
  { id: "philosophy", label: "1. Brand Philosophy" },
  { id: "personality", label: "2. Brand Personality" },
  { id: "principles", label: "3. Brand Principles" },
  { id: "logo", label: "4. Logo" },
  { id: "color-system", label: "5. Color System" },
  { id: "color-usage", label: "6. Color Usage" },
  { id: "typography", label: "7. Typography" },
  { id: "spacing", label: "8. Spacing" },
  { id: "components", label: "9. Components" },
  { id: "motion", label: "10. Motion" },
  { id: "photography", label: "11. Photography" },
  { id: "illustration", label: "12. Illustration" },
  { id: "iconography", label: "13. Iconography" },
  { id: "voice", label: "14. Voice & Tone" },
  { id: "product-language", label: "15. Product Language" },
  { id: "applications", label: "16. Brand Applications" },
  { id: "design-principles", label: "17. Design Principles" },
  { id: "checklist", label: "18. Release Checklist" },
] as const;

export const BRAND_BOOK_PHILOSOPHY = {
  mission: {
    title: "Mission",
    body: "Transform every hotel into an autonomous AI-powered operation.",
  },
  vision: {
    title: "Vision",
    body: "Monavel becomes the operating system connecting guests, staff, data and automation into one intelligent workspace.",
  },
  positioning: {
    title: "Positioning",
    body: "AI Operating System for Hotels.",
  },
  notList: ["chatbot", "PMS", "CRM"] as const,
  clarification:
    "Monavel is the Operating System sitting above all hotel systems. It connects reservations, guest communication, operations, knowledge, revenue, and automation into one Runtime — without replacing the systems of record hotels already trust.",
} as const;

export const BRAND_BOOK_PERSONALITY = {
  is: [
    "Calm",
    "Intelligent",
    "Premium",
    "Operational",
    "Reliable",
    "Invisible technology",
  ] as const,
  never: [
    "Playful",
    "Flashy",
    "Crypto",
    "Startup hype",
    "Enterprise corporate",
    "Futuristic for the sake of being futuristic",
  ] as const,
} as const;

export const BRAND_BOOK_PRINCIPLES = [
  {
    id: "intelligence",
    title: "Intelligence",
    body: "Understanding comes before action. Context from reservations, rooms, channels, and policy becomes one operational picture.",
  },
  {
    id: "automation",
    title: "Automation",
    body: "Routine work executes quietly across connected systems. Staff intervene when judgment matters — not to move data by hand.",
  },
  {
    id: "hospitality",
    title: "Hospitality",
    body: "Every interaction respects the guest and the property. Speed never replaces care; clarity never replaces warmth.",
  },
  {
    id: "trust",
    title: "Trust",
    body: "Human oversight, audit trails, and reliable sync make the platform safe to run a real hotel.",
  },
] as const;

export const BRAND_BOOK_LOGO = {
  assets: [
    {
      id: "primary-lockup",
      title: "Primary Lockup",
      path: BRAND_ASSETS.lockup,
      note: "Master stacked lockup for large identity, presentations, and brand surfaces.",
    },
    {
      id: "horizontal-lockup",
      title: "Horizontal Lockup",
      path: BRAND_ASSETS.horizontal,
      note: "Default for navigation, footer, documentation, authentication, and product chrome.",
    },
    {
      id: "monogram",
      title: "Monogram",
      path: BRAND_ASSETS.mark,
      note: "Symbol only — app chrome, favicon source, dense UI.",
    },
    {
      id: "wordmark",
      title: "Wordmark",
      path: BRAND_ASSETS.wordmark,
      note: "Use only when the symbol already exists separately. Do not introduce new uses.",
    },
    {
      id: "app-icon",
      title: "App Icon",
      path: BRAND_ASSETS.mark,
      note: "Derived from the monogram.",
    },
  ] as const,
  rules: [
    "Use official SVG sources from /brand only.",
    "Keep clear space equal to the height of the monogram on all sides.",
    "Minimum digital size: mark 16px; horizontal lockup 88px wide.",
    "Use the stacked lockup for large identity — never scale it into navigation chrome.",
    "Prefer brand gold or monochrome on brand surfaces.",
  ] as const,
  incorrect: [
    "Stretching or compressing",
    "Recoloring outside approved brand colors",
    "Drop shadows or glows",
    "Outlines or strokes",
    "Rotating",
    "Changing proportions",
  ] as const,
} as const;

export type BrandBookColor = {
  id: string;
  name: string;
  hex: string;
  cssVar: string;
  usage: string;
};

export const BRAND_BOOK_COLORS: readonly BrandBookColor[] = [
  {
    id: "black",
    name: "Black",
    hex: BRAND_PALETTE.black,
    cssVar: "--brand-black",
    usage: "Primary brand surface. Documentation and identity backgrounds.",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    hex: BRAND_PALETTE.charcoal,
    cssVar: "--brand-charcoal",
    usage: "Raised brand surfaces, panels, and quiet containers.",
  },
  {
    id: "green",
    name: "Brand Green",
    hex: BRAND_PALETTE.green,
    cssVar: "--brand-green",
    usage: "Identity graphics, illustration fields, subtle brand gradients.",
  },
  {
    id: "gold",
    name: "Brand Gold",
    hex: BRAND_PALETTE.gold,
    cssVar: "--brand-gold",
    usage: "Logo, premium identity, print, and presentation materials.",
  },
  {
    id: "white",
    name: "White",
    hex: BRAND_PALETTE.white,
    cssVar: "--brand-white",
    usage: "Primary text and high-contrast marks on dark brand surfaces.",
  },
  {
    id: "gray",
    name: "Gray",
    hex: BRAND_PALETTE.gray,
    cssVar: "--brand-gray",
    usage: "Secondary text, captions, and quiet labels in brand materials.",
  },
] as const;

export const BRAND_BOOK_COLOR_USAGE = [
  {
    id: "brand-gold",
    title: "Brand Gold",
    only: [
      "Logo",
      "Identity",
      "Presentations",
      "Premium materials",
      "Print",
    ] as const,
    never: ["Buttons", "Success", "Links", "Charts"] as const,
  },
  {
    id: "product-green",
    title: "Product Green",
    note: "Existing product UI accent (`--mkt-accent` / `--shell-accent`). Not brand gold.",
    only: [
      "Buttons",
      "AI",
      "Status",
      "KPIs",
      "Revenue",
      "Success",
    ] as const,
    never: ["Logo fill as default identity", "Print stationery"] as const,
  },
  {
    id: "brand-green",
    title: "Brand Green",
    only: [
      "Backgrounds",
      "Identity graphics",
      "Illustrations",
      "Gradients",
    ] as const,
    never: ["Primary interactive controls", "Success indicators"] as const,
  },
] as const;

export type BrandBookTypeSpecimen = {
  id: string;
  name: string;
  token: string;
  sample: string;
  role: string;
};

export const BRAND_BOOK_TYPE: readonly BrandBookTypeSpecimen[] = [
  {
    id: "display",
    name: "Display",
    token: "--mkt-type-display",
    sample: "Everything your hotel needs.",
    role: "Hero statements. Rare. One per composition.",
  },
  {
    id: "h1",
    name: "H1",
    token: "--mkt-type-h1",
    sample: "One Runtime. Every perspective.",
    role: "Page titles and primary documentation headings.",
  },
  {
    id: "h2",
    name: "H2",
    token: "--mkt-type-h2",
    sample: "Built to run a real hotel",
    role: "Section titles.",
  },
  {
    id: "h3",
    name: "H3",
    token: "--mkt-type-h3",
    sample: "Guest context stays synced",
    role: "Subsection titles and card headlines.",
  },
  {
    id: "body",
    name: "Body",
    token: "--mkt-type-body",
    sample:
      "Run reservations, guest communication, hotel operations, and AI reception from one connected workspace.",
    role: "Primary reading text.",
  },
  {
    id: "small",
    name: "Small",
    token: "--mkt-type-small",
    sample: "Works with your existing PMS.",
    role: "Secondary supporting copy and dense UI.",
  },
  {
    id: "metric",
    name: "Metric",
    token: "--mkt-type-metric",
    sample: "$9.2k",
    role: "KPI values and operational numbers.",
  },
  {
    id: "caption",
    name: "Caption",
    token: "--mkt-type-caption",
    sample: "Room 407 · Live",
    role: "Metadata, timestamps, quiet labels.",
  },
] as const;

export const BRAND_BOOK_TYPE_NOTES = {
  hierarchy:
    "Display → H1 → H2 → H3 → Body → Small → Metric / Caption. Never skip levels for decoration.",
  readingWidth:
    "Prose measure stays near 58ch (`--mkt-prose-max`). Body max 64ch. Headlines may be shorter.",
  rhythm:
    "Stack with `--mkt-stack-*`. Section headers use `--mkt-section-header-gap`. Prefer quiet vertical rhythm over large empty fields.",
} as const;

export const BRAND_BOOK_SPACING = [
  { token: "--mkt-space-1", px: 8, rem: "0.5rem" },
  { token: "--mkt-space-2", px: 12, rem: "0.75rem" },
  { token: "--mkt-space-3", px: 16, rem: "1rem" },
  { token: "--mkt-space-4", px: 24, rem: "1.5rem" },
  { token: "--mkt-space-5", px: 32, rem: "2rem" },
  { token: "--mkt-space-6", px: 48, rem: "3rem" },
  { token: "--mkt-space-7", px: 64, rem: "4rem" },
  { token: "--mkt-space-8", px: 96, rem: "6rem" },
] as const;

export const BRAND_BOOK_SPACING_NOTES = {
  section:
    "Section vertical rhythm uses `--mkt-section-y-tight`, `--mkt-section-y`, `--mkt-section-y-loose`.",
  card: "Card padding defaults to `--mkt-card-padding` (`--mkt-space-4`).",
  stack: "In-component stacks: `--mkt-stack-xs` through `--mkt-stack-xl`.",
  gap: "Grid and flex gaps: `--mkt-gap` and `--mkt-gap-lg`.",
} as const;

export const BRAND_BOOK_COMPONENTS = [
  {
    id: "cards",
    title: "Cards",
    body: "Quiet containers for interaction or grouped content. Prefer border emphasis over heavy shadow. Hover lift is 2px when interactive.",
  },
  {
    id: "buttons",
    title: "Buttons",
    body: "Primary uses product accent. Secondary and ghost stay quiet. CTAs use canonical labels from product language.",
  },
  {
    id: "badges",
    title: "Badges",
    body: "Short status or category labels. Overline size. Never decorative pill clusters.",
  },
  {
    id: "status",
    title: "Status",
    body: "Canonical verbs only: Connected, Online, Synced, Booked, Approved, Delivered, Confirmed, Scheduled. Calm opacity — no blinking.",
  },
  {
    id: "kpis",
    title: "KPIs",
    body: "Short names (Revenue, Response Time, Guests). Metric type for values. Count once on enter.",
  },
  {
    id: "accordions",
    title: "Accordions",
    body: "One duration, one easing, height/opacity transitions. FAQ and comparison share the same language.",
  },
  {
    id: "lists",
    title: "Lists",
    body: "Operational bullets with restrained markers. Prefer clarity over ornament.",
  },
  {
    id: "chat",
    title: "Chat bubbles",
    body: "Guest left, AI right. Short operational replies. Never marketing enthusiasm.",
  },
] as const;

export const BRAND_BOOK_MOTION = {
  range: "150–250ms for UI transitions (Fast / Normal / Slow).",
  ease: MKT_MOTION_EASE,
  durations: [
    { name: "Fast", ms: MKT_MOTION.fast },
    { name: "Normal", ms: MKT_MOTION.normal },
    { name: "Slow", ms: MKT_MOTION.slow },
  ] as const,
  allowed: [
    "Opacity",
    "Small translate (≈6px reveals, 2px card hover)",
    "Shared ease-out",
  ] as const,
  forbidden: [
    "Bounce",
    "Scale explosions",
    "Decorative animation",
    "Elastic overshoot",
  ] as const,
  reducedMotion:
    "Respect prefers-reduced-motion. Replace movement with opacity. Keep controls usable.",
} as const;

export const BRAND_BOOK_PHOTOGRAPHY = {
  preferred: [
    "Luxury hotels",
    "Architecture",
    "Natural materials",
    "Warm lighting",
    "Minimal interiors",
  ] as const,
  avoid: [
    "Stock business teams",
    "Corporate handshakes",
    "People pointing at laptops",
    "Random AI imagery",
  ] as const,
} as const;

export const BRAND_BOOK_ILLUSTRATION = {
  feel: ["Operational", "Minimal", "Technical", "Dark", "Elegant"] as const,
  never: ["Cartoon", "SaaS-isometric"] as const,
} as const;

export const BRAND_BOOK_ICONOGRAPHY = [
  "Thin stroke",
  "Rounded corners",
  "Consistent weight",
  "No filled icons as the default system style",
] as const;

export const BRAND_BOOK_VOICE = {
  good: [
    "Reservation confirmed.",
    "Guest notified.",
    "Transfer booked.",
  ] as const,
  bad: ["Great!", "Amazing!", "Our revolutionary AI..."] as const,
  rule: "Keep language operational. Short. Confident. Never hype.",
} as const;

export const BRAND_BOOK_PRODUCT_LANGUAGE = {
  statuses: Object.values(MKT_STATUS),
  kpis: Object.values(MKT_KPI),
  ctas: Object.values(MKT_CTA),
  rule: "Never invent synonyms for the same meaning.",
} as const;

export const BRAND_BOOK_APPLICATIONS = [
  "Website",
  "Dashboard",
  "Admin",
  "Email",
  "Presentation",
  "Business card",
  "Social media",
  "PWA",
  "App icon",
  "Documentation",
] as const;

export const BRAND_BOOK_DESIGN_PRINCIPLE = {
  ask: "Does this feel like an operating system?",
  not: "Does this simply look beautiful?",
  answer: "Beauty is a consequence of clarity.",
} as const;

export const BRAND_BOOK_CHECKLIST = [
  "Correct logo",
  "Correct colors",
  "Correct spacing",
  "Correct typography",
  "Correct terminology",
  "Correct motion",
  "Correct tone",
  "Correct hierarchy",
  "Premium appearance",
  "Operational feeling",
] as const;
