import { cn } from "@/lib/utils";
import type { CountdownFromString } from "@/types";
import { getTimeDifferences } from "@/utils/date";
import CountdownFilters from "./CountdownFilters";
import ProgressBar from "./ProgressBar";
import TickNumber from "./TickNumber";

const Countdown = ({
  from,
  to,
  filters,
  isInverted,
  progress,
}: CountdownFromString) => {
  const { years, days, hours, minutes, seconds } = getTimeDifferences(to, from);

  const dateUnits = [
    ...(years > 0 ? [{ label: "Years", value: years }] : []),
    ...(years > 0 || days > 0 ? [{ label: "Days", value: days }] : []),
  ];
  const timeUnits = [
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const spoken = [...dateUnits, ...timeUnits.slice(0, 2)]
    .map(({ label, value }) => `${value} ${label.toLowerCase()}`)
    .join(", ");

  return (
    <section className="flex flex-col">
      {progress && <ProgressBar {...progress} />}
      <div
        role="timer"
        aria-label={`${spoken} ${isInverted ? "ago" : "left"}`}
        className="grid grid-cols-6 gap-[2px] border-2 border-foreground bg-foreground sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none"
      >
        {dateUnits.map(({ label, value }) => (
          <Unit
            key={label}
            label={label}
            value={value}
            isInverted={isInverted}
            className={dateUnits.length === 1 ? "col-span-6" : "col-span-3"}
          />
        ))}
        {timeUnits.map(({ label, value }) => (
          <Unit
            key={label}
            label={label}
            value={value}
            isInverted={isInverted}
            className={cn(
              "col-span-2",
              label === "Seconds" && "bg-signal text-signal-foreground",
            )}
          />
        ))}
      </div>
      {filters.length > 0 && (
        <CountdownFilters from={from} to={to} filters={filters} />
      )}
    </section>
  );
};

const Unit = ({
  label,
  value,
  isInverted,
  className,
}: {
  label: string;
  value: number;
  isInverted?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col justify-between gap-4 bg-background p-2 @container sm:col-span-1 sm:p-4",
      className,
    )}
  >
    <span className="font-mono text-[10px] uppercase tracking-widest sm:text-xs">
      {label}
    </span>
    <TickNumber value={value} isInverted={isInverted} />
  </div>
);

export default Countdown;
