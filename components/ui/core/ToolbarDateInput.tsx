"use client";

import { useState, type ChangeEvent, type ComponentProps, type FocusEvent } from "react";

import {
  DATE_INPUT_PLACEHOLDER,
  displayToIsoDate,
  isoToDisplayDate,
} from "@/lib/dashboard/date-input";
import { toolbarDateInputClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { Input } from "./Input";

type Props = Omit<ComponentProps<typeof Input>, "type" | "lang" | "placeholder">;

export function ToolbarDateInput({
  className,
  value,
  defaultValue,
  onChange,
  onBlur,
  ...props
}: Props) {
  const isoValue =
    typeof value === "string"
      ? value
      : typeof defaultValue === "string"
        ? defaultValue
        : "";
  const [draft, setDraft] = useState<string | null>(null);
  const displayValue = draft ?? isoToDisplayDate(isoValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDisplay = event.target.value;
    setDraft(nextDisplay);

    const nextIso = displayToIsoDate(nextDisplay);
    if (!nextDisplay.trim() || nextIso) {
      onChange?.({
        ...event,
        target: { ...event.target, value: nextIso },
        currentTarget: { ...event.currentTarget, value: nextIso },
      });
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const nextIso = displayToIsoDate(displayValue);

    if (displayValue.trim() && !nextIso) {
      setDraft(null);
      onChange?.({
        ...event,
        target: { ...event.target, value: "" },
        currentTarget: { ...event.currentTarget, value: "" },
      } as ChangeEvent<HTMLInputElement>);
    } else {
      setDraft(null);
      if (nextIso) {
        onChange?.({
          ...event,
          target: { ...event.target, value: nextIso },
          currentTarget: { ...event.currentTarget, value: nextIso },
        } as ChangeEvent<HTMLInputElement>);
      }
    }

    onBlur?.(event);
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      lang="en-GB"
      placeholder={DATE_INPUT_PLACEHOLDER}
      autoComplete="off"
      spellCheck={false}
      size={10}
      className={cn(toolbarDateInputClass, className)}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
}
