import { format } from "date-fns";
import samples, { type Sample } from "@/dates";
import { isValidDate, localDateAsUTC } from "./date";
import { getQueryString } from "./queryString";
import { zonedWallClockToInstant } from "./timezone";

export interface CountdownState {
  then: Date;
  created?: Date;
  timeZone?: string;
  yearly: boolean;
  message?: string;
  link?: { href: string; event: string };
  filters: string[];
  obfuscate: boolean;
  isSample: boolean;
}

const sampleInstant = ({ date, time = "00:00", timeZone }: Sample) =>
  timeZone
    ? zonedWallClockToInstant(date, time, timeZone)
    : localDateAsUTC(`${date}T${time}Z`);

const randomOf = <T>(list: T[]) =>
  list[Math.floor(Math.random() * list.length)];

// Weighted towards upcoming events so the home page usually counts down
const pickSample = (now: Date) => {
  const today = format(now, "yyyy-MM-dd");
  const upcoming = samples.filter(({ date }) => date > today);
  return randomOf(Math.random() < 0.5 ? upcoming : samples);
};

const readSample = (): CountdownState => {
  const now = new Date();
  const sample = pickSample(now);
  const then = sampleInstant(sample);
  return {
    then,
    message: `${then > now ? "until" : "since"} ${sample.event}`,
    timeZone: sample.timeZone,
    link: sample.link ? { href: sample.link, event: sample.event } : undefined,
    yearly: false,
    filters: sample.filters ?? [],
    obfuscate: false,
    isSample: true,
  };
};

export const readCountdown = ({
  pathname,
  search,
}: Pick<Location, "pathname" | "search">): CountdownState => {
  const path = pathname.split("/").pop();

  let decoded: string;
  try {
    decoded = path ? atob(path) : search;
  } catch {
    return {
      then: new Date(NaN),
      yearly: false,
      filters: [],
      obfuscate: true,
      isSample: false,
    };
  }

  const { then, created, timeZone, yearly, message, filters } =
    getQueryString(decoded);
  if (then) {
    return {
      then,
      created: created && isValidDate(created) ? created : undefined,
      timeZone,
      yearly,
      message: message || undefined,
      filters: filters || [],
      obfuscate: !!path,
      isSample: false,
    };
  }

  return readSample();
};
