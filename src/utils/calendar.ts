import { addHours, format } from "date-fns";
import { wallClockIn } from "./timezone";

export interface CalendarEvent {
  title: string;
  start: Date;
  url: string;
  timeZone?: string;
  yearly?: boolean;
}

const DOMAIN = "countdown.sirlisko.com";

const utcStamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

// Floating times have no zone, so each calendar shows them in its own
const floatingStamp = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

const zonedStamp = (date: Date, timeZone: string) => {
  const { date: day, time } = wallClockIn(date, timeZone);
  return `${day.replace(/-/g, "")}T${time.replace(":", "")}00`;
};

const escapeText = (value: string) =>
  value.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\r?\n/g, "\\n");

// RFC 5545 caps lines at 75 octets; continuations start with a space
const fold = (line: string) => {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let start = 0;
  while (start < bytes.length) {
    let end = Math.min(start + (start ? 74 : 75), bytes.length);
    // Don't split a multi-byte character
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    chunks.push(decoder.decode(bytes.slice(start, end)));
    start = end;
  }
  return chunks.join("\r\n ");
};

const hash = (value: string) => {
  let result = 5381;
  for (const char of value) result = (result * 33) ^ char.charCodeAt(0);
  return (result >>> 0).toString(16);
};

export const toICS = (event: CalendarEvent, now = new Date()) => {
  const end = addHours(event.start, 1);
  const stamp = event.timeZone ? utcStamp : floatingStamp;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sirlisko//Countdown//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${hash(event.url)}@${DOMAIN}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(end)}`,
    ...(event.yearly ? ["RRULE:FREQ=YEARLY"] : []),
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(`Countdown: ${event.url}`)}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
};

export const toGoogleCalendarUrl = (event: CalendarEvent) => {
  const end = addHours(event.start, 1);
  const stamp = (date: Date) =>
    event.timeZone ? zonedStamp(date, event.timeZone) : floatingStamp(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${stamp(event.start)}/${stamp(end)}`,
    details: `Countdown: ${event.url}`,
  });
  if (event.timeZone) params.set("ctz", event.timeZone);
  if (event.yearly) params.set("recur", "RRULE:FREQ=YEARLY");
  return `https://calendar.google.com/calendar/render?${params}`;
};

export const downloadICS = (event: CalendarEvent) => {
  const blob = new Blob([toICS(event)], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^\w-]+/g, "-").toLowerCase() || "countdown"}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
};
