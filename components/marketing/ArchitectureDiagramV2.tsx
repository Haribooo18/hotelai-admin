"use client";

import { useRef } from "react";

import { useHeroRuntimeTimeline } from "@/components/marketing/useHeroRuntimeTimeline";
import { ARCHITECTURE_DIAGRAM_V2_BASE_HEIGHT } from "@/lib/marketing/architecture-diagram-v2-geometry";
import {
  isRuntimeHighlighted,
  type HeroRuntimeNodeId,
} from "@/lib/marketing/hero-runtime-events";

/* ArchitectureDiagramV2 — compressed vertical geometry (v2.1). */

const BASE_WIDTH = 806;
/** Was 524; ~17% shorter for desktop copy alignment. */
const BASE_HEIGHT = ARCHITECTURE_DIAGRAM_V2_BASE_HEIGHT;
const VIEWBOX_X = -72;
const VIEWBOX_Y = 0;
const VIEWBOX_WIDTH = 1060;
/** Was 716; matches BASE_HEIGHT compression. */
const VIEWBOX_HEIGHT = 596;
const DIAGRAM_SCALE = 1.394;
const DIAGRAM_OFFSET_X = -70.18;
const DIAGRAM_OFFSET_Y = 4;

const ACCENT = "#00C389";
/** Dormant channel color — green reserved for active event routes. */
const LINE = "#74808c";
const LINE_OPACITY = 0.32;
const CARD_FILL = "#040608";
const SOURCE_STROKE = "rgba(255,255,255,0.06)";
const DEST_STROKE = "rgba(255,255,255,0.09)";
const RUNTIME_STROKE = "rgba(255,255,255,0.16)";
const META_STROKE = "rgba(255,255,255,0.06)";
const JUNCTION = "#6b7280";

const RUNTIME_X = 296.6;
const RUNTIME_Y = 172;
const RUNTIME_W = 212.8;
/** Was 89.6; ~4% shorter. */
const RUNTIME_H = 86;
const RUNTIME_CY = 215;
const RUNTIME_LEFT = 296.6;
const RUNTIME_RIGHT = 509.4;
const NODE_H = 46;

