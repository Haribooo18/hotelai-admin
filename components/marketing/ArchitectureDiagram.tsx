const SCALE = 3.05;
const s = (value: number) => Math.round(value * SCALE);
const ICON_SCALE = SCALE * 1.04;

/**
 * Fixed composition grid — all positions derive from hub center and symmetric spans.
 * Base units are design pixels before SCALE is applied.
 */
const GRID = {
  canvasW: 680,
  canvasH: 540,
  cardW: 134,
  cardH: 36,
  cardStep: 65,
  cardCount: 7,
  hubW: 284,
  hubH: 142,
  platformH: 40,
  dataH: 36,
  connectorH: 32,
  cardToTrunk: 22,
  verticalGap: 20,
  sideStart: 88,
  labelY: 54,
} as const;

const WIDTH = s(GRID.canvasW);
const HEIGHT = s(GRID.canvasH);

const ACCENT = "#00C389";
const LINE = ACCENT;
const LINE_OPACITY = 0.28;
const LINE_WIDTH = 1;
const CARD_FILL = "#15191F";
const CARD_STROKE = "rgba(255,255,255,0.08)";
const CARD_RX = s(10);
const HUB_RX = s(26);
const CARD_H = s(GRID.cardH);
const CARD_W = s(GRID.cardW);
const DOT_R = s(2.5);

const HUB_CX = s(GRID.canvasW / 2);
const HUB_W = s(GRID.hubW);
const HUB_H = s(GRID.hubH);
const HUB_X = HUB_CX - HUB_W / 2;
const HUB_LEFT = HUB_X;
const HUB_RIGHT = HUB_X + HUB_W;

function buildLayout() {
  const hubCy =
    s(GRID.sideStart) +
    CARD_H / 2 +
    ((GRID.cardCount - 1) * s(GRID.cardStep)) / 2;
  const hubY = hubCy - HUB_H / 2;
  const hubTop = hubY;
  const hubBottom = hubY + HUB_H;

  const platformBarH = s(GRID.platformH);
  const platformGap = s(GRID.verticalGap);
  const platformBarBottom = hubTop - platformGap;
  const platformBarY = platformBarBottom - platformBarH;
  const platformBarW = HUB_W;
  const platformBarX = HUB_CX - platformBarW / 2;

  const dataGap = s(GRID.verticalGap);
  const dataH = s(GRID.dataH);
  const dataW = Math.round(HUB_W * 0.8);
  const dataY = hubBottom + dataGap;
  const dataX = HUB_CX - dataW / 2;

  const connectorH = s(GRID.connectorH);
  const cardToTrunk = s(GRID.cardToTrunk);
  const leftTrunkX = HUB_LEFT - connectorH;
  const rightTrunkX = HUB_RIGHT + connectorH;
  const leftEdge = leftTrunkX - cardToTrunk;
  const leftX = leftEdge - CARD_W;
  const rightX = rightTrunkX + cardToTrunk;

  const sideY = Array.from(
    { length: GRID.cardCount },
    (_, index) => s(GRID.sideStart) + index * s(GRID.cardStep),
  );

  const contentTop = s(GRID.labelY);
  const contentBottom = dataY + dataH;
  const contentOffsetY = Math.round((HEIGHT - (contentBottom - contentTop)) / 2 - contentTop);

  return {
    hubY,
    hubTop,
    hubBottom,
    hubCy,
    platformBarH,
    platformBarW,
    platformBarX,
    platformBarY,
    platformBarBottom,
    dataW,
    dataH,
    dataX,
    dataY,
    dataTop: dataY,
    leftTrunkX,
    rightTrunkX,
    leftX,
    leftEdge,
    rightX,
    sideY,
    contentOffsetY,
  };
}

const L = buildLayout();

