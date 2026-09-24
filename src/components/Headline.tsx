import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getBrowserTimeZone,
  timeZoneName,
  wallClockIn,
} from "@/utils/timezone";

const sizeFor = (message: string) => {
  if (message.length <= 24) return "text-[clamp(3rem,9vw,10rem)]";
  if (message.length <= 60) return "text-[clamp(2.25rem,6vw,6.5rem)]";
  return "text-[clamp(1.75rem,4vw,4rem)]";
};

const city = (timeZone: string) =>
  timeZone.split("/").pop()!.replace(/_/g, " ");

const Headline = ({
  message,
  then,
  timeZone,
  yearly,
}: {
  message?: string;
  then: Date;
  timeZone?: string;
  yearly?: boolean;
}) => (
  <section className="flex flex-col gap-4 sm:gap-6">
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest sm:text-xs">
      <span className="bg-foreground px-1.5 py-0.5 text-background">T-0</span>
      <time dateTime={then.toISOString()}>
        {format(then, "EEE dd MMM yyyy")} <span aria-hidden>·</span>{" "}
        {format(then, "HH:mm")} {timeZone ? timeZoneName(then) : "local time"}
      </time>
      {yearly && (
        <span className="border border-foreground px-1.5 py-px">
          Every year
        </span>
      )}
      {timeZone && timeZone !== getBrowserTimeZone() && (
        <span className="text-muted-foreground">
          ({wallClockIn(then, timeZone).time} in {city(timeZone)})
        </span>
      )}
    </p>
    {message && (
      <h1
        className={cn(
          sizeFor(message),
          "hyphens-auto break-words text-balance font-bold uppercase leading-[0.85] tracking-tighter",
        )}
      >
        {message}
      </h1>
    )}
  </section>
);

export default Headline;
