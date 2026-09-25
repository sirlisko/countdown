import type { Config, Context } from "@netlify/edge-functions";
import { formatTarget, readSharedCountdown } from "../lib/countdown.ts";

const DEFAULT_DESCRIPTION =
  "Create customizable countdowns with ease. Track both future and past events with dynamic titles and flexible options.";

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

export default async (request: Request, context: Context) => {
  const response = await context.next();
  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const url = new URL(request.url);
  // Obfuscated links (base64 path) deliberately get the generic preview
  const countdown =
    url.pathname === "/" ? readSharedCountdown(url.searchParams) : undefined;
  const title = countdown?.message
    ? `${countdown.message} - Countdown`
    : "Countdown by sirlisko";
  const description = countdown
    ? `${countdown.yearly ? "Every year. Next " : ""}T-0: ${formatTarget(countdown)}`
    : DEFAULT_DESCRIPTION;
  const image = new URL("/og", url.origin);
  if (countdown) image.search = url.search;

  const tags = [
    ["og:type", "website"],
    ["og:url", url.href],
    ["og:title", title],
    ["og:description", description],
    ["og:image", image.href],
    ["og:image:width", "1200"],
    ["og:image:height", "630"],
    ["twitter:card", "summary_large_image"],
    ["twitter:title", title],
    ["twitter:description", description],
    ["twitter:image", image.href],
  ]
    .map(
      ([key, content]) =>
        `<meta ${key.startsWith("og:") ? "property" : "name"}="${key}" content="${escape(content)}" />`,
    )
    .join("\n  ");

  const html = (await response.text()).replace("<!--og-->", tags);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, headers });
};

export const config: Config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/og",
    "/og/*",
    "/js/*",
    "/api/*",
    "/favicon.svg",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/manifest.json",
    "/robots.txt",
  ],
};
