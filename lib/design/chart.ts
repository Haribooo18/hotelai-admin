/** Chart visual tokens — grid, axis, tooltip integration with card surfaces */

export const chartTokens = {
  gridStroke: "var(--shell-chart-grid)",
  gridOpacity: 0.28,
  gridDasharray: "3 8",
  axisTickFill: "var(--shell-chart-axis)",
  axisFontSize: 11,
  margin: { top: 6, right: 6, left: -10, bottom: 0 },
} as const;

export const chartGridProps = {
  stroke: chartTokens.gridStroke,
  strokeOpacity: chartTokens.gridOpacity,
  strokeDasharray: chartTokens.gridDasharray,
  vertical: false as const,
};

export const chartGridVerticalProps = {
  ...chartGridProps,
  vertical: true as const,
  horizontal: false as const,
};

export const chartAxisTickProps = {
  fill: chartTokens.axisTickFill,
  fontSize: chartTokens.axisFontSize,
};

export const chartAxisTickSmallProps = {
  fill: chartTokens.axisTickFill,
  fontSize: 10,
};
