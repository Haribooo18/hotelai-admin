/* ArchitectureDiagramV2 — hardcoded coordinates only. Visual source: hero reference PNG. */

const BASE_WIDTH = 806;
const BASE_HEIGHT = 524;
const VIEWBOX_X = -72;
const VIEWBOX_Y = 0;
const VIEWBOX_WIDTH = 1060;
const VIEWBOX_HEIGHT = 716;
const DIAGRAM_SCALE = 1.394;
const DIAGRAM_OFFSET_X = -70.18;
const DIAGRAM_OFFSET_Y = 10;

const ACCENT = "#00C389";
const LINE = "#00DC8A";
const LINE_OPACITY = 0.42;
const CARD_FILL = "#040608";
const CARD_STROKE = "rgba(255,255,255,0.08)";

export function ArchitectureDiagramV2() {
  return (
    <figure className="mkt-architecture-diagram-v2">
      <svg
        viewBox={`${VIEWBOX_X} ${VIEWBOX_Y} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mkt-architecture-diagram-v2-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${DIAGRAM_OFFSET_X} ${DIAGRAM_OFFSET_Y}) scale(${DIAGRAM_SCALE})`}>
          {/* Blueprint grid */}
          <defs>
            <pattern id="architecture-diagram-v2-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke={LINE}
                strokeOpacity="0.018"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={BASE_WIDTH} height={BASE_HEIGHT} fill="url(#architecture-diagram-v2-grid)" />

          {/* ── Connector lines — fully redrawn as organic fan-in curves; every card wires directly
               into MONAVEL with a single flowing Bézier, no shared bus / no orthogonal routing ── */}
          <g aria-hidden stroke={LINE} strokeOpacity={LINE_OPACITY} strokeWidth={1} strokeLinecap="round" fill="none">
            {/* Left column — each card curves organically into MONAVEL's left edge */}
            <path d="M202,38 C240,38 260,259.84 296.6,259.84" />
            <path d="M202,111.28 C240,111.28 260,259.84 296.6,259.84" />
            <path d="M202,184.56 C240,184.56 260,259.84 296.6,259.84" />
            <path d="M202,257.84 C240,257.84 260,259.84 296.6,259.84" />
            <path d="M202,331.12 C240,331.12 260,259.84 296.6,259.84" />
            <path d="M202,404.4 C202,350 233,266 296.6,259.84" />
            <path d="M202,477.68 C202,415 228,264 296.6,259.84" />
            {/* Right column — each card curves organically into MONAVEL's right edge */}
            <path d="M604,38 C566,38 546,259.84 509.4,259.84" />
            <path d="M604,111.28 C566,111.28 546,259.84 509.4,259.84" />
            <path d="M604,184.56 C566,184.56 546,259.84 509.4,259.84" />
            <path d="M604,257.84 C566,257.84 546,259.84 509.4,259.84" />
            <path d="M604,331.12 C566,331.12 546,259.84 509.4,259.84" />
            <path d="M604,404.4 C604,350 573,266 509.4,259.84" />
            <path d="M604,477.68 C604,415 578,264 509.4,259.84" />
            {/* Top bar → MONAVEL — soft S-curve */}
            <path d="M403,145.04 C415,157.04 391,203.04 403,215.04" />
            {/* MONAVEL → bottom bar — flowing curve with generous negative space before the bar */}
            <path d="M403,304.64 C415,316.64 391,362.64 403,374.64" />
          </g>

          {/* Junction dots */}
          <g aria-hidden fill={ACCENT} fillOpacity={0.5}>
            <circle cx={202} cy={38} r={2.5} />
            <circle cx={202} cy={111.28} r={2.5} />
            <circle cx={202} cy={184.56} r={2.5} />
            <circle cx={202} cy={257.84} r={2.5} />
            <circle cx={202} cy={331.12} r={2.5} />
            <circle cx={202} cy={404.4} r={2.5} />
            <circle cx={202} cy={477.68} r={2.5} />
            <circle cx={604} cy={38} r={2.5} />
            <circle cx={604} cy={111.28} r={2.5} />
            <circle cx={604} cy={184.56} r={2.5} />
            <circle cx={604} cy={257.84} r={2.5} />
            <circle cx={604} cy={331.12} r={2.5} />
            <circle cx={604} cy={404.4} r={2.5} />
            <circle cx={604} cy={477.68} r={2.5} />
            <circle cx={296.6} cy={259.84} r={2.5} />
            <circle cx={509.4} cy={259.84} r={2.5} />
            <circle cx={403} cy={215.04} r={2.5} />
            <circle cx={403} cy={304.64} r={2.5} />
            <circle cx={403} cy={145.04} r={2.5} />
            <circle cx={403} cy={374.64} r={2.5} />
          </g>

          {/* Section labels */}
          <text
            x={127}
            y={8}
            textAnchor="middle"
            fill="#6b7280"
            fontFamily="system-ui, sans-serif"
            fontSize={8.625}
            fontWeight="600"
            letterSpacing="0.14em"
          >
            GUEST CHANNELS
          </text>
          <text
            x={679}
            y={8}
            textAnchor="middle"
            fill="#6b7280"
            fontFamily="system-ui, sans-serif"
            fontSize={8.625}
            fontWeight="600"
            letterSpacing="0.14em"
          >
            HOTEL OPERATIONS
          </text>

          {/* Top capability bar */}
          <rect
            x={265}
            y={109.04}
            width={275}
            height={36}
            rx={10}
            fill={CARD_FILL}
            fillOpacity={0.72}
            stroke={CARD_STROKE}
            strokeWidth={1}
          />
          <circle cx={277} cy={127.04} r={2.5} fill={ACCENT} fillOpacity={0.85} />
          <text x={286} y={130.04} fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={10.4} fontWeight="500">
            One workspace
          </text>
          <circle cx={393} cy={127.04} r={2.5} fill={ACCENT} fillOpacity={0.85} />
          <text x={402} y={130.04} fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={10.4} fontWeight="500">
            One AI
          </text>
          <circle cx={472} cy={127.04} r={2.5} fill={ACCENT} fillOpacity={0.85} />
          <text x={481} y={130.04} fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={10.4} fontWeight="500">
            Live data
          </text>

          {/* MONAVEL hub */}
          <rect
            x={296.6}
            y={215.04}
            width={212.8}
            height={89.6}
            rx={22}
            fill={CARD_FILL}
            stroke={CARD_STROKE}
            strokeWidth={1}
          />
          <text
            x={403}
            y={246.4}
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
            x={403}
            y={267.4}
            dominantBaseline="central"
            textAnchor="middle"
            fill="#6b7280"
            fontFamily="system-ui, sans-serif"
            fontSize={9.8}
            fontWeight="400"
            letterSpacing="0.06em"
          >
            AI Operating System
          </text>

          {/* Bottom capability bar */}
          <rect
            x={232.47}
            y={374.64}
            width={341.05}
            height={43.2}
            rx={10}
            fill={CARD_FILL}
            fillOpacity={0.38}
            stroke={CARD_STROKE}
            strokeWidth={1}
          />
          {/* Security */}
          <rect x={243.37} y={384.74} width={85.85} height={23} rx={6} fill={CARD_FILL} fillOpacity={0.45} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(254.42 387.62) scale(1.15)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinejoin="round">
            <path d="M7 1.5 L12 4 V7.5 C12 10.5 10 12.5 7 13.5 C4 12.5 2 10.5 2 7.5 V4 Z" />
            <path d="M5.5 7.5 L6.8 8.8 L9.5 6.2" strokeLinecap="round" />
          </g>
          <text x={276.42} y={396.24} dominantBaseline="central" fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={9.6} fontWeight="500">
            Security
          </text>
          {/* Real-time */}
          <rect x={345.32} y={384.74} width={101} height={23} rx={6} fill={CARD_FILL} fillOpacity={0.45} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(360.24 388.19) scale(1.15)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <path d="M3 5 C4.5 3 6.5 2.5 8 3 C10 4 10.5 6 9.5 7.5" strokeLinecap="round" />
            <path d="M11 9 C9.5 11 7.5 11.5 6 11 C4 10 3.5 8 4.5 6.5" strokeLinecap="round" />
          </g>
          <text x={382.24} y={396.24} dominantBaseline="central" fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={9.6} fontWeight="500">
            Real-time
          </text>
          {/* Automation */}
          <rect x={462.42} y={384.74} width={101} height={23} rx={6} fill={CARD_FILL} fillOpacity={0.45} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(473.25 388.19) scale(1.15)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <circle cx={7} cy={7} r={3} />
            <path d="M7 2.5 V4 M7 10 V11.5 M2.5 7 H4 M10 7 H11.5" strokeLinecap="round" />
          </g>
          <text x={495.25} y={396.24} dominantBaseline="central" fill="#9ca3af" fontFamily="system-ui, sans-serif" fontSize={9.6} fontWeight="500">
            Automation
          </text>

          {/* Guest Channels — card 1 Website */}
          <rect x={52} y={17} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 32)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <rect x="1" y="2" width="12" height="9" rx="1.5" />
            <path d="M1 4.5 H13" />
          </g>
          <text x={82} y={44} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Website
          </text>

          {/* Guest Channels — card 2 Booking.com */}
          <rect x={52} y={90.28} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 105.28)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <rect x="1" y="2" width="12" height="10" rx="1.5" />
            <path d="M4 1 V3.5 M10 1 V3.5" strokeLinecap="round" />
          </g>
          <text x={82} y={117.28} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Booking.com
          </text>

          {/* Guest Channels — card 3 Telegram */}
          <rect x={52} y={163.56} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 178.56)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinejoin="round">
            <path d="M1 7 L13 3 L10 13 L7.5 9 L1 7 Z" />
          </g>
          <text x={82} y={190.56} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Telegram
          </text>

          {/* Guest Channels — card 4 WhatsApp */}
          <rect x={52} y={236.84} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 251.84)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <path d="M7 1.5 C4 1.5 1.5 4 1.5 7 C1.5 8 1.8 9 2.3 9.8 L1.5 12.5 L4.2 11.7 C5 12.1 6 12.5 7 12.5 C10 12.5 12.5 10 12.5 7 C12.5 4 10 1.5 7 1.5 Z" />
          </g>
          <text x={82} y={263.84} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            WhatsApp
          </text>

          {/* Guest Channels — card 5 Email */}
          <rect x={52} y={310.12} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 325.12)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinejoin="round">
            <rect x="0.5" y="3" width="13" height="9" rx="1.5" />
            <path d="M0.5 4.5 L7 8.5 L13.5 4.5" />
          </g>
          <text x={82} y={337.12} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Email
          </text>

          {/* Guest Channels — card 6 Phone */}
          <rect x={52} y={383.4} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 398.4)">
            <g transform="translate(1 1) scale(0.5)" stroke={ACCENT} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </g>
          </g>
          <text x={82} y={410.4} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Phone
          </text>

          {/* Guest Channels — card 7 Walk-in */}
          <rect x={52} y={456.68} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(62 471.68)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinejoin="round">
            <path d="M2 12.5 V6.5 H12 V12.5" />
            <circle cx={7} cy={4.5} r={1.6} />
          </g>
          <text x={82} y={483.68} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Walk-in
          </text>

          {/* Hotel Operations — card 1 AI Reception */}
          <rect x={604} y={17} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 32)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <path d="M0.5 1.5 H13.5 C14.2 1.5 14.5 2 14.5 2.5 V9 C14.5 9.5 14.2 10 13.5 10 H6 L3.5 12 V10 H0.5 C0 10 0 9.5 0 9 V2.5 C0 2 0.5 1.5 0.5 1.5 Z" />
            <path d="M3 5.5 H11" strokeLinecap="round" />
          </g>
          <text x={634} y={44} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            AI Reception
          </text>

          {/* Hotel Operations — card 2 PMS */}
          <rect x={604} y={90.28} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 105.28)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <rect x="1" y="2" width="12" height="11" rx="1.5" />
            <path d="M1 5.5 H13" />
          </g>
          <text x={634} y={117.28} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            PMS
          </text>

          {/* Hotel Operations — card 3 Revenue */}
          <rect x={604} y={163.56} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 178.56)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinecap="round">
            <path d="M0.5 11.5 L4.5 7.5 L7 9.5 L13.5 3" />
            <path d="M0.5 13 H13.5" />
          </g>
          <text x={634} y={190.56} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Revenue
          </text>

          {/* Hotel Operations — card 4 Rooms */}
          <rect x={604} y={236.84} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 251.84)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <path d="M0.5 7.5 H13.5 V12.5 H0.5 Z" />
            <path d="M3 7.5 V5 C3 3.5 4.5 2.5 7 2.5 C9.5 2.5 11 3.5 11 5 V7.5" />
          </g>
          <text x={634} y={263.84} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Rooms
          </text>

          {/* Hotel Operations — card 5 Staff */}
          <rect x={604} y={310.12} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 325.12)" stroke={ACCENT} strokeWidth={1.1} fill="none">
            <circle cx={4.5} cy={4} r={2} />
            <circle cx={10} cy={4.8} r={1.6} />
            <path d="M0.5 12 C1.8 10 3.2 9.2 4.5 9.2 C5.8 9.2 7 10 8 10.8" />
            <path d="M8 10.8 C8.8 9.5 9.7 9.2 10 9.2 C11 9.2 12 10 12.5 11.5" />
          </g>
          <text x={634} y={337.12} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Staff
          </text>

          {/* Hotel Operations — card 6 Analytics */}
          <rect x={604} y={383.4} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 398.4)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinecap="round">
            <path d="M1 12 V7 M4.5 12 V4.5 M8 12 V8 M11.5 12 V2.5" />
            <path d="M0.5 12.5 H13.5" />
          </g>
          <text x={634} y={410.4} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Analytics
          </text>

          {/* Hotel Operations — card 7 Integrations */}
          <rect x={604} y={456.68} width={150} height={46} rx={8} fill={CARD_FILL} stroke={CARD_STROKE} strokeWidth={1} />
          <g transform="translate(614 471.68)" stroke={ACCENT} strokeWidth={1.1} fill="none" strokeLinecap="round">
            <circle cx={3.5} cy={7} r={2} />
            <circle cx={10.5} cy={7} r={2} />
            <path d="M5.5 7 H8.5" />
          </g>
          <text x={634} y={483.68} fill="#e5e7eb" fontFamily="system-ui, sans-serif" fontSize={13} fontWeight="500">
            Integrations
          </text>
        </g>
      </svg>
    </figure>
  );
}
