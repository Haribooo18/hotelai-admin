"use client";

import type { ReactNode } from "react";
import type { ContentType, TooltipContentProps } from "recharts/types/component/Tooltip";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { motionChartTooltipClass } from "@/lib/motion/chart";
import { cn } from "@/lib/utils";

type ChartTooltipOptions = {
  formatter?: (
    value: ValueType | undefined,
    name: NameType | undefined
  ) => ReactNode | [ReactNode, NameType];
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  className,
  labelClassName,
  valueClassName,
}: TooltipContentProps<ValueType, NameType> & ChartTooltipOptions) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={cn(motionChartTooltipClass, className)}>
      {label ? (
        <p className={cn("mb-1 text-[11px] text-[var(--shell-muted)]", labelClassName)}>
          {label}
        </p>
      ) : null}
      <div className="space-y-0.5">
        {payload.map((entry) => {
          const formatted = formatter
            ? formatter(entry.value, entry.name)
            : [entry.value, entry.name];

          const [value, name] = Array.isArray(formatted)
            ? formatted
            : [formatted, entry.name];

          return (
            <p
              key={`${String(entry.name)}-${String(entry.dataKey)}`}
              className={cn("text-xs font-medium text-[var(--shell-text)]", valueClassName)}
            >
              {name ? <span className="text-[var(--shell-muted)]">{name}: </span> : null}
              {value}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function createChartTooltip(
  options: ChartTooltipOptions = {}
): ContentType<ValueType, NameType> {
  const { formatter, className, labelClassName, valueClassName } = options;

  return ((props: TooltipContentProps<ValueType, NameType>) => (
    <ChartTooltipContent
      active={props.active}
      payload={props.payload}
      label={props.label}
      coordinate={props.coordinate}
      accessibilityLayer={props.accessibilityLayer}
      activeIndex={props.activeIndex}
      formatter={formatter}
      className={className}
      labelClassName={labelClassName}
      valueClassName={valueClassName}
    />
  )) as ContentType<ValueType, NameType>;
}
