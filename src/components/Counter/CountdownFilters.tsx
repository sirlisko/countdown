import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

import type { CountdownFromString } from "@/types";

const totals = [
  { id: "h", label: "Total hours", difference: differenceInHours },
  { id: "m", label: "Total minutes", difference: differenceInMinutes },
  { id: "s", label: "Total seconds", difference: differenceInSeconds },
];

const CountdownFilters = ({ from, to, filters }: CountdownFromString) => (
  <dl className="grid gap-[2px] border-2 border-t-0 border-foreground bg-foreground sm:auto-cols-fr sm:grid-flow-col">
    {totals
      .filter(({ id }) => filters.includes(id))
      .map(({ id, label, difference }) => (
        <div
          key={id}
          className="flex items-baseline justify-between gap-4 bg-background px-2 py-3 font-mono sm:px-4"
        >
          <dt className="text-[10px] uppercase tracking-widest sm:text-xs">
            {label}
          </dt>
          <dd className="text-lg font-bold tabular-nums sm:text-2xl">
            {difference(to, from).toLocaleString()}
          </dd>
        </div>
      ))}
  </dl>
);

export default CountdownFilters;