const HUB_Y = L.hubY;
const HUB_TOP = L.hubTop;
const HUB_BOTTOM = L.hubBottom;
const HUB_CY = L.hubCy;
const PLATFORM_BAR_W = L.platformBarW;
const PLATFORM_BAR_H = L.platformBarH;
const PLATFORM_BAR_X = L.platformBarX;
const PLATFORM_BAR_Y = L.platformBarY;
const PLATFORM_BAR_BOTTOM = L.platformBarBottom;
const DATA_W = L.dataW;
const DATA_H = L.dataH;
const DATA_X = L.dataX;
const DATA_Y = L.dataY;
const DATA_TOP = L.dataTop;
const LEFT_TRUNK_X = L.leftTrunkX;
const RIGHT_TRUNK_X = L.rightTrunkX;
const LEFT_X = L.leftX;
const LEFT_EDGE = L.leftEdge;
const RIGHT_X = L.rightX;
const SIDE_Y = L.sideY;
const CONTENT_OFFSET_Y = L.contentOffsetY;

const GUEST_CHANNELS = [
  { label: "Website", icon: "website" },
  { label: "Booking.com", icon: "booking" },
  { label: "Telegram", icon: "telegram" },
  { label: "WhatsApp", icon: "whatsapp" },
  { label: "Email", icon: "email" },
  { label: "Phone", icon: "phone" },
  { label: "Walk-in", icon: "walk-in" },
] as const;

const HOTEL_OPERATIONS = [
  { label: "AI Reception", icon: "reception" },
  { label: "PMS", icon: "pms" },
  { label: "Revenue", icon: "revenue" },
  { label: "Rooms", icon: "rooms" },
  { label: "Staff", icon: "staff" },
  { label: "Analytics", icon: "analytics" },
  { label: "Integrations", icon: "integrations" },
] as const;

const PLATFORM_CAPABILITIES = [
  { label: "One Workspace", icon: "workspace" },
  { label: "One AI", icon: "one-ai" },
  { label: "Live Data", icon: "live-data" },
] as const;

const DATA_LAYER_ITEMS = [
  "Unified Guest Profile",
  "Real-time Sync",
  "Security",
  "Automation",
] as const;

type IconName =
  | (typeof GUEST_CHANNELS)[number]["icon"]
  | (typeof HOTEL_OPERATIONS)[number]["icon"]
  | (typeof PLATFORM_CAPABILITIES)[number]["icon"];

function cardCenterY(y: number) {
  return y + CARD_H / 2;
}

function ConnectionDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={DOT_R} fill={ACCENT} fillOpacity={0.5} />;
}

function BlueprintGrid() {
  return (
    <g aria-hidden>
      <defs>
        <pattern
          id="architecture-diagram-grid"
          width={s(24)}
          height={s(24)}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={LINE}
            strokeOpacity="0.018"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#architecture-diagram-grid)" />
    </g>
  );
}

