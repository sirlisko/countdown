export const getBrowserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const isValidTimeZone = (timeZone: string) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
};

// Date.UTC maps years 0-99 to 19xx, so set the year explicitly
const utc = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(hour, minute, second, 0);
  return date.getTime();
};

const partsIn = (instant: Date, timeZone: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      era: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(instant)
      .map(({ type, value }) => [type, value]),
  );
  const year = Number(parts.year);
  return {
    year: parts.era === "BC" ? 1 - year : year,
    month: Number(parts.month) - 1,
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
};

const offsetAt = (instant: number, timeZone: string) => {
  const p = partsIn(new Date(instant), timeZone);
  return (
    utc(p.year, p.month, p.day, p.hour, p.minute, p.second) -
    Math.floor(instant / 1000) * 1000
  );
};

const pad = (value: number, length = 2) =>
  value.toString().padStart(length, "0");

export const wallClockIn = (instant: Date, timeZone: string) => {
  const p = partsIn(instant, timeZone);
  return {
    date: `${pad(p.year, 4)}-${pad(p.month + 1)}-${pad(p.day)}`,
    time: `${pad(p.hour)}:${pad(p.minute)}`,
  };
};

// Two passes settle the offset when the first guess lands across a DST change
const resolve = (wallClock: number, timeZone: string) => {
  const guess = wallClock - offsetAt(wallClock, timeZone);
  return new Date(wallClock - offsetAt(guess, timeZone));
};

export const zonedWallClockToInstant = (
  date: string,
  time: string,
  timeZone: string,
) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = time.split(":").map(Number);
  return resolve(utc(year, month - 1, day, hour, minute, second), timeZone);
};

const daysInMonth = (year: number, month: number) =>
  new Date(utc(year, month + 1, 0)).getUTCDate();

export const addYearsInZone = (
  instant: Date,
  years: number,
  timeZone: string,
) => {
  const p = partsIn(instant, timeZone);
  const year = p.year + years;
  const day = Math.min(p.day, daysInMonth(year, p.month));
  return resolve(utc(year, p.month, day, p.hour, p.minute, p.second), timeZone);
};

export const timeZoneName = (instant: Date, timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
    .formatToParts(instant)
    .find(({ type }) => type === "timeZoneName")?.value;
