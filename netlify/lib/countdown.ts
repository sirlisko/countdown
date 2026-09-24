export interface SharedCountdown {
  message?: string;
  target: Date;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const readSharedCountdown = (
  params: URLSearchParams,
): SharedCountdown | undefined => {
  const t = params.get("t");
  if (!t) return undefined;
  const target = new Date(t);
  if (Number.isNaN(target.getTime())) return undefined;
  return { message: params.get("m") || undefined, target };
};

const pad = (value: number) => value.toString().padStart(2, "0");

// Targets are stored as floating wall-clock times encoded as UTC, so the UTC
// fields are what the creator typed
export const formatTarget = (target: Date) =>
  `${DAYS[target.getUTCDay()]} ${pad(target.getUTCDate())} ${
    MONTHS[target.getUTCMonth()]
  } ${target.getUTCFullYear().toString().padStart(4, "0")} · ${pad(
    target.getUTCHours(),
  )}:${pad(target.getUTCMinutes())}`.toUpperCase();
