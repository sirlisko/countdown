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

const getTimezoneOffset = (value: Date) => value.getTimezoneOffset() * 60000;

/**
 * Converts a local date to a date object that represents the same moment in UTC.
 * @param {Date | string} value - The local date to convert to UTC.
 * @returns {Date} The equivalent UTC date.
 */
export const localDateAsUTC = (value: Date | string) => {
  const date = new Date(value);
  const utcFromLocal = new Date(date.getTime() + getTimezoneOffset(date));
  return utcFromLocal;
};