const INBOUND_PATHS: ReadonlyArray<{
  id: string;
  d: string;
}> = [
  { id: "path-website", d: `M202,35 C240,35 260,${RUNTIME_CY} ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-booking-com", d: `M202,95 C240,95 260,${RUNTIME_CY} ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-telegram", d: `M202,155 C240,155 260,${RUNTIME_CY} ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-whatsapp", d: `M202,215 C240,215 260,${RUNTIME_CY} ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-email", d: `M202,275 C240,275 260,${RUNTIME_CY} ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-phone", d: `M202,335 C202,281 233,221 ${RUNTIME_LEFT},${RUNTIME_CY}` },
  { id: "path-walk-in", d: `M202,395 C202,333 228,219 ${RUNTIME_LEFT},${RUNTIME_CY}` },
];

const OUTBOUND_PATHS: ReadonlyArray<{
  id: string;
  d: string;
  /** Runtime → destination travel direction */
  travelD: string;
}> = [
  {
    id: "path-ai-reception",
    d: `M604,35 C566,35 546,${RUNTIME_CY} ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C546,${RUNTIME_CY} 566,35 604,35`,
  },
  {
    id: "path-pms",
    d: `M604,95 C566,95 546,${RUNTIME_CY} ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C546,${RUNTIME_CY} 566,95 604,95`,
  },
  {
    id: "path-revenue",
    d: `M604,155 C566,155 546,${RUNTIME_CY} ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C546,${RUNTIME_CY} 566,155 604,155`,
  },
  {
    id: "path-rooms",
    d: `M604,215 C566,215 546,${RUNTIME_CY} ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C546,${RUNTIME_CY} 566,215 604,215`,
  },
  {
    id: "path-staff",
    d: `M604,275 C566,275 546,${RUNTIME_CY} ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C546,${RUNTIME_CY} 566,275 604,275`,
  },
  {
    id: "path-analytics",
    d: `M604,335 C604,281 573,221 ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C573,221 604,281 604,335`,
  },
  {
    id: "path-integrations",
    d: `M604,395 C604,333 578,219 ${RUNTIME_RIGHT},${RUNTIME_CY}`,
    travelD: `M${RUNTIME_RIGHT},${RUNTIME_CY} C578,219 604,333 604,395`,
  },
];

type ChannelCard = {
  id: HeroRuntimeNodeId;
  label: string;
  y: number;
  icon: "website" | "booking" | "telegram" | "whatsapp" | "email" | "phone" | "walk-in";
};

type OperationCard = {
  id: HeroRuntimeNodeId;
  label: string;
  y: number;
  icon:
    | "reception"
    | "pms"
    | "revenue"
    | "rooms"
    | "staff"
    | "analytics"
    | "integrations";
};

const CHANNEL_CARDS: readonly ChannelCard[] = [
  { id: "website", label: "Website", y: 14, icon: "website" },
  { id: "booking-com", label: "Booking.com", y: 74, icon: "booking" },
  { id: "telegram", label: "Telegram", y: 134, icon: "telegram" },
  { id: "whatsapp", label: "WhatsApp", y: 194, icon: "whatsapp" },
  { id: "email", label: "Email", y: 254, icon: "email" },
  { id: "phone", label: "Phone", y: 314, icon: "phone" },
  { id: "walk-in", label: "Walk-in", y: 374, icon: "walk-in" },
];

const OPERATION_CARDS: readonly OperationCard[] = [
  { id: "ai-reception", label: "AI Reception", y: 14, icon: "reception" },
  { id: "pms", label: "PMS", y: 74, icon: "pms" },
  { id: "revenue", label: "Revenue", y: 134, icon: "revenue" },
  { id: "rooms", label: "Rooms", y: 194, icon: "rooms" },
  { id: "staff", label: "Staff", y: 254, icon: "staff" },
  { id: "analytics", label: "Analytics", y: 314, icon: "analytics" },
  { id: "integrations", label: "Integrations", y: 374, icon: "integrations" },
];

function ChannelIcon({ icon }: { icon: ChannelCard["icon"] }) {
  if (icon === "website") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <rect x="1" y="2" width="12" height="9" rx="1.5" />
        <path d="M1 4.5 H13" />
      </g>
    );
  }
  if (icon === "booking") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <rect x="1" y="2" width="12" height="10" rx="1.5" />
        <path d="M4 1 V3.5 M10 1 V3.5" strokeLinecap="round" />
      </g>
    );
  }
  if (icon === "telegram") {
    return (
      <g
        className="mkt-arch-icon"
        stroke="currentColor"
        strokeWidth={1.1}
        fill="none"
        strokeLinejoin="round"
      >
        <path d="M1 7 L13 3 L10 13 L7.5 9 L1 7 Z" />
      </g>
    );
  }
  if (icon === "whatsapp") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <path d="M7 1.5 C4 1.5 1.5 4 1.5 7 C1.5 8 1.8 9 2.3 9.8 L1.5 12.5 L4.2 11.7 C5 12.1 6 12.5 7 12.5 C10 12.5 12.5 10 12.5 7 C12.5 4 10 1.5 7 1.5 Z" />
      </g>
    );
  }
  if (icon === "email") {
    return (
      <g
        className="mkt-arch-icon"
        stroke="currentColor"
        strokeWidth={1.1}
        fill="none"
        strokeLinejoin="round"
      >
        <rect x="0.5" y="3" width="13" height="9" rx="1.5" />
        <path d="M0.5 4.5 L7 8.5 L13.5 4.5" />
      </g>
    );
  }
  if (icon === "phone") {
    return (
      <g
        className="mkt-arch-icon"
        transform="translate(1 1) scale(0.5)"
        stroke="currentColor"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    );
  }
  return (
    <g
      className="mkt-arch-icon"
      stroke="currentColor"
      strokeWidth={1.1}
      fill="none"
      strokeLinejoin="round"
    >
      <path d="M2 12.5 V6.5 H12 V12.5" />
      <circle cx={7} cy={4.5} r={1.6} />
    </g>
  );
}

