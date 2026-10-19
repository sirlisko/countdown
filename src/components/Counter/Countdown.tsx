import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CountdownFromString } from "@/types";
import { getTimeDifferences } from "@/utils/date";
import CountdownFilters from "./CountdownFilters";
import ProgressBar from "./ProgressBar";
import TickNumber from "./TickNumber";

// JetBrains Mono glyphs advance 0.6em
const MONO_ADVANCE = 0.6;

const pad = (value: number) => value.toString().padStart(2, "0");

/**
 * Cells grow in proportion to their digits, so every digit gets the same width.
 * Sized from the narrowest cell, the numbers then share one size and baseline.
 */
const fitSize = (digits: number[], padding: string) => {
  const total = digits.reduce((sum, count) => sum + count, 0);
  const fewest = Math.min(...digits);
  return `min(calc((100cqi * ${fewest} / ${total} - 2 * ${padding}) * 0.92 / ${fewest * MONO_ADVANCE}), 34vh)`;
};

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

  const digitsOf = (units: { value: number }[]) =>
    units.map(({ value }) => pad(value).length);
  const dateDigits = digitsOf(dateUnits);
  const timeDigits = digitsOf(timeUnits);

  const spoken = [...dateUnits, ...timeUnits.slice(0, 2)]
    .map(({ label, value }) => `${value} ${label.toLowerCase()}`)
    .join(", ");

  return (
    <section className="flex flex-col">
      {progress && <ProgressBar {...progress} />}
      <div
        role="timer"
        aria-label={`${spoken} ${isInverted ? "ago" : "left"}`}
        // Mobile stacks dates over times and fits each row on its own
        style={
          {
            "--fit-sm": fitSize([...dateDigits, ...timeDigits], "1rem"),
          } as CSSProperties
        }
        className="@container flex flex-col gap-[2px] border-2 border-foreground bg-foreground sm:flex-row"
      >
        {dateUnits.length > 0 && (
          <Row fit={fitSize(dateDigits, "0.5rem")}>
            {dateUnits.map(({ label, value }) => (
              <Unit
                key={label}
                label={label}
                value={value}
                isInverted={isInverted}
              />
            ))}
          </Row>
        )}
        <Row fit={fitSize(timeDigits, "0.5rem")}>
          {timeUnits.map(({ label, value }) => (
            <Unit
              key={label}
              label={label}
              value={value}
              isInverted={isInverted}
              className={
                label === "Seconds"
                  ? "bg-signal text-signal-foreground"
                  : undefined
              }
            />
          ))}
        </Row>
      </div>
      {filters.length > 0 && (
        <CountdownFilters from={from} to={to} filters={filters} />
      )}
    </section>
  );
};

const Row = ({ fit, children }: { fit: string; children: ReactNode }) => (
  <div
    style={{ "--fit": fit } as CSSProperties}
    className="flex gap-[2px] sm:contents"
  >
    {children}
  </div>
);

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
    style={{ flexGrow: pad(value).length }}
    className={cn(
      "flex basis-0 flex-col justify-between gap-4 bg-background p-2 sm:p-4",
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
