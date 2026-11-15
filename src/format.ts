// The short value of an info, as text. Shared by the card and the comparison.
import type {InfoKey} from "./infos";
import {LEVEL_LABELS, MONTH_LABELS} from "./vocabulary";

export const formatValue = (key: InfoKey, value: any): string => {
  if (key === "light" || key === "humidity") return LEVEL_LABELS[value as keyof typeof LEVEL_LABELS];
  if (key === "repotting" || key === "fertilizing")
    return (value as number[]).map((m) => MONTH_LABELS[m - 1]).join(", ");
  if (key === "idealTemperature") return `${value.min}–${value.max} °C`;
  if (key === "minTemperature") return `${value} °C`;
  return String(value);
};