function OperationIcon({ icon }: { icon: OperationCard["icon"] }) {
  if (icon === "reception") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <path d="M0.5 1.5 H13.5 C14.2 1.5 14.5 2 14.5 2.5 V9 C14.5 9.5 14.2 10 13.5 10 H6 L3.5 12 V10 H0.5 C0 10 0 9.5 0 9 V2.5 C0 2 0.5 1.5 0.5 1.5 Z" />
        <path d="M3 5.5 H11" strokeLinecap="round" />
      </g>
    );
  }
  if (icon === "pms") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <rect x="1" y="2" width="12" height="11" rx="1.5" />
        <path d="M1 5.5 H13" />
      </g>
    );
  }
  if (icon === "revenue") {
    return (
      <g
        className="mkt-arch-icon"
        stroke="currentColor"
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
      >
        <path d="M0.5 11.5 L4.5 7.5 L7 9.5 L13.5 3" />
        <path d="M0.5 13 H13.5" />
      </g>
    );
  }
  if (icon === "rooms") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <path d="M0.5 7.5 H13.5 V12.5 H0.5 Z" />
        <path d="M3 7.5 V5 C3 3.5 4.5 2.5 7 2.5 C9.5 2.5 11 3.5 11 5 V7.5" />
      </g>
    );
  }
  if (icon === "staff") {
    return (
      <g className="mkt-arch-icon" stroke="currentColor" strokeWidth={1.1} fill="none">
        <circle cx={4.5} cy={4} r={2} />
        <circle cx={10} cy={4.8} r={1.6} />
        <path d="M0.5 12 C1.8 10 3.2 9.2 4.5 9.2 C5.8 9.2 7 10 8 10.8" />
        <path d="M8 10.8 C8.8 9.5 9.7 9.2 10 9.2 C11 9.2 12 10 12.5 11.5" />
      </g>
    );
  }
  if (icon === "analytics") {
    return (
      <g
        className="mkt-arch-icon"
        stroke="currentColor"
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
      >
        <path d="M1 12 V7 M4.5 12 V4.5 M8 12 V8 M11.5 12 V2.5" />
        <path d="M0.5 12.5 H13.5" />
      </g>
    );
  }
  return (
    <g
      className="mkt-arch-icon"
      stroke="currentColor"
      strokeWidth={1.1}
      fill="none"
      strokeLinecap="round"
    >
      <circle cx={3.5} cy={7} r={2} />
      <circle cx={10.5} cy={7} r={2} />
      <path d="M5.5 7 H8.5" />
    </g>
  );
}

