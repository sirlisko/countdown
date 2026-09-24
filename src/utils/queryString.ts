import queryString from "query-string";
import { Countdown } from "@/types";
import { localDateAsUTC, toFloatingISO } from "./date";
import {
  getBrowserTimeZone,
  isValidTimeZone,
  zonedWallClockToInstant,
} from "./timezone";

// Links with `z` hold real UTC instants; links without it hold floating
// wall-clock times that fire at that local time for each viewer
export const getQueryString = (search: string) => {
  const { t, m, f, c, z } = queryString.parse(search);
  const isInstant = typeof z === "string";
  const parse = (value: string) =>
    isInstant ? new Date(value) : localDateAsUTC(value);
  return {
    then: typeof t === "string" && parse(t),
    created: typeof c === "string" && parse(c),
    timeZone: isInstant
      ? isValidTimeZone(z)
        ? z
        : getBrowserTimeZone()
      : undefined,
    message: typeof m === "string" && m,
    filters: typeof f === "string" && f.split(","),
  };
};

export const createQueryString = ({
  message: m,
  date,
  time,
  filters,
  progress,
  created,
  sameMoment,
  timeZone,
}: Countdown) => {
  const zone = sameMoment ? (timeZone ?? getBrowserTimeZone()) : undefined;
  return queryString.stringify(
    {
      m,
      t: zone
        ? zonedWallClockToInstant(date, time, zone).toISOString()
        : `${date}T${time}:00.000Z`,
      z: zone,
      f: filters.length ? filters.join(",") : undefined,
      c:
        progress && created
          ? zone
            ? created
            : toFloatingISO(new Date(created))
          : undefined,
    },
    { arrayFormat: "comma" },
  );
};