function NodeIcon({ icon }: { icon: IconName }) {
  const stroke = ACCENT;
  const strokeWidth = 1.1 * ICON_SCALE;

  return (
    <g transform={`scale(${ICON_SCALE})`}>
      {icon === "website" && (
        <>
          <rect x="1" y="2" width="12" height="9" rx="1.5" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M1 4.5 H13" stroke={stroke} strokeWidth={strokeWidth} />
        </>
      )}
      {icon === "booking" && (
        <>
          <rect x="1" y="2" width="12" height="10" rx="1.5" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M4 1 V3.5 M10 1 V3.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
      {icon === "telegram" && (
        <path
          d="M1 7 L13 3 L10 13 L7.5 9 L1 7 Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}
      {icon === "whatsapp" && (
        <path
          d="M7 1.5 C4 1.5 1.5 4 1.5 7 C1.5 8 1.8 9 2.3 9.8 L1.5 12.5 L4.2 11.7 C5 12.1 6 12.5 7 12.5 C10 12.5 12.5 10 12.5 7 C12.5 4 10 1.5 7 1.5 Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {icon === "email" && (
        <>
          <rect x="0.5" y="3" width="13" height="9" rx="1.5" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M0.5 4.5 L7 8.5 L13.5 4.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </>
      )}
      {icon === "phone" && (
        <path
          d="M4.5 1.5 C4.5 1.5 5.2 1 7 1 C8.8 1 9.5 2.2 9.5 3.5 C9.5 5 8.2 5.8 6.8 6.5 L6.8 8.5 C8.8 9.2 10.5 8.8 12 7.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      {icon === "walk-in" && (
        <>
          <path d="M2 12.5 V6.5 H12 V12.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <circle cx="7" cy="4.5" r="1.6" stroke={stroke} strokeWidth={strokeWidth} />
        </>
      )}
      {icon === "workspace" && (
        <>
          <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="7.5" y="1" width="5.5" height="5.5" rx="1" stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="1" y="7.5" width="5.5" height="5.5" rx="1" stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1" stroke={stroke} strokeWidth={strokeWidth} />
        </>
      )}
      {icon === "one-ai" && (
        <>
          <circle cx="7" cy="7" r="4.5" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="7" cy="7" r="1.5" fill={stroke} fillOpacity="0.65" />
        </>
      )}
      {icon === "live-data" && (
        <>
          <path d="M1 12 H13" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M3 12 V8 M7 12 V5 M11 12 V9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
      {icon === "reception" && (
        <>
          <path
            d="M0.5 1.5 H13.5 C14.2 1.5 14.5 2 14.5 2.5 V9 C14.5 9.5 14.2 10 13.5 10 H6 L3.5 12 V10 H0.5 C0 10 0 9.5 0 9 V2.5 C0 2 0.5 1.5 0.5 1.5 Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <path d="M3 5.5 H11" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
      {icon === "pms" && (
        <>
          <rect x="1" y="2" width="12" height="11" rx="1.5" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M1 5.5 H13" stroke={stroke} strokeWidth={strokeWidth} />
        </>
      )}
      {icon === "revenue" && (
        <>
          <path d="M0.5 11.5 L4.5 7.5 L7 9.5 L13.5 3" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M0.5 13 H13.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
      {icon === "rooms" && (
        <>
          <path d="M0.5 7.5 H13.5 V12.5 H0.5 Z" stroke={stroke} strokeWidth={strokeWidth} />
          <path
            d="M3 7.5 V5 C3 3.5 4.5 2.5 7 2.5 C9.5 2.5 11 3.5 11 5 V7.5"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </>
      )}
      {icon === "staff" && (
        <>
          <circle cx="4.5" cy="4" r="2" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="10" cy="4.8" r="1.6" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M0.5 12 C1.8 10 3.2 9.2 4.5 9.2 C5.8 9.2 7 10 8 10.8" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M8 10.8 C8.8 9.5 9.7 9.2 10 9.2 C11 9.2 12 10 12.5 11.5" stroke={stroke} strokeWidth={strokeWidth} />
        </>
      )}
      {icon === "analytics" && (
        <>
          <path
            d="M1 12 V7 M4.5 12 V4.5 M8 12 V8 M11.5 12 V2.5"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path d="M0.5 12.5 H13.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
      {icon === "integrations" && (
        <>
          <circle cx="3.5" cy="7" r="2" stroke={stroke} strokeWidth={strokeWidth} />
          <circle cx="10.5" cy="7" r="2" stroke={stroke} strokeWidth={strokeWidth} />
          <path d="M5.5 7 H8.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function SectionLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="#6b7280"
      fontFamily="system-ui, sans-serif"
      fontSize={s(7.5)}
      fontWeight="600"
      letterSpacing="0.14em"
    >
      {label}
    </text>
  );
}

type NodeCardProps = {
  x: number;
  y: number;
  width: number;
  label: string;
  icon: IconName;
};

function NodeCard({ x, y, width, label, icon }: NodeCardProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={CARD_H}
        rx={CARD_RX}
        fill={CARD_FILL}
        stroke={CARD_STROKE}
        strokeWidth={1}
      />
      <g transform={`translate(${x + s(10)} ${y + CARD_H / 2 - s(7) * ICON_SCALE})`}>
        <NodeIcon icon={icon} />
      </g>
      <text
        x={x + s(30)}
        y={y + CARD_H / 2 + s(4)}
        fill="#e5e7eb"
        fontFamily="system-ui, sans-serif"
        fontSize={s(10)}
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  );
}

function SideBusConnections() {
  const trunkTop = cardCenterY(SIDE_Y[0]);
  const trunkBottom = cardCenterY(SIDE_Y[SIDE_Y.length - 1]);

  return (
    <g aria-hidden>
      <line
        x1={LEFT_TRUNK_X}
        y1={trunkTop}
        x2={LEFT_TRUNK_X}
        y2={trunkBottom}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      {SIDE_Y.map((y) => {
        const centerY = cardCenterY(y);
        return (
          <g key={`left-${y}`}>
            <line
              x1={LEFT_EDGE}
              y1={centerY}
              x2={LEFT_TRUNK_X}
              y2={centerY}
              stroke={LINE}
              strokeOpacity={LINE_OPACITY}
              strokeWidth={LINE_WIDTH}
            />
            <ConnectionDot x={LEFT_TRUNK_X} y={centerY} />
          </g>
        );
      })}
      <line
        x1={LEFT_TRUNK_X}
        y1={HUB_CY}
        x2={HUB_LEFT}
        y2={HUB_CY}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      <ConnectionDot x={LEFT_TRUNK_X} y={HUB_CY} />
      <ConnectionDot x={HUB_LEFT} y={HUB_CY} />

      <line
        x1={RIGHT_TRUNK_X}
        y1={trunkTop}
        x2={RIGHT_TRUNK_X}
        y2={trunkBottom}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      <line
        x1={HUB_RIGHT}
        y1={HUB_CY}
        x2={RIGHT_TRUNK_X}
        y2={HUB_CY}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      <ConnectionDot x={HUB_RIGHT} y={HUB_CY} />
      <ConnectionDot x={RIGHT_TRUNK_X} y={HUB_CY} />
      {SIDE_Y.map((y) => {
        const centerY = cardCenterY(y);
        return (
          <g key={`right-${y}`}>
            <line
              x1={RIGHT_TRUNK_X}
              y1={centerY}
              x2={RIGHT_X}
              y2={centerY}
              stroke={LINE}
              strokeOpacity={LINE_OPACITY}
              strokeWidth={LINE_WIDTH}
            />
            <ConnectionDot x={RIGHT_TRUNK_X} y={centerY} />
          </g>
        );
      })}
    </g>
  );
}

function VerticalConnections() {
  return (
    <g aria-hidden>
      <line
        x1={HUB_CX}
        y1={PLATFORM_BAR_BOTTOM}
        x2={HUB_CX}
        y2={HUB_TOP}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      <ConnectionDot x={HUB_CX} y={PLATFORM_BAR_BOTTOM} />
      <ConnectionDot x={HUB_CX} y={HUB_TOP} />

      <line
        x1={HUB_CX}
        y1={HUB_BOTTOM}
        x2={HUB_CX}
        y2={DATA_TOP}
        stroke={LINE}
        strokeOpacity={LINE_OPACITY}
        strokeWidth={LINE_WIDTH}
      />
      <ConnectionDot x={HUB_CX} y={HUB_BOTTOM} />
      <ConnectionDot x={HUB_CX} y={DATA_TOP} />
    </g>
  );
}

function PlatformCapabilityBar() {
  const slotWidth = PLATFORM_BAR_W / PLATFORM_CAPABILITIES.length;
  const iconY = PLATFORM_BAR_Y + PLATFORM_BAR_H / 2 - s(7) * ICON_SCALE;

  return (
    <g>
      <rect
        x={PLATFORM_BAR_X}
        y={PLATFORM_BAR_Y}
        width={PLATFORM_BAR_W}
        height={PLATFORM_BAR_H}
        rx={s(12)}
        fill={CARD_FILL}
        fillOpacity="0.72"
        stroke={CARD_STROKE}
        strokeWidth={1}
      />
      {PLATFORM_CAPABILITIES.map((item, index) => {
        const slotCenter = PLATFORM_BAR_X + slotWidth * index + slotWidth / 2;
        const labelWidth = s(76);
        const iconX = slotCenter - labelWidth / 2;
        return (
          <g key={item.label} opacity="0.9">
            <g transform={`translate(${iconX} ${iconY})`}>
              <NodeIcon icon={item.icon} />
            </g>
            <text
              x={iconX + s(18)}
              y={PLATFORM_BAR_Y + PLATFORM_BAR_H / 2 + s(4)}
              fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
              fontSize={s(8)}
              fontWeight="500"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function DataLayer() {
  const chipGap = s(12);
  const innerPadding = s(10);
  const innerW = DATA_W - innerPadding * 2;
  const chipH = s(20);
  const chipW = (innerW - chipGap * 3) / 4;
  const chipY = DATA_Y + (DATA_H - chipH) / 2;
  const startX = DATA_X + innerPadding;

  return (
    <g>
      <rect
        x={DATA_X}
        y={DATA_Y}
        width={DATA_W}
        height={DATA_H}
        rx={s(12)}
        fill={CARD_FILL}
        fillOpacity="0.55"
        stroke={CARD_STROKE}
        strokeWidth={1}
      />
      {DATA_LAYER_ITEMS.map((label, index) => {
        const x = startX + index * (chipW + chipGap);
        return (
          <g key={label}>
            <rect
              x={x}
              y={chipY}
              width={chipW}
              height={chipH}
              rx={s(8)}
              fill="#10141a"
              fillOpacity="0.65"
              stroke={CARD_STROKE}
              strokeWidth={1}
            />
            <text
              x={x + chipW / 2}
              y={chipY + chipH / 2 + s(3)}
              textAnchor="middle"
              fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
              fontSize={s(6.5)}
              fontWeight="500"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure className="mkt-hero-architecture mkt-architecture-diagram" aria-hidden>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mkt-hero-architecture-svg mkt-architecture-diagram-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <BlueprintGrid />
        <g transform={`translate(0 ${CONTENT_OFFSET_Y})`}>
          <SideBusConnections />
          <VerticalConnections />

          <SectionLabel x={LEFT_X + CARD_W / 2} y={s(GRID.labelY) + CONTENT_OFFSET_Y} label="GUEST CHANNELS" />
          <SectionLabel
            x={RIGHT_X + CARD_W / 2}
            y={s(GRID.labelY) + CONTENT_OFFSET_Y}
            label="HOTEL OPERATIONS"
          />

          <PlatformCapabilityBar />

          {GUEST_CHANNELS.map((node, index) => (
            <NodeCard
              key={node.label}
              x={LEFT_X}
              y={SIDE_Y[index]}
              width={CARD_W}
              label={node.label}
              icon={node.icon}
            />
          ))}

          <rect
            x={HUB_X}
            y={HUB_Y}
            width={HUB_W}
            height={HUB_H}
            rx={HUB_RX}
            fill={CARD_FILL}
            stroke={CARD_STROKE}
            strokeWidth={1}
          />
          <text
            x={HUB_CX}
            y={HUB_Y + s(60)}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="system-ui, sans-serif"
            fontSize={s(24)}
            fontWeight="700"
            letterSpacing="0.16em"
          >
            MONAVEL
          </text>
          <text
            x={HUB_CX}
            y={HUB_Y + s(88)}
            textAnchor="middle"
            fill="#6b7280"
            fontFamily="system-ui, sans-serif"
            fontSize={s(8.5)}
            fontWeight="400"
            letterSpacing="0.06em"
          >
            AI Operating System
          </text>

          {HOTEL_OPERATIONS.map((node, index) => (
            <NodeCard
              key={node.label}
              x={RIGHT_X}
              y={SIDE_Y[index]}
              width={CARD_W}
              label={node.label}
              icon={node.icon}
            />
          ))}

          <DataLayer />
        </g>
      </svg>
    </figure>
  );
}
