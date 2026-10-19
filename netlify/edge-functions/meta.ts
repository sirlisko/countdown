import type { Config, Context } from "@netlify/edge-functions";
import { formatTarget, readSharedCountdown } from "../lib/countdown.ts";

const DEFAULT_DESCRIPTION =
  "Create a countdown (or count-up) to any moment and share it as a link. No account, nothing stored on a server.";

const escapeHtml = (value: string) =>
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
    : "Countdown – share a countdown to any moment";
  const description = countdown
    ? `${countdown.yearly ? "Every year. Next " : ""}T-0: ${formatTarget(countdown)}`
    : DEFAULT_DESCRIPTION;
  const image = new URL("/og", url.origin);
  if (countdown) image.search = url.search;
  // Mirrors what the /og card renders
  const imageAlt = countdown
    ? `${countdown.message ?? "How much time left?"}, T-0: ${formatTarget(countdown)}`
    : "How much time left? countdown.sirlisko.com";

  const tags = [
    ["og:type", "website"],
    ["og:site_name", "Countdown"],
    ["og:url", url.href],
    ["og:title", title],
    ["og:description", description],
    ["og:image", image.href],
    ["og:image:width", "1200"],
    ["og:image:height", "630"],
    ["og:image:alt", imageAlt],
    ["twitter:card", "summary_large_image"],
    ["twitter:title", title],
    ["twitter:description", description],
    ["twitter:image", image.href],
    ["twitter:image:alt", imageAlt],
  ]
    .map(
      ([key, content]) =>
        `<meta ${key.startsWith("og:") ? "property" : "name"}="${key}" content="${escapeHtml(content)}" />`,
    )
    .join("\n  ");
  // Shared countdowns are one-off pages, only the landing page is canonical
  const canonical =
    url.pathname === "/" && !countdown
      ? `\n  <link rel="canonical" href="${url.origin}/" />`
      : "";

  const html = (await response.text()).replace("<!--og-->", tags + canonical);
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
    "/stats/*",
    "/favicon.svg",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
    "/manifest.json",
    "/robots.txt",
  ],
};
