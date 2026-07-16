import type { ReactNode } from "react";

import type {
  SharedGuestIdentity,
  WhyNeedCardRole,
} from "@/lib/marketing/why-hotels-need-story";
import { cn } from "@/lib/utils";

export function SharedIdentityStrip({
  identity,
  visible,
  opacity,
}: {
  identity: SharedGuestIdentity;
  visible: boolean;
  opacity: number;
}) {
  return (
    <div
      className="mkt-why-need-identity"
      data-visible={visible ? "true" : "false"}
      style={{ opacity: visible ? opacity : 0 }}
      aria-hidden="true"
    >
      <span className="mkt-why-need-identity-name">{identity.guestName}</span>
      <span className="mkt-why-need-identity-sep" />
      <span className="mkt-why-need-identity-res">#{identity.reservationId}</span>
      <span className="mkt-why-need-identity-sep" />
      <span className="mkt-why-need-identity-room">Room {identity.room}</span>
    </div>
  );
}

export function DemoCardShell({
  title,
  orderIndex,
  ariaLabel,
  className,
  cardRole = "synced",
  updating = false,
  identity,
  identityVisible = false,
  identityOpacity = 0,
  liveActive = false,
  children,
}: {
  title: string;
  orderIndex: number;
  ariaLabel: string;
  className?: string;
  cardRole?: WhyNeedCardRole;
  updating?: boolean;
  identity: SharedGuestIdentity;
  identityVisible?: boolean;
  identityOpacity?: number;
  liveActive?: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={cn("mkt-why-need-problem", className)}
      data-order={orderIndex}
      data-card-role={cardRole}
      data-updating={updating ? "true" : undefined}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="mkt-why-need-card" aria-hidden="true">
        <div className="mkt-why-need-card-head">
          <h3 className="mkt-why-need-card-title">{title}</h3>
          <LiveStatus active={liveActive} />
        </div>
        <SharedIdentityStrip
          identity={identity}
          visible={identityVisible}
          opacity={identityOpacity}
        />
        <div className="mkt-why-need-card-body">{children}</div>
      </div>
    </li>
  );
}

export function LiveStatus({ active = true }: { active?: boolean }) {
  return (
    <span className="mkt-why-need-live" data-active={active ? "true" : "false"}>
      <span className="mkt-why-need-live-dot" />
      Live
    </span>
  );
}

export function MiniMetric({
  label,
  value,
  delta,
  percent,
  visual,
  sparkIndex,
  metricIndex,
}: {
  label: string;
  value: string;
  delta?: string;
  percent?: number;
  visual: "bar" | "spark" | "none";
  sparkIndex?: number;
  metricIndex?: number;
}) {
  return (
    <div className="mkt-why-need-metric" data-metric-index={metricIndex}>
      <div className="mkt-why-need-metric-head">
        <span className="mkt-why-need-metric-label">{label}</span>
        {delta ? <span className="mkt-why-need-metric-delta">{delta}</span> : null}
      </div>
      <span className="mkt-why-need-metric-value">{value}</span>
      {visual === "bar" ? (
        <span className="mkt-why-need-metric-bar">
          <span
            className="mkt-why-need-metric-bar-fill"
            style={{ width: `${percent ?? 0}%` }}
          />
        </span>
      ) : null}
      {visual === "spark" ? (
        <span
          className="mkt-why-need-metric-spark"
          data-spark-index={sparkIndex}
        >
          <span className="mkt-why-need-metric-spark-bar" />
          <span className="mkt-why-need-metric-spark-bar" />
          <span className="mkt-why-need-metric-spark-bar" />
          <span className="mkt-why-need-metric-spark-bar" />
        </span>
      ) : null}
    </div>
  );
}

export function KpiSparkline({ points }: { points: readonly number[] }) {
  const width = 28;
  const height = 10;
  const padding = 1;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);
  const stepX = chartW / (points.length - 1);

  const polylinePoints = points
    .map((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartH - ((point - min) / range) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="mkt-why-need-rev-kpi-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline className="mkt-why-need-rev-kpi-spark-line" points={polylinePoints} />
    </svg>
  );
}

export function RevenueSparkline({ points }: { points: readonly number[] }) {
  const width = 120;
  const height = 47;
  const padding = { top: 6, right: 4, bottom: 4, left: 4 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);
  const stepX = chartW / (points.length - 1);

  const coords = points.map((point, index) => {
    const x = padding.left + index * stepX;
    const y = padding.top + chartH - ((point - min) / range) * (chartH - 6);
    return [x, y] as const;
  });

  const linePath = coords.reduce((path, [x, y], index) => {
    if (index === 0) {
      return `M${x.toFixed(1)},${y.toFixed(1)}`;
    }
    const [prevX, prevY] = coords[index - 1] ?? [x, y];
    const midX = (prevX + x) / 2;
    return `${path} C${midX.toFixed(1)},${prevY.toFixed(1)} ${midX.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }, "");

  const baseline = padding.top + chartH;
  const areaPath = `${linePath} L${(padding.left + chartW).toFixed(1)},${baseline} L${padding.left},${baseline} Z`;

  const [lastX, lastY] = coords[coords.length - 1] ?? [width, height];

  const markerIndices = [
    Math.floor(points.length * 0.38),
    Math.floor(points.length * 0.68),
  ].filter((index, position, list) => list.indexOf(index) === position && index > 0 && index < points.length - 1);

  const gridLines = [0.33, 0.66].map((ratio) => padding.top + chartH * ratio);

  return (
    <svg
      className="mkt-why-need-chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {gridLines.map((y, index) => (
        <line
          key={index}
          className="mkt-why-need-chart-grid"
          x1={padding.left}
          y1={y}
          x2={padding.left + chartW}
          y2={y}
        />
      ))}
      <path className="mkt-why-need-chart-area" d={areaPath} />
      <path className="mkt-why-need-chart-line" d={linePath} />
      {markerIndices.map((index) => {
        const [x, y] = coords[index] ?? [0, 0];
        return (
          <circle
            key={index}
            className="mkt-why-need-chart-marker"
            cx={x}
            cy={y}
            r={1.4}
          />
        );
      })}
      <circle className="mkt-why-need-chart-dot-ring" cx={lastX} cy={lastY} r={4.5} />
      <circle className="mkt-why-need-chart-dot" cx={lastX} cy={lastY} r={2.2} />
    </svg>
  );
}
