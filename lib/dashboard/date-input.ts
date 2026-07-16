const DISPLAY_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

export const DATE_INPUT_PLACEHOLDER = "DD/MM/YYYY";

export function isoToDisplayDate(value: string | undefined): string {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

export function displayToIsoDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const match = trimmed.match(DISPLAY_PATTERN);
  if (!match) return "";

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    return "";
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
