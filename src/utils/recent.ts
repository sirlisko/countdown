export interface RecentCountdown {
  href: string;
  message?: string;
  then: string;
}

const KEY = "countdown-recent";
const LIMIT = 8;

const isRecent = (value: unknown): value is RecentCountdown =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as RecentCountdown).href === "string" &&
  typeof (value as RecentCountdown).then === "string";

// Storage can throw in private modes or hold anything, so both sides are guarded
export const readRecent = (): RecentCountdown[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isRecent) : [];
  } catch {
    return [];
  }
};

const write = (list: RecentCountdown[]) => {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list));
    else localStorage.removeItem(KEY);
  } catch {}
  return list;
};

export const rememberCountdown = (entry: RecentCountdown) =>
  write(
    [entry, ...readRecent().filter(({ href }) => href !== entry.href)].slice(
      0,
      LIMIT,
    ),
  );

export const clearRecent = () => write([]);
