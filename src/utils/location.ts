import dates from "@/dates";
import { isValidDate } from "./date";
import { getQueryString } from "./queryString";

export interface CountdownState {
  then: Date;
  created?: Date;
  message?: string;
  filters: string[];
  obfuscate: boolean;
  isSample: boolean;
}

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
      filters: [],
      obfuscate: true,
      isSample: false,
    };
  }

  const { then, created, message, filters } = getQueryString(decoded);
  if (then) {
    return {
      then,
      created: created && isValidDate(created) ? created : undefined,
      message: message || undefined,
      filters: filters || [],
      obfuscate: !!path,
      isSample: false,
    };
  }

  const sample = dates[Math.floor(Math.random() * dates.length)];
  return {
    then: sample.date,
    message: sample.text,
    filters: sample.filters ?? [],
    obfuscate: false,
    isSample: true,
  };
};
