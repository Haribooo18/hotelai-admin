import type { ReactNode } from "react";

import {
  formCheckboxLabelClass,
  formCheckboxRowClass,
  formErrorClass,
  formFieldClass,
  formHelperClass,
  formLabelClass,
  formRequiredMarkClass,
  formSwitchLabelClass,
  formSwitchRowClass,
} from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

import { Checkbox } from "./Checkbox";
import { Switch } from "./Switch";

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FormLabel({
  htmlFor,
  required = false,
  className,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={cn(formLabelClass, className)}>
      {children}
      {required ? (
        <span className={formRequiredMarkClass} aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}

export function FormHelperText({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} className={cn(formHelperClass, className)}>
      {children}
    </p>
  );
}

export function FormError({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} role="alert" className={cn(formErrorClass, className)}>
      {children}
    </p>
  );
}

export function FormField({
  label,
  htmlFor,
  error,
  helper,
  required = false,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn(formFieldClass, className)}>
      {label ? (
        <FormLabel htmlFor={htmlFor} required={required}>
          {label}
        </FormLabel>
      ) : null}

      {children}

      {error ? (
        <FormError id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</FormError>
      ) : helper ? (
        <FormHelperText id={htmlFor ? `${htmlFor}-helper` : undefined}>
          {helper}
        </FormHelperText>
      ) : null}
    </div>
  );
}

type FormCheckboxFieldProps = {
  id: string;
  label: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function FormCheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: FormCheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        formCheckboxRowClass,
        formCheckboxLabelClass,
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}

type FormSwitchFieldProps = {
  id: string;
  label: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function FormSwitchField({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: FormSwitchFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        formSwitchRowClass,
        formSwitchLabelClass,
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}
