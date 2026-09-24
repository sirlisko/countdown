export interface SharedCountdown {
  message?: string;
  target: Date;
  timeZone?: string;
  yearly: boolean;
}

const isValidTimeZone = (timeZone: string) => {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

export const readSharedCountdown = (
  params: URLSearchParams,
): SharedCountdown | undefined => {
  const t = params.get("t");
  if (!t) return undefined;
  let target = new Date(t);
  if (Number.isNaN(target.getTime())) return undefined;
  const yearly = params.get("r") === "y";
  // UTC year steps can be an hour off across DST, fine for a preview
  while (yearly && target.getTime() <= Date.now()) {
    target = new Date(target);
    target.setUTCFullYear(target.getUTCFullYear() + 1);
  }
  const z = params.get("z");
  return {
    message: params.get("m") || undefined,
    target,
    yearly,
    timeZone: z ? (isValidTimeZone(z) ? z : "UTC") : undefined,
  };
};

// Floating links (no `z`) store the creator's wall-clock time as UTC fields
export const formatTarget = ({ target, timeZone }: SharedCountdown) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone ?? "UTC",
      hourCycle: "h23",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...(timeZone && { timeZoneName: "short" }),
    })
      .formatToParts(target)
      .map(({ type, value }) => [type, value]),
  );
  const zone = parts.timeZoneName ? ` ${parts.timeZoneName}` : "";
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year.padStart(4, "0")} · ${parts.hour}:${parts.minute}${zone}`.toUpperCase();
};