export function ArchitectureDiagramV2() {
  const rootRef = useRef<HTMLElement | null>(null);
  const playback = useHeroRuntimeTimeline(rootRef);
  const runtimeActive = isRuntimeHighlighted(playback.phase);

  return (
    <figure
      ref={rootRef}
      className="mkt-architecture-diagram-v2"
      data-runtime-phase={playback.phase}
      data-entrance={playback.entrance}
      data-reduced-motion={playback.reducedMotion ? "true" : undefined}
      aria-hidden
    >
      <svg
        viewBox={`${VIEWBOX_X} ${VIEWBOX_Y} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mkt-architecture-diagram-v2-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${DIAGRAM_OFFSET_X} ${DIAGRAM_OFFSET_Y}) scale(${DIAGRAM_SCALE})`}>
          <defs>
            <pattern
              id="architecture-diagram-v2-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke={LINE}
                strokeOpacity="0.012"
                strokeWidth="0.5"
              />
            </pattern>
            <radialGradient
              id="architecture-diagram-v2-runtime-depth"
              cx="50%"
              cy="38%"
              r="78%"
            >
              <stop offset="0%" stopColor="#121a1a" />
              <stop offset="42%" stopColor="#080c0e" />
              <stop offset="100%" stopColor="#010203" />
            </radialGradient>
            <linearGradient
              id="architecture-diagram-v2-runtime-sheen"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.028)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
            </linearGradient>
            <linearGradient
              id="architecture-diagram-v2-runtime-ack"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
            </linearGradient>
            <linearGradient
              id="architecture-diagram-v2-runtime-sweep"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.045)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <rect
            width={BASE_WIDTH}
            height={BASE_HEIGHT}
            fill="url(#architecture-diagram-v2-grid)"
          />

          {/* Base connectors — dormant infrastructure */}
          <g
            className="mkt-arch-connectors-base"
            aria-hidden
            stroke={LINE}
            strokeOpacity={LINE_OPACITY}
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          >
            {INBOUND_PATHS.map((path, index) => (
              <path
                key={path.id}
                className="mkt-arch-connector mkt-arch-connector--inbound"
                d={path.d}
                data-path={path.id}
                strokeOpacity={0.28 + (index % 3) * 0.04}
              />
            ))}
            {OUTBOUND_PATHS.map((path, index) => (
              <path
                key={path.id}
                className="mkt-arch-connector mkt-arch-connector--outbound"
                d={path.d}
                data-path={path.id}
                strokeOpacity={0.32 + (index % 3) * 0.04}
              />
            ))}
            <path
              className="mkt-arch-connector mkt-arch-connector--spine"
              d={`M403,132 C415,144 391,160 403,${RUNTIME_Y}`}
              strokeOpacity={0.22}
            />
            <path
              className="mkt-arch-connector mkt-arch-connector--spine"
              d={`M403,${RUNTIME_Y + RUNTIME_H} C415,${RUNTIME_Y + RUNTIME_H + 12} 391,264 403,276`}
              strokeOpacity={0.22}
            />
          </g>

          {/* Travel highlights — decorative only */}
          <g
            className="mkt-arch-connectors-travel"
            aria-hidden
            stroke={ACCENT}
            strokeWidth={1.1}
            strokeLinecap="round"
            fill="none"
          >
            {INBOUND_PATHS.map((path) => (
              <path
                key={`travel-${path.id}`}
                className="mkt-arch-path-travel"
                d={path.d}
                data-path={path.id}
                data-active={
                  playback.inboundPathId === path.id ? "true" : undefined
                }
                pathLength={100}
              />
            ))}
            {OUTBOUND_PATHS.map((path) => (
              <path
                key={`travel-${path.id}`}
                className="mkt-arch-path-travel mkt-arch-path-travel--outbound"
                d={path.travelD}
                data-path={path.id}
                data-active={
                  playback.outboundPathId === path.id ? "true" : undefined
                }
                pathLength={100}
              />
            ))}
          </g>

          {/* Junction dots — neutral dormant markers */}
          <g
            className="mkt-arch-junctions"
            aria-hidden
            fill={JUNCTION}
            fillOpacity={0.28}
          >
            {[35, 95, 155, 215, 275, 335, 395].map((cy) => (
              <circle key={`src-j-${cy}`} cx={202} cy={cy} r={2} />
            ))}
            {[35, 95, 155, 215, 275, 335, 395].map((cy) => (
              <circle key={`dst-j-${cy}`} cx={604} cy={cy} r={2} />
            ))}
            <circle cx={RUNTIME_LEFT} cy={RUNTIME_CY} r={2.2} fillOpacity={0.35} />
            <circle cx={RUNTIME_RIGHT} cy={RUNTIME_CY} r={2.2} fillOpacity={0.35} />
            <circle cx={403} cy={RUNTIME_Y} r={1.8} fillOpacity={0.22} />
            <circle cx={403} cy={RUNTIME_Y + RUNTIME_H} r={1.8} fillOpacity={0.22} />
            <circle cx={403} cy={132} r={1.8} fillOpacity={0.18} />
            <circle cx={403} cy={276} r={1.8} fillOpacity={0.18} />
          </g>

          <text
            className="mkt-arch-column-label"
            x={127}
            y={6}
            textAnchor="middle"
            fill="#4b5563"
            fontFamily="system-ui, sans-serif"
            fontSize={8.625}
            fontWeight="600"
            letterSpacing="0.14em"
          >
            GUEST CHANNELS
          </text>
          <text
            className="mkt-arch-column-label"
            x={679}
            y={6}
            textAnchor="middle"
            fill="#4b5563"
            fontFamily="system-ui, sans-serif"
            fontSize={8.625}
            fontWeight="600"
            letterSpacing="0.14em"
          >
            HOTEL OPERATIONS
          </text>

          <g className="mkt-arch-meta mkt-arch-meta--top">
            <rect
              x={265}
              y={100}
              width={275}
              height={32}
              rx={10}
              fill={CARD_FILL}
              fillOpacity={0.45}
              stroke={META_STROKE}
              strokeWidth={1}
            />
            <circle cx={277} cy={116} r={2} fill={JUNCTION} fillOpacity={0.45} />
            <text
              className="mkt-arch-meta-label"
              data-meta="one-workspace"
              data-active={
                playback.metadataId === "one-workspace" ? "true" : undefined
              }
              x={286}
              y={119}
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={10.4}
              fontWeight="500"
            >
              One workspace
            </text>
            <circle cx={393} cy={116} r={2} fill={JUNCTION} fillOpacity={0.45} />
            <text
              className="mkt-arch-meta-label"
              data-meta="one-ai"
              data-active={playback.metadataId === "one-ai" ? "true" : undefined}
              x={402}
              y={119}
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={10.4}
              fontWeight="500"
            >
              One AI
            </text>
            <circle cx={472} cy={116} r={2} fill={JUNCTION} fillOpacity={0.45} />
            <text
              className="mkt-arch-meta-label"
              data-meta="live-data"
              data-active={
                playback.metadataId === "live-data" ? "true" : undefined
              }
              x={481}
              y={119}
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={10.4}
              fontWeight="500"
            >
              Live data
            </text>
          </g>

          {/* MONAVEL hub — dense infrastructural center */}
          <g
            className="mkt-arch-runtime"
            data-active={runtimeActive ? "true" : undefined}
            data-ack={playback.phase === "runtimeActive" ? "true" : undefined}
          >
            <rect
              className="mkt-arch-runtime-depth"
              x={RUNTIME_X}
              y={RUNTIME_Y}
              width={RUNTIME_W}
              height={RUNTIME_H}
              rx={22}
              fill="url(#architecture-diagram-v2-runtime-depth)"
            />
            <rect
              className="mkt-arch-runtime-shell"
              x={RUNTIME_X}
              y={RUNTIME_Y}
              width={RUNTIME_W}
              height={RUNTIME_H}
              rx={22}
              fill="none"
              stroke={RUNTIME_STROKE}
              strokeWidth={1.35}
            />
            <rect
              className="mkt-arch-runtime-inset"
              x={RUNTIME_X + 4}
              y={RUNTIME_Y + 4}
              width={RUNTIME_W - 8}
              height={RUNTIME_H - 8}
              rx={18}
              fill="url(#architecture-diagram-v2-runtime-sheen)"
              stroke="rgba(255,255,255,0.055)"
              strokeWidth={1}
            />
            <rect
              className="mkt-arch-runtime-ack"
              x={RUNTIME_X + 4}
              y={RUNTIME_Y + 4}
              width={RUNTIME_W - 8}
              height={RUNTIME_H - 8}
              rx={18}
              fill="url(#architecture-diagram-v2-runtime-ack)"
              opacity={0}
            />
            <rect
              className="mkt-arch-runtime-sweep"
              x={RUNTIME_X + 4}
              y={RUNTIME_Y + 4}
              width={RUNTIME_W - 8}
              height={RUNTIME_H - 8}
              rx={18}
              fill="url(#architecture-diagram-v2-runtime-sweep)"
              opacity={0}
            />
            <text
              className="mkt-arch-runtime-title"
              x={403}
              y={RUNTIME_CY - 8}
              dominantBaseline="central"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="system-ui, sans-serif"
              fontSize={19.55}
              fontWeight="700"
              letterSpacing="0.16em"
            >
              MONAVEL
            </text>
            <text
              className="mkt-arch-runtime-subtitle"
              x={403}
              y={RUNTIME_CY + 14}
              dominantBaseline="central"
              textAnchor="middle"
              fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
              fontSize={9.8}
              fontWeight="400"
              letterSpacing="0.06em"
            >
              AI Operating System
            </text>
          </g>

          <g className="mkt-arch-meta mkt-arch-meta--bottom">
            <rect
              x={232.47}
              y={276}
              width={341.05}
              height={36}
              rx={10}
              fill={CARD_FILL}
              fillOpacity={0.28}
              stroke={META_STROKE}
              strokeWidth={1}
            />
            <rect
              x={243.37}
              y={282.5}
              width={85.85}
              height={23}
              rx={6}
              fill={CARD_FILL}
              fillOpacity={0.35}
              stroke={META_STROKE}
              strokeWidth={1}
            />
            <g
              className="mkt-arch-icon"
              transform="translate(254.42 285.4) scale(1.15)"
              stroke="currentColor"
              strokeWidth={1.1}
              fill="none"
              strokeLinejoin="round"
            >
              <path d="M7 1.5 L12 4 V7.5 C12 10.5 10 12.5 7 13.5 C4 12.5 2 10.5 2 7.5 V4 Z" />
              <path d="M5.5 7.5 L6.8 8.8 L9.5 6.2" strokeLinecap="round" />
            </g>
            <text
              className="mkt-arch-meta-label"
              data-meta="security"
              data-active={
                playback.metadataId === "security" ? "true" : undefined
              }
              x={276.42}
              y={294}
              dominantBaseline="central"
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={9.6}
              fontWeight="500"
            >
              Security
            </text>
            <rect
              x={345.32}
              y={282.5}
              width={101}
              height={23}
              rx={6}
              fill={CARD_FILL}
              fillOpacity={0.35}
              stroke={META_STROKE}
              strokeWidth={1}
            />
            <g
              className="mkt-arch-icon"
              transform="translate(360.24 285.95) scale(1.15)"
              stroke="currentColor"
              strokeWidth={1.1}
              fill="none"
            >
              <path
                d="M3 5 C4.5 3 6.5 2.5 8 3 C10 4 10.5 6 9.5 7.5"
                strokeLinecap="round"
              />
              <path
                d="M11 9 C9.5 11 7.5 11.5 6 11 C4 10 3.5 8 4.5 6.5"
                strokeLinecap="round"
              />
            </g>
            <text
              className="mkt-arch-meta-label"
              data-meta="real-time"
              data-active={
                playback.metadataId === "real-time" ? "true" : undefined
              }
              x={382.24}
              y={294}
              dominantBaseline="central"
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={9.6}
              fontWeight="500"
            >
              Real-time
            </text>
            <rect
              x={462.42}
              y={282.5}
              width={101}
              height={23}
              rx={6}
              fill={CARD_FILL}
              fillOpacity={0.35}
              stroke={META_STROKE}
              strokeWidth={1}
            />
            <g
              className="mkt-arch-icon"
              transform="translate(473.25 285.95) scale(1.15)"
              stroke="currentColor"
              strokeWidth={1.1}
              fill="none"
            >
              <circle cx={7} cy={7} r={3} />
              <path
                d="M7 2.5 V4 M7 10 V11.5 M2.5 7 H4 M10 7 H11.5"
                strokeLinecap="round"
              />
            </g>
            <text
              className="mkt-arch-meta-label"
              data-meta="automation"
              data-active={
                playback.metadataId === "automation" ? "true" : undefined
              }
              x={495.25}
              y={294}
              dominantBaseline="central"
              fill="#6b7280"
              fontFamily="system-ui, sans-serif"
              fontSize={9.6}
              fontWeight="500"
            >
              Automation
            </text>
          </g>

          {CHANNEL_CARDS.map((card) => {
            const active = playback.sourceId === card.id;
            const showStatus =
              active &&
              Boolean(playback.sourceStatus) &&
              !playback.reducedMotion;
            return (
              <g
                key={card.id}
                className="mkt-arch-node mkt-arch-node--source"
                data-node={card.id}
                data-active={active ? "true" : undefined}
              >
                <rect
                  className="mkt-arch-node-shell"
                  x={52}
                  y={card.y}
                  width={150}
                  height={NODE_H}
                  rx={8}
                  fill={CARD_FILL}
                  fillOpacity={0.55}
                  stroke={SOURCE_STROKE}
                  strokeWidth={1}
                />
                <g transform={`translate(62 ${card.y + (showStatus ? 10 : 15)})`}>
                  <g className="mkt-arch-source-icon">
                    <ChannelIcon icon={card.icon} />
                  </g>
                </g>
                <text
                  className="mkt-arch-node-label"
                  x={82}
                  y={showStatus ? card.y + 20 : card.y + 27}
                  fill="#c4c9d1"
                  fontFamily="system-ui, sans-serif"
                  fontSize={13}
                  fontWeight="500"
                >
                  {card.label}
                </text>
                {showStatus ? (
                  <text
                    className="mkt-arch-source-status"
                    x={82}
                    y={card.y + 34}
                    fill={ACCENT}
                    fontFamily="system-ui, sans-serif"
                    fontSize={8}
                    fontWeight="600"
                    aria-hidden="true"
                  >
                    {playback.sourceStatus}
                  </text>
                ) : null}
              </g>
            );
          })}

          {OPERATION_CARDS.map((card) => {
            const active = playback.destinationId === card.id;
            const secondary =
              playback.secondaryId === card.id && !playback.reducedMotion;
            const showOutcome =
              active &&
              Boolean(playback.outcome) &&
              playback.phase === "destinationActive";
            return (
              <g
                key={card.id}
                className="mkt-arch-node mkt-arch-node--destination"
                data-node={card.id}
                data-active={active ? "true" : undefined}
                data-secondary={secondary ? "true" : undefined}
              >
                <rect
                  className="mkt-arch-node-shell"
                  x={604}
                  y={card.y}
                  width={150}
                  height={NODE_H}
                  rx={8}
                  fill={CARD_FILL}
                  fillOpacity={0.72}
                  stroke={DEST_STROKE}
                  strokeWidth={1}
                />
                <g transform={`translate(614 ${card.y + 15})`}>
                  <OperationIcon icon={card.icon} />
                </g>
                <text
                  className="mkt-arch-node-label"
                  x={634}
                  y={showOutcome ? card.y + 20 : card.y + 27}
                  fill="#d8dce2"
                  fontFamily="system-ui, sans-serif"
                  fontSize={13}
                  fontWeight="500"
                >
                  {card.label}
                </text>
                {showOutcome ? (
                  <text
                    className="mkt-arch-outcome"
                    x={634}
                    y={card.y + 36}
                    fill={ACCENT}
                    fontFamily="system-ui, sans-serif"
                    fontSize={8.5}
                    fontWeight="600"
                    aria-hidden="true"
                  >
                    {playback.outcome}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </figure>
  );
}
