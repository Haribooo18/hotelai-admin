"use client";

import * as React from "react";

import { inputClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  id,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, "md:text-[13px]", className)}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type MultiSelectProps = {
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel,
}: MultiSelectProps) {
  return (
    <select
      id={id}
      multiple
      disabled={disabled}
      aria-label={ariaLabel}
      value={values}
      onChange={(event) => {
        const selected = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        onChange(selected);
      }}
      className={cn(
        inputClass,
        "min-h-24 py-2 md:text-[13px]",
        className
      )}
    >
      {options.length === 0 ? (
        <option disabled value="">
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
