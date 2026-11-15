// The short value of an info, as text. Shared by the card and the comparison.
import type {InfoKey} from "./infos";
import {LEVEL_LABELS, MONTH_LABELS, PROTECTION_LABELS, TOXICITY_LABELS} from "./vocabulary";

export const formatMonths = (months: readonly number[]) =>
  months.map((m) => MONTH_LABELS[m - 1]).join(", ");

export const formatValue = (key: InfoKey, value: any): string => {
  if (key === "light" || key === "humidity") return LEVEL_LABELS[value as keyof typeof LEVEL_LABELS];
  if (key === "toxicity") return TOXICITY_LABELS[value as keyof typeof TOXICITY_LABELS];
  if (Array.isArray(value)) return formatMonths(value);
  if (key === "overwintering")
    return `${PROTECTION_LABELS[value.protection as keyof typeof PROTECTION_LABELS]}, sotto ${value.threshold} °C`;
  if (key === "idealTemperature") return `${value.min}–${value.max} °C`;
  if (key === "minTemperature") return `${value} °C`;
  return String(value);
};
