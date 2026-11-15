// The activity types of the "this month" view. Each one is computed from the
// month-valued info it names: there is no separate calendar. A new
// month-valued info (sowing, harvest...) becomes an activity by adding a line
// here and its label in `vocabulary.ts`.
import type {InfoKey} from "./infos";
import type {ACTIVITY_LABELS} from "./vocabulary";

export const ACTIVITIES = [
  {key: "repotting", info: "repotting"},
  {key: "fertilizing", info: "fertilizing"},
] as const satisfies readonly {key: keyof typeof ACTIVITY_LABELS; info: InfoKey}[];
