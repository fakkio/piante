// The activity types of the "this month" view. Each one is computed from the
// months of the info it names: there is no separate calendar. A new
// month-valued info (sowing, harvest...) becomes an activity by adding a line
// here and its label in `vocabulary.ts`. `months` picks the months out of the
// info value when it is not a plain list of months.
import type {InfoKey} from "./infos";
import type {ACTIVITY_LABELS} from "./vocabulary";

type Activity = {
  key: keyof typeof ACTIVITY_LABELS;
  info: InfoKey;
  months?: (value: any) => readonly number[];
};

export const ACTIVITIES: readonly Activity[] = [
  {key: "repotting", info: "repotting"},
  {key: "fertilizing", info: "fertilizing"},
  {key: "sowing", info: "sowing"},
  {key: "transplanting", info: "transplanting"},
  {key: "harvest", info: "harvest"},
  {key: "flowering", info: "flowering"},
  {key: "bringIn", info: "overwintering", months: (value) => value.bringIn},
  {key: "bringOut", info: "overwintering", months: (value) => value.bringOut},
];

// The months in which a plant has an activity, none if the info is missing or
// not applicable.
export function activityMonths(activity: Activity, infos: Partial<Record<InfoKey, any>> | undefined) {
  const info = infos?.[activity.info];
  if (!info || !("value" in info)) return [];
  return activity.months ? activity.months(info.value) : (info.value as readonly number[]);
}
