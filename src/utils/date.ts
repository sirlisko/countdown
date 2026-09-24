import {
  format,
  isValid,
  differenceInYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subYears,
  subDays,
  subMinutes,
  subHours,
} from "date-fns";

export const isValidDate = (date: Date): boolean => date && isValid(date);

export const normaliseDateOrder = (now: Date, then: Date) =>
  now.getTime() < then.getTime()
    ? {
        from: now,
        to: then,
        isInverted: false,
      }
    : {
        from: then,
        to: now,
        isInverted: true,
      };

export const getTimeDifferences = (to: Date, from: Date) => {
  const years = differenceInYears(to, from);
  const subbedYears = subYears(to, years);

  const days = differenceInDays(subbedYears, from);
  const subbedDays = subDays(subbedYears, days);

  const hours = differenceInHours(subbedDays, from);
  const subbedHours = subHours(subbedDays, hours);

  const minutes = differenceInMinutes(subbedHours, from);
  const subbedMinutes = subMinutes(subbedHours, minutes);

  const seconds = differenceInSeconds(subbedMinutes, from);

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
  };
};

// Links store wall-clock times with a Z suffix; localDateAsUTC reverses this
export const toFloatingISO = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");

/**
 * Reads the UTC fields of a floating link time as a local wall-clock time.
 * Built from fields rather than shifted by getTimezoneOffset, which is rounded
 * to minutes and drifts for historic dates whose offsets had seconds.
 */
export const localDateAsUTC = (value: Date | string) => {
  const date = new Date(value);
  const local = new Date(0);
  local.setFullYear(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  local.setHours(
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );
  return local;
};
