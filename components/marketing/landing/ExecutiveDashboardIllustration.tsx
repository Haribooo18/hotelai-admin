import { BrowserFrame } from "@/components/marketing/product/BrowserFrame";

type KpiCardProps = {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
};

function KpiCard({ label, value, trend, positive = true }: KpiCardProps) {
  return (
    <div className="mkt-exec-dash-kpi">
      <span className="mkt-exec-dash-kpi-label">{label}</span>
      <span className="mkt-exec-dash-kpi-value">{value}</span>
      <span
        className={
          positive ? "mkt-exec-dash-kpi-trend mkt-exec-dash-kpi-trend--up" : "mkt-exec-dash-kpi-trend"
        }
      >
        {trend}
      </span>
    </div>
  );
}

function BookingTrendChart() {
  return (
    <svg viewBox="0 0 120 48" fill="none" aria-hidden className="mkt-exec-dash-chart">
      <path
        d="M4 38 L20 32 L36 34 L52 24 L68 26 L84 16 L100 18 L116 8"
        stroke="#1f5b4c"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 38 L20 32 L36 34 L52 24 L68 26 L84 16 L100 18 L116 8 L116 44 L4 44 Z"
        fill="#1f5b4c"
        fillOpacity="0.1"
      />
      <line x1="4" y1="44" x2="116" y2="44" stroke="#ffffff" strokeOpacity="0.08" />
    </svg>
  );
}

function RevenueForecastChart() {
  const bars = [28, 36, 32, 44, 38, 48, 42];
  return (
    <svg viewBox="0 0 120 48" fill="none" aria-hidden className="mkt-exec-dash-chart">
      {bars.map((height, index) => {
        const x = 8 + index * 15;
        const y = 44 - height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width="10"
            height={height}
            rx="2"
            fill={index === 5 ? "#1f5b4c" : "#1f5b4c"}
            fillOpacity={index === 5 ? 0.85 : 0.28}
          />
        );
      })}
      <line x1="4" y1="44" x2="116" y2="44" stroke="#ffffff" strokeOpacity="0.08" />
    </svg>
  );
}

function OccupancyChart() {
  return (
    <svg viewBox="0 0 120 48" fill="none" aria-hidden className="mkt-exec-dash-chart">
      <path
        d="M4 40 C18 36 24 28 38 24 C52 20 58 30 72 22 C86 14 96 18 116 10"
        stroke="#1f5b4c"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="116" cy="10" r="3" fill="#1f5b4c" fillOpacity="0.9" />
      <line x1="4" y1="44" x2="116" y2="44" stroke="#ffffff" strokeOpacity="0.08" />
    </svg>
  );
}

function WeeklyPerformanceChart() {
  const bars = [18, 24, 20, 30, 26, 34, 28];
  return (
    <svg viewBox="0 0 120 32" fill="none" aria-hidden className="mkt-exec-dash-chart mkt-exec-dash-chart--compact">
      {bars.map((height, index) => (
        <rect
          key={index}
          x={6 + index * 15}
          y={28 - height}
          width="8"
          height={height}
          rx="1.5"
          fill="#1f5b4c"
          fillOpacity={index === 6 ? 0.9 : 0.35}
        />
      ))}
    </svg>
  );
}

export function ExecutiveDashboardIllustration() {
  return (
    <figure className="mkt-executive-dashboard" aria-hidden>
      <BrowserFrame
        productUrl="monavel.app/dashboard"
        tabTitle="Monavel Dashboard"
        size="compact"
      >
        <div className="mkt-exec-dash">
          <header className="mkt-exec-dash-header">
            <div>
              <p className="mkt-exec-dash-title">Executive Dashboard</p>
              <p className="mkt-exec-dash-date">Saturday, Jul 11</p>
            </div>
            <span className="mkt-exec-dash-live">Live</span>
          </header>

          <div className="mkt-exec-dash-kpis">
            <KpiCard label="Revenue Today" value="$18,420" trend="+8.2%" />
            <KpiCard label="Occupancy" value="87%" trend="+4.0%" />
            <KpiCard label="ADR" value="$142" trend="+5.1%" />
            <KpiCard label="RevPAR" value="$124" trend="+6.3%" />
          </div>

          <div className="mkt-exec-dash-ai">
            <p className="mkt-exec-dash-ai-kicker">AI Recommendation</p>
            <p className="mkt-exec-dash-ai-text">
              Increase Deluxe Room rate by <strong>8%</strong>.
              <br />
              Weekend demand is <strong>17% above forecast</strong>.
            </p>
            <p className="mkt-exec-dash-ai-impact">Estimated additional revenue: +$3,240</p>
          </div>

          <div className="mkt-exec-dash-charts">
            <div className="mkt-exec-dash-panel">
              <p className="mkt-exec-dash-panel-title">Booking Trend</p>
              <BookingTrendChart />
            </div>
            <div className="mkt-exec-dash-panel">
              <p className="mkt-exec-dash-panel-title">Revenue Forecast</p>
              <RevenueForecastChart />
            </div>
          </div>

          <div className="mkt-exec-dash-panel mkt-exec-dash-panel--wide">
            <div className="mkt-exec-dash-panel-head">
              <p className="mkt-exec-dash-panel-title">Occupancy</p>
              <span className="mkt-exec-dash-panel-meta">7-day</span>
            </div>
            <OccupancyChart />
          </div>

          <div className="mkt-exec-dash-widgets">
            <div className="mkt-exec-dash-widget">
              <span className="mkt-exec-dash-widget-label">Today&apos;s Arrivals</span>
              <span className="mkt-exec-dash-widget-value">14</span>
            </div>
            <div className="mkt-exec-dash-widget">
              <span className="mkt-exec-dash-widget-label">Guest Messages</span>
              <span className="mkt-exec-dash-widget-value">7</span>
            </div>
            <div className="mkt-exec-dash-widget">
              <span className="mkt-exec-dash-widget-label">Housekeeping</span>
              <span className="mkt-exec-dash-widget-value">12/18</span>
            </div>
          </div>

          <div className="mkt-exec-dash-panel mkt-exec-dash-panel--wide">
            <div className="mkt-exec-dash-panel-head">
              <p className="mkt-exec-dash-panel-title">Weekly Performance</p>
              <span className="mkt-exec-dash-panel-meta mkt-exec-dash-panel-meta--up">+12.4%</span>
            </div>
            <WeeklyPerformanceChart />
          </div>
        </div>
      </BrowserFrame>
    </figure>
  );
}
