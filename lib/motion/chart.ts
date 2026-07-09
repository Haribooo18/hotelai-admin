/** Chart motion — timing tokens live in `app/globals.css`. */

export const motionChartSurfaceClass = "ds-motion-chart-surface";
export const motionChartEmptyClass = "ds-motion-chart-empty";
export const motionChartTooltipClass = "ds-motion-chart-tooltip";
export const motionChartLegendItemClass = "ds-motion-chart-legend-item";

export const motionChartEnterDurationMs = 300;
export const motionChartCrossfadeDurationMs = 200;
export const motionChartTooltipDurationMs = 120;
export const motionChartEmptyDurationMs = 180;
export const motionChartLegendStaggerMs = 50;

export function chartDataKey(data: unknown): string {
  return JSON.stringify(data);
}
