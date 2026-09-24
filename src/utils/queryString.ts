import queryString from "query-string";
import { Countdown } from "@/types";
import { localDateAsUTC } from "./date";

export const getQueryString = (search: string) => {
  const { t, m, f, c } = queryString.parse(search);
  return {
    then: typeof t === "string" && localDateAsUTC(t),
    created: typeof c === "string" && localDateAsUTC(c),
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
}: Countdown) =>
  queryString.stringify(
    {
      m,
      t: `${date}T${time}:00.000Z`,
      f: filters.length ? filters.join(",") : undefined,
      c: progress ? created : undefined,
    },
    { arrayFormat: "comma" },
  );
