const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DATE_FULL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_SHORT_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

export function formatDateFull(value: string): string {
  return DATE_FULL_FORMATTER.format(new Date(value));
}

export function formatDateShort(value: string): string {
  return DATE_SHORT_FORMATTER.format(new Date(value));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
