interface UmamiPayload {
  url?: string;
  referrer?: string;
  title?: string;
}

// A countdown lives in its URL, so only the option names leave the browser:
// `/?m=Wedding&t=…&r=y` becomes `/?m&r&t`, and obfuscated paths, which are
// the same details in base64, become `/hidden`
const scrub = (value: string | undefined, origin: string) => {
  if (!value) return value;
  let url: URL;
  try {
    url = new URL(value, origin);
  } catch {
    return value;
  }
  if (url.origin !== origin) return value;

  const keys = [...new Set(url.searchParams.keys())].sort();
  const path =
    url.pathname !== "/"
      ? "/hidden"
      : keys.length
        ? `/?${keys.join("&")}`
        : "/";
  return value.startsWith("/") ? path : `${origin}${path}`;
};

export const scrubAnalytics = <T extends UmamiPayload>(
  payload: T,
  origin = window.location.origin,
): T => ({
  ...payload,
  url: scrub(payload.url, origin),
  referrer: scrub(payload.referrer, origin),
  // The tab title carries the message
  title: "Countdown",
});
